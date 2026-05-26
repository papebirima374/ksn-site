import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import { FaWhatsapp } from "react-icons/fa6";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Rejoindre la KSN",
  description:
    "Devenez membre officiel du Dahira Kippangog Salaatu 'Alaa Nabii. Adhésion, vie spirituelle et engagement communautaire.",
};

const BENEFITS = [
  {
    icon: "📿",
    title: "Vie spirituelle",
    text: "Participation aux Salaatou collectifs, Khassidas et activités spirituelles du Dahira.",
  },
  {
    icon: "🤝",
    title: "Communauté",
    text: "Fraternité, solidarité et entraide au sein d'une communauté internationale.",
  },
  {
    icon: "📚",
    title: "Éducation",
    text: "Conférences, enseignements, éducation islamique et formation spirituelle.",
  },
  {
    icon: "🌍",
    title: "Rayonnement",
    text: "Contribuer au rayonnement international du Salaatu sur le Prophète ﷺ.",
  },
];

export default function InscriptionPage() {
  return (
    <>
      <PageHero
        overline="Rejoindre la KSN"
        title="Devenir Membre du Dahira"
        arabic="مرحبا بكم"
        description="Devenez membre officiel et participez à cette mission spirituelle internationale au service du Salaatu sur le Prophète Muhammad ﷺ."
      />

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-16">

          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F5132]">
              Pourquoi rejoindre le Dahira ?
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto leading-7 text-sm sm:text-base">
              Une communauté spirituelle, fraternelle et engagée au service du
              Prophète Muhammad ﷺ.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="bg-[#F8F5EF] rounded-2xl p-5 sm:p-6 text-center"
              >
                <div className="text-4xl sm:text-5xl">{b.icon}</div>
                <h3 className="font-display mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-[#0F5132]">
                  {b.title}
                </h3>
                <p className="mt-2 sm:mt-3 text-gray-600 text-sm leading-6">
                  {b.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-14 bg-gradient-to-br from-[#0F5132] to-[#082F22] rounded-[24px] sm:rounded-[35px] p-8 sm:p-12 text-center text-white">
            <span className="uppercase tracking-[0.2em] text-[#D4AF37] text-xs sm:text-sm font-semibold">
              Inscription
            </span>

            <h3 className="font-display mt-4 text-2xl sm:text-3xl font-bold">
              Comment rejoindre la KSN ?
            </h3>

            <p className="mt-4 text-white/75 leading-7 sm:leading-8 max-w-2xl mx-auto text-sm sm:text-base">
              Pour adhérer au Dahira KSN, contactez l&apos;équipe officielle via
              WhatsApp. Nous vous guiderons dans les étapes d&apos;inscription
              et de participation.
            </p>

            <p className="mt-4 text-[#D4AF37] text-xs sm:text-sm italic">
              Un formulaire d&apos;inscription en ligne sera bientôt disponible.
            </p>

            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 mt-8 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold shadow-xl hover:scale-105 transition"
            >
              <FaWhatsapp className="text-xl sm:text-2xl" />
              Adhérer via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
