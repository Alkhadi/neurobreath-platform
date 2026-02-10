'use client';

import { useState } from 'react';

interface PlainEnglishToggleProps {
  summary: string;
  bullets: string[];
}

export function PlainEnglishToggle({ summary, bullets }: PlainEnglishToggleProps) {
  const [enabled, setEnabled] = useState(false);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Plain English</h2>
          <p className="text-sm text-slate-600">A simpler version you can toggle on when you want.</p>
        </div>
        <button
          type="button"
          onClick={() => setEnabled(prev => !prev)}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300"
        >
          {enabled ? 'Hide simple version' : 'Show simple version'}
        </button>
      </div>
      {enabled && (
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <p>{summary}</p>
          <ul className="list-disc space-y-2 pl-5">
            {bullets.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
