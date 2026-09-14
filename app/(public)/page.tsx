import type { Metadata } from "next";
import AppKSN from "@/components/sections/AppKSN";

export const metadata: Metadata = {
  title: "KSN — Kippangog Salaatu 'Alaa Nabii | Salaatou Alan Nabi | Dahira Touba",
  description:
    "Kippangog Salaatu Alaa Nabii (KSN) — Dahira mouride international fondé à Touba en 2021. Salaatou Alan Nabi, Salaat Ala Nabi, spiritualité islamique, événements et ressources pour la communauté.",
  keywords: [
    "Salaatu Alaa Nabii",
    "Salaatou Alan Nabi",
    "Salaat Alan Nabi",
    "Salaatoul Alan Nabi",
    "salaatualaanabii",
    "salatoualanabi",
    "Kippangog Salaatu",
    "KSN Dahira",
    "Dahira Touba",
    "mouride",
    "Cheikh Ahmadou Bamba",
    "spiritualité islamique Sénégal",
  ],
  openGraph: {
    title: "KSN — Kippangog Salaatu 'Alaa Nabii | Dahira Touba",
    description:
      "Communauté spirituelle mouride internationale — Salaatou Alan Nabi, Salaat Ala Nabi. Événements, challenge quotidien, ressources islamiques. Fondé à Touba en 2021.",
    url: "https://salaatualaanabii.com",
    images: [{ url: "/logo/ksn-logo.png", width: 800, height: 800, alt: "Logo KSN — Kippangog Salaatu Alaa Nabii" }],
  },
  alternates: { canonical: "https://salaatualaanabii.com" },
};
import CompteurSalaatu from "@/components/sections/CompteurSalaatu";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import JourneeBanner from "@/components/sections/JourneeBanner";
import LeDahira from "@/components/sections/LeDahira";
import ReseauxSociaux from "@/components/sections/ReseauxSociaux";
import Stats from "@/components/sections/Stats";

export default function Home() {
  return (
    /* L'accueil dit qui nous sommes, ce que nous comptons, ce qui vient, et
       comment nous rejoindre. Le reste a sa page dans la navigation :
         Présidence, Commissions, Organigramme → /dahira
         Témoignages                           → /notre-histoire
         Média                                 → /media
         Spiritualité                          → /spiritualite
       Les y répéter n'ajoutait rien : cela ne faisait qu'allonger la page. */
    <>
      <Hero />
      <CompteurSalaatu />
      <JourneeBanner />
      <Stats />
      <LeDahira />
      <AppKSN />
      <ReseauxSociaux />
      <Contact />
    </>
  );
}
