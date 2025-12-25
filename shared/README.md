# Shared Resources

**Purpose**: Single source of truth for data, design tokens, and assets reused across platforms (web, mobile, serverless).

---

## 📁 Directory Structure

```
shared/
├── data/           # JSON data files (plants, decks, challenges, etc.)
├── design/         # Design tokens (colors, spacing, typography)
└── assets/         # Shared icons, images, fonts
```

---

## 📊 Data (`/data`)

**Purpose**: Store structured data used by multiple platforms.

**Examples**:
- `plants.json` — Plant growth data for focus garden
- `deck.json` — Card deck data for gamification
- `challenges.json` — Challenge definitions
- `badges.json` — Badge/achievement metadata

**Format**: JSON for easy parsing across platforms (TypeScript, Dart, Workers)

**Usage**:
```typescript
// In Next.js (web)
import plantsData from '@shared/data/plants.json';

// In Flutter (mobile)
final plants = await rootBundle.loadString('packages/shared/data/plants.json');

// In Cloudflare Workers (serverless)
import plantsData from '../../shared/data/plants.json';
```

---

## 🎨 Design Tokens (`/design`)

**Purpose**: Consistent design system across platforms.

**Examples**:
- `tokens.css` — CSS variables for web (colors, spacing, typography)
- `tokens.json` — JSON format for mobile (Flutter theme data)

**Token Categories**:
- **Colors**: Primary, secondary, accent, neutrals, semantic (error, success)
- **Spacing**: 4px base scale (4, 8, 12, 16, 24, 32, 48, 64, 96, 128)
- **Typography**: Font families, sizes, weights, line heights
- **Shadows**: Elevation levels (none, sm, md, lg, xl)
- **Borders**: Radius values (none, sm, md, lg, full)
- **Animations**: Duration, easing functions

**Format**:
```css
/* tokens.css */
:root {
  --color-primary: #4A90E2;
  --color-secondary: #50C878;
  --spacing-4: 1rem;
  --font-size-body: 1rem;
}
```

```json
// tokens.json
{
  "colors": {
    "primary": "#4A90E2",
    "secondary": "#50C878"
  },
  "spacing": {
    "4": 16
  }
}
```

---

## 🖼️ Assets (`/assets`)

**Purpose**: Shared icons, images, fonts used across platforms.

**Subdirectories**:
- `icons/` — SVG icons (for web + mobile)
- `images/` — Shared images (logos, hero backgrounds)
- `fonts/` — Custom fonts (WOFF2 for web, TTF for mobile)

**Best Practices**:
- Use SVG for scalable graphics (web + mobile)
- Provide multiple resolutions for raster images (1x, 2x, 3x)
- Optimize images before committing (use ImageOptim, Squoosh)

---

## 🔄 Synchronization Strategy

### **Web (Next.js)**
- Import JSON directly: `import data from '@shared/data/file.json'`
- CSS variables: `@import '../shared/design/tokens.css'`

### **Mobile (Flutter)**
- Add shared folder as package dependency in `pubspec.yaml`
- Load JSON: `rootBundle.loadString('packages/shared/data/file.json')`
- Parse design tokens into Flutter theme

### **Serverless (Cloudflare Workers)**
- Import JSON: `import data from '../../shared/data/file.json'`
- Use Wrangler to bundle shared files

---

## 📝 Contributing Guidelines

### **Adding New Data Files**
1. Create JSON file in `/data`
2. Add TypeScript interface in web project (`/web/lib/types.ts`)
3. Update this README with file purpose
4. Test imports in web + mobile (if applicable)

### **Updating Design Tokens**
1. Edit `tokens.css` or `tokens.json`
2. Regenerate platform-specific theme files (if needed)
3. Test visual consistency across platforms
4. Document changes in `/docs/decisions.md`

### **Adding Assets**
1. Optimize images/icons before committing
2. Follow naming convention: `kebab-case` (e.g., `icon-heart.svg`)
3. Add alt text metadata in accompanying `assets.json` file
4. Update asset inventory in this README

---

## 🚧 Status

**Current**: Placeholder directory (no files yet)  
**Next Steps**:
1. Extract hardcoded data from `/web` to `/shared/data`
2. Create `tokens.css` from Tailwind config
3. Move reusable icons to `/shared/assets/icons`
4. Add Flutter package configuration (Phase 3)

---

**Last Updated**: December 25, 2024
