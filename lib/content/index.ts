// Public adapter surface — pages and the slug resolver only import from here.
// The data files in `./data/*` are intentionally not re-exported; consumers go
// through these adapter functions so the data source can be swapped (TS →
// Contentful) without touching pages, the slug resolver, or the SEO layer.

import { services } from "./data/services";
import { locations } from "./data/locations";
import type { Combo, Location, Service } from "./types";

const serviceBySlug = new Map(services.map((s) => [s.slug, s]));
const locationBySlug = new Map(locations.map((l) => [l.slug, l]));

// Optional per-combo overrides; v1 is empty.
const comboOverrides: Record<
  string,
  Record<string, { h1?: string; blurb?: string } | undefined>
> = {};

export function getService(slug: string): Service | null {
  return serviceBySlug.get(slug) ?? null;
}

export function getLocation(slug: string): Location | null {
  return locationBySlug.get(slug) ?? null;
}

export function getAllServices(): Service[] {
  return services;
}

export function getAllLocations(): Location[] {
  return locations;
}

export function getServiceSlugs(): Set<string> {
  return new Set(services.map((s) => s.slug));
}

export function getLocationSlugs(): Set<string> {
  return new Set(locations.map((l) => l.slug));
}

function buildCombo(service: Service, location: Location): Combo {
  const override = comboOverrides[service.slug]?.[location.slug];
  const h1 = override?.h1 ?? `${service.name} in ${location.name}`;
  const blurb =
    override?.blurb ??
    `Local ${service.name.toLowerCase()} in ${location.name} (${location.postcode}, ${location.region} Melbourne). ${service.shortDescription} Same friendly team across ${location.region.toLowerCase()} suburbs.`;
  return { service, location, h1, blurb };
}

export function getCombo(
  serviceSlug: string,
  locationSlug: string,
): Combo | null {
  const service = getService(serviceSlug);
  const location = getLocation(locationSlug);
  if (!service || !location) return null;
  return buildCombo(service, location);
}

export function getAllCombos(): Combo[] {
  const combos: Combo[] = [];
  for (const service of services) {
    for (const location of locations) {
      combos.push(buildCombo(service, location));
    }
  }
  return combos;
}

export type { Service, Location, Combo, FaqItem, Region } from "./types";
