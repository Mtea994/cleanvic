# Error Resolution: Next.js Serialization Error in LocationPage

**Date:** Sunday, May 3, 2026
**Issue:** `⨯ Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server".`

## Problem Statement
When visiting a location page (e.g., `/abbotsford`), the application crashed with a 500 error. The error was caused by passing a function prop (`hrefPrefix`) from a Server Component (`LocationPage.tsx`) to a Client Component (`ServiceGrid.tsx`). Next.js App Router does not allow passing functions across the server-client boundary as they cannot be serialized.

## Investigation
- **Source:** `components/templates/LocationPage.tsx` was passing `hrefPrefix={(slug) => \`/${slug}-${location.slug}\`}` to `ServiceGrid`.
- **Target:** `components/ui/ServiceGrid.tsx` is marked with `"use client"`.
- **Architecture:** The URL structure must follow the SEO requirement: `/<service-slug>-<location-slug>`.

## Resolution Strategy
To maintain the SEO-optimized URL structure without violating Next.js serialization rules, I refactored the data flow to pass a simple string instead of a generator function.

### Implementation Breakdown

### 1. Refactored `ServiceGrid` Props
Modified `components/ui/ServiceGrid.tsx` to replace the `hrefPrefix` function with an optional `locationSlug` string.

```typescript
// Before
interface ServiceGridProps {
  services: Service[];
  hrefPrefix?: (slug: string) => string;
  // ...
}

// After
interface ServiceGridProps {
  services: Service[];
  locationSlug?: string; // Passed as a serializable string
  // ...
}
```

### 2. Updated URL Construction Logic
Updated the internal logic of `ServiceGrid` to construct the URL based on the presence of `locationSlug`.

```typescript
const href = locationSlug ? `/${s.slug}-${locationSlug}` : `/${s.slug}`;
```

### 3. Fixed Template Implementation
Updated `LocationPage.tsx` to pass the suburb's slug directly.

```tsx
// components/templates/LocationPage.tsx
<ServiceGrid
  services={services}
  locationSlug={location.slug}
  cta="Get a local quote"
/>
```

### 4. Visibility Fix (Secondary Issue)
During testing, service cards were invisible because the `fade-in-up` animation class required the `Reveal` observer component, which was missing from the template.

- Added `<Reveal />` to `LocationPage.tsx` and `app/services/page.tsx`.

## Verification Results
- **Serialization Error:** Resolved. Location pages now render without crashing.
- **Routing:** Links correctly resolve to `/<service>-<location>` (e.g., `/carpet-cleaning-abbotsford`).
- **Visibility:** Cards correctly animate into view on scroll.
- **Regression Testing:** All 57 existing unit tests passed.

## Architectural Decision Records (ADR)
- **Prefer String Props over Function Props:** When communicating between Server and Client components, always prefer passing raw data (slugs, IDs, primitive values) and let the Client component handle simple string concatenations or logic.
- **Maintain Flat URL Structure:** The refactor preserves the flat SEO-friendly URL structure required by the PRD while adhering to framework constraints.
