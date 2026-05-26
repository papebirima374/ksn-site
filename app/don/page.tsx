import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import { FaWhatsapp } from "react-icons/fa6";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Faire un Don",
  description:
    "Soutenez le Dahira Kippangog Salaatu 'Alaa Nabii via Orange Money, Wave, virement bancaire ou WhatsApp.",
};

const DON_METHODS = [
  {
    title: "Orange Money",
    icon: "🟠",
    description: "Envoyez votre don via Orange Money au numéro officiel KSN.",
    detail: "Numéro officiel : à confirmer",
  },
  {
    title: "Wave",
    icon: "🌊",
    description: "Effectuez votre don rapidement via l'application Wave.",
    detail: "Numéro officiel : à confirmer",
  },
  {
    title: "Virement Bancaire",
    icon: "🏦",
    description: "Pour les dons importants ou internationaux.",
    detail: "Coordonnées sur demande WhatsApp",
  },
];

export default function DonPage() {
  return (
    <>
      <PageHero
        overline="Soutenir le Dahira"
        title="Faire un Don"
        arabic="وَأَنفِقُوا فِي سَبِيلِ اللَّهِ"
        description="Votre don soutient les activités spirituelles, l'éducation, la solidarité et le rayonnement international du Dahira KSN."
      />

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-16">

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {DON_METHODS.map((m) => (
              <div
                key={m.title}
                className="bg-[#F8F5EF] rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 hover:-translate-y-2 duration-300 shadow-md transition"
              >
                <div className="text-5xl">{m.icon}</div>
                <h3 className="font-display mt-4 sm:mt-5 text-xl sm:text-2xl font-bold text-[#0F5132]">
                  {m.title}
                </h3>
                <p className="mt-3 sm:mt-4 text-gray-600 leading-6 sm:leading-7 text-sm sm:text-base">
                  {m.description}
                </p>
                <p className="mt-3 text-[#B8860B] text-sm font-semibold">
                  {m.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-14 bg-gradient-to-br from-[#0F5132] to-[#082F22] rounded-[24px] sm:rounded-[35px] p-8 sm:p-12 text-center text-white">
            <h3 className="font-display text-2xl sm:text-3xl font-bold">
              Contacter pour faire un don
            </h3>

            <p className="mt-4 text-white/75 leading-7 sm:leading-8 max-w-2xl mx-auto text-sm sm:text-base">
              Pour obtenir les coordonnées exactes ou organiser un don, contactez
              directement l&apos;équipe officielle via WhatsApp. Nous vous
              répondrons rapidement.
            </p>

            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 mt-8 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold shadow-xl hover:scale-105 transition"
            >
              <FaWhatsapp className="text-xl sm:text-2xl" />
              Contacter sur WhatsApp
            </a>
          </div>

          <p className="mt-8 text-center text-gray-500 text-xs sm:text-sm italic max-w-2xl mx-auto">
            « Celui qui fait l&apos;aumône avec l&apos;équivalent d&apos;une
            datte gagnée licitement, Allah la prend et la fait fructifier comme
            l&apos;un de vous élève son poulain. » — Hadith
          </p>
        </div>
      </section>
    </>
  );
}
