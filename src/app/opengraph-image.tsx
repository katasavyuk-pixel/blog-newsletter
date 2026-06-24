import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori (next/og) has no access to our CSS tokens, so brand colors are literal here.
// Kata Pro (red/black): dark red→black gradient + red pill mark + tenue labels.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "28px",
          background:
            "linear-gradient(135deg, #4a1019 0%, #1e0509 55%, #070205 100%)",
          padding: "80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 30,
            color: "#c9b6b9",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #f0323c, #8e1a22)",
            }}
          />
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: "900px",
          }}
        >
          {siteConfig.tagline}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#c9b6b9" }}>
          Blog + newsletter sobre IA
        </div>
      </div>
    ),
    size,
  );
}
