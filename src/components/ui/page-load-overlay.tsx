"use client";

import * as React from "react";
import { LogoMark, Wordmark } from "@/components/ui/logo";

const MIN_SHOW_MS = 1200;
const HARD_LIMIT_MS = 2000;
const FADE_MS = 600;

export function PageLoadOverlay() {
  const [removed, setRemoved] = React.useState(false);

  React.useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    let finished = false;
    let loaded = document.readyState === "complete";
    let minElapsed = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      html.classList.add("preloader-done");
      body.style.overflow = "";
      window.setTimeout(() => setRemoved(true), FADE_MS + 100);
    };
    const maybeFinish = () => {
      if (loaded && minElapsed) finish();
    };

    if (html.classList.contains("preloader-done")) {
      body.style.overflow = "";
      const id = window.setTimeout(() => setRemoved(true), 0);
      return () => window.clearTimeout(id);
    }

    body.style.overflow = "hidden";
    const minTimer = window.setTimeout(() => {
      minElapsed = true;
      maybeFinish();
    }, MIN_SHOW_MS);
    const hardTimer = window.setTimeout(finish, HARD_LIMIT_MS);
    const onLoad = () => {
      loaded = true;
      maybeFinish();
    };
    window.addEventListener("load", onLoad);

    const observer = new MutationObserver(() => {
      if (html.classList.contains("preloader-done")) {
        finish();
        observer.disconnect();
      }
    });
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(hardTimer);
      window.removeEventListener("load", onLoad);
      observer.disconnect();
    };
  }, []);

  if (removed) return null;

  return (
    <div
      className="page-load-overlay"
      role="status"
      aria-label="Loading EL-BETH-EL"
      aria-hidden="false"
    >
      <div className="preloader-bg" aria-hidden>
        <span className="preloader-orb preloader-orb--a" />
        <span className="preloader-orb preloader-orb--b" />
        <span className="preloader-orb preloader-orb--c" />
        <span className="preloader-orb preloader-orb--gold" />
        <span className="preloader-grid" />
      </div>

      <div className="flex flex-col items-center gap-5">
        <div className="preloader-brand">
          <div className="preloader-halo" aria-hidden />
          <div className="preloader-logo relative">
            <span className="preloader-logo__ring" aria-hidden />
            <LogoMark priority className="h-20 w-20 sm:h-24 sm:w-24" />
          </div>
        </div>
        <Wordmark className="preloader-wordmark items-center text-center" />
      </div>
    </div>
  );
}