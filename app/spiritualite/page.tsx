import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import Spiritualite from "@/components/sections/Spiritualite";
import SalaatouDuJour from "@/components/sections/SalaatouDuJour";

export const metadata: Metadata = {
  title: "Spiritualité",
  description:
    "Salaatou du jour, Khassidas, Azkâr, invocations, audios et vidéos spirituelles du Dahira KSN.",
};

export default function SpiritualitePage() {
  return (
    <>
      <PageHero
        overline="Spiritualité KSN"
        title="Nourrir le Cœur par le Salaatu ﷺ"
        arabic="صلى الله على محمد"
        description="Salaatou du jour, Khassidas, invocations, enseignements et ressources spirituelles pour vivre pleinement votre lien avec le Prophète Muhammad ﷺ."
      />

      <SalaatouDuJour />
      <Spiritualite />
    </>
  );
}
