import type { Metadata } from "next";
import ChallengeContent from "./ChallengeContent";

export const metadata: Metadata = {
  title: "Challenge 1 Milliard de Salaatu — Compteur Live KSN",
  description:
    "Rejoignez le défi spirituel mondial du Dahira KSN : offrir un milliard de prières (Salaatu) au Prophète Muhammad ﷺ. Suivez le compteur communautaire en direct, contribuez depuis l'app KSN.",
  openGraph: {
    title: "Challenge 1 Milliard de Salaatu — Dahira KSN International",
    description:
      "Suivez en direct le compteur mondial des prières sur le Prophète ﷺ offertes par la communauté KSN à travers les cinq continents. Rejoignez le défi.",
  },
};

export default function ChallengePage() {
  return <ChallengeContent />;
}
