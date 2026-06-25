import { ImageResponse } from "next/og";
import { getPost } from "@/lib/posts";
import { siteConfig } from "@/config/site";

export const alt = "Artículo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori (next/og) has no access to our CSS tokens, so brand colors are literal here.
// "Kata Pro" red/black premium: cold black + controlled deep-red halo, crimson gem.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? siteConfig.name;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
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
              "radial-gradient(820px 480px at 82% 8%, rgba(122,22,32,0.6), transparent 60%), radial-gradient(640px 520px at 6% 98%, rgba(199,204,210,0.05), transparent 62%)",
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
            fontSize: 66,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: 28,
            color: "#d7212a",
          }}
        >
          <div
            style={{ width: 12, height: 12, borderRadius: 999, background: "#d7212a" }}
          />
          {siteConfig.tagline}
        </div>
      </div>
    ),
    size,
  );
}
