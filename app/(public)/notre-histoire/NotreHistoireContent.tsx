"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  FaSeedling,
  FaPeopleGroup,
  FaWhatsapp,
  FaStar,
  FaHandHoldingHeart,
} from "react-icons/fa6";
import PageHero from "@/components/layout/PageHero";
import ShareButton from "@/components/ui/ShareButton";
import { LINKS, JOIN_WHATSAPP_LINK, SITE } from "@/lib/constants";
import { useT } from "@/lib/i18n/context";

type Milestone = {
  year: string;
  dateKey: string;
  icon: ReactNode;
  titleKey: string;
  textKey: string;
};

const MILESTONES: Milestone[] = [
  { year: "2021", dateKey: "histoire.m1_date", icon: <FaSeedling />, titleKey: "histoire.m1_title", textKey: "histoire.m1_text" },
  { year: "2021", dateKey: "histoire.m2_date", icon: <FaHandHoldingHeart />, titleKey: "histoire.m2_title", textKey: "histoire.m2_text" },
  { year: "2022", dateKey: "histoire.m3_date", icon: <FaPeopleGroup />, titleKey: "histoire.m3_title", textKey: "histoire.m3_text" },
  { year: "2023", dateKey: "histoire.m4_date", icon: <FaPeopleGroup />, titleKey: "histoire.m4_title", textKey: "histoire.m4_text" },
  { year: "2023", dateKey: "histoire.m5_date", icon: <FaStar />, titleKey: "histoire.m5_title", textKey: "histoire.m5_text" },
  { year: "2024", dateKey: "histoire.m6_date", icon: <FaStar />, titleKey: "histoire.m6_title", textKey: "histoire.m6_text" },
  { year: "2025", dateKey: "histoire.m7_date", icon: <FaStar />, titleKey: "histoire.m7_title", textKey: "histoire.m7_text" },
];

const VALUE_KEYS = [
  { t: "histoire.v1_title", d: "histoire.v1_text" },
  { t: "histoire.v2_title", d: "histoire.v2_text" },
  { t: "histoire.v3_title", d: "histoire.v3_text" },
  { t: "histoire.v4_title", d: "histoire.v4_text" },
];

export default function NotreHistoireContent() {
  const { t } = useT();
  const stats = [
    { value: "5", label: t("histoire.stat1_label") },
    { value: "4 300+", label: t("histoire.stat2_label") },
    { value: "5", label: t("histoire.stat3_label") },
    { value: "1 Md", label: t("histoire.stat4_label") },
  ];

  return (
    <>
      <PageHero
        overline={t("histoire.hero_overline")}
        title={t("histoire.hero_title")}
        arabic="تاريخنا في خدمة الصلاة على النبي ﷺ"
        description={t("histoire.hero_desc")}
      />

      {/* ORIGINES */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14">
          <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
            {t("histoire.origins_overline")}
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
            {t("histoire.origins_title")}
          </h2>

          <div className="mt-8 space-y-5 text-gray-700 leading-7 sm:leading-8 text-sm sm:text-base">
            <p>{t("histoire.origins_p1")}</p>
            <p>
              {t("histoire.origins_p2")} <strong>{SITE.fullName}</strong>.
            </p>
            <p>{t("histoire.origins_p3")}</p>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-[#F8F5EF] rounded-2xl p-4 sm:p-5 text-center">
                <div className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-[#0F7C55] tabular-nums">
                  {s.value}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-gray-600 font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="text-center mb-10 sm:mb-14">
          <span className="uppercase tracking-[0.25em] text-[#D4AF37] font-semibold text-xs sm:text-sm">
            {t("histoire.timeline_overline")}
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {t("histoire.timeline_title")}
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto text-sm sm:text-base">
            {t("histoire.timeline_desc")}
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-7 sm:left-1/2 top-0 bottom-0 w-px bg-[#D4AF37]/30 sm:-translate-x-1/2" />
          <div className="space-y-6 sm:space-y-10">
            {MILESTONES.map((m, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={m.titleKey}
                  className={`relative flex sm:items-center gap-4 sm:gap-8 ${
                    isEven ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  <div className="relative z-10 flex-shrink-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-xl border-2 bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] text-[#D4AF37] border-[#D4AF37]/40">
                      {m.icon}
                    </div>
                  </div>
                  <div className="flex-1 sm:w-[calc(50%-3rem)] sm:max-w-[calc(50%-3rem)]">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 hover:bg-white/10 transition">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-display text-2xl sm:text-3xl font-black text-[#D4AF37] tabular-nums leading-none">
                          {m.year}
                        </span>
                        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/50 font-bold pt-1">
                          {t(m.dateKey)}
                        </span>
                      </div>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                        {t(m.titleKey)}
                      </h3>
                      <p className="mt-2 text-white/70 text-sm sm:text-base leading-6 sm:leading-7">
                        {t(m.textKey)}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:block sm:flex-1" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NOS VALEURS */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14">
          <div className="text-center mb-10 sm:mb-12">
            <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
              {t("histoire.values_overline")}
            </span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
              {t("histoire.values_title")}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            {VALUE_KEYS.map((v, i) => (
              <div key={v.t} className="bg-[#F8F5EF] rounded-2xl sm:rounded-3xl p-6 sm:p-7">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-display text-3xl sm:text-4xl font-black text-[#D4AF37]/40 tabular-nums leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#0F7C55]">
                    {t(v.t)}
                  </h3>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-6 sm:leading-7">
                  {t(v.d)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CITATION SPIRITUELLE */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[45px] bg-gradient-to-br from-[#0F7C55] via-[#0A3D24] to-[#082F22] p-6 sm:p-12 md:p-14 text-white text-center">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <p className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose text-[#D4AF37]" dir="rtl">
              مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا
            </p>
            <p className="mt-6 italic text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
              {t("histoire.quote_text")}
            </p>
            <p className="mt-3 text-xs sm:text-sm text-[#D4AF37]/90">
              {t("histoire.quote_attr")}
            </p>
            <p className="mt-6 sm:mt-8 max-w-2xl mx-auto text-sm sm:text-base text-white/80 leading-7">
              {t("histoire.quote_closing")}
            </p>
          </div>
        </div>
      </section>

      {/* CTAs FINAUX */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-[#0F7C55] text-2xl mb-5">
            <FaHandHoldingHeart />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F7C55]">
            {t("histoire.cta_title")}
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t("histoire.cta_desc")}
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
            <a
              href={JOIN_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] px-6 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition text-sm sm:text-base"
            >
              {t("histoire.cta_member")} →
            </a>
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#0F7C55] hover:bg-[#0A3D24] text-white px-6 py-4 rounded-2xl font-bold shadow-xl transition text-sm sm:text-base"
            >
              <FaWhatsapp /> {t("histoire.cta_contact")}
            </a>
          </div>

          <div className="mt-6 flex justify-center">
            <ShareButton
              title={t("histoire.share_title")}
              text={t("histoire.share_text")}
              variant="ghost"
              label={t("histoire.share_label")}
            />
          </div>
        </div>
      </section>
    </>
  );
}
