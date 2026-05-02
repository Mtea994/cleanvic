import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getReviewStats } from "../getReviewStats";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  delete process.env.NEXT_PUBLIC_REVIEW_COUNT;
  delete process.env.NEXT_PUBLIC_REVIEW_AVERAGE;
  delete process.env.GOOGLE_PLACES_API_KEY;
  delete process.env.GOOGLE_PLACE_ID;
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("getReviewStats", () => {
  it("returns env-fallback values when no API keys are set", async () => {
    process.env.NEXT_PUBLIC_REVIEW_COUNT = "620";
    process.env.NEXT_PUBLIC_REVIEW_AVERAGE = "4.9";
    const stats = await getReviewStats();
    expect(stats).toEqual({ count: 620, average: 4.9 });
  });

  it("returns null when nothing is configured", async () => {
    const stats = await getReviewStats();
    expect(stats).toBeNull();
  });

  it("returns null when env values are non-numeric", async () => {
    process.env.NEXT_PUBLIC_REVIEW_COUNT = "abc";
    process.env.NEXT_PUBLIC_REVIEW_AVERAGE = "xyz";
    expect(await getReviewStats()).toBeNull();
  });

  it("calls Google Places when API keys are set and returns live values", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ result: { rating: 4.7, user_ratings_total: 142 } }),
    } as unknown as Response);

    const stats = await getReviewStats({
      fetcher: fetcher as unknown as typeof fetch,
      apiKey: "fake-key",
      placeId: "fake-place-id",
    });
    expect(stats).toEqual({ count: 142, average: 4.7 });
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it("falls back to env values when the API call fails", async () => {
    process.env.NEXT_PUBLIC_REVIEW_COUNT = "100";
    process.env.NEXT_PUBLIC_REVIEW_AVERAGE = "4.5";
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as unknown as Response);

    const stats = await getReviewStats({
      fetcher: fetcher as unknown as typeof fetch,
      apiKey: "fake-key",
      placeId: "fake-place-id",
    });
    expect(stats).toEqual({ count: 100, average: 4.5 });
  });

  it("does not throw when fetch rejects", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("network down"));
    const stats = await getReviewStats({
      fetcher: fetcher as unknown as typeof fetch,
      apiKey: "fake-key",
      placeId: "fake-place-id",
    });
    expect(stats).toBeNull();
  });

  it("ignores live response with malformed fields and falls back to env", async () => {
    process.env.NEXT_PUBLIC_REVIEW_COUNT = "50";
    process.env.NEXT_PUBLIC_REVIEW_AVERAGE = "4.2";
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: "OK", result: {} }),
    } as unknown as Response);
    const stats = await getReviewStats({
      fetcher: fetcher as unknown as typeof fetch,
      apiKey: "fake-key",
      placeId: "fake-place-id",
    });
    expect(stats).toEqual({ count: 50, average: 4.2 });
  });
});
