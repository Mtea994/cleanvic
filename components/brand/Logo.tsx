import type { CSSProperties } from "react";
import Image from "next/image";

type Variant = "mark" | "wordmark" | "lockup";

interface LogoProps {
  variant?: Variant;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

const SRC = "/images/logo.png";
const NATURAL_WIDTH = 182;
const NATURAL_HEIGHT = 40;
const ASPECT = NATURAL_WIDTH / NATURAL_HEIGHT;

export function Logo({
  variant = "lockup",
  size = 40,
  className = "",
  style,
}: LogoProps) {
  const height = size;
  const width = Math.round(height * ASPECT);

  return (
    <span className={`inline-flex items-center ${className}`} style={style}>
      <Image
        src={SRC}
        alt="KleanVictoria"
        width={width}
        height={height}
        priority={variant === "lockup"}
        style={{ height, width: "auto" }}
      />
    </span>
  );
}
