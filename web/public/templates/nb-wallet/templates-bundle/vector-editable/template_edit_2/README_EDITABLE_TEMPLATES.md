# Editable Template Pack (SVG + Fields)

This folder contains **editable SVG templates** plus matching `*.fields.json` descriptor files.

## What you can edit (runtime)
1) **Text fields** (e.g., `field_fullName`, `field_phone`)
2) **Image slots** (e.g., `slot_logo`, `slot_profilePhoto`)
3) **QR / Barcode slots** (`slot_qr`, `slot_barcode`)

All templates are **vector-first**:
- No template SVG embeds a `.png/.jpg` background.
- Any `<image>` nodes are **empty href slots** intended for user-provided images at runtime.

## Files
- `*.svg` — the template artwork + editable overlay
- `*.fields.json` — field/slot metadata your editor can read to render form inputs and do hit-testing

## Runtime editing (web)
### Update text
```js
const svg = document.querySelector('svg');
svg.getElementById('field_fullName').textContent = 'Mr Alkhadi Koroma';
svg.getElementById('field_phone').textContent = '+44 7...';
```

### Update an image slot (logo/photo/QR/barcode)
Use `href` (SVG2) and set `xlink:href` as a compatibility fallback.

```js
function setSlotImage(svgEl, slotId, dataUrl) {
  const node = svgEl.getElementById(slotId);
  if (!node) return;
  node.setAttribute('href', dataUrl);
  node.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', dataUrl);
}

// example:
setSlotImage(svg, 'slot_logo', 'data:image/png;base64,...');
```

## QR code (recommended “scan to share”)
### What to encode
Common options:
- **shareUrl**: `https://yourdomain.com/u/<slug>`
- **vCard** (best for contact cards)
- **mailto:** / **tel:** / **https://** website

### Generate QR at runtime
Generate a QR image (PNG or SVG) and inject into `slot_qr`:
- If you already have a QR utility in your repo, reuse it.
- If not, generate on the server and return a `data:` URL or a normal URL.

Payload examples:
- shareUrl: `https://neurobreath.co.uk`
- vCard:
  ```
  BEGIN:VCARD
  VERSION:3.0
  FN:Mr Alkhadi Koroma
  TEL:+4477...
  EMAIL:...
  URL:https://neurobreath.co.uk
  END:VCARD
  ```

## Barcode (optional; linear Code128)
Templates that include `slot_barcode` expect a **Code128** (or similar) barcode representing:
- `shareUrl`, or
- a short `shareText` / `id` you resolve server-side

### Practical approach
- Generate barcode PNG/SVG at runtime, then inject into `slot_barcode` exactly like QR.

## Dimensions
Each SVG uses a fixed `width/height/viewBox` (authoritative).
Export by scaling up (e.g., 2×) for crisp print/PDF.

Suggested exports:
- Cards: 2× PNG for sharing, PDF for print
- Flyers: 2× PNG for social, PDF for print

## Safety checks
Use a CI script (dependency-free) to prevent raster backgrounds from being committed into template SVGs:
- scan for `href/xlink:href/url(...)` that reference `.png/.jpg/...`
