/**
 * layout.tsx — Share viewer font loading
 *
 * Loads the same Google Fonts used by the NB-Card editor so that text layers
 * in shared cards render with the correct typeface on the public viewer page.
 *
 * Mirrors the font setup in /app/resources/nb-card/page.tsx exactly.
 * Beardsons + Monday custom fonts are already available globally via
 * @font-face in globals.css (loaded by the root layout).
 */

import type { ReactNode } from "react";
import {
  Inter,
  Roboto,
  Open_Sans,
  Lato,
  Montserrat,
  Poppins,
  Raleway,
  Nunito,
  Source_Sans_3,
  Merriweather,
  Playfair_Display,
  Ubuntu,
  Fira_Sans,
  Manrope,
  Plus_Jakarta_Sans,
} from "next/font/google";

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

const fontClasses = [
  inter.variable,
  roboto.variable,
  openSans.variable,
  lato.variable,
  montserrat.variable,
  poppins.variable,
  raleway.variable,
  nunito.variable,
  sourceSans3.variable,
  merriweather.variable,
  playfairDisplay.variable,
  ubuntu.variable,
  firaSans.variable,
  manrope.variable,
  plusJakartaSans.variable,
].join(" ");

export default function ShareViewerLayout({ children }: { children: ReactNode }) {
  return <div className={fontClasses}>{children}</div>;
}
