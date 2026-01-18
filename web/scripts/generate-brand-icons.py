from __future__ import annotations

import argparse
import base64
from io import BytesIO
from pathlib import Path
from typing import Optional, Tuple

from PIL import Image


WEB_DIR = Path(__file__).resolve().parents[1]
PUBLIC_DIR = WEB_DIR / "public"
ICONS_DIR = PUBLIC_DIR / "icons"

DEFAULT_SOURCE_FILE = PUBLIC_DIR / "neurobreath-logo-CB8ztn6H.png"

# Sizes used across the app and PWA
SQUARE_SIZES = [16, 32, 48, 64, 128, 150, 180, 192, 256, 512, 1024]


def _ensure_dirs() -> None:
    ICONS_DIR.mkdir(parents=True, exist_ok=True)


def _open_source(source_file: Path) -> Image.Image:
    if not source_file.exists():
        raise FileNotFoundError(f"Source logo not found: {source_file}")
    img = Image.open(source_file).convert("RGBA")
    return img


def _mask_neon_pixels(rgb: Image.Image) -> Image.Image:
    """Return 1-bit mask of likely neon pixels (magenta/cyan) for cropping."""
    w, h = rgb.size
    px = rgb.load()
    mask = Image.new("1", (w, h), 0)
    mp = mask.load()

    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            # Magenta-ish ring/text: high R & B, lower G
            is_magenta = r > 160 and b > 160 and g < 140
            # Cyan-ish ring/grid: high G & B, lower R
            is_cyan = g > 160 and b > 160 and r < 160
            if is_magenta or is_cyan:
                mp[x, y] = 1
    return mask


def _bbox_from_mask(mask: Image.Image) -> Optional[Tuple[int, int, int, int]]:
    bbox = mask.getbbox()
    if not bbox:
        return None
    left, top, right, bottom = bbox
    if right - left < 10 or bottom - top < 10:
        return None
    return left, top, right, bottom


def _auto_crop_mark(src: Image.Image) -> Image.Image:
    """Crop a square logo-mark area from a larger 'poster' image.

    Heuristic:
    - Search only the top 65% of the image for neon ring pixels.
    - Compute a bounding box of those pixels and expand it.
    - Return a centered square crop.

    If the heuristic fails, falls back to a top-centered crop.
    """
    w, h = src.size
    region_h = int(h * 0.65)
    region = src.crop((0, 0, w, region_h)).convert("RGB")

    mask = _mask_neon_pixels(region)
    bbox = _bbox_from_mask(mask)

    if bbox:
        left, top, right, bottom = bbox
        # Expand bbox with padding
        pad = int(max(right - left, bottom - top) * 0.12)
        left = max(0, left - pad)
        top = max(0, top - pad)
        right = min(w, right + pad)
        bottom = min(region_h, bottom + pad)

        bw = right - left
        bh = bottom - top
        side = max(bw, bh)
        cx = left + bw // 2
        cy = top + bh // 2
        half = side // 2
        x0 = max(0, cx - half)
        y0 = max(0, cy - half)
        x1 = min(w, x0 + side)
        y1 = min(region_h, y0 + side)
        # Re-adjust if clamped
        x0 = max(0, x1 - side)
        y0 = max(0, y1 - side)
        return src.crop((x0, y0, x1, y1))

    # Fallback: crop a top-centered square
    side = min(w, region_h)
    x0 = (w - side) // 2
    y0 = 0
    return src.crop((x0, y0, x0 + side, y0 + side))


def _resize_square(img: Image.Image, size: int) -> Image.Image:
    # Defensive center-crop to square.
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    cropped = img.crop((left, top, left + side, top + side))
    return cropped.resize((size, size), Image.Resampling.LANCZOS)


def _ensure_background(img: Image.Image, bg: str) -> Image.Image:
    """Ensure the output has a solid background for white headers etc."""
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    bg_img = Image.new("RGBA", img.size, bg)
    return Image.alpha_composite(bg_img, img)


def _write_png(path: Path, img: Image.Image) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, format="PNG", optimize=True)


def _write_ico(path: Path, img: Image.Image) -> None:
    # Multi-size ICO for best browser support.
    # Use the 256px master, generate 48/32/16 inside the ICO.
    master = _resize_square(img, 256)
    path.parent.mkdir(parents=True, exist_ok=True)
    master.save(path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])


def _write_embedded_svg(path: Path, img: Image.Image) -> None:
    # Pixel-perfect favicon.svg by embedding the exact PNG as a data URL.
    # (Some browsers prefer SVG favicons.)
    png_bytes = BytesIO()
    img.save(png_bytes, format="PNG", optimize=True)
    b64 = base64.b64encode(png_bytes.getvalue()).decode("ascii")
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">'
        f'<image width="180" height="180" href="data:image/png;base64,{b64}" />'
        "</svg>"
    )
    path.write_text(svg, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate NeuroBreath favicons/app icons from a master logo.")
    parser.add_argument(
        "--source",
        type=str,
        default=str(DEFAULT_SOURCE_FILE),
        help="Path to the master image. You can point this at the uploaded logo image.",
    )
    parser.add_argument(
        "--auto-crop-mark",
        action="store_true",
        help="Auto-crop a logo mark from the top portion (useful if your source is a full poster image).",
    )
    parser.add_argument(
        "--bg",
        type=str,
        default="#2b0a4a",
        help="Background color for generated square icons (helps on white headers).",
    )
    args = parser.parse_args()

    _ensure_dirs()
    source_file = Path(args.source)
    src = _open_source(source_file)

    # If user provides a full 'hero/poster' image, auto-crop the logo mark.
    mark = _auto_crop_mark(src) if args.auto_crop_mark else src

    # Ensure background so the logo always looks professional on white.
    mark_solid = _ensure_background(mark, args.bg)

    # 1) Public icons used by manifest + apple devices
    _write_ico(PUBLIC_DIR / "favicon.ico", mark_solid)
    _write_png(PUBLIC_DIR / "apple-icon.png", _resize_square(mark_solid, 180))
    _write_png(PUBLIC_DIR / "icon-192.png", _resize_square(mark_solid, 192))
    _write_png(PUBLIC_DIR / "icon-512.png", _resize_square(mark_solid, 512))

    # 2) Pixel-perfect favicon.svg (embed the exact raster)
    _write_embedded_svg(PUBLIC_DIR / "favicon.svg", _resize_square(mark_solid, 180))

    # 3) App logo squares (solid background)
    for size in SQUARE_SIZES:
        _write_png(ICONS_DIR / f"neurobreath-logo-square-{size}.png", _resize_square(mark_solid, size))

    print("✓ Generated brand icons from", source_file)


if __name__ == "__main__":
    main()
