"use client";

import * as React from "react";

export type Theme = "light" | "dark";

const MatchMedia =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

function readStoredTheme(): Theme {
  const stored = localStorage.getItem("elbethel-theme");
  if (stored === "light" || stored === "dark") return stored;
  return MatchMedia?.matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme === "dark" ? "dark" : "light");
  root.classList.add("theme-anim");
  try {
    localStorage.setItem("elbethel-theme", theme);
  } catch {
    /* ignore */
  }
}

let currentTheme: Theme = "light";
let themeReady = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): Theme {
  if (!themeReady && typeof window !== "undefined") {
    themeReady = true;
    currentTheme = readStoredTheme();
  }
  return currentTheme;
}

const getServerSnapshot = (): Theme => "light";

const ThemeContext = React.createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  mounted: boolean;
}>({ theme: "light", setTheme: () => {}, mounted: false });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore<Theme>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const mounted = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  React.useEffect(() => {
    applyTheme(currentTheme);
    const onChange = () => {
      currentTheme = readStoredTheme();
      emit();
    };
    window.addEventListener("storage", onChange);
    MatchMedia?.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      MatchMedia?.removeEventListener("change", onChange);
    };
  }, []);

  const setTheme = React.useCallback((t: Theme) => {
    applyTheme(t);
    currentTheme = t;
    emit();
  }, []);

  const value = React.useMemo(
    () => ({ theme, setTheme, mounted }),
    [theme, setTheme, mounted],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}