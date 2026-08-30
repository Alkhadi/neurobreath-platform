// NEUROBREATH_STABLE_APPS_INSTITUTIONAL_MENU
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { phase3MenuGroups } from "@/data/phase3/phase3-menu";

export function AppsInstitutionalHeaderMenu() {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  const closeMenu = () => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const root = detailsRef.current;
      if (!root) return;
      if (!root.contains(event.target as Node)) {
        root.open = false;
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && detailsRef.current) {
        detailsRef.current.open = false;
      }
    };

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <details ref={detailsRef} data-nb-apps-institutional-menu="true" className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
        <span>Apps &amp; Institutional</span>
        <span aria-hidden="true" className="text-xs transition group-open:rotate-180">⌄</span>
      </summary>

      <div className="absolute left-0 top-full z-[80] mt-3 w-[min(94vw,920px)] rounded-3xl border border-slate-200 bg-[var(--nb-surface,#FFFCF7)] p-6 shadow-2xl">
        <div className="grid gap-8 md:grid-cols-2">
          {phase3MenuGroups.map((group) => (
            <section key={group.title} className="min-w-0">
              <Link
                href={group.href}
                onClick={closeMenu}
                title={group.description}
                className="mb-5 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 hover:text-teal-800"
              >
                {group.title}
              </Link>

              <div className="grid gap-4">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    title={`${item.description} Example: ${item.example}`}
                    className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-left hover:border-teal-300 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  >
                    <span className="flex items-start gap-2">
                      <span aria-hidden="true" className="mt-0.5 shrink-0 text-base">{item.icon}</span>
                      <span className="min-w-0">
                        <span className="block font-medium leading-6 text-slate-900">{item.title}</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-600">{item.description}</span>
                        <span className="mt-2 block text-xs leading-5 text-slate-500">{item.example}</span>
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </details>
  );
}
