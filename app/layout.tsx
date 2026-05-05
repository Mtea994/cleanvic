import type { Metadata } from "next";
import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { fontBody, fontDisplay } from "./fonts";
import { googleAdsId, siteUrl } from "@/lib/config/site";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AnnounceBar } from "@/components/layout/AnnounceBar";
import { StickyMobileCta } from "@/components/layout/StickyMobileCta";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { SiteAnalytics } from "@/components/analytics/SiteAnalytics";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { BookingModalProvider } from "@/components/booking/BookingModalProvider";
import "./globals.css";

const isProduction = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KleanVictoria · Professional Cleaning Services Melbourne",
    template: "%s · KleanVictoria",
  },
  description:
    "Melbourne's residential and commercial cleaning specialists. Carpet, house, end-of-lease, commercial, window and deep cleaning. Police-checked, insured, satisfaction guaranteed.",
  keywords: [
    "cleaning services Melbourne",
    "carpet cleaning Melbourne",
    "house cleaning Melbourne",
    "commercial cleaning Melbourne",
    "end of lease cleaning Melbourne",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "KleanVictoria",
    images: ["/og-default.png"],
  },
  twitter: { card: "summary_large_image" },
  robots: isProduction
    ? { index: true, follow: true }
    : { index: false, follow: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className={`${fontBody.variable} ${fontDisplay.variable}`}>
      <body>
        {googleAdsId && (
          <>
            <Script
              id="google-ads-loader"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
            />
            <Script id="google-ads-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAdsId}');
              `}
            </Script>
          </>
        )}
        <BookingModalProvider>
          <AnnounceBar />
          <Nav />
          {children}
          <Footer />
          <StickyMobileCta />
        </BookingModalProvider>
        <LocalBusinessJsonLd />
        <SiteAnalytics />
        <ConsentBanner />
        <VercelAnalytics />
      </body>
    </html>
  );
}
