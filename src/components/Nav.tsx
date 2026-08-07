"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, profile } from "@/data/portfolio";
import ThemeToggle from "./ThemeToggle";
import ContactModal from "./ContactModal";

/**
 * Top bar, full page width.
 *
 * Replaces the sticky left rail. Transparent while the page is at the top and
 * picks up a single 6% hairline once it scrolls — no blur, no fill, no shadow,
 * in keeping with the rest of the system. The active item is the accent colour,
 * which is still the only place the accent appears above the fold.
 */

type NavItem = { href: string; label: string; exact?: boolean };

const items: NavItem[] = [{ href: "/", label: "Home", exact: true }, ...navLinks];

/** Nav and other UI chrome use the heading sans, not the body serif. */
const HEADING = { fontFamily: "var(--font-heading)" };

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={`fixed inset-x-0 top-0 z-50 bg-page transition-colors duration-300 ${
        scrolled ? "border-b border-line" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-site items-center justify-between px-gutter">
        <Link
          href="/"
          transitionTypes={["nav-back"]}
          className="display-sm text-h3"
        >
          {profile.shortName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {items.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              transitionTypes={["nav-forward"]}
              style={HEADING}
              className={`text-[15px] transition-colors ${
                isActive(item.href, item.exact)
                  ? "text-accent"
                  : "text-muted hover:text-fg"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={HEADING}
            className="text-[15px] text-muted transition-colors hover:text-fg"
          >
            Résumé
          </a>
          {/* Secondary button: transparent fill, 1px hard border, 28px tall. */}
          <button
            onClick={() => setContact(true)}
            style={HEADING}
            className="inline-flex h-7 items-center border border-fg px-2.5 pb-px text-[15px] transition-colors hover:bg-fg hover:text-page"
          >
            Get in touch
          </button>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            style={HEADING}
            className="text-[15px] text-muted"
            aria-expanded={open}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line md:hidden">
          <div className="mx-auto flex max-w-site flex-col px-gutter pb-4">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                transitionTypes={[item.exact ? "nav-back" : "nav-forward"]}
                onClick={() => setOpen(false)}
                style={HEADING}
                className={`py-3 text-[15px] ${
                  isActive(item.href, item.exact) ? "text-accent" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              style={HEADING}
              className="py-3 text-[15px] text-muted"
            >
              Résumé
            </a>
            <button
              onClick={() => {
                setOpen(false);
                setContact(true);
              }}
              style={HEADING}
              className="py-3 text-left text-[15px] text-accent"
            >
              Get in touch
            </button>
          </div>
        </div>
      )}

      <ContactModal open={contact} onClose={() => setContact(false)} />
    </header>
  );
}
