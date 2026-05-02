"use client";

import { phone, phoneTel } from "@/lib/config/site";
import { useBookingModal } from "@/components/booking/BookingModalProvider";

export function StickyMobileCta() {
  const { openModal } = useBookingModal();

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-[800] bg-white border-t border-border-soft flex gap-2"
      style={{
        padding: "10px 12px",
        boxShadow: "0 -4px 20px rgba(13,27,46,0.10)",
      }}
    >
      <button
        type="button"
        onClick={() => openModal()}
        className="flex-1 bg-teal text-white font-bold rounded-[9px]"
        style={{ minHeight: 48, fontSize: 15 }}
      >
        Book Now
      </button>
      <a
        href={phoneTel}
        className="flex items-center justify-center gap-2 border-2 border-navy text-navy font-bold rounded-[9px]"
        style={{ minHeight: 48, padding: "0 16px", fontSize: 15 }}
        aria-label={`Call ${phone}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M3 2.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.42 1l.4 1.2a1.5 1.5 0 0 1-.34 1.6l-.7.7a8 8 0 0 0 3.22 3.22l.7-.7a1.5 1.5 0 0 1 1.6-.34l1.2.4a1.5 1.5 0 0 1 1 1.42v1a1.5 1.5 0 0 1-1.5 1.5A10.5 10.5 0 0 1 3 2.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
        Call
      </a>
    </div>
  );
}
