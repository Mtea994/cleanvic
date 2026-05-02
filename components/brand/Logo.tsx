import type { CSSProperties } from "react";

type Variant = "mark" | "wordmark" | "lockup";

interface LogoProps {
  variant?: Variant;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

// SVG mark — navy circle background with teal crescent smile and teal filled
// eyes. Features use `currentColor` so a Tailwind text-* class on the wrapper
// recolours them.
function Mark({ size = 40 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label="KleanVictoria"
      className="text-teal"
    >
      <circle cx="32" cy="32" r="32" fill="#0d1b2e" />
      <ellipse cx="22" cy="27" rx="3.4" ry="4.4" fill="currentColor" />
      <ellipse cx="42" cy="27" rx="3.4" ry="4.4" fill="currentColor" />
      <path
        d="M19 38 Q32 50 45 38"
        fill="none"
        stroke="currentColor"
        strokeWidth={3.4}
        strokeLinecap="round"
      />
    </svg>
  );
}

function Wordmark() {
  return (
    <span className="flex flex-col leading-none">
      <span
        className="font-display text-navy"
        style={{ fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.1 }}
      >
        Klean<em className="not-italic text-teal">Victoria</em>
      </span>
      <span
        className="text-muted"
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginTop: 2,
        }}
      >
        Victoria, Australia
      </span>
    </span>
  );
}

export function Logo({
  variant = "lockup",
  size = 40,
  className = "",
  style,
}: LogoProps) {
  if (variant === "mark") {
    return (
      <span className={className} style={style}>
        <Mark size={size} />
      </span>
    );
  }
  if (variant === "wordmark") {
    return (
      <span className={className} style={style}>
        <Wordmark />
      </span>
    );
  }
  return (
    <span
      className={`flex items-center gap-3 ${className}`}
      style={style}
    >
      <Mark size={size} />
      <Wordmark />
    </span>
  );
}
