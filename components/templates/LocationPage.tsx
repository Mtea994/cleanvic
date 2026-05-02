import Link from "next/link";
import {
  Section,
  SectionHead,
  SectionLabel,
  SectionTitle,
  SectionDesc,
} from "@/components/ui/Section";
import { LocationHero } from "@/components/templates/LocationHero";
import { TrustBar } from "@/components/ui/TrustBar";
import { CtaBand } from "@/components/ui/CtaBand";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ServiceGrid } from "@/components/ui/ServiceGrid";
import { Reveal } from "@/components/ui/Reveal";
import { getAllLocations, getAllServices } from "@/lib/content";
import type { Location } from "@/lib/content/types";

const locationFaq = (loc: Location) => [
  {
    q: `Do you really cover ${loc.name}?`,
    a: `Yes. ${loc.name} (${loc.postcode}) is in our core service area — ${loc.region.toLowerCase()} Melbourne. We work here regularly.`,
  },
  {
    q: `How quickly can you get to ${loc.name}?`,
    a: "Most jobs in our core area are booked within 24–72 hours of your quote. Same-day callbacks are standard.",
  },
  {
    q: "Are you fully insured?",
    a: "Yes — every cleaner is police-checked, fully insured, and trained on our standard operating procedures.",
  },
  {
    q: "What if I'm not happy with the result?",
    a: "Tell us within 24 hours and we'll come back and re-do the affected area at no charge. 100% satisfaction guarantee.",
  },
];

export function LocationPage({ location }: { location: Location }) {
  const services = getAllServices();
  const allLocations = getAllLocations();
  const neighbours = allLocations
    .filter((l) => l.region === location.region && l.slug !== location.slug)
    .slice(0, 6);

  return (
    <>
      <LocationHero location={location} />

      <TrustBar />

      <Section className="bg-white-soft">
        <SectionHead center>
          <SectionLabel>Services in {location.name}</SectionLabel>
          <SectionTitle>What we offer locally</SectionTitle>
          <SectionDesc center>
            Every service we offer Melbourne-wide is available in {location.name}.
            Tap a service to see what&rsquo;s included and request a quote.
          </SectionDesc>
        </SectionHead>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <ServiceGrid
            services={services}
            locationSlug={location.slug}
            cta="Get a local quote"
          />
        </div>
      </Section>

      <Section>
        <SectionHead center>
          <SectionLabel>Nearby suburbs</SectionLabel>
          <SectionTitle>Also covering {location.region.toLowerCase()} Melbourne</SectionTitle>
        </SectionHead>
        <ul
          className="list-none p-0 m-0 flex flex-wrap gap-2 justify-center"
          style={{ maxWidth: 900, margin: "0 auto" }}
        >
          {neighbours.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/${l.slug}`}
                className="inline-block bg-white border border-border-soft rounded-full text-text-primary hover:border-teal hover:text-teal"
                style={{ padding: "6px 14px", fontSize: 14 }}
              >
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="bg-offwhite">
        <SectionHead center>
          <SectionLabel>Frequently asked</SectionLabel>
          <SectionTitle>Cleaning in {location.name}</SectionTitle>
        </SectionHead>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <FaqAccordion items={locationFaq(location)} />
        </div>
      </Section>

      <CtaBand
        title={`Ready for a clean in ${location.name}?`}
        subtitle="Same-day quotes, transparent pricing, satisfaction guaranteed."
      />
      <Reveal />
    </>
  );
}
