/* eslint-disable @next/next/no-img-element */
/**
 * CaptureImage Component
 * 
 * Renders plain <img> tags (NOT next/image) inside the capture subtree for reliability.
 * This ensures html2canvas sees direct <img src="..."> nodes and avoids:
 * - Next/Image optimization/decoding issues
 * - CORS mismatches
 * - Rendering timing issues during rapid background changes
 * 
 * Used ONLY inside #profile-card-capture for background and avatar.
 */

import { CSSProperties, ImgHTMLAttributes } from 'react';

interface CaptureImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string;
  objectFit?: CSSProperties['objectFit'];
  objectPosition?: CSSProperties['objectPosition'];
}

export function CaptureImage({
  src,
  alt = '',
  objectFit = 'cover',
  objectPosition = 'center',
  className = '',
  style = {},
  ...props
}: CaptureImageProps) {
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        ...style,
        objectFit,
        objectPosition,
        display: 'block',
        width: '100%',
        height: '100%',
      }}
      decoding="async"
      loading="eager"
      {...props}
    />
  );
}
