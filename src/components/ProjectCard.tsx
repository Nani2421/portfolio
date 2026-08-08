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
 *
 * The whole row is clickable, but the repo link has to be clickable too, and
 * an <a> cannot nest inside a <Link>. So the row is a plain <div> and the
 * case-study link is an absolutely-positioned overlay; the repo link sits
 * above it on z-10. Hovering a child still hovers the wrapper, so `row-hover`
 * and the `annot-hover` brackets behave exactly as before.
 */
export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <div className="annot annot-hover row-hover relative -mx-3 border-b border-line px-3 py-6">
      <Link
        href={`/work/${project.slug}`}
        transitionTypes={["nav-forward"]}
        aria-label={`${project.title} — read the case study`}
        className="absolute inset-0"
      />

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

          {/* Only rendered when the résumé actually links a repo. Projects
              without one stay exactly as they were — no dead or invented
              links. z-10 lifts it clear of the case-study overlay above. */}
          {(project.repo || project.demo) && (
            <p className="relative z-10 mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-meta">
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-accent"
                >
                  Code ↗
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-accent"
                >
                  Live demo ↗
                </a>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
