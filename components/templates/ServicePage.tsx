import Link from "next/link";
import {
  Section,
  SectionHead,
  SectionLabel,
  SectionTitle,
  SectionDesc,
} from "@/components/ui/Section";
import { ServiceHero } from "@/components/templates/ServiceHero";
import { ServiceBeforeAfter } from "@/components/templates/ServiceBeforeAfter";
import { TrustBar } from "@/components/ui/TrustBar";
import { CtaBand } from "@/components/ui/CtaBand";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { getAllLocations } from "@/lib/content";
import type { Service } from "@/lib/content/types";

export function ServicePage({ service }: { service: Service }) {
  const locations = getAllLocations();

  return (
    <>
      <ServiceHero service={service} />

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
            <SectionTitle>Every {service.name.toLowerCase()} job</SectionTitle>
            <ul
              className="list-none p-0 m-0 flex flex-col gap-3"
              style={{ marginTop: 18 }}
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
            <SectionLabel>Our process</SectionLabel>
            <SectionTitle>How a job runs</SectionTitle>
            <ol className="list-none p-0 m-0 flex flex-col gap-4" style={{ marginTop: 18 }}>
              {service.process.map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span
                    className="bg-teal text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold"
                    style={{ width: 32, height: 32, fontSize: 14 }}
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 16, lineHeight: 1.6 }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <ServiceBeforeAfter service={service} />

      <Section>
        <SectionHead center>
          <SectionLabel>Frequently asked</SectionLabel>
          <SectionTitle>About {service.name.toLowerCase()}</SectionTitle>
        </SectionHead>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <FaqAccordion items={service.faq} />
        </div>
      </Section>

      <Section className="bg-offwhite">
        <SectionHead center>
          <SectionLabel>Suburbs we serve</SectionLabel>
          <SectionTitle>{service.name} across Melbourne</SectionTitle>
          <SectionDesc center>
            We service {service.name.toLowerCase()} in inner and middle
            Melbourne. Pick your suburb to see local response times and
            reviews.
          </SectionDesc>
        </SectionHead>
        <ul
          className="list-none p-0 m-0 flex flex-wrap gap-2 justify-center"
          style={{ maxWidth: 1100, margin: "0 auto" }}
        >
          {locations.slice(0, 60).map((l) => (
            <li key={l.slug}>
              <Link
                href={`/${service.slug}-${l.slug}`}
                className="inline-block bg-white border border-border-soft rounded-full text-text-primary hover:border-teal hover:text-teal"
                style={{ padding: "6px 14px", fontSize: 14 }}
              >
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand prefilledService={service.slug} />
    </>
  );
}
