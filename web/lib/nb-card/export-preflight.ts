/**
 * NB-Card Export Preflight Checks
 * Ensures fonts, images, and templates are ready before capture/export
 */

/**
 * Wait for all fonts to be loaded
 * Uses document.fonts.ready when available
 */
export async function waitForFonts(): Promise<void> {
  if (typeof document === "undefined") return;

  try {
    if (document.fonts && "ready" in document.fonts) {
      await document.fonts.ready;
    } else {
      // Fallback: wait a fixed duration
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  } catch (error) {
    console.warn("Font loading check failed", error);
    // Continue anyway
  }
}

/**
 * Wait for an image element to be decoded and ready
 */
export async function waitForImage(img: HTMLImageElement): Promise<void> {
  if (!img.complete) {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Image failed to load"));
    });
  }

  // Decode if supported
  if ("decode" in img && typeof img.decode === "function") {
    try {
      await img.decode();
    } catch (error) {
      console.warn("Image decode failed", error);
      // Continue anyway
    }
  }
}

/**
 * Wait for all images in a container to be ready
 */
export async function waitForImages(container: HTMLElement): Promise<void> {
  const images = container.querySelectorAll("img");
  const promises: Promise<void>[] = [];

  images.forEach((img) => {
    if (img instanceof HTMLImageElement) {
      promises.push(waitForImage(img));
    }
  });

  try {
    await Promise.all(promises);
  } catch (error) {
    console.warn("Some images failed to load", error);
    // Continue anyway - partial success is better than blocking
  }
}

/**
 * Check if capture node dimensions are stable
 * Returns true if layout appears ready
 */
export function isCaptureNodeStable(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

/**
 * Run full preflight checks before export
 * Returns an object with check results and warnings
 */
export async function runExportPreflight(captureElement: HTMLElement): Promise<{
  ready: boolean;
  warnings: string[];
}> {
  const warnings: string[] = [];

  // Check 1: Element is visible and has dimensions
  if (!isCaptureNodeStable(captureElement)) {
    warnings.push("Capture element has no dimensions. Export may fail.");
    return { ready: false, warnings };
  }

  // Check 2: Wait for fonts
  try {
    await waitForFonts();
  } catch (error) {
    warnings.push("Font loading timed out. Text may not render correctly.");
  }

  // Check 3: Wait for images
  try {
    await waitForImages(captureElement);
  } catch (error) {
    warnings.push("Some images failed to load. Export may be incomplete.");
  }

  // Check 4: Brief settle delay to ensure layout is stable
  await new Promise((resolve) => setTimeout(resolve, 100));

  return { ready: true, warnings };
}

/**
 * Get recommended capture scale based on device capabilities
 * Returns a value between 1 and 3
 */
export function getRecommendedCaptureScale(): number {
  if (typeof window === "undefined") return 2;

  const dpr = window.devicePixelRatio || 1;

  // High-DPI devices: use 2x or 3x
  if (dpr >= 2) {
    // Check available memory (if supported)
    const nav = navigator as Navigator & { deviceMemory?: number };
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) {
      return 2; // Lower memory device: cap at 2x
    }
    return Math.min(3, Math.ceil(dpr));
  }

  // Standard devices: 2x is usually fine
  return 2;
}
