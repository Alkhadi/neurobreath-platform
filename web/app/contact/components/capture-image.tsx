/**
 * CaptureImage: Plain <img> component for html2canvas capture subtree
 * 
 * WHY NOT next/image:
 * - html2canvas reads DOM nodes directly; next/image wrappers can cause timing/decode issues
 * - Plain <img> guarantees the most reliable capture with html2canvas and PDF embedding
 * 
 * COLOR FIDELITY:
 * - No CSS filters, blend modes, or opacity overlays
 * - Renders user-uploaded images with maximum fidelity
 * - Uses object-fit:cover for consistent layout matching
 */

import * as React from "react";

export interface CaptureImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export function CaptureImage({ src, alt, className, style, onLoad, onError }: CaptureImageProps) {
  const imgRef = React.useRef<HTMLImageElement>(null);
  
  React.useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    
    // Preload and decode image for capture readiness
    if (img.decode) {
      img.decode().catch((err) => {
        console.warn("Image decode warning:", err);
      });
    }
  }, [src]);
  
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      style={style}
      decoding="async"
      loading="eager"
      crossOrigin="anonymous"
      onLoad={onLoad}
      onError={onError}
    />
  );
}
