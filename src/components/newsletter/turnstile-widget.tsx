"use client";

import Script from "next/script";

/** Cloudflare Turnstile widget. The script auto-renders elements with class
 * `cf-turnstile` and injects a hidden `cf-turnstile-response` input the form reads. */
export function TurnstileWidget({ siteKey }: { siteKey: string }) {
  return (
    <div>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme="light" />
    </div>
  );
}
