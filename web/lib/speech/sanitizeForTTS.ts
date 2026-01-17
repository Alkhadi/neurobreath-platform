const FALLBACK_TEXT = 'No readable text available.';

type TTSLocale = 'en-GB' | 'en-US';

export function sanitizeForTTS(input: string, opts?: { locale?: TTSLocale }): string {
  const locale = opts?.locale || 'en-GB';
  const textValue = (input ?? '').toString();
  if (!textValue.trim()) return FALLBACK_TEXT;

  let text = textValue;

  // Remove SVG/icon markup blocks and tags
  text = text.replace(/<svg[\s\S]*?<\/svg>/gi, ' ');
  text = text.replace(/<path[\s\S]*?>/gi, ' ');
  text = text.replace(/<circle[\s\S]*?>/gi, ' ');
  text = text.replace(/<rect[\s\S]*?>/gi, ' ');
  text = text.replace(/<g[\s\S]*?>/gi, ' ');
  text = text.replace(/<lucide-[^>]*>/gi, ' ');
  text = text.replace(/<\/lucide-[^>]*>/gi, ' ');

  // Strip remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Remove common HTML entities
  text = text.replace(/&nbsp;|&#160;/gi, ' ');
  text = text.replace(/&[a-z0-9#]+;/gi, ' ');

  // Remove icon-related tokens and UI ids
  text = text.replace(/\blucide-[a-z0-9-]+\b/gi, ' ');
  text = text.replace(/\b(?:aria|radix|data)-[a-z0-9_-]+\b/gi, ' ');

  // Normalize dash characters
  text = text.replace(/[–—]/g, '-');

  // Convert bullets/separators to sentence breaks
  text = text.replace(/[•●▪◦·]+/g, '. ');
  text = text.replace(/\s[|¦]\s/g, '. ');
  text = text.replace(/\s-\s/g, '. ');

  // Remove emoji and pictographs
  text = text.replace(/\p{Extended_Pictographic}/gu, ' ');
  text = text.replace(/[\uFE0F\u200D]/g, ' ');

  // Keep only allowed characters
  text = text.replace(/[^\p{L}\p{N}\s\.,\?!:;'"\(\)\[\]-]/gu, ' ');

  // Preserve meaningful numeric phrases
  text = text.replace(/(\d)\s*-\s*(\d)/g, '$1 $2');
  text = text.replace(/(\d)\s*-\s*(\p{L})/gu, '$1 $2');

  // Collapse repeated punctuation
  text = text.replace(/\.{2,}/g, '.');
  text = text.replace(/([!?]){2,}/g, '$1');
  text = text.replace(/([,:;]){2,}/g, '$1');

  // Clean spaces around punctuation
  text = text.replace(/\s+([\.,!?;:])/g, '$1');
  text = text.replace(/([\(\[])+\s+/g, '$1');
  text = text.replace(/\s+([\)\]])/g, '$1');

  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim();

  if (!text) return FALLBACK_TEXT;

  // Remove isolated noise tokens
  const tokens = text.split(' ');
  const cleanedTokens = tokens.filter(token => !/^[\.,!?;:'"\(\)\[\]-]$/.test(token));
  text = cleanedTokens.join(' ').trim();

  if (!text) return FALLBACK_TEXT;

  // Locale-specific tweaks (placeholder for future needs)
  if (locale === 'en-US') {
    return text;
  }

  return text;
}
