"use client";

import Link from "next/link";
import {
  FaWhatsapp,
  FaLocationDot,
  FaCalendarDays,
  FaClock,
  FaUsers,
  FaBookQuran,
  FaHandshakeAngle,
} from "react-icons/fa6";
import PageHero from "@/components/layout/PageHero";
import EventCountdown from "@/components/sections/EventCountdown";
import JourneeLiveAndTickets from "@/components/sections/JourneeLiveAndTickets";
import JourneeGallery from "@/components/sections/JourneeGallery";
import ShareButton from "@/components/ui/ShareButton";
import { LINKS, SITE } from "@/lib/constants";
import { useT } from "@/lib/i18n/context";

// Prochaine edition de la Journee Salaatu 'Alaa Nabii : 26 decembre 2026, Touba.
// La date est fixee chaque annee par le Khalife du Dahira.
// Mettre a jour cette constante chaque annee.
const EVENT_DATE_ISO = "2026-12-26T08:00:00+00:00";

export default function JourneeContent() {
  const { t } = useT();

  const PROGRAM = [
    { time: "07h00 — 10h00", titleKey: "journee.p1_title", textKey: "journee.p1_text" },
    { time: "10h00 — 14h00", titleKey: "journee.p2_title", textKey: "journee.p2_text" },
    { time: "14h00 — 14h15", titleKey: "journee.p3_title", textKey: "journee.p3_text" },
    { time: "14h15 — 15h00", titleKey: "journee.p4_title", textKey: "journee.p4_text" },
    { time: "15h00 — 16h30", titleKey: "journee.p5_title", textKey: "journee.p5_text" },
    { time: "17h00 — 18h30", titleKey: "journee.p6_title", textKey: "journee.p6_text" },
    { time: "18h30",          titleKey: "journee.p7_title", textKey: "journee.p7_text" },
  ];

  const HIGHLIGHTS = [
    { icon: <FaCalendarDays className="text-[#D4AF37] text-xl" />, titleKey: "journee.hi1_title", textKey: "journee.hi1_text" },
    { icon: <FaLocationDot  className="text-[#D4AF37] text-xl" />, titleKey: "journee.hi2_title", textKey: "journee.hi2_text" },
    { icon: <FaUsers        className="text-[#D4AF37] text-xl" />, titleKey: "journee.hi3_title", textKey: "journee.hi3_text" },
    { icon: <FaClock        className="text-[#D4AF37] text-xl" />, titleKey: "journee.hi4_title", textKey: "journee.hi4_text" },
  ];

  return (
    <>
      <PageHero
        overline={t("journee.hero_overline")}
        title={t("journee.hero_title")}
        arabic="يوم الصلاة على النبي ﷺ"
        description={t("journee.hero_desc")}
      />

      {/* COMPTE A REBOURS */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <EventCountdown target={EVENT_DATE_ISO} firestoreOverride />
        <p className="text-center mt-4 text-white/60 text-xs sm:text-sm">
          {t("journee.countdown_label")}{" "}
          <span className="text-[#D4AF37] font-semibold">
            {t("journee.event_date")}
          </span>
        </p>
      </section>

      {/* SENS SPIRITUEL */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14">
          <div className="text-center mb-10 sm:mb-12">
            <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
              {t("journee.meaning_overline")}
            </span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
              {t("journee.meaning_title")}
            </h2>
            <p className="mt-5 max-w-3xl mx-auto text-gray-600 text-sm sm:text-base leading-7">
              {t("journee.meaning_p1")}{" "}
              <strong>{SITE.fullName}</strong>{" "}
              {t("journee.meaning_p2")}{" "}
              <strong className="text-[#0F7C55]">{t("journee.event_date")}</strong>.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.titleKey}
                className="bg-[#F8F5EF] rounded-2xl sm:rounded-3xl p-5 sm:p-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] flex items-center justify-center mb-4">
                  {h.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-[#0F7C55]">
                  {t(h.titleKey)}
                </h3>
                <p className="mt-2 text-gray-600 text-sm leading-6">{t(h.textKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMME */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="text-center mb-10 sm:mb-14">
          <span className="uppercase tracking-[0.25em] text-[#D4AF37] font-semibold text-xs sm:text-sm">
            {t("journee.prog_overline")}
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {t("journee.prog_title")}
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto text-sm sm:text-base">
            {t("journee.prog_desc")}
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {PROGRAM.map((p, i) => (
            <div
              key={p.titleKey}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 hover:bg-white/10 transition"
            >
              <div className="flex-shrink-0 sm:w-48">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <FaClock className="text-[#D4AF37] text-xs" />
                  <span className="text-[#D4AF37] text-xs sm:text-sm font-bold whitespace-nowrap">
                    {p.time}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-[#D4AF37]/50 text-2xl font-black tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                    {t(p.titleKey)}
                  </h3>
                </div>
                <p className="mt-2 text-white/70 text-sm sm:text-base leading-6 sm:leading-7">
                  {t(p.textKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CITATION SPIRITUELLE */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[45px] bg-gradient-to-br from-[#B8860B] via-[#D4AF37] to-[#B8860B] p-6 sm:p-12 md:p-14 text-[#0F7C55]">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 text-center">
            <FaBookQuran className="mx-auto text-3xl sm:text-4xl mb-4" />
            <p
              className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose"
              dir="rtl"
            >
              إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا
            </p>
            <p className="mt-6 italic text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {t("journee.verse_trans")}
            </p>
            <p className="mt-3 text-xs sm:text-sm font-bold">
              {t("journee.verse_ref")}
            </p>
          </div>
        </div>
      </section>

      {/* DIRECT & BILLETTERIE */}
      <JourneeLiveAndTickets />

      {/* GALERIE EDITIONS PRECEDENTES */}
      <JourneeGallery />

      {/* PARTICIPER */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14">
          <div className="text-center mb-10 sm:mb-12">
            <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
              {t("journee.part_overline")}
            </span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
              {t("journee.part_title")}
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
            {/* Venir à Touba */}
            <div className="bg-[#F8F5EF] rounded-2xl sm:rounded-3xl p-6 sm:p-7">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] flex items-center justify-center text-white text-xl mb-4">
                <FaLocationDot />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#0F7C55]">
                {t("journee.w1_title")}
              </h3>
              <p className="mt-3 text-gray-600 text-sm leading-6">
                {t("journee.w1_text")}
              </p>
              <a
                href={LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-[#0F7C55] font-bold text-sm hover:underline"
              >
                <FaWhatsapp /> {t("journee.w1_cta")}
              </a>
            </div>

            {/* Participer à distance */}
            <div className="bg-[#F8F5EF] rounded-2xl sm:rounded-3xl p-6 sm:p-7">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] flex items-center justify-center text-white text-xl mb-4">
                <FaUsers />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#0F7C55]">
                {t("journee.w2_title")}
              </h3>
              <p className="mt-3 text-gray-600 text-sm leading-6">
                {t("journee.w2_text")}
              </p>
              <Link
                href="/challenge"
                className="mt-5 inline-flex items-center gap-2 text-[#0F7C55] font-bold text-sm hover:underline"
              >
                {t("journee.w2_cta")} →
              </Link>
            </div>

            {/* Soutenir financièrement */}
            <div className="bg-[#F8F5EF] rounded-2xl sm:rounded-3xl p-6 sm:p-7">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-[#0F7C55] text-xl mb-4">
                <FaHandshakeAngle />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#0F7C55]">
                {t("journee.w3_title")}
              </h3>
              <p className="mt-3 text-gray-600 text-sm leading-6">
                {t("journee.w3_text")}
              </p>
              <Link
                href="/don"
                className="mt-5 inline-flex items-center gap-2 text-[#B8860B] font-bold text-sm hover:underline"
              >
                {t("journee.w3_cta")} →
              </Link>
            </div>
          </div>

          {/* CTAs FINAUX */}
          <div className="mt-10 sm:mt-14 grid sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] px-6 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition text-sm sm:text-base"
            >
              {t("journee.cta_join")} →
            </Link>
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#0F7C55] hover:bg-[#0A3D24] text-white px-6 py-4 rounded-2xl font-bold shadow-xl transition text-sm sm:text-base"
            >
              <FaWhatsapp /> {t("journee.cta_whatsapp")}
            </a>
            <ShareButton
              title={t("journee.share_title")}
              text={t("journee.share_text")}
              variant="primary"
              label={t("journee.share_label")}
              className="!px-6 !py-4 !rounded-2xl"
            />
          </div>
        </div>
      </section>
    </>
  );
}
