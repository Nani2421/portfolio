# Portfolio — Sri Neeraj Reddy Palakolanu

Live at **[neerajreddy.vercel.app](https://neerajreddy.vercel.app)**

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Motion v13.
Static everywhere except `/api/contact`, which needs a Node runtime.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Structure

```
/                     Intro · skills game · featured work · capabilities
/work                 All four projects
/work/[slug]          Case study per project
/about                Narrative, focus areas, education, certifications
/api/contact          POST → Resend. The only dynamic route.
```

**All content lives in `src/data/portfolio.ts`.** Components read from it and
nowhere else, so copy changes never require touching a component.

## Environment

Copy `.env.example` to `.env.local` and fill it in. `RESEND_API_KEY` is
server-only — it is read in `src/app/api/contact/route.ts`, which never runs in
the browser. **Do not rename it to `NEXT_PUBLIC_*`**; that would inline it into
the client bundle and publish it.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Contact form delivery. Without it the route returns 503 and the form says so. |
| `CONTACT_FROM` | Sender. Resend only allows `onboarding@resend.dev` until a domain is verified. |
| `CONTACT_TO` | Destination. Falls back to `profile.email`. |

In production these live in the host's environment settings, never in the repo.

## Design system

Tokens are Tailwind v4 `@theme` variables in `globals.css`. Three decisions
carry the look:

- **Warm paper ground `#f6f4ef`**, never pure white, with a warm near-black
  `#14110d` rather than `#000`. Accent is deep teal `#0b5d51`, used perhaps
  three times a screen — its force is entirely scarcity.
- **Serif body under sans headings** (Source Serif 4 + Geist), the inverse of
  the usual pairing. Geist Mono carries all metadata, with `tabular-nums`.
- **Zero border-radius, no shadows.** Enforced by a `*` reset; structure comes
  from 6%-alpha hairlines and spacing alone.

`.annot` draws corner ticks like a detection bounding box — the one ornament
here that the work actually earns.

### Dark mode

`data-theme` on `<html>`, set by an inline script in `layout.tsx` **before first
paint** so there is no flash. `suppressHydrationWarning` on `<html>` is required,
not cosmetic — the script legitimately changes an attribute React rendered.

Only colour tokens are redefined, so no component knows dark mode exists. The
two canvases are the exception: they resolve tokens to concrete strings, so both
observe `data-theme` and re-read on change.

## The canvases

**`SkillSnake.tsx`** — the skills section is a playable Snake game. Tokens are
skills; eating one attaches a labelled ball to the tail. It runs on its own
orange (`--color-play`), not the site accent, so it reads as the one thing you
are meant to play with. Autoplays, hands over on click/tap/focus, and arrow keys
are captured only while the grid has focus so they still scroll the page
elsewhere. The full skill list renders as real text underneath — the canvas is
decorative to assistive tech, the `<ul>` is the source of truth.

Sizing is driven by `window.resize`, deliberately **not** a `ResizeObserver`:
the wrapper's height comes from the canvas being sized, so observing it feeds
its own output back in and hangs the page.

**`StarField.tsx`** — sparse drifting background. Paints in `--color-fg`, so the
light/dark inversion is free; `--star-alpha` and `--star-size` are per-theme
because a dark dot on paper and a light dot on near-black need different
treatment to read at the same weight.

## Honesty rules encoded in the code

- **No skills grid.** `capabilities` pairs each claim with a link to the case
  study proving it. Skill bars are self-rated and unmeasurable.
- **`learning: true`** on a skill token renders it as a dashed outline with a
  legend, so RAG/NLP/LLMs can appear without implying a shipped project.
- **`needsMeasurement`** lists numbers a case study *wants* but that were never
  measured. They are deliberately not invented — they render as a dashed panel
  in `npm run dev` only, never in production. Measure it, move it to `results`,
  delete the entry.
- Every figure in the ANPR `results` comes from the training notebooks, not from
  memory of them.

## Two Tailwind v4 traps this project already hit

Both cost real debugging time; both fail **silently**.

1. **Font variables must sit on `<html>`, not `<body>`.** `@theme` emits at
   `:root`, and a custom property resolves its `var()` references where it is
   declared. With `next/font` classNames on `<body>`, the whole stack computes
   empty and everything falls back to the system font.
2. **Never size text with `text-[var(--x)]`.** Tailwind cannot tell a length
   from a colour and emits nothing. Sizes are registered in the `--text-*`
   namespace so they generate real utilities.

A third, added later: **Tailwind's preflight sets `margin: 0` on everything**,
which breaks `<dialog>` — native modal centring *is* `margin: auto`. Hence the
explicit `dialog { margin: auto }` in `globals.css`.

## Deploy

Push to GitHub, import at [vercel.com/new](https://vercel.com/new), add the
three environment variables above. Every push redeploys.

GitHub Pages will **not** work: it is static-only and cannot run
`/api/contact`, so the contact form would fail on every submit.
