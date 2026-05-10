import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/ui/Hero";
import {
  Section,
  SectionHead,
  SectionLabel,
  SectionTitle,
  SectionDesc,
} from "@/components/ui/Section";
import { CtaBand } from "@/components/ui/CtaBand";
import { TrustBar } from "@/components/ui/TrustBar";
import { getAllLocations } from "@/lib/content";
import { getReviewStats } from "@/lib/reviews/getReviewStats";
import type { Region } from "@/lib/content/types";

export const metadata: Metadata = {
  title: "Service Areas Melbourne",
  description:
    "All Melbourne suburbs we cover — inner and middle metro across postcodes 3000–3207. Pick your suburb to see local cleaning services.",
  alternates: { canonical: "/locations" },
};

export default async function LocationsHubPage() {
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
      <Hero
        eyebrow="Service areas"
        title="Melbourne suburbs we cover."
        description={`We work across ${locations.length} inner and middle Melbourne suburbs — postcodes 3000–3207. Pick your suburb to see local services and request a quote.`}
        reviewStats={reviewStats}
      />

      <TrustBar />

      <Section className="bg-white-soft">
        <SectionHead center>
          <SectionLabel>{locations.length} suburbs</SectionLabel>
          <SectionTitle>Browse by region</SectionTitle>
          <SectionDesc center>
            Greater Melbourne grouped into the regions we service most often.
          </SectionDesc>
        </SectionHead>
        <div
          style={{
            columnWidth: 280,
            columnGap: 20,
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {regions.map(([region, locs]) => (
            <div
              key={region}
              className="bg-white border border-border-soft rounded-[14px] overflow-hidden"
              style={{
                breakInside: "avoid",
                marginBottom: 20,
                display: "inline-block",
                width: "100%",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  background: "var(--color-navy)",
                }}
              >
                <Image
                  src="/images/map-placeholder.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 280px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: 22 }}>
              <h3
                className="font-display text-navy"
                style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 12 }}
              >
                {region} Melbourne
                <span
                  className="text-muted font-semibold"
                  style={{ fontSize: 13, marginLeft: 8 }}
                >
                  ({locs.length})
                </span>
              </h3>
              <ul
                className="list-none p-0 m-0 flex flex-col gap-1"
                style={{ fontSize: 14 }}
              >
                {locs
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((l) => (
                    <li key={l.slug}>
                      <Link
                        href={`/${l.slug}`}
                        className="flex items-center justify-between text-text-primary hover:text-teal"
                        style={{ padding: "4px 0" }}
                      >
                        <span>{l.name}</span>
                        <span className="text-muted" style={{ fontSize: 12 }}>
                          {l.postcode}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}