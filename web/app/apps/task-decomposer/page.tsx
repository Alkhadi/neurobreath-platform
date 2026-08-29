// PHASE3_RESCUE_SAFE_MVP
import type { Metadata } from "next";
import { Phase3Page, Phase3SafetyNotice } from "@/components/phase3/Phase3Shell";
import { TaskDecomposerClient } from "@/components/phase3/TaskDecomposerClient";

export const metadata: Metadata = { title: "AI Task Decomposer | NeuroBreath", description: "A safe local fallback task decomposer and tone assistant for practical planning support." };

export default function Page() {
  return <Phase3Page eyebrow="NeuroBreath utility app" title="AI Task Decomposer" description="Break overwhelming goals into smaller, calmer, practical steps with progress rewards."><Phase3SafetyNotice /><TaskDecomposerClient /></Phase3Page>;
}
