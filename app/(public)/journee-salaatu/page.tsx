import type { Metadata } from "next";
import JourneeContent from "./JourneeContent";

export const metadata: Metadata = {
  title: "Journée Salaatu ʿAlaa Nabii — 26 décembre 2026",
  description:
    "Le 26 décembre 2026, la oumma KSN se réunit à Touba pour la Journée Salaatu ʿAlaa Nabii : prières, chants, conférences et dhikr collectif autour du Prophète Muhammad ﷺ.",
  openGraph: {
    title: "Journée Salaatu ʿAlaa Nabii — 26 décembre 2026 — KSN",
    description:
      "L'événement spirituel annuel du Dahira Kippangog Salaatu ʿAlaa Nabii — 26 décembre 2026, Touba.",
  },
};

export default function JourneeSalaatuPage() {
  return <JourneeContent />;
}
