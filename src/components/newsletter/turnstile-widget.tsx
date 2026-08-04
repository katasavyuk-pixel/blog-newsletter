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
      {/* The site has no light mode — a light widget would be a bright slab in the form. */}
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme="dark" />
    </div>
  );
}
