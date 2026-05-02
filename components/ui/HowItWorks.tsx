import {
  Section,
  SectionHead,
  SectionLabel,
  SectionTitle,
  SectionDesc,
} from "@/components/ui/Section";

const STEPS = [
  {
    num: "01",
    title: "Choose Your Service",
    body: "Select from our full range of cleaning services — carpet, bond, commercial, window, oven, upholstery, and more. Get an instant quote online.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 13h8M9 9h8M9 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Pick a Date & Time",
    body: "Choose any date that suits you — including same-day and weekend slots. We work around your schedule, not the other way around.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <rect x="4" y="6" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 6V3M17 6V3M4 11h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "We Clean, You Relax",
    body: "Our fully insured, background-checked professionals arrive on time and leave your space sparkling clean — backed by our 100% satisfaction guarantee.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <path
          d="M5 13l6 6 10-10"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHead center>
        <SectionLabel>How It Works</SectionLabel>
        <SectionTitle>Book Your Clean in 3 Simple Steps</SectionTitle>
        <SectionDesc center>
          No hassle, no hidden fees. Just pick a service, tell us your details,
          and we&apos;ll handle the rest.
        </SectionDesc>
      </SectionHead>
      <div
        className="grid gap-8 max-w-[1200px] mx-auto"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
      >
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="relative bg-white border border-border-soft rounded-[14px] px-7 py-9 transition-[transform,box-shadow] duration-200 hover:-translate-y-[2px] hover:shadow-card fade-in-up"
          >
            <div
              className="font-display text-teal absolute top-6 right-7 leading-none"
              style={{ fontSize: "3.5rem", fontWeight: 700, opacity: 0.18 }}
            >
              {step.num}
            </div>
            <div className="w-[52px] h-[52px] bg-navy text-teal rounded-[12px] flex items-center justify-center mb-5">
              {step.icon}
            </div>
            <h3 className="text-[1.1rem] font-extrabold mb-2.5 text-navy">
              {step.title}
            </h3>
            <p className="text-muted text-[15px] leading-[1.65]">{step.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
