import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Whitelist only your own / EU-hosted image origins when needed (Fase 1).
    // Example: { protocol: "https", hostname: "images.tudominio.com" }
    // i.ytimg.com: YouTube video thumbnails for the "Construir de cero" strip.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  experimental: {
    // Native View Transitions API for app-like navigation (React 19.2 <ViewTransition>).
    viewTransition: true,
  },
};

export default nextConfig;
