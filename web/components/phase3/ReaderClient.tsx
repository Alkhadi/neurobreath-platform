// PHASE3_RESCUE_SAFE_MVP
"use client";

import { useMemo, useState } from "react";

export function ReaderClient() {
  const [text, setText] = useState("NeuroBreath helps people use small, practical tools for routines, reading, calm and focus.");
  const [fontSize, setFontSize] = useState(20);
  const [spacing, setSpacing] = useState(0.08);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [rate, setRate] = useState(0.9);
  const [activeWord, setActiveWord] = useState(-1);

  const parts = useMemo(() => text.split(/(\s+)/), [text]);

  function play() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const index = text.slice(0, event.charIndex).trim().split(/\s+/).length - 1;
        setActiveWord(index);
      }
    };
    utterance.onend = () => setActiveWord(-1);
    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    window.speechSynthesis?.cancel();
    setActiveWord(-1);
  }

  let wordIndex = -1;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h2 className="text-2xl font-bold">Reader input</h2>
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="mt-4 min-h-40 w-full rounded-xl border p-4" />
        <p className="mt-3 text-sm text-slate-600">Browser text-to-speech is used locally. Browser support may vary.</p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h2 className="text-2xl font-bold">Reader controls</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={play} className="rounded-xl bg-teal-700 px-4 py-2 font-semibold text-white">Play</button>
          <button type="button" onClick={() => window.speechSynthesis?.pause()} className="rounded-xl border px-4 py-2 font-semibold">Pause</button>
          <button type="button" onClick={() => window.speechSynthesis?.resume()} className="rounded-xl border px-4 py-2 font-semibold">Resume</button>
          <button type="button" onClick={stop} className="rounded-xl border px-4 py-2 font-semibold">Stop</button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <label>Font size<input type="range" min="16" max="34" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} /></label>
          <label>Letter spacing<input type="range" min="0" max="0.25" step="0.01" value={spacing} onChange={(e) => setSpacing(Number(e.target.value))} /></label>
          <label>Line height<input type="range" min="1.4" max="2.4" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} /></label>
          <label>Speed<input type="range" min="0.6" max="1.4" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} /></label>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-[#FFFCF7] p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-bold">Reading area</h2>
        <p style={{ fontSize, letterSpacing: `${spacing}em`, lineHeight, fontFamily: "OpenDyslexic, Atkinson Hyperlegible, Arial, sans-serif" }}>
          {parts.map((part, index) => {
            if (!part.trim()) return <span key={index}>{part}</span>;
            wordIndex += 1;
            return <span key={index} className={wordIndex === activeWord ? "rounded bg-amber-200 px-1" : ""}>{part}</span>;
          })}
        </p>
      </section>
    </div>
  );
}
