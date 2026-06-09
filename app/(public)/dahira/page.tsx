import type { Metadata } from "next";
import DahiraHero from "@/components/sections/DahiraHero";
import Commissions from "@/components/sections/Commissions";
import LeDahira from "@/components/sections/LeDahira";
import Presidence from "@/components/sections/Presidence";
import Stats from "@/components/sections/Stats";
import MotDuPresident from "@/components/sections/MotDuPresident";
import OrganigrammeBureau from "@/components/sections/OrganigrammeBureau";
import DocumentsTelechargement from "@/components/sections/DocumentsTelechargement";

export const metadata: Metadata = {
  title: "Le Dahira",
  description:
    "Découvrez le Dahira Kippangog Salaatu 'Alaa Nabii : présidence, commissions officielles, règlement intérieur et organisation.",
};

export default function DahiraPage() {
  return (
    <>
      <DahiraHero />

      <Presidence />
      <MotDuPresident />
      <LeDahira />
      <OrganigrammeBureau />
      <Commissions />
      <DocumentsTelechargement />
      <Stats />
    </>
  );
}
