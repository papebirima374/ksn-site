import type { Metadata } from "next";
import Link from "next/link";
import { FaWhatsapp, FaApple, FaGooglePlay, FaHandshakeAngle } from "react-icons/fa6";
import PageHero from "@/components/layout/PageHero";
import ChallengeCounter from "@/components/sections/ChallengeCounter";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Challenge 1 Milliard de Salaatu — Compteur Live KSN",
  description:
    "Rejoignez le défi spirituel mondial du Dahira KSN : offrir un milliard de prières (Salaatu) au Prophète Muhammad ﷺ. Suivez le compteur communautaire en direct, contribuez depuis l'app KSN.",
  openGraph: {
    title: "Challenge 1 Milliard de Salaatu — Dahira KSN International",
    description:
      "Suivez en direct le compteur mondial des prières sur le Prophète ﷺ offertes par la communauté KSN à travers les cinq continents. Rejoignez le défi.",
  },
};

const HOW_TO_STEPS = [
  {
    n: 1,
    title: "Téléchargez l'app KSN",
    text: "Disponible gratuitement sur iPhone et Android. Saisissez vos Salaatu quotidiens en un tap.",
    icon: "📱",
  },
  {
    n: 2,
    title: "Comptez vos Salaatu",
    text: "Récitez la prière sur le Prophète ﷺ et incrémentez votre compteur personnel — chaque récitation compte pour le total mondial.",
    icon: "📿",
  },
  {
    n: 3,
    title: "Invitez la oumma",
    text: "Partagez le challenge sur WhatsApp, Telegram, Facebook. Plus on est nombreux, plus vite on atteint le milliard.",
    icon: "🌍",
  },
];

export default function ChallengePage() {
  return (
    <>
      <PageHero
        overline="Défi spirituel mondial"
        title="Challenge 1 Milliard"
        arabic="صلى الله على محمد"
        description="Ensemble, offrons au Prophète Muhammad ﷺ un milliard de prières (Salaatu). Chaque membre KSN, chaque récitation, chaque souffle compte."
      />

      {/* COMPTEUR LIVE */}
      <ChallengeCounter />

      {/* COMMENT PARTICIPER */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14">
          <div className="text-center mb-10 sm:mb-14">
            <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
              Comment participer
            </span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
              3 étapes pour contribuer
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              L&apos;application KSN est l&apos;outil officiel du Dahira pour
              compter et synchroniser les Salaatu de la communauté avec le
              compteur mondial.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 sm:gap-7">
            {HOW_TO_STEPS.map((s) => (
              <div
                key={s.n}
                className="bg-[#F8F5EF] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center hover:shadow-lg transition"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] text-white flex items-center justify-center text-xl font-bold mb-4">
                  {s.n}
                </div>
                <div className="text-4xl sm:text-5xl mb-3">{s.icon}</div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#0F7C55]">
                  {s.title}
                </h3>
                <p className="mt-3 text-gray-600 text-sm leading-6">{s.text}</p>
              </div>
            ))}
          </div>

          {/* CTA APP */}
          <div className="mt-10 sm:mt-14 flex flex-wrap justify-center gap-3 sm:gap-4">
            <a
              href={LINKS.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-black text-white px-5 sm:px-7 py-3 sm:py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition text-sm sm:text-base"
            >
              <FaApple className="text-xl sm:text-2xl" />
              <span>
                <span className="block text-[10px] opacity-70 leading-none">Télécharger sur</span>
                <span className="block">App Store</span>
              </span>
            </a>
            <a
              href={LINKS.playStore}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#0F7C55] text-white px-5 sm:px-7 py-3 sm:py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition text-sm sm:text-base"
            >
              <FaGooglePlay className="text-xl sm:text-2xl" />
              <span>
                <span className="block text-[10px] opacity-70 leading-none">Disponible sur</span>
                <span className="block">Google Play</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* LA FORCE DU CULTE COLLECTIF */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[45px] bg-gradient-to-br from-[#B8860B] via-[#D4AF37] to-[#B8860B] p-6 sm:p-12 md:p-16 text-[#0F7C55]">
          {/* Decorative motifs */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#0F7C55]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-[#0F7C55] text-[#D4AF37] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
              <FaHandshakeAngle /> La force du groupe
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
              Pourquoi prier ensemble ?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base opacity-90 italic">
              L&apos;Islam met le culte collectif au cœur de la spiritualité.
              C&apos;est le sens même du Dahira : multiplier l&apos;effort
              individuel par la baraka du groupe.
            </p>
          </div>

          {/* --- SECTION 1 : LES VERSETS CORANIQUES (EN HAUT) --- */}
          <div className="relative z-10 mt-10 sm:mt-12 space-y-6">
            <h3 className="text-center font-display text-sm sm:text-base font-bold uppercase tracking-[0.25em] text-[#0F5132]/80 flex items-center justify-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132]/40" />
              Les Versets Coraniques (Révélation)
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132]/40" />
            </h3>

            {/* Verset 1 — Al-Imran 103 (Appel fondamental à l'unité et à la reconnaissance) */}
            <div className="bg-[#0F7C55] rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <p
                className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose text-[#D4AF37] text-center"
                dir="rtl"
              >
                وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا ۚ وَاذْكُرُوا نِعْمَتَ اللَّهِ عَلَيْكُمْ
              </p>
              <p className="mt-6 italic text-base sm:text-lg text-white/95 text-center leading-relaxed max-w-3xl mx-auto">
                « Et cramponnez-vous tous ensemble au câble d&apos;Allah et ne vous divisez pas ; et rappelez-vous le bienfait d&apos;Allah sur vous. »
              </p>
              <p className="mt-4 text-xs sm:text-sm text-[#D4AF37] text-center font-bold tracking-wide">
                — Coran, sourate Âl-&apos;Imrân (3), verset 103
              </p>
            </div>

            {/* Verset 2 — Al-Ma'ida 2 */}
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto border border-white/20 shadow-sm">
              <p
                className="font-arabic text-xl sm:text-2xl text-[#0F5132] text-center leading-loose"
                dir="rtl"
              >
                وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ
              </p>
              <p className="mt-3 text-sm text-[#0F5132] italic text-center font-medium">
                « Entraidez-vous dans la piété et la crainte de Dieu. »
              </p>
              <p className="mt-1 text-xs text-[#0F5132]/70 text-center font-semibold">— Coran, sourate Al-Mâ&apos;ida (5), verset 2</p>
            </div>
          </div>

          {/* --- SECTION 2 : LES NOBLES HADITHS (APRES) --- */}
          <div className="relative z-10 mt-12 sm:mt-16 space-y-6">
            <h3 className="text-center font-display text-sm sm:text-base font-bold uppercase tracking-[0.25em] text-[#0F5132]/80 flex items-center justify-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132]/40" />
              Les Nobles Hadiths (Guidance)
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132]/40" />
            </h3>

            {/* Hadith 1 — Prière en groupe 27x */}
            <div className="bg-[#0F7C55] rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <p
                className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose text-[#D4AF37] text-center"
                dir="rtl"
              >
                صَلَاةُ الْجَمَاعَةِ تَفْضُلُ صَلَاةَ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً
              </p>
              <p className="mt-6 italic text-base sm:text-lg text-white/95 text-center leading-relaxed max-w-2xl mx-auto">
                « La prière en groupe est supérieure à la prière individuelle de vingt-sept degrés. »
              </p>
              <p className="mt-4 text-xs sm:text-sm text-[#D4AF37] text-center font-bold tracking-wide">
                — Le Prophète Muhammad ﷺ (rapporté par Al-Bukhari et Muslim)
              </p>
            </div>

            {/* Hadith 2 — La main d'Allah */}
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto border border-white/20 shadow-sm">
              <p
                className="font-arabic text-xl sm:text-2xl text-[#0F5132] text-center leading-loose"
                dir="rtl"
              >
                يَدُ اللَّهِ مَعَ الْجَمَاعَةِ
              </p>
              <p className="mt-3 text-sm text-[#0F5132] italic text-center font-medium">
                « La main d&apos;Allah est avec le groupe. »
              </p>
              <p className="mt-1 text-xs text-[#0F5132]/70 text-center font-semibold">— Hadith rapporté par At-Tirmidhi</p>
            </div>
          </div>

          {/* MORALE / APPLICATION AU CHALLENGE */}
          <div className="relative z-10 mt-8 sm:mt-10 text-center max-w-3xl mx-auto">
            <p className="text-sm sm:text-base text-[#0F7C55] leading-7">
              <strong>C&apos;est l&apos;esprit du Challenge KSN :</strong> chaque
              Salaatu individuel récité au sein de la communauté est multiplié
              par la baraka du groupe. Un milliard de Salaatu, c&apos;est{" "}
              <em>impossible seul</em> — mais ensemble, sous l&apos;autorité
              spirituelle du Dahira et avec la permission d&apos;Allah, ce
              défi devient réalité.
            </p>
          </div>
        </div>
      </section>

      {/* VERSET / HADITH */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-8 sm:p-14 text-center">
          <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
            La récompense divine
          </span>
          <p
            className="font-arabic mt-6 text-3xl sm:text-4xl md:text-5xl leading-loose text-[#0F7C55]"
            dir="rtl"
          >
            مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا
          </p>
          <p className="mt-6 italic text-lg sm:text-xl text-gray-700 leading-relaxed">
            « Celui qui prie sur moi une fois, Allah prie sur lui dix fois. »
          </p>
          <p className="mt-3 text-sm text-gray-500">— Le Prophète Muhammad ﷺ (rapporté par Muslim)</p>

          <div className="mt-10 grid sm:grid-cols-2 gap-3 sm:gap-4">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] px-6 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition text-sm sm:text-base"
            >
              Rejoindre le Dahira →
            </Link>
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#0F7C55] hover:bg-[#0A3D24] text-white px-6 py-4 rounded-2xl font-bold shadow-xl transition text-sm sm:text-base"
            >
              <FaWhatsapp /> Inviter mes proches
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
