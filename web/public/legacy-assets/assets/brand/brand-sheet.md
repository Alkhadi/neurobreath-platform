# NeuroBreath Brand Reference

_Last updated: 19 November 2025_

## 1. Brand Essence
- **Voice:** Calm, clinically-referenced, neuro-inclusive.
- **Tone:** Empathetic, practical, data-backed.
- **Key Promise:** Precise breathing and self-regulation guidance for every nervous system.

## 2. Logo System
- **Primary mark:** `assets/icons/neurobreath-logo-square-128.png` (PNG, 128×128). Use at ≥24 px with 4 px padding.
- **Favicon suite:** 16 px–512 px variants under `assets/icons/`.
- **Usage rules:**
  - Maintain a minimum clear-space equal to 0.4× the logo width on all sides.
  - Never recolor the artwork—place it on calm surfaces using our padding shell.
  - For dark photography, wrap the mark in the CSS logo capsule (`.brand .logo` styles) or place on a #FFFFFF tile with 6 px radius.

## 3. Colour Palette
| Token | Hex | Usage |
| --- | --- | --- |
| `--nb-background` | `#F6F2EA` | Base background / hero gradients.
| `--nb-surface` | `#FFFFFF` | Cards, sheets, input backgrounds.
| `--nb-ink` | `#0F172A` | Primary body text and headings.
| `--nb-text-muted` | `#6B7280` | Supporting copy, captions.
| `--nb-primary` | `#0EA5E9` | Calls-to-action, focus states.
| `--nb-primary-dark` | `#0369A1` | Hover states, dark CTA text.
| `--nb-primary-light` | `#38BDF8` | Secondary accents, gradients.
| `--nb-accent-lavender` | `#BB91E3` | Highlights, cards in wellness contexts.
| `--nb-accent-mint` | `#9BD7B5` | Success badges, regulation cues.
| `--nb-focus` | `#1D4ED8` | Focus ring, accessibility outlines.

### Gradients
- **Hero glass:** `linear-gradient(150deg, rgba(255,255,255,0.97), rgba(231,238,255,0.90))`.
- **CTA buttons:** `linear-gradient(135deg, var(--nb-primary), var(--nb-primary-light))`.

## 4. Typography
- **Primary typeface:** Lexend (weights 400–700). Load via Google Fonts.
- **Fallback stack:** `"Noto Sans", system-ui, -apple-system, "Segoe UI", Arial, sans-serif`.
- **Usage:**
  - Headings: Lexend 600–700 with -0.3 px letter spacing.
  - Body: Lexend 400, 18 px base with 1.6 line-height.
  - Buttons / labels: Lexend 650 uppercase tracking 0.01 em.

## 5. Iconography & Illustrations
- Rounded-corner squares and circles, 12–16 px radius.
- Line weight 2 px, opacity 80 % for muted icons.
- Use emoji-as-icon sparingly inside CTA text only.

## 6. Motion & Effects
- Shadows: `0 10px 24px rgba(15,23,42,0.12)` for cards, `0 16px 46px rgba(15,23,42,0.12)` on hover.
- Border radius system: 12 px buttons, 14 px chips, 16 px cards.
- Animation timing: 120 ms ease-out for hover/press states.

## 7. Accessibility Rules
- Maintain 4.5:1 contrast for text above 18 px, 3:1 for large text.
- Always accompany colour cues with iconography or labels (e.g., swatch names, status chips).
- Focus states must use `--nb-focus` outline, minimum 3 px.

## 8. Contact
- Brand caretaker: Alkhadi M Koroma
- Email: info@mindpaylink.com

Use this sheet as the single source of truth when crafting new collateral or adjusting the NeuroBreath experience.
