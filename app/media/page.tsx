import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import Media from "@/components/sections/Media";
import ReseauxSociaux from "@/components/sections/ReseauxSociaux";
import AppKSN from "@/components/sections/AppKSN";

export const metadata: Metadata = {
  title: "Média",
  description:
    "Galerie photos, vidéos, conférences, événements et publications officielles du Dahira KSN.",
};

export default function MediaPage() {
  return (
    <>
      <PageHero
        overline="Média KSN"
        title="Activités du Dahira & Vie Communautaire"
        description="Galerie photos, vidéos, conférences, rassemblements et moments forts de Kippangog Salaatu 'Alaa Nabii."
      />

      <Media />
      <ReseauxSociaux />
      <AppKSN />
    </>
  );
}
