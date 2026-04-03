/**
 * renderSharePreviewPng.tsx
 *
 * Offscreen snapshot renderer + PNG capture helper.
 *
 * Renders the card from a normalized CardModel into a hidden off-screen DOM
 * root using html2canvas, waits for fonts and images to be ready, captures a
 * PNG, uploads it to S3, and returns the URL — all without depending on the
 * visible editor DOM.
 *
 * Only invoked client-side; safe to lazy-import from createServerShare.ts.
 */

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import type { CardModel, CanvasElement } from "@/lib/nbcard/cardModel";

// ---------------------------------------------------------------------------
// Card visual — pure renderer (no state, no side effects)
// ---------------------------------------------------------------------------

/**
 * Professional print dimensions per card category (300 DPI).
 * Landscape categories use width > height; portrait uses height > width.
 */
const SHARE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  address:  { width: 1050, height: 600 },
  bank:     { width: 1013, height: 638 },
  business: { width: 1050, height: 600 },
  flyer:    { width: 1748, height: 2480 },
  wedding:  { width: 1748, height: 2480 },
};
const DEFAULT_SHARE_DIM = { width: 1050, height: 600 };

/**
 * Renders the card background + canvas layers from a CardModel snapshot.
 * Dimensions are derived from the card's category for professional output.
 */
function ShareCardVisual({ card }: { card: CardModel }) {
  const dims = SHARE_DIMENSIONS[card.category] ?? DEFAULT_SHARE_DIM;
  // Scale down for rendering (capture at scale 2 will restore full resolution)
  const renderWidth = Math.round(dims.width / 2);
  const renderHeight = Math.round(dims.height / 2);
  const { canvas, style } = card;
  const bgImageRef = style.backgroundImageRef;
  const hasBg = !!(bgImageRef || style.backgroundPresetId);

  const sorted = [...(canvas?.elements ?? [])]
    .filter((e) => e.visible !== false)
    .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));

  const bgSrc =
    bgImageRef ??
    (style.backgroundPresetId
      ? `/nb-card/templates/backgrounds/${style.backgroundPresetId.replace(
          /[-_](background|overlay|bg|ov)$/i,
          ""
        )}_bg.svg`
      : null);

  return (
    <div
      style={{
        position: "relative",
        width: `${renderWidth}px`,
        height: `${renderHeight}px`,
        overflow: "hidden",
        fontFamily: style.fontFamily ?? "Inter, sans-serif",
        background: hasBg
          ? undefined
          : "linear-gradient(135deg, #9333ea, #3b82f6)",
      }}
    >
      {bgSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bgSrc}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
      )}

      {sorted.map((el) => (
        <OffscreenCanvasElement key={el.id} el={el} />
      ))}
    </div>
  );
}

function OffscreenCanvasElement({ el }: { el: CanvasElement }) {
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: `${el.x}%`,
    top: `${el.y}%`,
    width: `${el.w}%`,
    height: `${el.h}%`,
    transform: el.rotate ? `rotate(${el.rotate}deg)` : undefined,
    zIndex: el.zIndex ?? 0,
    overflow: "hidden",
  };
  const s = (el.style ?? {}) as Record<string, unknown>;

  if (el.type === "text") {
    return (
      <div
        style={{
          ...baseStyle,
          fontSize: typeof s.fontSize === "number" ? `${s.fontSize}px` : "14px",
          fontFamily:
            typeof s.fontFamily === "string" ? s.fontFamily : "inherit",
          fontWeight: s.fontWeight === "bold" ? "bold" : "normal",
          textAlign:
            s.align === "center"
              ? "center"
              : s.align === "right"
                ? "right"
                : "left",
          color: typeof s.color === "string" ? s.color : "#000",
          backgroundColor:
            typeof s.backgroundColor === "string"
              ? s.backgroundColor
              : undefined,
          padding:
            typeof s.padding === "number" ? `${s.padding}px` : undefined,
          display: "flex",
          alignItems: "center",
          wordBreak: "break-word",
        }}
      >
        <span style={{ width: "100%" }}>{el.text ?? ""}</span>
      </div>
    );
  }

  if (el.type === "image" && el.imageRef) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={el.imageRef}
        alt=""
        style={{
          ...baseStyle,
          objectFit: s.fit === "contain" ? "contain" : "cover",
          borderRadius:
            typeof s.borderRadius === "number"
              ? `${s.borderRadius}px`
              : undefined,
        }}
      />
    );
  }

  if (el.type === "shape") {
    return (
      <div
        style={{
          ...baseStyle,
          backgroundColor:
            typeof s.fill === "string" ? s.fill : "transparent",
          border:
            typeof s.strokeWidth === "number" &&
            s.strokeWidth > 0 &&
            typeof s.stroke === "string"
              ? `${s.strokeWidth}px solid ${s.stroke}`
              : undefined,
          borderRadius:
            (s.shapeKind as string) === "circle"
              ? "50%"
              : typeof s.cornerRadius === "number"
                ? `${s.cornerRadius}px`
                : undefined,
          opacity: typeof s.opacity === "number" ? s.opacity : 1,
        }}
      />
    );
  }

  if (el.type === "qr") {
    const qrValue =
      typeof s.value === "string" && s.value
        ? s.value
        : "https://neurobreath.app";
    return (
      <div
        style={{
          ...baseStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            typeof s.background === "string" ? s.background : "#fff",
        }}
      >
        <QRCodeSVG
          value={qrValue}
          style={{ width: "100%", height: "100%" }}
          level={(s.level as "L" | "M" | "Q" | "H") ?? "M"}
          fgColor={typeof s.fill === "string" ? s.fill : "#000"}
          bgColor={typeof s.background === "string" ? s.background : "#fff"}
          marginSize={typeof s.marginSize === "number" ? s.marginSize : 1}
        />
      </div>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Offscreen capture orchestration
// ---------------------------------------------------------------------------

/**
 * Render the card snapshot in a hidden off-screen DOM node and capture it as
 * a raw PNG Blob via html2canvas.
 *
 * Returns the Blob (not uploaded) so the caller can decide whether to persist
 * via object storage or DB bytes, depending on what is available.
 *
 * Never throws — returns null on any failure.
 */
export async function captureSharePreviewBlob(
  cardModel: CardModel
): Promise<Blob | null> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  let container: HTMLDivElement | null = null;
  let root: import("react-dom/client").Root | null = null;

  try {
    const [{ createRoot }, { flushSync }, { captureToBlob }] =
      await Promise.all([
        import("react-dom/client"),
        import("react-dom"),
        import("@/lib/nbcard/export/capture"),
      ]);

    // Offscreen container — visible to html2canvas but not to the user.
    // Must NOT be display:none; html2canvas skips hidden elements.
    container = document.createElement("div");
    container.style.cssText =
      "position:fixed;left:-10000px;top:0;pointer-events:none;overflow:visible;z-index:-9999;";
    document.body.appendChild(container);

    root = createRoot(container);

    // flushSync forces a synchronous first render so the DOM is populated
    // immediately before we start waiting for fonts/images.
    flushSync(() => {
      root!.render(React.createElement(ShareCardVisual, { card: cardModel }));
    });

    // One extra rAF cycle for layout to settle.
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );

    // captureToBlob internally awaits document.fonts.ready + image decode
    // and inlines cross-origin images as data URIs for html2canvas.
    const cardEl = container.firstElementChild as HTMLElement | null;
    if (!cardEl) return null;

    return await captureToBlob(cardEl, { scale: 2 });
  } catch {
    return null;
  } finally {
    try {
      root?.unmount();
    } catch {
      /* ignore */
    }
    try {
      container?.remove();
    } catch {
      /* ignore */
    }
  }
}

/**
 * Convenience wrapper: capture + upload to S3 in one call.
 * Returns the S3 URL or null.
 *
 * @deprecated Prefer captureSharePreviewBlob + explicit storage routing in
 *   createServerShareFromProfile, which handles the DB fallback correctly.
 */
export async function renderSharePreviewPng(
  cardModel: CardModel,
  uploadBlobToS3: (blob: Blob, filename: string) => Promise<string | null>
): Promise<string | null> {
  const blob = await captureSharePreviewBlob(cardModel);
  if (!blob) return null;
  return uploadBlobToS3(blob, `nb-card-share-${Date.now()}.png`).catch(
    () => null
  );
}
