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
  async redirects() {
    return [
      // Short link for YouTube descriptions / pinned comments.
      {
        source: "/yt",
        destination: "/recursos?utm_source=youtube",
        permanent: false,
      },
      // Redesign "El Universo": the library route became /sistemas.
      {
        source: "/biblioteca",
        destination: "/sistemas",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
