// PHASE3_RESCUE_SAFE_MVP
import type { Metadata } from "next";
import { Phase3Page, Phase3SafetyNotice, Phase3Section } from "@/components/phase3/Phase3Shell";

export const metadata: Metadata = { title: "Access to Work Readiness | NeuroBreath", description: "Educational preparation for workplace support conversations and Access to Work readiness." };

export default function Page() {
  const checklist = ["Define the work-related barrier.", "Identify tools or support that may help.", "Gather examples from work tasks.", "Check official GOV.UK Access to Work guidance.", "Speak with an employer or adviser where appropriate.", "Keep copies of communication.", "Seek qualified advice where needed."];
  const readiness = ["Service description", "Safeguarding policy placeholder", "Privacy and data protection readiness", "Accessibility statement", "Evidence and outcomes collection plan", "Pricing transparency", "Complaint handling route", "Referral and signposting process", "Professional boundaries"];
  return (
    <Phase3Page eyebrow="Institutional readiness" title="Access to Work Readiness" description="Prepare support conversations safely without claiming approval, guaranteed funding, or legal advice.">
      <Phase3SafetyNotice title="General information only" />
      <Phase3Section title="Preparation checklist"><ol className="list-decimal space-y-3 pl-6 text-base leading-8 text-slate-700">{checklist.map((i) => <li key={i}>{i}</li>)}</ol></Phase3Section>
      <Phase3Section title="Provider readiness areas"><div className="grid gap-3 md:grid-cols-2">{readiness.map((i) => <div key={i} className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold">{i}</div>)}</div></Phase3Section>
    </Phase3Page>
  );
}
