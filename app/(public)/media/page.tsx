import type { Metadata } from "next";
import MediaHero from "./MediaHero";
import MediaTabs from "./MediaTabs";

export const metadata: Metadata = {
  title: "Média",
  description:
    "Galerie photos, vidéos, conférences, événements et publications officielles du Dahira KSN.",
};

export default function MediaPage() {
  return (
    <>
      <MediaHero />
      <MediaTabs />
    </>
  );
}
