import type { Metadata } from "next";
import Link from "next/link";
import { FaWhatsapp, FaCircleQuestion } from "react-icons/fa6";
import PageHero from "@/components/layout/PageHero";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { LINKS, SITE } from "@/lib/constants";

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

const FAQ_CATEGORIES = [
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
        a: `L'aéroport international de Dakar (AIBD) est à environ 2h de route de Touba. Pour l'hébergement, le transport depuis Dakar et les détails logistiques, contactez l'équipe via WhatsApp — nous accompagnons les visiteurs internationaux.`,
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
  // Flatten pour le JSON-LD FAQPage (SEO)
  const allQuestions = FAQ_CATEGORIES.flatMap((c) => c.questions);
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

      <PageHero
        overline="Questions fréquentes"
        title="Tout ce qu'il faut savoir"
        arabic="الأسئلة المتداولة"
        description={`Les réponses aux questions les plus fréquemment posées sur le Dahira KSN, l'adhésion, le Challenge 1 Milliard, la Journée Salaatu, l'application mobile et bien plus.`}
      />

      {/* SOMMAIRE RAPIDE */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-10">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold mb-3">
            Sommaire — {FAQ_CATEGORIES.length} sections, {allQuestions.length} questions
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {FAQ_CATEGORIES.map((c) => (
              <a
                key={c.title}
                href={`#${c.title.replace(/\s+/g, "-").toLowerCase()}`}
                className="text-white/80 hover:text-[#D4AF37] text-sm py-1.5 transition flex items-center gap-2"
              >
                <FaCircleQuestion className="text-[#D4AF37]" />
                {c.title}{" "}
                <span className="text-[10px] text-white/40">
                  ({c.questions.length})
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ACCORDÉONS PAR CATÉGORIE */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 space-y-12 sm:space-y-16">
        {FAQ_CATEGORIES.map((cat, ci) => (
          <div
            key={cat.title}
            id={cat.title.replace(/\s+/g, "-").toLowerCase()}
            className="scroll-mt-32"
          >
            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-display text-3xl sm:text-4xl font-black text-[#D4AF37]/40 tabular-nums leading-none">
                {String(ci + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                {cat.title}
              </h2>
            </div>
            <FaqAccordion items={cat.questions} />
          </div>
        ))}
      </section>

      {/* CTA QUESTION SUPPLEMENTAIRE */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] flex items-center justify-center text-[#D4AF37] text-2xl mb-5">
            <FaCircleQuestion />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F7C55]">
            Votre question n&apos;est pas dans la liste ?
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Notre équipe WhatsApp répond rapidement à toutes les questions
            spécifiques. N&apos;hésitez pas, aucune question n&apos;est trop
            simple ou trop complexe.
          </p>

          <div className="mt-7 sm:mt-9 grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#0F7C55] hover:bg-[#0A3D24] text-white px-6 py-4 rounded-2xl font-bold shadow-xl transition text-sm sm:text-base"
            >
              <FaWhatsapp /> Poser ma question via WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] px-6 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition text-sm sm:text-base"
            >
              Formulaire de contact →
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-500">
            Site officiel du Dahira {SITE.fullName} — Touba, Sénégal
          </p>
        </div>
      </section>
    </>
  );
}
