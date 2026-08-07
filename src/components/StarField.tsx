"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * A sparse drifting star field behind every page.
 *
 * It paints in `--color-fg`, which is near-black on the paper ground and warm
 * white in dark mode — so the inversion is free and there is no second palette
 * to keep in sync. Opacity is the one thing that has to differ per theme
 * (`--star-alpha`), because light dots on a dark ground read far fainter than
 * dark dots on a light one at equal alpha.
 *
 * Deliberately restrained: about one star per 22,000 px² and radii under 2px.
 * Drift is up to ~5px/sec, which crosses a 1400px screen in about five
 * minutes — visible as movement if you watch, never enough to pull the eye off
 * the text.
 */

/** Viewport area, in CSS px², per star. Higher = sparser. */
const AREA_PER_STAR = 22_000;
const MAX_STARS = 110;

/** Fraction painted in the accent colour rather than the foreground. */
const ACCENT_SHARE = 0.08;

type Star = {
  x: number;
  y: number;
  r: number;
  /** Baseline opacity multiplier, before the per-theme --star-alpha. */
  a: number;
  /** Drift, CSS px per second. Fast enough to read as motion at a glance. */
  vx: number;
  vy: number;
  /** Twinkle phase and rate. */
  phase: number;
  rate: number;
  accent: boolean;
};

export default function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let disposed = false;
    let visible = true;
    let last = 0;

    // Canvas can't read CSS variables, so the tokens are resolved to strings —
    // which means a theme flip has to re-resolve them. Same pattern as the
    // skills game.
    let fg = "#14110d";
    let accent = "#0b5d51";
    let alpha = 0.22;
    let sizeScale = 1;
    const readTokens = () => {
      const cs = getComputedStyle(document.documentElement);
      fg = cs.getPropertyValue("--color-fg").trim() || fg;
      accent = cs.getPropertyValue("--color-accent").trim() || accent;
      alpha = parseFloat(cs.getPropertyValue("--star-alpha")) || 0.22;
      sizeScale = parseFloat(cs.getPropertyValue("--star-size")) || 1;
    };

    const build = () => {
      const count = Math.min(MAX_STARS, Math.round((w * h) / AREA_PER_STAR));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.3,
        a: 0.35 + Math.random() * 0.65,
        vx: (Math.random() - 0.5) * 11,
        vy: (Math.random() - 0.5) * 11,
        phase: Math.random() * Math.PI * 2,
        rate: 0.15 + Math.random() * 0.5,
        accent: Math.random() < ACCENT_SHARE,
      }));
    };

    const layout = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      // Ignore pure-height changes: mobile browsers fire resize every time the
      // URL bar hides, and rebuilding on that makes the field visibly reshuffle
      // as you scroll.
      const widthChanged = Math.abs(nw - w) > 1;
      w = nw;
      h = nh;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (widthChanged || stars.length === 0) build();
    };

    const draw = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        if (!reduce) {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          // Wrap rather than bounce — a bounce reads as an edge, and the field
          // should feel unbounded.
          if (s.x < -2) s.x = w + 2;
          else if (s.x > w + 2) s.x = -2;
          if (s.y < -2) s.y = h + 2;
          else if (s.y > h + 2) s.y = -2;
        }
        const twinkle = reduce
          ? 1
          : 0.65 + 0.35 * Math.sin(s.phase + (now / 1000) * s.rate);
        ctx.globalAlpha = alpha * s.a * twinkle;
        ctx.fillStyle = s.accent ? accent : fg;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * sizeScale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      draw(now);
    };

    readTokens();
    layout();

    const themeObserver = new MutationObserver(() => {
      readTokens();
      // Under reduced motion nothing is looping, so repaint here or the field
      // keeps the old theme's colours.
      if (reduce) draw(performance.now());
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const onVisibility = () => {
      visible = !document.hidden;
      // Reset the clock so a long tab-away doesn't teleport every star.
      last = 0;
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", layout);

    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", layout);
    };
  }, [reduce]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
