"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { skillTokens, type SkillToken } from "@/data/portfolio";

type Cell = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

const VEC: Record<Dir, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const OPPOSITE: Record<Dir, Dir> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const STEP_MS = 185;
const POP_MS = 320;
const START_LEN = 3;

/**
 * Cell size is width/cols, and the board's height is cells × rows — so a fixed
 * column count makes a full-width board absurdly tall (22 columns across
 * 1312px gave 60px cells and a 715px-high board). Column count therefore rises
 * and row count falls as the board gets wider, keeping cells near 40px.
 * Phones stay portrait so the cells don't get unreadably small.
 */
function gridFor(width: number) {
  if (width < 640) return { cols: 11, rows: 15 };
  if (width < 1000) return { cols: 22, rows: 12 };
  return { cols: 34, rows: 10 };
}

const wrap = (v: number, max: number) => (v + max) % max;
const eq = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y;

/** Shortest delta on a wrapping axis, so the AI takes the torus shortcut. */
function wrappedDelta(from: number, to: number, max: number) {
  let d = to - from;
  if (d > max / 2) d -= max;
  if (d < -max / 2) d += max;
  return d;
}

export default function SkillSnake() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  const [collected, setCollected] = useState<SkillToken[]>([]);
  const [playerControlled, setPlayerControlled] = useState(false);
  const [length, setLength] = useState(START_LEN);

  // Everything the loop mutates lives in a ref — putting it in state would
  // re-render React at 60fps for no reason.
  const game = useRef({
    cols: 22,
    rows: 12,
    cells: [] as Cell[],
    prev: [] as Cell[],
    labels: [] as (SkillToken | null)[],
    dir: "right" as Dir,
    queued: [] as Dir[],
    food: null as (Cell & { skill: SkillToken }) | null,
    remaining: [] as SkillToken[],
    lastStep: 0,
    popAt: 0,
    burst: null as { x: number; y: number; at: number } | null,
    auto: true,
  });

  const reset = useCallback((cols: number, rows: number) => {
    const g = game.current;
    g.cols = cols;
    g.rows = rows;
    const midY = Math.floor(rows / 2);
    const startX = Math.floor(cols / 4);
    g.cells = Array.from({ length: START_LEN }, (_, i) => ({
      x: startX - i,
      y: midY,
    }));
    g.prev = g.cells.map((c) => ({ ...c }));
    g.labels = g.cells.map(() => null);
    g.dir = "right";
    g.queued = [];
    g.remaining = [...skillTokens];
    g.food = null;
    g.burst = null;
    setLength(START_LEN);
  }, []);

  const placeFood = useCallback(() => {
    const g = game.current;
    if (g.remaining.length === 0) g.remaining = [...skillTokens];
    const skill = g.remaining.shift()!;
    // Reject positions on the snake. Bounded attempts, then take any free cell.
    for (let i = 0; i < 200; i++) {
      const c = {
        x: Math.floor(Math.random() * g.cols),
        y: Math.floor(Math.random() * g.rows),
      };
      if (!g.cells.some((s) => eq(s, c))) {
        g.food = { ...c, skill };
        return;
      }
    }
    g.food = { x: 0, y: 0, skill };
  }, []);

  const turn = useCallback((dir: Dir) => {
    const g = game.current;
    // Compare against the last queued turn, not the current heading, so two
    // fast presses (up then left) both register instead of the second being
    // rejected as a reversal.
    const ref = g.queued.length ? g.queued[g.queued.length - 1] : g.dir;
    if (dir === OPPOSITE[ref] || dir === ref) return;
    if (g.queued.length < 2) g.queued.push(dir);
  }, []);

  /** Greedy autopilot: close the larger axis gap, never step onto the body. */
  const autoTurn = useCallback(() => {
    const g = game.current;
    if (!g.food) return;
    const head = g.cells[0];
    const dx = wrappedDelta(head.x, g.food.x, g.cols);
    const dy = wrappedDelta(head.y, g.food.y, g.rows);

    const wants: Dir[] = [];
    if (Math.abs(dx) >= Math.abs(dy)) {
      if (dx !== 0) wants.push(dx > 0 ? "right" : "left");
      if (dy !== 0) wants.push(dy > 0 ? "down" : "up");
    } else {
      if (dy !== 0) wants.push(dy > 0 ? "down" : "up");
      if (dx !== 0) wants.push(dx > 0 ? "right" : "left");
    }
    // Fall back to any direction that doesn't kill us.
    wants.push("up", "down", "left", "right");

    const safe = (d: Dir) => {
      if (d === OPPOSITE[g.dir]) return false;
      const n = {
        x: wrap(g.cells[0].x + VEC[d].x, g.cols),
        y: wrap(g.cells[0].y + VEC[d].y, g.rows),
      };
      // The tail vacates this tick, so it isn't an obstacle.
      return !g.cells.slice(0, -1).some((s) => eq(s, n));
    };

    const pick = wants.find(safe);
    if (pick) g.dir = pick;
  }, []);

  const step = useCallback(() => {
    const g = game.current;

    if (g.auto) autoTurn();
    else if (g.queued.length) g.dir = g.queued.shift()!;

    const old = g.cells.map((c) => ({ ...c }));
    const head = {
      x: wrap(old[0].x + VEC[g.dir].x, g.cols),
      y: wrap(old[0].y + VEC[g.dir].y, g.rows),
    };

    // Self-collision resets the body but keeps the collected list — this is a
    // skills showcase, and losing the reel because of a mistimed turn is worse
    // than the game being forgiving.
    if (old.slice(0, -1).some((s) => eq(s, head))) {
      const keep = g.remaining;
      reset(g.cols, g.rows);
      g.remaining = keep;
      g.auto = true;
      setPlayerControlled(false);
      // reset() clears the board, so the food has to be re-placed or the
      // game runs forever with nothing to eat.
      placeFood();
      return;
    }

    const ate = g.food && eq(head, g.food);

    g.cells = [head, ...old];
    // prev[i] is where segment i sat last tick: the head came from the old
    // head, and every other segment from its predecessor.
    g.prev = [old[0], ...old];
    if (!ate) {
      g.cells.pop();
      g.prev.pop();
    }

    if (ate && g.food) {
      // Labels are indexed by position in the chain, not by segment identity,
      // so a ball keeps its skill as the body shuffles forward.
      g.labels.push(g.food.skill);
      g.popAt = performance.now();
      g.burst = { x: g.food.x, y: g.food.y, at: performance.now() };
      const skill = g.food.skill;
      setCollected((c) => (c.some((s) => s.label === skill.label) ? c : [...c, skill]));
      setLength(g.cells.length);
      placeFood();
    }
    while (g.labels.length < g.cells.length) g.labels.push(null);
  }, [autoTurn, placeFood, reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapEl = wrapRef.current;
    if (!canvas || !wrapEl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const css = getComputedStyle(wrapEl);
    const mono = css.fontFamily;

    /**
     * Canvas can't use CSS variables, so the tokens are resolved to concrete
     * strings — which means a theme flip has to re-resolve them or the board
     * keeps painting itself in the old palette. `data-theme` on <html> is
     * observed and the cache refilled; the next frame picks it up.
     *
     * The game runs on its own orange rather than the site accent. Painted in
     * the accent colour it read as another piece of UI chrome; orange marks it
     * as the one thing on the page you are meant to play with.
     */
    let INK = "", LINE = "", FG = "", MUTED = "", ACCENT = "", SIGNAL = "";
    const readColors = () => {
      const live = getComputedStyle(wrapEl);
      const color = (name: string) => live.getPropertyValue(name).trim();
      INK = color("--color-page") || "#f6f4ef";
      LINE = color("--color-line") || "rgba(20,17,13,0.10)";
      FG = color("--color-fg") || "#14110d";
      MUTED = color("--color-muted") || "rgba(20,17,13,0.62)";
      ACCENT = color("--color-play") || "#e8590c";
      SIGNAL = color("--color-play-soft") || "#f59f00";
    };
    readColors();

    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    let cell = 0;
    let raf = 0;
    let disposed = false;
    let lastWidth = -1;

    /**
     * Driven by window resize, deliberately NOT a ResizeObserver on the
     * wrapper: the wrapper's height is set by the canvas we size here, so
     * observing it feeds its own output back in and can spin forever. The
     * width guard also makes repeat calls free.
     */
    const layout = () => {
      const width = Math.round(wrapEl.clientWidth);
      if (width === lastWidth || width === 0) return;
      lastWidth = width;

      const { cols, rows } = gridFor(width);
      if (cols !== game.current.cols || rows !== game.current.rows) {
        reset(cols, rows);
        placeFood();
      }
      cell = width / cols;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(cell * rows * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${cell * rows}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initial = gridFor(wrapEl.clientWidth || 800);
    reset(initial.cols, initial.rows);
    placeFood();
    layout();

    window.addEventListener("resize", layout);

    const centre = (c: Cell) => ({
      x: c.x * cell + cell / 2,
      y: c.y * cell + cell / 2,
    });

    const draw = (now: number) => {
      const g = game.current;
      const w = g.cols * cell;
      const h = g.rows * cell;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = LINE;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 1; i < g.cols; i++) {
        ctx.moveTo(Math.round(i * cell) + 0.5, 0);
        ctx.lineTo(Math.round(i * cell) + 0.5, h);
      }
      for (let j = 1; j < g.rows; j++) {
        ctx.moveTo(0, Math.round(j * cell) + 0.5);
        ctx.lineTo(w, Math.round(j * cell) + 0.5);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      const t = reduce ? 1 : Math.min((now - g.lastStep) / STEP_MS, 1);

      // Food token
      if (g.food) {
        const p = centre(g.food);
        const pulse = reduce ? 1 : 1 + Math.sin(now / 320) * 0.05;
        const r = cell * 0.34 * pulse;
        const learning = g.food.skill.learning;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        if (learning) {
          ctx.strokeStyle = SIGNAL;
          ctx.setLineDash([3, 3]);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          ctx.fillStyle = ACCENT;
          ctx.fill();
        }
        ctx.restore();

        // Full name sits under the token, where there's room for it.
        ctx.font = `${Math.max(9, cell * 0.26)}px ${mono}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = learning ? SIGNAL : MUTED;
        ctx.fillText(g.food.skill.label, p.x, p.y + r + cell * 0.16);
      }

      // Eat burst
      if (g.burst && !reduce) {
        const age = (now - g.burst.at) / 420;
        if (age < 1) {
          const p = centre(g.burst);
          ctx.beginPath();
          ctx.arc(p.x, p.y, cell * (0.3 + age * 0.7), 0, Math.PI * 2);
          ctx.strokeStyle = ACCENT;
          ctx.globalAlpha = 1 - age;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.globalAlpha = 1;
        } else {
          g.burst = null;
        }
      }

      // Snake — drawn tail-first so the head overlaps the neck.
      for (let i = g.cells.length - 1; i >= 0; i--) {
        const cur = g.cells[i];
        const pre = g.prev[i] ?? cur;
        // A wrapped segment would streak across the whole board if lerped.
        const jumped =
          Math.abs(cur.x - pre.x) > 1 || Math.abs(cur.y - pre.y) > 1;
        const a = centre(pre);
        const b = centre(cur);
        const p = jumped ? b : { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };

        const isHead = i === 0;
        const isNew = i === g.cells.length - 1;
        let scale = 1;
        if (isNew && !reduce) {
          const age = (now - g.popAt) / POP_MS;
          if (age < 1) {
            // Slight overshoot so the new ball lands with some weight.
            const e = 1 - Math.pow(1 - age, 3);
            scale = e * 1.12 - 0.12 * Math.pow(age, 2);
          }
        }

        const label = g.labels[i];
        const r = (isHead ? cell * 0.42 : cell * 0.36) * scale;
        if (r <= 0) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        if (isHead) {
          ctx.fillStyle = FG;
          ctx.fill();
        } else if (label) {
          ctx.fillStyle = label.learning ? "transparent" : ACCENT;
          if (!label.learning) ctx.fill();
          ctx.strokeStyle = label.learning ? SIGNAL : ACCENT;
          ctx.lineWidth = 1.5;
          if (label.learning) ctx.stroke();
        } else {
          ctx.fillStyle = LINE;
          ctx.fill();
        }

        if (label && r > cell * 0.2) {
          ctx.font = `${Math.max(7, r * 0.62)}px ${mono}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = label.learning ? SIGNAL : INK;
          ctx.fillText(label.short, p.x, p.y + r * 0.04);
        }

        // Eye-ish notch so the head reads as the front.
        if (isHead) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = INK;
          ctx.fill();
        }
      }
    };

    const loop = (now: number) => {
      if (disposed) return;
      const g = game.current;
      if (cell === 0) {
        // Width wasn't measurable at mount (hidden container); try again.
        layout();
        raf = requestAnimationFrame(loop);
        return;
      }
      // Under reduced motion the board sits still until someone chooses to
      // play. Autoplaying a moving game is the exact thing that setting is for.
      if (reduce && g.auto) {
        g.lastStep = now;
        draw(now);
        raf = requestAnimationFrame(loop);
        return;
      }
      if (!g.lastStep) g.lastStep = now;
      // Long tab-away gaps shouldn't fast-forward dozens of steps.
      if (now - g.lastStep > STEP_MS * 6) g.lastStep = now;
      let guard = 0;
      while (now - g.lastStep >= STEP_MS && guard++ < 6) {
        g.lastStep += STEP_MS;
        step();
      }
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", layout);
    };
  }, [reduce, reset, placeFood, step]);

  // Keyboard only while the grid has focus, so arrow keys still scroll the page.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, Dir> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    };
    const dir = map[e.key] ?? map[e.key.toLowerCase()];
    if (!dir) return;
    e.preventDefault();
    game.current.auto = false;
    setPlayerControlled(true);
    turn(dir);
  };

  const touch = useRef<{ x: number; y: number } | null>(null);

  return (
    <div className="font-mono">
      <div
        ref={wrapRef}
        tabIndex={0}
        role="application"
        aria-label="Snake game collecting skill tokens. Arrow keys to steer. A text list of every skill follows."
        onKeyDown={onKeyDown}
        onFocus={() => {
          game.current.auto = false;
          setPlayerControlled(true);
        }}
        onBlur={() => {
          game.current.auto = true;
          setPlayerControlled(false);
        }}
        onTouchStart={(e) => {
          touch.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
        }}
        onTouchMove={(e) => {
          const start = touch.current;
          if (!start) return;
          const dx = e.touches[0].clientX - start.x;
          const dy = e.touches[0].clientY - start.y;
          if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
          game.current.auto = false;
          setPlayerControlled(true);
          turn(
            Math.abs(dx) > Math.abs(dy)
              ? dx > 0
                ? "right"
                : "left"
              : dy > 0
                ? "down"
                : "up",
          );
          touch.current = null;
        }}
        className="relative overflow-hidden border border-line bg-page outline-none transition-colors focus-visible:border-play"
      >
        <canvas ref={canvasRef} className="block w-full" />

        {!playerControlled && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3">
            <span className="border border-line bg-surface/90 px-3 py-1 text-[11px] text-faint backdrop-blur">
              {reduce
                ? "paused — click or tap to play"
                : "autoplaying — click or tap to steer"}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[11px] text-faint">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="tabular">
            length <span className="text-fg">{length}</span>
          </span>
          <span className="tabular">
            collected <span className="text-fg">{collected.length}</span>/
            {skillTokens.length}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-play" />
            used in a project
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 border border-dashed border-play-soft" />
            currently learning
          </span>
        </div>
      </div>

      {/* The canvas is decorative to assistive tech; this is the real list. */}
      <ul className="mt-6 flex flex-wrap gap-2">
        {skillTokens.map((s) => {
          const got = collected.some((c) => c.label === s.label);
          return (
            <li
              key={s.label}
              className={`border px-2.5 py-1 text-xs transition-colors duration-500 ${
                s.learning
                  ? got
                    ? "border-play-soft/60 text-play-soft"
                    : "border-dashed border-line text-faint"
                  : got
                    ? "border-play/60 text-fg"
                    : "border-line text-faint"
              }`}
            >
              {s.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
