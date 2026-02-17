# NB-Card Export QA Checklist

**Purpose**: Manual QA steps to verify NB-Card exports match preview and meet quality standards.

## Prerequisites

- Browser: Chrome, Safari, or Firefox (latest stable)
- Test profiles with:
  - Address card with directionsNote
  - Custom map URL (mapUrlOverride)
  - Custom destination (mapDestinationOverride)
  - Flyer/Wedding cards
  - Business cards (front/back)

---

## Part A: Address Map Link & URL Sanitization

### A1: directionsNote URL Stripping

**Steps**:
1. Open ProfileManager for an ADDRESS card
2. Paste a URL into "Directions Note" (e.g., `https://example.com`)
3. Save the profile
4. Check the card preview

**Expected**:
- ✅ Warning toast: "URLs removed from Directions Note"
- ✅ Preview shows NO URL in directionsNote text
- ✅ Export PNG: directionsNote contains NO URL
- ✅ Export PDF: directionsNote contains NO URL

### A2: mapUrlOverride Click Behavior

**Steps**:
1. Open ProfileManager for an ADDRESS card
2. Enter a custom map URL in "Custom Directions/Map URL": `https://www.google.com/maps/@51.5,-0.1,15z`
3. Save and view card

**Expected**:
- ✅ Clicking "Get Directions" link opens the custom URL in new tab
- ✅ Share text includes the custom URL (not a composed address)

### A3: mapDestinationOverride Plain Text

**Steps**:
1. Open ProfileManager for an ADDRESS card
2. Enter plain text in "Custom Destination": `Eiffel Tower, Paris`
3. Save and view card

**Expected**:
- ✅ Clicking "Get Directions" opens `/dir/?api=1&destination=Eiffel%20Tower%2C%20Paris&travelmode=driving`
- ✅ NO URLs visible in card text
- ✅ Share text includes the directions URL (not raw text)

### A4: URL Auto-Move from Destination to URL Override

**Steps**:
1. Open ProfileManager for an ADDRESS card
2. Paste a URL into "Custom Destination": `https://goo.gl/maps/example`
3. Observe behavior

**Expected**:
- ✅ Toast: "URL detected. Moving to Custom Map URL field."
- ✅ Custom Destination field is cleared
- ✅ Custom Map URL field contains the pasted URL

---

## Part C: Free Layout Editor

### C1: Edit Mode Toggle

**Steps**:
1. Open NB-Card page with a profile
2. Click "Edit Layout" button
3. Click a layer on the card (e.g., avatar, text)

**Expected**:
- ✅ Toast: "Layout Edit Mode enabled..."
- ✅ Clicking a layer shows purple outline
- ✅ Resize handle appears (bottom-right corner)
- ✅ Dragging the layer moves it live

### C2: Export Does Not Include Edit UI

**Steps**:
1. Enable Edit Layout mode
2. Select a layer (purple outline visible)
3. Export PNG

**Expected**:
- ✅ Exported PNG shows NO purple outline
- ✅ Exported PNG shows NO resize handles
- ✅ Exported PNG matches preview (without edit UI)

---

## Part D: Export & Share Reliability

### D1: PNG Export Fidelity

**Steps**:
1. Create a card with:
   - Custom background
   - Avatar image
   - Colored text layers
2. Export PNG

**Expected**:
- ✅ PNG matches on-screen preview pixel-for-pixel
- ✅ Colors match (no shift/darkening)
- ✅ Fonts loaded correctly (no missing characters/icons)
- ✅ Images loaded (no broken/missing images)

### D2: PDF Export Fidelity

**Steps**:
1. Export PDF from the same card as D1
2. Open PDF in viewer

**Expected**:
- ✅ PDF contains PNG embedded at correct size
- ✅ PDF dimensions match exported PNG
- ✅ PDF visual quality matches PNG (no compression artifacts)

### D3: Web Share API (Mobile)

**Steps** (on mobile device with share support):
1. Export PNG
2. Click "Share Image"

**Expected**:
- ✅ Native share sheet opens with PNG attached
- ✅ Can share to WhatsApp/Telegram/etc. as image file

**Steps** (on desktop without share support):
1. Click "Share Image"

**Expected**:
- ✅ PNG downloads automatically (fallback)
- ✅ Toast: "Sharing not supported here"

### D4: Share PDF (Mobile)

**Steps** (on mobile device):
1. Click "Share PDF"

**Expected**:
- ✅ Native share sheet opens with PDF attached
- ✅ Can share to email/drive as PDF file

---

## Part B: Non-Required Fields

### B1: Save Profile with Empty Name

**Steps**:
1. Create new profile
2. Leave "Full Name" empty
3. Fill only "Phone": `+44 1234 567890`
4. Save

**Expected**:
- ✅ Save succeeds (no validation error)
- ✅ Preview shows phone but no name
- ✅ Export works without error

### B2: vCard Export with Missing Fields

**Steps**:
1. Export vCard for profile with empty email/phone

**Expected**:
- ✅ vCard downloads successfully
- ✅ vCard does not contain "undefined" values
- ✅ Missing fields are omitted gracefully

---

## Common Issues & Fixes

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| URLs appear in directionsNote export | Sanitization not applied | Check `stripUrls` is called before render |
| Export includes purple outline | Missing `data-html2canvas-ignore` | Add attribute to edit UI elements |
| Missing fonts in export | Fonts not loaded before capture | Ensure `waitForFonts()` is called |
| Share button does nothing | Web Share not supported | Verify fallback download triggers |
| PDF export fails | PNG capture failed | Check console for preflight errors |

---

## Screenshot Comparisons

For each test, capture:
1. On-screen preview
2. Exported PNG
3. Exported PDF (screenshot of PDF viewer)

Compare side-by-side:
- Colors
- Font rendering
- Image quality
- Layout alignment

---

**Last Updated**: 2026-01-20
