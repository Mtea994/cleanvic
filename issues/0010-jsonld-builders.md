# 0010 — JSON-LD builders module + tests

**Status:** done
**Type:** seo + core
**Depends on:** 0004, 0011, 0012
**Blocks:** 0013

## Problem

Structured data (JSON-LD) is the lever for rich-result eligibility in Google search and is what gets the business into the local pack. Schema mistakes are costly: omit a required field and the rich result doesn't render; emit fake review counts and earn a manual penalty against the entire domain. A pure-function builder layer keeps schema generation testable and review-able in isolation.

## Acceptance criteria

- [ ] Pure function `buildLocalBusinessSchema()` returns the sitewide LocalBusiness schema. Includes `@context`, `@type`, `name`, `url`, `telephone`, `serviceArea: "Greater Melbourne"`, `geo` (Melbourne CBD coords), `aggregateRating` (only when env-gated values are present).
- [ ] LocalBusiness `address` block is conditionally included via the address-gate module from 0011 — omitted when env values are at their placeholder defaults.
- [ ] Pure function `buildServiceSchema(service)` returns Service schema with `provider: { @type: 'LocalBusiness', ... }`.
- [ ] Pure function `buildBreadcrumbSchema(breadcrumbs)` returns BreadcrumbList with ordered items (Home → Service → Combo for combo pages).
- [ ] Pure function `buildFaqSchema(faqItems)` returns FAQPage with one entry per Q&A.
- [ ] Pure function `buildAggregateRatingSchema(stats)` returns AggregateRating — but only when `stats` is non-null (caller is responsible for env-gating).
- [ ] All builders are pure (no I/O, no env-var reads except via injected dependencies).
- [ ] Tests cover: each builder emits the required Schema.org fields; LocalBusiness includes/excludes address based on the gate; AggregateRating is null-safe; BreadcrumbList chains correctly with `item` URLs; FAQPage emits one entry per Q&A.

## Implementation notes

- Builders should accept already-resolved data (the service object, the address-gate result, the review stats). They should not call adapters themselves — the page or layout assembles inputs and passes them in.
- Output is plain JSON. Pages render it via `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />`.
- Use Schema.org's `LocalBusiness` subtype `HomeAndConstructionBusiness` if it improves rich-result eligibility for cleaning services.
- Combo pages emit Service + BreadcrumbList; standalone service pages emit Service; standalone location pages emit LocalBusiness with `areaServed` narrowed; homepage emits LocalBusiness only.

## References

- PRD §"Major modules" (JSON-LD builders), §"Testing Decisions"
- Research §8.3 (JSON-LD schemas)
