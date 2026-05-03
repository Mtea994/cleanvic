import type { Metadata } from "next";
import { AboutHero } from "@/components/templates/AboutHero";
import {
  Section,
  SectionHead,
  SectionLabel,
  SectionTitle,
  SectionDesc,
} from "@/components/ui/Section";
import { CtaBand } from "@/components/ui/CtaBand";
import { TrustBar } from "@/components/ui/TrustBar";

export const metadata: Metadata = {
  title: "About",
  description:
    "KleanVictoria is a Melbourne-based residential and commercial cleaning company built on doing the job right, every time. Police-checked, insured, satisfaction guaranteed.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Show up, on time.",
    body: "If we say 9am, we mean 9am — and if something changes we'll tell you straight away.",
  },
  {
    title: "Do the job properly.",
    body: "No shortcuts, no surface-only cleans. We do the bits people skip because that's why you booked us.",
  },
  {
    title: "Treat your home with care.",
    body: "We test, we ask, we protect surfaces. Your space matters.",
  },
  {
    title: "Stand behind it.",
    body: "If you're not happy, we come back. 100% satisfaction guarantee, no fine print.",
  },
];

const milestones = [
  { year: "2020", body: "Founded as a small residential cleaning team in inner Melbourne." },
  { year: "2021", body: "Expanded to commercial offices, retail, and end-of-lease work." },
  { year: "2023", body: "Specialist carpet and upholstery service line introduced." },
  { year: "2025", body: "Now servicing 120 inner and middle Melbourne suburbs." },
];

const accreditations = [
  "Police-checked staff",
  "Public liability insured",
  "Workers&rsquo; compensation insured",
  "Eco-conscious products",
];

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      <TrustBar />

      <Section className="bg-white-soft">
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <SectionLabel>Our story</SectionLabel>
          <SectionTitle>Built on doing the job properly.</SectionTitle>
          <p className="text-muted" style={{ fontSize: 17, lineHeight: 1.75, marginTop: 16 }}>
            KleanVictoria started with one simple frustration: too many cleaning
            companies in Melbourne treat the work like a checkbox. We didn&rsquo;t want
            to be that. So we built a team trained to clean the bits everyone else
            skips, and a business that takes calls personally.
          </p>
          <p className="text-muted" style={{ fontSize: 17, lineHeight: 1.75, marginTop: 12 }}>
            Today we cover 120 Melbourne suburbs across inner and middle metro,
            handling everything from regular house cleans to commercial offices,
            end-of-lease deep cleans, carpet steam-cleaning, and emergency
            flood restoration. Same friendly team, same standards, every job.
          </p>
        </div>
      </Section>

      <Section>
        <SectionHead center>
          <SectionLabel>What we believe</SectionLabel>
          <SectionTitle>Four things we won&rsquo;t compromise on.</SectionTitle>
        </SectionHead>
        <ul
          className="grid gap-5 list-none p-0 m-0"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {values.map((v) => (
            <li
              key={v.title}
              className="bg-white border border-border-soft rounded-[14px]"
              style={{ padding: 24 }}
            >
              <h3
                className="font-display text-navy"
                style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 8 }}
              >
                {v.title}
              </h3>
              <p className="text-muted" style={{ fontSize: 15, lineHeight: 1.65 }}>
                {v.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="bg-offwhite">
        <SectionHead center>
          <SectionLabel>Milestones</SectionLabel>
          <SectionTitle>How we got here.</SectionTitle>
        </SectionHead>
        <ol
          className="list-none p-0 m-0 grid gap-5"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {milestones.map((m) => (
            <li
              key={m.year}
              className="bg-white border-l-4 border-teal rounded-[10px]"
              style={{ padding: "18px 22px" }}
            >
              <p
                className="font-display text-teal"
                style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 6 }}
              >
                {m.year}
              </p>
              <p className="text-text-primary" style={{ fontSize: 15, lineHeight: 1.6 }}>
                {m.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHead center>
          <SectionLabel>Accreditations</SectionLabel>
          <SectionTitle>Credentials we maintain.</SectionTitle>
        </SectionHead>
        <ul
          className="list-none p-0 m-0 flex flex-wrap items-center justify-center gap-3"
          style={{ maxWidth: 900, margin: "0 auto" }}
        >
          {accreditations.map((a) => (
            <li
              key={a}
              className="border-2 border-border-soft rounded-full font-semibold text-navy"
              style={{ padding: "10px 18px", fontSize: 14 }}
              dangerouslySetInnerHTML={{ __html: a }}
            />
          ))}
        </ul>
      </Section>

      <CtaBand
        title="Ready to work with a team that gives a damn?"
        subtitle="Get a free quote — we&rsquo;ll call you back within one business day."
      />
    </>
  );
}
