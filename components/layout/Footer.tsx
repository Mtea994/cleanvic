import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import {
  abn,
  address,
  businessName,
  leadNotifyEmail,
  phone,
  phoneTel,
  serviceArea,
} from "@/lib/config/site";
import { getAllServices } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();
  const services = getAllServices().slice(0, 8);

  return (
    <footer
      className="bg-navy text-white"
      style={{ padding: "64px 5vw 28px" }}
    >
      <div
        className="grid gap-10"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div>
          <div style={{ filter: "brightness(0) invert(1)", marginBottom: 12 }}>
            <Logo variant="lockup" />
          </div>
          <p
            className="text-white/70"
            style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 280 }}
          >
            Melbourne&rsquo;s residential &amp; commercial cleaning specialists.
            Police-checked, insured, satisfaction guaranteed.
          </p>
        </div>

        <div>
          <h3
            className="font-display"
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Services
          </h3>
          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/${s.slug}`}
                  className="text-white/80 hover:text-white"
                  style={{ fontSize: 14 }}
                >
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/services"
                className="text-teal hover:text-white"
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                See all services →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3
            className="font-display"
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Resources
          </h3>
          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            <li><Link href="/about" className="text-white/80 hover:text-white" style={{ fontSize: 14 }}>About us</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-white" style={{ fontSize: 14 }}>Contact</Link></li>
            <li><Link href="/locations" className="text-white/80 hover:text-white" style={{ fontSize: 14 }}>Service areas</Link></li>
            <li><Link href="/services" className="text-white/80 hover:text-white" style={{ fontSize: 14 }}>All services</Link></li>
          </ul>
        </div>

        <div>
          <h3
            className="font-display"
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Contact
          </h3>
          <ul
            className="flex flex-col gap-2 list-none p-0 m-0 text-white/80"
            style={{ fontSize: 14 }}
          >
            <li>
              <a href={phoneTel} className="hover:text-white">{phone}</a>
            </li>
            <li>
              <a href={`mailto:${leadNotifyEmail}`} className="hover:text-white">
                {leadNotifyEmail}
              </a>
            </li>
            <li>{serviceArea}</li>
            <li className="text-white/60" style={{ fontSize: 13, marginTop: 6 }}>
              {address.street}, {address.suburb} {address.region} {address.postcode}
            </li>
            <li className="text-white/60" style={{ fontSize: 13 }}>
              ABN {abn}
            </li>
          </ul>
        </div>
      </div>

      <div
        className="border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ marginTop: 40, paddingTop: 24, fontSize: 13 }}
      >
        <p className="text-white/60">
          © {year} {businessName}. All rights reserved.
        </p>
        <ul className="flex gap-5 list-none p-0 m-0">
          <li><Link href="/about" className="text-white/60 hover:text-white">About</Link></li>
          <li><Link href="/contact" className="text-white/60 hover:text-white">Contact</Link></li>
        </ul>
      </div>
    </footer>
  );
}
