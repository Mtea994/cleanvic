import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveSlug } from "@/lib/routing/slug-resolver";
import {
  getAllCombos,
  getAllLocations,
  getAllServices,
} from "@/lib/content";
import { ServicePage } from "@/components/templates/ServicePage";
import { LocationPage } from "@/components/templates/LocationPage";
import { ComboPage } from "@/components/templates/ComboPage";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildServiceSchema,
} from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { businessName, serviceArea, siteUrl } from "@/lib/config/site";

interface PageParams {
  slug: string;
}

interface RouteProps {
  params: Promise<PageParams>;
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const services = getAllServices().map((s) => ({ slug: s.slug }));
  const locations = getAllLocations().map((l) => ({ slug: l.slug }));
  const combos = getAllCombos().map((c) => ({
    slug: `${c.service.slug}-${c.location.slug}`,
  }));
  return [...services, ...locations, ...combos];
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const resolution = resolveSlug(slug);

  if (resolution.kind === "service") {
    const s = resolution.service;
    return {
      title: `${s.name} Melbourne`,
      description: s.shortDescription,
      alternates: { canonical: `/${s.slug}` },
      openGraph: {
        title: `${s.name} · KleanVictoria`,
        description: s.shortDescription,
        url: `${siteUrl}/${s.slug}`,
        type: "website",
        images: [`/og?type=service&service=${s.slug}`],
      },
    };
  }

  if (resolution.kind === "location") {
    const l = resolution.location;
    return {
      title: `Cleaning Services in ${l.name}`,
      description: `Professional cleaning services in ${l.name} (${l.postcode}). Carpet, house, end-of-lease, commercial — police-checked, insured, satisfaction guaranteed.`,
      alternates: { canonical: `/${l.slug}` },
      openGraph: {
        title: `Cleaning in ${l.name} · KleanVictoria`,
        description: `Local cleaning services in ${l.name} (${l.postcode}, ${l.region} Melbourne).`,
        url: `${siteUrl}/${l.slug}`,
        type: "website",
        images: [`/og?type=location&location=${l.slug}`],
      },
    };
  }

  if (resolution.kind === "combo") {
    const { service, location } = resolution;
    const comboSlug = `${service.slug}-${location.slug}`;
    return {
      title: `${service.name} in ${location.name}`,
      description: `${service.name} in ${location.name} (${location.postcode}). ${service.shortDescription}`,
      alternates: { canonical: `/${comboSlug}` },
      openGraph: {
        title: `${service.name} in ${location.name} · KleanVictoria`,
        description: `${service.name} in ${location.name} (${location.postcode}, ${location.region} Melbourne).`,
        url: `${siteUrl}/${comboSlug}`,
        type: "website",
        images: [`/og?type=combo&service=${service.slug}&location=${location.slug}`],
      },
    };
  }

  return { title: "Not found" };
}

export default async function CatchAllPage({ params }: RouteProps) {
  const { slug } = await params;
  const resolution = resolveSlug(slug);

  if (resolution.kind === "unknown" || resolution.kind === "reserved") {
    notFound();
  }

  if (resolution.kind === "service") {
    const s = resolution.service;
    const serviceSchema = buildServiceSchema(s, {
      siteUrl,
      businessName,
      serviceArea,
    });
    const faqSchema = buildFaqSchema(s.faq);
    const breadcrumb = buildBreadcrumbSchema([
      { name: "Home", url: siteUrl },
      { name: s.name, url: `${siteUrl}/${s.slug}` },
    ]);
    return (
      <>
        <ServicePage service={s} />
        <JsonLd data={[serviceSchema, faqSchema, breadcrumb]} />
      </>
    );
  }

  if (resolution.kind === "location") {
    const l = resolution.location;
    const breadcrumb = buildBreadcrumbSchema([
      { name: "Home", url: siteUrl },
      { name: l.name, url: `${siteUrl}/${l.slug}` },
    ]);
    return (
      <>
        <LocationPage location={l} />
        <JsonLd data={breadcrumb} />
      </>
    );
  }

  // combo
  const { service, location } = resolution;
  const comboSlug = `${service.slug}-${location.slug}`;
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: service.name, url: `${siteUrl}/${service.slug}` },
    {
      name: `${service.name} in ${location.name}`,
      url: `${siteUrl}/${comboSlug}`,
    },
  ]);
  const serviceSchema = buildServiceSchema(service, {
    siteUrl,
    businessName,
    serviceArea,
  });
  const faqSchema = buildFaqSchema(service.faq);

  return (
    <>
      <ComboPage service={service} location={location} />
      <JsonLd data={[serviceSchema, faqSchema, breadcrumb]} />
    </>
  );
}
