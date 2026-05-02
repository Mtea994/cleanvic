import { Section } from "@/components/ui/Section";

const REVIEWS = [
  {
    initial: "J",
    name: "James K.",
    location: "Southbank, Melbourne",
    text: "Absolutely blown away. They cleaned our 3-bedroom house in 4 hours and it looked brand new. The oven alone was worth the price — I couldn't believe how clean it got.",
  },
  {
    initial: "P",
    name: "Priya S.",
    location: "Carlton, Melbourne",
    text: "Used them for a full house clean and it was incredible — every room spotless in under 4 hours. The team were professional and friendly. Will definitely use again for my new place.",
  },
  {
    initial: "M",
    name: "Margaret H.",
    location: "Ballarat, VIC",
    text: "I'm 74 and don't move around well. The team were so respectful, careful, and thorough. They even moved furniture back exactly where it was. Absolute legends — will book every month.",
  },
  {
    initial: "T",
    name: "Tom B.",
    location: "Docklands, Melbourne",
    text: "Our office has never looked so clean. The commercial team came after hours, didn't disturb a thing, and left everything immaculate. Our staff were genuinely shocked Monday morning.",
  },
  {
    initial: "L",
    name: "Linda F.",
    location: "Geelong, VIC",
    text: "Carpet cleaning on a 1980s rental carpet — I thought it was beyond saving. They brought it back to nearly new. The kids and dog can run on it again without me cringing!",
  },
  {
    initial: "A",
    name: "Aaron D.",
    location: "Bendigo, VIC",
    text: "Same-day booking, arrived on time, finished ahead of schedule, and the price was exactly what was quoted. No nasty surprises. This is how all service companies should operate.",
  },
];

export function Testimonials() {
  return (
    <Section className="bg-navy">
      <div className="text-center mb-12">
        <span
          className="inline-block text-teal"
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Reviews
        </span>
        <h2
          className="font-display text-white"
          style={{
            fontSize: "clamp(1.7rem, 3vw, 2.5rem)",
            fontWeight: 700,
            lineHeight: 1.25,
            marginBottom: 14,
          }}
        >
          What Victoria Homeowners Say
        </h2>
        <p
          className="mx-auto"
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "1.05rem",
            maxWidth: 560,
            lineHeight: 1.7,
          }}
        >
          Real reviews from real Victorians — not paid actors, not fake profiles.
        </p>
      </div>
      <div
        className="grid gap-5 max-w-[1200px] mx-auto"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
      >
        {REVIEWS.map((r) => (
          <article
            key={r.name}
            className="bg-white/5 border border-white/10 rounded-[14px] px-[26px] py-7 transition-colors duration-200 hover:bg-white/[0.08] fade-in-up"
          >
            <div
              className="text-gold mb-3.5"
              style={{ fontSize: 15, letterSpacing: "1px" }}
              aria-label="5 out of 5 stars"
            >
              ★★★★★
            </div>
            <p
              className="text-white/80 italic mb-5"
              style={{ fontSize: 15, lineHeight: 1.7 }}
            >
              &ldquo;{r.text}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center font-extrabold flex-shrink-0"
                style={{ fontSize: 16 }}
                aria-hidden="true"
              >
                {r.initial}
              </div>
              <div>
                <div className="text-white font-bold" style={{ fontSize: 14 }}>
                  {r.name}
                </div>
                <div
                  className="text-white/45 mt-0.5"
                  style={{ fontSize: 12 }}
                >
                  {r.location}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
