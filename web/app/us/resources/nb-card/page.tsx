import type { Metadata } from "next";

import { NBCardPanel } from "@/components/nbcard/NBCardPanel";

export const metadata: Metadata = {
  title: "NB-Card — Digital Business Card",
  description:
    "Create, manage, and share your NB-Card profile. Installable PWA with on-device storage for profiles and captured contacts.",
  manifest: "/us/resources/nb-card/manifest.webmanifest",
};

export default function USNBCardPage() {
  return <NBCardPanel />;
}
