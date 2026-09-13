import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import ReglementContent from "./ReglementContent";
import { ADOPTION } from "@/lib/reglement";

export const metadata: Metadata = {
  title: "Règlement Intérieur & Statuts Officiels",
  description:
    "Règlement Intérieur et Statuts Officiels du Dahira Kippaangog Salaatu 'Alaa Nabii, adoptés à Touba le 11 mai 2025 : objet, organisation, instances, membres, cotisations, discipline et dispositions financières.",
  alternates: { canonical: "https://salaatualaanabii.com/reglement-interieur" },
};

export default function ReglementPage() {
  return (
    <>
      <PageHero
        overline={`Adopté à ${ADOPTION.lieu} — ${ADOPTION.date}`}
        title="Règlement Intérieur & Statuts"
        salaatuCalligraphy
        description="Le texte officiel qui régit le Dahira Kippaangog Salaatu 'Alaa Nabii : son objet, son organisation, ses instances, les droits et devoirs de ses membres."
      />
      <ReglementContent />
    </>
  );
}
