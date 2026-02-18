/**
 * capture.ts — Reliable export capture helpers for NB-Card
 * Ensures pixel-perfect PNG exports that match on-screen preview
 */

import html2canvas from "html2canvas";

/**
 * Wait for fonts to load (defensive check for document.fonts API)
 */
export async function waitForFonts(): Promise<void> {
  if (typeof document === "undefined") return;
  
  // Check if the Fonts API is available
  if ("fonts" in document && document.fonts && typeof document.fonts.ready !== "undefined") {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore errors (e.g., in older browsers)
    }
  }
  
  // Additional small delay to ensure font rendering stability
  await new Promise((resolve) => setTimeout(resolve, 100));
}

/**
 * Wait for all images in an element to be fully loaded and decoded
 */
export async function waitForImages(rootEl: HTMLElement): Promise<void> {
  const images = Array.from(rootEl.querySelectorAll("img"));
  
  await Promise.all(
    images.map(async (img) => {
      if (!img.complete) {
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      }
      
      // Decode the image to ensure it's ready for rendering
      if ("decode" in img && typeof img.decode === "function") {
        try {
          await img.decode();
        } catch {
          // Ignore decode errors (e.g., broken images)
        }
      }
    })
  );
}

/**
 * Capture an element to a PNG Blob with html2canvas
 * 
 * @param rootEl - The DOM element to capture
 * @param options - Capture options
 * @param options.scale - Scale factor (default: 2 for retina quality)
 * @param options.backgroundColor - Background color (default: null for transparent)
 * @returns PNG Blob
 */
export async function captureToBlob(
  rootEl: HTMLElement,
  options: {
    scale?: number;
    backgroundColor?: string | null;
  } = {}
): Promise<Blob> {
  const { scale = 2, backgroundColor = null } = options;
  
  // Wait for fonts and images to ensure stability
  await waitForFonts();
  await waitForImages(rootEl);

  // Hard guard: hide all editor UI elements during capture
  const uiElements = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-nb-ui="true"]'));
  const savedDisplays = uiElements.map((el) => el.style.display);
  uiElements.forEach((el) => { el.style.display = "none"; });

  // Flush layout (double RAF for stability)
  await new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });

  let canvas: HTMLCanvasElement;
  try {
    // Capture with html2canvas
    canvas = await html2canvas(rootEl, {
      scale,
      backgroundColor,
      useCORS: true,
      logging: false,
      allowTaint: false,
      // Respect data-html2canvas-ignore attributes (edit UI will be excluded)
    });
  } finally {
    // Restore editor UI elements after capture
    uiElements.forEach((el, i) => { el.style.display = savedDisplays[i]; });
  }
  
  // Convert canvas to PNG blob
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create image blob"));
        } else {
          resolve(blob);
        }
      },
      "image/png",
      1.0 // Maximum quality
    );
  });
}
