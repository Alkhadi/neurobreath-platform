// PHASE3_RESCUE_SAFE_MVP
"use client";

import { useEffect, useState } from "react";

type WalletItem = { id: string; title: string; notes: string };
type MedItem = { id: string; name: string; doseLabel: string; time: string; taken: boolean };

const WALLET_KEY = "neurobreath:life-wallet:v1";
const MED_KEY = "neurobreath:medication-reminders:v1";

export function LifeSkillsWalletClient() {
  const [items, setItems] = useState<WalletItem[]>([]);
  const [meds, setMeds] = useState<MedItem[]>([]);
  const [docTitle, setDocTitle] = useState("");
  const [medName, setMedName] = useState("");

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(WALLET_KEY) || "[]"));
      setMeds(JSON.parse(localStorage.getItem(MED_KEY) || "[]"));
    } catch {}
  }, []);

  useEffect(() => { localStorage.setItem(WALLET_KEY, JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem(MED_KEY, JSON.stringify(meds)); }, [meds]);

  function addDoc() {
    const clean = docTitle.trim();
    if (!clean) return;
    setItems((current) => [...current, { id: `${Date.now()}`, title: clean, notes: "Metadata only. File upload is not enabled." }]);
    setDocTitle("");
  }

  function addMed() {
    const clean = medName.trim();
    if (!clean) return;
    setMeds((current) => [...current, { id: `${Date.now()}`, name: clean, doseLabel: "As prescribed", time: "09:00", taken: false }]);
    setMedName("");
  }

  function clearAll() {
    localStorage.removeItem(WALLET_KEY);
    localStorage.removeItem(MED_KEY);
    setItems([]);
    setMeds([]);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h2 className="text-2xl font-bold">Important documents</h2>
        <p className="mt-2 rounded-2xl bg-amber-50 p-4 text-sm leading-7 text-amber-950">
          File upload requires secure encrypted storage and is not enabled in this patch. This MVP stores metadata locally on this device only.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder="Document title" className="flex-1 rounded-xl border p-3" />
          <button type="button" onClick={addDoc} className="rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white">Add document record</button>
        </div>
        <div className="mt-5 grid gap-3">
          {items.map((item) => <article key={item.id} className="rounded-2xl border p-4"><strong>{item.title}</strong><p className="text-sm text-slate-600">{item.notes}</p></article>)}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h2 className="text-2xl font-bold">Medication reminders</h2>
        <p className="mt-2 rounded-2xl bg-amber-50 p-4 text-sm leading-7 text-amber-950">
          Medication reminders are organisational only. They do not provide medical advice. Always follow instructions from your doctor, pharmacist, or qualified healthcare professional.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input value={medName} onChange={(e) => setMedName(e.target.value)} placeholder="Medication name" className="flex-1 rounded-xl border p-3" />
          <button type="button" onClick={addMed} className="rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white">Add reminder</button>
        </div>
        <div className="mt-5 grid gap-3">
          {meds.map((med) => (
            <label key={med.id} className="flex gap-3 rounded-2xl border p-4">
              <input type="checkbox" checked={med.taken} onChange={() => setMeds((current) => current.map((item) => item.id === med.id ? { ...item, taken: !item.taken } : item))} />
              <span><strong>{med.name}</strong><br /><span className="text-sm text-slate-600">{med.doseLabel} · {med.time}</span></span>
            </label>
          ))}
        </div>
        <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
          Carer alerts require verified contact details, consent, and secure notification infrastructure. Not enabled in this patch.
        </p>
        <button type="button" onClick={clearAll} className="mt-4 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700">Clear local wallet data</button>
      </section>
    </div>
  );
}
