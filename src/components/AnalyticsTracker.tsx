"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function getOrCreateSessionId(): string {
  try {
    const key = "analytics_sid";
    let sid = sessionStorage.getItem(key);
    if (!sid) {
      // Generate a random session ID
      sid = Array.from(crypto.getRandomValues(new Uint8Array(12)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      sessionStorage.setItem(key, sid);
    }
    return sid;
  } catch {
    return "";
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    const sessionId = getOrCreateSessionId();
    const referrer = document.referrer || "direct";

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathname, referrer, sessionId }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
