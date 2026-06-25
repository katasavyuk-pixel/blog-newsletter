import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori (next/og) has no access to our CSS tokens, so brand colors are literal here.
// "Kata Pro": espresso #15100d lit by a coral glow, cream text, coral logo mark.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "28px",
          background: "#15100d",
          padding: "80px",
          color: "#f4eee3",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            backgroundImage:
              "radial-gradient(900px 520px at 78% 12%, rgba(216,68,43,0.45), transparent 60%), radial-gradient(700px 600px at 12% 95%, rgba(226,162,74,0.22), transparent 62%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 30,
            color: "#cdbfa9",
            fontFamily: "monospace",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#d8442b",
            }}
          />
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: "920px",
          }}
        >
          {siteConfig.tagline}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#e8896f" }}>
          Blog + newsletter sobre IA
        </div>
      </div>
    ),
    size,
  );
}
