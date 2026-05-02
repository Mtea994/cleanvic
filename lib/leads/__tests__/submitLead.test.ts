import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitLead, type LeadDeps } from "../submitLead";

function makeDeps(overrides: Partial<LeadDeps> = {}): LeadDeps {
  return {
    supabase: {
      insertLead: vi.fn(async () => ({ error: null })),
      countRecentLeadsByIp: vi.fn(async () => 0),
    },
    resend: {
      send: vi.fn(async () => ({ error: null })),
    },
    leadNotifyEmail: "owner@example.com",
    resendFrom: "onboarding@resend.dev",
    now: () => new Date("2026-05-02T10:00:00Z"),
    ...overrides,
  };
}

const VALID_INPUT = {
  service: "carpet-cleaning",
  name: "Jane Smith",
  phone: "0412 345 678",
  suburb: "Richmond",
  preferredDate: "2099-01-01",
  honeypot: "",
};

const CONTEXT = { ip: "1.2.3.4", userAgent: "ua" };

describe("submitLead", () => {
  let deps: LeadDeps;
  beforeEach(() => {
    deps = makeDeps();
  });

  it("persists a Supabase row and sends an email on a valid submission", async () => {
    const result = await submitLead(VALID_INPUT, CONTEXT, deps);
    expect(result.ok).toBe(true);
    expect(deps.supabase.insertLead).toHaveBeenCalledOnce();
    expect(deps.resend.send).toHaveBeenCalledOnce();
  });

  it("rejects honeypot submissions WITHOUT persisting or sending", async () => {
    const result = await submitLead(
      { ...VALID_INPUT, honeypot: "i am a bot" },
      CONTEXT,
      deps,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("honeypot");
    expect(deps.supabase.insertLead).not.toHaveBeenCalled();
    expect(deps.resend.send).not.toHaveBeenCalled();
  });

  it("rejects rate-limited submissions when the same IP has a recent lead", async () => {
    deps = makeDeps({
      supabase: {
        insertLead: vi.fn(async () => ({ error: null })),
        countRecentLeadsByIp: vi.fn(async () => 1),
      },
    });
    const result = await submitLead(VALID_INPUT, CONTEXT, deps);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("rate-limited");
    expect(deps.supabase.insertLead).not.toHaveBeenCalled();
  });

  it("rejects Zod-invalid input pre-side-effects", async () => {
    const result = await submitLead(
      { ...VALID_INPUT, service: "not-a-real-service" },
      CONTEXT,
      deps,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("validation");
    expect(deps.supabase.insertLead).not.toHaveBeenCalled();
  });

  it("rejects malformed phone numbers", async () => {
    const result = await submitLead(
      { ...VALID_INPUT, phone: "not a phone" },
      CONTEXT,
      deps,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("validation");
  });

  it("rejects past dates", async () => {
    const result = await submitLead(
      { ...VALID_INPUT, preferredDate: "1999-01-01" },
      CONTEXT,
      deps,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.kind).toBe("validation");
  });

  it("bubbles a typed error when Supabase insert fails", async () => {
    deps = makeDeps({
      supabase: {
        insertLead: vi.fn(async () => ({ error: { message: "db down" } })),
        countRecentLeadsByIp: vi.fn(async () => 0),
      },
    });
    const result = await submitLead(VALID_INPUT, CONTEXT, deps);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("supabase-error");
      if (result.error.kind === "supabase-error") {
        expect(result.error.detail).toContain("db down");
      }
    }
    expect(deps.resend.send).not.toHaveBeenCalled();
  });

  it("returns success even when Resend fails (email is best-effort)", async () => {
    deps = makeDeps({
      resend: {
        send: vi.fn(async () => ({ error: { message: "resend down" } })),
      },
    });
    const result = await submitLead(VALID_INPUT, CONTEXT, deps);
    expect(result.ok).toBe(true);
    expect(deps.supabase.insertLead).toHaveBeenCalledOnce();
  });

  it("returns success even when Resend throws", async () => {
    deps = makeDeps({
      resend: {
        send: vi.fn(async () => {
          throw new Error("network");
        }),
      },
    });
    const result = await submitLead(VALID_INPUT, CONTEXT, deps);
    expect(result.ok).toBe(true);
  });
});
