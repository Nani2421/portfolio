import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  certifications,
  education,
  leadership,
  profile,
  projects,
  skills,
  updates,
} from "@/data/portfolio";
import ProjectPoster from "@/components/ProjectPoster";
import Link from "next/link";

/** A section heading, the same everywhere. */
function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[26px] font-medium tracking-tight">{children}</h2>;
}

/** Date on the left, text on the right, a hairline between rows. */
function Row({ left, children }: { left: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[150px_1fr] sm:gap-6">
      <p className="text-[14px] text-faint">{left}</p>
      <div className="text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* ---- Hello ------------------------------------------------------ */}
      <section id="home" className="grid items-center gap-12 py-16 md:grid-cols-[1.1fr_1fr] md:py-28">
        <div>
          <h1 className="text-[40px] font-medium tracking-tight">Hi, I’m Neeraj 👋</h1>
          <p className="mt-5 text-[16px] leading-[1.75]">
            I’m into <b className="font-medium">AI, ML</b> and building things around them — LLMs,
            retrieval-augmented generation and computer vision. I’m a computer science graduate from{" "}
            <b className="font-medium">VIT-AP</b>, and I like shipping things people actually use, like{" "}
            <a href="https://getpingdrop.vercel.app" target="_blank" rel="noopener noreferrer" className="link">
              PingDrop
            </a>
            , which puts your Android phone on your Mac.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            <Link href="/projects" className="pill">
              View projects <ArrowUpRight size={14} />
            </Link>
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="pill">
              Résumé <ArrowDown size={14} />
            </a>
          </div>
        </div>

        {/* A drawing in place of a photo: the desk the work happens at. */}
        <div className="aspect-[4/3] rounded-sm bg-hero p-8">
          <svg
            aria-hidden="true"
            viewBox="0 0 320 240"
            className="h-full w-full"
            fill="none"
            style={{ stroke: "var(--color-hero-ink)" }}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          >
            {/* desk */}
            <path d="M20 196 H300 M40 196 V232 M280 196 V232" />
            {/* Mac with a small network on the screen */}
            <rect x="96" y="92" width="128" height="84" rx="6" />
            <rect x="106" y="101" width="108" height="64" rx="2" />
            <path d="M80 176 H240 L232 186 H88 Z" />
            {[116, 133, 150].map((y) =>
              [124, 142].map((y2) => <path key={`${y}-${y2}`} d={`M130 ${y} L160 ${y2}`} opacity="0.6" />),
            )}
            {[124, 142].map((y) => <path key={`o${y}`} d={`M160 ${y} L190 133`} opacity="0.6" />)}
            {[116, 133, 150].map((y) => <circle key={`a${y}`} cx="130" cy={y} r="4" style={{ fill: "var(--color-hero)" }} />)}
            {[124, 142].map((y) => <circle key={`b${y}`} cx="160" cy={y} r="4" style={{ fill: "var(--color-hero)" }} />)}
            <circle cx="190" cy="133" r="4" style={{ fill: "var(--color-hero)" }} />
            {/* phone, with signal to the Mac */}
            <rect x="248" y="140" width="30" height="54" rx="7" />
            <path d="M258 146 H268" />
            <path d="M238 156 Q230 166 238 176 M230 150 Q218 166 230 182" opacity="0.8" />
            {/* mug */}
            <path d="M48 166 H72 V190 Q72 194 68 194 H52 Q48 194 48 190 Z M72 172 Q82 172 82 180 Q82 186 72 186" />
            <path d="M56 156 Q52 150 56 144 M64 156 Q60 150 64 144" opacity="0.6" />
            {/* lamp */}
            <path d="M268 196 V88 L236 60" />
            <path d="M222 48 L250 72 L236 60 Z M220 46 L252 74" />
          </svg>
        </div>
      </section>

      {/* ---- Projects --------------------------------------------------- */}
      <section id="projects" className="py-12">
        {/* Short versions here; the full story of each is on /projects. */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Heading>Featured projects</Heading>
            <p className="mt-2 text-[15px] text-muted">
              Short versions here — the full story of each is on the Projects page.
            </p>
          </div>
          <Link href="/projects" className="pill">
            See all projects <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-x-8">
          {projects.map((p) => (
            <article key={p.slug}>
              <Link href={`/projects/${p.slug}`} className="block overflow-hidden rounded-sm">
                <ProjectPoster slug={p.slug} title={p.title} sizes="(min-width: 768px) 480px, 100vw" className="transition-transform duration-300 hover:scale-[1.02]" />
              </Link>
              <h3 className="mt-4 text-[18px] font-medium">
                <Link href={`/projects/${p.slug}`} className="link">
                  {p.title}
                </Link>
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed">{p.summary}</p>
              <p className="mt-1 text-[13px] text-faint">{p.meta}</p>
              <ul className="mt-4 list-disc space-y-1.5 pl-4 text-[14px] leading-relaxed text-muted marker:text-faint">
                {p.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <p className="mt-4 text-[13px] text-faint">{p.stack.join(" · ")}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[14px]">
                <Link href={`/projects/${p.slug}`} className="link font-medium text-accent">
                  Read the full story →
                </Link>
                {p.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1">
                    {l.label} <ArrowUpRight size={13} />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/projects" className="pill">
            All projects &amp; case studies <ArrowRight size={14} />
          </Link>
          <p className="text-[14px] text-muted">How each one works, the decisions behind it and what broke.</p>
        </div>
      </section>

      {/* ---- Updates ---------------------------------------------------- */}
      <section id="updates" className="py-12">
        <Heading>Updates</Heading>
        <div className="mt-6 border-t border-line">
          {updates.map((u) => (
            <Row key={u.date + u.text} left={u.date}>
              {u.text}
              {u.tag && <span className="ml-2 text-[13px] text-accent">{u.tag}</span>}
            </Row>
          ))}
        </div>
      </section>

      {/* ---- Skills ----------------------------------------------------- */}
      <section id="skills" className="py-12">
        <Heading>Skills</Heading>
        <div className="mt-6 border-t border-line">
          {skills.map((s) => (
            <Row key={s.group} left={s.group}>
              <div className="flex flex-wrap gap-2">
                {s.items.map((i) => (
                  <span key={i} className="rounded-md bg-chip px-2.5 py-1 text-[14px]">
                    {i}
                  </span>
                ))}
              </div>
            </Row>
          ))}
        </div>
      </section>

      {/* ---- About: education, leadership, certificates ----------------- */}
      <section id="about" className="py-12">
        <Heading>Education</Heading>
        <div className="mt-6 border-t border-line">
          {education.map((e) => (
            <Row key={e.institution} left={e.period}>
              <p className="font-medium">{e.institution}</p>
              <p className="text-muted">{e.credential}</p>
            </Row>
          ))}
        </div>

        <div className="mt-14">
          <Heading>Positions of responsibility</Heading>
          <div className="mt-6 border-t border-line">
            {leadership.map((l) => (
              <Row key={l.role} left={l.period}>
                <span className="font-medium">{l.role}</span>
                <span className="text-muted"> · {l.org}</span>
              </Row>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <Heading>Certifications</Heading>
          <div className="mt-6 border-t border-line">
            {certifications.map((c) => (
              <Row key={c.name} left={c.year}>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="link font-medium">
                  {c.name}
                </a>
                <span className="text-muted"> · {c.issuer}</span>
              </Row>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
