"use client";

import Script from "next/script";

/**
 * Cloudflare Turnstile widget. The script auto-renders elements with class
 * `cf-turnstile` and injects a hidden `cf-turnstile-response` input the form reads.
 *
 * `afterInteractive`, not `lazyOnload`: with the secret configured the server now
 * *requires* a token, so the window between the form being usable and the widget
 * being ready is a window in which a signup fails. lazyOnload waits for the load
 * event, which on a page with a scrollytelling widget and web fonts is long
 * enough to matter. The form also refuses to submit without a token rather than
 * sending a request that is certain to be rejected — see subscribe-form.
 */
export function TurnstileWidget({ siteKey }: { siteKey: string }) {
  return (
    <div>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      {/* The site has no light mode — a light widget would be a bright slab in the form. */}
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme="dark" />
    </div>
  );
}
