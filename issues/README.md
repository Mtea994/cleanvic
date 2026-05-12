# Issues

Local issue tracker. Each issue is a markdown file in this directory; status is the `**Status:**` line at the top.

Source documents:
- `docs/prd.md` — full product requirements.
- `docs/research.md` — decision rationale.

## Status legend

- `needs-triage` — newly created, not yet picked up.
- `ready` — triaged, scoped, ready to start.
- `in-progress` — actively being worked on.
- `blocked` — waiting on a dependency.
- `done` — merged, no further work expected.

## Index

| # | Title | Status | Depends on |
|---|---|---|---|
| 0001 | Project scaffold (Next.js 15 + TS + Tailwind v4 + fonts) | done | — |
| 0002 | Design system component library | done | 0001 |
| 0003 | Logo component (SVG mark + wordmark + lockup) | done | 0001 |
| 0004 | Content data model & adapter layer | done | 0001 |
| 0005 | Slug resolver module + tests | done | 0004 |
| 0006 | Catch-all dynamic route + page templates | done | 0002, 0004, 0005 |
| 0007 | Static pages (home, about, contact, hubs) | done | 0002, 0004, 0008 |
| 0008 | Booking modal + form (RHF + Zod) | done | 0002 |
| 0009 | Lead intake pipeline (Supabase + Resend) + tests | done | 0008, 0018 |
| 0010 | JSON-LD builders module + tests | done | 0004, 0011, 0012 |
| 0011 | Address-gate module + tests | done | 0001 |
| 0012 | Review stats adapter (Google Places + env fallback) + tests | done | 0001 |
| 0013 | SEO infrastructure (metadata, sitemap, robots) | done | 0004, 0010 |
| 0014 | Open Graph image generation (next/og) | done | 0003, 0004 |
| 0015 | Analytics & cookie consent | done | 0001 |
| 0016 | Stock photo curation | done (placeholders + CREDITS.md scaffold) | — |
| 0017 | Pre-launch checklist & env-var setup | done (operational checklist in `docs/pre-launch-checklist.md`) | all |
| 0018 | Supabase schema migration (leads table + RLS) | done | 0001 |
| 0019 | Production launch readiness: Google indexing & OG previews | partially-done (see 0020) | 0009, 0013, 0014, 0017 |
| 0020 | Launch readiness: remaining items from 0019 | in-progress (code done; ops + validation pending) | 0019 |
| 0021 | Facebook Pixel, analytics ungating, and legal stub pages | needs-triage | 0015 |

## Suggested execution order

Foundation: **0001** → **0004** in parallel with **0002**, **0003**, **0011**, **0012**, **0016**, **0018**.

Routing & pages: **0005** → **0006** → **0008** → **0007**.

Submission pipeline: **0009** (after 0008 + 0018).

SEO surface: **0010** → **0013** → **0014**.

Observability: **0015**.

Pre-launch gate: **0017**.
