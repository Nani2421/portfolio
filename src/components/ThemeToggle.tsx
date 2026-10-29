"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * Light / dark switch. The page starts in the visitor's system mode (set before
 * paint by the script in layout.tsx); a tap here overrides it and is remembered.
 * Until someone taps, a change of system mode is followed live.
 *
 * The mode lives on <html data-theme>, so that is what this reads — through
 * useSyncExternalStore, which also keeps the server render (no theme yet) honest.
 */

const root = () => document.documentElement;

function savedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributes: true, attributeFilter: ["data-theme"] });
  const media = matchMedia("(prefers-color-scheme: dark)");
  const follow = (e: MediaQueryListEvent) => {
    if (!savedTheme()) root().dataset.theme = e.matches ? "dark" : "light";
  };
  media.addEventListener("change", follow);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", follow);
  };
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    () => root().dataset.theme ?? "light",
    () => "unknown",
  );
  const dark = theme === "dark";

  const toggle = () => {
    const next = dark ? "light" : "dark";
    root().dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className="grid h-8 w-8 place-items-center rounded-md opacity-80 transition hover:bg-chip hover:opacity-100"
    >
      {/* Blank on the server, so the icon never disagrees with the page. */}
      {theme === "unknown" ? null : dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
