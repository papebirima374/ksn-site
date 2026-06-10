"use client";

import { FaSun, FaBookOpen, FaCompass } from "react-icons/fa6";
import PageHero from "@/components/layout/PageHero";
import SalaatouDuJour from "@/components/sections/SalaatouDuJour";
import SalaatuLibrary from "@/components/sections/SalaatuLibrary";
import Spiritualite from "@/components/sections/Spiritualite";
import SectionTabs from "@/components/ui/SectionTabs";
import { useT } from "@/lib/i18n/context";

const TABS = [
  { id: "jour", labelKey: "tabs.jour", icon: <FaSun /> },
  { id: "bibliotheque", labelKey: "tabs.bibliotheque", icon: <FaBookOpen /> },
  { id: "ressources", labelKey: "tabs.ressources", icon: <FaCompass /> },
];

// Spiritualité is a public page. Visitors browse freely; the SalaatuLibrary
// component handles partial access on its own (2 first Salaats unlocked,
// the rest locked with the "Devenir membre actif" modal).
export default function SpiritualiteContent() {
  const { t } = useT();

  return (
    <>
      <PageHero
        overline={t("spiritualite.page_overline")}
        title={t("spiritualite.page_title")}
        arabic="صلى الله عليه وسلم"
        description={t("spiritualite.page_desc")}
      />

      <SectionTabs
        tabs={TABS}
        renderPanel={(id) => (
          <>
            {id === "jour" && <SalaatouDuJour />}
            {id === "bibliotheque" && <SalaatuLibrary />}
            {id === "ressources" && <Spiritualite />}
          </>
        )}
      />
    </>
  );
}
