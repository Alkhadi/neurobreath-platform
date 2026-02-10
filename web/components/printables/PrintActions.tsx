'use client';

import { useCallback } from 'react';

interface PrintActionsProps {
  pdfUrl?: string;
}

export function PrintActions({ pdfUrl }: PrintActionsProps) {
  const handlePrint = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }, []);

  return (
    <div className="flex flex-wrap gap-3 print-hide">
      <button
        type="button"
        onClick={handlePrint}
        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        Print this page
      </button>
      {pdfUrl ? (
        <a
          href={pdfUrl}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300"
        >
          Download PDF
        </a>
      ) : null}
    </div>
  );
}
