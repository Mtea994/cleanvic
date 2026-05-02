import { NextResponse } from "next/server";
import { submitLead } from "@/lib/leads/submitLead";
import { supabaseLeadClient } from "@/lib/leads/supabaseClient";
import { resendLeadClient } from "@/lib/leads/resendClient";
import { leadNotifyEmail } from "@/lib/config/site";

const RESEND_FROM =
  process.env.RESEND_FROM || "KleanVictoria <onboarding@resend.dev>";

export const runtime = "nodejs";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const result = await submitLead(
    body,
    {
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || "unknown",
    },
    {
      supabase: supabaseLeadClient,
      resend: resendLeadClient,
      leadNotifyEmail,
      resendFrom: RESEND_FROM,
    },
  );

  if (result.ok) return NextResponse.json({ ok: true });

  // Honeypot rejections silently return 200 OK so bots can't differentiate
  // a successful spam submission from a rejected one.
  if (result.error.kind === "honeypot") {
    return NextResponse.json({ ok: true });
  }

  const status =
    result.error.kind === "validation"
      ? 400
      : result.error.kind === "rate-limited"
        ? 429
        : 500;
  return NextResponse.json({ ok: false, error: result.error }, { status });
}
