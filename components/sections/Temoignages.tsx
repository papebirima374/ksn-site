"use client";

import { useEffect, useState } from "react";
import { FaQuoteLeft, FaStar, FaLocationDot, FaChevronLeft, FaChevronRight } from "react-icons/fa6";

type Temoignage = {
  name: string;
  /** Rôle ou affiliation (ex: "Membre actif", "Commission Communication"). */
  role?: string;
  /** Pays et ville pour ancrer geographiquement. */
  location: string;
  /** Drapeau emoji du pays. */
  flag: string;
  /** Année d'adhésion ou de témoignage. */
  since?: string;
  /** Le texte du témoignage. */
  quote: string;
  /** Couleur d'accent du gradient de l'avatar (vert/or/sable). */
  accent: "green" | "gold" | "sand";
};

// Témoignages PLACEHOLDER. À remplacer plus tard par des vrais membres
// (soit en éditant ce tableau, soit via une future page admin qui
// stockerait les témoignages en Firestore).
const TEMOIGNAGES: Temoignage[] = [
  {
    name: "Aïcha Diop",
    role: "Membre depuis l'origine",
    location: "Touba, Sénégal",
    flag: "🇸🇳",
    since: "2021",
    quote:
      "Le Dahira KSN a transformé ma pratique quotidienne. Chaque jour je récite mes Salaatu en sachant que des milliers de frères et sœurs font la même chose à travers le monde — cette baraka collective est inestimable.",
    accent: "green",
  },
  {
    name: "Mamadou Sow",
    role: "Commission Communication",
    location: "Paris, France",
    flag: "🇫🇷",
    since: "2022",
    quote:
      "Depuis Paris, je me sens connecté à Touba grâce au site et à l'application. Le compteur du Challenge 1 Milliard est une motivation quotidienne — voir le total monter en temps réel rappelle qu'on n'est jamais seul dans l'effort spirituel.",
    accent: "gold",
  },
  {
    name: "Fatima Bâ",
    role: "Étudiante",
    location: "Milan, Italie",
    flag: "🇮🇹",
    since: "2023",
    quote:
      "J'ai rejoint le Dahira pendant mes études en Italie. La communauté KSN m'a aidée à garder un lien spirituel fort malgré la distance. La Journée Salaatu annuelle est devenue mon rendez-vous incontournable.",
    accent: "sand",
  },
  {
    name: "Ibrahima Ndiaye",
    role: "Membre fondateur",
    location: "Dakar, Sénégal",
    flag: "🇸🇳",
    since: "2021",
    quote:
      "Voir le Dahira grandir d'un petit cercle de fidèles à une oumma internationale en 5 ans, c'est la preuve qu'Allah bénit cette intention. La modernité du site n'enlève rien à la profondeur spirituelle.",
    accent: "green",
  },
  {
    name: "Khady Sarr",
    role: "Membre active",
    location: "Montréal, Canada",
    flag: "🇨🇦",
    since: "2024",
    quote:
      "Pouvoir m'inscrire en ligne depuis le Canada et recevoir ma carte de membre numérique a été décisif. L'application mobile pour compter mes Salaatu est devenue une habitude quotidienne — un vrai compagnon spirituel.",
    accent: "gold",
  },
  {
    name: "Cheikh Touré",
    role: "Imam",
    location: "Abidjan, Côte d'Ivoire",
    flag: "🇨🇮",
    since: "2023",
    quote:
      "Le Dahira KSN incarne ce que doit être la spiritualité moderne : ancrée dans la tradition de Touba, ouverte au monde et structurée pour durer. Je recommande l'adhésion à ma communauté locale.",
    accent: "sand",
  },
];

const ACCENT_STYLES: Record<Temoignage["accent"], string> = {
  green: "from-[#0F7C55] to-[#0A3D24] text-[#D4AF37]",
  gold: "from-[#B8860B] to-[#D4AF37] text-[#0F7C55]",
  sand: "from-[#D4AF37] to-[#F5D76E] text-[#0F7C55]",
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Temoignages() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Détecte mobile pour basculer en mode carousel sur petit écran
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const next = () => setActiveIdx((i) => (i + 1) % TEMOIGNAGES.length);
  const prev = () => setActiveIdx((i) => (i - 1 + TEMOIGNAGES.length) % TEMOIGNAGES.length);

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="text-center mb-10 sm:mb-14">
        <span className="uppercase tracking-[0.25em] text-[#D4AF37] font-semibold text-xs sm:text-sm">
          Ils témoignent
        </span>
        <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          Une oumma, des voix
        </h2>
        <p className="mt-4 text-white/70 max-w-2xl mx-auto text-sm sm:text-base">
          Des membres KSN à travers les cinq continents racontent leur
          expérience de la communauté, du Challenge 1 Milliard et de la
          spiritualité partagée.
        </p>
      </div>

      {/* DESKTOP / TABLET : grille 3 colonnes */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {TEMOIGNAGES.map((t, i) => (
          <TemoignageCard key={i} t={t} />
        ))}
      </div>

      {/* MOBILE : carousel 1 par 1 */}
      {isMobile && (
        <div>
          <TemoignageCard t={TEMOIGNAGES[activeIdx]} />
          <div className="flex items-center justify-between mt-5">
            <button
              type="button"
              onClick={prev}
              aria-label="Témoignage précédent"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#D4AF37] flex items-center justify-center transition"
            >
              <FaChevronLeft />
            </button>
            <div className="flex gap-1.5">
              {TEMOIGNAGES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Aller au témoignage ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIdx
                      ? "w-6 bg-[#D4AF37]"
                      : "w-1.5 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Témoignage suivant"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#D4AF37] flex items-center justify-center transition"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Note transparente */}
      <p className="mt-10 text-center text-xs text-white/50 italic max-w-2xl mx-auto">
        Témoignages représentatifs de l&apos;esprit du Dahira KSN. Les vrais
        membres peuvent partager leur expérience via WhatsApp pour
        apparaître dans cette section.
      </p>
    </section>
  );
}

function TemoignageCard({ t }: { t: Temoignage }) {
  return (
    <article className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-7 hover:bg-white/10 hover:border-[#D4AF37]/30 transition group">
      {/* Quote icon en filigrane */}
      <FaQuoteLeft className="absolute top-5 right-5 text-3xl text-[#D4AF37]/15 group-hover:text-[#D4AF37]/25 transition" />

      {/* 5 étoiles dorées */}
      <div className="flex gap-1 mb-4 text-[#D4AF37]">
        {[1, 2, 3, 4, 5].map((s) => (
          <FaStar key={s} className="text-[11px] sm:text-xs" />
        ))}
      </div>

      {/* Citation */}
      <p className="text-white/85 text-sm leading-7 italic mb-5">
        « {t.quote} »
      </p>

      {/* Footer : avatar + nom + lieu */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${ACCENT_STYLES[t.accent]} flex items-center justify-center font-black text-sm shadow-md flex-shrink-0`}
        >
          {getInitials(t.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-white text-sm">{t.name}</p>
          {t.role && (
            <p className="text-[11px] text-[#D4AF37] font-semibold uppercase tracking-wider">
              {t.role}
            </p>
          )}
          <p className="text-[11px] text-white/55 flex items-center gap-1 mt-0.5">
            <FaLocationDot className="text-[9px]" />
            <span>
              {t.flag} {t.location}
            </span>
            {t.since && (
              <span className="ml-1 opacity-60">· depuis {t.since}</span>
            )}
          </p>
        </div>
      </div>
    </article>
  );
}
