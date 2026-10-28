import type { Project } from "@/data/portfolio";

/**
 * Line drawings for the project panels — one per project, in the same style as
 * the page backdrop but darker, since here they are the picture.
 */
export default function ProjectArt({ slug }: { slug: Project["slug"] }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 180"
      className="h-full w-full"
      fill="none"
      stroke="#5b5f8f"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.8"
    >
      {slug === "pingdrop" && (
        <g>
          {/* phone */}
          <rect x="34" y="52" width="46" height="84" rx="10" />
          <path d="M50 60 H64" />
          <rect x="42" y="72" width="30" height="12" rx="3" />
          {/* Mac */}
          <rect x="130" y="56" width="84" height="56" rx="5" />
          <rect x="138" y="63" width="68" height="42" rx="2" />
          <path d="M118 112 H226 L220 120 H124 Z" />
          {/* notification on the Mac */}
          <rect x="164" y="68" width="38" height="12" rx="3" />
          {/* signal between them */}
          <path d="M88 84 Q98 94 88 104" />
          <path d="M96 76 Q112 94 96 112" opacity="0.7" />
          <path d="M122 84 Q112 94 122 104" />
          {/* a file on its way */}
          <path d="M98 40 H112 L118 46 V62 H98 Z" strokeDasharray="0" />
          <path d="M70 46 Q84 30 96 46" strokeDasharray="3 4" />
          <path d="M120 50 Q140 36 152 52" strokeDasharray="3 4" />
        </g>
      )}

      {slug === "policymind" && (
        <g>
          {/* stacked documents */}
          <path d="M54 34 H112 L126 48 V140 H54 Z" />
          <path d="M112 34 V48 H126" />
          <path d="M44 44 V150 H116" opacity="0.6" />
          <path d="M66 62 H114 M66 76 H114 M66 90 H104 M66 104 H114 M66 118 H96" />
          {/* highlighted passage */}
          <rect x="62" y="84" width="48" height="12" rx="2" strokeDasharray="3 3" />
          {/* magnifier */}
          <circle cx="150" cy="104" r="22" />
          <path d="M166 120 L184 138" strokeWidth="3" />
          {/* answer with a page citation */}
          <rect x="140" y="34" width="76" height="40" rx="10" />
          <path d="M152 48 H204 M152 60 H184" />
          <rect x="186" y="54" width="22" height="12" rx="6" />
        </g>
      )}

      {slug === "anpr" && (
        <g>
          {/* car, front view */}
          <path d="M64 92 L78 64 Q82 56 92 56 L148 56 Q158 56 162 64 L176 92 Z" />
          <rect x="54" y="92" width="132" height="34" rx="8" />
          <circle cx="74" cy="106" r="7" />
          <circle cx="166" cy="106" r="7" />
          <rect x="98" y="100" width="44" height="14" rx="2" />
          <path d="M66 126 V140 H84 V126 M156 126 V140 H174 V126" />
          {/* vehicle box with a track id tab */}
          <rect x="44" y="46" width="152" height="104" strokeDasharray="5 5" />
          <path d="M44 46 V34 H96 V46" />
          <path d="M54 40 H86" />
          {/* plate box */}
          <rect x="92" y="95" width="56" height="24" strokeDasharray="3 3" />
          {/* read once */}
          <path d="M200 100 l8 8 l16 -18" />
        </g>
      )}
    </svg>
  );
}
