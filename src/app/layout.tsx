import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { ParticleField } from "@/components/effects/particle-field";
import { IntentWizard } from "@/components/wizard/intent-wizard";
import { AssistantDock } from "@/components/assistant/assistant-dock";
import { siteConfig } from "@/config/site";
import { AdsTracking } from "@/components/analytics/ads-tracking";

// UI / cuerpo / titulares — Inter, la misma que el vídeo (brandCine.ts).
// Antes era Montserrat; se unificó el 2026-07-29 para que blog y YouTube usen
// una sola tipografía. Anton se queda para el punch, igual que en el TitleCard.
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Display punch — Anton (condensed, for the hero headline + oversized numerals).
const punch = Anton({
  subsets: ["latin"],
  variable: "--font-anton",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: `RSS · ${siteConfig.name}` }],
    },
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={siteConfig.locale}
      className={`${sans.variable} ${punch.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-bg text-fg antialiased">
        {/*
          Intro gate, before paint: a returning visitor gets a stylesheet in
          <head> that lifts the scrolly intro out of the flow before the first
          frame — no layout jump after hydration, and no six screens of cinema
          between the masthead and the content on a page they already know. It
          has to be a raw <style>, not a class flip on <html>: React owns
          `html`'s className (the font variables) and a pre-hydration mutation
          of it is a hydration mismatch. Reading a cookie server-side would do
          the same job but break the home's ISR, and `?intro` stays as the
          deliberate replay.
        */}
        <Script
          id="intro-gate"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{if(!new URLSearchParams(window.location.search).has("intro")&&window.localStorage.getItem("kata:intro-vista")){var s=document.createElement("style");s.textContent="#scrolly-intro{display:none}";document.head.appendChild(s)}}catch(e){}`,
          }}
        />
        <AdsTracking>
          <MotionProvider>
            <ParticleField />
            <IntentWizard />
            <AssistantDock />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </MotionProvider>
        </AdsTracking>
        {/* Cookieless, no-PII page analytics (Vercel is already a listed subprocessor). */}
        <Analytics />
      </body>
    </html>
  );
}
