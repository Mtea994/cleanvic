import type { Metadata } from "next";
import { Hero } from "@/components/ui/Hero";
import {
  Section,
  SectionHead,
  SectionLabel,
  SectionTitle,
  SectionDesc,
} from "@/components/ui/Section";
import { ServiceGrid } from "@/components/ui/ServiceGrid";
import { CtaBand } from "@/components/ui/CtaBand";
import { TrustBar } from "@/components/ui/TrustBar";
import { Reveal } from "@/components/ui/Reveal";
import { getAllServices } from "@/lib/content";
import { getReviewStats } from "@/lib/reviews/getReviewStats";

export const metadata: Metadata = {
  title: "Cleaning Services Melbourne",
  description:
    "All KleanVictoria cleaning services — carpet, upholstery, tile and grout, end-of-lease, chimney, house, commercial and more across Melbourne.",
  alternates: { canonical: "/services" },
};

export default async function ServicesHubPage() {
  const services = getAllServices();
  const reviewStats = await getReviewStats();
  return (
    <>
      <Hero
        eyebrow="All services"
        title="Every cleaning service we offer in Melbourne."
        description="From regular house cleans to specialist carpet steam-cleaning, chimney sweeping, and end-of-lease deep cleans — pick the service you need to see what&rsquo;s included."
        reviewStats={reviewStats}
      />

      <TrustBar />

      <Section className="bg-white-soft">
        <SectionHead center>
          <SectionLabel>{services.length} services</SectionLabel>
          <SectionTitle>Pick a service to learn more</SectionTitle>
          <SectionDesc center>
            Each service page details what&rsquo;s included, our process, FAQs, and
            the suburbs we cover.
          </SectionDesc>
        </SectionHead>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <ServiceGrid services={services} />
        </div>
      </Section>

      <CtaBand />
      <Reveal />
    </>
  );
}