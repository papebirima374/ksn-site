import type { Metadata } from "next";
import FaqContent from "./FaqContent";
import { TRANSLATIONS } from "@/lib/i18n/translations";

export const metadata: Metadata = {
  title: "FAQ — Questions fréquentes sur le Dahira KSN",
  description:
    "Réponses aux questions les plus fréquentes sur le Dahira Kippangog Salaatu ʿAlaa Nabii : adhésion, Challenge 1 Milliard, Journée Salaatu, application mobile, dons, paiements et engagement spirituel.",
  openGraph: {
    title: "FAQ — Dahira KSN",
    description:
      "Tout ce qu'il faut savoir avant de rejoindre la communauté KSN.",
  },
};

/* ── Donnees structurees pour les moteurs de recherche ────────────────
   Google lit ce bloc JSON-LD pour afficher les questions directement dans
   ses resultats. Il doit etre rendu par le SERVEUR — le moteur ne joue pas
   le JavaScript de la page.

   Ces memes questions etaient recopiees ici EN DUR, en francais, a cote de
   celles que le visiteur lit. Deux copies d'un meme texte ne restent pas
   longtemps d'accord : elles avaient deja diverge (« approx. 2h » d'un cote,
   « environ 2h » de l'autre), et corriger une reponse visible laissait Google
   annoncer l'ancienne. On les lit donc a la source, dans les traductions
   francaises — une seule redaction, deux usages.

   Le francais et non la langue du visiteur : une page sert un seul jeu de
   donnees structurees, et le francais est la langue de reference du site. */
const CATEGORIES = 6;
const QUESTIONS_PAR_CATEGORIE = 6;

function questionsFaq(): { q: string; a: string }[] {
  const fr = TRANSLATIONS.fr;
  const sortie: { q: string; a: string }[] = [];
  for (let c = 1; c <= CATEGORIES; c++) {
    for (let i = 1; i <= QUESTIONS_PAR_CATEGORIE; i++) {
      const q = fr[`faq.q${c}_${i}`];
      const a = fr[`faq.a${c}_${i}`];
      // Les categories n'ont pas toutes le meme nombre de questions : on
      // s'arrete a la premiere absente plutot que de supposer une grille
      // pleine. Une question ajoutee demain entre ici toute seule.
      if (!q || !a) break;
      sortie.push({ q, a });
    }
  }
  return sortie;
}

export default function FAQPage() {
  const allQuestions = questionsFaq();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allQuestions.map((qa) => ({
      "@type": "Question",
      name: qa.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqContent />
    </>
  );
}
