"use client";

import { googleAdsConversionLabel, googleAdsId } from "@/lib/config/site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

interface LeadConversionPayload {
  email?: string;
  phone?: string;
  name?: string;
  suburb?: string;
}

export function trackLeadConversion(lead: LeadConversionPayload) {
  if (typeof window === "undefined") return;

  if (window.gtag && googleAdsId && googleAdsConversionLabel) {
    const sendTo = `${googleAdsId}/${googleAdsConversionLabel}`;

    const firstName = lead.name?.trim().split(/\s+/)[0]?.toLowerCase();
    const postcode = lead.suburb?.match(/\d{4}/)?.[0];

    if (lead.email || lead.phone || firstName || postcode) {
      window.gtag("set", "user_data", {
        email: lead.email?.trim().toLowerCase() || undefined,
        phone_number: lead.phone?.replace(/[^\d+]/g, "") || undefined,
        address:
          firstName || postcode
            ? {
              first_name: firstName,
              postal_code: postcode,
              country: "AU",
            }
            : undefined,
      });
    }

    window.gtag("event", "conversion", {
      send_to: sendTo,
      value: 1,
      currency: "AUD",
      transaction_id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    });
  }

  window.fbq?.("track", "Lead");
}
