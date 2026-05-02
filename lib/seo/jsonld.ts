// JSON-LD builders. Pure functions — JSON in, JSON out. No I/O, no env-var
// reads. The caller (page or layout) is responsible for assembling the
// resolved data and passing it in.

import type { FaqItem, Service } from "@/lib/content/types";
import type { ReviewStats } from "@/lib/reviews/getReviewStats";
import type { AddressFields } from "./address-gate";

export interface BuildLocalBusinessInput {
  name: string;
  url: string;
  telephone: string;
  serviceArea: string;
  geo: { lat: number; lng: number };
  // Pre-decided by the caller via the address-gate; pass `null` to omit.
  address: AddressFields | null;
  // Pre-fetched by the caller via getReviewStats; pass `null` to omit.
  aggregateRating: ReviewStats | null;
}

export function buildLocalBusinessSchema(
  input: BuildLocalBusinessInput,
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: input.name,
    url: input.url,
    telephone: input.telephone,
    areaServed: input.serviceArea,
    geo: {
      "@type": "GeoCoordinates",
      latitude: input.geo.lat,
      longitude: input.geo.lng,
    },
  };

  if (input.address) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: input.address.street,
      addressLocality: input.address.suburb,
      postalCode: input.address.postcode,
      addressRegion: input.address.region,
      addressCountry: "AU",
    };
  }

  if (input.aggregateRating) {
    schema.aggregateRating = buildAggregateRatingSchema(input.aggregateRating);
  }

  return schema;
}

export function buildServiceSchema(
  service: Service,
  context: { siteUrl: string; businessName: string; serviceArea: string },
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.shortDescription,
    serviceType: service.name,
    areaServed: context.serviceArea,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: context.businessName,
      url: context.siteUrl,
    },
    url: `${context.siteUrl}/${service.slug}`,
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(
  items: BreadcrumbItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFaqSchema(items: FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function buildAggregateRatingSchema(
  stats: ReviewStats,
): Record<string, unknown> {
  return {
    "@type": "AggregateRating",
    ratingValue: stats.average,
    reviewCount: stats.count,
    bestRating: 5,
    worstRating: 1,
  };
}
