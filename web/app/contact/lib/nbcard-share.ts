import type { Contact, Profile } from '@/lib/utils';

export type ShareFile = {
  file: File;
  title: string;
  text?: string;
};

export function getProfileShareUrl(profileId: string): string {
  if (typeof window === 'undefined') return `/resources/nb-card?profile=${encodeURIComponent(profileId)}`;
  const url = new URL('/resources/nb-card', window.location.origin);
  url.searchParams.set('profile', profileId);
  return url.toString();
}

export function buildShareMessage(profile: Profile): { title: string; text: string; url: string } {
  const url = getProfileShareUrl(profile.id);
  const title = `${profile.fullName} — NBCard`;
  const text = `Hi! Here is my digital business card: ${url}`;
  return { title, text, url };
}

export function buildWhatsappUrl(message: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}

export function buildMailtoUrl(profile: Profile): string {
  const { url } = buildShareMessage(profile);
  const subject = `My Digital Business Card – ${profile.fullName}`;
  const body = `Hi,\n\nHere is my digital business card:\n${url}\n\nThanks,\n${profile.fullName}`;
  const mailto = new URL('mailto:');
  mailto.searchParams.set('subject', subject);
  mailto.searchParams.set('body', body);
  return mailto.toString();
}

export function buildSmsUrl(profile: Profile): string {
  const { url } = buildShareMessage(profile);
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

export function generateProfileVCard(profile: Profile): string {
  const lines: string[] = [];
  lines.push('BEGIN:VCARD');
  lines.push('VERSION:3.0');
  lines.push(`FN:${sanitizeVcard(profile.fullName)}`);
  lines.push(`TITLE:${sanitizeVcard(profile.jobTitle)}`);
  lines.push('ORG:NeuroBreath');
  if (profile.phone) lines.push(`TEL;TYPE=CELL:${sanitizeVcard(profile.phone)}`);
  if (profile.email) lines.push(`EMAIL;TYPE=INTERNET:${sanitizeVcard(profile.email)}`);

  const website = profile.socialMedia?.website;
  if (website) lines.push(`URL:${sanitizeVcard(website)}`);

  for (const [key, value] of Object.entries(profile.socialMedia || {})) {
    if (!value) continue;
    if (key === 'website') continue;
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
