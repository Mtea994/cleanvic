"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { clarityId, ga4Id } from "@/lib/config/site";

const CONSENT_KEY = "kv:cc:analytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function SiteAnalytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const update = () => {
      try {
        setConsented(localStorage.getItem(CONSENT_KEY) === "granted");
      } catch {
        setConsented(false);
      }
    };
    update();
    const handler = () => update();
    window.addEventListener("kv:consent-change", handler);
    return () => window.removeEventListener("kv:consent-change", handler);
  }, []);

  if (!consented) return null;

  return (
    <>
      {ga4Id && (
        <>
          <Script
            id="ga4-loader"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${ga4Id}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
      {clarityId && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}
    </>
  );
}
