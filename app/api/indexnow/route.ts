import { NextResponse } from "next/server";
import sitemap from "@/app/sitemap";
import { pingIndexNow } from "@/lib/indexnow";
import { siteUrl } from "@/lib/config/site";

export const runtime = "nodejs";
// Disable caching — this endpoint must run fresh on every deploy hook call.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.INDEXNOW_TRIGGER_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "INDEXNOW_TRIGGER_SECRET not configured" },
      { status: 500 },
    );
  }

  const auth = request.headers.get("authorization") || "";
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return NextResponse.json(
      { ok: false, error: "INDEXNOW_KEY not configured" },
      { status: 500 },
    );
  }

  const host = new URL(siteUrl).hostname;
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  const result = await pingIndexNow(urls, key, host);

  if (result.ok) {
    return NextResponse.json({
      ok: true,
      status: result.status,
      submitted: result.submitted,
    });
  }

  return NextResponse.json(
    { ok: false, status: result.status, error: result.message },
    { status: 502 },
  );
}
