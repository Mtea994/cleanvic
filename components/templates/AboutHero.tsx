"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { useBookingModal } from "@/components/booking/BookingModalProvider";
import { phone, phoneTel } from "@/lib/config/site";

const stats = [
  { num: "120+", label: "Melbourne Suburbs" },
  { num: "4,800+", label: "Happy Customers" },
  { num: "4.9★", label: "Avg Review" },
  { num: "100%", label: "Satisfaction Guarantee" },
];

export function AboutHero() {
  const { openModal } = useBookingModal();

  return (
    <section
      className="hero-navy"
      style={{
        padding: "100px 5vw 80px",
        textAlign: "center",
      }}
    >
      <div
        className="hero-inner"
        style={{ maxWidth: 720, margin: "0 auto" }}
      >
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
          Our Story
        </p>

        <h1
          className="hero-h1"
          style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}
        >
          Cleaning Melbourne homes &amp; workplaces, the <em>right way</em>.
        </h1>

        <p
          className="hero-desc"
          style={{ maxWidth: "100%", fontSize: "1.15rem", marginInline: "auto" }}
        >
          We&rsquo;re a small, accountable Melbourne team. The kind of cleaners
          you can call by name, who turn up when they say they will, and who
          stand behind their work.
        </p>

        <div
          className="hero-actions"
          style={{ justifyContent: "center", marginBottom: 0 }}
        >
          <Button variant="primary-lg" onClick={() => openModal()}>
            Get a Free Quote
          </Button>
          <ButtonLink variant="ghost-dark" href={phoneTel}>
            Call {phone}
          </ButtonLink>
        </div>

        <div className="about-stats">
          {stats.map((s) => (
            <div key={s.label} className="about-stat">
              <div className="about-stat-num">{s.num}</div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
