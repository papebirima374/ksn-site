"use client";

import { useT } from "@/lib/i18n/context";

export default function Stats() {
  const { t } = useT();
  const STATS = [
    { value: "2021", label: t("stats.creation") },
    { value: "255K+", label: t("stats.social") },
    { value: "9.5K+", label: t("stats.members") },
    { value: "4.3K+", label: t("stats.app_users") },
  ];

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28 pt-6 sm:pt-10">
      <div className="bg-white rounded-[28px] sm:rounded-[45px] p-6 sm:p-10 md:p-14 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
        <div className="text-center mb-10 sm:mb-14">
          <span className="uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
            {t("stats.overline")}
          </span>

          <h2 className="font-display mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
            {t("stats.title")}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-[#F8F5EF] rounded-[20px] sm:rounded-[30px] p-4 sm:p-8 text-center hover:scale-105 transition"
            >
              <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
                {s.value}
              </h3>
              <p className="mt-2 sm:mt-3 text-gray-600 text-xs sm:text-base">
                {s.label}
              </p>
            </div>
          ))}

          <div className="bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-[20px] sm:rounded-[30px] p-4 sm:p-8 text-center text-[#0F7C55] hover:scale-105 transition col-span-2 md:col-span-1">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold">🌍</h3>
            <p className="mt-2 sm:mt-3 font-semibold text-xs sm:text-base">
              {t("stats.international")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
