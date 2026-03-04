/**
 * NeuroBreath UI Design System — shared Tailwind class constants.
 *
 * Hoist all class strings here to:
 *  1. Satisfy react/require-constant (prevents inline object/array re-creation).
 *  2. Guarantee pixel-perfect consistency across every home-page section.
 *  3. Make global restyle changes a single-place edit.
 *
 * Branding tokens:
 *   Primary teal   : #4ECDC4
 *   Accent gold    : #959E0B
 *   Text navy      : #0F172A
 *   Background     : #F9FAFB
 *   Dark background: #0B1220
 */

/** Centred content container — full-width on mobile, capped at 6xl on desktop */
export const containerClass =
  'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8'

/** Standard section vertical rhythm — mobile-first */
export const sectionClass = 'py-16 md:py-24'

/**
 * Premium hub-style surface card.
 * Use for generic white card surfaces (tools, org resources, etc.).
 * For colour-coded cards (goals, badges) compose additional colour classes on top.
 */
export const cardClass =
  'bg-white dark:bg-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl ' +
  'hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.015] active:scale-[0.99] ' +
  'transition-all duration-300 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60'

/** Primary gradient CTA — large, tappable (≥56 px touch target) */
export const primaryBtnClass =
  'inline-flex items-center justify-center gap-2 ' +
  'bg-gradient-to-r from-[#959E0B] to-[#4ECDC4] text-white font-semibold text-lg ' +
  'px-8 py-4 rounded-2xl shadow-xl ' +
  'hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60'

/** Secondary outline CTA */
export const secondaryBtnClass =
  'inline-flex items-center justify-center gap-2 ' +
  'border-2 border-[#4ECDC4] text-[#0F172A] dark:text-white font-semibold text-lg ' +
  'px-8 py-4 rounded-2xl hover:bg-[#4ECDC4]/10 hover:-translate-y-0.5 ' +
  'active:scale-[0.99] transition-all duration-300 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60'

/** Horizontal goal/filter chip */
export const chipClass =
  'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ' +
  'bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 ' +
  'text-[#0F172A] dark:text-slate-200 hover:border-[#4ECDC4] hover:text-[#4ECDC4] ' +
  'transition-all duration-200 cursor-pointer'

/** Shared focus ring — apply to any interactive element that needs it standalone */
export const focusRingClass =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60'
