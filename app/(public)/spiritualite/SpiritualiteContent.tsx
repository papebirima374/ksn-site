"use client";

import PageHero from "@/components/layout/PageHero";
import SalaatouDuJour from "@/components/sections/SalaatouDuJour";
import SalaatuLibrary from "@/components/sections/SalaatuLibrary";
import Spiritualite from "@/components/sections/Spiritualite";

// Spiritualité is a public page. Visitors browse freely; the SalaatuLibrary
// component handles partial access on its own (2 first Salaats unlocked,
// the rest locked with the "Devenir membre actif" modal).
export default function SpiritualiteContent() {
  return (
    <>
      <PageHero
        overline="Spiritualité KSN"
        title="Nourrir le Cœur par le Salaatu ﷺ"
        arabic="صلى الله عليه وسلم"
        description="Salaatou du jour, bibliothèque sacrée des Salaats, Khassidas, invocations et enseignements pour vivre pleinement votre lien avec le Prophète Muhammad ﷺ."
      />

      <SalaatouDuJour />
      <SalaatuLibrary />
      <Spiritualite />
    </>
  );
}
