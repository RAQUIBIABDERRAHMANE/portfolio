"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    // Don't track admin or API pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    // Avoid double-tracking same path
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    const referrer = document.referrer || "direct";

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathname, referrer }),
      // Use keepalive so it completes even if user navigates away
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
