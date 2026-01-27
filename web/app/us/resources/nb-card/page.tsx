import type { Metadata } from "next";

import { NBCardPanel } from "@/components/nbcard/NBCardPanel";
import { NBCardInstallCTA } from "@/components/nbcard/NBCardInstallCTA";

export const metadata: Metadata = {
  title: "NB-Card — Digital Business Card",
  description:
    "Create, manage, and share your NB-Card profile. Installable PWA with on-device storage for profiles and captured contacts.",
  manifest: "/us/resources/nb-card/manifest.webmanifest",
};

export default function USNBCardPage() {
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
