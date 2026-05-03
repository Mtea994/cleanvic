interface ServiceIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function ServiceIcon({
  name,
  size = 80,
  className = "",
}: ServiceIconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 80 80",
    fill: "none" as const,
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "carpet":
      return (
        <svg {...common}>
          <rect x="15" y="25" width="50" height="30" rx="6" stroke="currentColor" strokeWidth="2" />
          <path d="M22 35h36M22 40h36M22 45h26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    case "deep":
      return (
        <svg {...common}>
          <circle cx="40" cy="40" r="22" stroke="currentColor" strokeWidth="2" />
          <path d="M40 26v14l8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "house":
      return (
        <svg {...common}>
          <path d="M15 55V35L40 18l25 17v20H15z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M30 45h20M30 50h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </svg>
      );
    case "commercial":
      return (
        <svg {...common}>
          <rect x="15" y="15" width="50" height="50" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M28 28h24M28 38h24M28 48h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <rect x="28" y="55" width="10" height="10" fill="currentColor" opacity="0.15" />
        </svg>
      );
    case "window":
      return (
        <svg {...common}>
          <rect x="18" y="18" width="44" height="44" rx="4" stroke="currentColor" strokeWidth="2" />
          <path d="M40 18v44M18 40h44" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "upholstery":
      return (
        <svg {...common}>
          <path d="M18 52h44v6H18z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M22 52V36a4 4 0 014-4h28a4 4 0 014 4v16" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M18 42h44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </svg>
      );
    case "mattress":
      return (
        <svg {...common}>
          <rect x="14" y="34" width="52" height="18" rx="6" stroke="currentColor" strokeWidth="1.8" />
          <rect x="14" y="52" width="52" height="6" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M22 38h36M22 44h28" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
        </svg>
      );
    case "tile":
      return (
        <svg {...common}>
          <rect x="18" y="18" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <rect x="38" y="18" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <rect x="18" y="38" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <rect x="38" y="38" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "oven":
      return (
        <svg {...common}>
          <rect x="16" y="22" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="1.8" />
          <rect x="24" y="30" width="32" height="22" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="26" cy="26" r="2" fill="currentColor" opacity="0.5" />
          <circle cx="34" cy="26" r="2" fill="currentColor" opacity="0.5" />
        </svg>
      );
    case "rug":
      return (
        <svg {...common}>
          <rect x="20" y="28" width="40" height="24" rx="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 36h40M20 44h40M24 28v24M56 28v24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
        </svg>
      );
    case "water":
      return (
        <svg {...common}>
          <path d="M40 20c-5 8-14 14-14 24a14 14 0 0028 0C54 34 45 28 40 20z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M34 52a6 6 0 008-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    case "lease":
      return (
        <svg {...common}>
          <rect x="22" y="18" width="36" height="44" rx="4" stroke="currentColor" strokeWidth="1.8" />
          <path d="M30 14h20v8H30z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M30 34h20M30 42h20M30 50h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="40" cy="40" r="22" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
}
