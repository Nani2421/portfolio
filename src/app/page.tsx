import { ViewTransition } from "react";
import Link from "next/link";
import { profile, projects, capabilities } from "@/data/portfolio";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import SkillSnake from "@/components/SkillSnake";

const featured = projects.filter((p) => p.featured);

/** Buttons and other UI chrome use the heading sans, not the body serif. */
const HEADING = { fontFamily: "var(--font-heading)" };

export default function Home() {
  return (
    // Must wrap the outermost element, and `default="none"` stops every
    // named element animating on every navigation.
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <div>
        {/* ---- Hero ------------------------------------------------------
            The source hero has no buttons — it can afford that, because the
            page below it is product proof and the reader already knows why
            they're there. A portfolio reader doesn't, so the two things they
            might want next are made explicit. Everything else stays quiet. */}
        <Section n="01">
          <p className="eyebrow flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 bg-accent" />
            {profile.availability}
          </p>

          <h1 className="display mt-6 text-hero">{profile.greeting}</h1>

          <p className="measure mt-6 text-lead leading-snug">
            {profile.subline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/work"
              transitionTypes={["nav-forward"]}
              style={HEADING}
              className="inline-flex h-10 items-center bg-button px-4 text-[15px] text-page transition-colors hover:bg-fg"
            >
              See the work
            </Link>
            <a
              href={`mailto:${profile.email}`}
              style={HEADING}
              className="inline-flex h-10 items-center border border-fg px-4 text-[15px] transition-colors hover:bg-fg hover:text-page"
            >
              Email me
            </a>
          </div>
        </Section>

        {/* ---- Skills ------------------------------------------------------
            Sits directly under the hero rather than at the foot of the page:
            it is the one thing here that isn't a paragraph, so it earns the
            first scroll instead of waiting until after the case-study list.
            It reads the CSS colour tokens at runtime, so it repaints itself
            on a theme flip without this page knowing. */}
        <Section n="02" label="Skills">
          <p className="measure leading-relaxed text-muted">
            A snake that eats them. It plays itself until you take over with the
            arrow keys or a swipe; the full list is written out underneath.
          </p>
          <div className="mt-8">
            <SkillSnake />
          </div>
        </Section>

        {/* ---- Selected work --------------------------------------------- */}
        <Section n="03" label="Selected work">
          <div className="border-t border-line">
            {featured.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.04}>
                <ProjectCard project={project} index={i} />
              </Reveal>
            ))}
          </div>

          <Link
            href="/work"
            transitionTypes={["nav-forward"]}
            style={HEADING}
            className="mt-8 inline-flex h-10 items-center border border-fg px-4 text-[15px] transition-colors hover:bg-fg hover:text-page"
          >
            All projects
          </Link>
        </Section>

        {/* ---- Capabilities ----------------------------------------------
            Was a bordered two-column card grid; now a plain definition list.
            The source has no cards anywhere — no borders, no fills, no
            shadows — so the structure has to come from spacing and rules. */}
        <Section n="04" label="What I can do">
          <p className="measure text-lead leading-snug">
            No skill bars. Each of these is something I built, and the link goes
            to how.
          </p>

          <dl className="mt-10 border-t border-line">
            {capabilities.map((cap, i) => (
              <Reveal key={cap.claim} delay={i * 0.04}>
                <div className="grid gap-x-10 gap-y-2 border-b border-line py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
                  <dt className="display-sm text-h3">{cap.claim}</dt>
                  <dd className="leading-relaxed text-muted">
                    {cap.detail}
                    <Link
                      href={`/work/${cap.proof}`}
                      transitionTypes={["nav-forward"]}
                      className="link-underline ml-2 whitespace-nowrap text-accent"
                    >
                      Proof
                    </Link>
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Section>

      </div>
    </ViewTransition>
  );
}
