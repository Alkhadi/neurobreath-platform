# Premiumize Report

## PINNED_TEMPLATES_ROOT

`web/public/nb-card/templates`

## SVG Count Processed

**60 SVGs** across 6 categories: address (12), backgrounds (12), bank (12), business (14), overlays (2), thumbs (8)

## Rasters Not Touched

No raster files (png/jpg/jpeg) exist under the templates root. SVG-only enforcement was active throughout; the script explicitly skips non-SVG files.

## Transform Summary

### A) Placeholder Text Cleared

- **15 text elements** had their visible content replaced with zero-width space (`\u200b`)
- Elements and ALL attributes preserved (x, y, font-family, font-size, fill, id, etc.)
- No elements deleted or hidden via opacity/display
- Affected files: `business-01-front.svg`, `business-01-back.svg`, `flyer_promo_portrait_bg.thumb.svg`

### B) Rounded Corners

- **Method**: `<clipPath>` containing a `<rect>` with `rx`/`ry` applied to a wrapper `<g>` group
- **Radius rule**: `clamp(min(viewBoxWidth, viewBoxHeight) * 0.04, 24, 80)`
- Applied to all 60 SVGs (all had usable viewBox or width/height)
- `<title>` and `<desc>` elements preserved outside the clip group
- `<defs>` preserved in its original position
- width/height/viewBox attributes remain EXACTLY unchanged

### C) Bevel / 3D Edge Filter

- **Method**: SVG `<filter>` with two `feDropShadow` elements (highlight + shadow) merged with `SourceGraphic`
- Highlight: dx=-1, dy=-1, stdDeviation=1.5, white at 12% opacity
- Shadow: dx=1.5, dy=1.5, stdDeviation=2, black at 10% opacity
- **ID naming**: `nb-premium-<basename>-clip` and `nb-premium-<basename>-bevel`
- No ID collisions detected; all new IDs are unique
- Applied to all 60 SVGs

### D) Conservative Color Enrichment

- **572 color modifications** across all 60 SVGs
- Saturation boost: ~12% increase (`s * 1.12`)
- Mild contrast: lightness pushed slightly away from 0.5 (3% adjustment)
- **Neutrals preserved**: colors with saturation < 0.08 left unchanged
- **Near-black/white preserved**: lightness < 0.06 or > 0.94 left unchanged
- Supports: `#RGB`, `#RRGGBB`, `rgb()`, `rgba()`, inline `style=""` declarations
- Applied to: `fill`, `stroke`, `stop-color` attributes and inline style equivalents

## Edge Cases

- No SVGs were skipped (all had viewBox or usable width/height)
- No ID collisions detected
- No external references, fonts, images, or URLs introduced
- Manifests verified byte-for-byte unchanged post-transform

## Per-File Details

See [transform-log.jsonl](transform-log.jsonl) for complete per-SVG transform log including:
- viewBox presence, radius applied, new IDs introduced
- Text elements cleared (count + IDs)
- Colors modified count
- Any skip reasons

## Verification

See [verification.md](verification.md) for independent verification of:
- Manifest SHA256 integrity
- File list preservation
- Git diff scope enforcement
- Audit original integrity
- 10-SVG spot-check of geometry + ID preservation
