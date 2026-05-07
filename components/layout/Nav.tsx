"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button, ButtonLink } from "@/components/ui/Button";
import { phone, phoneTel } from "@/lib/config/site";
import { useBookingModal } from "@/components/booking/BookingModalProvider";
import { getAllServices } from "@/lib/content";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

const navServices = getAllServices();

export function Nav() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { openModal } = useBookingModal();

  return (
    <>
      <nav
        className="sticky top-0 z-[900] border-b border-border-soft"
        style={{
          background: "rgba(250,252,253,0.96)",
          backdropFilter: "blur(12px)",
          padding: "0 5vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 70,
          gap: 24,
        }}
      >
        <Link href="/" aria-label="KleanVictoria home" className="flex items-center gap-3">
          <Logo variant="lockup" />
        </Link>

        <ul
          className="hidden md:flex items-center gap-1.5 list-none"
          aria-label="Primary"
        >
          {/* Services — hover dropdown */}
          <li
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className="text-text-primary px-3.5 py-2 rounded-lg font-semibold hover:bg-offwhite hover:text-teal flex items-center gap-1.5 transition-colors h-[44px]"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              Services
              <ChevronDownIcon open={servicesOpen} />
            </button>

            {servicesOpen && (
              <div className="absolute top-full left-0 z-50 pt-2 min-w-[210px]">
              <div
                className="bg-white-soft border border-border-soft rounded-[14px] py-2"
                style={{ boxShadow: "0 12px 48px rgb(13 27 46 / 0.16)" }}
              >
                {navServices.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    className="block px-4 py-[9px] text-[14px] font-semibold text-text-primary hover:bg-offwhite hover:text-teal transition-colors"
                    onClick={() => setServicesOpen(false)}
                  >
                    {s.name}
                  </Link>
                ))}
                <div className="mx-3 mt-1 pt-2 border-t border-border-soft">
                  <Link
                    href="/services"
                    className="flex items-center gap-1 px-1 py-1.5 text-[13px] font-bold text-teal hover:text-teal/80 transition-colors"
                    onClick={() => setServicesOpen(false)}
                  >
                    View all services →
                  </Link>
                </div>
              </div>
              </div>
            )}
          </li>

          <li><Link href="/locations" className="text-text-primary px-3.5 py-2 rounded-lg font-semibold hover:bg-offwhite hover:text-teal">Locations</Link></li>
          <li><Link href="/about" className="text-text-primary px-3.5 py-2 rounded-lg font-semibold hover:bg-offwhite hover:text-teal">About</Link></li>
          <li><Link href="/contact" className="text-text-primary px-3.5 py-2 rounded-lg font-semibold hover:bg-offwhite hover:text-teal">Contact</Link></li>
        </ul>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <ButtonLink variant="phone" href={phoneTel}>
            <PhoneIcon /> {phone}
          </ButtonLink>
          <Button variant="primary" onClick={() => openModal()}>
            Get a free quote
          </Button>
        </div>

        <button
          aria-label="Open navigation"
          aria-expanded={open}
          className="md:hidden flex flex-col gap-[5px] bg-transparent p-2 text-navy"
          onClick={() => setOpen(true)}
        >
          <span className="block w-6 h-[2.5px] bg-current rounded" />
          <span className="block w-6 h-[2.5px] bg-current rounded" />
          <span className="block w-6 h-[2.5px] bg-current rounded" />
        </button>
      </nav>

      {open && (
        <MobileNav
          onClose={() => setOpen(false)}
          onBook={() => { setOpen(false); openModal(); }}
        />
      )}
    </>
  );
}

function MobileNav({ onClose, onBook }: { onClose: () => void; onBook: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[950] flex flex-col items-center justify-center gap-5"
      style={{ background: "rgba(13,27,46,0.97)" }}
      role="dialog"
      aria-modal="true"
    >
      <button
        aria-label="Close navigation"
        className="absolute top-5 right-5 bg-transparent text-white text-3xl"
        onClick={onClose}
      >
        ×
      </button>
      <Link href="/services" onClick={onClose} className="text-white text-2xl font-bold p-2">Services</Link>
      <Link href="/locations" onClick={onClose} className="text-white text-2xl font-bold p-2">Locations</Link>
      <Link href="/about" onClick={onClose} className="text-white text-2xl font-bold p-2">About</Link>
      <Link href="/contact" onClick={onClose} className="text-white text-2xl font-bold p-2">Contact</Link>
      <Button variant="primary-lg" onClick={onBook}>Get a free quote</Button>
    </div>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M2.5 4.5l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
