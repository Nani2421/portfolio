import { profile } from "@/data/portfolio";
import { navLinks } from "@/data/portfolio";

/**
 * Wordmark left, link columns right, a single 6% hairline on top.
 *
 * Every link here is Geist Mono 12px in the muted colour, and every one uses
 * `.link-flood` — hovering snaps a solid accent block in behind the text and
 * flips it white. That is the one loud interaction in the whole system, and it
 * only lands because nothing else moves. Resist adding a second.
 */

const columns = [
  {
    heading: "Pages",
    links: [
      { label: "Home", href: "/" },
      ...navLinks.map((l) => ({ label: l.label, href: l.href })),
    ],
  },
  {
    heading: "Elsewhere",
    links: [
      { label: "GitHub", href: profile.github, external: true },
      { label: "LinkedIn", href: profile.linkedin, external: true },
      { label: "Résumé", href: profile.resumeUrl, external: true },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: profile.email, href: `mailto:${profile.email}` },
      { label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line pb-16 pt-8">
      <div className="flex flex-col justify-between gap-10 sm:flex-row">
        <p className="display-sm text-h3">{profile.name}</p>

        <div className="flex flex-wrap gap-x-12 gap-y-8">
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="font-mono text-meta text-faint">{col.heading}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...("external" in link && link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="link-flood font-mono text-meta text-muted"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-col justify-between gap-2 font-mono text-meta text-faint sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>{profile.location}</p>
      </div>
    </footer>
  );
}
