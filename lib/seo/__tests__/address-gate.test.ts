import { describe, it, expect } from "vitest";
import { PLACEHOLDER_VALUES, shouldEmitAddress, isPlaceholderAbn } from "../address-gate";

describe("shouldEmitAddress", () => {
  const REAL = {
    street: "42 Smith Street",
    suburb: "Richmond",
    postcode: "3121",
    region: "VIC",
  } as const;

  it("returns true when every field is real and region is not the placeholder VIC fallback", () => {
    // The placeholder for `region` is the literal string "VIC" — to test the
    // happy path, we pass a region that is exact-string-different.
    expect(
      shouldEmitAddress({ ...REAL, region: "Victoria" }),
    ).toBe(true);
  });

  it("returns false when ALL fields match placeholders", () => {
    expect(
      shouldEmitAddress({
        street: PLACEHOLDER_VALUES.street,
        suburb: PLACEHOLDER_VALUES.suburb,
        postcode: PLACEHOLDER_VALUES.postcode,
        region: PLACEHOLDER_VALUES.region,
      }),
    ).toBe(false);
  });

  it("returns false when only the street is placeholder (partial-real)", () => {
    expect(
      shouldEmitAddress({
        ...REAL,
        region: "Victoria",
        street: PLACEHOLDER_VALUES.street,
      }),
    ).toBe(false);
  });

  it("returns false when only the postcode is placeholder", () => {
    expect(
      shouldEmitAddress({
        ...REAL,
        region: "Victoria",
        postcode: PLACEHOLDER_VALUES.postcode,
      }),
    ).toBe(false);
  });

  it("returns false when only the suburb is placeholder", () => {
    expect(
      shouldEmitAddress({
        ...REAL,
        region: "Victoria",
        suburb: PLACEHOLDER_VALUES.suburb,
      }),
    ).toBe(false);
  });

  it("returns false when any field is empty", () => {
    expect(shouldEmitAddress({ ...REAL, region: "" })).toBe(false);
    expect(shouldEmitAddress({ ...REAL, suburb: "" })).toBe(false);
  });

  it("uses exact-string match — case differences in real values are accepted", () => {
    expect(
      shouldEmitAddress({
        street: "42 SMITH STREET",
        suburb: "richmond",
        postcode: "3121",
        region: "Victoria",
      }),
    ).toBe(true);
  });
});

describe("isPlaceholderAbn", () => {
  it("detects the placeholder ABN", () => {
    expect(isPlaceholderAbn(PLACEHOLDER_VALUES.abn)).toBe(true);
  });

  it("treats empty as placeholder", () => {
    expect(isPlaceholderAbn("")).toBe(true);
  });

  it("treats real ABN as non-placeholder", () => {
    expect(isPlaceholderAbn("12 345 678 901")).toBe(false);
  });
});
