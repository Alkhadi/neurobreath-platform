/**
 * capture.ts — Reliable export capture helpers for NB-Card
 * Ensures pixel-perfect PNG exports that match on-screen preview
 */

import html2canvas from "html2canvas";

/**
 * Inline all cross-origin <img> srcs as data URIs so html2canvas can paint
 * them without a CORS SecurityError when allowTaint: false is set.
 *
 * Only processes images that have a crossorigin attribute and whose src is
 * not already a data: or blob: URI (those are already local).
 *
 * Returns a restore function — call it after captureToBlob() finishes to
 * put the original src values back (avoids polluting the live DOM).
 */
export async function inlineImages(rootEl: HTMLElement): Promise<() => void> {
  const imgs = Array.from(
    rootEl.querySelectorAll<HTMLImageElement>("img[crossorigin]")
  );
  const originals: Array<{ el: HTMLImageElement; src: string }> = [];

  await Promise.all(
    imgs.map(async (img) => {
      const src = img.getAttribute("src") ?? "";
      if (!src || src.startsWith("data:") || src.startsWith("blob:")) return;
      try {
        const res = await fetch(src, { mode: "cors", cache: "force-cache" });
        if (!res.ok) return;
        const buf = await res.arrayBuffer();
        const mime = res.headers.get("content-type") ?? "image/png";
        // btoa on large buffers: chunk to avoid call-stack overflow
        const bytes = new Uint8Array(buf);
        let b64 = "";
        const CHUNK = 8192;
        for (let i = 0; i < bytes.length; i += CHUNK) {
          b64 += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
        }
        b64 = btoa(b64);
        originals.push({ el: img, src });
        img.src = `data:${mime};base64,${b64}`;
        await img.decode().catch(() => undefined);
      } catch {
        // Silently skip — html2canvas will render what it can
      }
    })
  );

  return () => originals.forEach(({ el, src }) => { el.src = src; });
}

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

  // Inline cross-origin images as data URIs so html2canvas can paint them
  // without a SecurityError (allowTaint: false would otherwise blank them).
  const restoreImages = await inlineImages(rootEl);

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
    // Restore inlined image srcs and editor UI elements after capture
    restoreImages();
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
