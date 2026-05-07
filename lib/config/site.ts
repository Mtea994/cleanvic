export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://kleanvictoria.com.au";

export const businessName = "KleanVictoria";

export const phone = process.env.NEXT_PUBLIC_PHONE || "0460 777 982";

export const phoneTel = `tel:${phone.replace(/[^0-9+]/g, "")}`;

export const leadNotifyEmail =
  process.env.LEAD_NOTIFY_EMAIL || "imtinankhurshid007@gmail.com";

export const address = {
  street: process.env.NEXT_PUBLIC_ADDRESS_STREET || "123 Placeholder St",
  suburb: process.env.NEXT_PUBLIC_ADDRESS_SUBURB || "Melbourne",
  postcode: process.env.NEXT_PUBLIC_ADDRESS_POSTCODE || "3000",
  region: process.env.NEXT_PUBLIC_ADDRESS_REGION || "VIC",
  country: "AU",
};

export const abn = process.env.NEXT_PUBLIC_ABN || "00 000 000 000";

export const ga4Id = process.env.NEXT_PUBLIC_GA4_ID || "";
export const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID || "";
export const googleAdsId =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-18136121377";

// Melbourne CBD geo coordinates for LocalBusiness schema.
export const businessGeo = { lat: -37.8136, lng: 144.9631 };

export const serviceArea = "Greater Melbourne";

export const isProduction = process.env.VERCEL_ENV === "production";
