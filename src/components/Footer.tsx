import { profile } from "@/data/portfolio";

/** A short sign-off: how to reach me, and where else I am. */
export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line py-10 text-[15px]">
      <p className="text-2xl">Let’s talk.</p>
      <p className="mt-3 text-muted">
        I’m open to roles in AI, machine learning and app development. Email me at{" "}
        <a href={`mailto:${profile.email}`} className="link text-fg">
          {profile.email}
        </a>
        .
      </p>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-muted">
        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="link">GitHub</a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link">LinkedIn</a>
        <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="link">Résumé</a>
      </div>

      <p className="mt-10 text-[13px] text-faint">
        © {new Date().getFullYear()} {profile.name} · {profile.location}
      </p>
    </footer>
  );
}
