// Single Zod schema shared by client (RHF resolver) and server (route handler)
// validation. Drift between client and server validation is impossible by
// construction.

import { z } from "zod";
import { services } from "@/lib/content/data/services";

const serviceSlugs = services.map((s) => s.slug) as [string, ...string[]];

// AU phone formats accepted: 04XX XXX XXX, +61 4XX XXX XXX, (03) XXXX XXXX,
// 03 XXXX XXXX, plus reasonable spacing/punctuation tolerance.
//
// Strategy: strip all non-digit/+ characters and validate the digits-only
// pattern. This is more robust than a single regex over the formatted input
// because users (and especially older users) format AU numbers many ways.
function isValidAuPhone(raw: string): boolean {
  const cleaned = raw.replace(/[^\d+]/g, "");
  // 10-digit local: 0[2-478]xxxxxxxx (mobile or landline)
  if (/^0[2-478]\d{8}$/.test(cleaned)) return true;
  // International with +61 prefix
  if (/^\+?61[2-478]\d{8}$/.test(cleaned)) return true;
  return false;
}

const todayIso = (): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().slice(0, 10);
};

export const leadSchema = z.object({
  service: z.enum(serviceSlugs, {
    errorMap: () => ({ message: "Please pick a service." }),
  }),
  name: z
    .string()
    .trim()
    .min(1, "Please tell us your name.")
    .max(80, "Name is a bit long — please shorten."),
  phone: z
    .string()
    .trim()
    .min(1, "Please add a phone number.")
    .refine(isValidAuPhone, {
      message: "Please use an Australian phone number.",
    }),
  suburb: z
    .string()
    .trim()
    .min(1, "Which suburb?")
    .max(80, "Suburb is too long."),
  email: z
    .string()
    .trim()
    .email("Please use a valid email address.")
    .or(z.literal(""))
    .optional(),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please pick a date.")
    .refine((d) => d >= todayIso(), { message: "Date can't be in the past." }),
  preferredTime: z.string().optional(),
  notes: z.string().trim().max(1000, "Notes are too long.").optional(),
  // Honeypot: any value is structurally valid here so it passes Zod. The
  // submitLead orchestrator inspects this field separately and rejects with
  // `kind: "honeypot"` so bots can't differentiate validation failures from
  // honeypot detection.
  honeypot: z.string().optional().default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const leadServiceOptions = services.map((s) => ({
  slug: s.slug,
  name: s.name,
}));
