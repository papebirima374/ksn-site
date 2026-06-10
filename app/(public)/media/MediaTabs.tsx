"use client";

import { FaNewspaper, FaImages, FaShareNodes, FaMobileScreen } from "react-icons/fa6";
import Media from "@/components/sections/Media";
import Gallery from "@/components/sections/Gallery";
import ReseauxSociaux from "@/components/sections/ReseauxSociaux";
import AppKSN from "@/components/sections/AppKSN";
import SectionTabs from "@/components/ui/SectionTabs";

const TABS = [
  { id: "activites", labelKey: "tabs.activites", icon: <FaNewspaper /> },
  { id: "galerie", labelKey: "tabs.galerie", icon: <FaImages /> },
  { id: "reseaux", labelKey: "tabs.reseaux", icon: <FaShareNodes /> },
  { id: "app", labelKey: "tabs.app", icon: <FaMobileScreen /> },
];

export default function MediaTabs() {
  return (
    <SectionTabs
      tabs={TABS}
      renderPanel={(id) => (
        <>
          {id === "activites" && <Media />}
          {id === "galerie" && <Gallery />}
          {id === "reseaux" && <ReseauxSociaux />}
          {id === "app" && <AppKSN />}
        </>
      )}
    />
  );
}
