/**
 * TTS Text Sanitizer
 * 
 * Filters text to remove emojis, symbols, and decorative glyphs
 * for cleaner speech synthesis output.
 */

/**
 * Remove emojis and emoji-like symbols
 */
function removeEmojis(text: string): string {
  // Unicode ranges for emojis and symbols
  return text.replace(
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]/gu,
    ''
  );
}

/**
 * Remove decorative symbols and UI chrome characters
 */
function removeDecorativeSymbols(text: string): string {
  // Common decorative characters
  const decorativePatterns = [
    /[•◦▪▫]/g, // bullets
    /[→←↑↓↔↕]/g, // arrows
    /[★☆✓✔✗✘]/g, // stars and checks
    /[◆◇■□▲△]/g, // geometric shapes
    /[⚠⚡]/g, // warning symbols
    /[♠♣♥♦]/g, // card suits
    /[※]/g, // reference marks
  ];

  let cleaned = text;
  decorativePatterns.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, '');
  });

  return cleaned;
}

/**
 * Remove excessive punctuation and repeated characters
 */
function normalizePunctuationAndWhitespace(text: string): string {
  return (
    text
      // Replace multiple dots with ellipsis
      .replace(/\.{3,}/g, '...')
      // Collapse mixed exclamation/question runs
      .replace(/[!?]{2,}/g, '?')
      // Remove excessive exclamation/question marks
      .replace(/[!]{2,}/g, '!')
      .replace(/[?]{2,}/g, '?')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      // Remove leading/trailing whitespace
      .trim()
  );
}

/**
 * Keep only alphanumeric and basic punctuation
 */
function keepAlphanumericOnly(text: string): string {
  // Keep letters, numbers, basic punctuation, and whitespace
  return text.replace(/[^a-zA-Z0-9\s.,!?;:()\-'"]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Main sanitizer function
 * 
 * @param text - Input text to sanitize
 * @param options - Sanitization options
 * @returns Cleaned text suitable for TTS
 */
export interface SanitizeOptions {
  filterNonAlphanumeric?: boolean;
  removeEmojis?: boolean;
  removeSymbols?: boolean;
}

export function sanitizeForTTS(
  text: string,
  options: SanitizeOptions = {}
): string {
  if (!text) return '';

  const {
    filterNonAlphanumeric = true,
    removeEmojis: shouldRemoveEmojis = true,
    removeSymbols: shouldRemoveSymbols = true,
  } = options;

  let cleaned = text;

  // Remove emojis
  if (shouldRemoveEmojis) {
    cleaned = removeEmojis(cleaned);
  }

  // Remove decorative symbols
  if (shouldRemoveSymbols) {
    cleaned = removeDecorativeSymbols(cleaned);
  }

  // If strict filtering, keep only alphanumeric + basic punctuation
  if (filterNonAlphanumeric) {
    cleaned = keepAlphanumericOnly(cleaned);
  }

  // Normalize punctuation and whitespace
  cleaned = normalizePunctuationAndWhitespace(cleaned);

  return cleaned;
}

/**
 * Test if text contains mostly non-speech content
 */
export function isNonSpeechText(text: string): boolean {
  const sanitized = sanitizeForTTS(text, { filterNonAlphanumeric: true });
  // If sanitized text is < 30% of original, likely decorative
  return sanitized.length < text.length * 0.3;
}

/**
 * Extract speakable text from HTML-like strings (basic)
 */
export function extractSpeakableText(html: string): string {
  // Remove HTML tags (basic)
  let text = html.replace(/<[^>]*>/g, ' ');
  
  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, 'and')
    .replace(/&lt;/g, '')
    .replace(/&gt;/g, '')
    .replace(/&quot;/g, '')
    .replace(/&#39;/g, '');

  return sanitizeForTTS(text);
}
