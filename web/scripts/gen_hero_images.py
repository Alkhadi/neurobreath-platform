from __future__ import annotations

import os
from PIL import Image, ImageDraw


def make_gradient(width: int, height: int, top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    img = Image.new("RGB", (width, height), top)
    draw = ImageDraw.Draw(img)

    for y in range(height):
        t = y / (height - 1)
        r = int(top[0] * (1 - t) + bottom[0] * t)
        g = int(top[1] * (1 - t) + bottom[1] * t)
        b = int(top[2] * (1 - t) + bottom[2] * t)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Subtle radial highlight
    cx, cy = int(width * 0.28), int(height * 0.35)
    base = img.convert("RGBA")
    for radius in range(600, 0, -1):
        alpha = int(55 * (radius / 600) ** 2)
        overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        od.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=(255, 255, 255, alpha))
        base = Image.alpha_composite(base, overlay)

    return base.convert("RGB")


def main() -> None:
    out_dir = os.path.join("public", "images", "hero")
    os.makedirs(out_dir, exist_ok=True)

    width, height = 1800, 1200

    # New homepage hero assets (requested)
    home = make_gradient(width, height, (10, 21, 47), (15, 23, 42))
    home_png = os.path.join(out_dir, "neurobreath-home-hero.png")
    home_webp = os.path.join(out_dir, "neurobreath-home-hero.webp")
    home.save(home_png, format="PNG", optimize=True)
    home.save(home_webp, format="WEBP", quality=88, method=6)

    # Legacy hero asset (used as fallback by existing components/docs)
    legacy = make_gradient(width, height, (6, 18, 37), (8, 30, 56))
    legacy_webp = os.path.join(out_dir, "neurobreath-hero.webp")
    legacy.save(legacy_webp, format="WEBP", quality=86, method=6)

    print("Wrote:")
    print(" -", home_png)
    print(" -", home_webp)
    print(" -", legacy_webp)


if __name__ == "__main__":
    main()
