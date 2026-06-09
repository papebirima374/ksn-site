"use client";

import Link from "next/link";
import { FaWhatsapp, FaCircleQuestion } from "react-icons/fa6";
import PageHero from "@/components/layout/PageHero";
import FaqAccordion from "@/components/sections/FaqAccordion";
import ShareButton from "@/components/ui/ShareButton";
import { LINKS, SITE } from "@/lib/constants";
import { useT } from "@/lib/i18n/context";

export default function FaqContent() {
  const { t } = useT();

  const faqCategories = [
    {
      title: t("faq.cat1_title"),
      questions: [
        { q: t("faq.q1_1"), a: t("faq.a1_1") },
        { q: t("faq.q1_2"), a: t("faq.a1_2") },
        { q: t("faq.q1_3"), a: t("faq.a1_3") },
      ],
    },
    {
      title: t("faq.cat2_title"),
      questions: [
        { q: t("faq.q2_1"), a: t("faq.a2_1") },
        { q: t("faq.q2_2"), a: t("faq.a2_2") },
        { q: t("faq.q2_3"), a: t("faq.a2_3") },
        { q: t("faq.q2_4"), a: t("faq.a2_4") },
      ],
    },
    {
      title: t("faq.cat3_title"),
      questions: [
        { q: t("faq.q3_1"), a: t("faq.a3_1") },
        { q: t("faq.q3_2"), a: t("faq.a3_2") },
        { q: t("faq.q3_3"), a: t("faq.a3_3") },
      ],
    },
    {
      title: t("faq.cat4_title"),
      questions: [
        { q: t("faq.q4_1"), a: t("faq.a4_1") },
        { q: t("faq.q4_2"), a: t("faq.a4_2") },
        { q: t("faq.q4_3"), a: t("faq.a4_3") },
      ],
    },
    {
      title: t("faq.cat5_title"),
      questions: [
        { q: t("faq.q5_1"), a: t("faq.a5_1") },
        { q: t("faq.q5_2"), a: t("faq.a5_2") },
      ],
    },
    {
      title: t("faq.cat6_title"),
      questions: [
        { q: t("faq.q6_1"), a: t("faq.a6_1") },
        { q: t("faq.q6_2"), a: t("faq.a6_2") },
        { q: t("faq.q6_3"), a: t("faq.a6_3") },
      ],
    },
  ];

  const allQuestions = faqCategories.flatMap((c) => c.questions);

  return (
    <>
      <PageHero
        overline={t("faq.overline")}
        title={t("faq.title")}
        arabic={t("faq.arabic")}
        description={t("faq.desc")}
      />

      {/* SOMMAIRE RAPIDE */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-10">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold mb-3">
            {t("faq.summary")
              .replace("{sectionCount}", faqCategories.length.toString())
              .replace("{questionCount}", allQuestions.length.toString())}
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {faqCategories.map((c) => (
              <a
                key={c.title}
                href={`#${c.title.replace(/\s+/g, "-").toLowerCase()}`}
                className="text-white/80 hover:text-[#D4AF37] text-sm py-1.5 transition flex items-center gap-2"
              >
                <FaCircleQuestion className="text-[#D4AF37]" />
                {c.title}{" "}
                <span className="text-[10px] text-white/40 font-bold">
                  ({c.questions.length})
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ACCORDÉONS PAR CATÉGORIE */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 space-y-12 sm:space-y-16">
        {faqCategories.map((cat, ci) => (
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
            {t("faq.extra_title")}
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t("faq.extra_desc")}
          </p>

          <div className="mt-7 sm:mt-9 grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#0F7C55] hover:bg-[#0A3D24] text-white px-6 py-4 rounded-2xl font-bold shadow-xl transition text-sm sm:text-base"
            >
              <FaWhatsapp /> {t("faq.extra_btn")}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] px-6 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition text-sm sm:text-base"
            >
              {t("faq.extra_contact")}
            </Link>
          </div>

          <div className="mt-6 flex justify-center">
            <ShareButton
              title="FAQ — Dahira KSN"
              text="Trouvez les réponses à toutes vos questions sur le Dahira Kippangog Salaatu ʿAlaa Nabii."
              variant="ghost"
              label={t("faq.extra_share")}
            />
          </div>

          <p className="mt-6 text-xs text-gray-500 font-semibold">
            {t("site.tagline")} — {t("site.location")}
          </p>
        </div>
      </section>
    </>
  );
}
