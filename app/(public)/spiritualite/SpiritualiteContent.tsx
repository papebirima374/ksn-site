"use client";

import PageHero from "@/components/layout/PageHero";
import SalaatouDuJour from "@/components/sections/SalaatouDuJour";
import SalaatuLibrary from "@/components/sections/SalaatuLibrary";
import Spiritualite from "@/components/sections/Spiritualite";
import { useT } from "@/lib/i18n/context";

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

      <SalaatouDuJour />
      <SalaatuLibrary />
      <Spiritualite />
    </>
  );
}
