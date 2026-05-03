"use client";
import { ButtonLink } from "@/components/ui/Button";
import { phoneTel } from "@/lib/config/site";
import { useBookingModal } from "@/components/booking/BookingModalProvider";
import { HeroFunnel } from "../booking/HeroFunnel";
import type { ReviewStats } from "@/lib/reviews/getReviewStats";

interface HomeHeroProps {
  reviewStats: ReviewStats | null;
}

export function HomeHero({ reviewStats }: HomeHeroProps) {
  const { openModal } = useBookingModal();

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "#0d1b2e",
        padding: "80px 5vw",
        minHeight: "88vh",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 80% 50%, oklch(62% 0.18 195 / 0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div
        className="relative grid items-center gap-14 md:gap-0"
        style={{
          gridTemplateColumns: "minmax(0, 1fr)",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div className="md:grid md:items-center" style={{ gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          <div className="relative" style={{ zIndex: 2 }}>
            <div
              className="inline-flex items-center gap-2"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "var(--color-teal-lt)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                padding: "6px 14px",
                borderRadius: 100,
                marginBottom: 24,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  background: "var(--color-teal)",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "kv-pulse 2s infinite",
                }}
              />
              Victoria&rsquo;s Most Trusted Cleaners
            </div>

            <h1
              className="font-display text-white"
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: 20,
              }}
            >
              A{" "}
              <em className="not-italic" style={{ color: "var(--color-teal)" }}>
                Spotlessly Clean
              </em>
              <br />
              Home or Business,
              <br />
              Guaranteed.
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.72)",
                fontSize: "1.1rem",
                maxWidth: 480,
                marginBottom: 36,
                lineHeight: 1.7,
              }}
            >
              Professional cleaning services across all of Victoria. Fully insured, background-checked
              cleaners with 100% satisfaction guarantee. Book online in under 60 seconds.
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                type="button"
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 bg-teal text-white whitespace-nowrap"
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  padding: "15px 30px",
                  borderRadius: 11,
                  border: 0,
                  minHeight: 44,
                  transition: "filter 0.15s, transform 0.1s",
                }}
              >
                Book Your Clean
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <ButtonLink variant="ghost-dark" href={phoneTel}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <path
                    d="M2.5 2.5h4.5l1.8 4-2.4 1.4C7.7 9.8 8.2 10.3 9.1 11.1s1.3 1.4 3.1 2.6l1.4-2.4 4 1.8V17c-7.7 0-15-7.3-15-15z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
                Call Now — Free Quote
              </ButtonLink>
            </div>

            <ul
              className="list-none p-0 m-0 flex flex-wrap gap-7"
              style={{
                marginTop: 44,
                paddingTop: 36,
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {[
                { num: "1000+", label: "Happy Customers" },
                { num: "100%", label: "Satisfaction Guarantee" },
                { num: "Same-Day", label: "Bookings Available" },
                { num: "12+", label: "Services Offered" },
              ].map((s) => (
                <li key={s.label}>
                  <div
                    className="text-white"
                    style={{ fontSize: "1.8rem", fontWeight: 800, lineHeight: 1 }}
                  >
                    {s.num}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.55)",
                      fontWeight: 500,
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <HeroFunnel reviewStats={reviewStats} />

        </div>
      </div>

      <style>{`
        @keyframes kv-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </section>
  );
}

