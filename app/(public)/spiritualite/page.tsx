import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import Spiritualite from "@/components/sections/Spiritualite";
import SalaatouDuJour from "@/components/sections/SalaatouDuJour";
import SalaatuLibrary from "@/components/sections/SalaatuLibrary";

export const metadata: Metadata = {
  title: "Spiritualité",
  description:
    "Salaatou du jour, Bibliothèque des Salaats avec leurs bienfaits et secrets, Khassidas, Azkâr, et ressources spirituelles du Dahira KSN.",
};

export default function SpiritualitePage() {
  return (
    <>
      <PageHero
        overline="Spiritualité KSN"
        title="Nourrir le Cœur par le Salaatu ﷺ"
        arabic="صلى الله على محمد"
        description="Salaatou du jour, bibliothèque sacrée des Salaats, Khassidas, invocations et enseignements pour vivre pleinement votre lien avec le Prophète Muhammad ﷺ."
      />

      <SalaatouDuJour />
      <SalaatuLibrary />
      <Spiritualite />
    </>
  );
}
