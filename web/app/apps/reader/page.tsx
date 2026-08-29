// PHASE3_RESCUE_SAFE_MVP
import type { Metadata } from "next";
import { Phase3Page, Phase3SafetyNotice } from "@/components/phase3/Phase3Shell";
import { ReaderClient } from "@/components/phase3/ReaderClient";

export const metadata: Metadata = { title: "Multi-Sensory Reader | NeuroBreath", description: "Browser-based reading support with text-to-speech, highlighting, and spacing controls." };

export default function Page() {
  return <Phase3Page eyebrow="NeuroBreath utility app" title="Multi-Sensory Reader" description="Paste text, listen with browser speech, highlight words, and adjust spacing to reduce reading fatigue."><Phase3SafetyNotice /><ReaderClient /></Phase3Page>;
}
