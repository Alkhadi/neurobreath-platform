// PHASE3_RESCUE_SAFE_MVP
import Link from "next/link";
import type { Metadata } from "next";
import { Phase3Page, Phase3SafetyNotice, Phase3Section } from "@/components/phase3/Phase3Shell";

export const metadata: Metadata = { title: "NeuroBreath Apps | NeuroBreath", description: "NeuroBreath NeuroBreath educational and organisational support tools." };

const apps = [
  ["/apps/visual-routine", "Visual Routine Planner", "Visual steps, countdowns and private notes."],
  ["/apps/task-decomposer", "AI Task Decomposer", "Local fallback task breakdown and tone support."],
  ["/apps/reader", "Multi-Sensory Reader", "Browser TTS, highlighting and spacing controls."],
  ["/apps/life-skills-wallet", "Life-Skills Wallet", "Local document metadata and medication reminder cards."],
];

export default function Page() {
  return (
    <Phase3Page eyebrow="NeuroBreath" title="Cognitive Utility Suite" description="Safe MVP tools for planning, reading, routines, tasks and everyday organisation.">
      <Phase3SafetyNotice />
      <Phase3Section title="Apps">
        <div className="grid gap-5 md:grid-cols-2">
          {apps.map(([href, title, description]) => (
            <Link key={href} href={href} className="rounded-3xl border border-slate-200 bg-white/80 p-5 hover:shadow-md">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-700">{description}</p>
            </Link>
          ))}
        </div>
      </Phase3Section>
    </Phase3Page>
  );
}
