import SunMoon from "./SunMoon";

/**
 * A faint Ghibli-style landscape fixed behind the whole page, drawn in
 * whisper-light page tints so it reads as texture, not a picture: rolling
 * hills and trees along the bottom, puffy clouds and birds up top, stars at
 * night (bd-stars in globals.css). Clouds drift and birds bob; all motion
 * stops under prefers-reduced-motion.
 *
 * The wide scene is cropped to its middle on a tall phone screen, so phones get
 * their own lower, narrower scene. The sun/moon lives here in the right margin
 * only on wide screens; below that the hero shows it (see page.tsx).
 */
export default function Backdrop() {
  return (
    <>
      <WideScene />
      <PhoneScene />
      <SunMoon className="fixed right-[2vw] top-20 -z-10 hidden w-[clamp(110px,10vw,170px)] xl:block" />
    </>
  );
}

function WideScene() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 hidden h-full w-full md:block"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <g className="bd-stars">
        <g style={{ fill: "var(--art-star)" }} className="bd-twinkle">
          <circle cx="160" cy="90" r="2" />
          <circle cx="340" cy="190" r="1.6" />
          <circle cx="520" cy="70" r="2" />
          <circle cx="760" cy="150" r="1.6" />
          <circle cx="1000" cy="60" r="2" />
          <circle cx="1330" cy="320" r="1.6" />
          <circle cx="90" cy="300" r="1.6" />
        </g>
        <g style={{ fill: "var(--art-star)" }} className="bd-twinkle-late">
          <circle cx="240" cy="140" r="1.6" />
          <circle cx="440" cy="250" r="2" />
          <circle cx="640" cy="100" r="1.6" />
          <circle cx="900" cy="210" r="2" />
          <circle cx="1120" cy="90" r="1.6" />
          <circle cx="1390" cy="170" r="2" />
          <circle cx="60" cy="180" r="2" />
        </g>
      </g>

      {/* ---- Clouds, top corners ---- */}
      <g style={{ fill: "var(--art-cloud)" }} className="bd-drift">
        <path d="M60 120 Q72 88 108 92 Q120 60 160 68 Q196 56 208 88 Q242 90 232 122 Q220 136 184 132 L92 132 Q64 136 60 120 Z" />
      </g>
      <g style={{ fill: "var(--art-cloud)" }} className="bd-drift-slow">
        <path d="M1190 220 Q1200 194 1230 198 Q1240 172 1272 178 Q1302 170 1312 196 Q1340 198 1332 224 Q1322 236 1292 232 L1216 232 Q1194 236 1190 220 Z" />
        <path d="M1292 60 Q1300 40 1324 44 Q1332 24 1358 30 Q1382 24 1388 44 Q1410 46 1404 66 Q1396 76 1372 72 L1312 72 Q1296 76 1292 60 Z" opacity="0.7" />
      </g>

      {/* ---- Birds ---- */}
      <g
        style={{ stroke: "var(--color-art)" }}
        strokeWidth="2.6"
        strokeLinecap="round"
        className="bd-bob"
      >
        <path d="M330 300 q10 -11 20 0 M350 300 q10 -11 20 0" />
        <path d="M400 340 q8 -9 16 0 M416 340 q8 -9 16 0" opacity="0.7" />
      </g>

      {/* ---- Tall rolling hills along the bottom ---- */}
      <path
        d="M0 724 Q200 572 430 684 T 860 664 Q1030 576 1200 668 Q1320 606 1440 684 L1440 900 L0 900 Z"
        style={{ fill: "var(--art-hill-far)" }}
      />
      <path
        d="M0 792 Q240 656 520 758 T 1060 748 Q1260 676 1440 768 L1440 900 L0 900 Z"
        style={{ fill: "var(--art-hill-mid)" }}
      />
      <path
        d="M0 852 Q330 766 700 830 T 1440 820 L1440 900 L0 900 Z"
        style={{ fill: "var(--art-hill-near)" }}
      />

      {/* ---- Trees in the side margins ---- */}
      <g style={{ fill: "var(--art-tree)" }}>
        <path d="M118 828 L121 788" style={{ stroke: "var(--art-tree)" }} strokeWidth="5" strokeLinecap="round" />
        <circle cx="120" cy="768" r="26" />
        <circle cx="100" cy="782" r="18" />
        <circle cx="140" cy="780" r="18" />
        <path d="M1326 834 L1328 802" style={{ stroke: "var(--art-tree)" }} strokeWidth="4" strokeLinecap="round" />
        <circle cx="1328" cy="786" r="20" />
        <circle cx="1312" cy="797" r="14" />
        <circle cx="1344" cy="796" r="14" />
      </g>
    </svg>
  );
}

/** The same world redrawn for a tall phone screen, pinned to the bottom edge. */
function PhoneScene() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full md:hidden"
      viewBox="0 0 390 844"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
    >
      <g className="bd-stars">
        <g style={{ fill: "var(--art-star)" }} className="bd-twinkle">
          <circle cx="40" cy="120" r="1.6" />
          <circle cx="180" cy="90" r="1.4" />
          <circle cx="250" cy="300" r="1.6" />
          <circle cx="30" cy="420" r="1.4" />
          <circle cx="370" cy="520" r="1.6" />
        </g>
        <g style={{ fill: "var(--art-star)" }} className="bd-twinkle-late">
          <circle cx="120" cy="230" r="1.4" />
          <circle cx="300" cy="210" r="1.6" />
          <circle cx="360" cy="380" r="1.4" />
          <circle cx="80" cy="560" r="1.6" />
        </g>
      </g>

      <g style={{ fill: "var(--art-cloud)" }} className="bd-drift">
        <path
          transform="translate(236 90)"
          d="M14 96 Q20 80 38 82 Q44 66 64 70 Q82 64 88 80 Q104 81 100 96 Q94 103 76 101 L30 101 Q16 104 14 96 Z"
        />
      </g>
      <g style={{ fill: "var(--art-cloud)" }} className="bd-drift-slow">
        <path d="M282 470 Q287 458 301 460 Q306 448 321 451 Q335 447 340 459 Q352 460 349 471 Q344 477 330 475 L294 475 Q284 478 282 470 Z" opacity="0.8" />
      </g>

      <g style={{ stroke: "var(--color-art)" }} strokeWidth="2" strokeLinecap="round" className="bd-bob">
        <path d="M40 300 q6 -7 12 0 M52 300 q6 -7 12 0" />
      </g>

      <path
        d="M0 748 Q70 706 150 734 T 300 726 Q350 710 390 728 L390 844 L0 844 Z"
        style={{ fill: "var(--art-hill-far)" }}
      />
      <path
        d="M0 784 Q110 748 220 774 T 390 770 L390 844 L0 844 Z"
        style={{ fill: "var(--art-hill-mid)" }}
      />
      <path d="M0 818 Q160 794 300 812 T 390 808 L390 844 L0 844 Z" style={{ fill: "var(--art-hill-near)" }} />

      <g style={{ fill: "var(--art-tree)" }}>
        <path d="M34 778 L35 756" style={{ stroke: "var(--art-tree)" }} strokeWidth="3" strokeLinecap="round" />
        <circle cx="35" cy="746" r="14" />
        <circle cx="25" cy="754" r="10" />
        <circle cx="45" cy="753" r="10" />
        <path d="M352 772 L353 754" style={{ stroke: "var(--art-tree)" }} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="353" cy="746" r="11" />
        <circle cx="345" cy="752" r="8" />
        <circle cx="361" cy="751" r="8" />
      </g>
    </svg>
  );
}
