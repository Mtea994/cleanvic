"use client";

import type { ReactNode } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { phone, phoneTel } from "@/lib/config/site";
import { useBookingModal } from "@/components/booking/BookingModalProvider";

interface CtaBandProps {
  title?: string;
  subtitle?: ReactNode;
  prefilledService?: string;
}

export function CtaBand({
  title = "Ready for a sparkling clean?",
  subtitle = "Same-day quotes, transparent pricing, satisfaction guaranteed.",
  prefilledService,
}: CtaBandProps) {
  const { openModal } = useBookingModal();

  return (
    <section
      className="bg-teal text-white text-center"
      style={{ padding: "64px 5vw" }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 700,
            marginBottom: 12,
            lineHeight: 1.25,
          }}
        >
          {title}
        </h2>
        <p
          className="text-white/90"
          style={{ fontSize: "1.05rem", marginBottom: 28 }}
        >
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="white" onClick={() => openModal(prefilledService)}>
            Get a free quote
          </Button>
          <ButtonLink variant="ghost-dark" href={phoneTel}>
            Call {phone}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
