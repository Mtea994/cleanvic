// Slug resolver — single source of truth for "what page is this slug?"
//
// Every URL on the marketing site routes through this function. Wrong
// resolution = wrong page or 404 on a valid URL.

import {
  getLocation,
  getLocationSlugs,
  getService,
  getServiceSlugs,
} from "@/lib/content";
import type { Location, Service } from "@/lib/content/types";

export type Resolution =
  | { kind: "service"; service: Service }
  | { kind: "location"; location: Location }
  | { kind: "combo"; service: Service; location: Location }
  | { kind: "reserved" }
  | { kind: "unknown" };

export const RESERVED_SLUGS = new Set<string>([
  "about",
  "contact",
  "services",
  "locations",
  "book",
  "api",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

const SLUG_REGEX = /^[a-z0-9-]+$/;

// Add a regression test to `slug-resolver.test.ts` whenever a new ambiguous
// slug surfaces (e.g. when a service slug shares a prefix with a location
// slug, or vice versa).
export function resolveSlug(rawSlug: string): Resolution {
  if (typeof rawSlug !== "string" || rawSlug.length === 0) {
    return { kind: "unknown" };
  }

  const slug = rawSlug.toLowerCase();

  if (RESERVED_SLUGS.has(slug)) return { kind: "reserved" };
  if (!SLUG_REGEX.test(slug)) return { kind: "unknown" };

  const serviceSlugs = getServiceSlugs();
  const locationSlugs = getLocationSlugs();

  // Standalone service.
  if (serviceSlugs.has(slug)) {
    const service = getService(slug)!;
    return { kind: "service", service };
  }

  // Standalone location.
  if (locationSlugs.has(slug)) {
    const location = getLocation(slug)!;
    return { kind: "location", location };
  }

  // Combo — longest-match split.
  // Walk split points starting from the LONGEST possible service prefix and
  // shortening; return the first split where both halves are known slugs.
  // This makes multi-word services beat shorter overlapping services when a
  // combo input could parse multiple ways.
  const parts = slug.split("-");
  for (let i = parts.length - 1; i >= 1; i--) {
    const servicePrefix = parts.slice(0, i).join("-");
    const locationSuffix = parts.slice(i).join("-");
    if (serviceSlugs.has(servicePrefix) && locationSlugs.has(locationSuffix)) {
      return {
        kind: "combo",
        service: getService(servicePrefix)!,
        location: getLocation(locationSuffix)!,
      };
    }
  }

  return { kind: "unknown" };
}
