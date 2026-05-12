"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ga4Id, isProduction } from "@/lib/config/site";

export function AnalyticsRouteChange() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (!isProduction) return;
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
    if (ga4Id) {
      window.gtag?.("event", "page_view", {
        send_to: ga4Id,
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}
