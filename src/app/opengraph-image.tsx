import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori (next/og) has no access to our CSS tokens, so brand colors are literal here.
// "Kata Pro" red/black premium: cold black + a controlled deep-red halo, crimson
// gem, chrome/silver wordmark, cold-white headline.
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
          gap: "26px",
          background: "#0a0b0d",
          padding: "80px",
          color: "#eaecee",
          fontFamily: "sans-serif",
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
              "radial-gradient(820px 480px at 80% 10%, rgba(122,22,32,0.6), transparent 60%), radial-gradient(640px 520px at 8% 96%, rgba(199,204,210,0.06), transparent 62%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(130% 130% at 50% 25%, transparent 55%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        {/* Star specks — the card is a corner of the universe (deterministic layout). */}
        {[
          [140, 90, 5],
          [420, 60, 3],
          [760, 130, 4],
          [1050, 80, 3],
          [1130, 300, 5],
          [980, 480, 3],
          [220, 520, 4],
          [80, 330, 3],
          [640, 560, 3],
          [880, 240, 3],
        ].map(([x, y, s]) => (
          <div
            key={`${x}-${y}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: 999,
              background: "#c7ccd2",
              opacity: 0.75,
            }}
          />
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 28,
            color: "#c7ccd2",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              transform: "rotate(45deg)",
              borderRadius: 4,
              background: "#d7212a",
            }}
          />
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            maxWidth: "940px",
          }}
        >
          {siteConfig.tagline}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#d7212a" }}>
          El universo de una empresa de IA construyéndose en público
        </div>
      </div>
    ),
    size,
  );
}
