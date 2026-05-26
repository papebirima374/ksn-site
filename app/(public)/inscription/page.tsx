import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import InscriptionForm from "@/components/sections/InscriptionForm";
import CotisationStep from "@/components/sections/CotisationStep";

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

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-10 md:p-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F5132]">
              Pourquoi rejoindre le Dahira ?
            </h2>
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
        </div>
      </section>

      <InscriptionForm />
      <CotisationStep />
    </>
  );
}
