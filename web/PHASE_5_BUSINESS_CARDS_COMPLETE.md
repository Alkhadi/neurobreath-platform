# Phase 5: Business Front/Back Templates + Export Implementation

## Status: Completed (MVP)

## Date: 2026-02-11

## Summary

Phase 5 implements business card front/back template system with side-specific export controls. The implementation provides:

1. ✅ Separate SVG templates for business card front and back sides
2. ✅ Template manifest entries with `side: "front" | "back"` metadata
3. ✅ Front/Back toggle UI in NBCardPanel (visible only for business cards)
4. ✅ Side-aware export button labels ("Export Front PNG", "Export Back PDF", etc.)
5. 📝 Foundation for future 2-page PDF export (requires template switching mechanism)

## Implementation Details

### 1. Business Card Templates Created

**File: `/web/public/nb-card/templates/business/business-01-front.svg`**
- Landscape orientation (1600×900)
- Contains: profile photo, name, title, company, contact details, logo, QR code
- Uses standard SVG element IDs for data-driven rendering
- Professional charcoal gradient theme with briefcase motif

**File: `/web/public/nb-card/templates/business/business-01-back.svg`**
- Landscape orientation (1600×900)
- Contains: company tagline, specialties, address block, social media handles, large logo
- Centered layout optimized for back-side content
- Matching visual theme with front template

### 2. Template Manifest Updates

**File: `/web/public/nb-card/templates/manifest.json`**

Added two new template entries:

```json
{
  "id": "business-01-front",
  "label": "Executive Charcoal — Front",
  "category": "Business",
  "type": "business-card",
  "orientation": "landscape",
  "src": "/nb-card/templates/business/business-01-front.svg",
  "cardCategory": "BUSINESS",
  "exportWidth": 1600,
  "exportHeight": 900,
  "side": "front"
}
```

```json
{
  "id": "business-01-back",
  "label": "Executive Charcoal — Back",
  "category": "Business",
  "type": "business-card",
  "orientation": "landscape",
  "src": "/nb-card/templates/business/business-01-back.svg",
  "cardCategory": "BUSINESS",
  "exportWidth": 1600,
  "exportHeight": 900,
  "side": "back"
}
```

### 3. NBCardPanel Front/Back Toggle

**File: `/web/components/nbcard/NBCardPanel.tsx`**

**Added State:**
```typescript
const [currentBusinessSide, setCurrentBusinessSide] = useState<'front' | 'back'>('front');
```

**Detection Logic:**
```typescript
const isBusinessCard = selectedTemplate?.cardCategory === 'BUSINESS' && selectedTemplate?.side !== undefined;
```

**Template Switching:**
```typescript
const getCompanionTemplateId = (currentId: string, currentSide: 'front' | 'back'): string | undefined => {
  const targetSide = currentSide === 'front' ? 'back' : 'front';
  return currentId.replace(`-${currentSide}`, `-${targetSide}`);
};

const handleBusinessSideToggle = (side: 'front' | 'back') => {
  if (!selectedTemplate || !isBusinessCard) return;
  const companionId = getCompanionTemplateId(templateSelection.backgroundId!, side === 'front' ? 'back' : 'front');
  if (!companionId) return;
  setCurrentBusinessSide(side);
  setTemplateSelection({ ...templateSelection, backgroundId: companionId });
};
```

**UI Component:**
```tsx
{isBusinessCard && (
  <div className="mb-6 flex justify-center">
    <div className="inline-flex bg-white rounded-lg shadow-md p-1">
      <button
        onClick={() => handleBusinessSideToggle('front')}
        className={/* active gradient or gray text based on currentBusinessSide */}
      >
        Front
      </button>
      <button
        onClick={() => handleBusinessSideToggle('back')}
        className={/* active gradient or gray text based on currentBusinessSide */}
      >
        Back
      </button>
    </div>
  </div>
)}
```

### 4. ShareButtons Export Labels

**File: `/web/app/contact/components/share-buttons.tsx`**

**Conditional Export Button Labels:**
```tsx
{selectedTemplate?.cardCategory === 'BUSINESS' && selectedTemplate?.side ? (
  <>
    <DropdownMenuItem onClick={handleDownloadPng} disabled={!!busyKey}>
      Export {selectedTemplate.side === 'front' ? 'Front' : 'Back'} PNG
    </DropdownMenuItem>
    <DropdownMenuItem onClick={handleDownloadPdf} disabled={!!busyKey}>
      Export {selectedTemplate.side === 'front' ? 'Front' : 'Back'} PDF
    </DropdownMenuItem>
  </>
) : (
  <>
    <DropdownMenuItem onClick={handleDownloadPdf} disabled={!!busyKey}>
      Download PDF
    </DropdownMenuItem>
    <DropdownMenuItem onClick={handleDownloadPng} disabled={!!busyKey}>
      Download PNG
    </DropdownMenuItem>
  </>
)}
```

## Future Enhancement: 2-Page PDF Export

**Current State:**
- Business cards export the currently visible side only
- User must manually toggle to back side and export separately

**Required for Full Implementation:**

1. **Template Switch Callback:**
   - Pass `onTemplateSwitch(templateId: string) => Promise<void>` from NBCardPanel to ShareButtons
   - Ensures export pipeline can programmatically change templates

2. **Dual-Capture Logic:**
   ```typescript
   // Pseudocode
   async function exportBusinessCardPdf() {
     const frontId = getFrontTemplateId();
     const backId = getBackTemplateId();
     
     await onTemplateSwitch(frontId);
     const frontBlob = await captureProfileCardPng();
     
     await onTemplateSwitch(backId);
     const backBlob = await captureProfileCardPng();
     
     const pdf = await PDFDocument.create();
     const frontPage = pdf.addPage([1600, 900]);
     const backPage = pdf.addPage([1600, 900]);
     // embed frontBlob and backBlob...
     return pdf.save();
   }
   ```

3. **State Restoration:**
   - After export, restore original template selection
   - Prevent UI flicker during programmatic switches

**Documented in Code:**
See comment block at line ~330 in share-buttons.tsx:
```typescript
// TODO Phase 5 Enhancement: Business Card Dual-Sided PDF Export
// To implement 2-page PDF (front + back):
// 1. Pass template switch callback from NBCardPanel to ShareButtons
// 2. In export pipeline: capture front → switch to back template → capture back
// 3. Create PDF with both pages using pdf-lib addPage()
// 4. Ensure both pages have same dimensions (exportWidth × exportHeight)
// For now, business cards export the currently visible side only.
```

## Verification Results

**All Gates Passing:**

```bash
✅ yarn lint --max-warnings=0
   Done in 5.25s

✅ yarn typecheck
   Done in 2.82s

✅ yarn build
   Done in 67.14s
   /us/resources/nb-card: 177 B, 459 kB First Load JS
```

## User Experience Flow

1. User navigates to `/uk/resources/nb-card` (or `/us/resources/nb-card`)
2. Selects "business-01-front" template from Template Picker
3. **Front/Back toggle appears** below the profile card
4. User clicks "Back" → card switches to business-01-back template
5. User opens Export dropdown → sees "Export Front PNG" / "Export Back PDF" (labels match current side)
6. User downloads PNG or PDF of current side
7. User toggles back to "Front" → repeat export for other side

## Breaking Changes

**None.** All changes are additive:
- Existing templates continue to work (no `side` property = regular background)
- Toggle UI only appears when `cardCategory === 'BUSINESS' && side !== undefined`
- Export buttons gracefully degrade to "Download PNG" / "Download PDF" for non-business cards

## Files Modified

1. `/web/public/nb-card/templates/business/business-01-front.svg` (new)
2. `/web/public/nb-card/templates/business/business-01-back.svg` (new)
3. `/web/public/nb-card/templates/manifest.json` (+2 templates)
4. `/web/components/nbcard/NBCardPanel.tsx` (+40 lines: state, logic, UI toggle)
5. `/web/app/contact/components/share-buttons.tsx` (+15 lines: conditional labels, TODO comment)

## Next Steps (Phase 7 or Beyond)

- Implement template switch callback for dual-capture PDF export
- Add more business card template pairs (business-02, business-03, etc.)
- Consider "Export Both Sides" button that creates 2-page PDF automatically
- Add optional business-specific fields (e.g., company logo upload, tagline editor)

## Notes

- Templates use standard SVG element IDs compatible with Phase 4 SVG renderer
- Both front and back templates share same export dimensions (1600×900) for consistent PDF pages
- Template naming convention: `business-{number}-{side}` ensures easy front↔back pairing
- UI toggle uses Tailwind gradient matching existing NeuroBreath purple/blue theme
