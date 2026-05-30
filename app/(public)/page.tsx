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
import Commissions from "@/components/sections/Commissions";
import CompteurSalaatu from "@/components/sections/CompteurSalaatu";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import JourneeBanner from "@/components/sections/JourneeBanner";
import LeDahira from "@/components/sections/LeDahira";
import Media from "@/components/sections/Media";
import Presidence from "@/components/sections/Presidence";
import ReseauxSociaux from "@/components/sections/ReseauxSociaux";
import Spiritualite from "@/components/sections/Spiritualite";
import Stats from "@/components/sections/Stats";
import Temoignages from "@/components/sections/Temoignages";

export default function Home() {
  return (
    <>
      <Hero />
      <CompteurSalaatu />
      <JourneeBanner />
      <Stats />
      <Presidence />
      <LeDahira />
      <Commissions />
      <Temoignages />
      <Media />
      <AppKSN />
      <ReseauxSociaux />
      <Contact />
      <Spiritualite />
    </>
  );
}
