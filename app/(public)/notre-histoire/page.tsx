import type { Metadata } from "next";
import NotreHistoireContent from "./NotreHistoireContent";

export const metadata: Metadata = {
  title: "Notre Histoire — Fondation 2021 à Touba",
  description:
    "L'histoire du Dahira Kippangog Salaatu ʿAlaa Nabii : de la fondation à Touba en janvier 2021 à un mouvement spirituel international rassemblant des milliers de membres autour de la Prière sur le Prophète Muhammad ﷺ.",
  openGraph: {
    title: "Notre Histoire — Dahira KSN depuis 2021",
    description:
      "Comment un cercle de fidèles à Touba est devenu un Dahira international au service de la Prière sur le Prophète Muhammad ﷺ.",
  },
};

export default function NotreHistoirePage() {
  return <NotreHistoireContent />;
}
