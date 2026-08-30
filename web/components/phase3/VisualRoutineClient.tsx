// PHASE3_RESCUE_SAFE_MVP
"use client";

import { useEffect, useMemo, useState } from "react";

type Step = {
  id: string;
  title: string;
  startTime: string;
  durationMinutes: number;
  icon: string;
  note: string;
  done: boolean;
};

const KEY = "neurobreath:routines:v1";

const starter: Step[] = [
  { id: "water", title: "Drink water", startTime: "08:00", durationMinutes: 5, icon: "💧", note: "Take one calm breath before switching.", done: false },
  { id: "bag", title: "Prepare bag", startTime: "08:15", durationMinutes: 10, icon: "🎒", note: "Two minutes left. Prepare for the next step.", done: false },
];

export function VisualRoutineClient() {
  const [steps, setSteps] = useState<Step[]>(starter);
  const [title, setTitle] = useState("");
  const [privateNote, setPrivateNote] = useState("");
  const [activeId, setActiveId] = useState("water");
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}") as { steps?: Step[]; privateNote?: string };
      if (Array.isArray(saved.steps)) setSteps(saved.steps);
      if (typeof saved.privateNote === "string") setPrivateNote(saved.privateNote);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ steps, privateNote }));
  }, [steps, privateNote]);

  const sorted = useMemo(() => [...steps].sort((a, b) => a.startTime.localeCompare(b.startTime)), [steps]);
  const active = sorted.find((step) => step.id === activeId) ?? sorted[0];

  useEffect(() => {
    if (active) setSecondsLeft(active.durationMinutes * 60);
  }, [active?.id]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  function addStep() {
    const clean = title.trim();
    if (!clean) return;
    const step: Step = {
      id: `${Date.now()}`,
      title: clean,
      startTime: "09:00",
      durationMinutes: 10,
      icon: "✅",
      note: "Next step is coming.",
      done: false,
    };
    setSteps((items) => [...items, step]);
    setTitle("");
    setActiveId(step.id);
  }

  function clearData() {
    localStorage.removeItem(KEY);
    setSteps(starter);
    setPrivateNote("");
    setRunning(false);
  }

  const total = active ? active.durationMinutes * 60 : 1;
  const progress = Math.round(((total - secondsLeft) / total) * 100);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Create routine step</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Step title" className="flex-1 rounded-xl border border-slate-300 px-4 py-3" />
          <button type="button" onClick={addStep} className="rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white">Add step</button>
        </div>
        <p className="mt-3 text-sm text-slate-600">Saved on this device only.</p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {sorted.map((step) => (
            <article key={step.id} className="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <button type="button" onClick={() => setActiveId(step.id)} className="block w-full text-left">
                <span className="text-3xl">{step.icon}</span>
                <h3 className="mt-2 text-xl font-bold text-slate-950">{step.startTime} — {step.title}</h3>
                <p className="mt-2 text-sm font-semibold text-teal-800">{step.note}</p>
              </button>
              <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={step.done} onChange={() => setSteps((items) => items.map((item) => item.id === step.id ? { ...item, done: !item.done } : item))} />
                Complete
              </label>
            </article>
          ))}
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Countdown</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">{active?.title ?? "No active step"}</p>
          <div className="mt-5 grid h-40 w-40 place-items-center rounded-full border-[12px] border-teal-700 text-center">
            <span className="text-2xl font-bold">{Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}</span>
          </div>
          <p className="mt-3 text-sm font-semibold">{progress}% complete</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => setRunning(true)} className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white">Start</button>
            <button type="button" onClick={() => setRunning(false)} className="rounded-xl border px-4 py-2 text-sm font-semibold">Pause</button>
            <button type="button" onClick={() => active && setSecondsLeft(active.durationMinutes * 60)} className="rounded-xl border px-4 py-2 text-sm font-semibold">Reset</button>
          </div>
          <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-7 text-amber-950">
            Carer Sync requires secure accounts and consent-based sharing. It is not enabled in this patch.
          </p>
        </aside>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h2 className="text-2xl font-bold">Private note — not shared with carers</h2>
        <textarea value={privateNote} onChange={(e) => setPrivateNote(e.target.value)} className="mt-4 min-h-32 w-full rounded-xl border p-4" />
        <button type="button" onClick={clearData} className="mt-4 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700">Clear local routine data</button>
      </section>
    </div>
  );
}
