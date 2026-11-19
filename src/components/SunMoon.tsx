/**
 * The sun by day, the moon by night, in one spot: when the theme switches,
 * one spins and fades into the other (bd-sun / bd-moon in globals.css).
 * Kept out of the full-page Backdrop, whose landscape is cropped on narrow
 * screens, so the caller can place it where it is always in view.
 */
export default function SunMoon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 180" fill="none" className={`pointer-events-none ${className}`}>
      <g className="bd-sun">
        <circle cx="90" cy="90" r="78" style={{ fill: "var(--art-sun)" }} opacity="0.16" />
        <circle cx="90" cy="90" r="44" style={{ fill: "var(--art-sun)" }} opacity="0.85" />
        <g
          className="bd-rays"
          style={{ stroke: "var(--art-sun)" }}
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.55"
        >
          <path d="M156 90 L172 90 M24 90 L8 90 M90 24 L90 8 M90 156 L90 172" />
          <path d="M136.7 43.3 L148 32 M136.7 136.7 L148 148 M43.3 43.3 L32 32 M43.3 136.7 L32 148" />
        </g>
      </g>
      <g className="bd-moon">
        <path
          d="M72 54 a44 44 0 1 0 30 76 a36 36 0 1 1 -30 -76 Z"
          style={{ fill: "var(--art-moon)" }}
          opacity="0.8"
        />
      </g>
    </svg>
  );
}
