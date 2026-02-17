import type { Metadata } from "next";
import { Inter, Roboto, Open_Sans, Lato, Montserrat, Poppins, Raleway, Nunito, Source_Sans_3, Merriweather, Playfair_Display, Ubuntu, Fira_Sans, Manrope, Plus_Jakarta_Sans } from "next/font/google";

import { NBCardPanel } from "@/components/nbcard/NBCardPanel";
import { NBCardInstallCTA } from "@/components/nbcard/NBCardInstallCTA";

// Load fonts with Next.js next/font/google (NO new dependencies)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-roboto" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });
const lato = Lato({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-lato" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const poppins = Poppins({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-poppins" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const sourceSans3 = Source_Sans_3({ subsets: ["latin"], variable: "--font-source-sans-3" });
const merriweather = Merriweather({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-merriweather" });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display" });
const ubuntu = Ubuntu({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-ubuntu" });
const firaSans = Fira_Sans({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-fira-sans" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta-sans" });

// Combined font classes
const fontClasses = `${inter.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${montserrat.variable} ${poppins.variable} ${raleway.variable} ${nunito.variable} ${sourceSans3.variable} ${merriweather.variable} ${playfairDisplay.variable} ${ubuntu.variable} ${firaSans.variable} ${manrope.variable} ${plusJakartaSans.variable}`;

export const metadata: Metadata = {
  title: "NB-Card — Digital Business Card",
  description: "Create, manage, and share your NB-Card profile. Installable PWA with on-device storage for profiles and captured contacts.",
  manifest: "/resources/nb-card/manifest.webmanifest",
};

export default function NBCardPage() {
  return (
    <main className={`min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 py-8 px-4 ${fontClasses}`}>
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
