"use client";

import PageHero from "@/components/layout/PageHero";
import { FaWhatsapp, FaCircleCheck } from "react-icons/fa6";
import { JOIN_WHATSAPP_LINK } from "@/lib/constants";
import { useT } from "@/lib/i18n/context";

export default function InscriptionContent() {
  const { t } = useT();

  const benefits = [
    t("inscription.b1"),
    t("inscription.b2"),
    t("inscription.b3"),
    t("inscription.b4"),
    t("inscription.b5"),
  ];

  return (
    <>
      <PageHero
        overline={t("inscription.overline")}
        title={t("inscription.title")}
        arabic={t("inscription.arabic")}
        description={t("inscription.desc")}
      />

      <section className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28 -mt-8 sm:-mt-12">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[40px] bg-gradient-to-br from-[#0F7C55] via-[#0A3D24] to-[#082F22] text-white p-7 sm:p-10 md:p-12 shadow-2xl text-center">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#D4AF37]/15 blur-3xl" />
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#25D366] text-white flex items-center justify-center text-4xl shadow-xl mb-5">
              <FaWhatsapp />
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              {t("inscription.contact_title")}
            </h2>
            <p className="text-white/80 text-sm sm:text-base mt-3 leading-7 max-w-md mx-auto">
              {t("inscription.contact_desc")}
            </p>

            <ul className="mt-7 space-y-2.5 text-left max-w-sm mx-auto">
              {benefits.map((line) => (
                <li
                  key={line}
                  className="flex gap-2.5 items-start text-sm text-white/90"
                >
                  <FaCircleCheck className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <a
              href={JOIN_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold px-8 py-4 sm:py-5 rounded-2xl shadow-xl hover:scale-[1.03] active:scale-100 transition text-base"
            >
              <FaWhatsapp className="text-xl" /> {t("inscription.btn")}
            </a>
            <p className="text-[11px] text-white/60 mt-4">
              {t("inscription.note")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
