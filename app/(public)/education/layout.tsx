import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Éducation Islamique — Tazawwud-ss-Sighar",
  description:
    "Académie spirituelle KSN — Tazawwud-ss-Sighar de Cheikh Ahmadou Bamba. Modules, leçons et certifications pour approfondir votre connaissance islamique.",
  openGraph: {
    title: "Éducation Islamique — KSN",
    description:
      "Parcours d'apprentissage spirituel basé sur l'œuvre de Cheikh Ahmadou Bamba. Modules progressifs, certifications, audio multilingue.",
    url: "https://salaatualaanabii.com/education",
    images: [{ url: "/logo/ksn-logo.png", width: 800, height: 800, alt: "KSN" }],
  },
  alternates: { canonical: "https://salaatualaanabii.com/education" },
};

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
