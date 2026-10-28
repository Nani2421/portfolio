import { Mail } from "lucide-react";
import { navLinks, profile } from "@/data/portfolio";
import { Github, Linkedin } from "./BrandIcons";

/**
 * One row: section links on the left, Résumé, then icon links on the right.
 * It stays at the top while scrolling, on the page colour so text never
 * shows through. On phones the links scroll sideways instead of wrapping.
 */
export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-page/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-site items-center justify-between gap-6 px-5">
        <nav className="-mx-1 flex items-center gap-1 overflow-x-auto text-[15px] sm:gap-4">
          <a href="#top" className="relative shrink-0 px-1 py-2">
            Home
            <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
          </a>
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="shrink-0 px-1 py-2 text-muted transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-1 py-2 text-muted transition-colors hover:text-fg"
          >
            Résumé
          </a>
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
