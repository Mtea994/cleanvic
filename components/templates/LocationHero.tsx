"use client";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button, ButtonLink } from "@/components/ui/Button";
import { MetroMap } from "@/components/ui/MetroMap";
import { useBookingModal } from "@/components/booking/BookingModalProvider";
import { phone, phoneTel } from "@/lib/config/site";
import type { Location } from "@/lib/content/types";

export function LocationHero({ location }: { location: Location }) {
  const { openModal } = useBookingModal();

  return (
    <section
      className="hero-navy hero-grid-2 align-center"
      style={{ padding: "80px 5vw" }}
    >
      <div className="hero-inner location-hero-text">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Locations" },
            { label: location.name },
          ]}
        />

        <div className="loc-badge">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M6 1.5C3.5 1.5 1.5 3.5 1.5 6c0 3.5 4.5 7.5 4.5 7.5s4.5-4 4.5-7.5C10.5 3.5 8.5 1.5 6 1.5z"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
          Serving {location.region} Melbourne
        </div>

        <h1 className="hero-h1">
          Cleaning Services in <em>{location.name}, VIC</em>
        </h1>

        <p className="hero-desc">
          Police-checked, insured local cleaners in {location.name}{" "}
          ({location.postcode}). From carpet steam-cleaning to end-of-lease deep
          cleans, we get it done right — same-day quotes, satisfaction
          guaranteed.
        </p>

        <div className="hero-actions">
          <Button variant="primary-lg" onClick={() => openModal()}>
            Book a {location.name} Clean
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path
                d="M3 9h12M10 5l5 4-5 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          <ButtonLink variant="ghost-dark" href={phoneTel}>
            Call {phone}
          </ButtonLink>
        </div>

        <div className="loc-stats">
          <div>
            <div className="loc-stat-num">2,400+</div>
            <div className="loc-stat-label">Melbourne Jobs Done</div>
          </div>
          <div>
            <div className="loc-stat-num">48 hrs</div>
            <div className="loc-stat-label">Avg Booking Response</div>
          </div>
          <div>
            <div className="loc-stat-num">4.9★</div>
            <div className="loc-stat-label">Local Reviews</div>
          </div>
        </div>
      </div>

      <MetroMap caption={`${location.name} & surrounds`} />
    </section>
  );
}
