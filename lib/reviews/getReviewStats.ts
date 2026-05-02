// Review stats adapter — single source of `{ count, average }` for the visible
// review badge and the JSON-LD AggregateRating schema.
//
// Both code paths exist from day one — env vars decide which is active.
// Upgrading from "env-driven" to "live Google reviews" is a config change,
// not a code change.

export interface ReviewStats {
  count: number;
  average: number;
}

interface GooglePlaceDetailsResponse {
  result?: {
    rating?: number;
    user_ratings_total?: number;
  };
  status?: string;
}

const REVALIDATE_SECONDS = 60 * 60; // 1 hour

function readEnvFallback(): ReviewStats | null {
  const countRaw = process.env.NEXT_PUBLIC_REVIEW_COUNT;
  const averageRaw = process.env.NEXT_PUBLIC_REVIEW_AVERAGE;
  if (!countRaw || !averageRaw) return null;
  const count = Number.parseInt(countRaw, 10);
  const average = Number.parseFloat(averageRaw);
  if (!Number.isFinite(count) || !Number.isFinite(average)) return null;
  if (count <= 0 || average <= 0) return null;
  return { count, average };
}

async function fetchGooglePlace(
  placeId: string,
  apiKey: string,
  fetcher: typeof fetch = fetch,
): Promise<ReviewStats | null> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "rating,user_ratings_total");
  url.searchParams.set("key", apiKey);
  try {
    const response = await fetcher(url.toString(), {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) return null;
    const data: GooglePlaceDetailsResponse = await response.json();
    const rating = data.result?.rating;
    const total = data.result?.user_ratings_total;
    if (typeof rating !== "number" || typeof total !== "number") return null;
    if (total <= 0) return null;
    return { count: total, average: rating };
  } catch {
    return null;
  }
}

export interface GetReviewStatsOptions {
  fetcher?: typeof fetch;
  apiKey?: string;
  placeId?: string;
}

export async function getReviewStats(
  options: GetReviewStatsOptions = {},
): Promise<ReviewStats | null> {
  const apiKey = options.apiKey ?? process.env.GOOGLE_PLACES_API_KEY;
  const placeId = options.placeId ?? process.env.GOOGLE_PLACE_ID;

  if (apiKey && placeId) {
    const live = await fetchGooglePlace(placeId, apiKey, options.fetcher);
    if (live) return live;
    // API call failed — fall through to env fallback rather than throwing.
  }

  return readEnvFallback();
}
