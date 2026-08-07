"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Scroll reveal. Fires once, transform+opacity only, so it contributes
 * nothing to CLS. MotionConfig reducedMotion="user" strips the y-translate
 * automatically and keeps the fade.
 *
 * The travel distance is 6px, not the 20px it used to be. The source design
 * has exactly two keyframes in 85KB of CSS and both move 4–6px — anything
 * further immediately reads as a template, which is the one thing this whole
 * system is arranged to avoid.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 6,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      // 0.36s on ease-out-expo, matching the source's `step-fade-in`.
      transition={{ duration: 0.36, delay, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.div>
  );
}
