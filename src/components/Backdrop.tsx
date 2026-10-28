/**
 * Faint line art fixed behind the whole page. It is texture, not a picture —
 * very light strokes that sit in the side margins, out of the way of the text.
 *
 * It reads as one story: data points (top left) feed a small neural network,
 * which becomes a detector drawing boxes around a car (left), and retrieval
 * over a stack of documents (right); a dotted path carries both down to the
 * thing that ships — a phone and a Mac talking to each other (bottom).
 */
export default function Backdrop() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="#c9cde0"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.75"
    >
      {/* ---- Data points, top left ---- */}
      <g fill="#c9cde0" stroke="none">
        <circle cx="46" cy="60" r="2.5" />
        <circle cx="78" cy="42" r="2" />
        <circle cx="104" cy="74" r="2.5" />
        <circle cx="62" cy="96" r="2" />
        <circle cx="132" cy="50" r="2" />
        <circle cx="150" cy="88" r="2.5" />
        <circle cx="94" cy="118" r="2" />
      </g>

      {/* ---- Neural network: 3 → 4 → 2 ---- */}
      <g>
        {[150, 190, 230].map((y1) =>
          [140, 175, 210, 245].map((y2) => (
            <path key={`a${y1}-${y2}`} d={`M60 ${y1} L130 ${y2}`} opacity="0.6" />
          )),
        )}
        {[140, 175, 210, 245].map((y1) =>
          [170, 215].map((y2) => (
            <path key={`b${y1}-${y2}`} d={`M130 ${y1} L200 ${y2}`} opacity="0.6" />
          )),
        )}
        {[150, 190, 230].map((y) => <circle key={`n0${y}`} cx="60" cy={y} r="7" fill="#fbfbfd" />)}
        {[140, 175, 210, 245].map((y) => <circle key={`n1${y}`} cx="130" cy={y} r="7" fill="#fbfbfd" />)}
        {[170, 215].map((y) => <circle key={`n2${y}`} cx="200" cy={y} r="7" fill="#fbfbfd" />)}
      </g>

      {/* ---- Detector: a car with bounding boxes, left ---- */}
      <g>
        <path d="M44 470 L60 440 Q66 430 80 430 L150 430 Q164 430 170 440 L186 470 Z" />
        <rect x="36" y="470" width="158" height="34" rx="8" />
        <circle cx="70" cy="510" r="11" fill="#fbfbfd" />
        <circle cx="160" cy="510" r="11" fill="#fbfbfd" />
        <rect x="92" y="480" width="46" height="14" rx="2" />
        {/* vehicle box, dashed, with a label tab */}
        <rect x="26" y="418" width="178" height="110" strokeDasharray="5 5" />
        <path d="M26 418 L26 404 L86 404 L86 418" />
        {/* plate box */}
        <rect x="86" y="475" width="58" height="24" strokeDasharray="3 4" />
      </g>

      {/* ---- Documents + magnifier (retrieval), top right ---- */}
      <g>
        <path d="M1290 70 L1350 70 L1366 86 L1366 160 L1290 160 Z" />
        <path d="M1350 70 L1350 86 L1366 86" />
        <path d="M1278 82 L1278 172 L1354 172" opacity="0.7" />
        <path d="M1266 94 L1266 184 L1342 184" opacity="0.5" />
        <path d="M1302 100 H1350 M1302 114 H1350 M1302 128 H1336" />
        <circle cx="1380" cy="170" r="22" fill="#fbfbfd" />
        <path d="M1396 186 L1416 206" strokeWidth="3" />
        <path d="M1370 166 H1390 M1370 176 H1384" />
      </g>

      {/* ---- Chat answer with a page citation, right ---- */}
      <g>
        <rect x="1262" y="300" width="150" height="70" rx="14" />
        <path d="M1290 370 L1282 388 L1304 370" />
        <path d="M1280 322 H1394 M1280 338 H1380 M1280 354 H1340" />
        <rect x="1350" y="346" width="40" height="16" rx="8" />
      </g>

      {/* ---- The product: phone and Mac talking, bottom ---- */}
      <g>
        {/* phone, bottom left */}
        <rect x="84" y="720" width="58" height="104" rx="12" />
        <path d="M104 730 H122" />
        {/* Mac, bottom right */}
        <rect x="1264" y="712" width="140" height="88" rx="8" />
        <rect x="1276" y="724" width="116" height="64" rx="3" />
        <path d="M1240 800 H1428 L1418 812 H1250 Z" />
        {/* signal arcs out of each */}
        <path d="M156 752 Q170 772 156 792" />
        <path d="M168 742 Q188 772 168 802" opacity="0.7" />
        <path d="M1250 744 Q1236 764 1250 784" />
        <path d="M1238 734 Q1218 764 1238 794" opacity="0.7" />
      </g>

      {/* ---- The path that ties it together ---- */}
      <path
        d="M130 260 C150 330 110 380 112 400 M112 540 C120 620 100 680 112 712 M184 772 C500 860 940 860 1222 764 M1338 290 C1350 250 1330 220 1340 196 M1336 380 C1350 520 1320 640 1334 704"
        strokeDasharray="2 9"
        opacity="0.9"
      />
    </svg>
  );
}
