import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";

const MAX_TITLE = 100;

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("title") ?? siteConfig.name;
  const title = raw.slice(0, MAX_TITLE);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1c1c1c 60%, #2e2e2e 100%)",
          padding: "70px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={siteConfig.logo.url}
            alt={siteConfig.brandName}
            width={72}
            height={72}
            style={{ borderRadius: 16 }}
          />
          <div style={{ color: "#d4d4d4", fontSize: 30, fontWeight: 600 }}>
            {siteConfig.brandName}
          </div>
        </div>
        <div
          style={{
            color: "white",
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", color: "#cbd5e1", fontSize: 28 }}>
          {`${siteConfig.domain} · ${siteConfig.tagline}`}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
