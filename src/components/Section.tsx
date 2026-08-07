import type { ReactNode } from "react";
import Reveal from "./Reveal";

/**
 * A numbered section, headed by a full-width bar.
 *
 * Hairline on top, then a bracketed mono index and the label. The brackets and
 * the accent corner ticks are the site's annotation motif — a bounding box,
 * drawn the way the detectors in these projects draw them.
 */
export default function Section({
  n,
  label,
  children,
}: {
  /** Two-digit section number, e.g. "02". */
  n: string;
  /** Optional heading shown beside the number. */
  label?: string;
  children: ReactNode;
}) {
  return (
    <section className="pb-section">
      <div className="annot mb-8 flex items-baseline gap-3 border-t border-line py-3">
        <span className="font-mono text-meta text-accent tabular">[{n}]</span>
        {label && <h2 className="eyebrow">{label}</h2>}
      </div>

      <Reveal>{children}</Reveal>
    </section>
  );
}
