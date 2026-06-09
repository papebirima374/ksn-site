"use client";

import { LINKS } from "@/lib/constants";
import { useT } from "@/lib/i18n/context";

const CARD_KEYS = [
  { icon: "📜", t: "ledahira.card1_title", d: "ledahira.card1_text" },
  { icon: "🏛️", t: "ledahira.card2_title", d: "ledahira.card2_text" },
  { icon: "👥", t: "ledahira.card3_title", d: "ledahira.card3_text" },
  { icon: "📚", t: "ledahira.card4_title", d: "ledahira.card4_text" },
  { icon: "📈", t: "ledahira.card5_title", d: "ledahira.card5_text" },
];

export default function LeDahira() {
  const { t } = useT();
  return (
    <section
      id="dahira"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28 pt-6 sm:pt-10"
    >
      <div className="bg-white rounded-[28px] sm:rounded-[40px] p-6 sm:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
        <div className="text-center">
          <span className="text-[#B8860B] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-semibold text-xs sm:text-sm">
            {t("ledahira.overline")}
          </span>

          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
            {t("ledahira.title_l1")}
            <br />
            {t("ledahira.title_l2")}
          </h2>

          <p className="mt-5 sm:mt-6 text-gray-600 max-w-3xl mx-auto leading-7 sm:leading-8 text-sm sm:text-base">
            {t("ledahira.intro")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-10 sm:mt-14">
          {CARD_KEYS.map((card) => (
            <div
              key={card.t}
              className="bg-[#F8F5EF] rounded-[20px] sm:rounded-[30px] p-6 sm:p-8"
            >
              <div className="text-4xl sm:text-5xl">{card.icon}</div>
              <h3 className="font-display mt-4 sm:mt-5 text-xl sm:text-2xl font-bold text-[#0F7C55]">
                {t(card.t)}
              </h3>
              <p className="mt-3 sm:mt-4 text-gray-600 leading-6 sm:leading-7 text-sm sm:text-base">
                {t(card.d)}
              </p>
            </div>
          ))}

          <div className="bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-[20px] sm:rounded-[30px] p-6 sm:p-8 text-[#0F7C55]">
            <div className="text-4xl sm:text-5xl">✨</div>

            <h3 className="font-display mt-4 sm:mt-5 text-xl sm:text-2xl font-bold">
              {t("ledahira.join_title")}
            </h3>

            <p className="mt-3 sm:mt-4 leading-6 sm:leading-7 text-sm sm:text-base">
              {t("ledahira.join_text")}
            </p>

            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-6 sm:mt-8 bg-[#0F7C55] text-white px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base"
            >
              {t("ledahira.join_cta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
