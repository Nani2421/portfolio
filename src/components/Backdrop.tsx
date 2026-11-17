/**
 * A faint Ghibli-style landscape fixed behind the whole page — the same world
 * as the hero portrait, drawn in whisper-light page tints so it reads as
 * texture, not a picture. Rolling hills and a low sun along the bottom, puffy
 * clouds and birds up top. The sun and moon share one spot in the sky: when
 * the theme switches, one spins and fades into the other, and the stars come
 * out (bd-sun / bd-moon / bd-stars in globals.css). Clouds drift and birds
 * bob; all motion stops under prefers-reduced-motion.
 */
export default function Backdrop() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {/* ---- Sun and moon share the same spot in the sky; the theme switch
              cross-fades and spins one into the other (bd-sun / bd-moon in
              globals.css). ---- */}
      <g className="bd-sun">
        <circle cx="1250" cy="168" r="78" style={{ fill: "var(--art-sun)" }} opacity="0.16" />
        <circle cx="1250" cy="168" r="44" style={{ fill: "var(--art-sun)" }} opacity="0.85" />
        <g
          className="bd-rays"
          style={{ stroke: "var(--art-sun)" }}
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.55"
        >
          <path d="M1316 168 L1332 168 M1184 168 L1168 168 M1250 102 L1250 86 M1250 234 L1250 250" />
          <path d="M1296.7 121.3 L1308 110 M1296.7 214.7 L1308 226 M1203.3 121.3 L1192 110 M1203.3 214.7 L1192 226" />
        </g>
      </g>
      <g className="bd-moon">
        <path
          d="M1232 132 a44 44 0 1 0 30 76 a36 36 0 1 1 -30 -76 Z"
          style={{ fill: "var(--art-moon)" }}
          opacity="0.8"
        />
      </g>
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
