"use client";

import Image from "next/image";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { Button } from "@/components/ui/Button";
import { useBookingModal } from "@/components/booking/BookingModalProvider";
import type { Service } from "@/lib/content/types";

interface Pair {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  title: string;
  copy: string;
}

const pairsByService = (service: Service): Pair[] => {
  const name = service.name.toLowerCase();
  if (service.slug === "oven-cleaning") {
    return [
      {
        beforeSrc: "/images/before-after-oven-clean-1.jpg",
        afterSrc: "/images/before-after-oven-clean-2.jpg",
        beforeAlt: `Greasy oven interior before ${name}`,
        afterAlt: `Spotless oven interior after ${name}`,
        title: `Residential ${service.name} — Grease & Carbon Removal`,
        copy: `Years of baked-on grease, carbon and food residue — lifted out completely. Racks, glass and interiors brought back to factory condition with our standard ${name} process.`,
      },
      {
        beforeSrc: "/images/before-after-oven-clean-3.jpg",
        afterSrc: "/images/before-after-oven-clean-1.jpg",
        beforeAlt: `Heavily-used commercial oven before ${name}`,
        afterAlt: `Restored commercial oven after ${name}`,
        title: `Commercial ${service.name} — Deep Clean`,
        copy: `High-use Melbourne commercial kitchens cleaned overnight and ready for service the next morning. Zero disruption, maximum results.`,
      },
    ];
  }
  if (service.slug === "tile-and-grout-cleaning") {
    return [
      {
        beforeSrc: "/images/before-after-grout-1.jpg",
        afterSrc: "/images/before-after-grout-2.jpg",
        beforeAlt: `Discoloured grout before ${name}`,
        afterAlt: `Restored grout after ${name}`,
        title: `Residential ${service.name} — Stain & Mould Removal`,
        copy: `Years of soap scum, mould and ground-in stains — lifted out of the grout lines. Tiles and grout brought back to their original colour with our standard ${name} process.`,
      },
      {
        beforeSrc: "/images/before-after-grout-3.jpg",
        afterSrc: "/images/before-after-grout-4.jpg",
        beforeAlt: `High-traffic tile floor before ${name}`,
        afterAlt: `Restored tile floor after ${name}`,
        title: `Commercial ${service.name} — Deep Clean`,
        copy: `High-traffic Melbourne commercial floors cleaned overnight and ready for staff the next morning. Zero disruption, maximum results.`,
      },
    ];
  }
  return [
    {
      beforeSrc: "/images/before-after-carpet-1.jpg",
      afterSrc: "/images/before-after-carpet-2.jpg",
      beforeAlt: `Stained carpet before ${name}`,
      afterAlt: `Fresh, bright carpet after ${name}`,
      title: `Residential ${service.name} — Stain & Odour Removal`,
      copy: `Years of stains and ground-in dirt — restored completely. Fresh, bright and odour-free, treated with our standard ${name} process.`,
    },
    {
      beforeSrc: "/images/before-after-rug-1.jpg",
      afterSrc: "/images/before-after-carpet.jpg",
      beforeAlt: `Heavily soiled fibres before ${name}`,
      afterAlt: `Restored fibres after ${name}`,
      title: `Commercial ${service.name} — Deep Clean`,
      copy: `High-traffic Melbourne commercial space cleaned overnight and ready for staff the next morning. Zero disruption, maximum results.`,
    },
  ];
};

function Tile({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}

export function ServiceBeforeAfter({ service }: { service: Service }) {
  const { openModal } = useBookingModal();
  const pairs = pairsByService(service);

  return (
    <section
      style={{
        background: "var(--color-navy)",
        padding: "80px 5vw",
      }}
    >
      <div style={{ marginBottom: 48, textAlign: "center" }}>
        <span
          className="inline-block"
          style={{
            color: "var(--color-teal)",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Before &amp; After
        </span>
        <h2
          className="font-display"
          style={{
            color: "#fff",
            fontSize: "clamp(1.7rem, 3vw, 2.5rem)",
            fontWeight: 700,
            lineHeight: 1.25,
            marginBottom: 14,
          }}
        >
          See the difference we make
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "1.05rem",
            maxWidth: 560,
            lineHeight: 1.7,
            margin: "0 auto",
          }}
        >
          Drag the slider to compare real results from our{" "}
          {service.name.toLowerCase()} jobs across Victoria.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 32,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {pairs.map((p, i) => (
          <div key={i}>
            <BeforeAfter
              before={<Tile src={p.beforeSrc} alt={p.beforeAlt} />}
              after={<Tile src={p.afterSrc} alt={p.afterAlt} />}
              ariaLabel={`${service.name} before and after — ${p.title}`}
            />
            <div style={{ padding: "20px 0" }}>
              <h3
                className="font-display"
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#fff",
                  marginBottom: 8,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.6,
                }}
              >
                {p.copy}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 32,
        }}
      >
        <Button variant="primary-lg" onClick={() => openModal(service.slug)}>
          Book {service.name}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden
          >
            <path
              d="M3 9h12M10 5l5 4-5 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>
    </section>
  );
}
