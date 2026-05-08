# 0013 — SEO infrastructure (metadata, sitemap, robots)

**Status:** done
**Type:** seo
**Depends on:** 0004, 0010
**Blocks:** 0014

## Problem

For a 1,456-page site to rank, every page must expose correct metadata (title, description, canonical, OG), a sitemap must enumerate every URL, and `robots.txt` must permit indexing on production while blocking it on previews. Drift between sitemap and actual pages is an invisible bug; share the same data source.

## Acceptance criteria

- [ ] `metadataBase` set in the root layout, reading from `NEXT_PUBLIC_SITE_URL` (default `https://kleanvictoria.com.au`).
- [ ] Per-page `generateMetadata` on every static and dynamic route returning: `title`, `description`, `keywords`, `openGraph`, `twitter`, `alternates.canonical`.
- [ ] Title format: `"<Page Title> · KleanVictoria"`. For combo pages: `"<Service> in <Location> · KleanVictoria"`.
- [ ] Description format follows the prototype's existing meta description style (location-rich, service-rich, trust-signal-rich).
- [ ] `app/sitemap.ts` generates a sitemap from the same content adapters that build pages: home, all 5 static pages, all 11 service slugs, all 120 location slugs, all 1,320 combo slugs.
- [ ] Sitemap entries include `lastModified`, `changeFrequency`, `priority`.
- [ ] `app/robots.ts` allows all crawlers and references the sitemap URL.
- [ ] Preview deploys are `noindex` via env-var detection (e.g. `process.env.VERCEL_ENV !== 'production'`).
- [ ] JSON-LD schemas from 0010 are wired into the appropriate page templates and the root layout.
- [ ] Each page emits its own canonical URL (no cross-canonicalisation between standalone and combo).

## Implementation notes

- Sitemap output is automatically `sitemap.xml` at the site root; do not hand-roll XML.
- Reserved-paths must not appear in the sitemap (the slug resolver excludes them anyway).
- Open Graph image URLs come from issue 0014; until that lands, fall back to a static default at `/og-default.png`.
- The root layout emits the sitewide LocalBusiness schema once; per-page layouts emit page-specific schemas (Service, Breadcrumb, FAQ).

## References

- PRD §"Discovery & SEO", §"User Stories" (SEO)
- Research §8 (SEO)
