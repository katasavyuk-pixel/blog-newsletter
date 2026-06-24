import { ImageResponse } from "next/og";
import { getPost } from "@/lib/posts";
import { siteConfig } from "@/config/site";

export const alt = "Artículo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori (next/og) has no access to our CSS tokens, so brand colors are literal here.
// Kata Pro (red/black): dark red→black gradient + red pill mark + tenue labels.
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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
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
            fontSize: 66,
            fontWeight: 700,
            lineHeight: 1.1,
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
            color: "#c9b6b9",
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
