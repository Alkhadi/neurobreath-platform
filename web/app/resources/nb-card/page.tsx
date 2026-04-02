import type { Metadata } from "next";
import { Inter, Roboto, Open_Sans, Lato, Montserrat, Poppins, Raleway, Nunito, Source_Sans_3, Merriweather, Playfair_Display, Ubuntu, Fira_Sans, Manrope, Plus_Jakarta_Sans } from "next/font/google";

import { NBCardPanel } from "@/components/nbcard/NBCardPanel";
import { NBCardInstallCTA } from "@/components/nbcard/NBCardInstallCTA";
import { prisma, isDbDown } from "@/lib/db";

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

// Minimal delegate type to avoid stale Prisma TS squiggles
type OgImageRow = { ogImageUrl: string | null };
type NBCardOgMetaDelegate = {
  nBCardProfile: {
    findFirst(args: {
      where: { profileId: string };
      select: { ogImageUrl: true };
      orderBy: { ogImageAt: "desc" };
    }): Promise<OgImageRow | null>;
  };
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const profileId = typeof params.profile === "string" ? params.profile : undefined;

  // Try to load a personalised OG image for this profile
  let ogImageUrl: string | null = null;
  if (profileId && !isDbDown()) {
    try {
      const nbPrisma = prisma as unknown as NBCardOgMetaDelegate;
      const row = await nbPrisma.nBCardProfile.findFirst({
        where: { profileId },
        select: { ogImageUrl: true },
        orderBy: { ogImageAt: "desc" },
      });
      ogImageUrl = row?.ogImageUrl ?? null;
    } catch {
      // Non-fatal: fall back to branded image
    }
  }

  const ogImage = ogImageUrl ?? "/api/og/nb-card";

  return {
    title: "NB-Card — Digital Business Card",
    description: "Create, manage, and share your NB-Card profile. Installable PWA with on-device storage for profiles and captured contacts.",
    manifest: "/resources/nb-card/manifest.webmanifest",
    openGraph: {
      title: "NB-Card — Digital Business Card",
      description: "View and download this digital business card. Works with address, bank, business, flyer, and wedding cards.",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "NB-Card Digital Business Card",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "NB-Card — Digital Business Card",
      description: "View and download this digital business card.",
      images: [ogImage],
    },
  };
}

export default function NBCardPage() {
  return (
    <main className={`min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 ${fontClasses}`}>
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2 sm:mb-3">
            NB-Card — Digital Business Card
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">A lightweight, installable app experience that keeps your data on-device.</p>
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
