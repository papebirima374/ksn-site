import type { Metadata } from "next";
import AppKSN from "@/components/sections/AppKSN";

export const metadata: Metadata = {
  title: "KSN — Kippangog Salaatu 'Alaa Nabii",
  description:
    "Rejoignez le Dahira KSN, communauté spirituelle internationale dédiée au Salaatu sur le Prophète Muhammad ﷺ. Fondé à Touba en 2021, dans la tradition mouride.",
  openGraph: {
    title: "KSN — Kippangog Salaatu 'Alaa Nabii",
    description:
      "Communauté spirituelle internationale au service du Salaatu sur le Prophète ﷺ. Événements, ressources islamiques, challenge quotidien.",
    url: "https://salaatualaanabii.com",
    images: [{ url: "/logo/ksn-logo.png", width: 800, height: 800, alt: "Logo KSN" }],
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
