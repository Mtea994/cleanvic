import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export function Section({ id, className = "", children }: SectionProps) {
  return (
    <section
      id={id}
      className={className}
      style={{ padding: "80px 5vw" }}
    >
      {children}
    </section>
  );
}

interface SectionHeadProps {
  center?: boolean;
  children: ReactNode;
  className?: string;
}

export function SectionHead({
  center = false,
  children,
  className = "",
}: SectionHeadProps) {
  return (
    <div
      className={`${center ? "text-center" : ""} ${className}`}
      style={{ marginBottom: 48 }}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-block text-teal"
      style={{
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      {children}
    </span>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      className="font-display text-navy"
      style={{
        fontSize: "clamp(1.7rem, 3vw, 2.5rem)",
        fontWeight: 700,
        lineHeight: 1.25,
        marginBottom: 14,
      }}
    >
      {children}
    </h2>
  );
}

export function SectionDesc({
  children,
  center = false,
}: {
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <p
      className="text-muted"
      style={{
        fontSize: "1.05rem",
        maxWidth: 560,
        lineHeight: 1.7,
        margin: center ? "0 auto" : undefined,
      }}
    >
      {children}
    </p>
  );
}
