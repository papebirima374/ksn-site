import type { Metadata } from "next";
import DahiraHero from "@/components/sections/DahiraHero";
import DahiraTabs from "./DahiraTabs";

export const metadata: Metadata = {
  title: "Le Dahira",
  description:
    "Découvrez le Dahira Kippangog Salaatu 'Alaa Nabii : présidence, commissions officielles, règlement intérieur et organisation.",
};

export default function DahiraPage() {
  return (
    <>
      <DahiraHero />
      {/* Le bloc de chiffres « Une Communaute Spirituelle Internationale » a
          ete retire d'ici : il est deja sur l'accueil, a l'identique. Cette
          page repond a « comment le Dahira est-il organise » — la presidence,
          les commissions, le reglement. Les chiffres du rayonnement n'y
          repondent pas, ils la rallongent. */}
      <DahiraTabs />
    </>
  );
}
