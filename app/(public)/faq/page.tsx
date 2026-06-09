import type { Metadata } from "next";
import FaqContent from "./FaqContent";

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

const FAQ_CATEGORIES_SEO = [
  {
    title: "Le Dahira KSN",
    questions: [
      {
        q: "Qu'est-ce que le Dahira Kippangog Salaatu ʿAlaa Nabii ?",
        a: `Le Dahira KSN est une organisation religieuse à but non lucratif fondée le 2 janvier 2021 à Touba, Sénégal. Sa mission est de promouvoir la prière sur le Prophète Muhammad ﷺ (Salaatu) à travers une communauté internationale structurée, des activités spirituelles régulières et un engagement collectif quotidien.`,
      },
      {
        q: "Qui peut rejoindre le Dahira KSN ?",
        a: `Toute personne aimant le Prophète Muhammad ﷺ peut rejoindre, quel que soit son pays, sa langue ou son origine. L'adhésion est ouverte aux musulmans du monde entier qui souhaitent multiplier les Salaatu individuels et participer à la dynamique communautaire du Dahira.`,
      },
      {
        q: "Le Dahira est-il rattaché à une confrérie ou à un Cheikh particulier ?",
        a: `Le Dahira KSN est ancré dans la tradition spirituelle de Touba (voie mouride) et reconnaît l'héritage du Cheikh Ahmadou Bamba (qu'Allah l'agrée). Notre objet est exclusivement le Salaatu ʿAlaa Nabii — la prière sur le Prophète ﷺ — qui est commun à tous les musulmans.`,
      },
    ],
  },
  {
    title: "Adhésion et Espace membre",
    questions: [
      {
        q: "Comment devenir membre officiel du Dahira ?",
        a: `Trois étapes : (1) remplir le formulaire d'inscription sur la page /inscription, (2) payer la cotisation annuelle de 1 000 FCFA via Wave, Orange Money ou UBA, (3) accéder à votre espace membre avec votre carte CR-80 imprimable et votre matricule officiel.`,
      },
      {
        q: "Quel est le montant de la cotisation annuelle ?",
        a: `1 000 FCFA par an (environ 1,50 €). Cette modeste contribution finance les activités du Dahira (organisation de la Journée Salaatu, frais d'hébergement des invités, communication, etc.). Des dons supplémentaires sont toujours bienvenus pour soutenir nos projets.`,
      },
      {
        q: "Comment recevoir ma carte de membre ?",
        a: `Une fois votre paiement validé, votre carte de membre KSN au format CR-80 (taille carte bancaire) apparaît automatiquement dans votre espace membre. Vous pouvez l'imprimer directement depuis votre profil ou la sauvegarder sur votre téléphone pour la présenter lors des événements.`,
      },
      {
        q: "J'ai déjà payé mais ma page reste sur \"En attente\". Que faire ?",
        a: `Une fois le paiement Wave effectué, cliquez sur le bouton vert « J'ai payé — Activer mon compte » dans votre espace membre. Si le bouton ne s'active pas, contactez-nous via WhatsApp avec votre reçu de paiement, nous validerons manuellement.`,
      },
    ],
  },
  {
    title: "Challenge 1 Milliard de Salaatu",
    questions: [
      {
        q: "Qu'est-ce que le Challenge 1 Milliard ?",
        a: `C'est notre défi spirituel collectif : offrir 1 milliard de Salaatu au Prophète Muhammad ﷺ par l'effort cumulé de tous les membres KSN. Le compteur en direct sur /challenge montre la progression mondiale en temps réel.`,
      },
      {
        q: "Comment contribuer au Challenge ?",
        a: `Téléchargez l'application mobile KSN sur l'App Store ou Google Play. Chaque Salaatu que vous récitez et comptez dans l'app s'ajoute automatiquement au total mondial. Plus la communauté grandit, plus vite nous atteignons le milliard.`,
      },
      {
        q: "Y a-t-il une date limite pour atteindre le milliard ?",
        a: `Non, le Challenge est un effort continu sans deadline. Notre rythme actuel est d'environ 7 millions de Salaatu par semaine. À ce rythme, nous progressons vers le milliard de façon constante. Plus de membres = atteinte plus rapide.`,
      },
    ],
  },
  {
    title: "Journée Salaatu ʿAlaa Nabii",
    questions: [
      {
        q: "Quand a lieu la prochaine Journée Salaatu ?",
        a: `La prochaine édition aura lieu le 26 décembre 2026 à Touba. Le programme complet est publié sur /journee-salaatu avec compte à rebours, horaires détaillés et options de participation (présence physique, distance, soutien).`,
      },
      {
        q: "Faut-il être membre pour participer à la Journée ?",
        a: `Non, la Journée Salaatu est ouverte à tous — membres KSN, sympathisants, invités étrangers et oumma locale de Touba. Cependant, l'adhésion au Dahira reste recommandée pour bénéficier de l'accompagnement spirituel toute l'année.`,
      },
      {
        q: "Comment se rendre à Touba depuis l'étranger ?",
        a: `L'aéroport international de Dakar (AIBD) est à approx. 2h de route de Touba. Pour l'hébergement, le transport depuis Dakar et les détails logistiques, contactez l'équipe via WhatsApp — nous accompagnons les visiteurs internationaux.`,
      },
    ],
  },
  {
    title: "Application mobile KSN",
    questions: [
      {
        q: "Quelle est la différence entre l'application mobile et ce site ?",
        a: `L'application mobile (Kippaangog) est dédiée au comptage quotidien des Salaatu et synchronise avec le compteur mondial. Le site (Site KSN) est l'espace institutionnel : adhésion, carte de membre, bibliothèque, événements, boutique, dons. Les deux sont complémentaires.`,
      },
      {
        q: "L'application mobile est-elle gratuite ?",
        a: `Oui, l'application Kippaangog Salaatu ʿAlaa Nabii est entièrement gratuite sur l'App Store (iOS) et Google Play (Android). Aucun abonnement, aucun achat in-app obligatoire.`,
      },
    ],
  },
  {
    title: "Dons et paiements",
    questions: [
      {
        q: "Quels moyens de paiement acceptez-vous ?",
        a: `Pour les utilisateurs au Sénégal : Wave, Orange Money, UBA. Pour les utilisateurs internationaux : carte bancaire (Stripe) et PayPal sont disponibles sur la page /don. Tous les paiements sont sécurisés.`,
      },
      {
        q: "Mon don est-il déductible des impôts ?",
        a: `Cela dépend de votre pays de résidence. Au Sénégal, le Dahira est une organisation religieuse à but non lucratif et les dons peuvent bénéficier d'avantages fiscaux selon la législation en vigueur. Pour les détails dans votre pays, consultez votre conseiller fiscal.`,
      },
      {
        q: "Comment savoir comment mon don est utilisé ?",
        a: `La Commission Finances publie un rapport annuel de transparence accessible sur demande à tous les membres actifs. Les principaux postes de dépense : organisation de la Journée annuelle, hébergement des invités, communication, soutien social aux membres en difficulté.`,
      },
    ],
  },
];

export default function FAQPage() {
  const allQuestions = FAQ_CATEGORIES_SEO.flatMap((c) => c.questions);
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
