/**
 * capture.ts — Reliable export capture helpers for NB-Card
 * Ensures pixel-perfect PNG exports that match on-screen preview,
 * including template CSS background-images and user-uploaded data: assets.
 */

import html2canvas from "html2canvas";

/** Chunk-safe btoa for large buffers (avoids call-stack overflow) */
function bufferToBase64(bytes: Uint8Array): string {
  let b64 = "";
  const CHUNK = 8192;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    b64 += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(b64);
}

/** Fetch a URL and return a data: URI, or null on failure */
async function fetchAsDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { mode: "cors", cache: "force-cache" });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const mime = res.headers.get("content-type") ?? "image/png";
    return `data:${mime};base64,${bufferToBase64(new Uint8Array(buf))}`;
  } catch {
    return null;
  }
}

/**
 * Inline all cross-origin <img> srcs as data URIs so html2canvas can paint
 * them without a CORS SecurityError when allowTaint: false is set.
 *
 * Processes ALL <img> elements (not just crossorigin ones) whose src is an
 * external http(s) URL, since html2canvas needs them as data URIs.
 *
 * Returns a restore function — call it after captureToBlob() finishes to
 * put the original src values back (avoids polluting the live DOM).
 */
export async function inlineImages(rootEl: HTMLElement): Promise<() => void> {
  const imgs = Array.from(rootEl.querySelectorAll<HTMLImageElement>("img"));
  const originals: Array<{ el: HTMLImageElement; src: string }> = [];

  await Promise.all(
    imgs.map(async (img) => {
      const src = img.getAttribute("src") ?? "";
      if (!src || src.startsWith("data:") || src.startsWith("blob:")) return;
      if (!src.startsWith("http://") && !src.startsWith("https://") && !src.startsWith("/")) return;

      const dataUri = await fetchAsDataUri(src.startsWith("/") ? window.location.origin + src : src);
      if (!dataUri) return;

      originals.push({ el: img, src });
      img.src = dataUri;
      await img.decode().catch(() => undefined);
    })
  );

  return () => originals.forEach(({ el, src }) => { el.src = src; });
}

/**
 * Inline all CSS background-image URLs as data URIs so html2canvas renders
 * template backgrounds faithfully (they are rendered as CSS, not <img> tags).
 *
 * Handles both inline styles and computed styles.
 * Skips data:, blob:, and gradient values — those are already local.
 *
 * Returns a restore function — call it after captureToBlob() finishes.
 */
export async function inlineCssBackgrounds(rootEl: HTMLElement): Promise<() => void> {
  if (typeof window === "undefined") return () => undefined;

  const elements = Array.from(rootEl.querySelectorAll<HTMLElement>("*"));
  elements.unshift(rootEl);

  const restoreList: Array<{ el: HTMLElement; originalInline: string }> = [];

  await Promise.all(
    elements.map(async (el) => {
      const computed = window.getComputedStyle(el).backgroundImage;
      if (!computed || computed === "none") return;

      // Extract the first URL from background-image (handles multiple bg layers)
      const match = computed.match(/url\(["']?([^"')]+)["']?\)/);
      if (!match) return;

      const url = match[1];
      if (!url) return;
      if (url.startsWith("data:") || url.startsWith("blob:")) return;
      if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) return;

      const resolvedUrl = url.startsWith("/") ? window.location.origin + url : url;
      const dataUri = await fetchAsDataUri(resolvedUrl);
      if (!dataUri) return;

      restoreList.push({ el, originalInline: el.style.backgroundImage });
      el.style.backgroundImage = `url("${dataUri}")`;
    })
  );

  return () => restoreList.forEach(({ el, originalInline }) => {
    el.style.backgroundImage = originalInline;
  });
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

  // Strip selection outlines / editor borders from layer wrappers so they
  // never appear in exported images.
  const layerEls = Array.from(rootEl.querySelectorAll<HTMLElement>("[data-layer-id]"));
  const savedOutlines = layerEls.map((el) => el.style.outline);
  const savedOutlineOffsets = layerEls.map((el) => el.style.outlineOffset);
  layerEls.forEach((el) => { el.style.outline = "none"; el.style.outlineOffset = "0px"; });

  // html2canvas cannot resolve chained CSS custom properties (e.g.
  // var(--nb-font) → var(--font-inter) → "Inter, sans-serif").
  // Resolve every element's computed font-family into an explicit inline
  // value so the captured canvas text matches on-screen output.
  const fontRestoreList = resolveFontVariables(rootEl);

  // Text layers use overflow:hidden to clip on-screen, but that can
  // truncate text that barely fits.  Temporarily switch to visible.
  const overflowRestoreList = relaxTextOverflow(rootEl);

  // Flush layout (double RAF for stability)
  await new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });

  // Inline <img> srcs and CSS background-images as data URIs so html2canvas
  // can faithfully paint template backgrounds and cross-origin images.
  const [restoreImages, restoreCssBg] = await Promise.all([
    inlineImages(rootEl),
    inlineCssBackgrounds(rootEl),
  ]);

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
    // Restore all inlined assets and editor UI elements after capture
    restoreImages();
    restoreCssBg();
    fontRestoreList();
    overflowRestoreList();
    uiElements.forEach((el, i) => { el.style.display = savedDisplays[i]; });
    layerEls.forEach((el, i) => { el.style.outline = savedOutlines[i]; el.style.outlineOffset = savedOutlineOffsets[i]; });
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

/**
 * Resolve CSS-variable-based font-family into explicit computed values.
 * html2canvas cannot follow chained `var()` references, so we snapshot
 * every element's computed font-family into its inline style.
 * Returns a restore function.
 */
function resolveFontVariables(rootEl: HTMLElement): () => void {
  if (typeof window === "undefined") return () => undefined;

  const elements = [rootEl, ...Array.from(rootEl.querySelectorAll<HTMLElement>("*"))];
  const restoreList: Array<{ el: HTMLElement; prev: string }> = [];

  for (const el of elements) {
    const inlineFf = el.style.fontFamily;
    // Only act on elements whose inline or inherited font-family references var().
    // We resolve via getComputedStyle which already follows the variable chain.
    const computed = window.getComputedStyle(el).fontFamily;
    if (!computed) continue;

    // If computed already equals the inline value, nothing to do.
    if (inlineFf === computed) continue;

    // Check whether this element (or an ancestor) uses a CSS variable.
    // Cheap: look at the inline style string.  Expensive fallback: always set.
    const usesVar =
      inlineFf.includes("var(") ||
      el.style.getPropertyValue("--nb-font") !== "" ||
      el.closest("[style*='--nb-font']") !== null;

    if (usesVar || inlineFf.includes("var(")) {
      restoreList.push({ el, prev: inlineFf });
      el.style.fontFamily = computed;
    }
  }

  return () => restoreList.forEach(({ el, prev }) => { el.style.fontFamily = prev; });
}

/**
 * Temporarily set overflow:visible on text-layer containers so
 * html2canvas does not clip text that barely fits the layer box.
 * Returns a restore function.
 */
function relaxTextOverflow(rootEl: HTMLElement): () => void {
  if (typeof window === "undefined") return () => undefined;

  const restoreList: Array<{ el: HTMLElement; prev: string }> = [];

  // Text layer wrapper divs have overflow:hidden set via inline style
  const all = Array.from(rootEl.querySelectorAll<HTMLElement>("*"));
  for (const el of all) {
    if (el.style.overflow !== "hidden") continue;
    // Only relax elements that look like text containers (have text children)
    const hasText = el.childNodes.length > 0 &&
      Array.from(el.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
    const hasWordBreak = el.style.wordBreak === "break-word";
    if (hasText || hasWordBreak) {
      restoreList.push({ el, prev: el.style.overflow });
      el.style.overflow = "visible";
    }
  }

  return () => restoreList.forEach(({ el, prev }) => { el.style.overflow = prev; });
}
