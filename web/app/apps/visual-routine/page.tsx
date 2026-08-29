// PHASE3_RESCUE_SAFE_MVP
import type { Metadata } from "next";
import { Phase3Page, Phase3SafetyNotice } from "@/components/phase3/Phase3Shell";
import { VisualRoutineClient } from "@/components/phase3/VisualRoutineClient";

export const metadata: Metadata = { title: "Visual Routine Planner | NeuroBreath", description: "Educational visual planning support with local-only routine storage." };

export default function Page() {
  return <Phase3Page eyebrow="NeuroBreath utility app" title="Visual Routine Planner" description="Plan a day with visual steps, predictable transitions, a countdown, and private local notes."><Phase3SafetyNotice /><VisualRoutineClient /></Phase3Page>;
}
