"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, mounted } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={
        "inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius)] border transition-colors " +
        "border-ash-300 bg-surface text-ink-soft hover:text-ink hover:border-ash-400 " +
        (className ?? "")
      }
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-[18px] w-[18px]" />
        ) : (
          <Moon className="h-[18px] w-[18px]" />
        )
      ) : (
        <span aria-hidden className="block h-[18px] w-[18px]" />
      )}
    </button>
  );
}