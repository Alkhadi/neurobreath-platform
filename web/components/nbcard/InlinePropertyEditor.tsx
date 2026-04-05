"use client";

import { useCallback, useRef, useState } from "react";
import type { Profile } from "@/lib/utils";
import { ChevronDown, ChevronRight, Upload, Globe, User, Briefcase, MapPin, CreditCard, Megaphone, Heart, Palette } from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok, FaLinkedin, FaTwitter, FaYoutube, FaSnapchat, FaPinterest, FaWhatsapp } from "react-icons/fa";
import { storeAsset, generateAssetKey } from "@/app/contact/lib/nbcard-assets";
import { GradientSelector } from "@/app/contact/components/gradient-selector";
import { toast } from "sonner";

type FrameCategory = "PROFILE" | "ADDRESS" | "BANK" | "BUSINESS" | "FLYER" | "WEDDING";

const FRAME_CATEGORY_OPTIONS: Array<{ value: FrameCategory; label: string; icon: typeof User }> = [
  { value: "PROFILE", label: "Profile Card", icon: User },
  { value: "ADDRESS", label: "Address Card", icon: MapPin },
  { value: "BANK", label: "Bank Details", icon: CreditCard },
  { value: "BUSINESS", label: "Business Card", icon: Briefcase },
  { value: "FLYER", label: "Flyer", icon: Megaphone },
  { value: "WEDDING", label: "Wedding", icon: Heart },
];

interface InlinePropertyEditorProps {
  profile: Profile;
  onProfileUpdate: (profile: Profile) => void;
  /** Called on blur/Enter to commit to undo history */
  onCommit: (profile: Profile) => void;
}

function CollapsibleSection({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon?: typeof User;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors"
      >
        {Icon && <Icon className="h-4 w-4 text-gray-500 shrink-0" />}
        <span className="text-sm font-semibold text-gray-800 flex-1">{title}</span>
        {open ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
      </button>
      {open && <div className="px-3 pb-3 space-y-2">{children}</div>}
    </div>
  );
}

function FieldInput({
  label,
  id,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  maxLength,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  type?: string;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-gray-500 mb-0.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
      />
    </div>
  );
}

export function InlinePropertyEditor({ profile, onProfileUpdate, onCommit }: InlinePropertyEditorProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const category: FrameCategory = profile.cardCategory || "PROFILE";

  const update = useCallback(
    (patch: Partial<Profile>) => {
      onProfileUpdate({ ...profile, ...patch });
    },
    [profile, onProfileUpdate],
  );

  const updateNested = useCallback(
    (key: "addressCard" | "bankCard" | "businessCard" | "flyerCard" | "weddingCard", field: string, value: string) => {
      const existing = (profile[key] as Record<string, unknown> | undefined) ?? {};
      onProfileUpdate({ ...profile, [key]: { ...existing, [field]: value } });
    },
    [profile, onProfileUpdate],
  );

  const commit = useCallback(() => {
    onCommit(profile);
  }, [profile, onCommit]);

  const handlePhotoUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const key = generateAssetKey("avatar");
        await storeAsset(new Blob([await (await fetch(dataUrl)).blob()]), key);
        onProfileUpdate({ ...profile, photoUrl: dataUrl });
        onCommit({ ...profile, photoUrl: dataUrl });
        toast.success("Photo uploaded");
      } catch {
        toast.error("Failed to upload photo");
      } finally {
        setUploading(false);
      }
    },
    [profile, onProfileUpdate, onCommit],
  );

  const handleBgUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const key = generateAssetKey("bg");
        await storeAsset(new Blob([await (await fetch(dataUrl)).blob()]), key);
        onProfileUpdate({ ...profile, backgroundUrl: dataUrl });
        onCommit({ ...profile, backgroundUrl: dataUrl });
        toast.success("Background uploaded");
      } catch {
        toast.error("Failed to upload background");
      } finally {
        setUploading(false);
      }
    },
    [profile, onProfileUpdate, onCommit],
  );

  const handleCategoryChange = useCallback(
    (newCategory: FrameCategory) => {
      const patch: Partial<Profile> = { cardCategory: newCategory === "PROFILE" ? undefined : newCategory };
      if (newCategory === "ADDRESS") patch.addressCard = profile.addressCard ?? {};
      if (newCategory === "BANK") patch.bankCard = profile.bankCard ?? {};
      if (newCategory === "BUSINESS") patch.businessCard = profile.businessCard ?? {};
      if (newCategory === "FLYER") patch.flyerCard = profile.flyerCard ?? { headline: "", subheadline: "", ctaText: "", ctaUrl: "" };
      if (newCategory === "WEDDING") patch.weddingCard = profile.weddingCard ?? { headline: "", subheadline: "", ctaText: "", ctaUrl: "" };
      const updated = { ...profile, ...patch };
      onProfileUpdate(updated);
      onCommit(updated);
    },
    [profile, onProfileUpdate, onCommit],
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-2.5">
        <h3 className="text-sm font-bold text-white">Edit Card Properties</h3>
      </div>

      {/* Card Type Selector */}
      <div className="px-3 py-2.5 border-b border-gray-100">
        <label className="block text-xs text-gray-500 mb-1.5">Card Type</label>
        <div className="grid grid-cols-3 gap-1">
          {FRAME_CATEGORY_OPTIONS.map(({ value, label, icon: CatIcon }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleCategoryChange(value)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                category === value
                  ? "bg-purple-100 text-purple-700 border border-purple-300"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <CatIcon className="h-3 w-3 shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Basic Info */}
      <CollapsibleSection title="Basic Info" icon={User} defaultOpen>
        <FieldInput label="Full Name" id="ipe-name" value={profile.fullName || ""} onChange={(v) => update({ fullName: v })} onBlur={commit} placeholder="Your name" />
        <FieldInput label="Job Title" id="ipe-jobtitle" value={profile.jobTitle || ""} onChange={(v) => update({ jobTitle: v })} onBlur={commit} placeholder="Your title" />
        <FieldInput label="Phone" id="ipe-phone" value={profile.phone || ""} onChange={(v) => update({ phone: v })} onBlur={commit} placeholder="+1 555 000 0000" type="tel" />
        <FieldInput label="Email" id="ipe-email" value={profile.email || ""} onChange={(v) => update({ email: v })} onBlur={commit} placeholder="you@example.com" type="email" />
        <FieldInput label="Website" id="ipe-website" value={profile.website || ""} onChange={(v) => update({ website: v })} onBlur={commit} placeholder="https://example.com" type="url" />
        <div>
          <label htmlFor="ipe-description" className="block text-xs text-gray-500 mb-0.5">Description</label>
          <textarea
            id="ipe-description"
            rows={2}
            value={profile.profileDescription || ""}
            onChange={(e) => update({ profileDescription: e.target.value })}
            onBlur={commit}
            placeholder="A short bio or description"
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>
      </CollapsibleSection>

      {/* Media */}
      <CollapsibleSection title="Photo & Background" icon={Upload} defaultOpen>
        <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        <input ref={bgInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center gap-1.5 px-2 py-2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 text-xs"
          >
            <Upload className="h-3 w-3" />
            {profile.photoUrl ? "Change Photo" : "Upload Photo"}
          </button>
          <button
            type="button"
            onClick={() => bgInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center gap-1.5 px-2 py-2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 text-xs"
          >
            <Upload className="h-3 w-3" />
            {profile.backgroundUrl ? "Change BG" : "Upload BG"}
          </button>
        </div>
        {(profile.photoUrl || profile.backgroundUrl) && (
          <div className="flex gap-2">
            {profile.photoUrl && (
              <button
                type="button"
                onClick={() => { update({ photoUrl: undefined }); commit(); }}
                className="text-xs text-red-600 hover:underline"
              >
                Remove photo
              </button>
            )}
            {profile.backgroundUrl && (
              <button
                type="button"
                onClick={() => { update({ backgroundUrl: undefined, frameUrl: undefined }); commit(); }}
                className="text-xs text-red-600 hover:underline"
              >
                Remove background
              </button>
            )}
          </div>
        )}
      </CollapsibleSection>

      {/* Gradient */}
      <CollapsibleSection title="Card Gradient" icon={Palette}>
        <GradientSelector
          selectedGradient={profile.gradient}
          onSelect={(g: string) => {
            update({ gradient: g });
            commit();
          }}
        />
      </CollapsibleSection>

      {/* Social Media */}
      <CollapsibleSection title="Social Media" icon={Globe}>
        {[
          { key: "instagram" as const, label: "Instagram", icon: FaInstagram, placeholder: "https://instagram.com/you" },
          { key: "facebook" as const, label: "Facebook", icon: FaFacebook, placeholder: "https://facebook.com/you" },
          { key: "tiktok" as const, label: "TikTok", icon: FaTiktok, placeholder: "https://tiktok.com/@you" },
          { key: "linkedin" as const, label: "LinkedIn", icon: FaLinkedin, placeholder: "https://linkedin.com/in/you" },
          { key: "twitter" as const, label: "X / Twitter", icon: FaTwitter, placeholder: "https://x.com/you" },
          { key: "youtube" as const, label: "YouTube", icon: FaYoutube, placeholder: "https://youtube.com/@you" },
          { key: "snapchat" as const, label: "Snapchat", icon: FaSnapchat, placeholder: "https://snapchat.com/add/you" },
          { key: "pinterest" as const, label: "Pinterest", icon: FaPinterest, placeholder: "https://pinterest.com/you" },
          { key: "whatsapp" as const, label: "WhatsApp", icon: FaWhatsapp, placeholder: "https://wa.me/1234567890" },
        ].map(({ key, label, icon: SIcon, placeholder }) => (
          <div key={key} className="flex items-center gap-2">
            <SIcon className="h-4 w-4 text-gray-400 shrink-0" />
            <div className="flex-1">
              <input
                type="url"
                value={profile.socialMedia?.[key] || ""}
                onChange={(e) =>
                  update({
                    socialMedia: {
                      ...profile.socialMedia,
                      [key]: e.target.value,
                    },
                  })
                }
                onBlur={commit}
                placeholder={placeholder}
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded-md bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                aria-label={label}
              />
            </div>
          </div>
        ))}
      </CollapsibleSection>

      {/* Address Card Fields */}
      {(category === "ADDRESS" || category === "PROFILE") && (
        <CollapsibleSection title="Address Details" icon={MapPin}>
          <FieldInput label="Address Line 1" id="ipe-addr1" value={profile.addressCard?.addressLine1 || ""} onChange={(v) => updateNested("addressCard", "addressLine1", v)} onBlur={commit} placeholder="Street address" />
          <FieldInput label="Address Line 2" id="ipe-addr2" value={profile.addressCard?.addressLine2 || ""} onChange={(v) => updateNested("addressCard", "addressLine2", v)} onBlur={commit} placeholder="Flat, suite, unit" />
          <div className="grid grid-cols-2 gap-2">
            <FieldInput label="City" id="ipe-city" value={profile.addressCard?.city || ""} onChange={(v) => updateNested("addressCard", "city", v)} onBlur={commit} placeholder="City" />
            <FieldInput label="Postcode" id="ipe-postcode" value={profile.addressCard?.postcode || ""} onChange={(v) => updateNested("addressCard", "postcode", v)} onBlur={commit} placeholder="Postcode" />
          </div>
          <FieldInput label="Country" id="ipe-country" value={profile.addressCard?.country || ""} onChange={(v) => updateNested("addressCard", "country", v)} onBlur={commit} placeholder="Country" />
        </CollapsibleSection>
      )}

      {/* Bank Card Fields */}
      {category === "BANK" && (
        <CollapsibleSection title="Bank Details" icon={CreditCard} defaultOpen>
          <FieldInput label="Account Holder" id="ipe-accname" value={profile.bankCard?.accountName || ""} onChange={(v) => updateNested("bankCard", "accountName", v)} onBlur={commit} placeholder="Account holder name" />
          <FieldInput label="Bank Name" id="ipe-bankname" value={profile.bankCard?.bankName || ""} onChange={(v) => updateNested("bankCard", "bankName", v)} onBlur={commit} placeholder="Bank name" />
          <div className="grid grid-cols-2 gap-2">
            <FieldInput label="Sort Code" id="ipe-sortcode" value={profile.bankCard?.sortCode || ""} onChange={(v) => updateNested("bankCard", "sortCode", v)} onBlur={commit} placeholder="00-00-00" />
            <FieldInput label="Account Number" id="ipe-accnum" value={profile.bankCard?.accountNumber || ""} onChange={(v) => updateNested("bankCard", "accountNumber", v)} onBlur={commit} placeholder="12345678" />
          </div>
          <FieldInput label="IBAN" id="ipe-iban" value={profile.bankCard?.iban || ""} onChange={(v) => updateNested("bankCard", "iban", v)} onBlur={commit} placeholder="GB00 XXXX 0000 0000" />
          <FieldInput label="SWIFT / BIC" id="ipe-swift" value={profile.bankCard?.swiftBic || ""} onChange={(v) => updateNested("bankCard", "swiftBic", v)} onBlur={commit} placeholder="SWIFT/BIC code" />
          <FieldInput label="Reference Note" id="ipe-refnote" value={profile.bankCard?.referenceNote || ""} onChange={(v) => updateNested("bankCard", "referenceNote", v)} onBlur={commit} placeholder="Payment reference" maxLength={60} />
        </CollapsibleSection>
      )}

      {/* Business Card Fields */}
      {category === "BUSINESS" && (
        <CollapsibleSection title="Business Details" icon={Briefcase} defaultOpen>
          <FieldInput label="Company Name" id="ipe-company" value={profile.businessCard?.companyName || ""} onChange={(v) => updateNested("businessCard", "companyName", v)} onBlur={commit} placeholder="Company name" />
          <FieldInput label="Tagline" id="ipe-tagline" value={profile.businessCard?.tagline || ""} onChange={(v) => updateNested("businessCard", "tagline", v)} onBlur={commit} placeholder="Short tagline" />
          <FieldInput label="Services" id="ipe-services" value={profile.businessCard?.services || ""} onChange={(v) => updateNested("businessCard", "services", v)} onBlur={commit} placeholder="Services offered" maxLength={80} />
          <FieldInput label="Website" id="ipe-bizwebsite" value={profile.businessCard?.websiteUrl || ""} onChange={(v) => updateNested("businessCard", "websiteUrl", v)} onBlur={commit} placeholder="https://business.com" type="url" />
          <FieldInput label="Location" id="ipe-location" value={profile.businessCard?.locationNote || ""} onChange={(v) => updateNested("businessCard", "locationNote", v)} onBlur={commit} placeholder="Office location" maxLength={60} />
          <FieldInput label="Hours" id="ipe-hours" value={profile.businessCard?.hours || ""} onChange={(v) => updateNested("businessCard", "hours", v)} onBlur={commit} placeholder="Mon-Fri 9-5" maxLength={60} />
        </CollapsibleSection>
      )}

      {/* Flyer Fields */}
      {category === "FLYER" && (
        <CollapsibleSection title="Flyer Details" icon={Megaphone} defaultOpen>
          <FieldInput label="Headline" id="ipe-headline" value={profile.flyerCard?.headline || ""} onChange={(v) => updateNested("flyerCard", "headline", v)} onBlur={commit} placeholder="Event headline" />
          <FieldInput label="Subheadline" id="ipe-subheadline" value={profile.flyerCard?.subheadline || ""} onChange={(v) => updateNested("flyerCard", "subheadline", v)} onBlur={commit} placeholder="Event details" />
          <FieldInput label="CTA Text" id="ipe-ctatext" value={profile.flyerCard?.ctaText || ""} onChange={(v) => updateNested("flyerCard", "ctaText", v)} onBlur={commit} placeholder="Buy Tickets" />
          <FieldInput label="CTA URL" id="ipe-ctaurl" value={profile.flyerCard?.ctaUrl || ""} onChange={(v) => updateNested("flyerCard", "ctaUrl", v)} onBlur={commit} placeholder="https://tickets.com" type="url" />
        </CollapsibleSection>
      )}

      {/* Wedding Fields */}
      {category === "WEDDING" && (
        <CollapsibleSection title="Wedding Details" icon={Heart} defaultOpen>
          <FieldInput label="Headline" id="ipe-wheadline" value={profile.weddingCard?.headline || ""} onChange={(v) => updateNested("weddingCard", "headline", v)} onBlur={commit} placeholder="We're getting married!" />
          <FieldInput label="Subheadline" id="ipe-wsubheadline" value={profile.weddingCard?.subheadline || ""} onChange={(v) => updateNested("weddingCard", "subheadline", v)} onBlur={commit} placeholder="Date & venue" />
          <FieldInput label="RSVP Text" id="ipe-wctatext" value={profile.weddingCard?.ctaText || ""} onChange={(v) => updateNested("weddingCard", "ctaText", v)} onBlur={commit} placeholder="RSVP Here" />
          <FieldInput label="RSVP URL" id="ipe-wctaurl" value={profile.weddingCard?.ctaUrl || ""} onChange={(v) => updateNested("weddingCard", "ctaUrl", v)} onBlur={commit} placeholder="https://rsvp.com" type="url" />
        </CollapsibleSection>
      )}
    </div>
  );
}
