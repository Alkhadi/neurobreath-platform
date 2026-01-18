from PIL import Image
import os
import sys

# Define paths
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
# Legacy asset path relative to this script: ../../public/legacy-assets/...
SOURCE_PATH = os.path.abspath(os.path.join(CURRENT_DIR, '../../public/legacy-assets/assets/icons/neurobreath-logo-square-1024.png'))
PUBLIC_DIR = os.path.abspath(os.path.join(CURRENT_DIR, '../../public'))

def main():
    if not os.path.exists(SOURCE_PATH):
        print(f"Error: Source file not found at {SOURCE_PATH}")
        sys.exit(1)

    print(f"Opening source image: {SOURCE_PATH}")
    try:
        img = Image.open(SOURCE_PATH)
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        print(f"Source loaded: {img.size} {img.mode}")
    except Exception as e:
        print(f"Failed to open image: {e}")
        sys.exit(1)

    # 1. Generate Square Icons in current directory
    sizes = [16, 32, 48, 64, 128, 150, 180, 192, 256, 512, 1024]
    for size in sizes:
        output_filename = os.path.join(CURRENT_DIR, f"neurobreath-logo-square-{size}.png")
        try:
            # Use LANCZOS for high quality downsampling
            resized = img.resize((size, size), Image.Resampling.LANCZOS)
            resized.save(output_filename, "PNG")
            print(f"Generated: {os.path.basename(output_filename)}")
        except Exception as e:
            print(f"Error generating {size}px: {e}")

    # 2. Generate Favicon (ICO) in public root
    favicon_path = os.path.join(PUBLIC_DIR, 'favicon.ico')
    try:
        # ICO usually includes 16, 32, 48, 64
        icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)] 
        img.save(favicon_path, format='ICO', sizes=icon_sizes)
        print(f"Generated: favicon.ico at {favicon_path}")
    except Exception as e:
        print(f"Error generating favicon.ico: {e}")

    # 3. Generate apple-icon.png (180x180) in public root
    apple_path = os.path.join(PUBLIC_DIR, 'apple-icon.png')
    try:
        resized_apple = img.resize((180, 180), Image.Resampling.LANCZOS)
        resized_apple.save(apple_path, "PNG")
        print(f"Generated: apple-icon.png at {apple_path}")
    except Exception as e:
        print(f"Error generating apple-icon.png: {e}")

    # 4. Generate PWA icons in public root
    for size in [192, 512]:
        pwa_path = os.path.join(PUBLIC_DIR, f'icon-{size}.png')
        try:
            resized_pwa = img.resize((size, size), Image.Resampling.LANCZOS)
            resized_pwa.save(pwa_path, "PNG")
            print(f"Generated: icon-{size}.png at {pwa_path}")
        except Exception as e:
            print(f"Error generating icon-{size}.png: {e}")

if __name__ == "__main__":
    main()
