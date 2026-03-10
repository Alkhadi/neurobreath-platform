'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Bot, Send, Volume2, VolumeX, Sparkles, 
  MessageCircle, Map, ChevronRight,
  Brain, Heart, Home, Download, Minimize2, Maximize2,
  RotateCcw, Copy, Check, ExternalLink, StopCircle, Share2
} from 'lucide-react';
import { getPageConfig, platformInfo, type PageBuddyConfig } from '@/lib/page-buddy-configs';
import { loadPreferences } from '@/lib/ai/core/userPreferences';
import { cn } from '@/lib/utils';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { BuddyErrorBoundary } from '@/components/buddy/error-boundary';
import { SafeIcon } from '@/components/buddy/safe-icon';
import { BuddyAnswerCard } from '@/components/buddy/answer-card';
import { ShareButton } from '@/components/share/ShareButton';
import { InstallButton } from '@/components/pwa/InstallButton';
import type { BuddyAskResponse } from '@/lib/buddy/server/types';
import { getBuddyIntentIdByLabel } from '@/lib/assistant/intents';
import { AnchoredPageTour, type AnchoredTourStep, type TourPlacement } from '@/components/tour/anchored-page-tour';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  availableTools?: string[];
  buddyAnswer?: BuddyAskResponse['answer'];
  buddyCitations?: BuddyAskResponse['citations'];
  buddyMeta?: BuddyAskResponse['meta'];
}

interface PageBuddyProps {
  defaultOpen?: boolean;
}

export function PageBuddy({ defaultOpen = false }: PageBuddyProps) {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const { speak, stop, isSpeaking } = useSpeechSynthesis();
  const [showTour, setShowTour] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [tourSteps, setTourSteps] = useState<AnchoredTourStep[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [pageContent, setPageContent] = useState<{
    headings: { text: string; id: string; level: number }[];
    buttons: { text: string; id: string }[];
    sections: { name: string; id: string }[];
    features: string[];
  }>({ headings: [], buttons: [], sections: [], features: [] });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const isComposingRef = useRef(false);
  const lastSentMessageRef = useRef<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const lastInitializedPathRef = useRef<string | null>(null);
  
  const config = getPageConfig(pathname);

  const normalizePathname = useCallback((path: string) => {
    const base = path.split('?')[0] || '/';
    const trimmed = base.replace(/\/+$/, '') || '/';
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }, []);

  const getPageKeyForTour = useCallback(
    (path: string) => {
      const normalized = normalizePathname(path);

      // Preserve known stable keys already used by data-tour anchors.
      if (normalized === '/uk') return 'uk-home';
      if (normalized === '/us') return 'us-home';
      if (normalized === '/autism') return 'autism-hub';
      if (normalized === '/conditions/autism-parent') return 'conditions-autism-parent';
      if (normalized === '/contact') return 'contact';
      if (normalized === '/breathing/training/focus-garden') return 'focus-garden-training';

      const parts = normalized.split('/').filter(Boolean);
      if (parts.length === 0) return 'root';

      const [first] = parts;
      const isRegion = first === 'uk' || first === 'us';
      const regionPrefix = isRegion ? first : null;
      const rest = isRegion ? parts.slice(1) : parts;

      if (regionPrefix && rest.length === 0) return `${regionPrefix}-home`;
      const slug = rest.join('-') || 'root';
      return regionPrefix ? `${regionPrefix}-${slug}` : slug;
    },
    [normalizePathname]
  );

  const getTourIntroLine = useCallback(
    (path: string) => {
      const normalized = normalizePathname(path);
      const parts = normalized.split('/').filter(Boolean);
      const region = parts[0] === 'uk' || parts[0] === 'us' ? parts[0] : null;
      const rest = region ? parts.slice(1) : parts;
      const top = rest[0] || '';

      if (top === 'conditions') return 'Condition pages: overview, evidence, skills, and next steps.';
      if (top === 'guides') return 'Guides: skim the key sections, then pick one action to try today.';
      if (top === 'tools') return 'Tools: try a quick exercise, then save what helps.';
      if (top === 'progress') return 'Progress: review what’s working and adjust your plan.';
      if (top === 'my-plan') return 'My Plan: save skills, schedule routines, and track journeys.';
      if (top === 'settings') return 'Settings: update preferences and accessibility options.';
      if (top === 'get-started') return 'Get started: a quick path to your first helpful routine.';
      if (top === 'help-me-choose') return 'Help me choose: answer a few prompts for a tailored path.';
      if (normalized === '/contact') return 'Contact: send a message and find help resources.';

      return 'A quick tour of the key sections on this page.';
    },
    [normalizePathname]
  );

  const tourIntroLine = useMemo(() => getTourIntroLine(pathname), [getTourIntroLine, pathname]);

  const discoverTourSteps = useCallback((pageKey: string): AnchoredTourStep[] => {
    if (typeof window === 'undefined') return [];
    const MAX_STEPS = 25;
    const nodes = Array.from(document.querySelectorAll(`[data-tour^="nb:${pageKey}:"]`));
    const escape = (value: string) => {
      const css = (globalThis as unknown as { CSS?: { escape?: (v: string) => string } }).CSS;
      if (css && typeof css.escape === 'function') return css.escape(value);
      return value.replace(/"/g, '\\"');
    };

    const parseTips = (node: HTMLElement) => {
      const raw = node.getAttribute('data-tour-tips')?.trim();
      if (!raw) return [];
      const parts = raw
        .split(/\n|\|/g)
        .map((s) => s.trim())
        .filter(Boolean);
      return parts.slice(0, 4);
    };

    const defaultTips = (title: string) => {
      const clean = title.trim();
      return [
        clean ? `Look for one small action in “${clean}”.` : 'Look for one small action you can try.',
        'If this feels like too much, just skim and move on.',
      ];
    };

    const explicit = nodes
      .map((node, domIndex): { domIndex: number; step: AnchoredTourStep } | null => {
        if (!(node instanceof HTMLElement)) return null;
        if (node.getClientRects().length === 0) return null;

        const tourId = node.getAttribute('data-tour')?.trim() || '';
        if (!tourId) return null;

        const orderRaw = node.getAttribute('data-tour-order');
        const order = orderRaw ? Number(orderRaw) : 999;
        const title = node.getAttribute('data-tour-title')?.trim() || 'Section';
        const placementRaw = (node.getAttribute('data-tour-placement')?.trim() || 'auto') as TourPlacement;
        const placement: TourPlacement = ['auto', 'right', 'left', 'bottom'].includes(placementRaw) ? placementRaw : 'auto';
        const tips = parseTips(node);

        const step: AnchoredTourStep = {
          tourId,
          selector: `[data-tour="${escape(tourId)}"]`,
          title,
          tips: tips.length > 0 ? tips : defaultTips(title),
          order: Number.isFinite(order) ? order : 999,
          placement,
        };

        return { domIndex, step };
      })
      .filter((v): v is { domIndex: number; step: AnchoredTourStep } => v !== null);

    const explicitSteps = explicit
      .sort((a, b) => a.step.order - b.step.order || a.domIndex - b.domIndex)
      .map((v) => v.step)
      .slice(0, MAX_STEPS);

    // If we have a solid explicit tour, prefer it.
    if (explicitSteps.length >= 2) return explicitSteps;

    // Auto-scan fallback: discover meaningful sections and assign stable runtime IDs.
    const main = document.querySelector('main') || document.body;
    const candidates = Array.from(
      main.querySelectorAll('section, [role="region"], [aria-labelledby], article')
    ).filter((el): el is HTMLElement => el instanceof HTMLElement);

    const explicitRoots = new globalThis.Set<HTMLElement>(nodes.filter((n): n is HTMLElement => n instanceof HTMLElement));
    const isInsideExplicit = (el: HTMLElement) => {
      for (const root of explicitRoots) {
        if (root !== el && root.contains(el)) return true;
      }
      return false;
    };

    const getTitleFromElement = (el: HTMLElement) => {
      const fromAttr = el.getAttribute('data-tour-title')?.trim();
      if (fromAttr) return fromAttr;
      const aria = el.getAttribute('aria-label')?.trim();
      if (aria) return aria;
      const heading = el.querySelector('h1, h2, h3');
      const headingText = heading?.textContent?.trim();
      if (headingText) return headingText;
      const id = el.id?.trim();
      if (id) return id.replace(/[-_]/g, ' ');
      return 'Section';
    };

    const isVisible = (el: HTMLElement) => {
      if (el.getAttribute('aria-hidden') === 'true') return false;
      if (el.closest('[aria-hidden="true"]')) return false;
      if (el.classList.contains('sr-only')) return false;
      return el.getClientRects().length > 0;
    };

    const isActionable = (el: HTMLElement) => Boolean(el.querySelector('a[href], button, input, textarea, select'));
    const hasMeaningfulText = (el: HTMLElement) => (el.textContent || '').replace(/\s+/g, ' ').trim().length >= 40;

    const autoSteps: AnchoredTourStep[] = [];
    let autoIndex = 0;
    for (const el of candidates) {
      if (autoSteps.length + explicitSteps.length >= MAX_STEPS) break;
      if (!isVisible(el)) continue;
      if (el.matches('nav, footer, header')) continue;
      if (el.closest('nav, footer, header')) continue;
      if (isInsideExplicit(el)) continue;
      if (el.hasAttribute('data-tour')) continue;
      if (!hasMeaningfulText(el) && !isActionable(el)) continue;

      const eidExisting = el.getAttribute('data-nb-tour-eid')?.trim();
      const eid = eidExisting || `${pageKey}:${autoIndex}`;
      if (!eidExisting) el.setAttribute('data-nb-tour-eid', eid);

      const title = getTitleFromElement(el);
      const tipsAttr = parseTips(el);
      autoSteps.push({
        tourId: `nb:${pageKey}:auto:${eid}`,
        selector: `[data-nb-tour-eid="${escape(eid)}"]`,
        title,
        tips: tipsAttr.length > 0 ? tipsAttr : defaultTips(title),
        order: 5000 + autoIndex,
        placement: 'auto',
      });
      autoIndex += 1;
    }

    return [...explicitSteps, ...autoSteps].slice(0, MAX_STEPS);
  }, []);

  // If the route changes mid-tour, re-scan and reset safely.
  useEffect(() => {
    if (!showTour) return;
    const pageKey = getPageKeyForTour(pathname);
    const discovered = discoverTourSteps(pageKey);
    setTourSteps(discovered);
    setCurrentTourStep(0);
  }, [discoverTourSteps, getPageKeyForTour, pathname, showTour]);

  const buildUserSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return undefined;

    const snapshot: {
      role?: string;
      savedItemsCount?: number;
      routineSlotsCount?: number;
      activeJourneysCount?: number;
      topTags?: string[];
      focusGarden?: {
        conditions?: string[];
        minutesPerDay?: number;
        hasWeeklyPlan?: boolean;
      };
    } = {};

    try {
      const raw = window.localStorage.getItem('neurobreath.userprefs.v1');
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const root = parsed as Record<string, unknown>;
          const myPlanRaw = root.myPlan;
          const myPlan = myPlanRaw && typeof myPlanRaw === 'object' ? (myPlanRaw as Record<string, unknown>) : null;
          if (myPlan) {
            const savedItemsRaw = myPlan.savedItems;
            const savedItems = Array.isArray(savedItemsRaw) ? savedItemsRaw : [];

            const journeyProgressRaw = myPlan.journeyProgress;
            const journeyProgress =
              journeyProgressRaw && typeof journeyProgressRaw === 'object' && !Array.isArray(journeyProgressRaw)
                ? Object.values(journeyProgressRaw as Record<string, unknown>)
                : [];

            const routinePlanRaw = myPlan.routinePlan;
            const routinePlan = routinePlanRaw && typeof routinePlanRaw === 'object' ? (routinePlanRaw as Record<string, unknown>) : null;
            const routineSlotsRaw = routinePlan?.slots;
            const routineSlots = Array.isArray(routineSlotsRaw) ? routineSlotsRaw : [];

            snapshot.savedItemsCount = savedItems.length;
            snapshot.routineSlotsCount = routineSlots.length;
            snapshot.activeJourneysCount = journeyProgress.filter((j) => {
              if (!j || typeof j !== 'object') return false;
              return (j as Record<string, unknown>).completed === false;
            }).length;

            const tagCounts = new globalThis.Map<string, number>();
            for (const item of savedItems) {
              if (!item || typeof item !== 'object') continue;
              const tagsRaw = (item as Record<string, unknown>).tags;
              const tags = Array.isArray(tagsRaw) ? tagsRaw : [];
              for (const t of tags) {
                const tag = String(t || '').trim().toLowerCase();
                if (!tag) continue;
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
              }
            }

            snapshot.topTags = Array.from(tagCounts.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([tag]) => tag);
          }
        }
      }
    } catch {
      // ignore
    }

    try {
      const raw = window.localStorage.getItem('neurobreath.focusGardenRoadmap.v1');
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        const root = parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
        const inputsRaw = root?.inputs;
        const inputs = inputsRaw && typeof inputsRaw === 'object' ? (inputsRaw as Record<string, unknown>) : null;
        const answer = root?.answer;
        snapshot.focusGarden = {
          conditions: Array.isArray(inputs?.conditions)
            ? (inputs?.conditions as unknown[])
                .map((c) => String(c || '').trim())
                .filter(Boolean)
                .slice(0, 8)
            : undefined,
          minutesPerDay: typeof inputs?.minutesPerDay === 'number' ? (inputs.minutesPerDay as number) : undefined,
          hasWeeklyPlan: Boolean(answer && typeof answer === 'object'),
        };
      }
    } catch {
      // ignore
    }

    // Pull role from AI prefs (if available)
    try {
      const prefs = loadPreferences();
      snapshot.role = prefs.ai.role;
    } catch {
      // ignore
    }

    const hasAny = Object.values(snapshot).some((v) => v !== undefined);
    return hasAny ? snapshot : undefined;
  }, []);
  
  // Focus management for dialog
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      lastFocusedElement.current = document.activeElement as HTMLElement;
      // Focus the input when dialog opens
      setTimeout(() => {
        if (inputRef.current && !isMinimized) {
          inputRef.current.focus();
        }
      }, 100);
    } else {
      // Stop any ongoing speech when dialog closes.
      stop();
      // Restore focus when dialog closes
      if (lastFocusedElement.current && typeof lastFocusedElement.current.focus === 'function') {
        lastFocusedElement.current.focus();
      }
    }
  }, [isOpen, isMinimized, stop]);

  // Stop any ongoing speech when minimized.
  useEffect(() => {
    if (isMinimized) stop();
  }, [isMinimized, stop]);
  
  // Initialize on mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      const scrollContainer = scrollRef.current;
      // Smooth scroll to bottom
      requestAnimationFrame(() => {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  }, [messages, isLoading, isMinimized]);
  
  // Scan page content dynamically
  const scanPageContent = useCallback(() => {
    if (typeof window === 'undefined') return;

    const schedule = (cb: () => void) => {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => cb(), { timeout: 1000 });
        return;
      }
      setTimeout(cb, 0);
    };

    setTimeout(() => {
      schedule(() => {
        try {
          const headings: { text: string; id: string; level: number }[] = [];
          const buttons: { text: string; id: string }[] = [];
          const sections: { name: string; id: string }[] = [];
          const features: string[] = [];

          document.querySelectorAll('h1, h2, h3').forEach((heading) => {
            const text = heading.textContent?.trim();
            const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
            const level = parseInt(heading.tagName.substring(1));
            if (text) headings.push({ text, id, level });
          });

          document.querySelectorAll('button[aria-label], a[href^="/"]').forEach((el, idx) => {
            const text = el.getAttribute('aria-label') || el.textContent?.trim();
            const id = el.id || `element-${idx}`;
            if (text && text.length < 50) buttons.push({ text, id });
          });

          document.querySelectorAll('section[id], [data-section], [role="region"]').forEach((section) => {
            const name = section.getAttribute('aria-label') ||
              section.querySelector('h2, h3')?.textContent?.trim() ||
              section.id.replace(/-/g, ' ');
            const id = section.id || section.getAttribute('data-section') || '';
            if (name && id) sections.push({ name, id });
          });

          if (document.querySelector('[data-timer], [class*="timer"]')) features.push('Timer');
          if (document.querySelector('[data-quest], [class*="quest"]')) features.push('Quests');
          if (document.querySelector('form')) features.push('Form');
          if (document.querySelector('[class*="chart"], canvas')) features.push('Chart/Visualization');
          if (document.querySelector('[data-download], [download]')) features.push('Downloads');
          if (document.querySelector('video, audio')) features.push('Media Player');

          setPageContent({ headings, buttons, sections, features });
        } catch (error) {
          console.error('[Buddy] Page scan error:', error);
        }
      });
    }, 300);
  }, []);
  
  // Generate dynamic welcome message based on page content
  const generateDynamicWelcome = useCallback(() => {
    const baseWelcome = config.welcomeMessage;
    
    // Add page-specific context if we have detected content
    if (pageContent.sections.length > 0 || pageContent.features.length > 0) {
      let dynamicAddition = '\n\n**I can see on this page:**';
      
      if (pageContent.features.length > 0) {
        dynamicAddition += `\n• ${pageContent.features.join(', ')}`;
      }
      
      if (pageContent.sections.length > 0 && pageContent.sections.length <= 5) {
        dynamicAddition += `\n• ${pageContent.sections.length} main sections: ${pageContent.sections.map(s => s.name).join(', ')}`;
      }
      
      dynamicAddition += '\n\nAsk me about any of these, or I can give you a guided tour!';
      
      return baseWelcome + dynamicAddition;
    }
    
    return baseWelcome;
  }, [config.welcomeMessage, pageContent]);

  // Initialize/reset chat only when the route changes. Page scans can update `pageContent`
  // after the user has started chatting, so we must not clobber the message history.
  useEffect(() => {
    if (!mounted) return;

    const welcomeContent = generateDynamicWelcome();

    if (lastInitializedPathRef.current !== pathname) {
      lastInitializedPathRef.current = pathname;
      scanPageContent();

      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: welcomeContent,
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);
      setCurrentTourStep(0);
      setShowTour(false);
      setTourSteps([]);
      return;
    }

    // Same route: only update the welcome text if the user hasn't started chatting yet.
    setMessages((prev) => {
      if (prev.length === 1 && prev[0]?.id === 'welcome') {
        return [{ ...prev[0], content: welcomeContent }];
      }
      return prev;
    });
  }, [generateDynamicWelcome, mounted, pathname, scanPageContent]);
  
  // Scroll to section helper
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Highlight the section briefly
      element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
      }, 2000);
      return true;
    }
    return false;
  }, []);
  useEffect(() => {
    if (scrollRef.current && !isMinimized && messages.length > 0) {
      // Smooth scroll to bottom with requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [messages, isMinimized]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open/close buddy
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  
  // Copy message to clipboard
  const copyMessage = useCallback((messageId: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    });
  }, []);
  
  // Export chat history
  const exportChat = useCallback(() => {
    const chatText = messages
      .map(
        (m) =>
          `[${m.timestamp.toLocaleString()}] ${m.role === 'user' ? 'You' : 'NeuroBreath Buddy'}: ${m.content}`
      )
      .join('\n\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neurobreath-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [messages]);
  
  // Clear chat history
  const clearChat = useCallback(() => {
    scanPageContent();
    setMessages([]);
    setShowTour(false);
    setCurrentTourStep(0);
    setLastError(null);
    stop();
    setIsMinimized(false);
    setCopiedMessageId(null);
  }, [scanPageContent, stop]);
  
  // Render markdown-like formatting with clickable links
  const renderMessage = (content: string) => {
    // Split by markdown links and plain URLs
    const linkRegex = /(\[.*?\]\(.*?\)|(?:https?:\/\/|\/)(?:[\w\d\-._~:/?#[\]@!$&'()*+,;=])+)/g;
    const parts = content.split(linkRegex);
    
    return parts.map((part, i) => {
      // Handle markdown links [text](url)
      const markdownLinkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (markdownLinkMatch) {
        const [, text, url] = markdownLinkMatch;
        const isExternal = url.startsWith('http');
        return (
          <a 
            key={i} 
            href={url}
            onClick={(e) => {
              if (!isExternal) {
                e.preventDefault();
                router.push(url);
                setIsOpen(false);
              }
            }}
            className="text-primary underline hover:text-primary/80 inline-flex items-center gap-1 font-medium"
            target={isExternal ? '_blank' : '_self'}
            rel={isExternal ? 'noopener noreferrer' : undefined}
          >
            {text}
            {isExternal && <SafeIcon icon={ExternalLink} className="h-3 w-3" aria-hidden="true" />}
          </a>
        );
      }
      
      // Handle plain URLs starting with http:// or https://
      if (part.match(/^https?:\/\//)) {
        return (
          <a 
            key={i} 
            href={part}
            className="text-primary underline hover:text-primary/80 inline-flex items-center gap-1 break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
            <SafeIcon icon={ExternalLink} className="h-3 w-3" aria-hidden="true" />
          </a>
        );
      }
      
      // Handle relative URLs starting with /
      if (part.match(/^\/[a-zA-Z0-9\-_]+/)) {
        return (
          <a 
            key={i} 
            href={part}
            onClick={(e) => {
              e.preventDefault();
              router.push(part);
              setIsOpen(false);
            }}
            className="text-primary underline hover:text-primary/80 font-medium cursor-pointer"
          >
            {part}
          </a>
        );
      }
      
      // Handle bold text
      return part.split(/\*\*(.*?)\*\*/).map((segment, j) => 
        j % 2 === 1 ? <strong key={`${i}-${j}`}>{segment}</strong> : segment
      );
    });
  };
  
  // Smart local response generator
  const getLocalResponse = useCallback((query: string, cfg: PageBuddyConfig): string => {
    const q = query.toLowerCase().trim();
    
    // === DYNAMIC SECTION NAVIGATION ===
    // Check if user is asking about a specific section on the page
    const mentionedSection = pageContent.sections.find(s => 
      q.includes(s.name.toLowerCase()) || q.includes(s.id.toLowerCase())
    );
    
    if (mentionedSection && (q.includes('show') || q.includes('find') || q.includes('where') || q.includes('take me'))) {
      setTimeout(() => scrollToSection(mentionedSection.id), 500);
      return `**${mentionedSection.name}** section found! 📍\n\nI'm scrolling to it now and highlighting it for you.\n\n**Tip:** You can ask me about any section you see on this page!`;
    }
    
    // === DYNAMIC PAGE CONTENT ===
    if (q.includes('what\'s on this page') || q.includes('what can i see') || q.includes('page content')) {
      let response = `**${cfg.pageName} Content** 📋\n\n`;
      
      if (pageContent.features.length > 0) {
        response += `**Available Features:**\n${pageContent.features.map(f => `• ${f}`).join('\n')}\n\n`;
      }
      
      if (pageContent.sections.length > 0) {
        response += `**Main Sections (${pageContent.sections.length}):**\n${pageContent.sections.map(s => `• ${s.name}`).join('\n')}\n\n`;
      }
      
      if (pageContent.headings.length > 0) {
        const topHeadings = pageContent.headings.filter(h => h.level <= 2).slice(0, 5);
        if (topHeadings.length > 0) {
          response += `**Key Topics:**\n${topHeadings.map(h => `• ${h.text}`).join('\n')}\n\n`;
        }
      }
      
      response += `**Tip:** Ask me to "show me [section name]" to navigate directly!`;
      return response;
    }
    
    // === SECTION LISTING ===
    if ((q.includes('section') || q.includes('part')) && (q.includes('what') || q.includes('list') || q.includes('show'))) {
      if (pageContent.sections.length > 0) {
        return `**Sections on ${cfg.pageName}:** 📑\n\n${pageContent.sections.map((s, i) => `${i + 1}. **${s.name}**`).join('\n')}\n\n**Tip:** Click on any section name or ask me to "take me to [section name]"!`;
      }
    }
    
    // === HELP WITH SPECIFIC FEATURES ===
    if (pageContent.features.length > 0) {
      const mentionedFeature = pageContent.features.find(f => q.includes(f.toLowerCase()));
      if (mentionedFeature) {
        const featureHelp: Record<string, string> = {
          'Timer': '**Timer Feature** ⏱️\n\nI can see there\'s a timer on this page. You can use it to track focus sessions or practice time.\n\n**Tips:**\n• Set a duration that works for you\n• Use it consistently to build habits\n• Track your progress over time',
          'Quests': '**Daily Quests** 🏆\n\nThis page has quests you can complete! Quests help build habits through gamification.\n\n**Tips:**\n• Complete quests daily for streaks\n• Start with easier quests\n• Earn XP to level up',
          'Form': '**Form Detected** 📝\n\nThere\'s a form on this page. Fill it out to customize your experience or request resources.\n\n**Tips:**\n• All fields marked with * are required\n• Your data is stored securely\n• Look for helpful hints near each field',
          'Downloads': '**Download Resources** 📥\n\nThis page offers downloadable content!\n\n**Tips:**\n• Check file formats before downloading\n• Resources are free to use\n• Share with your support network',
          'Chart/Visualization': '**Progress Visualization** 📊\n\nYou can view your progress with charts on this page.\n\n**Tips:**\n• Check regularly to see trends\n• Use data to inform your strategies\n• Celebrate your progress!',
          'Media Player': '**Media Content** 🎥\n\nThis page includes video or audio content.\n\n**Tips:**\n• Adjust volume to your comfort\n• Use captions if available\n• Pause anytime you need'
        };
        
        if (featureHelp[mentionedFeature]) {
          return featureHelp[mentionedFeature];
        }
      }
    }
    
    // === PLATFORM IDENTITY ===
    if (q.includes('what is neurobreath') || q.includes('what\'s neurobreath') || q.includes('about neurobreath')) {
      let response = `**NeuroBreath** is a neurodiversity support platform designed to empower neurodivergent people, parents, teachers, and carers. 🧠✨\n\n**Our Mission:** ${platformInfo.mission}\n\n**What we offer:**\n• 🎯 **ADHD Hub** – Focus timers, gamified quests, skill strategies\n• 🌟 **Autism Hub** – Calming tools, education pathways, printable resources\n• 📊 Safe progress tracking\n• 🏠 Home-school collaboration tools\n\nAll content is evidence-informed from NICE, CDC, NHS, and peer-reviewed research.`;
      
      // If on home page, include breathing techniques first, then all conditions
      if (cfg.pageId === 'home') {
        response += `\n\n**🌬️ Breathing Techniques Available:**\n• **Box Breathing (4-4-4-4)** – Equal count breathing for calm and focus\n• **Coherent Breathing** – Balance your nervous system with 5-5 rhythm\n• **60-Second SOS Reset** – Quick emergency calm technique\n• **Extended Exhale** – Activate relaxation response\n• **No-Hold Variants** – Safer options for those with breathing sensitivities\n\n**🧩 Neurodevelopmental Support:**\n\n**Autism** – Comprehensive support for autistic individuals:\n• Calm Toolkit with sensory-friendly breathing exercises\n• Skills Library with age adaptations (child, teen, adult)\n• Education Pathways (UK EHCP, US IEP/504, EU frameworks)\n• Workplace Adjustments Generator (15+ templates)\n• Crisis Support Resources (UK/US/EU)\n• PubMed Research Search (35M+ articles)\n• Printable templates for home-school collaboration\n\n**Autism Support for Parents** 👨‍👩‍👧:\n• EHCP/IEP request guidance & templates\n• Evidence gathering checklists\n• School meeting preparation guides\n• Understanding sensory needs\n• Communication strategies\n• Daily routine support\n\n**Autism Support for Teachers** 🎓:\n• Classroom adaptations & strategies\n• Visual schedule templates\n• Sensory accommodation plans\n• Behavior support guidance\n• Parent communication templates\n• Legal rights & responsibilities\n\n**Autism Support for Carers** ❤️:\n• Day-to-day support strategies\n• Self-care for carers\n• Managing challenging behaviors\n• Communication techniques\n• Respite resources\n• Support networks\n\n**ADHD** – Evidence-based ADHD management:\n• Focus Pomodoro Timer (5-50 min sessions)\n• Daily Quests with XP & gamification\n• Skills Library (focus, organization, time management)\n• Treatment Decision Tree (NICE/AAP guidelines)\n• Myths vs Facts (research-backed)\n• Progress tracking with streaks\n\n**ADHD Support for Parents** 👨‍👩‍👧:\n• Homework & routine strategies\n• Behavior management techniques\n• School collaboration tools\n• Medication guidance (when appropriate)\n• Understanding executive function\n• Positive reinforcement systems\n\n**ADHD Support for Teachers** 🎓:\n• Classroom management strategies\n• Attention support techniques\n• Movement breaks guidance\n• Differentiation strategies\n• Progress monitoring tools\n• Parent communication templates\n\n**ADHD Support for Carers** ❤️:\n• Daily structure support\n• Attention management tips\n• Self-regulation strategies\n• Carer wellbeing resources\n• Understanding ADHD needs\n• Practical daily strategies\n\n**Dyslexia** – Reading & learning support:\n• Reading Training Program (evidence-based)\n• Phonics & decoding strategies\n• Multi-sensory learning techniques\n• Text-to-speech tools\n• Dyslexia-friendly formatting\n• Progress tracking & celebration\n\n**Dyslexia Support for Parents** 👨‍👩‍👧:\n• At-home reading practice\n• Assessment guidance\n• Rights & accommodations\n• Homework support strategies\n• Building confidence\n• School collaboration\n\n**Dyslexia Support for Teachers** 🎓:\n• Classroom accommodations\n• Multi-sensory teaching methods\n• Assessment modifications\n• Technology tools\n• Reading intervention strategies\n• IEP/504 guidance\n\n**Dyslexia Support for Carers** ❤️:\n• Daily learning support\n• Confidence building\n• Understanding learning differences\n• Assistive technology guidance\n• Carer resources\n• Advocacy support\n\n**😰 Mental Health Support:**\n\n**Anxiety** – Calm & coping strategies:\n• 5-4-3-2-1 Grounding technique\n• Breathing exercises for panic\n• Worry time scheduling\n• Cognitive reframing tools\n• Progressive muscle relaxation\n• Crisis resources (24/7 helplines)\n\n**Depression** 💙 – Daily support tools:\n• Mood tracking & patterns\n• Activity scheduling\n• Behavioral activation strategies\n• Sleep hygiene guidance\n• Professional support pathways\n• Self-compassion exercises\n\n**Bipolar** ⚡ – Mood management:\n• Mood tracking & early warning signs\n• Sleep routine importance\n• Medication adherence support\n• Crisis planning\n• Professional resources\n• Family/carer guidance\n\n**Stress** 😓 – Daily stress management:\n• Quick stress relief techniques\n• Time management strategies\n• Boundary setting guidance\n• Relaxation practices\n• Work-life balance tips\n• Burnout prevention\n\n**Sleep Issues** 💤 – Better sleep tools:\n• Sleep hygiene checklist\n• Bedtime routine builder\n• Relaxation techniques\n• Sleep-onset strategies\n• Morning routine guidance\n• Sleep tracking tools\n\n**Low Mood & Burnout** 🌧️ – Recovery support:\n• Energy management strategies\n• Gentle activity suggestions\n• Self-care planning\n• Setting realistic expectations\n• Recovery timeline guidance\n• Professional support pathways\n\n**🏠 Universal Features:**\n• Home-school collaboration tools\n• Printable resources & templates\n• Progress tracking (all local, private)\n• Evidence-based guidance (NICE, CDC, NHS)\n• Dyslexia-friendly design options\n• Multi-age adaptations (child, teen, adult)\n\n**Where would you like to start? Ask me about any condition or breathing technique!**`;
        response += `\n\n**Also available:** 🛡️ PTSD / Trauma support (visit /conditions/ptsd).`;
      } else {
        // For other pages, provide abbreviated version
        response += `\n\n**🧩 All Conditions We Support:**\n\n**Neurodevelopmental:**\n• Autism (+ Parent/Teacher/Carer support)\n• ADHD (+ Parent/Teacher/Carer support)\n• Dyslexia (+ Parent/Teacher/Carer support)\n\n**Mental Health:**\n• Anxiety • Depression • Bipolar • PTSD / Trauma\n• Stress • Sleep Issues • Low Mood & Burnout\n\n**🌬️ Breathing Techniques:**\n• Box Breathing • Coherent Breathing\n• 60-Second SOS • Extended Exhale\n\n**Ask me about any condition or technique for detailed information!**`;
      }
      
      return response;
    }
    
    // === EVIDENCE-BASED QUESTIONS ===
    if (q.includes('evidence') || q.includes('research') || q.includes('scientific') || q.includes('sources')) {
      return `**NeuroBreath is evidence-informed!** 🔬\n\nWe draw from:\n• **NICE Guidelines** (UK National Institute for Health and Care Excellence)\n• **CDC** (US Centers for Disease Control and Prevention)\n• **AAP** (American Academy of Pediatrics)\n• **NHS** resources\n• **PubMed** peer-reviewed research\n\nEvery strategy, fact, and recommendation includes citations. In the Autism Hub, you can even search 35+ million research articles directly!`;
    }
    
    // === BREATHING TECHNIQUES ===
    if (q.includes('breathing') || q.includes('breath') && (q.includes('what') || q.includes('technique') || q.includes('available'))) {
      return `**🌬️ Breathing Techniques Available:**\n\n**Box Breathing (4-4-4-4)** – Square breathing pattern:\n• Inhale 4 counts → Hold 4 → Exhale 4 → Hold 4\n• Perfect for focus and anxiety management\n• Used by athletes and military\n\n**Coherent Breathing (5-5)** – Balanced nervous system:\n• Inhale 5 counts → Exhale 5 counts\n• Activates vagal tone (calm response)\n• 5-10 minutes daily recommended\n\n**60-Second SOS Reset** – Emergency calm:\n• Quick technique for acute stress/panic\n• 6 deep breaths in 60 seconds\n• Works in any situation\n\n**Extended Exhale (4-6 or 4-8)** – Deep relaxation:\n• Longer exhale activates parasympathetic\n• Excellent for sleep onset\n• Reduces anxiety quickly\n\n**No-Hold Variants** – Safer options:\n• Continuous breathing without holds\n• Better for those with breathing issues\n• Still highly effective\n\n**🎯 All techniques include:**\n• Guided timers\n• Visual & audio cues\n• Safety warnings\n• Age adaptations\n• Mood tracking\n\n**Visit /breathing to try them!**`;
    }
    
    // === SPECIFIC CONDITIONS ===
    if (q.includes('autism') && !q.includes('adhd')) {
      if (q.includes('parent')) {
        return `**🧩 Autism Parent Support** 👨‍👩‍👧\n\nComprehensive resources for parents of autistic children:\n\n**Education Support:**\n• EHCP (UK) / IEP & 504 (US) request templates\n• Step-by-step application guidance\n• Evidence gathering checklists\n• Meeting preparation guides\n• Appeal process information\n\n**Daily Life:**\n• Understanding sensory needs\n• Communication strategies (verbal & non-verbal)\n• Visual schedule templates\n• Meltdown prevention & support\n• Routine building tools\n\n**Home Strategies:**\n• Sensory-friendly environment setup\n• Social skills support\n• Homework adaptations\n• Self-care planning\n• Sleep support strategies\n\n**Collaboration:**\n• School communication templates\n• Progress sharing tools\n• Professional meeting prep\n• Advocacy resources\n\n**Visit /autism for full parent toolkit!**`;
      } else if (q.includes('teacher')) {
        return `**🧩 Autism Teacher Support** 🎓\n\nEvidence-based classroom strategies:\n\n**Classroom Adaptations:**\n• Sensory accommodation plans\n• Visual schedule templates\n• Quiet space provision\n• Clear routine structures\n• Predictable transitions\n\n**Teaching Strategies:**\n• Visual instruction methods\n• Clear, concrete language\n• Step-by-step task breakdown\n• Processing time allowances\n• Alternative assessment options\n\n**Behavior Support:**\n• Understanding meltdowns vs tantrums\n• De-escalation techniques\n• Sensory break planning\n• Positive reinforcement systems\n• Function-based support\n\n**Legal & Rights:**\n• SEND Code of Practice (UK)\n• IDEA requirements (US)\n• Reasonable adjustments\n• Documentation requirements\n\n**Collaboration:**\n• Parent communication templates\n• Progress reporting tools\n• Multi-agency working guidance\n\n**Visit /conditions/autism-teacher for full resources!**`;
      } else if (q.includes('carer')) {
        return `**🧩 Autism Carer Support** ❤️\n\nPractical guidance for day-to-day care:\n\n**Understanding Autism:**\n• Sensory processing differences\n• Communication variations\n• Social interaction needs\n• Routine importance\n• Special interests value\n\n**Daily Support:**\n• Personal care adaptations\n• Activity planning\n• Managing transitions\n• Sensory regulation strategies\n• Communication tools\n\n**Challenging Times:**\n• Meltdown support\n• Anxiety management\n• Sleep difficulties\n• Eating challenges\n• Medical appointments\n\n**Carer Wellbeing:**\n• Self-care importance\n• Respite resources\n• Support networks\n• Managing stress\n• Celebrating successes\n\n**Crisis Support:**\n• Emergency contacts (UK/US/EU)\n• Crisis planning\n• Professional services\n• 24/7 helplines\n\n**Visit /conditions/autism-carer for comprehensive support!**`;
      } else {
        return `**🧩 Autism Hub** – Comprehensive support\n\n**For Autistic Individuals:**\n• Calm Toolkit (breathing, grounding, sensory)\n• Skills Library (age-adapted strategies)\n• Self-advocacy tools\n• Workplace adjustments generator\n• Crisis support resources\n\n**For Parents:** EHCP/IEP guidance, home strategies\n**For Teachers:** Classroom adaptations, behavior support\n**For Carers:** Daily support, wellbeing resources\n\n**Key Features:**\n• 35M+ research articles searchable\n• Printable templates (50+)\n• Education pathway guides\n• Home-school collaboration tools\n\n**Visit /autism or ask about parent/teacher/carer support!**`;
      }
    }
    
    if (q.includes('adhd') && !q.includes('autism')) {
      if (q.includes('parent')) {
        return `**🎯 ADHD Parent Support** 👨‍👩‍👧\n\nHelping parents support ADHD children:\n\n**Understanding ADHD:**\n• Executive function challenges\n• Attention variations\n• Impulsivity & hyperactivity\n• Emotional regulation\n• Strengths & superpowers\n\n**Daily Strategies:**\n• Homework support systems\n• Routine building tools\n• Behavior management (positive focus)\n• Time management aids\n• Organization strategies\n\n**School Support:**\n• IEP/504 plan guidance (US)\n• UK support plan templates\n• Parent-teacher collaboration\n• Progress monitoring\n• Accommodation requests\n\n**Treatment Information:**\n• Medication guidance (when appropriate)\n• Behavioral interventions\n• Therapy options\n• Combined approaches\n• Decision-making support\n\n**Family Life:**\n• Reducing conflicts\n• Building confidence\n• Celebrating strengths\n• Sibling support\n• Parent self-care\n\n**Visit /conditions/adhd-parent for full toolkit!**`;
      } else if (q.includes('teacher')) {
        return `**🎯 ADHD Teacher Support** 🎓\n\nClassroom strategies that work:\n\n**Classroom Management:**\n• Seating arrangements\n• Movement breaks (essential!)\n• Fidget tool guidance\n• Clear expectations\n• Visual schedules\n\n**Attention Support:**\n• Chunk tasks into smaller steps\n• Use timers & countdowns\n• Minimize distractions\n• Engage multiple senses\n• Frequent check-ins\n\n**Executive Function:**\n• Organization systems\n• Planning supports\n• Memory aids\n• Time awareness tools\n• Prioritization guidance\n\n**Behavior:**\n• Positive reinforcement (key!)\n• Understanding impulsivity\n• Redirect, don't punish\n• Function-based support\n• Consistent consequences\n\n**Assessment:**\n• Extended time options\n• Alternative formats\n• Reduced distractions\n• Oral responses\n• Demonstrate learning differently\n\n**Visit /conditions/adhd-teacher for classroom resources!**`;
      } else if (q.includes('carer')) {
        return `**🎯 ADHD Carer Support** ❤️\n\nDay-to-day ADHD care guidance:\n\n**Understanding ADHD:**\n• It's neurological, not behavioral\n• Executive function impacts\n• Attention regulation differences\n• Impulsivity management\n• Hyperfocus phenomenon\n\n**Daily Structure:**\n• Consistent routines\n• Visual reminders\n• Time management tools\n• Organization systems\n• Transition warnings\n\n**Practical Strategies:**\n• Breaking tasks into steps\n• Using timers effectively\n• Reward systems (immediate)\n• Physical activity importance\n• Reducing overstimulation\n\n**Communication:**\n• Clear, concise instructions\n• Eye contact when speaking\n• Repeat key information\n• Written backup helpful\n• Positive language focus\n\n**Carer Wellbeing:**\n• Self-care necessity\n• Support networks\n• Managing frustration\n• Celebrating small wins\n• Professional support\n\n**Visit /conditions/adhd-carer for complete guidance!**`;
      } else {
        return `**🎯 ADHD Hub** – Evidence-based management\n\n**For Individuals:**\n• Focus Pomodoro Timer (5-50 min)\n• Daily Quests (gamified habits)\n• Skills Library (focus, organization, time)\n• Treatment Decision Tree\n• Progress tracking\n\n**For Parents:** Homework strategies, behavior support\n**For Teachers:** Classroom adaptations, attention tools\n**For Carers:** Daily structure, practical strategies\n\n**Key Features:**\n• NICE & AAP guidelines\n• Myths vs Facts (research-backed)\n• XP & level system\n• Dopamine-friendly design\n\n**Visit /adhd or ask about parent/teacher/carer support!**`;
      }
    }
    
    if (q.includes('dyslexia')) {
      if (q.includes('parent')) {
        return `**📖 Dyslexia Parent Support** 👨‍👩‍👧\n\n**Understanding Dyslexia:**\n• Reading & decoding challenges\n• Phonological processing\n• Working memory impacts\n• Strengths (creativity, problem-solving)\n• Not related to intelligence\n\n**Assessment & Rights:**\n• Screening tools\n• Educational psychologist referral\n• IEP/504 plan guidance\n• Legal rights & protections\n• Accommodation requests\n\n**Home Reading Support:**\n• Multi-sensory learning\n• Paired reading techniques\n• Audiobooks & text-to-speech\n• Building confidence\n• Celebrating progress\n\n**Technology Tools:**\n• Text-to-speech software\n• Dyslexia-friendly fonts\n• Colored overlays\n• Speech-to-text tools\n• Reading apps\n\n**Emotional Support:**\n• Building self-esteem\n• Understanding frustration\n• Highlighting strengths\n• Finding successful dyslexics\n• Advocacy skills\n\n**Visit /conditions/dyslexia-parent for resources!**`;
      } else if (q.includes('teacher')) {
        return `**📖 Dyslexia Teacher Support** 🎓\n\n**Teaching Strategies:**\n• Multi-sensory instruction (see, hear, touch)\n• Phonics-based approach\n• Structured literacy programs\n• Explicit instruction\n• Overlearning & repetition\n\n**Classroom Accommodations:**\n• Extra reading time\n• Audiobooks access\n• Reduced text volume\n• Oral responses option\n• Assistive technology\n\n**Reading Support:**\n• Decodable texts\n• High-interest/low-level books\n• Reading buddies\n• Pre-teaching vocabulary\n• Context clues emphasis\n\n**Assessment Modifications:**\n• Extended time (typically 50%)\n• Read-aloud options\n• Scribe support\n• Alternative formats\n• Focus on content, not spelling\n\n**Building Confidence:**\n• Celebrate effort, not just achievement\n• Private feedback\n• Strength-based approach\n• Success opportunities\n• Peer support\n\n**Visit /conditions/dyslexia-teacher for full toolkit!**`;
      } else if (q.includes('carer')) {
        return `**📖 Dyslexia Carer Support** ❤️\n\n**Daily Learning Support:**\n• Reading practice routines\n• Homework adaptations\n• Memory aids & strategies\n• Organization systems\n• Time management tools\n\n**Technology Support:**\n• Setting up text-to-speech\n• Using dyslexia-friendly fonts\n• Speech-to-text for writing\n• Educational apps\n• Audiobook access\n\n**Building Confidence:**\n• Focus on strengths\n• Celebrate all progress\n• Reduce reading pressure\n• Share famous dyslexics\n• Encourage interests\n\n**Practical Strategies:**\n• Break tasks into steps\n• Use visual aids\n• Multi-sensory learning\n• Consistent practice (little & often)\n• Patience & encouragement\n\n**Carer Wellbeing:**\n• Managing frustration\n• Celebrating small wins\n• Support networks\n• Self-care importance\n• Professional guidance\n\n**Visit /conditions/dyslexia-carer for complete support!**`;
      } else {
        return `**📖 Dyslexia Hub** – Reading & learning support\n\n**Reading Training:**\n• Evidence-based program\n• Phonics & decoding focus\n• Multi-sensory techniques\n• Progress tracking\n• Confidence building\n\n**For Parents:** Home strategies, assessment guidance\n**For Teachers:** Classroom accommodations, instruction methods\n**For Carers:** Daily support, technology tools\n\n**Key Features:**\n• Dyslexia-friendly formatting\n• Text-to-speech integration\n• Interactive exercises\n• Structured literacy approach\n\n**Visit /conditions/dyslexia or /dyslexia-reading-training!**`;
      }
    }
    
    if (q.includes('anxiety')) {
      return `**😰 Anxiety Support** – Calm & coping strategies\n\n**Available Techniques:**\n• **5-4-3-2-1 Grounding** – Use senses to calm\n• **Breathing Exercises** – Box, coherent, extended exhale\n• **Progressive Muscle Relaxation** – Body tension release\n• **Worry Time** – Schedule anxiety (not suppress it)\n• **Cognitive Reframing** – Challenge anxious thoughts\n\n**Quick Calm Tools:**\n• 60-second SOS breathing\n• Cold water technique\n• Movement breaks\n• Distraction activities\n• Safe person contact\n\n**Daily Management:**\n• Regular routine\n• Sleep hygiene\n• Limit caffeine\n• Exercise (proven effective)\n• Mindfulness practice\n\n**When to Get Help:**\n• Panic attacks frequent\n• Avoiding daily activities\n• Physical symptoms persist\n• Impacting relationships\n• Self-harm thoughts\n\n**Crisis Support:**\n• UK: Samaritans 116 123\n• US: 988 Lifeline\n• EU: 112\n\n**Visit /conditions/anxiety for full toolkit!**`;
    }
    
    if (q.includes('depression')) {
      return `**💙 Depression Support** – Daily support tools\n\n**Understanding Depression:**\n• It's a medical condition\n• Not just "feeling sad"\n• Chemical & neurological\n• Treatable & manageable\n• Recovery is possible\n\n**Daily Strategies:**\n• **Behavioral Activation** – Small activities\n• **Mood Tracking** – Identify patterns\n• **Sleep Routine** – Consistent times\n• **Gentle Exercise** – Even 10 min walks\n• **Social Connection** – Even brief contact\n\n**Self-Care:**\n• Basic needs first (eat, sleep, hygiene)\n• Set tiny, achievable goals\n• Celebrate micro-wins\n• Be self-compassionate\n• Accept help offered\n\n**Professional Support:**\n• GP/Doctor consultation\n• Therapy options (CBT, IPT)\n• Medication (if recommended)\n• Support groups\n• Crisis services\n\n**Crisis Support:**\n• UK: Samaritans 116 123, Text SHOUT to 85258\n• US: 988 Suicide & Crisis Lifeline\n• EU: 112\n\n**Visit /conditions/depression for resources!**`;
    }

    if (
      q.includes('ptsd') ||
      q.includes('trauma') ||
      q.includes('post traumatic') ||
      q.includes('post-traumatic') ||
      q.includes('flashback') ||
      q.includes('nightmare')
    ) {
      return `**🛡️ PTSD / Trauma Support** – Grounding & next steps\n\nIf you’re dealing with trauma responses (flashbacks, hypervigilance, nightmares), you’re not alone — and support can help.\n\n**In-the-moment grounding (try one):**\n• **5-4-3-2-1** – Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste\n• **Feet + breath** – Feel both feet on the floor; slow exhale (4 in / 6–8 out)\n• **Orienting** – Look around and name: where you are, the date, what’s safe right now\n\n**Breathing tools (gentle options):**\n• Extended exhale (4–6 or 4–8)\n• Coherent breathing (5–5)\n• **No-hold variants** if breath holds feel uncomfortable\n\n**Daily support ideas:**\n• Sleep wind-down routine (reduce nightmares / arousal)\n• Trigger plan: identify triggers + coping steps + safe contacts\n• Professional pathways: trauma-focused therapy (e.g., TF-CBT/EMDR where appropriate)\n\n**Crisis / urgent help:**\n• UK: Samaritans 116 123, Text SHOUT to 85258\n• US: 988 Suicide & Crisis Lifeline\n• EU: 112\n\n👉 **Visit /conditions/ptsd for the full PTSD / Trauma page**`;
    }
    
    if (q.includes('stress')) {
      return `**😓 Stress Management** – Daily relief tools\n\n**Quick Stress Relief:**\n• **Breathing** – 60-second reset, box breathing\n• **Movement** – Walk, stretch, shake it out\n• **Cold Water** – Face splash, cold drink\n• **Music** – Calming playlist\n• **Nature** – Even 5 minutes outside\n\n**Daily Prevention:**\n• Time management systems\n• Boundary setting (saying no)\n• Regular breaks (Pomodoro)\n• Physical activity routine\n• Sleep priority\n\n**Work/School Stress:**\n• Task prioritization\n• Break large tasks down\n• Realistic expectations\n• Ask for help early\n• Separate work/home time\n\n**Long-term:**\n• Identify stressors\n• Eliminate/reduce when possible\n• Build stress tolerance gradually\n• Support network\n• Professional help if chronic\n\n**Burnout Warning Signs:**\n• Exhaustion despite rest\n• Cynicism/detachment\n• Reduced performance\n• Physical symptoms\n• Need intervention\n\n**Visit /stress for complete toolkit!**`;
    }
    
    if (q.includes('sleep')) {
      return `**💤 Sleep Support** – Better sleep tools\n\n**Sleep Hygiene Essentials:**\n• **Consistent Times** – Bed & wake (even weekends)\n• **Dark & Cool** – Bedroom environment\n• **No Screens** – 1 hour before bed\n• **Limit Caffeine** – After 2pm\n• **Exercise** – But not near bedtime\n\n**Bedtime Routine:**\n• Wind-down hour\n• Relaxing activity\n• Breathing exercises\n• Progressive muscle relaxation\n• Worry journal (write & close)\n\n**Sleep-Onset Strategies:**\n• 4-7-8 breathing\n• Body scan meditation\n• Visualization\n• Audio stories/meditations\n• Get up if can't sleep (20-min rule)\n\n**Morning Routine:**\n• Natural light exposure\n• Consistent wake time\n• Light exercise/stretch\n• Healthy breakfast\n• Avoid snoozing\n\n**When to Get Help:**\n• Insomnia > 3 weeks\n• Snoring/breathing stops\n• Excessive daytime sleepiness\n• Leg movements/restlessness\n\n**Visit /sleep for full sleep toolkit!**`;
    }
    
    // === NAVIGATION - ADHD HUB ===
    if ((q.includes('take me to') || q.includes('go to') || q.includes('visit') || q.includes('show me')) && q.includes('adhd')) {
      return `**ADHD Hub** is ready for you! 🎯\n\n**What you'll find:**\n• ⏱️ Focus Pomodoro Timer (5-50 min sessions)\n• 🏆 Daily Quests with XP rewards\n• 📚 Skills Library with practical strategies\n• 🔬 Myths vs Facts section\n• 📈 Progress tracking with streaks\n\n👉 **[Click here to visit /adhd](/adhd)**\n\nPerfect for individuals, parents, teachers, and carers supporting ADHD!`;
    }
    
    // === NAVIGATION - AUTISM HUB ===
    if ((q.includes('take me to') || q.includes('go to') || q.includes('visit') || q.includes('show me')) && q.includes('autism')) {
      return `**Autism Hub** is ready for you! 🌟\n\n**What you'll find:**\n• 🧘 Calm Toolkit with breathing exercises\n• 📚 Skills Library with age adaptations\n• 🎓 Education Pathways (EHCP/IEP/504)\n• 💼 Workplace Adjustments Generator\n• 📄 Printable Templates & Resources\n• 🔬 PubMed Research Search\n\n👉 **[Click here to visit /autism](/autism)**\n\nDesigned for autistic individuals, parents, teachers, carers, and employers!`;
    }
    
    // === TOOLS & FEATURES ===
    if (q.includes('tools') || q.includes('features') || q.includes('what can i do') || q.includes('what\'s available')) {
      let response = `**Available Tools on NeuroBreath:** 🛠️\n\n`;
      
      // If on home page, provide comprehensive overview
      if (cfg.pageId === 'home') {
        response += `**🌬️ Breathing Techniques & Tools:**\n• **Box Breathing (4-4-4-4)** – Equal count breathing for calm and focus\n• **Coherent Breathing (5-5)** – Balance your nervous system with guided timers\n• **60-Second SOS Reset** – Quick emergency calm technique with visual cues\n• **Extended Exhale (4-6/4-8)** – Activate relaxation response for sleep & anxiety\n• **No-Hold Variants** – Safer options for those with breathing sensitivities\n• Guided timers with visual & audio cues\n• Mood tracking before/after exercises\n• Age adaptations (child, teen, adult)\n\n**🧩 Neurodevelopmental Tools:**\n\n**Autism Hub (/autism):**\n• **Calm Toolkit** – Breathing, grounding, sensory regulation\n• **Skills Library** – 50+ strategies with age adaptations\n• **Education Pathways** – EHCP (UK), IEP/504 (US), EU frameworks\n• **Workplace Adjustments Generator** – 15+ professional templates\n• **PubMed Research Search** – Access 35M+ peer-reviewed articles\n• **Printable Resources** – 50+ templates for home-school collaboration\n• **Crisis Support** – UK/US/EU emergency contacts & resources\n• **Progress Tracker** – XP, levels, streaks (all local & private)\n\n**ADHD Hub (/adhd):**\n• **Focus Pomodoro Timer** – 5-50 min sessions with ADHD-friendly intervals\n• **Daily Quests System** – Gamified habit building with XP rewards\n• **Skills Library** – Focus, organization, time management strategies\n• **Treatment Decision Tree** – NICE/AAP evidence-based guidance\n• **Myths vs Facts** – Research-backed myth-busting with citations\n• **Progress Tracking** – Streaks, levels, achievements\n• **Dopamine Tips** – Break activity suggestions\n\n**Dyslexia Hub (/conditions/dyslexia):**\n• **Reading Training Program** – Evidence-based phonics & decoding\n• **Multi-sensory Learning Tools** – Visual, auditory, kinesthetic\n• **Text-to-Speech Integration** – Read-aloud support\n• **Dyslexia-friendly Formatting** – Font, spacing, color options\n• **Progress Tracking** – Celebrate reading improvements\n• **Interactive Exercises** – Engaging practice activities\n\n**😰 Mental Health Tools:**\n\n**Anxiety Support (/conditions/anxiety):**\n• **5-4-3-2-1 Grounding** – Sensory awareness technique\n• **Breathing Exercises** – Guided panic relief techniques\n• **Worry Time Scheduler** – Contain anxiety to specific times\n• **Cognitive Reframing Tools** – Challenge anxious thoughts\n• **Progressive Muscle Relaxation** – Body-based calm technique\n• **Crisis Support Access** – 24/7 helplines (UK/US/EU)\n\n**Depression Support (/conditions/depression):**\n• **Mood Tracker** – Identify patterns & triggers\n• **Activity Scheduler** – Behavioral activation planning\n• **Sleep Hygiene Tools** – Improve sleep quality\n• **Self-compassion Exercises** – Reduce self-criticism\n• **Professional Support Pathways** – Find help resources\n\n**Stress Management (/stress):**\n• **Quick Stress Relief** – 60-second reset techniques\n• **Time Management Tools** – Prioritization & planning\n• **Boundary Setting Guidance** – Learn to say no\n• **Relaxation Library** – Multiple techniques available\n• **Burnout Prevention** – Warning signs & recovery\n\n**Sleep Support (/sleep):**\n• **Sleep Hygiene Checklist** – Evidence-based sleep practices\n• **Bedtime Routine Builder** – Create consistent wind-down\n• **Sleep-onset Techniques** – 4-7-8 breathing, body scan\n• **Morning Routine Tools** – Wake-up support\n• **Sleep Tracker** – Monitor patterns\n\n**Bipolar Support (/conditions/bipolar):**\n• **Mood Tracker** – Daily monitoring with trend analysis\n• **Early Warning Signs** – Recognize episode triggers\n• **Sleep Routine Tools** – Critical for mood stability\n• **Crisis Planning** – Prepare for emergencies\n• **Medication Adherence Support** – Reminder systems\n\n**Low Mood & Burnout (/conditions/low-mood-burnout):**\n• **Energy Management** – Pacing & conservation strategies\n• **Gentle Activity Suggestions** – Achievable micro-goals\n• **Self-care Planning** – Realistic daily care\n• **Recovery Timeline** – Understanding healing process\n\n**👥 Role-Specific Support Tools:**\n\n**For Parents (all conditions):**\n• EHCP/IEP/504 request templates & step-by-step guidance\n• Evidence gathering checklists\n• School meeting preparation guides\n• Home strategy libraries\n• Progress sharing tools\n• Advocacy resource libraries\n\n**For Teachers (all conditions):**\n• Classroom adaptation templates\n• Visual schedule builders\n• Behavior support plans\n• Assessment modification guides\n• Parent communication templates\n• Legal rights & responsibilities guides\n\n**For Carers (all conditions):**\n• Daily support strategy guides\n• Communication technique libraries\n• Self-care planning tools\n• Respite resource directories\n• Professional support pathways\n• Support network connections\n\n**🏠 Universal Features:**\n• **Home-School Collaboration** – Shared templates & progress reports\n• **Printable Resources** – 100+ downloadable templates\n• **Progress Tracking** – All data stored locally & privately\n• **Evidence-Based Guidance** – NICE, CDC, NHS, AAP, peer-reviewed research\n• **Dyslexia-Friendly Design** – Font, spacing, color customization\n• **Multi-Age Adaptations** – Child (5-11), Teen (12-17), Adult (18+)\n• **Accessibility Features** – Screen reader support, keyboard navigation\n• **Multi-Language Support** – Content available in multiple languages\n\n**🎯 Interactive Features:**\n• XP & Leveling System – Gamified progress across all hubs\n• Streak Tracking – Build consistency habits\n• Achievement Badges – Celebrate milestones\n• Visual Progress Charts – See your journey\n• Custom Goal Setting – Personalized targets\n• Reminder Systems – Stay on track\n\n**📱 Platform Features:**\n• Mobile-responsive design\n• Offline capability (PWA)\n• Print-friendly formats\n• Export data options\n• Share resources easily\n• Bookmark favorites\n\n**Where would you like to start? Ask me about any specific tool, condition, or support type!**`;
      } else if (cfg.pageId === 'adhd') {
        response += `**ADHD Hub Tools:** 🎯\n\n${platformInfo.features.adhd.map((f: string) => `• ${f}`).join('\n')}\n\n**Available Now:**\n• Focus Pomodoro Timer (5-50 min customizable sessions)\n• Daily Quests (XP rewards, streak tracking)\n• Skills Library (50+ ADHD strategies)\n• Treatment Decision Tree (NICE/AAP guidelines)\n• Myths vs Facts (research citations)\n• Progress Dashboard (levels, achievements)\n\n**For Parents:** Homework support, behavior strategies, school tools\n**For Teachers:** Classroom management, attention techniques, assessments\n**For Carers:** Daily structure, practical strategies, wellbeing support\n\n**Tip:** Start with a short focus session or check today's quests!`;
      } else if (cfg.pageId === 'autism') {
        response += `**Autism Hub Tools:** 🌟\n\n${platformInfo.features.autism.map((f: string) => `• ${f}`).join('\n')}\n\n**Available Now:**\n• Calm Toolkit (breathing, grounding, sensory)\n• Skills Library (50+ strategies, age-adapted)\n• Education Pathways (EHCP/IEP/504 complete guides)\n• Workplace Adjustments (15+ professional templates)\n• PubMed Search (35M+ research articles)\n• Printable Resources (50+ templates)\n• Crisis Support (UK/US/EU contacts)\n\n**For Parents:** EHCP/IEP guidance, home strategies, school collaboration\n**For Teachers:** Classroom adaptations, visual schedules, behavior support\n**For Carers:** Daily support, communication techniques, self-care\n\n**Tip:** Try the Calm Toolkit for regulation or browse printable resources!`;
      } else {
        response += `**Page-Specific Tools:**\n${cfg.sections.map((s) => `• **${s.name}** – ${s.description}`).join('\n')}\n\n**Platform-Wide Features:**\n• Breathing exercises (5 techniques)\n• Progress tracking (XP, levels, streaks)\n• Printable resources (100+ templates)\n• Evidence-based guidance (NICE, CDC, NHS)\n\n**Main Hubs:**\n• **ADHD Hub (/adhd)** – Focus tools, quests, strategies\n• **Autism Hub (/autism)** – Calm toolkit, education pathways\n• **Breathing (/breathing)** – Guided breathing exercises\n\n**Ask me about:**\n• Specific tools on this page\n• Navigation to other hubs\n• How to use any feature`;
      }
      
      return response;
    }
    
    // === PRINTABLE RESOURCES ===
    if (q.includes('print') || q.includes('download') || q.includes('template') || q.includes('pdf')) {
      return `**Printable Resources** 📄\n\nNeuroBreath offers downloadable templates and resources:\n\n**In the Autism Hub (/autism):**\n• EHCP/IEP request letter templates\n• Evidence gathering checklists\n• Classroom adjustment plans\n• Meeting preparation guides\n• Workplace adjustment requests\n\n**How to use:**\n1. Go to the **Resources Library** section\n2. Filter by audience (Parent/Teacher/Employer)\n3. Fill in the template\n4. Download as PDF or TXT\n\nPerfect for home-school collaboration!`;
    }
    
    // === EDUCATION PATHWAYS ===
    if (q.includes('ehcp') || q.includes('iep') || q.includes('504') || q.includes('education') || q.includes('school support')) {
      return `**Education Pathways Guide** 🎓\n\nNeuroBreath helps navigate education support systems:\n\n**🇬🇧 UK:** EHCP (Education, Health and Care Plan)\n**🇺🇸 US:** IEP (Individualized Education Program) & 504 Plans\n**🇪🇺 EU:** Inclusive Education frameworks\n\n**What we provide:**\n• Step-by-step application guides\n• Legal references and rights\n• Template request letters\n• Progress tracking checklists\n• Appeal process information\n\n👉 Visit **/autism** → **Education Pathways** section`;
    }
    
    // === WORKPLACE ===
    if (q.includes('workplace') || q.includes('work') || q.includes('job') || q.includes('employer') || q.includes('accommodation')) {
      return `**Workplace Adjustments** 💼\n\nNeuroBreath helps with workplace support:\n\n**What we offer:**\n• 15+ adjustment templates\n• UK Equality Act / US ADA guidance\n• Formal request letter generator\n• Evidence-based examples\n• Employer-friendly explanations\n\n**Examples:**\n• Flexible working hours\n• Quiet workspace options\n• Written instructions preference\n• Sensory accommodations\n\n👉 Visit **/autism** → **Workplace Adjustments** section`;
    }
    
    // === FOCUS / POMODORO ===
    if (q.includes('focus') || q.includes('pomodoro') || q.includes('timer') || q.includes('concentrate')) {
      return `**Focus Pomodoro Timer** ⏱️\n\nOur ADHD-friendly focus timer helps manage attention:\n\n**Features:**\n• Flexible durations (5-50 minutes)\n• ADHD-optimized intervals\n• Dopamine tips during breaks\n• Session streak tracking\n• Audio/visual notifications\n\n**Evidence Base:**\nTime-based work intervals (Pomodoro Technique) are effective for ADHD because they:\n• Create external structure for attention regulation\n• Provide frequent dopamine hits through completion\n• Reduce overwhelming sense of endless tasks\n• Allow for movement breaks essential for ADHD brains\n\n**Tips for success:**\n• Start with shorter sessions (15-25 min)\n• Take proper breaks (research shows 5-10 min optimal)\n• Use the dopamine tips!\n\n👉 **[Start a focus session now](/breathing/focus)**\n\n**Source**: NICE NG87 recommends environmental modifications and structured routines as first-line support for ADHD.`;
    }
    
    // === QUESTS / GAMIFICATION ===
    if (q.includes('quest') || q.includes('xp') || q.includes('level') || q.includes('gamif') || q.includes('reward') || q.includes('streak')) {
      return `**Daily Quests & Gamification** 🏆\n\nNeuroBreath uses gamification to build habits:\n\n**How it works:**\n• Complete daily quests to earn XP\n• Level up as you accumulate XP\n• Build streaks for consistency\n• Earn badges and achievements\n\n**Why gamification?**\nResearch shows dopamine-driven rewards help ADHD brains stay motivated and build lasting habits.\n\n**Tips:**\n• Check quests each morning\n• Start with easier quests\n• Don't break the streak!\n\n👉 Available in both **/adhd** and **/autism** hubs`;
    }
    
    // === CALMING / BREATHING ===
    if (q.includes('calm') || q.includes('breath') || q.includes('relax') || q.includes('anxiety') || q.includes('stress') || q.includes('regulation')) {
      return `**Calm Toolkit** 🧘\n\nEvidence-based calming techniques:\n\n**Breathing Exercises:**\n• Box Breathing (4-4-4-4)\n• Coherent Breathing\n• No-Hold Variants (safer)\n\n**Other Techniques:**\n• 5-4-3-2-1 Grounding\n• Sensory Reset\n• Movement Breaks\n\n**Features:**\n• Guided timers\n• Safety warnings\n• Age adaptations\n• Mood tracking before/after\n\n👉 Visit **/autism** → **Calm Toolkit** section`;
    }
    
    // === CRISIS SUPPORT ===
    if (q.includes('crisis') || q.includes('emergency') || q.includes('help now') || q.includes('urgent')) {
      return `**Crisis Support** 🆘\n\nIf you or someone needs immediate help:\n\n**🇬🇧 UK:**\n• NHS 111 (non-emergency)\n• Samaritans: 116 123\n• Crisis Text: Text SHOUT to 85258\n\n**🇺🇸 US:**\n• 988 Suicide & Crisis Lifeline\n• Crisis Text: Text HOME to 741741\n\n**🇪🇺 EU:**\n• 112 (Emergency)\n\n👉 Full resources at **/autism** → **Crisis Support** section\n\n⚠️ If in immediate danger, call emergency services.`;
    }
    
    // === PROGRESS TRACKING ===
    if (q.includes('progress') || q.includes('track') || q.includes('data') || q.includes('privacy') || q.includes('safe')) {
      return `**Progress Tracking** 📊\n\nNeuroBreath tracks your journey safely:\n\n**What's tracked:**\n• Practice sessions & minutes\n• Quests completed\n• XP & level progression\n• Streaks & personal bests\n• Badges earned\n\n**Privacy:**\n• Data stored locally on your device\n• No account required\n• You control your data\n• Reset anytime\n\n**Why track?**\nSee what strategies work for you and celebrate progress!`;
    }
    
    // === HOME-SCHOOL ===
    if (q.includes('home') && q.includes('school') || q.includes('parent') && q.includes('teacher') || q.includes('collaborat')) {
      return `**Home-School Collaboration** 🏠🏫\n\nNeuroBreath supports consistency between home and school:\n\n**Tools for collaboration:**\n• Printable strategy cards\n• Progress reports to share\n• Meeting preparation templates\n• Consistent skill language\n• Shared daily quests\n\n**For Parents:**\n• Understand what works at school\n• Reinforce strategies at home\n\n**For Teachers:**\n• Evidence-based classroom tools\n• Parent communication templates\n\n👉 Explore the **Resources Library** in the Autism Hub`;
    }
    
    // === GETTING STARTED ===
    if (q.includes('start') || q.includes('begin') || q.includes('first') || q.includes('new here') || q.includes('how do i use')) {
      if (cfg.pageId === 'home') {
        return `**Getting Started with NeuroBreath** 🚀\n\n**Step 1:** Choose your hub:\n• **/adhd** – For ADHD support\n• **/autism** – For autism support\n\n**Step 2:** Explore the tools\n• Try the Focus Timer or Calm Toolkit\n• Check Daily Quests\n• Browse the Skills Library\n\n**Step 3:** Track your progress\n• Complete activities to earn XP\n• Build streaks\n• See what works for you\n\n**Tip:** Click the 🗺️ map icon for a guided tour of any page!`;
      }
      return `**Getting Started on ${cfg.pageName}** 🚀\n\nI'd suggest starting with:\n\n**1. ${cfg.sections[0]?.name}**\n${cfg.sections[0]?.description}\n\n**2. Daily Quests**\nComplete small tasks to build habits and earn XP!\n\n**3. Skills Library**\nExplore evidence-based strategies\n\n💡 **Tip:** Click the 🗺️ map icon above for a guided tour!`;
    }
    
    // === SECTION-SPECIFIC HELP ===
    for (const section of cfg.sections) {
      const sectionWords = section.name.toLowerCase().split(' ');
      if (sectionWords.some((w: string) => w.length > 3 && q.includes(w))) {
        return `**${section.name}** ℹ️\n\n${section.description}\n\n**Tips:**\n${section.tips.map((t: string) => `• ${t}`).join('\n')}\n\n👉 Scroll to find this section on the page!`;
      }
    }
    
    // === DEFAULT HELPFUL RESPONSE ===
    return `I'm here to help you navigate **${cfg.pageName}**! 🤝\n\n**Popular questions:**\n• "What tools are available?"\n• "How do I get started?"\n• "What is NeuroBreath?"\n• "Show me printable resources"\n\n**This page includes:**\n${cfg.sections.slice(0, 3).map((s) => `• **${s.name}**: ${s.description}`).join('\n')}\n\n💡 **Tip:** Click the 🗺️ map icon for a guided tour!`;
  }, [pageContent, scrollToSection]);
  
  // Generate AI response
  const generateResponse = useCallback(async (userMessage: string, intentId?: string): Promise<Message> => {
    const q = userMessage.toLowerCase();
    const isNavigationIntent =
      q.includes('tour') ||
      q.includes('map') ||
      q.includes("what's on this page") ||
      q.includes('what is on this page') ||
      q.includes('page content') ||
      q.includes('sections') ||
      ((q.includes('show') || q.includes('find') || q.includes('where') || q.includes('take me') || q.includes('scroll')) &&
        pageContent.sections.length > 0);

    if (isNavigationIntent) {
      const local = getLocalResponse(userMessage, config);
      return {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: local,
        timestamp: new Date(),
        availableTools: pageContent.features,
      };
    }

    // Load user preferences for jurisdiction
    const prefs = loadPreferences();
    const userSnapshot = buildUserSnapshot();

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 30000);
      const response = await fetch('/api/buddy/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage,
          intentId,
          pathname,
          jurisdiction: prefs.regional.jurisdiction,
          userSnapshot,
        }),
        signal: controller.signal,
      });

      window.clearTimeout(timeoutId);

      // Always attempt to parse JSON so we can display server-provided fallback
      // answers even when the API is in a degraded state.
      let data: (BuddyAskResponse & { error?: string }) | null = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const maybeError = (data as { error?: string } | null)?.error;
        const detail = maybeError ? ` ${maybeError}` : '';
        throw new Error(`Request failed (${response.status}).${detail}`);
      }

      if ((data as { error?: string } | null)?.error) {
        throw new Error((data as { error?: string })?.error || 'Assistant error');
      }

      const answer = data?.answer;
      const citations = data?.citations || [];
      const meta = data?.meta;

      const contentForAria =
        answer
          ? [
              answer.title,
              answer.summary,
              ...answer.sections.map((s) => `${s.heading}. ${s.text}`),
              answer.safety.message ? `When to get help. ${answer.safety.message}` : '',
            ]
              .filter(Boolean)
              .join('\n')
          : "I couldn't find a verified answer for that right now. Try rephrasing, or ask about what's on this page.";

      return {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: contentForAria,
        timestamp: new Date(),
        availableTools: pageContent.features,
        buddyAnswer: answer,
        buddyCitations: citations,
        buddyMeta: meta,
      };
    } catch (error) {
      console.error('[Buddy] AI response error:', error);
      throw error;
    }
  }, [buildUserSnapshot, config, getLocalResponse, pageContent.features, pageContent.sections.length, pathname]);

  
  // Unified send pipeline for typed sends + quick questions.
  const sendMessage = useCallback(async (text?: string, origin: 'typed' | 'quick' | 'system' = 'typed', intentId?: string): Promise<void> => {
    const raw = (typeof text === 'string' ? text : input).trim();
    if (!raw || isLoading) return;

    if (process.env.NODE_ENV === 'development') {
      console.debug('[Buddy] sendMessage', { origin, raw });
    }

    setLastError(null);
    lastSentMessageRef.current = raw;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: raw,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // If audio is speaking, stop immediately before sending the next request.
    stop();

    // Keep focus in the composer for fast follow-ups.
    queueMicrotask(() => inputRef.current?.focus());

    try {
      const assistantMessage = await generateResponse(raw, intentId);
      setMessages((prev) => [...prev, assistantMessage]);

      if (autoSpeak && assistantMessage.content) {
        speak(assistantMessage.content);
      }

      requestAnimationFrame(() => inputRef.current?.focus());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      setLastError(message);
      toast.error('Could not send message', { description: message });
      console.error('[Buddy] sendMessage failed:', { message: raw, error });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I couldn't send that right now. Please try again.\n\nIf this keeps happening, check your connection or refresh the page.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Restore input so the user can edit/resend.
      setInput(raw);
      requestAnimationFrame(() => inputRef.current?.focus());
    } finally {
      setIsLoading(false);
    }
  }, [autoSpeak, generateResponse, input, isLoading, speak, stop]);

  const retryLast = useCallback(() => {
    if (!lastSentMessageRef.current) return;
    void sendMessage(lastSentMessageRef.current, 'system');
  }, [sendMessage]);
  
  // Page tour - now using actual page content
  const startTour = () => {
    // Don't start a new tour if one is already in progress
    if (showTour) {
      const alreadyActiveMessage: Message = {
        id: `tour-already-active-${Date.now()}`,
        role: 'assistant',
        content: `📍 **Tour In Progress**\n\nA page tour is already running! Click "Next Section" below to continue, or ask me to restart the tour if you'd like to start over.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, alreadyActiveMessage]);
      if (autoSpeak) {
        speak(alreadyActiveMessage.content);
      }
      return;
    }
    
    const pageKey = getPageKeyForTour(pathname);
    const discovered = discoverTourSteps(pageKey);
    if (discovered.length === 0) {
      const msg: Message = {
        id: `tour-none-${Date.now()}`,
        role: 'assistant',
        content:
          "I couldn't find any tour-worthy sections on this page yet. If you want a curated tour, add stable anchors like data-tour=\"nb:<pageKey>:<sectionKey>\" (plus data-tour-title / data-tour-order).",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, msg]);
      if (autoSpeak) speak(msg.content);
      return;
    }

    setTourSteps(discovered);
    setShowTour(true);
    setCurrentTourStep(0);
    setIsOpen(false);

    const first = discovered[0];
    const tourIntro: Message = {
      id: `tour-start-${Date.now()}`,
      role: 'assistant',
      content: `🎯 **Live Page Tour Started!**\n\nI've scanned this page and found ${discovered.length} sections to explore.\n\n**Step 1/${discovered.length}: ${first?.title}**\n\n**Note:** I’ll keep the page visible and anchor the tour panel to each section as we go.`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, tourIntro]);
    if (autoSpeak) speak(tourIntro.content);
  };
  
  const nextTourStep = () => {
    const nextStep = currentTourStep + 1;
    if (nextStep >= tourSteps.length) {
      setShowTour(false);
      setCurrentTourStep(0);
      setTourSteps([]);

      const tourEnd: Message = {
        id: `tour-end-${Date.now()}`,
        role: 'assistant',
        content: `🎉 **Live Tour Complete!**\n\nYou've explored all ${tourSteps.length} sections of ${config.pageName}!`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, tourEnd]);
      if (autoSpeak) speak(tourEnd.content);
      return;
    }

    setCurrentTourStep(nextStep);
  };
  
  return (
    <>
      <AnchoredPageTour
        open={showTour}
        steps={tourSteps}
        stepIndex={Math.min(currentTourStep, Math.max(0, tourSteps.length - 1))}
        heading="NeuroBreath Buddy"
        subheading={`${config.pageName} Guide`}
        introLine={tourIntroLine}
        onStepChange={(nextIndex) => {
          if (nextIndex < 0 || nextIndex >= tourSteps.length) return;
          setCurrentTourStep(nextIndex);
        }}
        onClose={() => {
          setShowTour(false);
          setCurrentTourStep(0);
          setTourSteps([]);
        }}
      />
      {/* Floating trigger button */}
      <div
        className={cn("fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60]", isOpen && "hidden")}
        data-tour="nb:focus-garden-training:buddy-trigger"
        data-tour-title="NeuroBreath Buddy"
        data-tour-order="80"
      >
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
          }}
          className={cn(
            "h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg",
            "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90",
            "transition-all duration-200 hover:scale-105 active:scale-95",
            "relative group touch-manipulation"
          )}
          size="icon"
          aria-label="Open NeuroBreath Buddy assistant (Cmd+K)"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          <span className="absolute -top-8 right-0 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-md hidden sm:block pointer-events-none max-w-[min(16rem,calc(100vw-2rem))] whitespace-normal break-words text-right">
            Press ⌘K
          </span>
        </Button>
      </div>
      
      {/* Chat dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          ref={dialogRef}
          className={cn(
            "p-0 flex flex-col transition-all overflow-hidden",
            "z-[60]",
            // 2% gap from top (navigation bar) - applies to all viewports
            "top-[calc(50%+1vh)]",
            // Mobile-first: large width filling nearly the full screen
            "!w-[96vw] !max-w-[96vw]",
            // Small devices
            "sm:!w-[94vw] sm:!max-w-[820px]",
            // Medium devices and tablets
            "md:!w-[92vw] md:!max-w-[960px]",
            // Large devices
            "lg:!w-[90vw] lg:!max-w-[1120px]",
            // Extra-large devices
            "xl:!w-[88vw] xl:!max-w-[1240px]",
            // Heights
            "!h-[92vh] !max-h-[92vh]",
            "sm:!h-[90vh] sm:!max-h-[90vh]",
            "md:!h-[88vh] md:!max-h-[88vh]",
            // Minimized state
            isMinimized ? "!h-[120px] sm:!h-[130px]" : ""
          )}
          aria-describedby="buddy-description"
          role="dialog"
          aria-modal="true"
        >
          {/* Hidden description for screen readers */}
          <div id="buddy-description" className="sr-only">
            NeuroBreath Buddy is an AI assistant that can help you navigate this page,
            answer questions about neurodiversity support, and guide you to relevant resources.
          </div>
          
          {/* ARIA live region for announcing messages to screen readers */}
          <div 
            className="sr-only" 
            role="status" 
            aria-live="polite" 
            aria-atomic="true"
          >
            {isLoading && "NeuroBreath Buddy is thinking..."}
            {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && 
              `NeuroBreath Buddy says: ${messages[messages.length - 1].content.slice(0, 100)}`
            }
          </div>
          {/* Header */}
          <DialogHeader className="p-3 sm:p-4 md:p-5 pb-2 sm:pb-3 border-b border-border bg-gradient-to-r from-primary/10 to-purple-500/10 flex-shrink-0">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-sm sm:text-base md:text-lg font-semibold truncate">NeuroBreath Buddy</DialogTitle>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground truncate">{config.pageName} Guide</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 flex-shrink-0">
                {isSpeaking && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-destructive hover:text-destructive hover:bg-destructive/10 touch-manipulation active:scale-95 transition-transform"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      stop();
                    }}
                    title="Stop speaking"
                    aria-label="Stop speaking"
                  >
                    <StopCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-primary touch-manipulation active:scale-95 transition-transform"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setAutoSpeak(!autoSpeak);
                  }}
                  title={autoSpeak ? 'Auto-speak on' : 'Auto-speak off'}
                  aria-label={autoSpeak ? 'Turn off auto-speak' : 'Turn on auto-speak'}
                >
                  {autoSpeak ? <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5" /> : <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-primary touch-manipulation active:scale-95 transition-transform"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    startTour();
                  }}
                  title="Start page tour"
                  aria-label="Start guided page tour"
                >
                  <Map className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-muted-foreground hover:text-foreground hidden sm:inline-flex touch-manipulation active:scale-95 transition-transform"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    exportChat();
                  }}
                  title="Export chat history"
                  aria-label="Export chat history"
                  disabled={messages.length <= 1}
                >
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-muted-foreground hover:text-foreground touch-manipulation active:scale-95 transition-transform"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    clearChat();
                  }}
                  title="Clear chat history"
                  aria-label="Clear chat history"
                >
                  <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-muted-foreground hover:text-foreground touch-manipulation active:scale-95 transition-transform"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMinimized(!isMinimized);
                  }}
                  title={isMinimized ? 'Maximize' : 'Minimize'}
                  aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5" /> : <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5" />}
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {/* Messages */}
          {!isMinimized && (
          <div className="flex-1 p-3 sm:p-4 md:p-5 overflow-y-auto min-h-0" ref={scrollRef}>
            <div className="space-y-3 sm:space-y-4">
              {(() => {
                const currentAnswer = [...messages].reverse().find((m) => m.role === 'assistant');
                if (!currentAnswer) {
                  return (
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Ask a question to get a response.
                    </div>
                  );
                }

                const message = currentAnswer;
                return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2 sm:gap-3",
                    'justify-start'
                  )}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5 text-primary" />
                  </div>
                  <div
                    className={cn(
                      "max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 text-xs sm:text-sm md:text-base group relative flex flex-col",
                      'bg-muted rounded-bl-md'
                    )}
                  >
                    <div className="!max-h-none !overflow-visible pr-1 sm:pr-2 md:pr-3">
                      <BuddyErrorBoundary>
                        {message.buddyAnswer ? (
                          <BuddyAnswerCard
                            answer={message.buddyAnswer}
                            citations={message.buddyCitations || []}
                            meta={message.buddyMeta}
                            renderLine={renderMessage}
                          />
                        ) : (
                          <div className="whitespace-pre-wrap leading-relaxed break-words">
                            {message.content.split('\n').map((line, i) => (
                              <span key={i}>
                                {renderMessage(line)}
                                {i < message.content.split('\n').length - 1 && <br />}
                              </span>
                            ))}
                          </div>
                        )}
                      </BuddyErrorBoundary>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 mt-2 pt-2 border-t border-border/50 flex-shrink-0">
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-6 sm:h-7 md:h-8 px-2 sm:px-3 md:px-4 text-xs md:text-sm bg-background/50 hover:bg-background border-border/50 touch-manipulation active:scale-95 transition-transform"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isSpeaking) {
                              stop();
                              return;
                            }
                            speak(message.content);
                          }}
                          aria-label="Listen to this message"
                        >
                          <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5 mr-1" />
                          <span className="text-[10px] sm:text-xs md:text-sm">Listen</span>
                        </Button>
                        {isSpeaking && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-6 sm:h-7 md:h-8 px-2 sm:px-3 md:px-4 text-xs md:text-sm bg-destructive/10 hover:bg-destructive/20 border-destructive/50 text-destructive touch-manipulation active:scale-95 transition-transform"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              stop();
                            }}
                            aria-label="Stop speaking"
                          >
                            <StopCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5 mr-1" />
                            <span className="text-[10px] sm:text-xs md:text-sm">Stop</span>
                          </Button>
                        )}
                      </>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 sm:h-7 md:h-8 px-2 sm:px-3 md:px-4 text-xs md:text-sm bg-background/50 hover:bg-background border-border/50 touch-manipulation active:scale-95 transition-transform"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          copyMessage(message.id, message.content);
                        }}
                        aria-label="Copy message"
                      >
                        {copiedMessageId === message.id ? (
                          <><Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5 mr-1" /><span className="text-[10px] sm:text-xs md:text-sm">Copied</span></>
                        ) : (
                          <><Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5 mr-1" /><span className="text-[10px] sm:text-xs md:text-sm">Copy</span></>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                );
              })()}
              
              {isLoading && (
                <div className="flex gap-2 sm:gap-3 md:gap-4 justify-start">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5 text-primary animate-pulse" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Tour navigation */}
              {showTour && (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      nextTourStep();
                    }}
                    className="gap-2 text-xs sm:text-sm touch-manipulation active:scale-95 transition-transform"
                    size="sm"
                  >
                    {currentTourStep + 1 >= tourSteps.length ? 'Finish Tour' : 'Next Section'}
                    <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          )}
          
          {/* Quick questions */}
          {!isMinimized && (
          <div className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 border-t border-border flex-shrink-0">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2 md:mb-2.5">
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Quick questions:</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-5 sm:h-6 px-1.5 sm:px-2 text-[10px] sm:text-xs sm:hidden touch-manipulation active:scale-95 transition-transform"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  exportChat();
                }}
                disabled={messages.length <= 1}
                aria-label="Export chat"
              >
                <Download className="h-3 w-3 mr-0.5" />
                Export
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 max-h-24 sm:max-h-32 md:max-h-36 overflow-y-auto">
              {config.quickQuestions.map((question: string, idx: number) => (
                <Button
                  key={idx}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 sm:h-7 md:h-8 text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 md:px-4 flex-shrink-0 leading-tight touch-manipulation active:scale-95 transition-transform"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setInput(question);
                    void sendMessage(question, 'quick');
                                      const id = getBuddyIntentIdByLabel(question);
                                      void sendMessage(question, 'quick', id);
                  }}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
          )}
          
          {/* Input area */}
          {!isMinimized && (
          <div className="p-3 sm:p-4 md:p-5 pt-2 sm:pt-2.5 md:pt-3 border-t border-border flex-shrink-0">
            {lastError && (
              <div className="mb-2 flex items-start justify-between gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2" role="alert" aria-live="polite">
                <p className="text-xs sm:text-sm text-destructive">{lastError}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    retryLast();
                  }}
                >
                  Retry
                </Button>
              </div>
            )}
            <form
              className="flex gap-1.5 sm:gap-2 md:gap-2.5"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isLoading && input.trim()) {
                  void sendMessage(undefined, 'typed');
                }
              }}
            >
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onCompositionStart={() => {
                  isComposingRef.current = true;
                }}
                onCompositionEnd={() => {
                  isComposingRef.current = false;
                }}
                onKeyDown={(e) => {
                  // Submit on Enter, but allow Shift+Enter for new lines. Avoid sending mid-IME composition.
                  if (e.key === 'Enter' && !e.shiftKey && !isLoading && !isComposingRef.current) {
                    e.preventDefault();
                    void sendMessage(undefined, 'typed');
                  }
                }}
                placeholder="Ask me about this page..."
                className="flex-1 min-h-9 sm:min-h-10 md:min-h-11 max-h-28 sm:max-h-32 md:max-h-36 resize-none text-xs sm:text-sm md:text-base touch-manipulation"
                disabled={isLoading}
                aria-label="Type your question"
                aria-describedby="buddy-input-hint"
                autoComplete="off"
              />
              <span id="buddy-input-hint" className="sr-only">
                Press Enter to send your message, or Shift+Enter for a new line
              </span>
              <Button
                type="submit"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 flex-shrink-0 touch-manipulation active:scale-95 transition-transform"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5" />
              </Button>
            </form>
          </div>
          )}
          
          {/* Page indicator */}
          <div className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 border-t border-border bg-muted/50 flex-shrink-0">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-2.5 text-[10px] sm:text-xs md:text-sm text-muted-foreground flex-wrap">
              <Badge variant="secondary" className="text-[10px] sm:text-xs md:text-sm h-5 sm:h-6 md:h-auto">
                {config.pageId === 'adhd' && <Brain className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 mr-0.5 sm:mr-1" />}
                {config.pageId === 'autism' && <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 mr-0.5 sm:mr-1" />}
                {config.pageId === 'home' && <Home className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 mr-0.5 sm:mr-1" />}
                <span className="truncate max-w-[120px] sm:max-w-none">{config.pageName}</span>
              </Badge>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{pageContent.sections.length > 0 ? `${pageContent.sections.length} detected sections` : `${config.sections.length} sections`}</span>
              {pageContent.features.length > 0 && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:flex items-center gap-1">
                    <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    {pageContent.features.length} features
                  </span>
                </>
              )}
            </div>

            <div className="mt-2 flex items-center justify-center gap-2">
              <ShareButton variant="outline" size="sm" className="h-7 px-2 text-[10px] sm:text-xs">
                <>
                  <Share2 className="h-3.5 w-3.5 mr-1" />
                  Share
                </>
              </ShareButton>

              <InstallButton
                variant="outline"
                size="sm"
                className="h-7 px-2 text-[10px] sm:text-xs"
                label="Install"
                showFallbackLink
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
