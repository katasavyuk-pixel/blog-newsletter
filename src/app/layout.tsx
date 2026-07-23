import type { Metadata } from "next";
import { Montserrat, Anton } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { ParticleField } from "@/components/effects/particle-field";
import { Nova } from "@/components/nova/nova";
import { siteConfig } from "@/config/site";
import { getUniversePulse } from "@/lib/universe";

// UI / body / headings — Montserrat (weight hierarchy 400–800).
const sans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
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
        <MotionProvider>
          <ParticleField />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Nova pulse={getUniversePulse()} />
        </MotionProvider>
        {/* Cookieless, no-PII page analytics (Vercel is already a listed subprocessor). */}
        <Analytics />
      </body>
    </html>
  );
}
