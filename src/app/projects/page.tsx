import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/portfolio";
import { caseStudies } from "@/data/caseStudies";

export const metadata: Metadata = {
  title: "Projects — Neeraj",
  description: "PingDrop, PolicyMind AI, Efficient ANPR and Real-Time Theft Detection — what each one does, how it works and what I learned building it.",
};

export default function Projects() {
  return (
    <div className="py-14 md:py-20">
      <h1 className="text-[40px] font-medium tracking-tight">Projects</h1>
      <p className="mt-4 max-w-2xl text-[16px] leading-[1.75] text-muted">
        What each one does, how it works, the decisions behind it and what broke along the way.
      </p>

      <div className="mt-12 space-y-14">
        {projects.map((p) => {
          const cs = caseStudies.find((c) => c.slug === p.slug);
          return (
            <article key={p.slug} className="grid gap-6 border-t border-line pt-10 md:grid-cols-[1fr_1.1fr] md:gap-10">
              <Link href={`/projects/${p.slug}`} className="block overflow-hidden rounded-sm">
                <Image
                  src={`/projects/${p.slug}-light.jpg`}
                  alt={`${p.title} poster`}
                  width={1200}
                  height={900}
                  sizes="(min-width: 768px) 460px, 100vw"
                  className="h-auto w-full transition-transform duration-300 hover:scale-[1.02]"
                />
              </Link>
              <div>
                <h2 className="text-[24px] font-medium tracking-tight">
                  <Link href={`/projects/${p.slug}`} className="link">
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-1 text-[13px] text-faint">{p.meta}</p>
                <p className="mt-4 text-[15px] leading-relaxed">{cs?.outcome ?? p.summary}</p>
                <p className="mt-4 text-[13px] text-faint">{p.stack.join(" · ")}</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
                  <Link href={`/projects/${p.slug}`} className="pill">
                    Read how it works <ArrowRight size={14} />
                  </Link>
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1">
                      {l.label} <ArrowUpRight size={13} />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

    </div>
  );
}
