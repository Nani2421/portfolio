"use client";

import { motion } from "motion/react";
import type { DiagramNode } from "@/data/portfolio";

/**
 * Dataflow diagram. Built from DOM boxes rather than a fixed-viewBox SVG so it
 * reflows on mobile instead of shrinking to unreadable — it stacks vertically
 * under `md` and runs horizontally above it.
 *
 * This is the highest-leverage visual on a case study for someone with no
 * design assets: recruiters explicitly scan for architecture diagrams.
 */
export default function ArchitectureDiagram({
  nodes,
  caption,
}: {
  nodes: DiagramNode[];
  caption: string;
}) {
  return (
    <figure className="my-12">
      {/* Wraps rather than scrolling: a clipped pipeline with no scroll
          affordance hides the last stages, which are usually the point. */}
      <div className="border border-line bg-surface p-6 md:p-8">
        <ol className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-stretch md:gap-y-5">
          {nodes.map((node, i) => (
            <motion.li
              key={node.id}
              className="flex items-center gap-3 md:flex-col md:items-stretch"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="flex items-center gap-3">
                <div className="min-w-[9rem] flex-1 border border-line bg-raised px-4 py-3">
                  <p className="font-mono text-xs leading-snug text-fg">
                    {node.label}
                  </p>
                  {node.sub && (
                    <p className="mt-1.5 font-mono text-[10px] leading-snug text-faint">
                      {node.sub}
                    </p>
                  )}
                </div>

                {i < nodes.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden shrink-0 text-accent md:block"
                  >
                    <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
                      <path
                        d="M0 4h18M14 1l4 3-4 3"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </svg>
                  </span>
                )}
              </div>

              {i < nodes.length - 1 && (
                <span
                  aria-hidden="true"
                  className="shrink-0 text-accent md:hidden"
                >
                  <svg width="8" height="18" viewBox="0 0 8 18" fill="none">
                    <path
                      d="M4 0v16M1 12l3 4 3-4"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </svg>
                </span>
              )}
            </motion.li>
          ))}
        </ol>
      </div>
      {/* Captions make a claim, never just label the figure. */}
      <figcaption className="measure mt-4 text-sm leading-relaxed text-faint">
        {caption}
      </figcaption>
    </figure>
  );
}
