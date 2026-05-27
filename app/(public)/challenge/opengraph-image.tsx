import { ImageResponse } from "next/og";
import {
  estimatedChallengeStats,
  CHALLENGE_TARGET,
  fmtNumber,
  progressTowardTarget,
} from "@/lib/challenge";

export const alt = "Challenge 1 Milliard de Salaatu — KSN";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** OG image dynamique pour /challenge : montre la valeur courante du
 *  compteur. Generee a chaque request quand le crawler verifie le lien. */
export default async function Image() {
  const stats = estimatedChallengeStats();
  const percent = progressTowardTarget(stats.total);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0F7C55 0%, #0A3D24 50%, #082F22 100%)",
          color: "white",
          fontFamily: "serif",
          padding: 60,
          position: "relative",
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
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 22,
              letterSpacing: 6,
              color: "#D4AF37",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 20px #10b981",
              }}
            />
            En direct — Challenge KSN
          </div>
          <div
            style={{
              fontSize: 38,
              color: "#D4AF37",
              fontWeight: 700,
            }}
          >
            ﷺ
          </div>
        </div>

        {/* TITRE */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "white",
            marginTop: 30,
            lineHeight: 1.05,
          }}
        >
          Challenge 1 Milliard
        </div>
        <div
          style={{
            fontSize: 36,
            color: "rgba(255,255,255,0.75)",
            marginTop: 8,
            fontStyle: "italic",
          }}
        >
          Salaatu offerts au Prophète ﷺ
        </div>

        {/* COMPTEUR */}
        <div
          style={{
            marginTop: 38,
            fontSize: 140,
            fontWeight: 900,
            color: "#D4AF37",
            lineHeight: 1,
            letterSpacing: -4,
            textShadow: "0 0 80px rgba(212,175,55,0.5)",
            display: "flex",
          }}
        >
          {fmtNumber(stats.total)}
        </div>

        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.7)",
            marginTop: 10,
          }}
        >
          sur {fmtNumber(CHALLENGE_TARGET)} — {percent.toFixed(3)} %
        </div>

        {/* BARRE DE PROGRESSION */}
        <div
          style={{
            marginTop: 30,
            width: "100%",
            height: 18,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 999,
            display: "flex",
          }}
        >
          <div
            style={{
              width: `${Math.max(percent, 0.5)}%`,
              height: "100%",
              background:
                "linear-gradient(90deg, #B8860B 0%, #D4AF37 50%, #F5D76E 100%)",
              borderRadius: 999,
            }}
          />
        </div>

        {/* FOOTER */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 60,
            right: 60,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#D4AF37",
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          <span>Rejoignez le défi spirituel mondial</span>
          <span>salaatualaanabii.com/challenge</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
