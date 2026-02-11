# Phase 4: Data-Driven SVG Renderer - Implementation Guide

## What Was Implemented

✅ **Generic SVG Template Renderer** (`web/lib/nb-card/svg-renderer.ts`)
- Single `fillSvgTemplate()` function that works across ALL template categories
- Supports standard field IDs for Profile, Address, Bank, and Business card types
- Automatically hides elements when data is missing (no ghost placeholders)
- Handles both text elements and image elements (avatar/background)
- Provides text overflow strategies (truncate/wrap/scale)

## How the Renderer Works

The renderer follows a simple pattern:

1. **Find elements by ID** in the SVG template
2. **Set textContent** for `<text>` elements
3. **Set href** for `<image>` elements
4. **Hide elements** when data is missing (opacity=0, display=none)

## Standard Field IDs

SVG templates should use these IDs for fillable elements:

### Core Identity
- `fullName`, `jobTitle`

### Contact
- `phone`, `email`, `website`

### Address
- `addressLine1`, `addressLine2`, `city`, `postcode`, `country`

### Bank
- `bankAccountName`, `bankName`, `sortCode`, `accountNumber`, `iban`, `swift`

### Business
- `bizCompanyName`, `bizTagline`, `bizServices`, `bizHours`, `bizLocation`, `bizVatReg`

### Social Media
- `instagram`, `facebook`, `tiktok`, `linkedin`, `twitter`

### Images
- `avatarImage`, `backgroundImage`

## Usage Example

```typescript
import { fillSvgTemplate } from "@/lib/nb-card/svg-renderer";

// Load SVG template
const response = await fetch("/nb-card/templates/business/business-front.svg");
const svgText = await response.text();
const parser = new DOMParser();
const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
const svgRoot = svgDoc.documentElement as SVGSVGElement;

// Fill with profile data
fillSvgTemplate(
  svgRoot,
  profile,
  template,
  avatarBlobUrl,
  backgroundBlobUrl
);

// Convert to data URL for export
const serializer = new XMLSerializer();
const svgString = serializer.serializeToString(svgRoot);
const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
```

## Next Steps to Complete Phase 4

### 1. Update SVG Templates
Add stable IDs to all SVG template files:

```xml
<!-- Example: business-front.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet">
  <!-- Background decorative elements (no IDs needed) -->
  <rect fill="#1e293b" width="1600" height="900"/>
  
  <!-- Fillable text fields (MUST have IDs) -->
  <text id="fullName" x="100" y="200" font-size="48" fill="#fff">Name Here</text>
  <text id="jobTitle" x="100" y="260" font-size="24" fill="#94a3b8">Title Here</text>
  <text id="phone" x="100" y="400" font-size="18" fill="#fff">+44 123 456 7890</text>
  <text id="email" x="100" y="440" font-size="18" fill="#fff">email@example.com</text>
  
  <!-- Avatar image (MUST have ID) -->
  <image id="avatarImage" x="1300" y="300" width="200" height="200" href="placeholder.png" opacity="0"/>
</svg>
```

### 2. Integrate into ProfileCard

Replace current HTML/React rendering with SVG template loading and filling:

```typescript
// In ProfileCard component
useEffect(() => {
  if (!templateBackgroundSrc || !rootRef.current) return;
  
  // Load and fill SVG template
  fetch(templateBackgroundSrc)
    .then(r => r.text())
    .then(svgText => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
      const svgRoot = svgDoc.documentElement as SVGSVGElement;
      
      // Fill with profile data
      fillSvgTemplate(svgRoot, profile, selectedTemplate, resolvedPhotoUrl);
      
      // Insert into DOM
      const container = rootRef.current!.querySelector('.svg-container');
      container.innerHTML = '';
      container.appendChild(svgRoot);
    });
}, [profile, templateBackgroundSrc, resolvedPhotoUrl]);
```

### 3. Update Export Pipeline

Ensure exports capture the filled SVG instead of HTML:

```typescript
// In share-buttons.tsx captureProfileCardPng()
async function captureProfileCardPng(captureElementId: string): Promise<Blob> {
  const target = document.getElementById(captureElementId);
  const svgElement = target?.querySelector('svg');
  
  if (svgElement) {
    // Export SVG directly (lossless, perfect quality)
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    
    // Convert to PNG at fixed dimensions
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
    
    const canvas = document.createElement('canvas');
    canvas.width = selectedTemplate?.exportWidth || 1600;
    canvas.height = selectedTemplate?.exportHeight || 900;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    
    return new Promise(resolve => canvas.toBlob(blob => resolve(blob!), 'image/png'));
  }
  
  // Fallback to html2canvas
  return captureWithHtml2Canvas(target);
}
```

## Current Status

✅ **Renderer implemented** - Generic function ready to use  
✅ **Field mapping complete** - All Profile fields mapped to SVG IDs  
✅ **Text overflow handling** - Strategies for long text  
❌ **SVG templates not updated yet** - Need to add IDs to template files  
❌ **ProfileCard not integrated yet** - Still uses HTML rendering  
❌ **Export pipeline unchanged** - Still uses html2canvas

## Benefits Once Complete

1. **Pixel-perfect exports** - SVG rendering eliminates layout shift issues
2. **True WYSIWYG** - What you see matches what you export exactly
3. **Better performance** - SVG scales without quality loss
4. **Easier maintenance** - One renderer for all templates
5. **Consistent behavior** - No per-template branching logic

## Breaking Changes to Avoid

When integrating, ensure:
- Current free layout editor still works
- Existing card data loads correctly
- Export dimension calculations use template metadata
- Fallback to HTML rendering if SVG templates unavailable
