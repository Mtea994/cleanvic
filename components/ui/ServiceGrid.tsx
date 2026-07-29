"use client";

import Link from "next/link";
import Image from "next/image";
import type { Service } from "@/lib/content/types";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { useBookingModal } from "@/components/booking/BookingModalProvider";

interface ServiceGridProps {
  services: Service[];
  locationSlug?: string;
  cta?: string;
  /** When true, clicking a card opens the booking modal instead of navigating. */
  openModal?: boolean;
}

const TAGS: Record<string, string> = {
  "carpet-cleaning": "Most Popular",
  "upholstery-cleaning": "Sofa & Fabric",
  "mattress-cleaning": "Health & Hygiene",
  "rug-cleaning": "Delicate Fabrics",
  "tile-and-grout-cleaning": "Bathroom & Kitchen",
  "deep-cleaning": "Intensive",
  "end-of-lease-cleaning": "Bond Back",
  "chimney-cleaning": "Wood Heaters & Fireplaces",
  "emergency-flood-restoration": "Emergency",
  "house-cleaning": "Regular & One-off",
  "commercial-cleaning": "Business",
  "window-cleaning": "Interior & Exterior",
  "oven-cleaning": "Kitchen",
};

const IMG_LABELS: Record<string, string> = {
  "carpet-cleaning": "carpet / rug photo",
  "upholstery-cleaning": "sofa upholstery close-up",
  "mattress-cleaning": "mattress steam cleaning",
  "rug-cleaning": "persian or wool rug",
  "tile-and-grout-cleaning": "tile grout before/after",
  "deep-cleaning": "clean empty house interior",
  "end-of-lease-cleaning": "bond-back end of lease clean",
  "chimney-cleaning": "chimney sweep at work",
  "emergency-flood-restoration": "flood restoration cleanup",
  "house-cleaning": "clean modern living room",
  "commercial-cleaning": "modern office interior",
  "window-cleaning": "sparkling clean windows",
  "oven-cleaning": "clean oven interior",
};

export function ServiceGrid({
  services,
  locationSlug,
  cta = "Learn more",
  openModal = false,
}: ServiceGridProps) {
  const { openModal: openBooking } = useBookingModal();

  return (
    <ul
      className="grid gap-5 list-none p-0 m-0"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
    >
      {services.map((s) => {
        const tag = TAGS[s.slug];
        const imgLabel = IMG_LABELS[s.slug] ?? s.name.toLowerCase();
        const cardClass =
          "group relative flex flex-col bg-white rounded-[14px] border border-border-soft overflow-hidden cursor-pointer transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-card-lg fade-in-up";

        const href = locationSlug ? `/${s.slug}-${locationSlug}` : `/${s.slug}`;

        const arrow = (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

        return (
          <li key={s.slug} className={cardClass}>
            <div className="relative h-[160px] bg-navy2 flex items-center justify-center overflow-hidden">
              {s.heroImage ? (
                <Image
                  src={s.heroImage}
                  alt={s.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <ServiceIcon
                  name={s.iconName}
                  className="text-teal opacity-35"
                  size={80}
                />
              )}
              <div
                className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-5 text-[12px] font-bold uppercase tracking-[0.05em] text-white/90 z-10"
                style={{
                  background:
                    "linear-gradient(to top, rgba(13,27,46,0.85), transparent)",
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
              >
                {imgLabel}
              </div>
            </div>
            <div className="px-[22px] pt-[22px] pb-[26px] flex-1 flex flex-col">
              {tag && (
                <span className="inline-block self-start bg-teal-lt text-teal text-[11px] font-extrabold tracking-[0.08em] uppercase px-[10px] py-[3px] rounded-full mb-[10px]">
                  {tag}
                </span>
              )}
              <h3 className="text-[1.05rem] font-extrabold text-navy mb-2">
                <Link
                  href={href}
                  aria-label={s.name}
                  className="after:content-[''] after:absolute after:inset-0 after:z-[1] focus:outline-none focus-visible:underline"
                >
                  {s.name}
                </Link>
              </h3>
              <p className="text-muted text-[14px] leading-[1.6] mb-4">
                {s.shortDescription}
              </p>
              {openModal ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openBooking(s.slug);
                  }}
                  className="relative z-[2] self-start inline-flex items-center gap-[6px] text-teal text-[14px] font-bold transition-[gap] duration-150 group-hover:gap-[10px] mt-auto bg-transparent border-0 p-0 cursor-pointer hover:brightness-110"
                  aria-label={`Book ${s.name}`}
                >
                  {cta}
                  {arrow}
                </button>
              ) : (
                <span className="inline-flex items-center gap-[6px] text-teal text-[14px] font-bold transition-[gap] duration-150 group-hover:gap-[10px] mt-auto">
                  {cta}
                  {arrow}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
