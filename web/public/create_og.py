from PIL import Image, ImageDraw, ImageFont
import os
import sys

# Define paths
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
# Note relative path adjustment: create_og.py is in web/public/, legacy is in web/public/legacy-assets
SOURCE_PATH = os.path.abspath(os.path.join(CURRENT_DIR, 'legacy-assets/assets/icons/neurobreath-logo-square-1024.png'))

def main():
    # Base Image
    img = Image.new('RGB', (1200, 630), '#1a0033')
    draw = ImageDraw.Draw(img, 'RGBA')

    # Retro lines
    for i in range(15):
        y = 50 + i * 40
        alpha = int(40 * (1 - abs(i - 7) / 8))
        draw.line([(0, y), (1200, y)], fill=(255, 0, 255, alpha), width=2)

    # Logo Composition
    if os.path.exists(SOURCE_PATH):
        try:
            print(f"Loading logo from {SOURCE_PATH}")
            logo = Image.open(SOURCE_PATH)
            if logo.mode != 'RGBA':
                logo = logo.convert('RGBA')
            
            # Resize logo to fit nicely on the left side
            # Target size: roughly 350x350 to 400x400
            logo_size = 380
            logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
            
            # Position: Center Y is 315. 
            # X pos: 250 (center of logo) -> left edge = 250 - logo_size/2
            center_x, center_y = 250, 315
            logo_x = center_x - logo_size // 2
            logo_y = center_y - logo_size // 2
            
            # Add a glow effect behind the logo
            glow_radius = logo_size // 2 + 50
            for i in range(10):
                alpha = int(40 * (1 - i / 10))
                r = glow_radius - i * 5
                bbox = [center_x - r, center_y - r, center_x + r, center_y + r]
                draw.ellipse(bbox, fill=(0, 255, 255, alpha))

            # Paste Logo
            img.paste(logo, (logo_x, logo_y), logo)
            print("Composited logo successfully")
            
        except Exception as e:
            print(f"Failed to load or process logo: {e}")
            # Fallback placeholder if fails
            draw.ellipse([100, 165, 400, 465], fill='#4da6ff')
    else:
        print(f"Logo not found at {SOURCE_PATH}")

    # Text Setup
    try:
        # Try finding a font
        font_paths = [
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
            "/System/Library/Fonts/Arial Bold.ttf",
            "/Library/Fonts/Arial Bold.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/liberation/LiberationSans-Bold.ttf"
        ]
        
        selected_font = None
        for p in font_paths:
            if os.path.exists(p):
                selected_font = p
                break
        
        if selected_font:
            title_font = ImageFont.truetype(selected_font, 80)
            tagline_font = ImageFont.truetype(selected_font, 40)
        else:
             raise Exception("No font found")
             
    except:
        print("Using default font")
        title_font = ImageFont.load_default()
        tagline_font = ImageFont.load_default()

    title_x, title_y = 520, 220
    
    # Title Shadow/Glow
    for offset in [(2, 2), (1, 1)]:
        draw.text((title_x + offset[0], title_y + offset[1]), "NeuroBreath", fill='#4da6ff', font=title_font)
    
    # Main Title
    draw.text((title_x, title_y), "NeuroBreath", fill='#00ffff', font=title_font)

    # Tagline
    draw.text((title_x, title_y + 100), "EMBRACE YOUR UNIQUE MIND", fill='#ff00ff', font=tagline_font)

    output_path = os.path.join(CURRENT_DIR, 'og-image.png')
    img.save(output_path, 'PNG', quality=95)
    print(f'Created {output_path}')

if __name__ == "__main__":
    main()
