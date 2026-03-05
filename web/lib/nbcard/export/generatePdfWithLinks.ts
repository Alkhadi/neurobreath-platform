/**
 * generatePdfWithLinks.ts — PDF export with active link annotations
 *
 * Strategy:
 * 1. Accept a PNG data-URL (from captureToBlob) as the visual background.
 * 2. Scan the card DOM for all elements that carry a `data-link-id` attribute
 *    or are anchor tags inside the card root.
 * 3. Convert their bounding boxes (relative to the card root) to PDF
 *    coordinates (jsPDF uses mm from top-left).
 * 4. Use jsPDF to:
 *    a. Add the PNG as a full-page background.
 *    b. Add a transparent link annotation (`link()`) for each overlay.
 *
 * The result: the PDF looks exactly like the card image AND every link
 * overlay is clickable in PDF viewers (Adobe Reader, Chrome, etc.).
 *
 * CLIENT-SIDE ONLY — do NOT import this in server components or route handlers.
 */

// jsPDF is a CJS module; import the class via the named export
import { jsPDF } from "jspdf";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LinkOverlay = {
  /** Accessible label for the link (used in PDF tooltip) */
  label: string;
  /** Target URL */
  url: string;
  /** Bounding box in pixels relative to the card root element */
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GeneratePdfOptions = {
  /** PNG data-URL produced by html2canvas (scale 2×) */
  pngDataUrl: string;
  /** Natural width of the card root element (px at 1×) */
  cardWidthPx: number;
  /** Natural height of the card root element (px at 1×) */
  cardHeightPx: number;
  /** Link overlays to annotate */
  overlays: LinkOverlay[];
  /** File name without extension (default: "nb-card") */
  fileName?: string;
  /**
   * Page orientation: "portrait" (default) or "landscape".
   * Automatically chosen from aspect ratio if omitted.
   */
  orientation?: "portrait" | "landscape";
};

// ---------------------------------------------------------------------------
// Main export function
// ---------------------------------------------------------------------------

/**
 * Generate a PDF where:
 * - The PNG snapshot fills the page exactly.
 * - Each overlay becomes a clickable link annotation.
 *
 * @returns A Blob of the generated PDF.
 */
export async function generatePdfWithLinks(
  options: GeneratePdfOptions
): Promise<Blob> {
  const {
    pngDataUrl,
    cardWidthPx,
    cardHeightPx,
    overlays,
    fileName: _fileName = "nb-card",
    orientation: orientationProp,
  } = options;

  // Choose orientation from aspect ratio if not provided
  const orientation: "portrait" | "landscape" =
    orientationProp ??
    (cardWidthPx > cardHeightPx ? "landscape" : "portrait");

  // Determine page dimensions in mm (A4 = 210 × 297)
  // We keep the card's own aspect ratio and fit it into the page.
  const pageW_mm = orientation === "portrait" ? 210 : 297;
  const pageH_mm = orientation === "portrait" ? 297 : 210;

  // Scale factor: card px → mm
  const scaleX = pageW_mm / cardWidthPx;
  const scaleY = pageH_mm / cardHeightPx;
  // Use the smaller scale so the card fits within the page
  const scale = Math.min(scaleX, scaleY);

  const imgW_mm = cardWidthPx * scale;
  const imgH_mm = cardHeightPx * scale;
  // Centre the image on the page
  const imgX_mm = (pageW_mm - imgW_mm) / 2;
  const imgY_mm = (pageH_mm - imgH_mm) / 2;

  const doc = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
  });

  // Add PNG as the background image
  doc.addImage(pngDataUrl, "PNG", imgX_mm, imgY_mm, imgW_mm, imgH_mm);

  // Add link annotations
  for (const overlay of overlays) {
    const x_mm = imgX_mm + overlay.x * scale;
    const y_mm = imgY_mm + overlay.y * scale;
    const w_mm = overlay.width * scale;
    const h_mm = overlay.height * scale;

    doc.link(x_mm, y_mm, w_mm, h_mm, { url: overlay.url });
  }

  return doc.output("blob");
}

// ---------------------------------------------------------------------------
// DOM helpers — collect link overlays from a rendered card element
// ---------------------------------------------------------------------------

/**
 * Scans `cardRoot` for clickable elements and returns their bounding boxes
 * relative to the card root.
 *
 * Eligible elements:
 * 1. Any element with a `data-link-id` attribute (explicit overlays set by
 *    the canvas editor / CardRenderer).
 * 2. Any `<a>` element with an `href` that is a valid http(s) URL.
 *
 * The card root should be the same element passed to html2canvas.
 */
export function collectLinkOverlays(cardRoot: HTMLElement): LinkOverlay[] {
  const rootRect = cardRoot.getBoundingClientRect();
  const overlays: LinkOverlay[] = [];
  const seen = new Set<string>();

  // 1. data-link-id elements (highest priority — set explicitly by renderer)
  const dataLinkEls = Array.from(
    cardRoot.querySelectorAll<HTMLElement>("[data-link-id]")
  );
  for (const el of dataLinkEls) {
    const url = el.getAttribute("data-link-url") ?? el.getAttribute("href") ?? "";
    if (!url || seen.has(url)) continue;
    const rect = el.getBoundingClientRect();
    overlays.push({
      label: el.getAttribute("data-link-label") ?? el.textContent?.trim() ?? url,
      url,
      x: rect.left - rootRect.left,
      y: rect.top - rootRect.top,
      width: rect.width,
      height: rect.height,
    });
    seen.add(url);
  }

  // 2. Anchor tags inside the card root
  const anchors = Array.from(cardRoot.querySelectorAll<HTMLAnchorElement>("a[href]"));
  for (const a of anchors) {
    const url = a.href;
    if (!url || seen.has(url)) continue;
    if (!url.startsWith("http://") && !url.startsWith("https://")) continue;
    const rect = a.getBoundingClientRect();
    overlays.push({
      label: a.getAttribute("aria-label") ?? a.textContent?.trim() ?? url,
      url,
      x: rect.left - rootRect.left,
      y: rect.top - rootRect.top,
      width: rect.width,
      height: rect.height,
    });
    seen.add(url);
  }

  return overlays;
}

// ---------------------------------------------------------------------------
// Convenience: capture + PDF in one call (client-side only)
// ---------------------------------------------------------------------------

/**
 * End-to-end: capture the card element as PNG, collect overlays, then
 * generate a PDF with active link annotations.
 *
 * @param cardRoot — the card's root DOM element (same one painted by html2canvas)
 * @param fileName — download filename without extension
 * @returns PDF Blob
 */
export async function captureCardAsPdf(
  cardRoot: HTMLElement,
  fileName = "nb-card"
): Promise<Blob> {
  // Dynamic import of captureToBlob to avoid circular deps in server builds
  const { captureToBlob } = await import("./capture");

  const pngBlob = await captureToBlob(cardRoot, { scale: 2 });
  const pngDataUrl = await blobToDataUrl(pngBlob);

  const overlays = collectLinkOverlays(cardRoot);

  // card dimensions at 1× (divide by capture scale of 2)
  const cardWidthPx = cardRoot.offsetWidth;
  const cardHeightPx = cardRoot.offsetHeight;

  return generatePdfWithLinks({
    pngDataUrl,
    cardWidthPx,
    cardHeightPx,
    overlays,
    fileName,
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
