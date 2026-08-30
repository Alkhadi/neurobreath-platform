// PHASE3_RESCUE_SAFE_MVP
import type { Metadata } from "next";
import { Phase3Page, Phase3SafetyNotice, Phase3Section } from "@/components/phase3/Phase3Shell";

export const metadata: Metadata = { title: "Academic Licensing | NeuroBreath", description: "Educational institutional licensing preparation for reading, planning and routine support." };

export default function Page() {
  const audiences = ["Disability support teams", "Learning support departments", "Tutors", "Student wellbeing teams", "Registered students with learning differences"];
  const value = ["Supports reading accessibility", "Supports planning and executive function", "Supports routine-building", "Reduces friction when starting tasks"];
  return (
    <Phase3Page eyebrow="Institutional readiness" title="Academic Licensing" description="Prepare safe campus-wide access positioning without claiming formal accreditation or clinical outcomes.">
      <Phase3SafetyNotice />
      <Phase3Section title="Who this is for"><ul className="grid gap-3 md:grid-cols-2">{audiences.map((i) => <li key={i} className="rounded-2xl bg-slate-50 p-4 font-semibold">{i}</li>)}</ul></Phase3Section>
      <Phase3Section title="Safe value proposition"><ul className="grid gap-3 md:grid-cols-2">{value.map((i) => <li key={i} className="rounded-2xl bg-slate-50 p-4 font-semibold">{i}</li>)}</ul></Phase3Section>
    </Phase3Page>
  );
}
