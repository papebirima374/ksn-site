"use client";

import Link from "next/link";
import {
  FaWhatsapp,
  FaApple,
  FaGooglePlay,
  FaHandshakeAngle,
  FaHandsPraying,
  FaBookQuran,
} from "react-icons/fa6";
import PageHero from "@/components/layout/PageHero";
import ChallengeCounter from "@/components/sections/ChallengeCounter";
import ShareButton from "@/components/ui/ShareButton";
import SectionTabs from "@/components/ui/SectionTabs";
import { LINKS } from "@/lib/constants";
import { useT } from "@/lib/i18n/context";

const TABS = [
  { id: "participer", labelKey: "tabs.participer", icon: <FaHandsPraying /> },
  { id: "spirituel", labelKey: "tabs.spirituel", icon: <FaBookQuran /> },
];

export default function ChallengeContent() {
  const { t } = useT();

  const howToSteps = [
    {
      n: 1,
      title: t("challenge.step1_title"),
      text: t("challenge.step1_desc"),
      icon: "📱",
    },
    {
      n: 2,
      title: t("challenge.step2_title"),
      text: t("challenge.step2_desc"),
      icon: "📿",
    },
    {
      n: 3,
      title: t("challenge.step3_title"),
      text: t("challenge.step3_desc"),
      icon: "🌍",
    },
  ];

  return (
    <>
      <PageHero
        overline={t("challenge.overline")}
        title={t("challenge.title")}
        salaatuCalligraphy
        description={t("challenge.desc")}
      />

      {/* COMPTEUR LIVE — toujours visible */}
      <ChallengeCounter />

      <SectionTabs
        tabs={TABS}
        renderPanel={(id) => (
          <>
            {id === "participer" && (
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14">
          <div className="text-center mb-10 sm:mb-14">
            <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
              {t("challenge.how_title")}
            </span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
              {t("challenge.how_subtitle")}
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              {t("challenge.how_desc")}
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 sm:gap-7">
            {howToSteps.map((s) => (
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
                <span className="block text-[10px] opacity-70 leading-none">{t("appksn.download_apple")}</span>
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
                <span className="block text-[10px] opacity-70 leading-none">{t("appksn.download_google")}</span>
                <span className="block">Google Play</span>
              </span>
            </a>
          </div>
        </div>
      </section>
            )}
            {id === "spirituel" && (
              <>
      {/* LA FORCE DU CULTE COLLECTIF */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[45px] bg-gradient-to-br from-[#B8860B] via-[#D4AF37] to-[#B8860B] p-6 sm:p-12 md:p-16 text-[#0F7C55]">
          {/* Decorative motifs */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#0F7C55]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-[#0F7C55] text-[#D4AF37] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
              <FaHandshakeAngle /> {t("challenge.group_badge")}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
              {t("challenge.group_title")}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base opacity-90 italic">
              {t("challenge.group_desc")}
            </p>
          </div>

          {/* --- SECTION 1 : LES VERSETS CORANIQUES (EN HAUT) --- */}
          <div className="relative z-10 mt-10 sm:mt-12 space-y-6">
            <h3 className="text-center font-display text-sm sm:text-base font-bold uppercase tracking-[0.25em] text-[#0F5132]/80 flex items-center justify-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132]/40" />
              {t("challenge.versets_title")}
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132]/40" />
            </h3>

            {/* Verset 1 — Al-Imran 103 */}
            <div className="bg-[#0F7C55] rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <p
                className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose text-[#D4AF37] text-center"
                dir="rtl"
              >
                {t("challenge.verset1_ar")}
              </p>
              <p className="mt-6 italic text-base sm:text-lg text-white/95 text-center leading-relaxed max-w-3xl mx-auto">
                {t("challenge.verset1_fr")}
              </p>
              <p className="mt-4 text-xs sm:text-sm text-[#D4AF37] text-center font-bold tracking-wide">
                {t("challenge.verset1_ref")}
              </p>
            </div>

            {/* Verset 2 — Al-Ma'ida 2 */}
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto border border-white/20 shadow-sm">
              <p
                className="font-arabic text-xl sm:text-2xl text-[#0F5132] text-center leading-loose"
                dir="rtl"
              >
                {t("challenge.verset2_ar")}
              </p>
              <p className="mt-3 text-sm text-[#0F5132] italic text-center font-medium">
                {t("challenge.verset2_fr")}
              </p>
              <p className="mt-1 text-xs text-[#0F5132]/70 text-center font-semibold">{t("challenge.verset2_ref")}</p>
            </div>
          </div>

          {/* --- SECTION 2 : LES NOBLES HADITHS (APRES) --- */}
          <div className="relative z-10 mt-12 sm:mt-16 space-y-6">
            <h3 className="text-center font-display text-sm sm:text-base font-bold uppercase tracking-[0.25em] text-[#0F5132]/80 flex items-center justify-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132]/40" />
              {t("challenge.hadiths_title")}
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132]/40" />
            </h3>

            {/* Hadith 1 — Prière en groupe 27x */}
            <div className="bg-[#0F7C55] rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <p
                className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose text-[#D4AF37] text-center"
                dir="rtl"
              >
                {t("challenge.hadith1_ar")}
              </p>
              <p className="mt-6 italic text-base sm:text-lg text-white/95 text-center leading-relaxed max-w-2xl mx-auto">
                {t("challenge.hadith1_fr")}
              </p>
              <p className="mt-4 text-xs sm:text-sm text-[#D4AF37] text-center font-bold tracking-wide">
                {t("challenge.hadith1_ref")}
              </p>
            </div>

            {/* Hadith 2 — La main d'Allah */}
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto border border-white/20 shadow-sm">
              <p
                className="font-arabic text-xl sm:text-2xl text-[#0F5132] text-center leading-loose"
                dir="rtl"
              >
                {t("challenge.hadith2_ar")}
              </p>
              <p className="mt-3 text-sm text-[#0F5132] italic text-center font-medium">
                {t("challenge.hadith2_fr")}
              </p>
              <p className="mt-1 text-xs text-[#0F5132]/70 text-center font-semibold">{t("challenge.hadith2_ref")}</p>
            </div>
          </div>

          {/* MORALE / APPLICATION AU CHALLENGE */}
          <div className="relative z-10 mt-8 sm:mt-10 text-center max-w-3xl mx-auto">
            <p className="text-sm sm:text-base text-[#0F7C55] leading-7">
              {t("challenge.conclusion")}
            </p>
          </div>
        </div>
      </section>

      {/* VERSET / HADITH */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-8 sm:p-14 text-center">
          <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
            {t("challenge.reward_badge")}
          </span>
          <p
            className="font-arabic mt-6 text-3xl sm:text-4xl md:text-5xl leading-loose text-[#0F7C55]"
            dir="rtl"
          >
            {t("challenge.reward_ar")}
          </p>
          <p className="mt-6 italic text-lg sm:text-xl text-gray-700 leading-relaxed">
            {t("challenge.reward_fr")}
          </p>
          <p className="mt-3 text-sm text-gray-500">{t("challenge.reward_ref")}</p>

          <div className="mt-10 grid sm:grid-cols-3 gap-3 sm:gap-4">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] px-6 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition text-sm sm:text-base"
            >
              <FaWhatsapp /> {t("cta.join")}
            </Link>
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#0F7C55] hover:bg-[#0A3D24] text-white px-6 py-4 rounded-2xl font-bold shadow-xl transition text-sm sm:text-base"
            >
              <FaWhatsapp /> {t("cta.send_whatsapp")}
            </a>
            <ShareButton
              title={`${t("challenge.title")} — KSN`}
              text={t("challenge.desc")}
              variant="primary"
              label={t("challenge.share_label")}
              className="!px-6 !py-4 !rounded-2xl"
            />
          </div>
        </div>
      </section>
              </>
            )}
          </>
        )}
      />
    </>
  );
}
