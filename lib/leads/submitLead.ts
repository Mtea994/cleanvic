// Lead intake pipeline. Single orchestration function:
//   Zod validate → honeypot check → IP rate-limit → Supabase insert → Resend send
//
// Errors are typed as a discriminated union so callers (the route handler and
// tests) can handle each case explicitly.

import { leadSchema, type LeadInput } from "./schema";

export type LeadError =
  | { kind: "validation"; detail: string }
  | { kind: "honeypot" }
  | { kind: "rate-limited" }
  | { kind: "supabase-error"; detail: string }
  | { kind: "unknown"; detail: string };

export type LeadResult =
  | { ok: true }
  | { ok: false; error: LeadError };

export interface LeadDeps {
  supabase: SupabaseClientLike;
  resend: ResendClientLike;
  leadNotifyEmail: string;
  resendFrom: string;
  now?: () => Date;
}

export interface LeadContext {
  ip: string;
  userAgent: string;
}

export interface SupabaseInsertRow {
  service: string;
  name: string;
  phone: string;
  email?: string;
  suburb: string;
  preferred_date: string;
  preferred_time?: string;
  notes?: string;
  submitted_ip: string;
  submitted_user_agent: string;
}

export interface SupabaseClientLike {
  insertLead(row: SupabaseInsertRow): Promise<{ error: { message: string } | null }>;
  countRecentLeadsByIp(ip: string, sinceIso: string): Promise<number>;
}

export interface ResendClientLike {
  send(input: {
    from: string;
    to: string;
    subject: string;
    text: string;
  }): Promise<{ error: { message: string } | null }>;
}

const RATE_LIMIT_WINDOW_SECONDS = 60;

function buildEmailBody(input: LeadInput, context: LeadContext, now: Date): string {
  return [
    `New quote request — KleanVictoria`,
    ``,
    `Service: ${input.service}`,
    `Name: ${input.name}`,
    `Phone: ${input.phone} (tap to call: tel:${input.phone.replace(/[^0-9+]/g, "")})`,
    `Email: ${input.email || "Not provided"}`,
    `Suburb: ${input.suburb}`,
    `Preferred date: ${input.preferredDate}`,
    `Preferred time: ${input.preferredTime || "Not specified"}`,
    `Notes: ${input.notes || "No additional notes"}`,
    ``,
    `Submitted: ${now.toISOString()}`,
    `IP: ${context.ip}`,
    `User agent: ${context.userAgent}`,
  ].join("\n");
}

export async function submitLead(
  rawInput: unknown,
  context: LeadContext,
  deps: LeadDeps,
): Promise<LeadResult> {
  // 1. Zod validation
  const parsed = leadSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        kind: "validation",
        detail: parsed.error.issues.map((i) => i.message).join("; "),
      },
    };
  }
  const input = parsed.data;

  // 2. Honeypot
  if (input.honeypot && input.honeypot.length > 0) {
    return { ok: false, error: { kind: "honeypot" } };
  }

  const now = deps.now?.() ?? new Date();

  // 3. Rate-limit
  const sinceIso = new Date(now.getTime() - RATE_LIMIT_WINDOW_SECONDS * 1000).toISOString();
  try {
    const recent = await deps.supabase.countRecentLeadsByIp(context.ip, sinceIso);
    if (recent > 0) {
      return { ok: false, error: { kind: "rate-limited" } };
    }
  } catch (err) {
    return {
      ok: false,
      error: {
        kind: "supabase-error",
        detail: err instanceof Error ? err.message : "rate-limit query failed",
      },
    };
  }

  // 4. Supabase insert
  const insertResult = await deps.supabase.insertLead({
    service: input.service,
    name: input.name,
    phone: input.phone,
    email: input.email,
    suburb: input.suburb,
    preferred_date: input.preferredDate,
    preferred_time: input.preferredTime,
    notes: input.notes,
    submitted_ip: context.ip,
    submitted_user_agent: context.userAgent,
  });
  if (insertResult.error) {
    return {
      ok: false,
      error: { kind: "supabase-error", detail: insertResult.error.message },
    };
  }

  // 5. Resend send (best-effort; failures logged but do not bubble — the lead
  //    is already persisted, email is secondary).
  try {
    const emailResult = await deps.resend.send({
      from: deps.resendFrom,
      to: deps.leadNotifyEmail,
      subject: `New quote request — ${input.service} — ${input.suburb}`,
      text: buildEmailBody(input, context, now),
    });
    if (emailResult.error) {
      console.error("[lead] Resend send failed:", emailResult.error.message);
    }
  } catch (err) {
    console.error(
      "[lead] Resend send threw:",
      err instanceof Error ? err.message : String(err),
    );
  }

  return { ok: true };
}
