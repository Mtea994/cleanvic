import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  Section,
  SectionHead,
  SectionLabel,
  SectionTitle,
} from "@/components/ui/Section";
import { CtaBand } from "@/components/ui/CtaBand";
import { businessName, contactEmail } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using the KleanVictoria website and engaging our Melbourne cleaning services.",
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    label: "Section 1",
    title: "Use of This Site",
    body: `By using this website you agree to these terms. The content on this site is provided for general information about ${businessName} and our cleaning services. You may not use the site for any unlawful purpose or in any way that could damage or impair its operation.`,
  },
  {
    label: "Section 2",
    title: "Bookings & Quotes",
    body: "Quotes provided through our booking forms or by phone are estimates based on the information you provide. Final pricing may be adjusted on the day of service if the scope of work materially differs from what was described. We confirm bookings in writing or by phone before scheduling work.",
  },
  {
    label: "Section 3",
    title: "Cancellations",
    body: "We ask for at least 24 hours' notice for cancellations or rescheduling. Cancellations made with less notice may incur a fee to cover allocated time and travel. End-of-lease and same-day bookings have specific cancellation terms that we will confirm at the time of booking.",
  },
  {
    label: "Section 4",
    title: "Liability & Disclaimers",
    body: "We carry public liability and workers' compensation insurance. While we take every reasonable care, our liability for any loss or damage is limited to the cost of the service provided, except where Australian Consumer Law provides otherwise. Pre-existing damage and items not disclosed at booking are excluded.",
  },
  {
    label: "Section 5",
    title: "Governing Law",
    body: "These terms are governed by the laws of the State of Victoria, Australia. Any disputes arising in connection with these terms or our services are subject to the exclusive jurisdiction of the courts of Victoria.",
  },
  {
    label: "Section 6",
    title: "Contact Us",
    body: `Questions about these terms? Contact us at ${contactEmail} and we'll respond within one business day.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <section
        className="hero-navy"
        style={{ padding: "60px 5vw 40px" }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]}
          />
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginTop: 18,
              color: "#fff",
            }}
          >
            Terms &amp; Conditions
          </h1>
          <p
            className="text-white/75"
            style={{ marginTop: 12, fontSize: "1.05rem", maxWidth: 640 }}
          >
            The terms that apply when you use this site and engage our cleaning
            services.
          </p>
        </div>
      </section>

      <Section className="bg-white-soft">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {sections.map((s) => (
            <div key={s.title} style={{ marginBottom: 40 }}>
              <SectionHead>
                <SectionLabel>{s.label}</SectionLabel>
                <SectionTitle>{s.title}</SectionTitle>
              </SectionHead>
              <p
                className="text-text-primary"
                style={{ fontSize: 16, lineHeight: 1.75 }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Ready to book a clean?"
        subtitle="Get a free quote — we'll call you back within one business day."
      />
    </>
  );
}
