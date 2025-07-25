// components/FingerprintLoader.tsx
"use client";

import { useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export function FingerprintLoader() {
  useEffect(() => {
    async function loadFingerprint() {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const visitorId = result.visitorId;

        // Store in a non-HttpOnly cookie (accessible by JS and server)
        // Best for non-critical, client-side accessible data.
        // Middleware can read it.
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        document.cookie = `x-fp-id=${visitorId}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;

        // Option B: More complex - Send via a custom HTTP header on API calls
        // This is usually done by modifying a global fetch/axios interceptor
        // or explicitly adding the header to all relevant outgoing requests.
        // This is generally preferred for sensitive data or if you don't want it in cookies.
        // For simplicity, let's stick with the cookie for this example,
        // but remember headers are an alternative for API-specific calls.
      } catch (error) {
        console.error("Error loading FingerprintJS:", error);
      }
    }

    loadFingerprint();
  }, []); // Run once on mount

  return null; // This component doesn't render any UI
}
