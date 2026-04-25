import { getCategoryBySlug } from "@/lib/categories";

interface CoverArtProps {
  slug: string;
  title: string;
  category: string;
  variant?: "card" | "feature" | "lead" | "post";
  className?: string;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Deterministic, decorative cover art that doesn't require image files.
 * Uses category color and a slug hash to produce a unique, on-brand graphic
 * per article. Renders inline SVG so it ships zero extra requests.
 */
export function CoverArt({
  slug,
  title,
  category,
  variant = "card",
  className = "",
}: CoverArtProps) {
  const cat = getCategoryBySlug(category);
  const seed = hashString(slug);
  const variantNumber = seed % 5;
  const rotation = (seed >> 3) % 360;
  const offset = ((seed >> 6) % 50) - 25;

  const from = cat?.cover.from ?? "#1f2937";
  const to = cat?.cover.to ?? "#0f172a";
  const tint = cat?.cover.tint ?? "#0f172a";
  const mark = cat?.mark ?? "B";

  const id = `cover-${slug}`;
  const heightClass =
    variant === "lead"
      ? "aspect-[5/4] sm:aspect-[16/10]"
      : variant === "feature"
        ? "aspect-[16/10]"
        : variant === "post"
          ? "aspect-[16/7]"
          : "aspect-[16/10]";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ring-1 ring-line/60 ${heightClass} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 600 400"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role="presentation"
      >
        <defs>
          <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
          <radialGradient
            id={`${id}-glow`}
            cx="20%"
            cy="20%"
            r="60%"
            fx="20%"
            fy="20%"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <pattern
            id={`${id}-dots`}
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#ffffff" fillOpacity="0.18" />
          </pattern>
          <pattern
            id={`${id}-grid`}
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0H0V40"
              stroke="#ffffff"
              strokeOpacity="0.08"
              fill="none"
            />
          </pattern>
        </defs>

        <rect width="600" height="400" fill={`url(#${id}-bg)`} />
        <rect width="600" height="400" fill={`url(#${id}-glow)`} />

        {/* Variant-specific decorative shapes */}
        {variantNumber === 0 && (
          <g transform={`translate(${300 + offset} 200) rotate(${rotation})`}>
            <circle cx="0" cy="0" r="220" fill={tint} fillOpacity="0.5" />
            <circle
              cx="-60"
              cy="-40"
              r="160"
              stroke="#ffffff"
              strokeOpacity="0.18"
              strokeWidth="1.5"
              fill="none"
            />
            <circle
              cx="60"
              cy="40"
              r="120"
              stroke="#ffffff"
              strokeOpacity="0.22"
              strokeWidth="1"
              fill="none"
            />
          </g>
        )}
        {variantNumber === 1 && (
          <>
            <rect width="600" height="400" fill={`url(#${id}-grid)`} />
            <g transform={`translate(${300 + offset} 200)`}>
              <rect
                x="-150"
                y="-150"
                width="300"
                height="300"
                rx="24"
                transform={`rotate(${rotation})`}
                fill={tint}
                fillOpacity="0.55"
              />
              <rect
                x="-110"
                y="-110"
                width="220"
                height="220"
                rx="18"
                transform={`rotate(${(rotation + 30) % 360})`}
                stroke="#ffffff"
                strokeOpacity="0.25"
                strokeWidth="1.5"
                fill="none"
              />
            </g>
          </>
        )}
        {variantNumber === 2 && (
          <>
            <rect width="600" height="400" fill={`url(#${id}-dots)`} />
            <g transform={`translate(${300 + offset} 200) rotate(${rotation})`}>
              <path
                d="M-200 0 Q -100 -180 0 0 T 200 0"
                stroke="#ffffff"
                strokeOpacity="0.5"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M-200 30 Q -100 -150 0 30 T 200 30"
                stroke="#ffffff"
                strokeOpacity="0.3"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M-200 -30 Q -100 -210 0 -30 T 200 -30"
                stroke="#ffffff"
                strokeOpacity="0.2"
                strokeWidth="1"
                fill="none"
              />
            </g>
          </>
        )}
        {variantNumber === 3 && (
          <g transform={`translate(${300 + offset} 200) rotate(${rotation})`}>
            <polygon
              points="0,-180 156,-90 156,90 0,180 -156,90 -156,-90"
              fill={tint}
              fillOpacity="0.55"
            />
            <polygon
              points="0,-130 113,-65 113,65 0,130 -113,65 -113,-65"
              stroke="#ffffff"
              strokeOpacity="0.3"
              strokeWidth="1.5"
              fill="none"
            />
          </g>
        )}
        {variantNumber === 4 && (
          <>
            <rect width="600" height="400" fill={`url(#${id}-grid)`} />
            <g
              transform={`translate(${300 + offset} 200) rotate(${rotation - 20})`}
            >
              <line
                x1="-260"
                y1="-100"
                x2="260"
                y2="-100"
                stroke="#ffffff"
                strokeOpacity="0.3"
                strokeWidth="1.5"
              />
              <line
                x1="-260"
                y1="0"
                x2="260"
                y2="0"
                stroke="#ffffff"
                strokeOpacity="0.6"
                strokeWidth="2"
              />
              <line
                x1="-260"
                y1="100"
                x2="260"
                y2="100"
                stroke="#ffffff"
                strokeOpacity="0.3"
                strokeWidth="1.5"
              />
              <circle cx="-180" cy="0" r="6" fill="#ffffff" fillOpacity="0.9" />
              <circle cx="0" cy="-100" r="4" fill="#ffffff" fillOpacity="0.7" />
              <circle cx="120" cy="100" r="5" fill="#ffffff" fillOpacity="0.8" />
            </g>
          </>
        )}

        {/* Category mark */}
        <g>
          <text
            x="32"
            y="56"
            fill="#ffffff"
            fillOpacity="0.85"
            fontFamily="ui-serif, Georgia, serif"
            fontSize="44"
            fontWeight="500"
            letterSpacing="-0.02em"
          >
            {mark}
          </text>
          <text
            x="32"
            y="380"
            fill="#ffffff"
            fillOpacity="0.55"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontSize="13"
            fontWeight="500"
            letterSpacing="0.16em"
          >
            {(cat?.shortName ?? "ARTICLE").toUpperCase()}
          </text>
        </g>

        {/* Soft top-bottom vignette */}
        <linearGradient id={`${id}-vignette`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
        <rect width="600" height="400" fill={`url(#${id}-vignette)`} />
      </svg>
    </div>
  );
}
