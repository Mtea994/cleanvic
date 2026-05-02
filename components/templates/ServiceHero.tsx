"use client";

import Image from "next/image";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { Button, ButtonLink } from "@/components/ui/Button";
import { TrustPill } from "@/components/ui/TrustPill";
import { useBookingModal } from "@/components/booking/BookingModalProvider";
import { phone, phoneTel } from "@/lib/config/site";
import type { Location, Service } from "@/lib/content/types";

interface ServiceHeroProps {
  service: Service;
  location?: Location;
}

const defaultPills = [
  "Same-Day Available",
  "Pet-Safe Products",
  "100% Satisfaction Guarantee",
  "Police-Checked Cleaners",
];

export function ServiceHero({ service, location }: ServiceHeroProps) {
  const { openModal } = useBookingModal();

  const breadcrumb: BreadcrumbItem[] = location
    ? [
        { label: "Home", href: "/" },
        { label: service.name, href: `/${service.slug}` },
        { label: location.name },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Services" },
        { label: service.name },
      ];

  const heading = location ? (
    <>
      <em>{service.name}</em> in {location.name}
    </>
  ) : (
    <>
      Professional <em>{service.name}</em> Across Victoria
    </>
  );

  const description = location
    ? `Local ${service.name.toLowerCase()} in ${location.name} (${location.postcode}, ${location.region} Melbourne). ${service.shortDescription}`
    : service.longDescription;

  const ctaLabel = location
    ? `Book ${service.name} in ${location.name}`
    : `Book ${service.name}`;

  return (
    <section
      className="hero-navy hero-grid-2 align-end"
      style={{ padding: "80px 5vw 0" }}
    >
      <div
        className="hero-inner"
        style={{ paddingBottom: 80 }}
      >
        <Breadcrumb items={breadcrumb} />

        <h1 className="hero-h1">{heading}</h1>

        <p className="hero-desc">{description}</p>

        <div className="hero-actions">
          <Button
            variant="primary-lg"
            onClick={() => openModal(service.slug)}
          >
            {ctaLabel}
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

        <div className="hero-trust-pills">
          {defaultPills.map((p) => (
            <TrustPill key={p}>{p}</TrustPill>
          ))}
        </div>
      </div>

      <div className="service-hero-img">
        <Image
          src={service.heroImage}
          alt={`${service.name} in action`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
        />
      </div>
    </section>
  );
}
