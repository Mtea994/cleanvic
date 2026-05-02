import { describe, it, expect } from "vitest";
import {
  buildAggregateRatingSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildServiceSchema,
} from "../jsonld";
import { getService } from "@/lib/content";

const CONTEXT = {
  siteUrl: "https://kleanvictoria.com.au",
  businessName: "KleanVictoria",
  serviceArea: "Greater Melbourne",
};

describe("buildLocalBusinessSchema", () => {
  it("emits the required Schema.org fields", () => {
    const schema = buildLocalBusinessSchema({
      name: "KleanVictoria",
      url: CONTEXT.siteUrl,
      telephone: "(03) 9000 0000",
      serviceArea: CONTEXT.serviceArea,
      geo: { lat: -37.8136, lng: 144.9631 },
      address: null,
      aggregateRating: null,
    });
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("HomeAndConstructionBusiness");
    expect(schema.name).toBe("KleanVictoria");
    expect(schema.areaServed).toBe("Greater Melbourne");
  });

  it("omits address when null is passed", () => {
    const schema = buildLocalBusinessSchema({
      name: "KleanVictoria",
      url: CONTEXT.siteUrl,
      telephone: "x",
      serviceArea: "Greater Melbourne",
      geo: { lat: 0, lng: 0 },
      address: null,
      aggregateRating: null,
    });
    expect(schema.address).toBeUndefined();
  });

  it("includes address when supplied", () => {
    const schema = buildLocalBusinessSchema({
      name: "KleanVictoria",
      url: CONTEXT.siteUrl,
      telephone: "x",
      serviceArea: "Greater Melbourne",
      geo: { lat: 0, lng: 0 },
      address: {
        street: "42 Smith Street",
        suburb: "Richmond",
        postcode: "3121",
        region: "Victoria",
      },
      aggregateRating: null,
    });
    expect(schema.address).toMatchObject({
      "@type": "PostalAddress",
      streetAddress: "42 Smith Street",
      addressLocality: "Richmond",
      postalCode: "3121",
      addressRegion: "Victoria",
      addressCountry: "AU",
    });
  });

  it("omits aggregateRating when null", () => {
    const schema = buildLocalBusinessSchema({
      name: "x",
      url: "x",
      telephone: "x",
      serviceArea: "Greater Melbourne",
      geo: { lat: 0, lng: 0 },
      address: null,
      aggregateRating: null,
    });
    expect(schema.aggregateRating).toBeUndefined();
  });

  it("includes aggregateRating when supplied", () => {
    const schema = buildLocalBusinessSchema({
      name: "x",
      url: "x",
      telephone: "x",
      serviceArea: "Greater Melbourne",
      geo: { lat: 0, lng: 0 },
      address: null,
      aggregateRating: { count: 620, average: 4.9 },
    });
    expect(schema.aggregateRating).toMatchObject({
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 620,
    });
  });
});

describe("buildServiceSchema", () => {
  it("emits Service schema with provider", () => {
    const service = getService("carpet-cleaning")!;
    const schema = buildServiceSchema(service, CONTEXT);
    expect(schema["@type"]).toBe("Service");
    expect(schema.name).toBe("Carpet Cleaning");
    expect(schema.areaServed).toBe("Greater Melbourne");
    expect(schema.provider).toMatchObject({
      "@type": "HomeAndConstructionBusiness",
      name: "KleanVictoria",
    });
    expect(schema.url).toBe("https://kleanvictoria.com.au/carpet-cleaning");
  });
});

describe("buildBreadcrumbSchema", () => {
  it("chains Home → Service → Combo with positions and item URLs", () => {
    const schema = buildBreadcrumbSchema([
      { name: "Home", url: "https://kleanvictoria.com.au/" },
      { name: "Carpet Cleaning", url: "https://kleanvictoria.com.au/carpet-cleaning" },
      { name: "Carpet Cleaning in Richmond", url: "https://kleanvictoria.com.au/carpet-cleaning-richmond" },
    ]);
    expect(schema["@type"]).toBe("BreadcrumbList");
    const items = schema.itemListElement as { position: number; name: string; item: string }[];
    expect(items).toHaveLength(3);
    expect(items[0].position).toBe(1);
    expect(items[2].position).toBe(3);
    expect(items[2].item).toBe("https://kleanvictoria.com.au/carpet-cleaning-richmond");
  });
});

describe("buildFaqSchema", () => {
  it("emits one entry per Q&A", () => {
    const schema = buildFaqSchema([
      { q: "Q1?", a: "A1" },
      { q: "Q2?", a: "A2" },
    ]);
    expect(schema["@type"]).toBe("FAQPage");
    const entries = schema.mainEntity as { name: string; acceptedAnswer: { text: string } }[];
    expect(entries).toHaveLength(2);
    expect(entries[0].name).toBe("Q1?");
    expect(entries[1].acceptedAnswer.text).toBe("A2");
  });
});

describe("buildAggregateRatingSchema", () => {
  it("returns AggregateRating with bestRating/worstRating", () => {
    const schema = buildAggregateRatingSchema({ count: 100, average: 4.5 });
    expect(schema).toMatchObject({
      "@type": "AggregateRating",
      ratingValue: 4.5,
      reviewCount: 100,
      bestRating: 5,
      worstRating: 1,
    });
  });
});
