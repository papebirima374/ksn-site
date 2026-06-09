"use client";

import { useT } from "@/lib/i18n/context";

const COMMISSIONS = [
  { icon: "📚", t: "commissions.c1_title", d: "commissions.c1_text" },
  { icon: "💰", t: "commissions.c2_title", d: "commissions.c2_text" },
  { icon: "🤝", t: "commissions.c3_title", d: "commissions.c3_text" },
  { icon: "🏛️", t: "commissions.c4_title", d: "commissions.c4_text" },
  { icon: "📢", t: "commissions.c5_title", d: "commissions.c5_text" },
  { icon: "🌍", t: "commissions.c6_title", d: "commissions.c6_text" },
  { icon: "📋", t: "commissions.c7_title", d: "commissions.c7_text" },
  { icon: "📝", t: "commissions.c8_title", d: "commissions.c8_text" },
];

export default function Commissions() {
  const { t } = useT();
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-[#0F7C55] rounded-[28px] sm:rounded-[45px] overflow-hidden p-6 sm:p-12 md:p-16 text-white relative">
        <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-[#D4AF37]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#B8860B]/10 blur-[120px] rounded-full" />

        <div className="relative z-10">
          <div className="text-center">
            <span className="uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              {t("section.organisation_ksn")}
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold">
              {t("section.commissions_title")}
            </h2>

            <p className="mt-6 text-white/70 max-w-3xl mx-auto leading-8">
              {t("commissions.intro")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mt-16">
            {COMMISSIONS.map((c) => (
              <div
                key={c.t}
                className="bg-white/10 backdrop-blur-md rounded-[30px] p-8 border border-white/10 hover:scale-[1.02] transition"
              >
                <div className="text-5xl">{c.icon}</div>
                <h3 className="mt-5 text-2xl font-bold text-[#D4AF37]">
                  {t(c.t)}
                </h3>
                <p className="mt-4 text-white/70 leading-7">{t(c.d)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
