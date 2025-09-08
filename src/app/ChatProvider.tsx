"use client";

import { useEffect } from "react";

export default function ChatProvider() {
  useEffect(() => {
    import("@n8n/chat").then(({ createChat }) => {
      createChat({
        webhookUrl: "YOUR_PRODUCTION_WEBHOOK_URL", // replace with your webhook
      });
    });
  }, []);

  return null; // no UI, just initializes chat
}
