'use client';

import type React from 'react';

type IconProps = { className?: string };

function isRenderableElementType(value: unknown): value is React.ElementType {
  return (
    typeof value === 'function' ||
    (typeof value === 'object' && value !== null) ||
    typeof value === 'string'
  );
}

export function SafeIcon({
  icon,
  fallback,
  ariaHidden,
  ...props
}: IconProps & { icon: unknown; fallback?: React.ReactNode; ariaHidden?: boolean }) {
  if (isRenderableElementType(icon)) {
    const Icon = icon as React.ElementType<IconProps>;
    return <Icon {...props} aria-hidden={ariaHidden} />;
  }

  return (
    fallback ?? (
      <span className={props.className} aria-hidden="true">
        ↗
      </span>
    )
  );
}
