"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CONSENT_KEY = "kv:cc:analytics";

function emitChange() {
  window.dispatchEvent(new Event("kv:consent-change"));
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored !== "granted" && stored !== "denied") {
        setVisible(true);
      }
    } catch {
      setVisible(false);
    }
  }, []);

  const setConsent = (value: "granted" | "denied") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {}
    setVisible(false);
    emitChange();
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="hidden sm:block fixed sm:bottom-6 sm:right-6 sm:w-[380px] z-[700] bg-white text-text-primary rounded-[14px] shadow-card-lg border border-border-soft"
      style={{ padding: 18 }}
    >
      <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
        We use cookies to run this site, improve your experience, and measure our
        marketing. See our{" "}
        <Link href="/privacy" className="text-teal underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="text-teal underline">
          Terms
        </Link>
        .
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 bg-teal text-white font-bold rounded-[9px]"
          style={{ minHeight: 40, fontSize: 14 }}
          onClick={() => setConsent("granted")}
        >
          Accept all
        </button>
        <button
          type="button"
          className="flex-1 border-2 border-navy text-navy font-bold rounded-[9px]"
          style={{ minHeight: 40, fontSize: 14 }}
          onClick={() => setConsent("denied")}
        >
          Essential only
        </button>
      </div>
    </div>
  );
}
