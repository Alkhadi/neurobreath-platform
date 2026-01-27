import type { Metadata } from "next";
import Image from "next/image";

import { NBCardPanel } from "@/components/nbcard/NBCardPanel";

export const metadata: Metadata = {
  title: "NB-Card — Digital Business Card",
  description: "Create, manage, and share your NB-Card profile. Installable PWA with on-device storage for profiles and captured contacts.",
  manifest: "/resources/nb-card/manifest.webmanifest",
};

export default function NBCardPage() {
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

        {/* Install / Download Area */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
              <Image
                src="/icons/neurobreath-logo-square-192.png"
                alt="NeuroBreath"
                width={56}
                height={56}
                className="rounded-xl"
                priority
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Install NB-Card</h2>
                <p className="text-gray-600">Works on Android, iOS, Windows, and macOS via PWA install.</p>
              </div>
            </div>

            <div className="md:ml-auto flex flex-col sm:flex-row gap-3">
              <a
                href="#nbcard-install"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 font-semibold hover:shadow-lg transition-all"
              >
                Download / Install
              </a>
              <a
                href="#nbcard-app"
                className="inline-flex items-center justify-center rounded-xl border border-purple-200 bg-white text-gray-800 px-6 py-3 font-semibold hover:bg-purple-50 transition-all"
              >
                Open App
              </a>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 p-4">
              <div className="font-bold text-gray-800">Android</div>
              <div className="text-sm text-gray-600">Use Chrome → menu → “Install app” / “Add to Home screen”.</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-4">
              <div className="font-bold text-gray-800">iOS</div>
              <div className="text-sm text-gray-600">Open in Safari → Share → “Add to Home Screen”.</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-4">
              <div className="font-bold text-gray-800">Windows</div>
              <div className="text-sm text-gray-600">Chrome/Edge → install icon in address bar (or menu → Install).</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-pink-50 to-blue-50 p-4">
              <div className="font-bold text-gray-800">macOS</div>
              <div className="text-sm text-gray-600">Chrome → install icon in address bar; Safari uses “Add to Dock”.</div>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Your profiles and captured contacts are stored locally on your device. Website updates won’t overwrite your data.
          </p>
        </div>

        {/* App Panel */}
        <section id="nbcard-app" aria-label="NB-Card App">
          <NBCardPanel />
        </section>
      </div>
    </main>
  );
}
