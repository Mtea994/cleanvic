# 0012 — Review stats adapter (Google Places + env fallback) + tests

**Status:** done
**Type:** integration + core
**Depends on:** 0001
**Blocks:** 0010

## Problem

The visible review badge and the JSON-LD AggregateRating both need a `{ count, average }` source. v1 reads from env vars; eventually it should read from Google Places API. Both code paths exist from day one — env vars decide which is active — so the upgrade from "env-driven" to "live reviews" is a config change, not a code change.

## Acceptance criteria

- [ ] `getReviewStats(): Promise<ReviewStats | null>` exported from `lib/reviews/getReviewStats.ts`.
- [ ] When `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` are both set: fetches the Place Details endpoint, returns `{ count: rating_count, average: rating }`.
- [ ] When the API call fails (timeout, error response, missing fields): falls back to env values; never throws.
- [ ] When either API env var is unset: reads `NEXT_PUBLIC_REVIEW_COUNT` and `NEXT_PUBLIC_REVIEW_AVERAGE`; returns `{ count, average }` if both are valid numbers.
- [ ] When env vars are also unset (or non-numeric): returns `null`.
- [ ] API responses are cached via Next.js `fetch` cache with a sensible revalidation window (1 hour suggested).
- [ ] Tests cover: env fallback path (no API keys); successful API path (stubbed fetch); API failure → env fallback; all-unset → null; ISR caching behavior asserted via stubbed fetch call counts.

## Implementation notes

- Use the Place Details endpoint with fields `rating,user_ratings_total` only — keeps API usage minimal.
- Cost: Google Places "Basic Data" tier is currently free up to a generous quota; this should not exceed it for a marketing site.
- The adapter is the only call site that touches the Google Places API. Pages and JSON-LD builders consume `getReviewStats()` results, never the API directly.
- The downstream JSON-LD builder (0010) is responsible for emitting the AggregateRating schema only when stats are non-null — this adapter does not gate schema emission.

## References

- PRD §"Major modules" (Review stats adapter)
- Research §6.5 (Reviews & ratings)
