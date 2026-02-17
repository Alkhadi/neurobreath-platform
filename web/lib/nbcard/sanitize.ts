/**
 * sanitize.ts — Text sanitization helpers for NB-Card
 * Prevents URLs and unwanted content from appearing in card previews/exports
 */

const URL_PATTERN = /https?:\/\/[^\s]+|www\.[^\s]+/gi;

/**
 * Strip all URLs (http(s):// and www.) from text, collapse whitespace
 */
export function stripUrls(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(URL_PATTERN, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Clamp text to max length, preserving word boundaries
 */
export function clamp(text: string, max: number): string {
  if (!text || typeof text !== "string") return "";
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  
  const cut = trimmed.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  
  if (lastSpace > max * 0.7) {
    return cut.slice(0, lastSpace) + "…";
  }
  
  return cut + "…";
}

/**
 * Validate HTTP/HTTPS URL strictly
 */
export function isValidHttpUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Detect if a string looks like a URL (for auto-routing to mapUrlOverride)
 */
export function looksLikeUrl(text: string): boolean {
  if (!text || typeof text !== "string") return false;
  const trimmed = text.trim().toLowerCase();
  
  // Match http(s):// or www. or common TLDs
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("www.") ||
    /^[a-z0-9.-]+\.(com|org|net|co\.uk|io|app|dev)/i.test(trimmed)
  );
}
