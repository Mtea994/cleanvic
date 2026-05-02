import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config/site";
import {
  getAllCombos,
  getAllLocations,
  getAllServices,
} from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/locations`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const services: MetadataRoute.Sitemap = getAllServices().map((s) => ({
    url: `${siteUrl}/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const locations: MetadataRoute.Sitemap = getAllLocations().map((l) => ({
    url: `${siteUrl}/${l.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const combos: MetadataRoute.Sitemap = getAllCombos().map((c) => ({
    url: `${siteUrl}/${c.service.slug}-${c.location.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...services, ...locations, ...combos];
}
