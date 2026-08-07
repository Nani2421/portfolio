"use client";

import { MotionConfig } from "motion/react";

/**
 * `reducedMotion="user"` disables transform and layout animations site-wide
 * while preserving opacity — the correct behaviour, for free. It does NOT
 * cover raw MotionValues or CSS animations; those are handled at their call
 * sites and in globals.css.
 *
 * Bundle note: wrapping this in `LazyMotion features={domAnimation}` and using
 * `m` from motion/react-m instead of `motion` cuts roughly 14kb. That's the
 * documented optimisation and it's worth doing — it's left out here only
 * because it couldn't be verified end-to-end in this environment, and an
 * unverified `strict` LazyMotion silently renders components static rather
 * than failing loudly. Swap it in and confirm animations still run.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
