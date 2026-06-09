"use client";

import { useT } from "@/lib/i18n/context";

export default function Spiritualite() {
  const { t } = useT();

  const CARDS = [
    {
      icon: "📿",
      title: t("spiritualite.card1_title"),
      text: t("spiritualite.card1_desc"),
    },
    {
      icon: "📖",
      title: t("spiritualite.card2_title"),
      text: t("spiritualite.card2_desc"),
    },
    {
      icon: "🤲",
      title: t("spiritualite.card3_title"),
      text: t("spiritualite.card3_desc"),
    },
    {
      icon: "🎧",
      title: t("spiritualite.card4_title"),
      text: t("spiritualite.card4_desc"),
    },
    {
      icon: "🎥",
      title: t("spiritualite.card5_title"),
      text: t("spiritualite.card5_desc"),
    },
  ];

  return (
    <section
      id="spiritualite"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28"
    >
      <div className="bg-[#0F7C55] rounded-[40px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.2)]">
        <div className="p-6 sm:p-12 md:p-16">
          <div className="text-center">
            <span className="text-[#D4AF37] uppercase tracking-[0.25em] font-semibold">
              {t("section.spiritualite_ksn")}
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white">
              {t("section.spiritualite_title")}
            </h2>

            <p className="mt-6 text-white/70 text-lg max-w-3xl mx-auto leading-8">
              {t("spiritualite.desc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {CARDS.map((c) => (
              <div
                key={c.title}
                className="bg-white/10 border border-white/10 rounded-[30px] p-8 backdrop-blur-md hover:scale-[1.02] transition"
              >
                <div className="text-5xl">{c.icon}</div>
                <h3 className="mt-5 text-2xl font-bold text-white">
                  {c.title}
                </h3>
                <p className="mt-4 text-white/70 leading-7">{c.text}</p>
              </div>
            ))}

            <div className="bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-[30px] p-8 text-[#0F7C55]">
              <div className="text-5xl">✨</div>

              <h3 className="mt-5 text-2xl font-bold">
                {t("spiritualite.explore_title")}
              </h3>

              <p className="mt-4 leading-7">
                {t("spiritualite.explore_desc")}
              </p>

              <button
                type="button"
                className="mt-8 bg-[#0F7C55] text-white px-6 py-4 rounded-2xl font-semibold hover:opacity-90 transition"
              >
                {t("spiritualite.explore_btn")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
