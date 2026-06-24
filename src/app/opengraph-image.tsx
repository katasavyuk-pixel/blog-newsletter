import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori (next/og) has no access to our CSS tokens, so brand colors are literal here.
// Atardecer Coral: sunset gradient (orange → magenta → wine) + cream/peach accents.
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
            "linear-gradient(135deg, #fb923c 0%, #e11d48 55%, #7a1238 100%)",
          padding: "80px",
          color: "#fff7f4",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 30,
            color: "#ffe0d2",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #fb7185, #7a1238)",
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
        <div style={{ display: "flex", fontSize: 28, color: "#ffc9b0" }}>
          Blog + newsletter sobre IA
        </div>
      </div>
    ),
    size,
  );
}
