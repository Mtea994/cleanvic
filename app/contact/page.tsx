import type { Metadata } from "next";
import { ContactHero } from "@/components/templates/ContactHero";
import {
  Section,
  SectionLabel,
  SectionTitle,
} from "@/components/ui/Section";
import { leadNotifyEmail, phone, serviceArea } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with KleanVictoria. Phone ${phone}, email ${leadNotifyEmail}. Servicing ${serviceArea}.`,
  alternates: { canonical: "/contact" },
};

const tradingHours = [
  { day: "Monday – Friday", hours: "7am – 6pm" },
  { day: "Saturday", hours: "8am – 4pm" },
  { day: "Sunday", hours: "By appointment" },
];

export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <Section className="bg-white-soft">
        <div
          style={{ maxWidth: 720, margin: "0 auto" }}
        >
          <SectionLabel>Trading hours</SectionLabel>
          <SectionTitle>When we&rsquo;re available.</SectionTitle>
          <ul
            className="list-none p-0 m-0 flex flex-col gap-2"
            style={{ marginTop: 18 }}
          >
            {tradingHours.map((row) => (
              <li
                key={row.day}
                className="flex justify-between border-b border-border-soft"
                style={{ padding: "12px 0", fontSize: 15 }}
              >
                <span className="text-text-primary font-semibold">{row.day}</span>
                <span className="text-muted">{row.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
