import Link from "next/link";
import type { Project } from "@/data/portfolio";

/**
 * A project row.
 *
 * No card: no border, no fill, no shadow, no radius — rows are separated by a
 * hairline, and hovering adds a faint wash plus the accent corner brackets
 * that are this site's annotation motif.
 *
 * Two columns from `md` up. Running the description across the full 1312px
 * band would put ~140 characters on a line, so the width is spent on a second
 * column instead of on line length: title and metadata left, prose right.
 *
 * Sans for the title, serif for the description, mono for the metadata. That
 * three-way split carries the hierarchy now that there is no weight contrast
 * to lean on.
 */
export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      transitionTypes={["nav-forward"]}
      className="annot annot-hover row-hover -mx-3 block border-b border-line px-3 py-6"
    >
      <div className="grid gap-x-10 gap-y-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-meta text-faint tabular">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="display-sm text-h2">{project.title}</h3>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-meta text-faint">
            <span className="tabular">{project.period}</span>
            <span aria-hidden="true">·</span>
            <span
              className={project.status === "In development" ? "text-signal" : ""}
            >
              {project.status}
            </span>
          </div>
        </div>

        <div>
          <p className="leading-relaxed text-muted">{project.outcome}</p>
          <p className="mt-2 font-mono text-meta text-faint">
            {project.stack.slice(0, 5).join(", ")}
          </p>
        </div>
      </div>
    </Link>
  );
}
