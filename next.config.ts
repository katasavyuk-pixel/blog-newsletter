import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Whitelist only your own / EU-hosted image origins when needed (Fase 1).
    // Example: { protocol: "https", hostname: "images.tudominio.com" }
    remotePatterns: [],
  },
  experimental: {
    // Native View Transitions API for app-like navigation (React 19.2 <ViewTransition>).
    viewTransition: true,
  },
};

export default nextConfig;
