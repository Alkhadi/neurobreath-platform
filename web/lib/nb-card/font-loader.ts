/**
 * Font Loading Utility for NB-Card Exports
 * Ensures all fonts are loaded before html2canvas/PDF export
 * Uses CSS Font Loading API for reliability
 */

export interface FontDescriptor {
  family: string;
  weight?: number | string;
  style?: string;
}

const NBCARD_FONTS: FontDescriptor[] = [
  { family: "Inter", weight: 400 },
  { family: "Inter", weight: 500 },
  { family: "Inter", weight: 700 },
  { family: "Roboto", weight: 400 },
  { family: "Roboto", weight: 500 },
  { family: "Roboto", weight: 700 },
  { family: "Open Sans", weight: 400 },
  { family: "Open Sans", weight: 700 },
  { family: "Lato", weight: 400 },
  { family: "Lato", weight: 700 },
  { family: "Montserrat", weight: 400 },
  { family: "Montserrat", weight: 700 },
  { family: "Poppins", weight: 400 },
  { family: "Poppins", weight: 600 },
  { family: "Poppins", weight: 700 },
  { family: "Raleway", weight: 400 },
  { family: "Raleway", weight: 700 },
  { family: "Nunito", weight: 400 },
  { family: "Nunito", weight: 700 },
  { family: "Source Sans 3", weight: 400 },
  { family: "Source Sans 3", weight: 700 },
  { family: "Merriweather", weight: 400 },
  { family: "Merriweather", weight: 700 },
  { family: "Playfair Display", weight: 400 },
  { family: "Playfair Display", weight: 700 },
  { family: "Ubuntu", weight: 400 },
  { family: "Ubuntu", weight: 700 },
  { family: "Fira Sans", weight: 400 },
  { family: "Fira Sans", weight: 700 },
  { family: "Manrope", weight: 400 },
  { family: "Manrope", weight: 700 },
  { family: "Plus Jakarta Sans", weight: 400 },
  { family: "Plus Jakarta Sans", weight: 700 },
  { family: "Beardsons", weight: 400 },
  { family: "Beardsons Inline", weight: 400 },
  { family: "Beardsons Shadow", weight: 400 },
  { family: "Beardsons Extras", weight: 400 },
  { family: "Monday", weight: 400 },
];

/**
 * Wait for a specific font to load
 */
export async function waitForFont(
  family: string,
  weight: number | string = 400,
  style: string = "normal"
): Promise<boolean> {
  if (typeof document === "undefined") return false;

  try {
    // Use CSS Font Loading API
    if ("fonts" in document) {
      const fontFace = `${weight} ${style} 16px "${family}"`;
      await document.fonts.load(fontFace);
      return true;
    }

    // Fallback: simple timeout
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  } catch (error) {
    console.warn(`Failed to wait for font ${family}:`, error);
    return false;
  }
}

/**
 * Wait for all NB-Card fonts to load
 * CRITICAL: Call this before html2canvas / PDF export
 */
export async function waitForAllFonts(
  timeout: number = 5000
): Promise<void> {
  if (typeof document === "undefined") return;

  try {
    // Modern browsers: use document.fonts.ready
    if ("fonts" in document && document.fonts.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, timeout)),
      ]);
      return;
    }

    // Fallback: manually load each font
    const promises = NBCARD_FONTS.map((font) =>
      waitForFont(font.family, font.weight, font.style)
    );

    await Promise.race([
      Promise.all(promises),
      new Promise((resolve) => setTimeout(resolve, timeout)),
    ]);
  } catch (error) {
    console.warn("Font loading timeout or error:", error);
  }
}

/**
 * Check if a font is loaded
 */
export function isFontLoaded(
  family: string,
  weight: number | string = 400,
  style: string = "normal"
): boolean {
  if (typeof document === "undefined") return false;

  try {
    if ("fonts" in document) {
      const fontFace = `${weight} ${style} 16px "${family}"`;
      return document.fonts.check(fontFace);
    }
    return true; // assume loaded if API not available
  } catch (error) {
    return true;
  }
}

/**
 * Preload fonts for faster exports
 * Call this on component mount
 */
export async function preloadExportFonts(): Promise<void> {
  if (typeof document === "undefined") return;

  try {
    const allFonts = NBCARD_FONTS.map((font) =>
      waitForFont(font.family, font.weight, font.style).catch(() => false)
    );

    await Promise.allSettled(allFonts);
  } catch (error) {
    console.warn("Font preload error:", error);
  }
}

/**
 * Get font CSS variable name from font key
 */
export function getFontVariable(fontKey: string): string {
  const map: Record<string, string> = {
    inter: "var(--font-inter)",
    roboto: "var(--font-roboto)",
    "open-sans": "var(--font-open-sans)",
    lato: "var(--font-lato)",
    montserrat: "var(--font-montserrat)",
    poppins: "var(--font-poppins)",
    raleway: "var(--font-raleway)",
    nunito: "var(--font-nunito)",
    "source-sans-3": "var(--font-source-sans-3)",
    merriweather: "var(--font-merriweather)",
    "playfair-display": "var(--font-playfair-display)",
    ubuntu: "var(--font-ubuntu)",
    "fira-sans": "var(--font-fira-sans)",
    manrope: "var(--font-manrope)",
    "plus-jakarta-sans": "var(--font-plus-jakarta-sans)",
  };

  return map[fontKey] || map["inter"];
}

/**
 * Get font family fallback string
 */
export function getFontFamily(fontKey: string): string {
  const map: Record<string, string> = {
    inter: "Inter, ui-sans-serif, system-ui, sans-serif",
    roboto: "Roboto, ui-sans-serif, system-ui, sans-serif",
    "open-sans": "Open Sans, ui-sans-serif, system-ui, sans-serif",
    lato: "Lato, ui-sans-serif, system-ui, sans-serif",
    montserrat: "Montserrat, ui-sans-serif, system-ui, sans-serif",
    poppins: "Poppins, ui-sans-serif, system-ui, sans-serif",
    raleway: "Raleway, ui-sans-serif, system-ui, sans-serif",
    nunito: "Nunito, ui-sans-serif, system-ui, sans-serif",
    "source-sans-3": "Source Sans 3, ui-sans-serif, system-ui, sans-serif",
    merriweather: "Merriweather, ui-serif, Georgia, serif",
    "playfair-display": "Playfair Display, ui-serif, Georgia, serif",
    ubuntu: "Ubuntu, ui-sans-serif, system-ui, sans-serif",
    "fira-sans": "Fira Sans, ui-sans-serif, system-ui, sans-serif",
    manrope: "Manrope, ui-sans-serif, system-ui, sans-serif",
    "plus-jakarta-sans": "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif",
  };

  return map[fontKey] || map["inter"];
}
