import type { Metadata } from "next";
import Link from "next/link";
import { FaBookOpen, FaHeadphones, FaQuoteLeft, FaArrowRight } from "react-icons/fa6";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Éducation & Culture — À venir Inch'Allah",
  description:
    "La Commission Éducation & Culture du Dahira KSN prépare une plateforme spirituelle immersive : enseignements de Serigne Touba, hadiths, bienfaits de la Salaatu, audio premium et bibliothèque islamique.",
  openGraph: {
    title: "Éducation & Culture — Dahira KSN",
    description: "Une plateforme spirituelle immersive bientôt disponible Inch'Allah.",
  },
  robots: { index: false, follow: true }, // pas indexé pendant le développement
};

const TEASE_FEATURES = [
  {
    icon: <FaBookOpen />,
    title: "Enseignements de Serigne Touba",
    text: "Le Tazawwud, le Massalik al-Jinan et bien d'autres ouvrages traduits, audio, expliqués pour les francophones.",
  },
  {
    icon: <FaHeadphones />,
    title: "Audio premium multilingue",
    text: "Écoutez les leçons en français, anglais, arabe, italien, espagnol et wolof. Lecture lente et contemplative.",
  },
  {
    icon: <FaQuoteLeft />,
    title: "Rappels quotidiens",
    text: "Un hadith, un verset, un enseignement de Serigne Touba — chaque jour, court et inspirant.",
  },
];

export default function EducationComingSoonPage() {
  return (
    <main className="relative z-10">
      {/* HERO À VENIR */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 lg:pt-48 pb-16 text-center">
        <p className="font-arabic text-3xl sm:text-4xl md:text-5xl text-[#D4AF37] mb-6">
          صلى الله على محمد
        </p>

        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-6">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-[#D4AF37] opacity-75 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-[#D4AF37]" />
          </span>
          <span className="uppercase tracking-[0.25em] text-[#D4AF37] text-xs font-bold">
            Bientôt — Inch&apos;Allah
          </span>
        </span>

        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight">
          Éducation
          <br />
          <span className="bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#F5D76E] bg-clip-text text-transparent">
            & Culture
          </span>
        </h1>

        <p className="mt-8 text-lg sm:text-xl text-white/80 leading-8 max-w-3xl mx-auto">
          La Commission Éducation & Culture du Dahira KSN prépare une
          plateforme spirituelle immersive — pour apprendre, méditer et
          transmettre l&apos;enseignement de Serigne Touba sur la Salaatu
          ʿAlaa Nabii.
        </p>

        <p className="mt-4 text-sm text-white/50 italic max-w-2xl mx-auto">
          Texte de référence pour le lancement : <em>Tazawwudu-ss-Sighar</em>,
          le Viatique des Adolescents de Cheikh Ahmadou Bamba
          (qu&apos;Allah l&apos;agrée).
        </p>
      </section>

      {/* TEASER FEATURES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[28px] sm:rounded-[40px] p-6 sm:p-12">
          <div className="text-center mb-10">
            <span className="uppercase tracking-[0.25em] text-[#D4AF37] font-semibold text-xs sm:text-sm">
              Aperçu
            </span>
            <h2 className="font-display mt-3 text-3xl sm:text-4xl font-bold text-white">
              Ce que vous y trouverez
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
            {TEASE_FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-[#0A3D24]/60 rounded-2xl sm:rounded-3xl p-6 border border-white/10 hover:border-[#D4AF37]/40 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-[#0F7C55] text-xl mb-4">
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-white/70 text-sm leading-6">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CITATION HADITH */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[45px] bg-gradient-to-br from-[#B8860B] via-[#D4AF37] to-[#B8860B] p-6 sm:p-12 md:p-14 text-[#0F7C55] text-center">
          <p
            className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose"
            dir="rtl"
          >
            مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا
          </p>
          <p className="mt-6 italic text-lg max-w-2xl mx-auto leading-relaxed">
            « Celui qui prie sur moi une fois, Allah prie sur lui dix fois. »
          </p>
          <p className="mt-3 text-xs sm:text-sm font-bold">
            — Le Prophète Muhammad ﷺ (rapporté par Muslim)
          </p>
        </div>
      </section>

      {/* CTAs */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 sm:pb-32 text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
          Ne manquez pas le lancement
        </h2>
        <p className="text-white/70 text-sm sm:text-base mb-8 max-w-xl mx-auto">
          Rejoignez le Dahira aujourd&apos;hui pour être parmi les premiers à
          accéder à la plateforme éducative dès son ouverture, Inch&apos;Allah.
        </p>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto">
          <Link
            href="/inscription"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] px-6 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition text-sm sm:text-base"
          >
            Devenir membre <FaArrowRight className="text-xs" />
          </Link>
          <a
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white/10 hover:bg-white/15 border border-white/15 text-white px-6 py-4 rounded-2xl font-bold transition text-sm sm:text-base"
          >
            Recevoir les nouvelles
          </a>
        </div>
      </section>
    </main>
  );
}
