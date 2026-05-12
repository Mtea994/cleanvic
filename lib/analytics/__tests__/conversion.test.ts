import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/config/site", () => ({
  googleAdsId: "AW-TEST",
  googleAdsConversionLabel: "LABEL",
}));

import { trackLeadConversion } from "../conversion";

const LEAD = {
  email: "Jane@Example.com",
  phone: "0412 345 678",
  name: "Jane Smith",
  suburb: "Richmond 3121",
};

type AnyFn = (...args: unknown[]) => void;

describe("trackLeadConversion", () => {
  let gtag: ReturnType<typeof vi.fn>;
  let fbq: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    gtag = vi.fn();
    fbq = vi.fn();
    window.gtag = gtag as unknown as AnyFn;
    window.fbq = fbq as unknown as AnyFn;
  });

  afterEach(() => {
    delete window.gtag;
    delete window.fbq;
  });

  it("fires a Google Ads conversion with sendTo, value, currency, and a string transaction_id", () => {
    trackLeadConversion(LEAD);
    const conversionCall = gtag.mock.calls.find((c) => c[0] === "event" && c[1] === "conversion");
    expect(conversionCall).toBeDefined();
    const payload = conversionCall![2] as Record<string, unknown>;
    expect(payload.send_to).toBe("AW-TEST/LABEL");
    expect(payload.value).toBe(1);
    expect(payload.currency).toBe("AUD");
    expect(typeof payload.transaction_id).toBe("string");
    expect((payload.transaction_id as string).length).toBeGreaterThan(0);
  });

  it("passes lead PII to gtag user_data with lowercase email, digit-only phone, AU country", () => {
    trackLeadConversion(LEAD);
    const userDataCall = gtag.mock.calls.find((c) => c[0] === "set" && c[1] === "user_data");
    expect(userDataCall).toBeDefined();
    const data = userDataCall![2] as Record<string, unknown>;
    expect(data.email).toBe("jane@example.com");
    expect(data.phone_number).toBe("0412345678");
    const address = data.address as Record<string, unknown>;
    expect(address.first_name).toBe("jane");
    expect(address.postal_code).toBe("3121");
    expect(address.country).toBe("AU");
  });

  it("fires a Meta Lead event when window.fbq is present", () => {
    trackLeadConversion(LEAD);
    expect(fbq).toHaveBeenCalledWith("track", "Lead");
  });

  it("fires both Google Ads and Meta when both globals are present (the common production case)", () => {
    trackLeadConversion(LEAD);
    expect(gtag).toHaveBeenCalled();
    expect(fbq).toHaveBeenCalledWith("track", "Lead");
  });

  it("does not throw and does not call fbq when window.fbq is undefined", () => {
    delete window.fbq;
    expect(() => trackLeadConversion(LEAD)).not.toThrow();
    expect(gtag).toHaveBeenCalled();
  });

  it("does not throw and does not call gtag when window.gtag is undefined", () => {
    delete window.gtag;
    expect(() => trackLeadConversion(LEAD)).not.toThrow();
    expect(fbq).toHaveBeenCalledWith("track", "Lead");
  });
});

describe("trackLeadConversion with missing Google Ads config", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock("@/lib/config/site", () => ({
      googleAdsId: "",
      googleAdsConversionLabel: "",
    }));
  });

  afterEach(() => {
    vi.doUnmock("@/lib/config/site");
    delete window.gtag;
    delete window.fbq;
  });

  it("does not call gtag when googleAdsId is empty, but still fires Meta Lead", async () => {
    const gtag = vi.fn();
    const fbq = vi.fn();
    window.gtag = gtag as unknown as AnyFn;
    window.fbq = fbq as unknown as AnyFn;
    const mod = await import("../conversion");
    mod.trackLeadConversion(LEAD);
    expect(gtag).not.toHaveBeenCalled();
    expect(fbq).toHaveBeenCalledWith("track", "Lead");
  });
});
