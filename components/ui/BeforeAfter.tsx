"use client";

import { useRef, useState, type ReactNode } from "react";

interface BeforeAfterProps {
  before: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  ariaLabel?: string;
  className?: string;
}

// Lightweight draggable before/after comparison slider — vanilla pointer
// events, no library. Honors keyboard arrows for accessibility.
export function BeforeAfter({
  before,
  after,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  ariaLabel = "Before and after comparison",
  className = "",
}: BeforeAfterProps) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const setFromClientX = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, ratio)));
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label={ariaLabel}
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      className={`relative overflow-hidden rounded-[14px] select-none ${className}`}
      style={{ aspectRatio: "16 / 10", touchAction: "none" }}
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons !== 1) return;
        setFromClientX(e.clientX);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
        if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
      }}
    >
      <div className="absolute inset-0" style={{ pointerEvents: "none" }}>{after}</div>
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${pos}%`, pointerEvents: "none" }}
        aria-hidden
      >
        <div
          className="absolute inset-y-0 left-0"
          style={{ width: `${(100 / pos) * 100}%`, minWidth: "100%" }}
        >
          {before}
        </div>
      </div>

      <span
        className="absolute top-3 left-3 bg-navy text-white font-bold rounded"
        style={{ padding: "4px 10px", fontSize: 11, letterSpacing: "0.1em" }}
      >
        {beforeLabel}
      </span>
      <span
        className="absolute top-3 right-3 bg-teal text-white font-bold rounded"
        style={{ padding: "4px 10px", fontSize: 11, letterSpacing: "0.1em" }}
      >
        {afterLabel}
      </span>

      <div
        className="absolute inset-y-0 bg-white pointer-events-none"
        style={{ left: `${pos}%`, width: 3, transform: "translateX(-50%)" }}
        aria-hidden
      />
      <div
        className="absolute bg-white rounded-full flex items-center justify-center text-navy font-bold pointer-events-none"
        style={{
          left: `${pos}%`,
          top: "50%",
          width: 36,
          height: 36,
          transform: "translate(-50%, -50%)",
          fontSize: 18,
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        }}
        aria-hidden
      >
        ⇄
      </div>
    </div>
  );
}
