import type { ReactNode } from "react";

interface TrustItem {
  icon: ReactNode;
  label: string;
}

const defaultItems: TrustItem[] = [
  { icon: <ShieldIcon />, label: "Police-checked & insured" },
  { icon: <LeafIcon />, label: "Eco-conscious products" },
  { icon: <StarIcon />, label: "100% satisfaction guarantee" },
  { icon: <ClockIcon />, label: "Same-day quotes" },
];

export function TrustBar({ items = defaultItems }: { items?: TrustItem[] }) {
  return (
    <div
      className="bg-offwhite border-y border-border-soft"
      style={{ padding: "18px 5vw" }}
    >
      <ul
        className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 list-none p-0 m-0"
        style={{ maxWidth: 1100, margin: "0 auto" }}
      >
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-2 text-text-primary font-semibold"
            style={{ fontSize: 14 }}
          >
            <span className="text-teal" aria-hidden>
              {item.icon}
            </span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M9 1.5 2.5 4v4.5c0 4 2.9 6.7 6.5 8 3.6-1.3 6.5-4 6.5-8V4L9 1.5Z" stroke="currentColor" strokeWidth="1.4"/>
      <path d="m6.5 9 2 2 3.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function LeafIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M3 15c0-7 5-12 12-12 0 7-5 12-12 12Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M3 15 11 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="m9 2 2.2 4.5 5 .7-3.6 3.5.85 5L9 13.4l-4.45 2.3L5.4 10.7 1.8 7.2l5-.7L9 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
