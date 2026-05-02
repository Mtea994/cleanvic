import { ImageResponse } from "next/og";
import { businessName } from "@/lib/config/site";
import { getLocation, getService } from "@/lib/content";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "default";
  const serviceSlug = searchParams.get("service");
  const locationSlug = searchParams.get("location");

  let eyebrow = "Cleaning Services Melbourne";
  let title = `${businessName}`;

  if (type === "service" && serviceSlug) {
    const s = getService(serviceSlug);
    if (s) {
      eyebrow = "Melbourne · Professional cleaning";
      title = `${s.name}`;
    }
  } else if (type === "location" && locationSlug) {
    const l = getLocation(locationSlug);
    if (l) {
      eyebrow = `${l.region} Melbourne · ${l.postcode}`;
      title = `Cleaning in ${l.name}`;
    }
  } else if (type === "combo" && serviceSlug && locationSlug) {
    const s = getService(serviceSlug);
    const l = getLocation(locationSlug);
    if (s && l) {
      eyebrow = `${l.region} Melbourne · ${l.postcode}`;
      title = `${s.name} in ${l.name}`;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0d1b2e 0%, #162540 100%)",
          color: "white",
          padding: 80,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#0d1b2e",
              border: "3px solid #4e92da",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#4e92da",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            ☻
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontSize: 32, fontWeight: 700 }}>
              Clean<span style={{ color: "#4e92da", fontStyle: "italic" }}>Victoria</span>
            </span>
            <span
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginTop: 6,
              }}
            >
              Victoria, Australia
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "#4e92da",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 1000,
            }}
          >
            {title}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "rgba(255,255,255,0.7)",
            fontSize: 22,
          }}
        >
          <span>Police-checked · Insured · Satisfaction guaranteed</span>
          <span style={{ color: "#4e92da", fontWeight: 700 }}>kleanvictoria.com.au</span>
        </div>
      </div>
    ),
    SIZE,
  );
}
