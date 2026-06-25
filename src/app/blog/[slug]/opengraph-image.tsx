import { ImageResponse } from "next/og";
import { getPost } from "@/lib/posts";
import { siteConfig } from "@/config/site";

export const alt = "Artículo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori (next/og) has no access to our CSS tokens, so brand colors are literal here.
// "Kata Pro": espresso #15100d lit by a coral glow, cream text, coral logo mark.
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
              "radial-gradient(900px 520px at 80% 10%, rgba(216,68,43,0.45), transparent 60%), radial-gradient(700px 600px at 10% 98%, rgba(226,162,74,0.2), transparent 62%)",
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
            fontSize: 66,
            fontWeight: 500,
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
            color: "#e8896f",
          }}
        >
          <div
            style={{ width: 12, height: 12, borderRadius: 999, background: "#d8442b" }}
          />
          {siteConfig.tagline}
        </div>
      </div>
    ),
    size,
  );
}
