import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { caseStudies, getCaseStudy } from "@/data/caseStudies";
import FlowDiagram from "@/components/FlowDiagram";
import { projects } from "@/data/portfolio";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return { title: `${cs.title} — Neeraj`, description: cs.outcome };
}

/** A section of the case study: heading, then its content. */
function Part({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="text-[22px] font-medium tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  // Same order as the Projects page.
  const order = projects.map((p) => getCaseStudy(p.slug)).filter((c) => c !== undefined);
  const i = order.findIndex((c) => c.slug === slug);
  const prev = order[i - 1];
  const next = order[i + 1];

  return (
    <article className="mx-auto max-w-3xl py-14 md:py-20">
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-[14px] text-muted hover:text-fg">
        <ArrowLeft size={14} /> All projects
      </Link>

      {/* ---- Header ---- */}
      <h1 className="mt-6 text-[40px] font-medium tracking-tight">{cs.title}</h1>
      <p className="mt-3 text-[17px] leading-relaxed text-muted">{cs.what}</p>
      <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-line py-4 text-[14px] sm:grid-cols-4">
        {[
          ["When", cs.period],
          ["Status", cs.status],
          ["Area", cs.domain],
          ["Role", cs.role],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-faint">{k}</dt>
            <dd className="mt-0.5">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex flex-wrap gap-2">
        {cs.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="pill">
            {l.label} <ArrowUpRight size={14} />
          </a>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-sm">
        <Image src={`/projects/${cs.slug}-light.jpg`} alt={`${cs.title} poster`} width={1200} height={900} sizes="(min-width: 768px) 768px, 100vw" className="h-auto w-full" priority />
      </div>

      {/* ---- Story ---- */}
      <p className="mt-10 text-[18px] leading-[1.7]">{cs.outcome}</p>

      <Part title="In short">
        <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed marker:text-faint">
          {cs.tldr.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Part>

      <Part title="The problem">
        <p className="text-[15px] leading-[1.8] text-muted">{cs.problem}</p>
      </Part>

      <Part title="Constraints">
        <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted marker:text-faint">
          {cs.constraints.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Part>

      <Part title="How it works">
        <FlowDiagram nodes={cs.architecture.nodes} caption={cs.architecture.caption} />
      </Part>

      <Part title="Decisions">
        <div className="border-t border-line">
          {cs.decisions.map((d) => (
            <div key={d.decision} className="border-b border-line py-5">
              <p className="text-[16px] font-medium leading-snug">{d.decision}</p>
              <p className="mt-2 text-[14px] text-faint">Instead of: {d.alternatives}</p>
              <p className="mt-2 text-[15px] leading-[1.75] text-muted">{d.why}</p>
            </div>
          ))}
        </div>
      </Part>

      <Part title="What broke, and the fix">
        <div className="border-t border-line">
          {cs.broke.map((b) => (
            <div key={b.what} className="grid gap-2 border-b border-line py-5 sm:grid-cols-2 sm:gap-8">
              <p className="text-[15px] leading-[1.7]">{b.what}</p>
              <p className="text-[15px] leading-[1.7] text-muted">{b.fix}</p>
            </div>
          ))}
        </div>
      </Part>

      {cs.results && cs.results.length > 0 && (
        <Part title="Results">
          <div className="grid gap-3 sm:grid-cols-2">
            {cs.results.map((r) => (
              <div key={r.label} className="rounded-md border border-line bg-white p-4">
                <p className="text-[28px] font-medium tracking-tight">{r.value}</p>
                <p className="mt-1 text-[14px]">{r.label}</p>
                {r.note && <p className="mt-1 text-[13px] text-faint">{r.note}</p>}
              </div>
            ))}
          </div>
        </Part>
      )}

      <Part title="What’s next">
        <p className="text-[15px] leading-[1.8] text-muted">{cs.next}</p>
      </Part>

      {/* ---- Prev / next ---- */}
      <nav className="mt-16 grid gap-4 border-t border-line pt-6 text-[15px] sm:grid-cols-2">
        {prev ? (
          <Link href={`/projects/${prev.slug}`} className="text-muted hover:text-fg">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/projects/${next.slug}`} className="text-muted hover:text-fg sm:text-right">
            {next.title} →
          </Link>
        )}
      </nav>
    </article>
  );
}
