'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { FaChevronDown, FaEdit, FaPlus, FaUsers } from "react-icons/fa";
import { X } from "lucide-react";
import { getSession } from "next-auth/react";

import type { Contact, Profile, CardLayer, NbcardSavedCard } from "@/lib/utils";
import { defaultProfile, getNbcardSavedNamespace, upsertNbcardSavedCard, loadNbcardSavedCards, deleteNbcardSavedCard } from "@/lib/utils";
import { generateProfileId, getCategoryFromProfile } from "@/lib/nbcard-saved-cards";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  createLayerHistory,
  pushHistory,
  undo as undoHistory,
  redo as redoHistory,
  canUndo,
  canRedo,
  createTextLayer as leCreateTextLayer,
  createAvatarLayer,
  createShapeLayer,
  createQrLayer,
  updateLayer as leUpdateLayer,
  deleteLayer as leDeleteLayer,
  duplicateLayer,
  bringLayerForward,
  sendLayerBackward,
  bringLayerToFront,
  sendLayerToBack,
  alignLayersLeft,
  alignLayersCenter,
  alignLayersRight,
  alignLayersTop,
  alignLayersMiddle,
  alignLayersBottom,
  clearLayers as leClearLayers,
  resetLayers as leResetLayers,
  type LayerHistory,
} from "@/lib/nb-card/layer-editor";
import { EditorToolbar, LayersPanel } from "./EditorToolbar";

import { exportNbcardLocalState, loadNbcardLocalState, saveNbcardLocalState } from "@/app/contact/lib/nbcard-storage";
import { getProfileShareUrl } from "@/app/contact/lib/nbcard-share";
import { ContactCapture } from "@/app/contact/components/contact-capture";
import { ProfileCard } from "@/app/contact/components/profile-card";
import { ProfileManager } from "@/app/contact/components/profile-manager";
import { ShareButtons } from "@/app/contact/components/share-buttons";
import { TemplatePicker } from "@/app/contact/components/template-picker";
import { type TemplateSelection, loadTemplateSelection, saveTemplateSelection, loadTemplateManifest, getTemplateById, type Template } from "@/lib/nbcard-templates";
import { WelcomeModal } from "./WelcomeModal";
import { DataControlsCenter } from "./DataControlsCenter";
import { HelpButton } from "./HelpButton";
import { getExampleCardPreset, resetOnboarding } from "@/lib/nb-card/onboarding";
import { Button } from "@/components/ui/button";
import { fullSync, type SyncStatus } from "@/lib/nb-card/sync";
import { RefreshCw, Cloud, CloudOff } from "lucide-react";

const SIGN_IN_CALLOUT_DISMISSED_KEY = "nb-card:sign_in_callout_dismissed";

const SOCIAL_PLACEHOLDER_VALUES = new Set([
  "https://instagram.com/username",
  "https://facebook.com/username",
  "https://tiktok.com/username",
  "https://linkedin.com/username",
  "https://twitter.com/username",
  "https://website.com/username",
]);

function sanitizeSocialUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (SOCIAL_PLACEHOLDER_VALUES.has(trimmed)) return undefined;
  return trimmed;
}

function sanitizeProfile(profile: Profile): Profile {
  const social = profile.socialMedia || {};

  return {
    ...profile,
    socialMedia: {
      instagram: sanitizeSocialUrl(social.instagram),
      facebook: sanitizeSocialUrl(social.tiktok),
      linkedin: sanitizeSocialUrl(social.linkedin),
      twitter: sanitizeSocialUrl(social.twitter),
    },
  };
}

function detectStandalone(): boolean {
  if (typeof window === "undefined") return false;

  const nav = window.navigator as Navigator & { standalone?: boolean };
  const mediaStandalone = window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
  const iosStandalone = nav.standalone === true;
  return mediaStandalone || iosStandalone;
}

/**
 * Apply a form field update from a layer's fieldLink dot-path key.
 * e.g. fieldLink="bankCard.bankName" sets profile.bankCard.bankName = value.
 * Pure function — returns a new Profile with the field updated.
 */
function applyFieldLinkUpdate(profile: Profile, fieldLink: string, value: string): Profile {
  const dotIdx = fieldLink.indexOf(".");
  if (dotIdx < 0) {
    // Top-level profile field (e.g. "fullName", "email")
    return { ...profile, [fieldLink]: value } as Profile;
  }
  const category = fieldLink.slice(0, dotIdx);
  const field = fieldLink.slice(dotIdx + 1);
  if (category === "bankCard") {
    return { ...profile, bankCard: { ...(profile.bankCard ?? {}), [field]: value } } as Profile;
  }
  if (category === "addressCard") {
    return { ...profile, addressCard: { ...(profile.addressCard ?? {}), [field]: value } } as Profile;
  }
  if (category === "businessCard") {
    return { ...profile, businessCard: { ...(profile.businessCard ?? {}), [field]: value } } as Profile;
  }
  if (category === "flyerCard") {
    return { ...profile, flyerCard: { ...(profile.flyerCard ?? {}), [field]: value } } as Profile;
  }
  if (category === "weddingCard") {
    return { ...profile, weddingCard: { ...(profile.weddingCard ?? {}), [field]: value } } as Profile;
  }
  return profile;
}

export function NBCardPanel() {
  const [mounted, setMounted] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([defaultProfile]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [hasPersistedCards, setHasPersistedCards] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [templateSelection, setTemplateSelection] = useState<TemplateSelection>({});
  const [pendingTemplateSelection, setPendingTemplateSelection] = useState<TemplateSelection | null>(null);
  const [signInCalloutDismissed, setSignInCalloutDismissed] = useState(true); // default hidden until mount check
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>(undefined);
  const [currentBusinessSide, setCurrentBusinessSide] = useState<'front' | 'back'>('front');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [showSyncPrompt, setShowSyncPrompt] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Pro Editor: Undo/Redo History (initialized with defaultProfile, synced via useEffect)
  const [history, setHistory] = useState<LayerHistory>(() =>
    createLayerHistory(defaultProfile)
  );

  // Pro Editor: Zoom & Grid
  const [zoom, setZoom] = useState(1);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  
  const [deviceId] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      let id = localStorage.getItem('nb-card:device-id');
      if (!id) {
        id = `device-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        localStorage.setItem('nb-card:device-id', id);
      }
      return id;
    } catch {
      return `device-${Date.now()}`;
    }
  });
  
  // Initial layers snapshot per profile — used by resetLayers()
  const initialLayersByProfileRef = useRef<Record<string, import("@/lib/utils").CardLayer[]>>({});
  // Debounce timer for layers-specific localStorage write
  const layersLsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Free Layout Editor state (lifted from TemplatePicker)
  const [layoutEditMode, setLayoutEditMode] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // Save As dialog for named layouts
  const [showSaveAsDialog, setShowSaveAsDialog] = useState(false);
  const [saveAsName, setSaveAsName] = useState('');
  const [autosaveIndicator, setAutosaveIndicator] = useState(false);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Phase 2: Card Details panel (canvas-only cards)
  const [showCardDetails, setShowCardDetails] = useState(false);

  // Phase 4: Saved Layouts list
  const [showSavedLayouts, setShowSavedLayouts] = useState(false);
  
  // Canvas Edit Mode - inline editing on the canvas preview
  const [canvasEditMode, setCanvasEditMode] = useState(() => {
    try {
      return localStorage.getItem('nb-card:canvas-edit-mode') === '1';
    } catch {
      return false;
    }
  });

  // Load template when templateSelection changes
  useEffect(() => {
    if (!templateSelection?.backgroundId) {
      setSelectedTemplate(undefined);
      return;
    }
    
    let cancelled = false;
    loadTemplateManifest()
      .then((manifest) => {
        if (cancelled) return;
        const template = getTemplateById(manifest.templates, templateSelection.backgroundId!);
        setSelectedTemplate(template ?? undefined);
      })
      .catch(() => {
        if (!cancelled) setSelectedTemplate(undefined);
      });
    
    return () => { cancelled = true; };
  }, [templateSelection?.backgroundId]);

  // Determine if current template is a business card with front/back
  const isBusinessCard = selectedTemplate?.cardCategory === 'BUSINESS' && selectedTemplate?.side !== undefined;
  
  // Get companion template (front ↔ back)
  const getCompanionTemplateId = (currentId: string, currentSide: 'front' | 'back'): string | undefined => {
    const targetSide = currentSide === 'front' ? 'back' : 'front';
    // Assumes naming convention: business-01-front ↔ business-01-back
    return currentId.replace(`-${currentSide}`, `-${targetSide}`);
  };

  const handleBusinessSideToggle = (side: 'front' | 'back') => {
    if (!selectedTemplate || !isBusinessCard) return;
    
    const companionId = getCompanionTemplateId(templateSelection.backgroundId!, side === 'front' ? 'back' : 'front');
    if (!companionId) return;
    
    setCurrentBusinessSide(side);
    setTemplateSelection({
      ...templateSelection,
      backgroundId: companionId,
    });
  };

  const handleDismissSignInCallout = useCallback(() => {
    setSignInCalloutDismissed(true);
    try {
      localStorage.setItem(SIGN_IN_CALLOUT_DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getSession()
      .then((s) => {
        if (cancelled) return;
        const email = (s?.user?.email ?? "").toString().trim().toLowerCase();
        const newEmail = email && email.includes("@") ? email : null;
        
        // Detect sign-in: if we just got an email and we have local profiles, offer import
        if (newEmail && !sessionEmail && profiles.length > 0 && profiles[0].id !== defaultProfile.id) {
          setShowSyncPrompt(true);
        }
        
        setSessionEmail(newEmail);
      })
      .catch(() => {
        // ignore
      });
    return () => {
      cancelled = true;
    };
  }, [sessionEmail, profiles]);

  // Load NBCard state + register SW
  useEffect(() => {
    let cancelled = false;
    setMounted(true);

    // Check if sign-in callout was previously dismissed
    try {
      setSignInCalloutDismissed(localStorage.getItem(SIGN_IN_CALLOUT_DISMISSED_KEY) === "1");
    } catch {
      setSignInCalloutDismissed(false);
    }

    (async () => {
      // Determine if there are any persisted cards (avoid counting fallback defaults)
      try {
        const exported = await exportNbcardLocalState();
        if (!cancelled) setHasPersistedCards(Array.isArray(exported.profiles) && exported.profiles.length > 0);
      } catch {
        // ignore
      }

      const state = await loadNbcardLocalState([defaultProfile], []);
      if (cancelled) return;
      const sanitizedProfiles = state.profiles.map(sanitizeProfile);
      setProfiles(sanitizedProfiles);
      setContacts(state.contacts);

      // Snapshot initial layers for reset() — captured once at session start
      sanitizedProfiles.forEach((p) => {
        initialLayersByProfileRef.current[p.id] = p.layers || [];
      });

      // Load template selection for the first profile
      const savedTemplateSelection = loadTemplateSelection(sanitizedProfiles[0]?.id);
      if (savedTemplateSelection) {
        setTemplateSelection(savedTemplateSelection);
      }

      // Support deep-linking to a specific profile via ?profile=<id>
      try {
        const params = new URLSearchParams(window.location.search);
        const profileId = params.get("profile");
        if (profileId) {
          const index = sanitizedProfiles.findIndex((p) => p.id === profileId);
          if (index >= 0) {
            setCurrentProfileIndex(index);
            // Load template selection for the linked profile
            const linkedTemplateSelection = loadTemplateSelection(sanitizedProfiles[index]?.id);
            if (linkedTemplateSelection) {
              setTemplateSelection(linkedTemplateSelection);
            }
          }
        }
      } catch {
        // ignore
      }

      // Register NBCard service worker (offline-friendly)
      try {
        if ("serviceWorker" in navigator) {
          // Keep NB-Card SW strictly scoped so it cannot control the full site origin.
          await navigator.serviceWorker.register("/nbcard-sw.js", { scope: "/resources/nb-card/" });
        }
      } catch {
        // Don't block page; SW is best-effort
      }
    })().catch((e) => console.error("Failed to load NBCard state", e));

    const updateInstalled = () => setIsInstalled(detectStandalone());
    updateInstalled();

    const media = window.matchMedia?.("(display-mode: standalone)");
    const onDisplayModeChange = () => updateInstalled();

    if (media?.addEventListener) {
      media.addEventListener("change", onDisplayModeChange);
    } else if (media && "addListener" in media) {
      // Safari fallback
      media.addListener(onDisplayModeChange);
    }

    window.addEventListener("appinstalled", updateInstalled);

    return () => {
      cancelled = true;
      window.removeEventListener("appinstalled", updateInstalled);

      if (media?.removeEventListener) {
        media.removeEventListener("change", onDisplayModeChange);
      } else if (media && "removeListener" in media) {
        media.removeListener(onDisplayModeChange);
      }
    };
  }, []);

  // Persist profiles + contacts (local-first)
  useEffect(() => {
    if (mounted) {
      saveNbcardLocalState({ profiles, contacts })
        .then(() => setHasPersistedCards(true))
        .catch((e) => console.error("Failed to persist NBCard state", e));
    }
  }, [profiles, contacts, mounted]);

  // Debounced layers-only localStorage save (nb_free_layer_editor_layers_v1)
  useEffect(() => {
    if (!mounted) return;
    if (layersLsTimerRef.current) clearTimeout(layersLsTimerRef.current);
    const profileId = profiles[currentProfileIndex]?.id;
    const layers = profiles[currentProfileIndex]?.layers ?? [];
    layersLsTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(
          "nb_free_layer_editor_layers_v1",
          JSON.stringify({ profileId, layers })
        );
      } catch { /* ignore */ }
      // Flash autosave indicator for 2s
      setAutosaveIndicator(true);
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = setTimeout(() => setAutosaveIndicator(false), 2000);
    }, 300);
    return () => {
      if (layersLsTimerRef.current) clearTimeout(layersLsTimerRef.current);
    };
  }, [profiles, currentProfileIndex, mounted]);

  const currentProfile = useMemo(() => profiles?.[currentProfileIndex] ?? defaultProfile, [profiles, currentProfileIndex]);

  // Sync history when current profile changes (e.g., via profile selector)
  useEffect(() => {
    setHistory(createLayerHistory(currentProfile));
  }, [currentProfile, currentProfileIndex]);

  // Persist template selection when it changes
  useEffect(() => {
    if (mounted && templateSelection) {
      saveTemplateSelection(templateSelection, currentProfile?.id);
    }
  }, [templateSelection, currentProfile?.id, mounted]);

  const handleSaveProfile = (profile: Profile) => {
    if (isNewProfile) {
      const id = profile.id && profile.id.trim().length > 0 ? profile.id : Date.now().toString();
      setProfiles([...profiles, { ...profile, id }]);
      setCurrentProfileIndex(profiles.length);

      // If this new profile was created from a template, persist that selection under the new id.
      if (pendingTemplateSelection) {
        const nextSelection: TemplateSelection = {
          ...pendingTemplateSelection,
          // Ensure we have a stable orientation saved.
          orientation: pendingTemplateSelection.orientation || 'landscape',
        };
        saveTemplateSelection(nextSelection, id);
        setTemplateSelection(nextSelection);
        setPendingTemplateSelection(null);
      }
    } else {
      const updated = profiles.map((p) => (p.id === profile.id ? profile : p));
      setProfiles(updated);
    }
    setShowProfileManager(false);
    setEditingProfile(null);
    setIsNewProfile(false);
  };

  const handleCreateFromTemplate = (template: Template) => {
    const inferredCategory = template.cardCategory
      ? template.cardCategory
      : template.id.startsWith("flyer_promo_")
        ? (/wedding/i.test(template.label) ? ("WEDDING" as const) : ("FLYER" as const))
        : undefined;

    const nextSelection: TemplateSelection = {
      backgroundId: template.id,
      overlayId: undefined,
      orientation: template.orientation,
      backgroundColor: templateSelection.backgroundColor,
    };

    // Apply immediately so the preview reflects the chosen template while editing.
    setTemplateSelection(nextSelection);

    setEditingProfile({
      id: "",
      fullName: "",
      jobTitle: "",
      phone: "",
      email: "",
      profileDescription: "",
      businessDescription: "",
      gradient: "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)",
      socialMedia: {},
      ...(inferredCategory === "ADDRESS"
        ? ({
            cardCategory: "ADDRESS" as const,
            addressCard: {},
          } as const)
        : {}),
      ...(inferredCategory === "BANK"
        ? ({
            cardCategory: "BANK" as const,
            bankCard: {},
          } as const)
        : {}),
      ...(inferredCategory === "BUSINESS"
        ? ({
            cardCategory: "BUSINESS" as const,
            businessCard: {},
          } as const)
        : {}),
      ...(inferredCategory === "FLYER"
        ? ({
            cardCategory: "FLYER" as const,
            flyerCard: {
              headline: "",
              subheadline: "",
              ctaText: "",
              ctaUrl: "",
            },
          } as const)
        : {}),
      ...(inferredCategory === "WEDDING"
        ? ({
            cardCategory: "WEDDING" as const,
            weddingCard: {
              headline: "",
              subheadline: "",
              ctaText: "",
              ctaUrl: "",
            },
          } as const)
        : {}),
    });

    setIsNewProfile(true);
    setPendingTemplateSelection(nextSelection);
    setShowProfileManager(true);

    toast.message("New card from template", {
      description: `Add your details and save to finish creating “${template.label}”.`,
    });
  };

  const handleDeleteProfile = () => {
    if (profiles.length === 1) {
      toast.error("Cannot delete the last profile");
      return;
    }
    if (confirm("Are you sure you want to delete this profile?")) {
      const updated = profiles.filter((p) => p.id !== currentProfile.id);
      setProfiles(updated);
      setCurrentProfileIndex(0);
      setShowProfileManager(false);
    }
  };

  const handleCreateNewProfile = () => {
    setEditingProfile({
      id: "",
      fullName: "",
      jobTitle: "",
      phone: "",
      email: "",
      profileDescription: "",
      businessDescription: "",
      gradient: "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)",
      socialMedia: {},
    });
    setIsNewProfile(true);
    setShowProfileManager(true);
  };

  const handleEditProfile = () => {
    setEditingProfile(currentProfile);
    setIsNewProfile(false);
    setShowProfileManager(true);
  };

  const handleUpsertContact = (contact: Contact) => {
    setContacts((prev) => {
      const idx = prev.findIndex((c) => c.id === contact.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = contact;
        return next;
      }
      return [...prev, contact];
    });
  };

  const handleDeleteContact = (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      setContacts(contacts.filter((c) => c.id !== id));
    }
  };

  const handleTemplateSelectionChange = (newSelection: TemplateSelection) => {
    setTemplateSelection(newSelection);
  };

  // Load template selection when profile changes
  useEffect(() => {
    if (mounted) {
      const savedSelection = loadTemplateSelection(currentProfile?.id);
      if (savedSelection) {
        setTemplateSelection(savedSelection);
      } else {
        setTemplateSelection({});
      }
    }
  }, [currentProfileIndex, currentProfile?.id, mounted]);

  // Onboarding handlers
  const handleCreateCard = () => {
    handleEditProfile();
  };

  const handleUseExample = () => {
    const example = getExampleCardPreset();
    const exampleProfile: Profile = {
      ...defaultProfile,
      ...example,
      id: Date.now().toString(),
    };
    setProfiles([exampleProfile]);
    setCurrentProfileIndex(0);
    toast.success("Example card loaded", {
      description: "Replace the example text with your own details.",
    });
  };

  // Data controls handlers
  const handleRestoreData = (restoredProfiles: Profile[], restoredContacts: Contact[]) => {
    setProfiles(restoredProfiles.length > 0 ? restoredProfiles : [defaultProfile]);
    setContacts(restoredContacts);
    setCurrentProfileIndex(0);
    setHasPersistedCards(restoredProfiles.length > 0);
  };

  const handleDeleteAll = async () => {
    // Reset onboarding so welcome appears again
    resetOnboarding();

    // Best-effort: clear localStorage keys used by NB-Card
    try {
      if (typeof window !== "undefined") {
        const keys = Object.keys(window.localStorage);
        for (const key of keys) {
          if (key.startsWith("nbcard") || key.startsWith("nb-card")) {
            window.localStorage.removeItem(key);
          }
        }
      }
    } catch {
      // ignore
    }

    // Best-effort: delete IndexedDB databases
    const deleteDb = (name: string) =>
      new Promise<void>((resolve) => {
        try {
          const req = indexedDB.deleteDatabase(name);
          req.onsuccess = () => resolve();
          req.onerror = () => resolve();
          req.onblocked = () => resolve();
        } catch {
          resolve();
        }
      });

    await Promise.all([deleteDb("nbcard"), deleteDb("nbcard-assets")]);

    // Reset in-memory state
    setProfiles([defaultProfile]);
    setContacts([]);
    setCurrentProfileIndex(0);
    setTemplateSelection({});
    setHasPersistedCards(false);
  };

  // Sync handlers (Phase 7)
  const handleSyncNow = async () => {
    if (!deviceId) {
      toast.error("Device ID not available");
      return;
    }
    
    setSyncStatus('syncing');
    try {
      const result = await fullSync(deviceId, profiles, contacts);
      if (result.success) {
        setProfiles(result.mergedProfiles);
        setContacts(result.mergedContacts);
        setLastSyncTime(new Date().toISOString());
        setSyncStatus('success');
        toast.success(`Synced ${result.mergedProfiles.length} profiles, ${result.mergedContacts.length} contacts`);
        setTimeout(() => setSyncStatus('idle'), 3000);
      } else {
        setSyncStatus('error');
        toast.error(`Sync failed: ${result.error}`);
        setTimeout(() => setSyncStatus('idle'), 5000);
      }
    } catch (error) {
      setSyncStatus('error');
      toast.error("Sync error");
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  };

  const handleImportLocalCards = async () => {
    setShowSyncPrompt(false);
    await handleSyncNow();
  };

  const handleSkipImport = () => {
    setShowSyncPrompt(false);
    toast.message("Skipped import", { description: "You can sync manually using the sync button." });
  };

  // Pro Editor: Undo/Redo handlers
  const handleUndo = useCallback(() => {
    const newHistory = undoHistory(history);
    setHistory(newHistory);
    setProfiles((prev) =>
      prev.map((p, idx) =>
        idx === currentProfileIndex ? newHistory.present : p
      )
    );
    toast.info("Undo");
  }, [history, currentProfileIndex]);

  const handleRedo = useCallback(() => {
    const newHistory = redoHistory(history);
    setHistory(newHistory);
    setProfiles((prev) =>
      prev.map((p, idx) =>
        idx === currentProfileIndex ? newHistory.present : p
      )
    );
    toast.info("Redo");
  }, [history,currentProfileIndex]);

  const commitToHistory = useCallback(
    (updatedProfile: Profile) => {
      setHistory((prev) => pushHistory(prev, updatedProfile));
    },
    []
  );

  // Pro Editor: Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.25));
  const handleZoomFit = () => setZoom(1);

  // Pro Editor: Grid/Snap toggles
  const handleToggleGrid = () => setGridEnabled((g) => !g);
  const handleToggleSnap = () => setSnapEnabled((s) => !s);

  // Pro Editor: Layer management
  const handleAddText = () => {
    const layer = leCreateTextLayer(10, 10, "Double-click to edit");
    const updatedProfile = {
      ...currentProfile,
      layers: [...(currentProfile.layers || []), layer],
    };
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
    setSelectedLayerId(layer.id);
    setLayoutEditMode(true);
    toast.success("Text layer added");
  };

  const handleAddShape = (kind: "rect" | "circle" | "line") => {
    const layer = createShapeLayer(10, 10, kind);
    const updatedProfile = {
      ...currentProfile,
      layers: [...(currentProfile.layers || []), layer],
    };
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
    setSelectedLayerId(layer.id);
    setLayoutEditMode(true);
    toast.success(`${kind.charAt(0).toUpperCase() + kind.slice(1)} added`);
  };

  const handleAddAvatar = () => {
    const layer = createAvatarLayer(10, 10, "");
    const updatedProfile = {
      ...currentProfile,
      layers: [...(currentProfile.layers || []), layer],
    };
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
    setSelectedLayerId(layer.id);
    setLayoutEditMode(true);
    toast.success("Avatar layer added. Click to upload image.");
  };

  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (evt: Event) => {
      const file = (evt.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        if (src) {
          const layer = createAvatarLayer(10, 10, src);
          // Type guard: layer is always AvatarLayer from createAvatarLayer
          const avatarLayer = layer as import("@/lib/utils").AvatarLayer;
          avatarLayer.style.borderRadius = 0;
          const updatedProfile = {
            ...currentProfile,
            layers: [...(currentProfile.layers || []), layer],
          };
          setProfiles((prev) =>
            prev.map((p, idx) =>
              idx === currentProfileIndex ? updatedProfile : p
            )
          );
          commitToHistory(updatedProfile);
          setSelectedLayerId(layer.id);
          setLayoutEditMode(true);
          toast.success("Image added");
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleAddQR = () => {
    const shareUrl = getProfileShareUrl(currentProfile.id);
    const layer = createQrLayer(10, 10, shareUrl);
    const updatedProfile = {
      ...currentProfile,
      layers: [...(currentProfile.layers || []), layer],
    };
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
    setSelectedLayerId(layer.id);
    setLayoutEditMode(true);
    toast.success("QR Code layer added");
  };

  const handleNudgeLayer = useCallback((direction: "up" | "down" | "left" | "right", fine: boolean) => {
    if (!selectedLayerId) return;
    const step = fine ? 0.25 : 1;
    const updatedProfile = {
      ...currentProfile,
      layers: (currentProfile.layers || []).map((l) => {
        if (l.id !== selectedLayerId) return l;
        return {
          ...l,
          x: direction === "left" ? Math.max(0, l.x - step) : direction === "right" ? Math.min(100, l.x + step) : l.x,
          y: direction === "up" ? Math.max(0, l.y - step) : direction === "down" ? Math.min(100, l.y + step) : l.y,
        };
      }),
    };
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
  }, [selectedLayerId, currentProfile, currentProfileIndex]);

  const handleDuplicateLayer = useCallback(() => {
    if (!selectedLayerId) return;
    const updatedProfile = duplicateLayer(currentProfile, selectedLayerId);
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
    const newLayer = updatedProfile.layers?.find(
      (l) => l.id !== selectedLayerId && l.x >= (currentProfile.layers?.find((l2) => l2.id === selectedLayerId)?.x ?? 0)
    );
    if (newLayer) setSelectedLayerId(newLayer.id);
    toast.success("Layer duplicated");
  }, [selectedLayerId, currentProfile, currentProfileIndex, commitToHistory]);

  const handleDeleteLayer = useCallback(() => {
    if (!selectedLayerId) return;
    if (!confirm("Delete this layer?")) return;
    const updatedProfile = leDeleteLayer(currentProfile, selectedLayerId);
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
    setSelectedLayerId(null);
    toast.success("Layer deleted");
  }, [selectedLayerId, currentProfile, currentProfileIndex, commitToHistory]);

  const handleToggleLayerLock = () => {
    if (!selectedLayerId) return;
    const layer = currentProfile.layers?.find((l) => l.id === selectedLayerId);
    if (!layer) return;
    const updatedProfile = leUpdateLayer(currentProfile, selectedLayerId, {
      locked: !layer.locked,
    });
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
  };

  const handleToggleLayerVisibility = () => {
    if (!selectedLayerId) return;
    const layer = currentProfile.layers?.find((l) => l.id === selectedLayerId);
    if (!layer) return;
    const updatedProfile = leUpdateLayer(currentProfile, selectedLayerId, {
      visible: !layer.visible,
    });
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
  };

  const handleBringForward = () => {
    if (!selectedLayerId) return;
    const updatedProfile = bringLayerForward(currentProfile, selectedLayerId);
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
    toast.success("Brought forward");
  };

  const handleSendBackward = () => {
    if (!selectedLayerId) return;
    const updatedProfile = sendLayerBackward(currentProfile, selectedLayerId);
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
    toast.success("Sent backward");
  };

  const handleBringToFront = () => {
    if (!selectedLayerId) return;
    const updatedProfile = bringLayerToFront(currentProfile, selectedLayerId);
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
    toast.success("Brought to front");
  };

  const handleSendToBack = () => {
    if (!selectedLayerId) return;
    const updatedProfile = sendLayerToBack(currentProfile, selectedLayerId);
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
    toast.success("Sent to back");
  };

  const handleAvatarUploadFromInspector = useCallback((layerId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (evt: Event) => {
      const file = (evt.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        if (!src) return;
        const updatedProfile = {
          ...currentProfile,
          layers: (currentProfile.layers || []).map((l) =>
            l.id === layerId && l.type === "avatar"
              ? { ...l, style: { ...l.style, src } }
              : l
          ),
        };
        setProfiles((prev) =>
          prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
        );
        commitToHistory(updatedProfile);
        toast.success("Image updated");
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [currentProfile, currentProfileIndex, commitToHistory]);

  const handleAlign = (
    direction: "left" | "center" | "right" | "top" | "middle" | "bottom"
  ) => {
    if (!selectedLayerId) return;
    let updatedProfile = currentProfile;

    switch (direction) {
      case "left":
        updatedProfile = alignLayersLeft(currentProfile, [selectedLayerId]);
        break;
      case "center":
        updatedProfile = alignLayersCenter(currentProfile, [selectedLayerId]);
        break;
      case "right":
        updatedProfile = alignLayersRight(currentProfile, [selectedLayerId]);
        break;
      case "top":
        updatedProfile = alignLayersTop(currentProfile, [selectedLayerId]);
        break;
      case "middle":
        updatedProfile = alignLayersMiddle(currentProfile, [selectedLayerId]);
        break;
      case "bottom":
        updatedProfile = alignLayersBottom(currentProfile, [selectedLayerId]);
        break;
    }

    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
    toast.success(`Aligned ${direction}`);
  };

  const handleReorderLayers = (newOrder: CardLayer[]) => {
    const updatedProfile = { ...currentProfile, layers: newOrder };
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
  };

  const handleToggleLayerVisibilityById = (layerId: string) => {
    const layer = currentProfile.layers?.find((l) => l.id === layerId);
    if (!layer) return;
    const updatedProfile = leUpdateLayer(currentProfile, layerId, {
      visible: !layer.visible,
    });
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
  };

  const handleToggleLayerLockById = (layerId: string) => {
    const layer = currentProfile.layers?.find((l) => l.id === layerId);
    if (!layer) return;
    const updatedProfile = leUpdateLayer(currentProfile, layerId, {
      locked: !layer.locked,
    });
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
  };

  // ─── Function-name contract (spec requirement) ───────────────────────────

  /** applyLayersToCanvas: apply a layers array to the live canvas instantly. */
  const applyLayersToCanvas = useCallback((layers: CardLayer[]) => {
    const updatedProfile = { ...currentProfile, layers };
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
  }, [currentProfile, currentProfileIndex]);

  /** createTextLayer: factory wrapper with spec signature. */
  const createTextLayer = useCallback((text?: string): CardLayer =>
    leCreateTextLayer(10, 10, text ?? "New text"),
  []);

  /** addLayer: add a layer to the canvas instantly. */
  const addLayer = useCallback((layer: CardLayer): void => {
    const layers = [...(currentProfile.layers || []), layer];
    applyLayersToCanvas(layers);
    commitToHistory({ ...currentProfile, layers });
  }, [currentProfile, applyLayersToCanvas, commitToHistory]);

  /** updateLayer: patch a layer by id and update canvas instantly. */
  const _updateLayer = useCallback((layerId: string, patch: Partial<CardLayer>): void => {
    const updatedProfile = leUpdateLayer(currentProfile, layerId, patch);
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
  }, [currentProfile, currentProfileIndex]);

  /** deleteLayer: remove a layer by id and update canvas instantly. */
  const deleteLayer = useCallback((layerId: string): void => {
    const updatedProfile = leDeleteLayer(currentProfile, layerId);
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
    if (selectedLayerId === layerId) setSelectedLayerId(null);
  }, [currentProfile, currentProfileIndex, commitToHistory, selectedLayerId]);

  /** reorderLayers: move layer from one index to another and update canvas. */
  const _reorderLayers = useCallback((fromIndex: number, toIndex: number): void => {
    const arr = [...(currentProfile.layers || [])];
    const [item] = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, item);
    applyLayersToCanvas(arr);
  }, [currentProfile, applyLayersToCanvas]);

  /** resetLayers: restore initial session snapshot for this profile. */
  const resetLayers = useCallback((): void => {
    const initial = initialLayersByProfileRef.current[currentProfile.id] ?? [];
    const updatedProfile = leResetLayers(currentProfile, initial);
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
    toast.info("Layers reset to defaults");
  }, [currentProfile, currentProfileIndex, commitToHistory]);

  /** clearLayers: remove all layers and clear canvas instantly. */
  const clearLayers = useCallback((): void => {
    if (!confirm("Remove all layers from the canvas?")) return;
    const updatedProfile = leClearLayers(currentProfile);
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
    setSelectedLayerId(null);
    toast.info("All layers cleared");
  }, [currentProfile, currentProfileIndex, commitToHistory]);

  // Layer text edit handlers (Layers panel inline edit)

  /** Instant canvas update on every keystroke — no history commit yet.
   *  If the layer has a fieldLink, also updates the linked profile form field. */
  const handleUpdateLayerText = useCallback((layerId: string, text: string): void => {
    setProfiles((prev) =>
      prev.map((p, idx) => {
        if (idx !== currentProfileIndex) return p;
        // Detect fieldLink on the target layer before mutating
        const targetLayer = (p.layers || []).find((l) => l.id === layerId);
        const fieldLink = (targetLayer && targetLayer.type === "text")
          ? targetLayer.fieldLink
          : undefined;
        const updatedLayers = (p.layers || []).map((l) =>
          l.id === layerId && l.type === "text"
            ? ({ ...l, style: { ...l.style, content: text } } as CardLayer)
            : l
        );
        const next: Profile = { ...p, layers: updatedLayers };
        // Bidirectional sync: update the linked form field when present
        if (fieldLink) return applyFieldLinkUpdate(next, fieldLink, text);
        return next;
      })
    );
  }, [currentProfileIndex]);

  /** Commit text edit to history when editing ends (blur / Enter). */
  const handleCommitLayerTextEdit = useCallback((): void => {
    commitToHistory(currentProfile);
  }, [currentProfile, commitToHistory]);

  /** Set (or clear) a fieldLink on a text layer so edits sync back to a form field. */
  const handleSetFieldLink = useCallback((layerId: string, fieldLink: string | undefined): void => {
    const updatedLayers = (currentProfile.layers || []).map((l) => {
      if (l.id !== layerId || l.type !== "text") return l;
      return { ...l, fieldLink } as CardLayer;
    });
    const updatedProfile = { ...currentProfile, layers: updatedLayers };
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
  }, [currentProfile, currentProfileIndex, commitToHistory]);

  /** Available field links for the current profile category, shown in the Layers panel. */
  const availableFieldLinks = useMemo((): Array<{ key: string; label: string }> => {
    const category = getCategoryFromProfile(currentProfile);
    const fields: Array<{ key: string; label: string }> = [
      { key: "fullName", label: "Full Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "jobTitle", label: "Job Title" },
      { key: "website", label: "Website" },
    ];
    if (category === "BANK") {
      fields.push(
        { key: "bankCard.accountName", label: "Account Name" },
        { key: "bankCard.bankName", label: "Bank Name" },
        { key: "bankCard.sortCode", label: "Sort Code" },
        { key: "bankCard.accountNumber", label: "Account Number" },
        { key: "bankCard.iban", label: "IBAN" },
        { key: "bankCard.swiftBic", label: "SWIFT/BIC" },
      );
    }
    if (category === "ADDRESS") {
      fields.push(
        { key: "addressCard.addressLine1", label: "Address Line 1" },
        { key: "addressCard.addressLine2", label: "Address Line 2" },
        { key: "addressCard.city", label: "City" },
        { key: "addressCard.postcode", label: "Postcode" },
        { key: "addressCard.country", label: "Country" },
      );
    }
    if (category === "BUSINESS") {
      fields.push(
        { key: "businessCard.companyName", label: "Company Name" },
        { key: "businessCard.tagline", label: "Tagline" },
        { key: "businessCard.websiteUrl", label: "Website URL" },
        { key: "businessCard.services", label: "Services" },
      );
    }
    if (category === "FLYER") {
      fields.push(
        { key: "flyerCard.headline", label: "Headline" },
        { key: "flyerCard.subheadline", label: "Subheadline" },
      );
    }
    if (category === "WEDDING") {
      fields.push(
        { key: "weddingCard.headline", label: "Headline" },
        { key: "weddingCard.subheadline", label: "Subheadline" },
      );
    }
    return fields;
  }, [currentProfile]);

  /** Save current canvas layers as a named card in the saved-cards store. */
  const handleSaveAsLayout = useCallback(() => {
    const name = saveAsName.trim() || `Layout — ${new Date().toLocaleDateString()}`;
    const namespace = getNbcardSavedNamespace(sessionEmail ?? undefined);
    const id = generateProfileId();
    const category = getCategoryFromProfile(currentProfile);
    const record: NbcardSavedCard = {
      id,
      title: name,
      category,
      snapshot: { ...currentProfile, id },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    upsertNbcardSavedCard(namespace, record);
    setShowSaveAsDialog(false);
    setSaveAsName('');
    toast.success(`Saved as "${name}"`);
  }, [saveAsName, sessionEmail, currentProfile]);

  /** Add a text layer from the Layers panel (custom text). */
  const handleAddTextFromPanel = useCallback((text?: string): void => {
    const layer = createTextLayer(text);
    addLayer(layer);
    setSelectedLayerId(layer.id);
    setLayoutEditMode(true);
  }, [createTextLayer, addLayer]);

  // ─────────────────────────────────────────────────────────────────────────

  // Keyboard shortcuts for pro editor
  useEffect(() => {
    if (!layoutEditMode && !canvasEditMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with typing in input fields
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || 
                       target.tagName === 'TEXTAREA' || 
                       target.isContentEditable;
      
      // Undo: Ctrl+Z / Cmd+Z (works even when typing)
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }
      // Redo: Ctrl+Y / Cmd+Shift+Z (works even when typing)
      if (
        ((e.ctrlKey || e.metaKey) && e.key === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        handleRedo();
        return;
      }
      
      // Skip other shortcuts if user is typing
      if (isTyping) return;
      
      // Delete selected layer: Delete / Backspace
      if (selectedLayerId && (e.key === "Delete" || e.key === "Backspace")) {
        e.preventDefault();
        handleDeleteLayer();
      }
      // Duplicate: Ctrl+D / Cmd+D
      if (selectedLayerId && (e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        handleDuplicateLayer();
      }
      // Arrow nudge: 1% per press, 0.25% with Shift
      if (selectedLayerId && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const fine = e.shiftKey;
        if (e.key === "ArrowUp") handleNudgeLayer("up", fine);
        if (e.key === "ArrowDown") handleNudgeLayer("down", fine);
        if (e.key === "ArrowLeft") handleNudgeLayer("left", fine);
        if (e.key === "ArrowRight") handleNudgeLayer("right", fine);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    layoutEditMode,
    canvasEditMode,
    selectedLayerId,
    handleUndo,
    handleRedo,
    handleDeleteLayer,
    handleDuplicateLayer,
    handleNudgeLayer,
  ]);

  const selectedLayer =
    currentProfile.layers?.find((l) => l.id === selectedLayerId) || null;

  // Phase 2: detect canvas-only card (has layers but no form fields)
  const hasProfileFormData = !!(
    currentProfile.fullName?.trim() || currentProfile.phone?.trim() ||
    currentProfile.email?.trim() || currentProfile.jobTitle?.trim() ||
    currentProfile.website?.trim()
  );
  const isCanvasOnly = !hasProfileFormData && (currentProfile.layers?.length ?? 0) > 0;

  // Phase 2: auto-fill Card Details from text layer content
  const autoFillFromLayers = useCallback(() => {
    const textContents = (currentProfile.layers || [])
      .filter((l) => l.type === "text")
      .map((l) => (l.type === "text" ? l.style.content : ""));

    const emailMatch = textContents.join("\n").match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = textContents.join("\n").match(/(\+?[\d\s\-().]{7,})/);
    const urlMatch = textContents.join("\n").match(/https?:\/\/[^\s]+/);

    const patch: Partial<Profile> = {};
    if (emailMatch && !currentProfile.email) patch.email = emailMatch[0];
    if (phoneMatch && !currentProfile.phone) patch.phone = phoneMatch[0].trim();
    if (urlMatch && !currentProfile.website) patch.website = urlMatch[0];

    if (Object.keys(patch).length === 0) {
      toast.info("No contact info found in text layers");
      return;
    }
    const updatedProfile = { ...currentProfile, ...patch };
    setProfiles((prev) =>
      prev.map((p, idx) => (idx === currentProfileIndex ? updatedProfile : p))
    );
    commitToHistory(updatedProfile);
    toast.success("Auto-filled from layers");
  }, [currentProfile, currentProfileIndex, commitToHistory]);

  // Phase 4: compute saved layouts for current namespace
  const savedLayouts = useMemo((): NbcardSavedCard[] => {
    if (typeof window === "undefined") return [];
    const namespace = getNbcardSavedNamespace(sessionEmail ?? undefined);
    return loadNbcardSavedCards(namespace).sort((a, b) => b.updatedAt - a.updatedAt);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionEmail, autosaveIndicator]); // re-compute after each autosave / Save As

  return (
    <>
      {/* Welcome Modal (first-time onboarding) */}
      <WelcomeModal
        hasExistingCards={hasPersistedCards}
        onCreateCard={handleCreateCard}
        onUseExample={handleUseExample}
      />

      {/* Help Button (floating) */}
      <HelpButton />

      {/* Sync Prompt (import local cards on sign-in) */}
      {showSyncPrompt && (
        <div className="mb-6 rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Import Your Local Cards?</h3>
              <p className="text-sm text-gray-700 mb-4">
                You have {profiles.length} profile(s) and {contacts.length} contact(s) saved locally on this device.
                Would you like to sync them to your account so they're available across all your devices?
              </p>
              <div className="flex gap-3">
                <Button onClick={handleImportLocalCards} size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <Cloud className="mr-2 h-4 w-4" />
                  Yes, Sync Now
                </Button>
                <Button onClick={handleSkipImport} size="sm" variant="outline">
                  Not Now
                </Button>
              </div>
            </div>
            <button
              onClick={() => setShowSyncPrompt(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Sync Status Banner */}
      {sessionEmail && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2 text-sm">
          <div className="flex items-center gap-2">
            {syncStatus === 'syncing' ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-gray-700">Syncing...</span>
              </>
            ) : syncStatus === 'success' ? (
              <>
                <Cloud className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Synced {lastSyncTime && `• ${new Date(lastSyncTime).toLocaleTimeString()}`}</span>
              </>
            ) : syncStatus === 'error' ? (
              <>
                <CloudOff className="h-4 w-4 text-red-600" />
                <span className="text-gray-700">Sync failed</span>
              </>
            ) : (
              <>
                <Cloud className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Signed in as {sessionEmail}</span>
              </>
            )}
          </div>
          <Button
            onClick={handleSyncNow}
            disabled={syncStatus === 'syncing'}
            size="sm"
            variant="ghost"
            className="h-8"
          >
            {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>
      )}

      {/* Profile Selector */}
      {profiles.length > 1 && (
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-semibold text-gray-700"
            >
              <FaUsers className="text-purple-600" />
              {currentProfile?.fullName ?? "Select Profile"}
              <FaChevronDown className={`transition-transform ${showProfileDropdown ? "rotate-180" : ""}`} />
            </button>
            {showProfileDropdown && (
              <div className="absolute top-full mt-2 bg-white rounded-lg shadow-xl py-2 min-w-full z-10">
                {profiles.map((profile, index) => (
                  <button
                    key={profile.id}
                    onClick={() => {
                      setCurrentProfileIndex(index);
                      setShowProfileDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors ${
                      index === currentProfileIndex ? "bg-purple-100 font-semibold" : ""
                    }`}
                  >
                    {profile.fullName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="flex flex-wrap gap-8 mb-8 [&>*]:basis-full lg:[&>*]:basis-[calc(50%-16px)] [&>*]:min-w-0">
        {/* Left Column - Profile Card */}
        <div>
          {/* Profile Card with Capture Wrapper */}
          <div className="mb-6">
            <div id="profile-card-capture-wrapper" className="text-left w-full">
              <ProfileCard
                profile={currentProfile}
                showEditButton={false}
                suppressDefaultCardContent={true}
                onPhotoClick={(e) => {
                  e?.stopPropagation();
                  if (!canvasEditMode) {
                    handleEditProfile();
                  }
                }}
                userEmail={undefined}
                templateSelection={templateSelection}
                selectedTemplate={selectedTemplate}
                editMode={layoutEditMode}
                canvasEditMode={canvasEditMode}
                gridEnabled={gridEnabled}
                snapEnabled={snapEnabled}
                selectedLayerId={selectedLayerId}
                onLayerSelect={setSelectedLayerId}
                onLayerUpdate={(layerId, updates) => {
                  // Update layer in current profile
                  setProfiles(prev => prev.map((p, idx) => {
                    if (idx === currentProfileIndex) {
                      const layers = p.layers || [];
                      return {
                        ...p,
                        layers: layers.map(layer => 
                          layer.id === layerId ? { ...layer, ...updates } as CardLayer : layer
                        ),
                      };
                    }
                    return p;
                  }));
                  // Auto-save draft
                  setTimeout(() => {
                    const updatedProfiles = profiles.map((p, idx) => {
                      if (idx === currentProfileIndex) {
                        const layers = p.layers || [];
                        return {
                          ...p,
                          layers: layers.map(layer => 
                            layer.id === layerId ? { ...layer, ...updates } as CardLayer : layer
                          ),
                        };
                      }
                      return p;
                    });
                    saveNbcardLocalState({ profiles: updatedProfiles, contacts });
                  }, 400);
                }}
              />
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mb-4">
            {canvasEditMode
              ? "Double-click text to edit inline, click avatar/background to upload" 
              : layoutEditMode 
                ? "Click on a layer to select it, then drag to reposition" 
                : "Use the buttons below to edit your profile or layout"}
          </p>

          {/* Canvas Edit Mode Toggle */}
          {currentProfile && (
            <div className="flex justify-center gap-3 mb-4">
              <button
                type="button"
                onClick={() => {
                  const newMode = !canvasEditMode;
                  setCanvasEditMode(newMode);
                  try {
                    localStorage.setItem('nb-card:canvas-edit-mode', newMode ? '1' : '0');
                  } catch { /* ignore */ }
                  if (newMode) {
                    setLayoutEditMode(false);
                    setSelectedLayerId(null);
                    toast.info("Canvas Edit Mode enabled. Double-click text to edit, click avatar/background to upload.");
                  }
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  canvasEditMode
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-emerald-400'
                }`}
              >
                {canvasEditMode ? 'Exit Canvas Edit' : 'Canvas Edit'}
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleEditProfile}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              <FaEdit /> Edit Profile
            </button>
            <button
              onClick={handleCreateNewProfile}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              <FaPlus /> New Profile
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("share-your-profile");
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
                // Open the share dialog in ShareButtons via custom event
                window.dispatchEvent(new CustomEvent("nb-share-request", { detail: { action: "share" } }));
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Share Your Profile
            </button>
          </div>
        </div>

        {/* Right Column - Share Buttons */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {!sessionEmail && !signInCalloutDismissed ? (
            <div className="mb-4 rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 relative">
              <div className="flex items-start justify-between gap-3">
                <div className="pr-6">
                  <p className="text-sm font-semibold text-gray-900">Tip: Sign in to sync across devices</p>
                  <p className="text-xs text-gray-700">
                    Your cards are saved locally on this device. Sign in to keep your cards across devices and avoid losing work if your browser storage is cleared.
                  </p>
                </div>
                <Button asChild size="sm" className="shrink-0">
                  <a href={`/uk/login?callbackUrl=${encodeURIComponent("/resources/nb-card")}`}>Sign in</a>
                </Button>
              </div>
              <button
                type="button"
                onClick={handleDismissSignInCallout}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Dismiss sign-in suggestion"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}
          <div id="share-your-profile">
            <ShareButtons
              profile={currentProfile}
              profiles={profiles}
              contacts={contacts}
              onSetProfiles={setProfiles}
              onSetContacts={setContacts}
              templateSelection={templateSelection}
              showPrivacyControls={false}
            />
          </div>
        </div>
      </div>

      {/* Business Card Front/Back Toggle */}
      {isBusinessCard && (
        <div className="mb-6 flex justify-center">
          <div className="inline-flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => handleBusinessSideToggle('front')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                currentBusinessSide === 'front'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => handleBusinessSideToggle('back')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                currentBusinessSide === 'back'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Pro Editor panels (when Layout Edit Mode is active) — Layers above Tools */}
      {layoutEditMode && (
        <div className="mb-6 space-y-4">
          <LayersPanel
            layers={currentProfile.layers || []}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onReorderLayers={handleReorderLayers}
            onToggleLayerVisibility={handleToggleLayerVisibilityById}
            onToggleLayerLock={handleToggleLayerLockById}
            onAddText={handleAddTextFromPanel}
            onDeleteLayer={deleteLayer}
            onUpdateLayerText={handleUpdateLayerText}
            onEditEnd={handleCommitLayerTextEdit}
            onResetLayers={resetLayers}
            onClearLayers={clearLayers}
            onNudgeLayer={handleNudgeLayer}
            onSetFieldLink={handleSetFieldLink}
            availableFieldLinks={availableFieldLinks}
          />
          <EditorToolbar
            canUndo={canUndo(history)}
            canRedo={canRedo(history)}
            onUndo={handleUndo}
            onRedo={handleRedo}
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomFit={handleZoomFit}
            gridEnabled={gridEnabled}
            onToggleGrid={handleToggleGrid}
            snapEnabled={snapEnabled}
            onToggleSnap={handleToggleSnap}
            selectedLayerId={selectedLayerId}
            selectedLayer={selectedLayer}
            onAddText={handleAddText}
            onAddShape={handleAddShape}
            onAddAvatar={handleAddAvatar}
            onAddImage={handleAddImage}
            onAddQR={handleAddQR}
            onDuplicate={handleDuplicateLayer}
            onDelete={handleDeleteLayer}
            onToggleLock={handleToggleLayerLock}
            onToggleVisibility={handleToggleLayerVisibility}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onBringToFront={handleBringToFront}
            onSendToBack={handleSendToBack}
            onAvatarUpload={handleAvatarUploadFromInspector}
            onAlign={handleAlign}
            profile={currentProfile}
            onProfileUpdate={(updatedProfile) => {
              const updated = [...profiles];
              updated[currentProfileIndex] = updatedProfile;
              setProfiles(updated);
              commitToHistory(updatedProfile);
            }}
          />
        </div>
      )}

      {/* Free Layout Editor card — above Card Templates */}
      <div className="mb-4">
        <div className="rounded-lg border bg-muted/20 p-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h3 className="text-sm font-semibold">Free Layout Editor</h3>
              <p className="text-xs text-muted-foreground">Add text, shapes, and images that you can drag and resize</p>
            </div>
            <div className="flex items-center gap-2">
              {autosaveIndicator && (
                <span className="text-xs text-emerald-600 font-medium">Saved &#10003;</span>
              )}
              {(currentProfile.layers?.length ?? 0) > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSaveAsName(currentProfile.fullName ? `${currentProfile.fullName}'s Layout` : 'My Layout');
                    setShowSaveAsDialog(true);
                  }}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:border-purple-400 hover:text-purple-700 transition-all"
                >
                  Save As...
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setLayoutEditMode(!layoutEditMode);
                  if (!layoutEditMode) {
                    setCanvasEditMode(false);
                    try { localStorage.setItem('nb-card:canvas-edit-mode', '0'); } catch { /* ignore */ }
                  } else {
                    setSelectedLayerId(null);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  layoutEditMode
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-400'
                }`}
              >
                {layoutEditMode ? 'Exit Edit Layout' : 'Edit Layout'}
              </button>
            </div>
          </div>

          {/* Phase 2: Card Details — shown for canvas-only cards */}
          {isCanvasOnly && (
            <div className="mt-3 border-t pt-3">
              <button
                type="button"
                onClick={() => setShowCardDetails((v) => !v)}
                className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-purple-700 transition-colors w-full text-left"
              >
                <span className={`transition-transform ${showCardDetails ? "rotate-90" : ""}`}>&#9654;</span>
                Card Details (for sharing)
              </button>
              {showCardDetails && (
                <div className="flex flex-wrap mt-2 gap-2 [&>*]:basis-[calc(50%-4px)] [&>*]:min-w-0">
                  <div>
                    <label className="text-xs text-gray-500" htmlFor="fle-name">Name</label>
                    <input
                      id="fle-name"
                      type="text"
                      value={currentProfile.fullName || ""}
                      onChange={(e) => {
                        const up = { ...currentProfile, fullName: e.target.value };
                        setProfiles((prev) => prev.map((p, i) => i === currentProfileIndex ? up : p));
                      }}
                      placeholder="Your name"
                      className="w-full px-2 py-1 text-sm border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500" htmlFor="fle-phone">Phone</label>
                    <input
                      id="fle-phone"
                      type="tel"
                      value={currentProfile.phone || ""}
                      onChange={(e) => {
                        const up = { ...currentProfile, phone: e.target.value };
                        setProfiles((prev) => prev.map((p, i) => i === currentProfileIndex ? up : p));
                      }}
                      placeholder="+1 555 000 0000"
                      className="w-full px-2 py-1 text-sm border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500" htmlFor="fle-email">Email</label>
                    <input
                      id="fle-email"
                      type="email"
                      value={currentProfile.email || ""}
                      onChange={(e) => {
                        const up = { ...currentProfile, email: e.target.value };
                        setProfiles((prev) => prev.map((p, i) => i === currentProfileIndex ? up : p));
                      }}
                      placeholder="you@example.com"
                      className="w-full px-2 py-1 text-sm border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500" htmlFor="fle-website">Website</label>
                    <input
                      id="fle-website"
                      type="url"
                      value={currentProfile.website || ""}
                      onChange={(e) => {
                        const up = { ...currentProfile, website: e.target.value };
                        setProfiles((prev) => prev.map((p, i) => i === currentProfileIndex ? up : p));
                      }}
                      placeholder="https://example.com"
                      className="w-full px-2 py-1 text-sm border rounded bg-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={autoFillFromLayers}
                      className="px-3 py-1.5 text-xs font-semibold rounded border border-purple-300 text-purple-700 hover:bg-purple-50 transition-colors"
                    >
                      Auto-fill from text layers
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Phase 4: Saved Layouts list */}
          {savedLayouts.length > 0 && (
            <div className="mt-3 border-t pt-3">
              <button
                type="button"
                onClick={() => setShowSavedLayouts((v) => !v)}
                className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-purple-700 transition-colors w-full text-left"
              >
                <span className={`transition-transform ${showSavedLayouts ? "rotate-90" : ""}`}>&#9654;</span>
                My Saved Layouts ({savedLayouts.length})
              </button>
              {showSavedLayouts && (
                <div className="mt-2 space-y-1 max-h-52 overflow-y-auto">
                  {savedLayouts.map((card) => (
                    <div key={card.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200">
                      <span className="flex-1 text-xs text-gray-700 truncate" title={card.title}>{card.title}</span>
                      <span className="text-[10px] text-gray-400 shrink-0">{new Date(card.updatedAt).toLocaleDateString()}</span>
                      <button
                        type="button"
                        aria-label={`Load layout ${card.title}`}
                        onClick={() => {
                          const loaded = { ...card.snapshot, id: currentProfile.id };
                          setProfiles((prev) => prev.map((p, i) => i === currentProfileIndex ? loaded : p));
                          commitToHistory(loaded);
                          toast.success(`Loaded "${card.title}"`);
                        }}
                        className="shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete layout ${card.title}`}
                        onClick={() => {
                          if (!confirm(`Delete "${card.title}"?`)) return;
                          const namespace = getNbcardSavedNamespace(sessionEmail ?? undefined);
                          deleteNbcardSavedCard(namespace, card.id);
                          // Trigger re-render via autosaveIndicator toggle
                          setAutosaveIndicator((v) => !v);
                          toast.success(`Deleted "${card.title}"`);
                        }}
                        className="shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      >
                        Del
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Template Picker Section */}
      <div className="mb-8">
        <TemplatePicker
          selection={templateSelection}
          orientation={templateSelection.orientation || 'landscape'}
          onSelectionChange={handleTemplateSelectionChange}
          onCreateFromTemplate={handleCreateFromTemplate}
        />
      </div>

      {/* Contact Capture Section */}
      <div className="mb-8">
        <ContactCapture contacts={contacts} onUpsert={handleUpsertContact} onDelete={handleDeleteContact} />
      </div>

      {/* Data Controls Center */}
      <div className="mb-8">
        <DataControlsCenter
          profiles={profiles}
          contacts={contacts}
          onRestoreData={handleRestoreData}
          onDeleteAll={handleDeleteAll}
        />
      </div>

      {/* PWA Install Section */}
      <div id="nbcard-install" className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Install as App</h3>
          <p className="text-gray-600">Use the “Download & Install NB-Card” button at the top of the page, or follow the steps below.</p>
        </div>

        {/* Installed State */}
        {isInstalled ? (
          <div className="mb-4">
            <div className="w-full max-w-md mx-auto rounded-xl bg-white/70 border border-purple-100 px-6 py-4 text-center">
              <p className="font-semibold text-gray-800">NB-Card is installed</p>
              <p className="text-sm text-gray-600">You can open it from your home screen / apps.</p>
            </div>
          </div>
        ) : null}

        {/* Install button removed: primary one-shot install is handled by the page CTA */}

        {/* Manual Install Instructions */}
        <div className="flex flex-wrap gap-4 mt-4 [&>*]:basis-full md:[&>*]:basis-[calc(50%-8px)] [&>*]:min-w-0">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs">iOS</span>
              iPhone & iPad
            </h4>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Open NB-Card in Safari</li>
              <li>Tap the share button (square with arrow)</li>
              <li>Scroll and tap "Add to Home Screen"</li>
              <li>Tap "Add" to confirm</li>
            </ol>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Android</span>
              Chrome Browser
            </h4>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Tap the menu button (three dots)</li>
              <li>Select "Add to Home screen" or "Install app"</li>
              <li>Tap "Install" or "Add"</li>
              <li>Find the app on your home screen</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Save As Named Layout Dialog */}
      <Dialog open={showSaveAsDialog} onOpenChange={(open) => !open && setShowSaveAsDialog(false)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Save layout as...</DialogTitle>
            <DialogDescription>
              Give your canvas layout a name. It will appear in the Saved Cards section where you can load it later.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3">
            <Input
              aria-label="Layout name"
              placeholder="e.g. My business card layout"
              value={saveAsName}
              onChange={(e) => setSaveAsName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); handleSaveAsLayout(); }
                if (e.key === 'Escape') { e.preventDefault(); setShowSaveAsDialog(false); }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setShowSaveAsDialog(false)}>Cancel</Button>
            <Button
              type="button"
              onClick={handleSaveAsLayout}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Manager Modal */}
      {showProfileManager && editingProfile && (
        <ProfileManager
          profile={editingProfile}
          onSave={handleSaveProfile}
          onDelete={!isNewProfile ? handleDeleteProfile : undefined}
          onClose={() => {
            setShowProfileManager(false);
            setEditingProfile(null);
            setIsNewProfile(false);
          }}
          isNew={isNewProfile}
          userEmail={undefined}
          onSelectTemplate={(templateId) => {
            loadTemplateManifest()
              .then((manifest) => {
                const template = getTemplateById(manifest.templates, templateId);
                if (!template) return;
                const nextSelection: TemplateSelection = {
                  backgroundId: template.id,
                  overlayId: undefined,
                  orientation: template.orientation,
                  backgroundColor: templateSelection.backgroundColor,
                };

                setTemplateSelection(nextSelection);
                if (isNewProfile) setPendingTemplateSelection(nextSelection);
              })
              .catch(() => {
                // ignore
              });
          }}
        />
      )}
    </>
  );
}
