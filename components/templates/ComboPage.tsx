import Link from "next/link";
import {
  Section,
  SectionHead,
  SectionLabel,
  SectionTitle,
} from "@/components/ui/Section";
import { ServiceHero } from "@/components/templates/ServiceHero";
import { TrustBar } from "@/components/ui/TrustBar";
import { CtaBand } from "@/components/ui/CtaBand";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { getAllLocations } from "@/lib/content";
import type { Location, Service } from "@/lib/content/types";

export function ComboPage({
  service,
  location,
}: {
  service: Service;
  location: Location;
}) {
  const neighbours = getAllLocations()
    .filter((l) => l.region === location.region && l.slug !== location.slug)
    .slice(0, 6);

  return (
    <>
      <ServiceHero service={service} location={location} />

      <TrustBar />

      <Section className="bg-white-soft">
        <div
          className="grid gap-12 items-start"
          style={{
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div>
            <SectionLabel>What&rsquo;s included</SectionLabel>
            <SectionTitle>
              {service.name} in {location.name}
            </SectionTitle>
            <p
              className="text-muted"
              style={{ marginTop: 12, fontSize: 16, lineHeight: 1.7 }}
            >
              {service.longDescription}
            </p>
            <ul
              className="list-none p-0 m-0 flex flex-col gap-3"
              style={{ marginTop: 22 }}
            >
              {service.whatsIncluded.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="text-teal flex-shrink-0"
                    aria-hidden
                    style={{ fontSize: 18, lineHeight: 1.4 }}
                  >
                    ✓
                  </span>
                  <span style={{ fontSize: 16, lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionLabel>Local context</SectionLabel>
            <SectionTitle>
              Based in {location.region.toLowerCase()} Melbourne
            </SectionTitle>
            <p
              className="text-muted"
              style={{ marginTop: 12, fontSize: 16, lineHeight: 1.7 }}
            >
              {location.name} sits in postcode {location.postcode}, in
              {" "}{location.region.toLowerCase()} Melbourne. Our team is in this area
              regularly — we know the streets, the property types, and the
              parking situation. That means same-day quotes and reliable
              scheduling.
            </p>
            {neighbours.length > 0 && (
              <>
                <h3
                  className="font-display text-navy"
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                    marginTop: 22,
                    marginBottom: 10,
                  }}
                >
                  Also covering nearby
                </h3>
                <ul className="list-none p-0 m-0 flex flex-wrap gap-2">
                  {neighbours.map((n) => (
                    <li key={n.slug}>
                      <Link
                        href={`/${service.slug}-${n.slug}`}
                        className="inline-block bg-white border border-border-soft rounded-full text-text-primary hover:border-teal hover:text-teal"
                        style={{ padding: "5px 12px", fontSize: 13 }}
                      >
                        {service.name} in {n.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHead center>
          <SectionLabel>Frequently asked</SectionLabel>
          <SectionTitle>About {service.name.toLowerCase()}</SectionTitle>
        </SectionHead>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <FaqAccordion items={service.faq} />
        </div>
      </Section>

      <CtaBand
        title={`${service.name} in ${location.name}?`}
        subtitle="Get a free quote in under 30 seconds."
        prefilledService={service.slug}
      />
    </>
  );
}
