'use client'

import { cn } from '@/lib/utils'

interface ResponsiveYouTubeEmbedProps {
  /** YouTube video ID (the `v=` value from the URL) */
  videoId: string
  /** Accessible title shown to assistive technology */
  title: string
  className?: string
}

/**
 * Privacy-conscious, aspect-ratio-stable YouTube embed.
 *
 * Uses youtube-nocookie.com to reduce third-party cookies.
 * Lazy-loaded so it does not block initial page render.
 * No layout shift: aspect-video maintains 16:9 ratio at all widths.
 */
export function ResponsiveYouTubeEmbed({ videoId, title, className }: ResponsiveYouTubeEmbedProps) {
  return (
    <div
      className={cn(
        'relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-900',
        className
      )}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  )
}
