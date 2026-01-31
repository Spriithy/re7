import { CategoryIcon } from "../CategoryIcon";

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

const COLOR_SCHEMES = [
  {
    gradient: "from-warm-100 via-warm-50 to-paper-200",
    accent: "#d4522a",
    icon: "#8f3624",
  },
  {
    gradient: "from-paper-200 via-warm-100 to-warm-50",
    accent: "#e87042",
    icon: "#b14024",
  },
  {
    gradient: "from-warm-200 via-paper-100 to-warm-50",
    accent: "#f29468",
    icon: "#d4522a",
  },
  {
    gradient: "from-paper-300 via-warm-50 to-paper-100",
    accent: "#b14024",
    icon: "#752f22",
  },
];

function renderPattern(index: number, accent: string) {
  switch (index) {
    case 0:
      // Concentric rings
      return (
        <>
          <circle
            cx="20"
            cy="80"
            r="45"
            fill="none"
            stroke={accent}
            strokeWidth="0.8"
            opacity="0.12"
          />
          <circle
            cx="20"
            cy="80"
            r="35"
            fill="none"
            stroke={accent}
            strokeWidth="0.5"
            opacity="0.08"
          />
          <circle
            cx="20"
            cy="80"
            r="25"
            fill="none"
            stroke={accent}
            strokeWidth="0.3"
            opacity="0.06"
          />
          <circle cx="80" cy="20" r="30" fill={accent} opacity="0.06" />
        </>
      );
    case 1:
      // Soft blobs
      return (
        <>
          <ellipse
            cx="75"
            cy="25"
            rx="35"
            ry="30"
            fill={accent}
            opacity="0.07"
            transform="rotate(-15 75 25)"
          />
          <ellipse
            cx="25"
            cy="75"
            rx="28"
            ry="35"
            fill={accent}
            opacity="0.09"
            transform="rotate(20 25 75)"
          />
          <circle cx="60" cy="70" r="20" fill={accent} opacity="0.04" />
        </>
      );
    case 2:
      // Diagonal strokes with circles
      return (
        <>
          <line
            x1="0"
            y1="30"
            x2="100"
            y2="70"
            stroke={accent}
            strokeWidth="0.4"
            opacity="0.1"
          />
          <line
            x1="0"
            y1="40"
            x2="100"
            y2="80"
            stroke={accent}
            strokeWidth="0.3"
            opacity="0.07"
          />
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="90"
            stroke={accent}
            strokeWidth="0.2"
            opacity="0.05"
          />
          <circle cx="70" cy="30" r="25" fill={accent} opacity="0.06" />
          <circle cx="30" cy="65" r="18" fill={accent} opacity="0.05" />
        </>
      );
    default:
      // Scattered dots
      return (
        <>
          <circle cx="15" cy="20" r="2" fill={accent} opacity="0.08" />
          <circle cx="25" cy="35" r="3" fill={accent} opacity="0.06" />
          <circle cx="10" cy="50" r="1.5" fill={accent} opacity="0.1" />
          <circle cx="75" cy="40" r="2.5" fill={accent} opacity="0.07" />
          <circle cx="85" cy="55" r="1.5" fill={accent} opacity="0.09" />
          <circle cx="70" cy="65" r="3.5" fill={accent} opacity="0.05" />
          <circle cx="50" cy="85" r="2" fill={accent} opacity="0.08" />
          <circle cx="40" cy="70" r="1.5" fill={accent} opacity="0.06" />
          <circle cx="60" cy="20" r="3" fill={accent} opacity="0.04" />
          <circle cx="50" cy="50" r="22" fill={accent} opacity="0.04" />
        </>
      );
  }
}

export function DefaultCategoryIcon({
  iconName,
  className = "",
}: DefaultCategoryIconProps) {
  const name = iconName ?? "entrees";
  const hash = hashCode(name);
  const scheme = COLOR_SCHEMES[hash % COLOR_SCHEMES.length];
  const patternIndex = hash % 4;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${scheme.gradient} ${className}`}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {renderPattern(patternIndex, scheme.accent)}
      </svg>

      <div className="relative z-10 rounded-full bg-white/50 p-4 shadow-sm backdrop-blur-sm">
        <CategoryIcon
          iconName={name}
          className="h-10 w-10"
          style={{ color: scheme.icon }}
        />
      </div>
    </div>
  );
}
