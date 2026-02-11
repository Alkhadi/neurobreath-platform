import type { Metadata } from "next";

import { NBCardPanel } from "@/components/nbcard/NBCardPanel";
import { NBCardInstallCTA } from "@/components/nbcard/NBCardInstallCTA";

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * NB-CARD AUDIT NOTES (Phase 1 Baseline - 2026-02-11)
 * ══════════════════════════════════════════════════════════════════════════════
 * 
 * ENTRY ROUTE: /uk/resources/nb-card/page.tsx
 * 
 * COMPONENTS:
 * - NBCardPanel: Main container at @/components/nbcard/NBCardPanel.tsx
 *   - Manages state: profiles, contacts, template selection
 *   - Renders: ProfileCard (preview), TemplatePicker, ShareButtons, ProfileManager
 *   - Edit/pen controls: NOT visible yet (likely in ProfileManager or nested)
 * 
 * - ProfileCard: Card renderer at /app/contact/components/profile-card.tsx
 *   - Renders SVG template backgrounds + overlays
 *   - Uses aspect-ratio via orientationClass (portrait/landscape)
 *   - Template layers: background (z=0), tint (z=1), lighten (z=1), readability (z=1), overlay (z=2), content (z=10)
 *   - Free layout editor mode with drag/resize (editMode prop)
 *   - NO pen/X overlay controls visible in this component
 * 
 * - ShareButtons: Export pipeline at /app/contact/components/share-buttons.tsx
 *   - Uses html2canvas (v1.4.1) for PNG capture
 *   - Uses pdf-lib (v1.17.1) for PDF generation
 *   - jsPDF (v4.0.0) also present but not primary in recent code
 *   - No data-html2canvas-ignore attributes found yet
 * 
 * TEMPLATES:
 * - Manifest: /public/nb-card/templates/manifest.json
 * - Library: @/lib/nbcard-templates.ts (loads manifest, theme tokens)
 * - Folders: /public/nb-card/templates/{address,bank,business,backgrounds,overlays}
 * - Current templates lack metadata for: cardCategory, exportWidth/exportHeight, side (front/back)
 * - Business templates exist as *-bg.svg and *-avatar.svg (NOT front/back separation yet)
 * 
 * STORAGE:
 * - IndexedDB: @/app/contact/lib/nbcard-storage.ts (using 'idb' v8.0.3)
 * - Keys: nbcard:v1:profiles, nbcard:v1:contacts (with legacy migration)
 * - Images stored as blobs (not base64)
 * - Asset management: /app/contact/lib/nbcard-assets.ts (storeAsset, resolveAssetUrl)
 * - NO SERVER SYNC YET - local-only storage
 * 
 * EXPORT LIBRARIES:
 * - html2canvas: ^1.4.1 ✅
 * - pdf-lib: ^1.17.1 ✅
 * - jspdf: ^4.0.0 ✅ (legacy)
 * - idb: ^8.0.3 ✅
 * - DOMPurify: ❌ NOT PRESENT (will implement minimal SVG sanitizer)
 * 
 * OVERLAYS:
 * - Edit/pen controls: Not yet located in ProfileCard
 * - Likely in ProfileManager or NBCardPanel edit mode
 * - No data-html2canvas-ignore found yet
 * 
 * NEXT STEPS:
 * Phase 2: Fix aspect-ratio enforcement (already present but verify export dimensions)
 * Phase 3: Update manifest with cardCategory, exportWidth/exportHeight, side
 * Phase 4: Implement single generic SVG fill renderer
 * Phase 5: Separate business front/back templates + 2-page PDF
 * Phase 6: Add data-html2canvas-ignore to overlays
 * Phase 7: Implement server sync API + merge
 * Phase 8: Verify Share buttons implementation
 * Phase 9: Add image import with SVG sanitization
 * ══════════════════════════════════════════════════════════════════════════════
 */

export const metadata: Metadata = {
  title: "NB-Card — Digital Business Card",
  description:
    "Create, manage, and share your NB-Card profile. Installable PWA with on-device storage for profiles and captured contacts.",
  manifest: "/resources/nb-card/manifest.webmanifest",
};

export default function UKNBCardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-3">
            NB-Card — Digital Business Card
          </h1>
          <p className="text-gray-600 text-lg">A lightweight, installable app experience that keeps your data on-device.</p>
        </div>

        {/* Primary Install CTA */}
        <NBCardInstallCTA />

        {/* App Panel */}
        <section id="nbcard-app" aria-label="NB-Card App">
          <NBCardPanel />
        </section>
      </div>
    </main>
  );
}
