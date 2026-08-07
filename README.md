# Portfolio — Sri Neeraj Reddy Palakolanu

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Motion v13. Fully static.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Structure

```
/                     Positioning + 3 featured projects + capabilities
/work                 All four projects
/work/[slug]          Case study per project
/about                Narrative, focus areas, education, certs
```

All content lives in **`src/data/portfolio.ts`**. Components read from it and nowhere else.

## Before deploying — three real values needed

1. `profile.github` / `profile.linkedin` are placeholders (`your-username`, `your-handle`).
2. `metadataBase` in `src/app/layout.tsx` is `https://neeraj.dev`.
3. Add `repo:` (and `demo:` where one exists) to entries in `projects` — the links only render when present.

## The `needsMeasurement` field

Each project carries a `needsMeasurement` array listing numbers the case study
*wants* but that were never actually measured — mAP, FPS, latency breakdowns.
These are **deliberately not invented**. They render as a dashed amber panel in
`npm run dev` only and never appear in production.

Fill the number in, move it into `results`, delete the `needsMeasurement` entry.
The rule the case studies follow: if you can't link to code that proves it,
don't write it.

## The snake

`src/components/SkillSnake.tsx` — the skills section on the landing page is a
canvas Snake game. Tokens are skills; eating one attaches a labelled ball to the
tail with a pop, and lights up the matching chip in the text list underneath.
Content comes from `skillTokens` in `portfolio.ts`.

- **Honesty is encoded in the render.** Tokens with `learning: true` (NLP, RAG,
  Transformers, LLMs) draw as dashed amber outlines instead of solid clay, with
  a legend. The game can show them without implying a project exists behind
  them — same separation the rest of the site keeps.
- **Autoplays** so it's never a dead rectangle, and hands over the moment you
  click, tap or focus it.
- **Arrow keys are only captured while the grid has focus**, so they still
  scroll the page everywhere else.
- **Self-collision is forgiving** — the body resets but the collected list
  survives. Losing your skill reel to a mistimed turn is worse than the game
  being easy.
- **Reduced motion pauses it** rather than autoplaying, and the full skill list
  renders as real text below regardless. The canvas is labelled for assistive
  tech; the `<ul>` is the accessible source of truth.
- **Sizing is driven by `window.resize`, deliberately not a `ResizeObserver`.**
  The wrapper's height comes from the canvas we size, so observing it feeds its
  own output back in — that hung the page hard the first time.

## Why there's no skills section

Skill grids, percentage bars, and logo walls are the most consistently cited
tell of an amateur portfolio — they're self-rated, unmeasurable, and go stale.
Three replacements are used instead:

- **`capabilities`** — claim + detail + a link to the case study that proves it
- **`stackSentence`** — the stack named once, in prose, in context
- **Contextual tags** — tech appears on the project that used it, so every
  mention is evidence-backed

`focusAreas` (RAG, NLP, production ML) sits on `/about` under "Currently going
deeper on", kept separate from shipped work on purpose.

## Two Tailwind v4 traps this project already hit

Both cost real debugging time. Don't reintroduce them.

**1. Font variables must be on `<html>`, not `<body>`.** `globals.css` declares
`--font-display: var(--font-instrument), …` inside `@theme`, which emits at
`:root`. A custom property resolves its `var()` references *where it is
declared* — so with the `next/font` classNames on `<body>`, `--font-instrument`
is undefined at `:root`, the whole declaration computes to invalid, and every
element inherits an empty font stack. Symptom: everything silently falls back to
the system font.

**2. Never size text with `text-[var(--x)]`.** Tailwind can't tell whether a bare
custom property is a length or a color, so it emits nothing at all — silently.
The type scale is registered in the `--text-*` namespace instead, which
generates real utilities (`text-hero`, `text-h2`, `text-lead`, …). Add new sizes
there, not as arbitrary values.

## Design system

Tokens are Tailwind v4 `@theme` variables in `globals.css`.

- **Palette** is a warm ink ramp at hue 40 (`#0c0c0b` → `#131211` → `#1b1a18` →
  `#23221f`), not cool blue-black. Accent is clay `#da7d58`; `--color-signal`
  amber is reserved strictly for live/metric states. Borders, never shadows —
  shadows don't read in dark UI.
- **Type** is Instrument Serif (display) + Geist (body, ~17–19px) + Geist Mono
  (metadata, with `tabular-nums` on all figures). Body at 16px is a tell.
- **Section rhythm** is 160–224px (`--spacing-section`). Template portfolios use
  80–96px and that single number is most of why they read cheap.
- `.detect-frame` draws project cards as detection annotations — corner
  brackets on hover, the way a bounding box is drawn.

## Motion

Timings are not arbitrary; they follow Next.js's own view-transition guidance.

- **Page transitions** use React's `<ViewTransition>` (zero config in Next 16.3 —
  no `experimental` flag, no canary React). Asymmetric by design: exit 150ms,
  enter 210ms delayed by exactly the exit duration, positional 400ms, 60px
  offset. `<Link transitionTypes>` tags direction.
- **`AnimatePresence` in `template.tsx` is not used** and does not work for exit
  animations in App Router — Next unmounts before motion can defer removal. The
  `FrozenRouter` hack relies on a private internal; also avoided.
- **`LazyMotion` + `domAnimation` + `m`** (~20kb vs 34kb for full `motion`),
  with `strict` so a plain `motion.*` import throws rather than silently
  reinflating the bundle.
- **`SplitText`** is hand-rolled — motion v13 has no `splitText` (that's in the
  paid motion-plus). Splits by **word**, not character: character splitting
  re-wraps on font swap and blows past 3s on a long headline. The sentence is
  rendered once in `sr-only` with the visual copy `aria-hidden`.
- **`LazyMotion` is deliberately not used** — see the note in
  `MotionProvider.tsx`. It would save ~14kb and is worth adding, but a
  misconfigured `strict` LazyMotion renders components static rather than
  failing loudly, so verify animations still run after switching.
- **Reduced motion** is handled in three layers: `MotionConfig
  reducedMotion="user"` for components, manual gating for raw MotionValues, and
  a CSS block for View Transitions (React does no automatic handling there).

`data-scroll-behavior="smooth"` on `<html>` is load-bearing — Next 16 stopped
auto-overriding `scroll-behavior`, so without it every route change smooth-scrolls
to the top.

## Deploy

Push to GitHub, import at [vercel.com/new](https://vercel.com/new). Zero config.
