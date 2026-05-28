import AppKSN from "@/components/sections/AppKSN";
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
