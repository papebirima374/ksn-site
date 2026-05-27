import { ImageResponse } from "next/og";

export const alt = "KSN — Kippangog Salaatu ʿAlaa Nabii";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Image Open Graph par defaut du site KSN.
 *  Apparait quand le lien racine est partage sur WhatsApp / Telegram / FB. */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0F7C55 0%, #0A3D24 50%, #082F22 100%)",
          color: "white",
          fontFamily: "serif",
          padding: 80,
          position: "relative",
        }}
      >
        {/* Decoration coin gauche-haut */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 60,
            fontSize: 24,
            letterSpacing: 8,
            color: "#D4AF37",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          Dahira KSN
        </div>

        {/* Decoration coin droit-haut : Arabic */}
        <div
          style={{
            position: "absolute",
            top: 50,
            right: 60,
            fontSize: 60,
            color: "#D4AF37",
            fontWeight: 700,
          }}
        >
          ﷺ
        </div>

        {/* Sigle */}
        <div
          style={{
            fontSize: 220,
            fontWeight: 900,
            color: "#D4AF37",
            lineHeight: 1,
            letterSpacing: -8,
            textShadow: "0 0 60px rgba(212,175,55,0.4)",
          }}
        >
          KSN
        </div>

        {/* Nom complet */}
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            marginTop: 20,
            textAlign: "center",
            color: "white",
          }}
        >
          Kippangog Salaatu ʿAlaa Nabii
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            marginTop: 18,
            color: "rgba(255,255,255,0.8)",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          Prière • Spiritualité • Rayonnement
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            display: "flex",
            alignItems: "center",
            gap: 24,
            color: "#D4AF37",
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          <span>📍 Touba, Sénégal</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>salaatualaanabii.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
