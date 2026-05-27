import type { Metadata } from "next";
import Link from "next/link";
import { FaWhatsapp, FaApple, FaGooglePlay, FaTrophy } from "react-icons/fa6";
import PageHero from "@/components/layout/PageHero";
import ChallengeCounter from "@/components/sections/ChallengeCounter";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Challenge 1 Milliard de Salaatu",
  description:
    "Rejoignez le défi spirituel du Dahira KSN : offrir 1 milliard de prières (Salaatu) au Prophète Muhammad ﷺ. Compteur communautaire en temps réel.",
  openGraph: {
    title: "Challenge 1 Milliard de Salaatu — Dahira KSN",
    description:
      "Suivez en direct le total mondial des prières sur le Prophète ﷺ offertes par la communauté KSN.",
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

const PLACEHOLDER_LEADERBOARD = [
  { rank: 1, label: "Serigne Bassirou Touré", count: "+ 1 250 000" },
  { rank: 2, label: "Serigne Birima Gueye", count: "+ 980 000" },
  { rank: 3, label: "Commission Éducation", count: "+ 620 000" },
  { rank: 4, label: "Commission Communication", count: "+ 480 000" },
  { rank: 5, label: "Diaspora Europe", count: "+ 340 000" },
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

      {/* TABLEAU D'HONNEUR */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-gradient-to-br from-[#B8860B] via-[#D4AF37] to-[#B8860B] rounded-[28px] sm:rounded-[45px] p-6 sm:p-12 md:p-14 text-[#0F7C55]">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-[#0F7C55] text-[#D4AF37] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <FaTrophy /> Tableau d&apos;honneur
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
              Les contributeurs majeurs
            </h2>
            <p className="mt-3 text-sm sm:text-base opacity-80 italic">
              Classement provisoire — sera mis à jour avec les données live de l&apos;application
            </p>
          </div>

          <div className="bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl overflow-hidden">
            <ul className="divide-y divide-[#0F7C55]/10">
              {PLACEHOLDER_LEADERBOARD.map((row) => (
                <li
                  key={row.rank}
                  className="flex items-center gap-4 px-5 sm:px-7 py-4 hover:bg-white/20 transition"
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-display text-lg sm:text-xl font-black ${
                      row.rank === 1
                        ? "bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900"
                        : row.rank === 2
                        ? "bg-gradient-to-br from-gray-200 to-gray-400 text-gray-700"
                        : row.rank === 3
                        ? "bg-gradient-to-br from-orange-300 to-orange-500 text-orange-900"
                        : "bg-[#0F7C55] text-[#D4AF37]"
                    }`}
                  >
                    {row.rank}
                  </div>
                  <p className="flex-1 font-display text-base sm:text-lg font-bold truncate">
                    {row.label}
                  </p>
                  <p className="font-mono tabular-nums font-bold text-sm sm:text-base">
                    {row.count}
                  </p>
                </li>
              ))}
            </ul>
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
