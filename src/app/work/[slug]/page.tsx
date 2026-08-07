import { ViewTransition } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject, getAdjacent } from "@/data/portfolio";
import Reveal from "@/components/Reveal";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.outcome,
  };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacent(slug);

  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      {/* Everything sits inside the shared content column now, so the
          page-level width wrappers and the old sticky table-of-contents rail
          are gone. Long prose carries `measure` to stay readable; tables,
          diagrams and rows use the column's full width. */}
      <article>
        {/* ---- §0 Metadata ---------------------------------------------- */}
        <header>
          <Link
            href="/work"
            transitionTypes={["nav-back"]}
            className="link-underline font-mono text-meta text-muted"
          >
            ← Work
          </Link>

          <h1 className="display mt-8 text-hero">{project.title}</h1>
          <p className="measure mt-6 leading-relaxed text-muted">{project.what}</p>

          <dl className="mt-10 border-t border-line font-mono text-meta">
            {[
              { k: "Role", v: project.role },
              { k: "Timeline", v: project.period },
              { k: "Status", v: project.status },
              { k: "Domain", v: project.domain },
              { k: "Stack", v: project.stack.join(", ") },
            ].map((row) => (
              <div
                key={row.k}
                className="flex gap-6 border-b border-line py-2.5"
              >
                <dt className="w-20 shrink-0 text-faint">{row.k}</dt>
                <dd className="text-muted">{row.v}</dd>
              </div>
            ))}
          </dl>

          {(project.repo || project.demo) && (
            <div className="mt-6 flex flex-wrap gap-5">
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline font-mono text-meta text-accent"
                >
                  Repository ↗
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline font-mono text-meta text-accent"
                >
                  Live demo ↗
                </a>
              )}
            </div>
          )}
        </header>

        {/* ---- §1 Result-first opener + TL;DR ---------------------------- */}
        <Reveal>
          <section id="summary" className="mt-20 border-t border-line pt-10">
            <p className="measure text-lead leading-snug">{project.outcome}</p>

            <ul className="mt-8 space-y-3 border-l border-line pl-6">
              {project.tldr.map((point) => (
                <li key={point} className="leading-relaxed text-muted">
                  {point}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Section id="problem" index="01" title="The problem">
          <p className="measure leading-relaxed text-muted">{project.problem}</p>
        </Section>

        <Section id="constraints" index="02" title="Constraints">
          <ul className="space-y-3">
            {project.constraints.map((c) => (
              <li key={c} className="flex gap-4 leading-relaxed text-muted">
                <span className="mt-3 h-px w-3 shrink-0 bg-accent" />
                {c}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="architecture" index="03" title="How it fits together">
          <ArchitectureDiagram
            nodes={project.architecture.nodes}
            caption={project.architecture.caption}
          />
        </Section>

        <Section
          id="decisions"
          index="04"
          title="Decisions and what they cost"
          lead="Every one of these had a cheaper or more obvious alternative. These are the reasons I didn't take them."
        >
          <div className="border-t border-line">
            {project.decisions.map((d) => (
              <div key={d.decision} className="border-b border-line py-6">
                <h3 className="display-sm text-h3">{d.decision}</h3>
                <p className="mt-3 leading-relaxed text-faint">
                  <span className="eyebrow mr-2">Instead of</span>
                  {d.alternatives}
                </p>
                <p className="mt-3 leading-relaxed text-muted">{d.why}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Almost no portfolio has this section, which is exactly why it
            converts. */}
        <Section id="broke" index="05" title="What broke">
          <div className="space-y-8">
            {project.broke.map((b) => (
              <div key={b.what}>
                <p className="leading-relaxed">{b.what}</p>
                <p className="mt-3 border-l border-line pl-5 leading-relaxed text-muted">
                  <span className="eyebrow mr-2 text-accent">Fix</span>
                  {b.fix}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {project.results && (
          <Section id="results" index="06" title="Results">
            <dl className="border-t border-line">
              {project.results.map((r) => (
                <div
                  key={r.label}
                  className="flex items-baseline justify-between gap-6 border-b border-line py-4"
                >
                  <dt className="text-muted">
                    {r.label}
                    {r.note && (
                      <span className="ml-2 font-mono text-meta text-faint">
                        {r.note}
                      </span>
                    )}
                  </dt>
                  <dd className="tabular shrink-0 font-mono text-h3 text-accent">
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>
        )}

        {/* Dev-only: honest gaps rather than invented numbers. */}
        {process.env.NODE_ENV === "development" && project.needsMeasurement && (
          <aside className="mt-16 border border-dashed border-signal p-6">
            <p className="eyebrow text-signal">
              Dev only · not rendered in production
            </p>
            <p className="mt-3 text-muted">
              Numbers this case study wants but that were never measured. Fill
              them in <code className="font-mono text-meta">portfolio.ts</code>,
              then delete the entry:
            </p>
            <ul className="mt-4 space-y-1.5">
              {project.needsMeasurement.map((n) => (
                <li key={n} className="font-mono text-meta text-faint">
                  — {n}
                </li>
              ))}
            </ul>
          </aside>
        )}

        <Section
          id="next"
          index={project.results ? "07" : "06"}
          title="What I'd do next"
        >
          <p className="measure leading-relaxed text-muted">{project.next}</p>
        </Section>

        {/* ---- §9 Prev / next --------------------------------------------
            A reader who finished a case study is warm — show the next one's
            outcome, not a bare arrow. */}
        <nav className="mt-24 border-t border-line">
          {[
            { p: prev, dir: "Previous", types: ["nav-back"] },
            { p: next, dir: "Next", types: ["nav-forward"] },
          ].map(({ p, dir, types }) =>
            p ? (
              <Link
                key={dir}
                href={`/work/${p.slug}`}
                transitionTypes={types}
                className="annot annot-hover row-hover -mx-3 block border-b border-line px-3 py-6"
              >
                <span className="eyebrow">{dir}</span>
                <h3 className="display-sm mt-2 text-h2">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{p.what}</p>
              </Link>
            ) : null,
          )}
        </nav>
      </article>
    </ViewTransition>
  );
}

/**
 * A numbered case-study section. Same editorial device as the homepage: mono
 * index, sans heading, hairline above. The index is accent-coloured — the only
 * place the accent recurs down a long page.
 */
function Section({
  id,
  index,
  title,
  lead,
  children,
}: {
  id: string;
  index: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section id={id} className="mt-20 border-t border-line pt-10">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-meta text-accent tabular">
            {index}
          </span>
          <h2 className="display text-h2">{title}</h2>
        </div>
        {lead && <p className="measure mt-4 leading-relaxed text-faint">{lead}</p>}
        <div className="mt-8">{children}</div>
      </section>
    </Reveal>
  );
}
