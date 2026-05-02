"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  ariaLabel?: string;
  children: ReactNode;
  width?: number;
}

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  onClose,
  ariaLabel = "Dialog",
  children,
  width = 560,
}: ModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFirst = () => {
      const focusables = cardRef.current?.querySelectorAll<HTMLElement>(
        FOCUSABLE_SELECTORS,
      );
      if (focusables && focusables.length > 0) {
        focusables[0].focus();
      } else {
        cardRef.current?.focus();
      }
    };
    focusFirst();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusables = cardRef.current?.querySelectorAll<HTMLElement>(
          FOCUSABLE_SELECTORS,
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{
        background: "rgba(13,27,46,0.55)",
        backdropFilter: "blur(6px)",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={cardRef}
        tabIndex={-1}
        className="relative bg-white rounded-[14px] shadow-card-lg w-full overflow-hidden outline-none"
        style={{ maxWidth: width }}
      >
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute top-3 right-3 flex items-center justify-center rounded-full text-muted hover:bg-offwhite hover:text-navy transition"
          style={{ width: 36, height: 36, fontSize: 22, lineHeight: 1 }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
