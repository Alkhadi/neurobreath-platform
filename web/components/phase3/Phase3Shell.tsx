// PHASE3_FORCE_VISIBLE_NAV
import Link from "next/link";
import type { ReactNode } from "react";
import { phase3MenuGroups } from "@/data/phase3/phase3-menu";

export function Phase3SafetyNotice({
  title = "Educational and organisational support only",
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm leading-7 text-amber-950">
      <h2 className="mb-2 text-base font-semibold">{title}</h2>
      {children ?? (
        <p>
          NeuroBreath does not diagnose, treat, cure, or replace professional medical,
          legal, employment, safeguarding, or emergency advice. For urgent or serious
          concerns, contact an appropriate qualified professional or emergency service.
        </p>
      )}
    </section>
  );
}

export function Phase3Page({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <section className="mb-8 rounded-3xl border border-slate-200 bg-[var(--nb-surface,#FFFCF7)] p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold text-teal-800">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">{description}</p>
      </section>

      <Phase3ExamplesPanel />

      <div className="mt-8 space-y-8">{children}</div>
    </main>
  );
}

export function Phase3Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-[var(--nb-surface,#FFFCF7)] p-5 shadow-sm md:p-8">
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Phase3ExamplesPanel() {
  return (
    <section className="rounded-3xl border border-teal-100 bg-teal-50/50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-teal-800">Quick examples</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">What can I do here?</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-700">
            Use these examples to choose the right tool quickly.
          </p>
        </div>
        <Link href="/apps" className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">
          View all apps
        </Link>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {phase3MenuGroups.map((group) => (
          <section key={group.title} className="rounded-2xl bg-white/80 p-4">
            <Link href={group.href} className="text-lg font-bold text-slate-950 hover:text-teal-800">
              {group.title}
            </Link>
            <p className="mt-1 text-sm leading-7 text-slate-700">{group.description}</p>

            <div className="mt-4 grid gap-3">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-slate-200 bg-[var(--nb-surface,#FFFCF7)] p-4 hover:border-teal-300 hover:bg-teal-50"
                >
                  <span className="block font-semibold text-slate-950">{item.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-700">{item.description}</span>
                  <span className="mt-2 block text-xs leading-5 text-slate-600">{item.example}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
