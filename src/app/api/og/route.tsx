import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Dynamic Open Graph rasm — har page uchun avtomatik 1200x630 banner.
 * Foydalanish: /api/og?title=Python%20kursi&subtitle=Boshlovchilar%20uchun&type=course
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = (searchParams.get("title") || "EduCode").slice(0, 80);
  const subtitle = (searchParams.get("subtitle") || "Dasturlashni o'ynab o'rgan").slice(0, 120);
  const type = searchParams.get("type") || "default";

  // Type → rang/emoji
  const typeBadge: Record<string, { label: string; color: string; emoji: string }> = {
    course: { label: "KURS", color: "#6C5CE7", emoji: "📚" },
    challenge: { label: "TOPSHIRIQ", color: "#00D2FF", emoji: "⚡" },
    topic: { label: "MAVZU", color: "#00E676", emoji: "🎯" },
    default: { label: "EDUCODE", color: "#6C5CE7", emoji: "🚀" },
  };
  const badge = typeBadge[type] || typeBadge.default;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0a0a0f 0%, #16121f 50%, #0e0a18 100%)",
          padding: "72px",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative gradient blobs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(108,92,231,0.4), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -80,
            width: 380,
            height: 380,
            background: "radial-gradient(circle, rgba(0,210,255,0.3), transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Top: Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, fontWeight: 700 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #6C5CE7, #00D2FF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            🚀
          </div>
          <span style={{ display: "flex", color: "#fff" }}>EduCode</span>
          <span style={{ display: "flex", color: "#7a7a8a", fontWeight: 400, fontSize: 22 }}>
            · malla.uz
          </span>
        </div>

        {/* Type badge */}
        <div
          style={{
            display: "flex",
            marginTop: 80,
            padding: "10px 20px",
            background: `${badge.color}22`,
            border: `2px solid ${badge.color}55`,
            borderRadius: 999,
            color: badge.color,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
            alignSelf: "flex-start",
          }}
        >
          {badge.emoji} {badge.label}
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: title.length > 50 ? 60 : title.length > 30 ? 76 : 90,
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#ffffff",
            maxWidth: "92%",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 32,
            color: "#a0a0b0",
            maxWidth: "85%",
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>

        {/* Bottom row */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 72,
            right: 72,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#5a5a6a",
            fontSize: 22,
          }}
        >
          <span style={{ display: "flex" }}>educode.uz · interaktiv kurslar</span>
          <span style={{ display: "flex", color: "#a0a0b0" }}>
            o'zbek tilida · bepul
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
