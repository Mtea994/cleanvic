import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  Section,
  SectionHead,
  SectionLabel,
  SectionTitle,
} from "@/components/ui/Section";
import { CtaBand } from "@/components/ui/CtaBand";
import { contactEmail } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How KleanVictoria collects, uses, and protects information about visitors and customers of our Melbourne cleaning services.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    label: "Section 1",
    title: "Information We Collect",
    body: "We collect information you provide directly through our booking and contact forms — typically your name, contact details, suburb, and any service-specific notes. We also collect basic technical information about your visit (browser type, pages viewed, referring site) through our analytics tools.",
  },
  {
    label: "Section 2",
    title: "How We Use Your Information",
    body: "We use your information to respond to enquiries, prepare quotes, schedule and deliver cleaning services, send service-related communications, and improve our website. We do not sell your personal information.",
  },
  {
    label: "Section 3",
    title: "Cookies, Analytics & Marketing Pixels",
    body: "Our site uses cookies and similar technologies for analytics (Google Analytics, Microsoft Clarity), advertising attribution (Google Ads, Meta Pixel), and to make the site work. These tools may set cookies in your browser and share aggregate information about site usage with their respective providers.",
  },
  {
    label: "Section 4",
    title: "Sharing & Third Parties",
    body: "We share information only with service providers necessary to run our business: our hosting platform, email delivery service, analytics providers, and advertising platforms. We require these providers to handle your information securely and only for the purposes we engage them for.",
  },
  {
    label: "Section 5",
    title: "Your Rights",
    body: "Under the Australian Privacy Principles, you may request access to the personal information we hold about you, request correction of inaccurate information, or request deletion where applicable. Contact us using the details below to make such a request.",
  },
  {
    label: "Section 6",
    title: "Contact Us",
    body: `For privacy enquiries or to exercise any of the rights above, contact us at ${contactEmail}. We respond to privacy requests within a reasonable timeframe.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section
        className="hero-navy"
        style={{ padding: "60px 5vw 40px" }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
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
            Privacy Policy
          </h1>
          <p
            className="text-white/75"
            style={{ marginTop: 12, fontSize: "1.05rem", maxWidth: 640 }}
          >
            How we collect, use, and protect information about visitors and
            customers of KleanVictoria.
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
        title="Questions about your information?"
        subtitle="Reach out and we'll get back to you within one business day."
      />
    </>
  );
}
