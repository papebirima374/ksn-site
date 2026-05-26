import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import Commissions from "@/components/sections/Commissions";
import LeDahira from "@/components/sections/LeDahira";
import Presidence from "@/components/sections/Presidence";
import Stats from "@/components/sections/Stats";

export const metadata: Metadata = {
  title: "Le Dahira",
  description:
    "Découvrez le Dahira Kippangog Salaatu 'Alaa Nabii : présidence, commissions officielles, règlement intérieur et organisation.",
};

export default function DahiraPage() {
  return (
    <>
      <PageHero
        overline="Organisation Spirituelle"
        title="Le Dahira KSN"
        arabic="كيبانغوغ صلاة على النبي"
        description="Découvrez la présidence, les commissions officielles, le règlement intérieur et toute l'organisation du Dahira Kippangog Salaatu 'Alaa Nabii."
      />

      <Presidence />
      <LeDahira />
      <Commissions />
      <Stats />
    </>
  );
}
