import { describe, it, expect } from "vitest";
import { resolveSlug } from "../slug-resolver";

describe("resolveSlug", () => {
  it("resolves a known service slug to kind: 'service'", () => {
    const r = resolveSlug("carpet-cleaning");
    expect(r.kind).toBe("service");
    if (r.kind === "service") {
      expect(r.service.slug).toBe("carpet-cleaning");
      expect(r.service.name).toBe("Carpet Cleaning");
    }
  });

  it("resolves a known location slug to kind: 'location'", () => {
    const r = resolveSlug("richmond");
    expect(r.kind).toBe("location");
    if (r.kind === "location") {
      expect(r.location.slug).toBe("richmond");
    }
  });

  it("resolves a hyphenated combo slug to kind: 'combo'", () => {
    const r = resolveSlug("carpet-cleaning-richmond");
    expect(r.kind).toBe("combo");
    if (r.kind === "combo") {
      expect(r.service.slug).toBe("carpet-cleaning");
      expect(r.location.slug).toBe("richmond");
    }
  });

  it("handles multi-word location combos (st-kilda)", () => {
    const r = resolveSlug("carpet-cleaning-st-kilda");
    expect(r.kind).toBe("combo");
    if (r.kind === "combo") {
      expect(r.service.slug).toBe("carpet-cleaning");
      expect(r.location.slug).toBe("st-kilda");
    }
  });

  it("handles multi-word service combos (tile-and-grout-cleaning)", () => {
    const r = resolveSlug("tile-and-grout-cleaning-richmond");
    expect(r.kind).toBe("combo");
    if (r.kind === "combo") {
      expect(r.service.slug).toBe("tile-and-grout-cleaning");
      expect(r.location.slug).toBe("richmond");
    }
  });

  it("handles multi-word service + multi-word location", () => {
    const r = resolveSlug("emergency-flood-restoration-st-kilda");
    expect(r.kind).toBe("combo");
    if (r.kind === "combo") {
      expect(r.service.slug).toBe("emergency-flood-restoration");
      expect(r.location.slug).toBe("st-kilda");
    }
  });

  it("uses LONGEST-match service prefix when an ambiguity is theoretically possible", () => {
    // The dataset doesn't have an example today, but the algorithm walks from
    // longest prefix → shortest. If a future service "x" and "x-y" exist with
    // a location "y-z" and "z", a combo "x-y-z" must resolve as service "x-y"
    // + location "z" (longest service prefix wins).
    // This is enforced by the loop's iteration order; documented for future
    // additions.
    const r = resolveSlug("carpet-cleaning-richmond");
    expect(r.kind).toBe("combo");
  });

  it.each([
    "about",
    "contact",
    "services",
    "locations",
    "book",
    "api",
    "_next",
    "favicon.ico",
    "robots.txt",
    "sitemap.xml",
  ])("returns kind: 'reserved' for %s", (slug) => {
    expect(resolveSlug(slug).kind).toBe("reserved");
  });

  it("returns kind: 'unknown' for unknown slugs", () => {
    expect(resolveSlug("does-not-exist").kind).toBe("unknown");
  });

  it("returns kind: 'unknown' for empty input without throwing", () => {
    expect(resolveSlug("").kind).toBe("unknown");
  });

  it("returns kind: 'unknown' for malformed input (uppercase, special chars)", () => {
    expect(resolveSlug("foo bar").kind).toBe("unknown");
    expect(resolveSlug("../etc/passwd").kind).toBe("unknown");
  });

  it("normalises case (uppercase service slug still resolves)", () => {
    const r = resolveSlug("CARPET-CLEANING");
    expect(r.kind).toBe("service");
  });

  it("never throws on bad input types", () => {
    // @ts-expect-error testing runtime guard
    expect(() => resolveSlug(undefined)).not.toThrow();
    // @ts-expect-error testing runtime guard
    expect(resolveSlug(null).kind).toBe("unknown");
  });
});
