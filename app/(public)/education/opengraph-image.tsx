import { ImageResponse } from "next/og";

export const alt = "Académie KSN — Tazawwudu-ss-Sighar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** OG image dédiée à la section Éducation.
 *  Affichée quand on partage /education ou un certificat sur les réseaux. */
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
            "linear-gradient(135deg, #FAF7F0 0%, #F5F0E0 100%)",
          color: "#1A1611",
          fontFamily: "serif",
          padding: 80,
          position: "relative",
        }}
      >
        {/* Cadre or muté */}
        <div
          style={{
            position: "absolute",
            inset: 32,
            border: "3px solid #C9A961",
            borderRadius: 24,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 44,
            border: "1px solid rgba(201, 169, 97, 0.5)",
            borderRadius: 18,
            display: "flex",
          }}
        />

        {/* Étoiles d'angle */}
        {[
          { top: 64, left: 64 },
          { top: 64, right: 64 },
          { bottom: 64, left: 64 },
          { bottom: 64, right: 64 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...pos,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                border: "2px solid #C9A961",
                transform: "rotate(45deg)",
                display: "flex",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 30,
                height: 30,
                border: "2px solid #C9A961",
                display: "flex",
              }}
            />
          </div>
        ))}

        {/* Surtitre */}
        <div
          style={{
            fontSize: 22,
            letterSpacing: 8,
            color: "#C9A961",
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: 24,
            display: "flex",
          }}
        >
          Académie KSN — Tazawwud
        </div>

        {/* Titre */}
        <div
          style={{
            fontSize: 92,
            fontWeight: 900,
            color: "#064E3B",
            lineHeight: 1.05,
            textAlign: "center",
            display: "flex",
          }}
        >
          Tazawwudu-ss-Sighar
        </div>

        <div
          style={{
            fontSize: 32,
            color: "#C9A961",
            marginTop: 16,
            fontStyle: "italic",
            display: "flex",
          }}
        >
          Le Viatique des Adolescents
        </div>

        {/* Sous-titre */}
        <div
          style={{
            fontSize: 26,
            color: "#6B2E2E",
            marginTop: 32,
            textAlign: "center",
            maxWidth: 880,
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          25 leçons gratuites · Certificat délivré par la Commission Éducation
        </div>

        {/* Pied */}
        <div
          style={{
            position: "absolute",
            bottom: 90,
            fontSize: 18,
            color: "#1A1611",
            opacity: 0.6,
            display: "flex",
            gap: 12,
          }}
        >
          <span>salaatualaanabii.com/education</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
