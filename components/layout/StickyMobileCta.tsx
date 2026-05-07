"use client";

import { phone, phoneTel } from "@/lib/config/site";
import { useBookingModal } from "@/components/booking/BookingModalProvider";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

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
        className="flex items-center justify-center gap-2 border-2 border-gold text-navy font-bold rounded-[9px]"
        style={{ minHeight: 48, padding: "0 16px", fontSize: 15 }}
        aria-label={`Call ${phone}`}
      >
        <PhoneIcon />
        Call Now
      </a>
    </div>
  );
}
