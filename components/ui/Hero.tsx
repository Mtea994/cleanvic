"use client";

import type { ReactNode } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { phone, phoneTel } from "@/lib/config/site";
import { useBookingModal } from "@/components/booking/BookingModalProvider";
import { HeroFunnel } from "@/components/booking/HeroFunnel";
import type { ReviewStats } from "@/lib/reviews/getReviewStats";

interface HeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  primaryLabel?: string;
  prefilledService?: string;
  showPhone?: boolean;
  align?: "left" | "center";
  children?: ReactNode;
  reviewStats?: ReviewStats | null;
}

export function Hero({
  eyebrow,
  title,
  description,
  primaryLabel = "Get a free quote",
  prefilledService,
  showPhone = true,
  align = "left",
  children,
  reviewStats,
}: HeroProps) {
  const { openModal } = useBookingModal();
  const isCenter = align === "center";
  const withFunnel = reviewStats !== undefined;

  const textColumn = (
    <div>
      {eyebrow && (
        <p
          className="text-teal"
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          {eyebrow}
        </p>
      )}
      <h1
        className="font-display"
        style={{
          fontSize: "clamp(2rem, 5vw, 3.4rem)",
          fontWeight: 700,
          lineHeight: 1.15,
          marginBottom: 18,
          maxWidth: isCenter ? "100%" : 760,
        }}
      >
        {title}
      </h1>
      {description && (
        <p
          className="text-white/85"
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.65,
            marginBottom: 28,
            maxWidth: isCenter ? "100%" : 600,
            marginInline: isCenter ? "auto" : undefined,
          }}
        >
          {description}
        </p>
      )}
      <div
        className={`flex flex-col sm:flex-row gap-3 ${isCenter ? "justify-center" : ""}`}
      >
        <Button variant="primary-lg" onClick={() => openModal(prefilledService)}>
          {primaryLabel}
        </Button>
        {showPhone && (
          <ButtonLink variant="ghost-dark" href={phoneTel}>
            Call {phone}
          </ButtonLink>
        )}
      </div>
      {children}
    </div>
  );

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy2) 100%)",
        color: "white",
        padding: "92px 5vw 80px",
      }}
    >
      {withFunnel ? (
        <div
          className="relative md:grid md:items-center gap-14 md:gap-0"
          style={{
            gridTemplateColumns: "1fr 1fr",
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          {textColumn}
          <HeroFunnel reviewStats={reviewStats ?? null} />
        </div>
      ) : (
        <div
          className={`relative ${isCenter ? "text-center mx-auto" : ""}`}
          style={{ maxWidth: isCenter ? 760 : 1200, margin: "0 auto" }}
        >
          {textColumn}
        </div>
      )}
    </section>
  );
}
