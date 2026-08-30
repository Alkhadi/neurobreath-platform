// PHASE3_RESCUE_SAFE_MVP
import type { Metadata } from "next";
import { Phase3Page, Phase3SafetyNotice, Phase3Section } from "@/components/phase3/Phase3Shell";

export const metadata: Metadata = { title: "Corporate Neuroinclusion | NeuroBreath", description: "Workplace neuroinclusion licensing preparation for HR, DEI and wellbeing teams." };

export default function Page() {
  const sections = ["Teams", "Managers", "Neurodivergent employees", "HR and DEI leads", "Access to Work alignment", "Enterprise onboarding checklist", "Data protection and consent expectations"];
  return (
    <Phase3Page eyebrow="Institutional readiness" title="Corporate Neuroinclusion" description="Prepare workplace support packages without diagnosis, medical replacement or guaranteed retention claims.">
      <Phase3SafetyNotice title="For workplace support, not diagnosis" />
      <Phase3Section title="Corporate package areas"><div className="grid gap-3 md:grid-cols-2">{sections.map((i) => <div key={i} className="rounded-2xl bg-slate-50 p-4 font-semibold">{i}</div>)}</div></Phase3Section>
    </Phase3Page>
  );
}
