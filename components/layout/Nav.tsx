"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button, ButtonLink } from "@/components/ui/Button";
import { phone, phoneTel } from "@/lib/config/site";
import { useBookingModal } from "@/components/booking/BookingModalProvider";

export function Nav() {
  const [open, setOpen] = useState(false);
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
          <li><Link href="/services" className="text-text-primary px-3.5 py-2 rounded-lg font-semibold hover:bg-offwhite hover:text-teal">Services</Link></li>
          <li><Link href="/locations" className="text-text-primary px-3.5 py-2 rounded-lg font-semibold hover:bg-offwhite hover:text-teal">Locations</Link></li>
          <li><Link href="/about" className="text-text-primary px-3.5 py-2 rounded-lg font-semibold hover:bg-offwhite hover:text-teal">About</Link></li>
          <li><Link href="/contact" className="text-text-primary px-3.5 py-2 rounded-lg font-semibold hover:bg-offwhite hover:text-teal">Contact</Link></li>
        </ul>
        <div className="hidden md:flex items-center gap-3">
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
      {open && <MobileNav onClose={() => setOpen(false)} onBook={() => { setOpen(false); openModal(); }} />}
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

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3 2.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.42 1l.4 1.2a1.5 1.5 0 0 1-.34 1.6l-.7.7a8 8 0 0 0 3.22 3.22l.7-.7a1.5 1.5 0 0 1 1.6-.34l1.2.4a1.5 1.5 0 0 1 1 1.42v1a1.5 1.5 0 0 1-1.5 1.5A10.5 10.5 0 0 1 3 2.5Z" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}
