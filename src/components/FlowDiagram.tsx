import type { DiagramNode } from "@/data/caseStudies";

/**
 * How a project works, as boxes joined by arrows. Plain boxes rather than a
 * fixed SVG so it wraps on wide screens and stacks on phones instead of
 * shrinking to unreadable.
 */
export default function FlowDiagram({ nodes, caption }: { nodes: DiagramNode[]; caption: string }) {
  return (
    <figure className="my-8">
      <ol className="flex flex-col gap-2 rounded-md border border-line bg-surface p-5 md:flex-row md:flex-wrap md:items-center md:gap-y-4">
        {nodes.map((node, i) => (
          <li key={node.id} className="flex items-center gap-2 md:flex-row">
            <div className="min-w-[150px] rounded-md bg-chip px-3.5 py-2.5">
              <p className="text-[14px] font-medium">{node.label}</p>
              {node.sub && <p className="mt-0.5 text-[12px] text-muted">{node.sub}</p>}
            </div>
            {i < nodes.length - 1 && (
              <span aria-hidden="true" className="px-1 text-faint">
                <span className="hidden md:inline">→</span>
                <span className="md:hidden">↓</span>
              </span>
            )}
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-[14px] italic leading-relaxed text-muted">{caption}</figcaption>
    </figure>
  );
}
