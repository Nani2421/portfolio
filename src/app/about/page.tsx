import { ViewTransition } from "react";
import type { Metadata } from "next";
import {
  profile,
  education,
  leadership,
  certifications,
  focusAreas,
} from "@/data/portfolio";
import Section from "@/components/Section";

export const metadata: Metadata = {
  title: "About",
  description: `${profile.name} — background, education and what I'm working on.`,
};

/** A definition row: label left, mono metadata right, rule underneath. */
function Row({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-line py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="display-sm text-body">{title}</h3>
        <span className="shrink-0 font-mono text-meta text-faint tabular">
          {meta}
        </span>
      </div>
      {children}
    </div>
  );
}

export default function About() {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <div>
        <Section n="01">
          <h1 className="display text-hero">About</h1>

          <div className="measure mt-6 space-y-4 leading-relaxed">
            <p>
              I am a Computer Science graduate driven by a passion for
              Artificial Intelligence, Machine Learning, and Deep Learning. My
              focus spans building scalable neural architectures, developing
              Natural Language Processing systems, and crafting dynamic
              Retrieval-Augmented Generation (RAG) pipelines to solve complex
              data challenges. By integrating state-of-the-art AI frameworks
              into clean, automated backends, I bridge theoretical research
              with functional, high-impact software.
            </p>
            <p>
              Committed to innovation, I build efficient, forward-thinking
              systems that elevate how software interacts with the world.
            </p>
          </div>
        </Section>

        <Section n="02" label="Currently going deeper on">
          <dl className="border-t border-line">
            {focusAreas.map((area) => (
              <div
                key={area.title}
                className="grid gap-x-10 gap-y-2 border-b border-line py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]"
              >
                <dt className="display-sm text-body">{area.title}</dt>
                <dd className="leading-relaxed text-muted">{area.body}</dd>
              </div>
            ))}
          </dl>
          <p className="measure mt-6 text-muted">
            Learning tracks, listed separately from shipped work on purpose.
            When one turns into a project it moves to the work page.
          </p>
        </Section>

        <Section n="03" label="Education">
          <div className="border-t border-line">
            {education.map((e) => (
              <Row key={e.institution} title={e.institution} meta={e.period}>
                <p className="mt-2 text-muted">{e.credential}</p>
                <p className="mt-1 font-mono text-meta text-faint tabular">
                  {e.detail} · {e.location}
                </p>
              </Row>
            ))}
          </div>
        </Section>

        <Section n="04" label="Certifications">
          <div className="border-t border-line">
            {certifications.map((c) => (
              <Row key={c.name} title={c.name} meta={c.year}>
                <p className="mt-1 font-mono text-meta text-faint">
                  {c.issuer}
                  {c.url && (
                    <>
                      {" · "}
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline text-accent"
                      >
                        View credential ↗
                      </a>
                    </>
                  )}
                </p>
              </Row>
            ))}
          </div>
        </Section>

        <Section n="05" label="Leadership">
          <div className="border-t border-line">
            {leadership.map((l) => (
              <Row key={l.role + l.org} title={l.role} meta={l.period}>
                <p className="mt-2 text-muted">{l.org}</p>
              </Row>
            ))}
          </div>
        </Section>
      </div>
    </ViewTransition>
  );
}
