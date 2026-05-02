export type ServiceSlug = string;
export type LocationSlug = string;

export interface FaqItem {
  q: string;
  a: string;
}

export interface Service {
  slug: ServiceSlug;
  name: string;
  shortDescription: string;
  longDescription: string;
  whatsIncluded: string[];
  process: string[];
  faq: FaqItem[];
  heroImage: string;
  iconName: string;
  // Typed slot for future use; v1 always emits "Get a free quote".
  priceFrom: number | null;
}

export type Region =
  | "Inner"
  | "Inner East"
  | "Inner West"
  | "Inner North"
  | "Inner South"
  | "Middle East"
  | "Middle West"
  | "Middle North"
  | "Middle South"
  | "Bayside";

export interface Location {
  slug: LocationSlug;
  name: string;
  postcode: string;
  region: Region;
  lat: number;
  lng: number;
  // Optional template field for per-location prose. May reference {region}, {postcode}.
  description?: string;
}

export interface Combo {
  service: Service;
  location: Location;
  h1: string;
  blurb: string;
}

// Reserved for future per-combo overrides; left empty in v1.
export type ComboOverrides = Record<
  ServiceSlug,
  Record<LocationSlug, { h1?: string; blurb?: string } | undefined>
>;
