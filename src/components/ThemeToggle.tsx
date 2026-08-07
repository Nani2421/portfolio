"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * Light/dark switch.
 *
 * The theme is applied by the inline script in layout.tsx before first paint —
 * this component only reads what that script decided and lets you change it.
 * Doing it the other way round (setting the theme from an effect) is what
 * produces the white flash on load for dark-mode users.
 *
 * `<html data-theme>` is the single source of truth and this subscribes to it
 * via useSyncExternalStore rather than mirroring it into state: the attribute
 * is an external store, and copying it into React state during an effect just
 * creates a second copy that can disagree with the first.
 *
 * A choice is written to localStorage and wins from then on. Until someone
 * chooses, the system preference is followed live.
 */
export const THEME_KEY = "theme";

function subscribe(onChange: () => void) {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => obs.disconnect();
}

const isDark = () => document.documentElement.dataset.theme === "dark";
/** The server can't know the client's theme; it renders the light icon. */
const serverSnapshot = () => false;

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, serverSnapshot);

  // Keep following the OS until an explicit choice has been stored.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(THEME_KEY)) return;
      document.documentElement.dataset.theme = e.matches ? "dark" : "light";
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem(THEME_KEY, next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      title={dark ? "Light" : "Dark"}
      className="annot inline-flex h-7 w-7 items-center justify-center border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
    >
      {dark ? <Sun /> : <Moon />}
    </button>
  );
}

function Sun() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line
          key={a}
          x1="8"
          y1="1.2"
          x2="8"
          y2="3"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          transform={`rotate(${a} 8 8)`}
        />
      ))}
    </svg>
  );
}

function Moon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.2 9.8A5.6 5.6 0 0 1 6.2 2.8a5.6 5.6 0 1 0 7 7Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
