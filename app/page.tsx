import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HomeHero } from "@/components/templates/HomeHero";
import { TrustBar } from "@/components/ui/TrustBar";
import { Section, SectionHead, SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/Section";
import { ServiceGrid } from "@/components/ui/ServiceGrid";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { CtaBand } from "@/components/ui/CtaBand";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { Testimonials } from "@/components/ui/Testimonials";
import { Reveal } from "@/components/ui/Reveal";
import { getAllLocations, getAllServices } from "@/lib/content";
import { getReviewStats } from "@/lib/reviews/getReviewStats";
import type { Region } from "@/lib/content/types";

export const metadata: Metadata = {
  title: "Professional Cleaning Services Melbourne",
  description:
    "Carpet, house, end-of-lease, commercial, window and deep cleaning across Melbourne. Police-checked, insured, satisfaction guaranteed. Get a free quote.",
  alternates: { canonical: "/" },
};

const homeFaq = [
  {
    q: "Do you service my Melbourne suburb?",
    a: "We cover all of inner and middle Melbourne (postcodes 3000–3207), including the inner-city, east, west, north, south, and bayside regions.",
  },
  {
    q: "How quickly can you book me in?",
    a: "Most jobs are booked in within 24–72 hours. Let us know your preferred date and we'll do our best to match it.",
  },
  {
    q: "Are your cleaners police-checked?",
    a: "Yes — every team member is police-checked, fully insured, and trained on our standard operating procedures.",
  },
  {
    q: "Do you bring your own equipment and supplies?",
    a: "Yes. We bring all equipment, machinery, and eco-conscious cleaning products. You don't need to provide anything.",
  },
  {
    q: "Is there a satisfaction guarantee?",
    a: "Absolutely — if you're not 100% happy with the result, tell us within 24 hours and we'll come back and re-do the affected area at no charge.",
  },
  {
    q: "Do you offer same-day quotes?",
    a: "Yes. Submit a quote request and we'll call back within one business day, often within hours.",
  },
  {
    q: "How do you price jobs?",
    a: "We quote per job based on the size of the property, the service requested, and any special requirements. No hidden fees, no surprise charges.",
  },
  {
    q: "Can I get a regular cleaning schedule?",
    a: "Yes — many of our clients book us weekly, fortnightly, or monthly. Mention regular scheduling when you request your quote.",
  },
];

export default async function HomePage() {
  const services = getAllServices();
  const locations = getAllLocations();
  const reviewStats = await getReviewStats();


  const regions = Array.from(
    locations.reduce<Map<Region, typeof locations>>((acc, loc) => {
      const list = acc.get(loc.region) ?? [];
      list.push(loc);
      acc.set(loc.region, list);
      return acc;
    }, new Map()),
  );

  return (
    <>
      <HomeHero reviewStats={reviewStats} />

      <TrustBar />

      <HowItWorks />

      <Section className="bg-offwhite">
        <SectionHead className="max-w-[1200px] mx-auto mb-12">
          <SectionLabel>Our Services</SectionLabel>
          <SectionTitle>Every Cleaning Service Melbourne Needs</SectionTitle>
          <SectionDesc>
            From routine house cleans to specialised carpet restoration —
            we&apos;ve got every corner covered.
          </SectionDesc>
        </SectionHead>
        <div className="max-w-[1200px] mx-auto">
          <ServiceGrid services={services} cta="Book Now" openModal />
        </div>
      </Section>

      <Section className="bg-white-soft">
        <SectionHead center>
          <SectionLabel>See the difference</SectionLabel>
          <SectionTitle>Real cleans, real results</SectionTitle>
          <SectionDesc center>
            Drag the slider to compare before and after. Final image library
            replaces these placeholders pre-launch.
          </SectionDesc>
        </SectionHead>
        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <BeforeAfter
            ariaLabel="Carpet steam-clean before and after"
            before={
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src="/images/before-after-carpet-1.jpg"
                  alt="Stained carpet before steam cleaning"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            }
            after={
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src="/images/before-after-carpet-2.jpg"
                  alt="Fresh, bright carpet after steam cleaning"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            }
          />
          <BeforeAfter
            ariaLabel="Tile and grout before and after"
            before={
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src="/images/before-after-grout-1.jpg"
                  alt="Discoloured grout before cleaning"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            }
            after={
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src="/images/before-after-grout-2.jpg"
                  alt="Restored grout after cleaning"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            }
          />
          <BeforeAfter
            ariaLabel="Oven deep clean before and after"
            before={
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src="/images/before-after-oven-clean-1.jpg"
                  alt="Greasy oven interior before deep clean"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            }
            after={
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src="/images/before-after-oven-clean-2.jpg"
                  alt="Spotless oven interior after deep clean"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            }
          />
        </div>
      </Section>

      <Testimonials />

      <Section>
        <SectionHead center>
          <SectionLabel>Where we work</SectionLabel>
          <SectionTitle>Melbourne suburbs we cover</SectionTitle>
          <SectionDesc center>
            We service inner and middle Melbourne — postcodes 3000–3207. Pick
            your region or your specific suburb to see what we offer locally.
          </SectionDesc>
        </SectionHead>
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {regions.map(([region, locs]) => (
            <div
              key={region}
              className="bg-white border border-border-soft rounded-[14px] transition-[transform,box-shadow] duration-200 hover:-translate-y-[2px] hover:shadow-card fade-in-up"
              style={{ padding: 22 }}
            >
              <h3
                className="font-display text-navy"
                style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 10 }}
              >
                {region} Melbourne
              </h3>
              <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                {locs.slice(0, 6).map((l) => (
                  <li key={l.slug}>
                    <Link
                      href={`/${l.slug}`}
                      className="inline-block text-text-primary border border-border-soft rounded-full transition-colors duration-150 hover:border-teal hover:text-teal"
                      style={{ padding: "4px 12px", fontSize: 13 }}
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
                {locs.length > 6 && (
                  <li className="text-muted" style={{ fontSize: 13, padding: "4px 6px" }}>
                    +{locs.length - 6} more
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center" style={{ marginTop: 28 }}>
          <Link
            href="/locations"
            className="text-teal font-semibold transition-colors hover:brightness-110"
            style={{ fontSize: 15 }}
          >
            See all 120 suburbs →
          </Link>
        </div>
      </Section>

      <Section className="bg-offwhite">
        <SectionHead center>
          <SectionLabel>Frequently asked</SectionLabel>
          <SectionTitle>Common questions</SectionTitle>
        </SectionHead>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <FaqAccordion items={homeFaq} />
        </div>
      </Section>

      <CtaBand />

      <Reveal />
    </>
  );
}
