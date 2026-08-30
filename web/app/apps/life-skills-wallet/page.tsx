// PHASE3_RESCUE_SAFE_MVP
import type { Metadata } from "next";
import { Phase3Page, Phase3SafetyNotice } from "@/components/phase3/Phase3Shell";
import { LifeSkillsWalletClient } from "@/components/phase3/LifeSkillsWalletClient";

export const metadata: Metadata = { title: "Life-Skills Wallet | NeuroBreath", description: "Local-only document metadata, medication reminders, support notes, and life organisation tools." };

export default function Page() {
  return <Phase3Page eyebrow="NeuroBreath utility app" title="Life-Skills Wallet" description="Organise important document metadata, support notes, and medication reminder cards locally."><Phase3SafetyNotice /><LifeSkillsWalletClient /></Phase3Page>;
}
