"use client";

import { useEffect, useState } from "react";
import { getSalaatuDuJour, listSalaatuLibrary } from "@/lib/admin-data";
import { isFirebaseConfigured } from "@/lib/firebase";
import { SalaatuDuJour, SalaatuLibraryItem } from "@/lib/admin-types";
import { pickSalaatuOfTheDay, SALAATU_FALLBACK } from "@/lib/salaatu-seed";
import { useT } from "@/lib/i18n/context";

const DEFAULT: SalaatuDuJour = {
  mode: "auto",
  arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
  translit: "Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad",
  translation: "Ô Allah, prie sur Muhammad et sur la famille de Muhammad.",
  title: "Salaatu Ibrahimiyya",
  lastUpdated: 0,
  lastUpdatedBy: "",
};

export default function SalaatouDuJour() {
  const { t } = useT();
  const [data, setData] = useState<SalaatuDuJour>(DEFAULT);
  const [library, setLibrary] = useState<SalaatuLibraryItem[]>([]);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    Promise.all([
      getSalaatuDuJour(),
      listSalaatuLibrary().catch(() => [] as SalaatuLibraryItem[]),
    ])
      .then(([s, lib]) => {
        if (s) setData({ ...DEFAULT, ...s });
        if (lib.length > 0) setLibrary(lib);
      })
      .catch(() => {});
  }, []);

  // Auto mode pulls today's Salaat from the library rotation; falls back
  // to whatever the admin saved manually if the library is empty.
  const mode = data.mode ?? "auto";
  const autoPick =
    mode === "auto"
      ? pickSalaatuOfTheDay(library.length > 0 ? library : SALAATU_FALLBACK)
      : null;

  const arabic = autoPick?.arabic ?? data.arabic;
  const translit = autoPick?.transliteration ?? data.translit;
  const translation = autoPick?.translation ?? data.translation;
  const title = autoPick?.title ?? data.title;

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-16">
        <div className="text-center">
          <span className="uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
            {t("salaatu.overline")}
          </span>

          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
            {title || t("salaatu.title")}
          </h2>

          {data.date && (
            <p className="mt-2 text-gray-500 text-sm italic">{data.date}</p>
          )}
        </div>

        <div className="mt-10 sm:mt-14 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-[#0F7C55] to-[#082F22] rounded-[24px] sm:rounded-[35px] p-8 sm:p-12 text-center text-white shadow-2xl">
            <p className="font-arabic text-3xl sm:text-4xl md:text-5xl leading-loose text-[#D4AF37]" dir="rtl">
              {arabic}
            </p>

            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto my-6" />

            {translit && (
              <p className="font-display italic text-lg sm:text-xl text-white/90 leading-relaxed">
                &ldquo;{translit}&rdquo;
              </p>
            )}

            {translation && (
              <p className="mt-5 text-base sm:text-lg text-white/80 leading-7 sm:leading-8">
                {translation}
              </p>
            )}
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-[#F8F5EF] rounded-2xl p-5 sm:p-6 text-center">
              <div className="text-3xl sm:text-4xl">📿</div>
              <h3 className="font-display mt-3 text-lg sm:text-xl font-bold text-[#0F7C55]">
                {t("salaatu.benefits")}
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                {t("salaatu.benefits_text")}
              </p>
            </div>

            <div className="bg-[#F8F5EF] rounded-2xl p-5 sm:p-6 text-center">
              <div className="text-3xl sm:text-4xl">🕌</div>
              <h3 className="font-display mt-3 text-lg sm:text-xl font-bold text-[#0F7C55]">
                {t("salaatu.when")}
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                {t("salaatu.when_text")}
              </p>
            </div>

            <div className="bg-[#F8F5EF] rounded-2xl p-5 sm:p-6 text-center">
              <div className="text-3xl sm:text-4xl">✨</div>
              <h3 className="font-display mt-3 text-lg sm:text-xl font-bold text-[#0F7C55]">
                {t("salaatu.reward")}
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                {t("salaatu.reward_text")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
