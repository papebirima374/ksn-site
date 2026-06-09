"use client";

import { FaQuoteLeft } from "react-icons/fa6";
import { useT } from "@/lib/i18n/context";

export default function MotDuPresident() {
  const { t } = useT();
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="relative overflow-hidden rounded-[32px] sm:rounded-[45px] bg-[#FAF8F3] border border-[#0F7C55]/15 shadow-xl p-8 sm:p-14 md:p-16">
        {/* Subtle Watermark background */}
        <div className="absolute right-[-40px] bottom-[-40px] w-72 h-72 opacity-[0.03] text-[#0F7C55] pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <text x="50" y="55" textAnchor="middle" className="font-serif font-bold" style={{ fontSize: "50px", fill: "currentColor" }}>
              ﷺ
            </text>
          </svg>
        </div>

        {/* Decorative Top Corners */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#D4AF37]/40 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#D4AF37]/40 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#D4AF37]/40 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#D4AF37]/40 rounded-br-lg" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#0F7C55]/10 flex items-center justify-center text-[#0F7C55] text-xl mb-6 shadow-inner">
            <FaQuoteLeft />
          </div>

          <span className="text-[#B8860B] uppercase tracking-[0.25em] font-semibold text-xs sm:text-sm">
            {t("section.direction_spirituelle")}
          </span>
          <h2 className="font-serif mt-3 text-2xl sm:text-3xl font-bold text-[#0F7C55]">
            {t("motpresident.title")}
          </h2>
          <p className="font-arabic mt-4 text-2xl text-[#D4AF37]">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>

          <div className="mt-8 text-gray-700 leading-8 sm:leading-9 font-serif text-base sm:text-lg max-w-3xl text-justify space-y-6">
            <p>{t("motpresident.p1")}</p>
            <p>{t("motpresident.p2")}</p>
            <p>{t("motpresident.p3")}</p>
          </div>

          {/* Signature block */}
          <div className="mt-10 sm:mt-12 text-center">
            <p className="font-serif text-[#0F7C55] font-extrabold text-lg sm:text-xl">
              Serigne Bassirou Touré
            </p>
            <p className="text-[#B8860B] uppercase tracking-wider text-[10px] sm:text-xs font-bold mt-1">
              {t("motpresident.signature_role")}
            </p>
            {/* Calligraphic flourish representation */}
            <div className="mt-4 font-serif text-[#D4AF37] text-2xl select-none leading-none opacity-85">
              ☘ ✍ ☘
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
