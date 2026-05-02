export function TrustPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="trust-pill">
      <span className="trust-pill-dot" aria-hidden />
      {children}
    </div>
  );
}
