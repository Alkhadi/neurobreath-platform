// PHASE3_RESCUE_SAFE_MVP
"use client";

import { useMemo, useState } from "react";

type SmallStep = { id: string; title: string; minutes: number; xp: number; done: boolean };

function createSteps(goal: string, time: number): SmallStep[] {
  const task = goal.trim() || "Start the task";
  const minutes = Math.max(1, Math.floor(time / 6));
  return [
    `Prepare what you need for: ${task}`,
    "Remove one small distraction.",
    "Do the smallest visible first action.",
    "Continue for one short focused block.",
    "Take a short reset break.",
    "Check what is complete and choose the next step.",
  ].map((title, index) => ({ id: `${index}`, title, minutes, xp: 10, done: false }));
}

export function TaskDecomposerClient() {
  const [goal, setGoal] = useState("Clean the kitchen");
  const [time, setTime] = useState(30);
  const [steps, setSteps] = useState<SmallStep[]>(createSteps("Clean the kitchen", 30));
  const [message, setMessage] = useState("Could you please send me the meeting notes?");
  const [tone, setTone] = useState("professional");

  const progress = useMemo(() => steps.length ? Math.round((steps.filter((s) => s.done).length / steps.length) * 100) : 0, [steps]);
  const xp = steps.filter((s) => s.done).reduce((sum, step) => sum + step.xp, 0);

  function rewrite() {
    const clean = message.trim();
    if (!clean) return "";
    if (tone === "shorter") return clean.split(".")[0] + ".";
    if (tone === "warmer") return `Hello, ${clean} Thank you.`;
    if (tone === "calmer") return `Hello, when you have a moment, ${clean.charAt(0).toLowerCase() + clean.slice(1)} Thank you.`;
    if (tone === "clearer") return `Hello, I am asking for this clearly: ${clean}`;
    return `Hello,\n\n${clean}\n\nKind regards`;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h2 className="text-2xl font-bold">Break down a task</h2>
        <textarea value={goal} onChange={(e) => setGoal(e.target.value)} className="mt-4 min-h-24 w-full rounded-xl border p-4" />
        <div className="mt-4 flex flex-wrap gap-3">
          <select value={time} onChange={(e) => setTime(Number(e.target.value))} className="rounded-xl border p-3">
            {[5, 10, 15, 30, 60].map((item) => <option key={item} value={item}>{item} minutes</option>)}
          </select>
          <button type="button" onClick={() => setSteps(createSteps(goal, time))} className="rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white">Create small steps</button>
        </div>
        <p className="mt-3 text-sm text-slate-600">Local rule-based fallback. No API key or external AI is required.</p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h2 className="text-2xl font-bold">Dopamine Hook progress</h2>
        <p className="mt-2 text-sm font-semibold text-teal-800">{xp} XP · {progress}% complete</p>
        <div className="mt-4 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-teal-700" style={{ width: `${progress}%` }} /></div>
        <div className="mt-5 space-y-3">
          {steps.map((step) => (
            <label key={step.id} className="flex gap-3 rounded-2xl border p-4">
              <input type="checkbox" checked={step.done} onChange={() => setSteps((items) => items.map((item) => item.id === step.id ? { ...item, done: !item.done } : item))} />
              <span><strong>{step.title}</strong><br /><span className="text-sm text-slate-600">{step.minutes} minutes · {step.xp} XP</span></span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h2 className="text-2xl font-bold">Tone assistant</h2>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-4 min-h-24 w-full rounded-xl border p-4" />
        <select value={tone} onChange={(e) => setTone(e.target.value)} className="mt-3 rounded-xl border p-3">
          <option value="professional">professional</option><option value="clearer">clearer</option><option value="warmer">warmer</option><option value="shorter">shorter</option><option value="calmer">calmer</option>
        </select>
        <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7">{rewrite()}</pre>
      </section>
    </div>
  );
}
