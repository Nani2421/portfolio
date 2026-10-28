"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { navLinks, profile } from "@/data/portfolio";
import { Github, Linkedin } from "./BrandIcons";

/**
 * One row: section links on the left, Résumé, then icon links on the right.
 * It stays at the top while scrolling, and the blue dot slides under the link
 * for whichever home-page section is in view — or under Projects on the
 * project pages. On phones the links scroll sideways.
 */

export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [section, setSection] = useState("#home");
  const active = onHome ? section : pathname.startsWith("/projects") ? "#projects" : "";
  const [dot, setDot] = useState<{ x: number; show: boolean }>({ x: 0, show: false });
  const links = useRef<Record<string, HTMLAnchorElement | null>>({});

  // The active section is the last one whose top has passed a line 35% down
  // the viewport; at the very bottom of the page it is the last section.
  useEffect(() => {
    if (!onHome) return;
    const onScroll = () => {
      const line = window.innerHeight * 0.35;
      let current = navLinks[0].section;
      for (const l of navLinks) {
        const el = document.querySelector(l.section);
        if (el && el.getBoundingClientRect().top <= line) current = l.section;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
      setSection(atBottom ? navLinks[navLinks.length - 1].section : current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onHome]);

  // Centre the dot under the active link. Measured, so it works at any width.
  useLayoutEffect(() => {
    const el = links.current[active];
    setDot(el ? { x: el.offsetLeft + el.offsetWidth / 2, show: true } : (d) => ({ ...d, show: false }));
  }, [active]);

  return (
    <header className="sticky top-0 z-50 bg-page/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-site items-center justify-between gap-6 px-5">
        <nav className="relative -mx-1 flex items-center gap-1 overflow-x-auto text-[15px] sm:gap-4">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              ref={(el) => {
                links.current[l.section] = el;
              }}
              href={l.href}
              className={`shrink-0 px-1 py-2 transition-colors ${active === l.section ? "text-fg" : "text-muted hover:text-fg"}`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-1 py-2 text-muted transition-colors hover:text-fg"
          >
            Résumé
          </a>
          <span
            aria-hidden="true"
            className="absolute bottom-0.5 left-0 h-1 w-1 rounded-full bg-accent transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${dot.x - 2}px)`, opacity: dot.show ? 1 : 0 }}
          />
        </nav>

        <div className="hidden shrink-0 items-center gap-4 text-fg sm:flex">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="opacity-80 hover:opacity-100">
            <Github size={17} />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="opacity-80 hover:opacity-100">
            <Linkedin size={17} />
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Email" className="opacity-80 hover:opacity-100">
            <Mail size={18} />
          </a>
        </div>
      </div>
    </header>
  );
}
