import type { Contact, Profile } from '@/lib/utils';
import { buildMapHref } from '@/lib/nbcard/mapHref';

export type ShareFile = {
  file: File;
  title: string;
  text?: string;
};

export type VCardOptions = {
  includeAddress?: boolean;
  includeBusiness?: boolean;
  shareUrl?: string;
};

export function renderBankQrText(profile: Profile, shareUrl: string): string {
  const lines: string[] = [];
  lines.push('NBCard — Bank Details');
  if (profile.fullName) lines.push(`Name: ${profile.fullName}`);

  const b = profile.bankCard;
  if (b?.bankName) lines.push(`Bank: ${b.bankName}`);
  if (b?.accountName) lines.push(`Account Name: ${b.accountName}`);
  if (b?.sortCode) lines.push(`Sort Code: ${b.sortCode}`);
  if (b?.accountNumber) lines.push(`Account Number: ${b.accountNumber}`);
  if (b?.iban) lines.push(`IBAN: ${b.iban}`);
  if (b?.swiftBic) lines.push(`SWIFT/BIC: ${b.swiftBic}`);
  if (b?.referenceNote) lines.push(`Reference: ${b.referenceNote}`);
  if (b?.paymentLink) lines.push(`${b.paymentLinkLabel || 'Payment Link'}: ${b.paymentLink}`);

  lines.push('');
  lines.push('Profile:');
  lines.push(shareUrl);
  return lines.join('\n');
}

export function renderFlyerQrText(profile: Profile, shareUrl: string): string {
  const lines: string[] = [];
  const isWedding = (profile.cardCategory ?? "").toString().toUpperCase() === "WEDDING";
  const card = isWedding ? profile.weddingCard : profile.flyerCard;

  lines.push(isWedding ? 'NBCard — Wedding' : 'NBCard — Flyer');
  if (card?.headline) lines.push(card.headline);
  if (card?.subheadline) lines.push(card.subheadline);
  if (card?.ctaText) lines.push(card.ctaText);
  if (card?.ctaUrl) lines.push(card.ctaUrl);

  lines.push('');
  lines.push('Profile:');
  lines.push(shareUrl);
  return lines.join('\n');
}

export function getProfileShareUrl(profileId: string): string {
  if (typeof window === 'undefined') return `/resources/nb-card?profile=${encodeURIComponent(profileId)}`;
  const url = new URL('/resources/nb-card', window.location.origin);
  url.searchParams.set('profile', profileId);
  return url.toString();
}

export function buildShareMessage(
  profile: Profile,
  overrideUrl?: string
): { title: string; text: string; url: string } {
  const url = overrideUrl ?? getProfileShareUrl(profile.id);
  const title = `${profile.fullName} — NBCard`;
  const text = `Hi! Here is my digital business card: ${url}`;
  return { title, text, url };
}

export function buildWhatsappUrl(message: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}

export function buildMailtoUrl(profile: Profile, overrideUrl?: string): string {
  const { url } = buildShareMessage(profile, overrideUrl);
  const subject = `My Digital Business Card – ${profile.fullName}`;
  const body = `Hi,\n\nHere is my digital business card:\n${url}\n\nThanks,\n${profile.fullName}`;
  const mailto = new URL('mailto:');
  mailto.searchParams.set('subject', subject);
  mailto.searchParams.set('body', body);
  return mailto.toString();
}

export function buildSmsUrl(profile: Profile, overrideUrl?: string): string {
  const { url } = buildShareMessage(profile, overrideUrl);
  const body = `Hi, here is the link to my digital business card: ${url}`;
  return `sms:?&body=${encodeURIComponent(body)}`;
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for environments where Clipboard API is blocked/unavailable (e.g. some browsers/headless runs).
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}

export function isProbablyMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /Android|iPhone|iPad|iPod/i.test(ua);
}

export async function shareViaWebShare(share: { title: string; text?: string; url?: string; files?: File[] }): Promise<boolean> {
  try {
    if (!navigator.share) return false;
    if (share.files && (navigator as unknown as { canShare?: (d: unknown) => boolean }).canShare) {
      const canShare = (navigator as unknown as { canShare: (d: unknown) => boolean }).canShare;
      if (!canShare({ files: share.files })) return false;
    }
    await navigator.share(share);
    return true;
  } catch {
    return false;
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateProfileVCard(profile: Profile, options: VCardOptions = {}): string {
  const lines: string[] = [];
  lines.push('BEGIN:VCARD');
  lines.push('VERSION:3.0');
  lines.push(`FN:${sanitizeVcard(profile.fullName)}`);
  lines.push(`TITLE:${sanitizeVcard(profile.jobTitle)}`);
  const org = profile.businessCard?.companyName || 'NeuroBreath';
  lines.push(`ORG:${sanitizeVcard(org)}`);
  if (profile.phone) lines.push(`TEL;TYPE=CELL:${sanitizeVcard(profile.phone)}`);
  if (profile.email) lines.push(`EMAIL;TYPE=INTERNET:${sanitizeVcard(profile.email)}`);

  const website = profile.businessCard?.websiteUrl || profile.website;
  if (website) lines.push(`URL:${sanitizeVcard(website)}`);

  if (options.includeAddress) {
    const a = profile.addressCard;
    const hasAny =
      !!a?.addressLine1?.trim() ||
      !!a?.addressLine2?.trim() ||
      !!a?.city?.trim() ||
      !!a?.postcode?.trim() ||
      !!a?.country?.trim();

    if (hasAny) {
      const street = [a?.addressLine1, a?.addressLine2].filter(Boolean).join(' ');
      lines.push(
        `ADR:;;${sanitizeVcard(street)};${sanitizeVcard(a?.city || '')};;${sanitizeVcard(
          a?.postcode || ''
        )};${sanitizeVcard(a?.country || '')}`
      );
      // Full human-readable address label so scanners display the complete text
      const fullAddress = [a?.addressLine1, a?.addressLine2, a?.city, a?.postcode, a?.country]
        .filter((v) => v && v.trim())
        .join(', ');
      if (fullAddress) {
        lines.push(`LABEL;TYPE=HOME:${sanitizeVcard(fullAddress)}`);
      }
      // Google Maps link as a clickable URL for easy navigation
      const mapUrl = buildMapHref(a);
      if (mapUrl) {
        lines.push(`item1.URL:${sanitizeVcard(mapUrl)}`);
        lines.push(`item1.X-ABLabel:Map`);
      }
    } else if (profile.address) {
      lines.push(`ADR:;;${sanitizeVcard(profile.address)};;;;`);
      lines.push(`LABEL;TYPE=HOME:${sanitizeVcard(profile.address)}`);
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`;
      lines.push(`item1.URL:${sanitizeVcard(mapUrl)}`);
      lines.push(`item1.X-ABLabel:Map`);
    }
  } else if (profile.address) {
    lines.push(`ADR:;;${sanitizeVcard(profile.address)};;;;`);
    lines.push(`LABEL;TYPE=HOME:${sanitizeVcard(profile.address)}`);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`;
    lines.push(`item1.URL:${sanitizeVcard(mapUrl)}`);
    lines.push(`item1.X-ABLabel:Map`);
  }

  const notes: string[] = [];
  if (profile.profileDescription) notes.push(`Profile: ${profile.profileDescription}`);
  if (options.includeBusiness) {
    if (profile.businessDescription) notes.push(`Business: ${profile.businessDescription}`);
    if (profile.businessCard?.tagline) notes.push(`Tagline: ${profile.businessCard.tagline}`);
    if (profile.businessCard?.services) notes.push(`Services: ${profile.businessCard.services}`);
    if (profile.businessCard?.hours) notes.push(`Hours: ${profile.businessCard.hours}`);
    if (profile.businessCard?.bookingLink) notes.push(`Booking: ${profile.businessCard.bookingLink}`);
    if (profile.businessCard?.locationNote) notes.push(`Location: ${profile.businessCard.locationNote}`);
    if (profile.businessCard?.vatOrRegNo) notes.push(`VAT/Reg: ${profile.businessCard.vatOrRegNo}`);
  }
  if (options.includeAddress) {
    if (profile.addressCard?.directionsNote) notes.push(`Directions: ${profile.addressCard.directionsNote}`);
    // Include Google Maps link in vCard notes
    if (profile.addressCard) {
      const mapUrl = buildMapHref(profile.addressCard);
      if (mapUrl) notes.push(`Map: ${mapUrl}`);
    } else if (profile.address) {
      notes.push(`Map: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`);
    }
  } else if (profile.address) {
    // Always include map link for simple address even when includeAddress is false
    notes.push(`Map: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`);
  }
  if (options.shareUrl) notes.push(`Full Card: ${options.shareUrl}`);
  if (notes.length) lines.push(`NOTE:${sanitizeVcard(notes.join(' | '))}`);

  for (const [key, value] of Object.entries(profile.socialMedia || {})) {
    if (!value) continue;
    lines.push(`X-SOCIALPROFILE;TYPE=${sanitizeVcard(key)}:${sanitizeVcard(value)}`);
  }

  lines.push('END:VCARD');
  return lines.join('\n');
}

export function generateContactVCard(contact: Contact): string {
  const lines: string[] = [];
  lines.push('BEGIN:VCARD');
  lines.push('VERSION:3.0');
  lines.push(`FN:${sanitizeVcard(contact.name)}`);
  if (contact.jobTitle) lines.push(`TITLE:${sanitizeVcard(contact.jobTitle)}`);
  if (contact.phone) lines.push(`TEL;TYPE=CELL:${sanitizeVcard(contact.phone)}`);
  if (contact.email) lines.push(`EMAIL;TYPE=INTERNET:${sanitizeVcard(contact.email)}`);
  if (contact.company) lines.push(`ORG:${sanitizeVcard(contact.company)}`);
  if (contact.notes) lines.push(`NOTE:${sanitizeVcard(contact.notes)}`);

  if (contact.socialMedia?.website) lines.push(`URL:${sanitizeVcard(contact.socialMedia.website)}`);
  for (const [key, value] of Object.entries(contact.socialMedia || {})) {
    if (!value) continue;
    if (key === 'website') continue;
    lines.push(`X-SOCIALPROFILE;TYPE=${sanitizeVcard(key)}:${sanitizeVcard(value)}`);
  }

  lines.push('END:VCARD');
  return lines.join('\n');
}

function sanitizeVcard(value: string): string {
  return String(value || '')
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/;/g, ',')
    .trim();
}

export function parseVCardToContact(vcardText: string): Partial<Contact> {
  const lines = vcardText
    .split(/\r\n|\n|\r/)
    .map((l) => l.trim())
    .filter(Boolean);

  const out: Partial<Contact> = { socialMedia: {} };

  for (const line of lines) {
    const [rawKey, ...rest] = line.split(':');
    const value = rest.join(':').trim();
    const key = rawKey.toUpperCase();

    if (key.startsWith('FN')) out.name = value;
    if (key.startsWith('TITLE')) out.jobTitle = value;
    if (key.startsWith('TEL')) out.phone = value;
    if (key.startsWith('EMAIL')) out.email = value;
    if (key.startsWith('ORG')) out.company = value;
    if (key.startsWith('NOTE')) out.notes = value;

    if (key.startsWith('URL')) {
      out.socialMedia = { ...(out.socialMedia || {}), website: value };
    }

    if (key.startsWith('X-SOCIALPROFILE')) {
      const typeMatch = rawKey.match(/TYPE=([^;:]+)/i);
      const type = typeMatch?.[1]?.toLowerCase();
      if (type) {
        out.socialMedia = { ...(out.socialMedia || {}), [type]: value };
      }
    }
  }

  return out;
}
