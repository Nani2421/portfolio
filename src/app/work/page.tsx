import { ViewTransition } from "react";
import type { Metadata } from "next";
import { projects } from "@/data/portfolio";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Computer vision, deep learning and systems projects — with the decisions and tradeoffs behind each one.",
};

export default function WorkIndex() {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <div>
        <Section n="01">
          <h1 className="display text-hero">Work</h1>
          <p className="measure mt-6 leading-relaxed text-muted">
            Four projects. Each page covers the problem, the architecture, the
            decisions I made and what they cost, and what broke along the way.
          </p>
        </Section>

        <Section n="02" label="All projects">
          <div className="border-t border-line">
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.04}>
                <ProjectCard project={project} index={i} />
              </Reveal>
            ))}
          </div>
        </Section>
      </div>
    </ViewTransition>
  );
}
