# Verification Report

## 1) Manifests Unchanged

| File | Baseline SHA256 | Post-transform SHA256 | Match |
|------|----------------|----------------------|-------|
| manifest.json | `95dc153f700abb3b51f7f0ef906e5da14dd8327cc37fa0d7967eede70707a8d9` | `95dc153f700abb3b51f7f0ef906e5da14dd8327cc37fa0d7967eede70707a8d9` | YES |
| manifest.nb-wallet.json | `fb407dcf41ac0aab079481fb2c9a3741a55a5bb4428c9a0e0e6504f2a9f4890a` | `fb407dcf41ac0aab079481fb2c9a3741a55a5bb4428c9a0e0e6504f2a9f4890a` | YES |

## 2) File List Unchanged

- Baseline file count: 62 (60 SVGs + 2 manifests)
- Post-transform file count: 62
- No new files added under PINNED_TEMPLATES_ROOT
- No files deleted or renamed

## 3) Only SVGs Changed

`git diff --name-only` shows exactly 60 files, ALL matching `web/public/nb-card/templates/**/*.svg`.
No other tracked files modified. Untracked changes are only in `scripts/premiumize/` and `deliverables/premiumize/` (both allowlisted).

## 4) Audit Originals Unchanged

SHA256 recomputation of `deliverables/premiumize/original_svgs/**` matches `original_svgs_sha256.txt` exactly (diff reports zero differences across all 60 entries).

## 5) Spot-Check: ID + Geometry Preservation

The transform script enforces assertions per-SVG (width/height/viewBox unchanged, all original IDs present). Additionally, 10 random SVGs were independently verified:

| # | File | width | height | viewBox | IDs |
|---|------|-------|--------|---------|-----|
| 1 | address/address-01-bg.svg | OK | OK | OK | OK |
| 2 | address/address-04-avatar.svg | OK | OK | OK | OK |
| 3 | address/address-04-bg.svg | OK | OK | OK | OK |
| 4 | address/address-05-avatar.svg | OK | OK | OK | OK |
| 5 | backgrounds/flyer-promo-portrait.svg | OK | OK | OK | OK |
| 6 | backgrounds/flyer_promo_portrait_bg.svg | OK | OK | OK | OK |
| 7 | backgrounds/minimal-black-portrait.svg | OK | OK | OK | OK |
| 8 | business/business-02-avatar.svg | OK | OK | OK | OK |
| 9 | business/business-05-bg.svg | OK | OK | OK | OK |
| 10 | thumbs/minimal_black_landscape_bg.thumb.svg | OK | OK | OK | OK |

**All spot-checks PASSED.**
