import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import LiensCommissions from "./LiensCommissions";

export const metadata: Metadata = {
  title: "Liens des commissions — Assemblée Générale",
  // Page de travail du secrétariat : elle regroupe tous les liens de rapport,
  // elle n'a pas vocation a etre indexee.
  robots: { index: false, follow: false },
};

export default function CommissionsPage() {
  return (
    <>
      <PageHero
        overline="Assemblée Générale du 19 septembre 2026"
        title="Rapports des commissions"
        salaatuCalligraphy
        description="Un lien par commission, à envoyer à son responsable. Chaque commission y dépose son compte rendu, son bilan de Salaatu et ses propositions pour la prochaine Journée Salaatu 'Alaa Nabii."
      />
      <LiensCommissions />
    </>
  );
}
