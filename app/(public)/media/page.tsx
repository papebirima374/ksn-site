import type { Metadata } from "next";
import MediaHero from "./MediaHero";
import Media from "@/components/sections/Media";
import Gallery from "@/components/sections/Gallery";
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
      <MediaHero />

      <Media />
      <Gallery />
      <ReseauxSociaux />
      <AppKSN />
    </>
  );
}
