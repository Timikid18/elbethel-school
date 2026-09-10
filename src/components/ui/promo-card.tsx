"use client";

import * as React from "react";
import { LogoMark } from "./logo";

const AUTO_CLOSE_MS = 5500;
const SHOW_DELAY_MS = 2200;
const STORAGE_KEY = "promo-dismissed";

export function PromoCard() {
  const [open, setOpen] = React.useState(false);

  const dismiss = React.useCallback(() => {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }, []);

  React.useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(dismiss, AUTO_CLOSE_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 fade-in"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Admissions open"
    >
      <div
        className="promo-card relative w-full max-w-[28rem] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1 text-ash-500 transition-colors hover:bg-ash-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <div className="flex flex-col items-center px-8 pb-8 pt-10 text-center">
          <LogoMark priority className="h-16 w-16" />

          <h2 className="mt-5 font-display text-xl font-bold text-ink">
            Admissions Open
          </h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
            New session ongoing — apply now. Spaces are limited and filling up fast!
          </p>

          <a
            href="/admissions"
            onClick={(e) => {
              e.stopPropagation();
              dismiss();
            }}
            className="mt-7 inline-block rounded-full bg-royal px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-royal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
}