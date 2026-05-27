import { ImageResponse } from "next/og";

export const alt = "Journée Salaatu ʿAlaa Nabii — 26 décembre 2026 — Touba";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Doit rester synchronise avec la date dans la page journee-salaatu/page.tsx
const EVENT_DATE_ISO = "2026-12-26T08:00:00+00:00";
const EVENT_DATE_LABEL = "26 décembre 2026";

function daysUntil(targetIso: string): number {
  const delta = new Date(targetIso).getTime() - Date.now();
  return Math.max(0, Math.ceil(delta / 86400000));
}

export default async function Image() {
  const days = daysUntil(EVENT_DATE_ISO);
  const dateStr = `📅  ${EVENT_DATE_LABEL}`;
  const daysStr = `⏳  J - ${days}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #B8860B 0%, #D4AF37 50%, #B8860B 100%)",
          color: "#0F7C55",
          fontFamily: "serif",
          padding: 60,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              color: "#0F7C55",
              fontWeight: 800,
              textTransform: "uppercase",
              background: "rgba(15,124,85,0.12)",
              padding: "10px 24px",
              borderRadius: 999,
              display: "flex",
            }}
          >
            Événement annuel — KSN
          </div>
          <div
            style={{
              fontSize: 40,
              color: "#0F7C55",
              fontWeight: 700,
              display: "flex",
            }}
          >
            ﷺ
          </div>
        </div>

        {/* TITRE */}
        <div
          style={{
            fontSize: 78,
            fontWeight: 900,
            color: "#0F7C55",
            marginTop: 40,
            lineHeight: 1,
            display: "flex",
          }}
        >
          Journée Salaatu
        </div>
        <div
          style={{
            fontSize: 78,
            fontWeight: 900,
            color: "#0F7C55",
            lineHeight: 1,
            display: "flex",
          }}
        >
          ʿAlaa Nabii
        </div>

        <div
          style={{
            fontSize: 30,
            color: "rgba(15,124,85,0.8)",
            marginTop: 16,
            fontStyle: "italic",
            display: "flex",
          }}
        >
          Une journée entière de prières sur le Prophète Muhammad ﷺ
        </div>

        {/* DATE + COMPTE A REBOURS */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 24,
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#0F7C55",
              color: "#D4AF37",
              padding: "24px 36px",
              borderRadius: 24,
              fontSize: 42,
              fontWeight: 800,
              display: "flex",
            }}
          >
            {dateStr}
          </div>
          <div
            style={{
              background: "rgba(15,124,85,0.15)",
              color: "#0F7C55",
              padding: "24px 36px",
              borderRadius: 24,
              fontSize: 36,
              fontWeight: 700,
              display: days > 0 ? "flex" : "none",
            }}
          >
            {daysStr}
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#0F7C55",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          <div style={{ display: "flex" }}>📍 Touba, Sénégal</div>
          <div style={{ display: "flex" }}>
            salaatualaanabii.com/journee-salaatu
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
