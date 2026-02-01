import { CategoryIcon } from "@/components/CategoryIcon";
import { BookOpenText } from "lucide-react";

interface DefaultCategoryIconProps {
  iconName: string | null;
  className?: string;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// Enhanced warm color schemes with better contrast
const COLOR_SCHEMES = [
  {
    gradient: "from-amber-100 via-orange-50 to-amber-50",
    bg: "bg-gradient-to-br from-amber-100/80 via-orange-50/60 to-amber-50/80",
    accent: "#e07030",
    icon: "#c45320",
    pattern: "#e07030",
  },
  {
    gradient: "from-orange-100 via-amber-50 to-orange-50",
    bg: "bg-gradient-to-br from-orange-100/80 via-amber-50/60 to-orange-50/80",
    accent: "#d46025",
    icon: "#b0401a",
    pattern: "#d46025",
  },
  {
    gradient: "from-amber-50 via-orange-100/50 to-amber-100",
    bg: "bg-gradient-to-br from-amber-50/90 via-orange-100/40 to-amber-100/80",
    accent: "#c95525",
    icon: "#a03515",
    pattern: "#c95525",
  },
  {
    gradient: "from-orange-50 via-amber-100/60 to-orange-100",
    bg: "bg-gradient-to-br from-orange-50/90 via-amber-100/50 to-orange-100/80",
    accent: "#b84820",
    icon: "#903010",
    pattern: "#b84820",
  },
];

// Enhanced patterns with more texture and depth
function renderPattern(index: number, color: string) {
  switch (index) {
    case 0:
      // Layered concentric arcs with texture
      return (
        <>
          <defs>
            <pattern
              id={`dots-${index}`}
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="1.5" fill={color} opacity="0.15" />
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill={`url(#dots-${index})`}
            opacity="0.5"
          />
          <path
            d="M-10,90 Q25,45 50,50 T110,90"
            fill="none"
            stroke={color}
            strokeWidth="0.6"
            opacity="0.12"
          />
          <path
            d="M-5,95 Q30,50 50,55 T105,95"
            fill="none"
            stroke={color}
            strokeWidth="0.4"
            opacity="0.08"
          />
          <circle cx="80" cy="25" r="35" fill={color} opacity="0.05" />
          <circle cx="75" cy="30" r="25" fill={color} opacity="0.03" />
        </>
      );
    case 1:
      // Organic blob shapes with texture
      return (
        <>
          <defs>
            <pattern
              id={`lines-${index}`}
              x="0"
              y="0"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="5"
                x2="10"
                y2="5"
                stroke={color}
                strokeWidth="0.5"
                opacity="0.1"
              />
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill={`url(#lines-${index})`}
            opacity="0.4"
          />
          <ellipse
            cx="70"
            cy="30"
            rx="40"
            ry="35"
            fill={color}
            opacity="0.06"
            transform="rotate(-10 70 30)"
          />
          <ellipse
            cx="30"
            cy="70"
            rx="32"
            ry="38"
            fill={color}
            opacity="0.08"
            transform="rotate(15 30 70)"
          />
          <circle cx="60" cy="60" r="25" fill={color} opacity="0.04" />
          <circle cx="50" cy="50" r="15" fill={color} opacity="0.06" />
        </>
      );
    case 2:
      // Diagonal strokes with organic circles
      return (
        <>
          <line
            x1="-10"
            y1="20"
            x2="110"
            y2="60"
            stroke={color}
            strokeWidth="0.5"
            opacity="0.08"
          />
          <line
            x1="-10"
            y1="35"
            x2="110"
            y2="75"
            stroke={color}
            strokeWidth="0.35"
            opacity="0.06"
          />
          <line
            x1="-10"
            y1="50"
            x2="110"
            y2="90"
            stroke={color}
            strokeWidth="0.25"
            opacity="0.04"
          />
          <ellipse
            cx="70"
            cy="25"
            rx="30"
            ry="28"
            fill={color}
            opacity="0.05"
            transform="rotate(20 70 25)"
          />
          <ellipse
            cx="25"
            cy="65"
            rx="22"
            ry="25"
            fill={color}
            opacity="0.07"
            transform="rotate(-15 25 65)"
          />
          <circle cx="55" cy="45" r="12" fill={color} opacity="0.04" />
        </>
      );
    default:
      // Scattered elements with grid texture
      return (
        <>
          <defs>
            <pattern
              id={`grid-${index}`}
              x="0"
              y="0"
              width="25"
              height="25"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="12.5" cy="12.5" r="1" fill={color} opacity="0.12" />
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill={`url(#grid-${index})`}
            opacity="0.6"
          />
          <circle cx="20" cy="25" r="3" fill={color} opacity="0.1" />
          <circle cx="35" cy="40" r="4" fill={color} opacity="0.08" />
          <circle cx="15" cy="55" r="2.5" fill={color} opacity="0.12" />
          <circle cx="80" cy="35" r="3.5" fill={color} opacity="0.09" />
          <circle cx="90" cy="50" r="2" fill={color} opacity="0.11" />
          <circle cx="75" cy="65" r="4.5" fill={color} opacity="0.07" />
          <circle cx="55" cy="85" r="3" fill={color} opacity="0.1" />
          <circle cx="40" cy="70" r="2" fill={color} opacity="0.08" />
          <circle cx="65" cy="20" r="3.5" fill={color} opacity="0.06" />
          <circle cx="50" cy="50" r="20" fill={color} opacity="0.04" />
        </>
      );
  }
}

export function DefaultCategoryIcon({
  iconName,
  className = "",
}: DefaultCategoryIconProps) {
  // If no category/icon configured, use generic fallback
  const hasCategory = iconName !== null && iconName !== "";
  const name = hasCategory ? iconName : "generic";

  const hash = hashCode(name);
  const scheme = COLOR_SCHEMES[hash % COLOR_SCHEMES.length];
  const patternIndex = hash % 4;

  return (
    <div
      className={`relative flex transform-gpu items-center justify-center overflow-hidden backface-hidden ${scheme.bg} ${className}`}
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {/* Texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5" />

      {/* Pattern SVG */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {renderPattern(patternIndex, scheme.pattern)}
      </svg>

      {/* Enhanced icon container with improved visual hierarchy */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute rounded-full bg-white/30 p-6 shadow-lg backdrop-blur-sm" />

        {/* Inner icon container */}
        <div className="relative rounded-full bg-white/60 p-5 shadow-md ring-1 ring-white/40 backdrop-blur-sm">
          {hasCategory ? (
            <CategoryIcon
              iconName={name}
              className="h-12 w-12"
              style={{ color: scheme.icon }}
            />
          ) : (
            // Generic fallback for recipes without category
            <div className="flex flex-col items-center gap-1">
              <BookOpenText
                className="h-10 w-10"
                style={{ color: scheme.icon }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Subtle corner accents */}
      <div className="absolute top-3 left-3 h-8 w-8 rounded-full bg-white/10 blur-sm" />
      <div className="absolute right-3 bottom-3 h-6 w-6 rounded-full bg-white/10 blur-sm" />
    </div>
  );
}
