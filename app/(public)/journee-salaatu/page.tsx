import type { Metadata } from "next";
import Link from "next/link";
import {
  FaWhatsapp,
  FaLocationDot,
  FaCalendarDays,
  FaClock,
  FaUsers,
  FaBookQuran,
  FaHandshakeAngle,
} from "react-icons/fa6";
import PageHero from "@/components/layout/PageHero";
import EventCountdown from "@/components/sections/EventCountdown";
import { LINKS, SITE } from "@/lib/constants";

// Anniversaire de fondation du Dahira : 2 janvier 2021.
// La Journée Salaatu 'Alaa Nabii commémore cette date chaque année.
// Date cible utilisée pour le compte à rebours : prochaine occurrence.
const EVENT_DATE_ISO = "2027-01-02T08:00:00+00:00"; // 2 janvier 2027, 08h GMT

export const metadata: Metadata = {
  title: "Journée Salaatu ʿAlaa Nabii",
  description:
    "Chaque 2 janvier, anniversaire de fondation du Dahira KSN, la oumma se réunit pour célébrer la Journée Salaatu ʿAlaa Nabii : prières, chants, conférences et dhikr collectif autour du Prophète Muhammad ﷺ.",
  openGraph: {
    title: "Journée Salaatu ʿAlaa Nabii — KSN",
    description:
      "L'événement spirituel annuel du Dahira Kippangog Salaatu ʿAlaa Nabii — 2 janvier, Touba.",
  },
};

const PROGRAM = [
  {
    time: "08h00 — 09h30",
    title: "Ouverture spirituelle",
    text: "Récitation du Saint Coran, ouverture par le Khalife du Dahira, salutation collective au Prophète ﷺ.",
  },
  {
    time: "09h30 — 11h30",
    title: "Conférences",
    text: "Interventions d'érudits et de cadres du Dahira sur la place du Salaatu dans la voie soufie et la mission de KSN.",
  },
  {
    time: "11h30 — 13h00",
    title: "Madih & Qasidas",
    text: "Chants de louange au Prophète ﷺ par les groupes de chanteurs du Dahira et des Dahiras invités.",
  },
  {
    time: "13h00 — 14h30",
    title: "Repas communautaire",
    text: "Berakhe — repas béni partagé par toute la oumma présente. Les invités étrangers sont les hôtes d'honneur.",
  },
  {
    time: "14h30 — 17h00",
    title: "Dhikr collectif géant",
    text: "Récitation collective massive du Salaatu visant à contribuer significativement au Challenge 1 Milliard.",
  },
  {
    time: "17h00 — 19h00",
    title: "Clôture & duas",
    text: "Bénédictions, remise des distinctions aux membres méritants, dua finale pour la oumma et l'humanité.",
  },
];

const HIGHLIGHTS = [
  {
    icon: <FaCalendarDays className="text-[#D4AF37] text-xl" />,
    title: "Date",
    text: "2 janvier de chaque année — anniversaire de fondation du Dahira (2 janvier 2021).",
  },
  {
    icon: <FaLocationDot className="text-[#D4AF37] text-xl" />,
    title: "Lieu",
    text: "Touba, Sénégal — capitale spirituelle de la voie mouride et siège du Dahira KSN.",
  },
  {
    icon: <FaUsers className="text-[#D4AF37] text-xl" />,
    title: "Public",
    text: "Membres KSN, invités étrangers, oumma de Touba et toute personne aimant le Prophète ﷺ.",
  },
  {
    icon: <FaClock className="text-[#D4AF37] text-xl" />,
    title: "Durée",
    text: "Journée complète — de l'aube après la prière du Soubh jusqu'au coucher du soleil.",
  },
];

export default function JourneeSalaatuPage() {
  return (
    <>
      <PageHero
        overline="Événement spirituel annuel"
        title="Journée Salaatu ʿAlaa Nabii"
        arabic="يوم الصلاة على النبي ﷺ"
        description="Chaque 2 janvier, anniversaire de fondation du Dahira KSN, la oumma se réunit à Touba pour une journée entière de prières, chants et dhikr autour du Prophète Muhammad ﷺ."
      />

      {/* COMPTE A REBOURS */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <EventCountdown target={EVENT_DATE_ISO} />
        <p className="text-center mt-4 text-white/60 text-xs sm:text-sm">
          Prochaine édition :{" "}
          <span className="text-[#D4AF37] font-semibold">
            2 janvier 2027 — Touba
          </span>
        </p>
      </section>

      {/* SENS SPIRITUEL */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14">
          <div className="text-center mb-10 sm:mb-12">
            <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
              Le sens de la Journée
            </span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
              Une oumma, un Prophète, une voix
            </h2>
            <p className="mt-5 max-w-3xl mx-auto text-gray-600 text-sm sm:text-base leading-7">
              Le 2 janvier 2021, le Dahira{" "}
              <strong>{SITE.fullName}</strong> a été fondé à Touba pour
              promouvoir la prière sur le Prophète Muhammad ﷺ à travers le
              monde. Chaque année, à cette même date, la communauté se réunit
              pour réaffirmer cette mission lors d&apos;une journée entière
              dédiée au Salaatu collectif.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.title}
                className="bg-[#F8F5EF] rounded-2xl sm:rounded-3xl p-5 sm:p-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] flex items-center justify-center mb-4">
                  {h.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-[#0F7C55]">
                  {h.title}
                </h3>
                <p className="mt-2 text-gray-600 text-sm leading-6">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMME */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="text-center mb-10 sm:mb-14">
          <span className="uppercase tracking-[0.25em] text-[#D4AF37] font-semibold text-xs sm:text-sm">
            Programme de la journée
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Six moments, une intention
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto text-sm sm:text-base">
            Le programme peut être ajusté chaque année par le Khalife — voici la
            trame habituelle suivie depuis 2021.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {PROGRAM.map((p, i) => (
            <div
              key={p.title}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 hover:bg-white/10 transition"
            >
              <div className="flex-shrink-0 sm:w-48">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <FaClock className="text-[#D4AF37] text-xs" />
                  <span className="text-[#D4AF37] text-xs sm:text-sm font-bold whitespace-nowrap">
                    {p.time}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-[#D4AF37]/50 text-2xl font-black tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                    {p.title}
                  </h3>
                </div>
                <p className="mt-2 text-white/70 text-sm sm:text-base leading-6 sm:leading-7">
                  {p.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CITATION SPIRITUELLE */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[45px] bg-gradient-to-br from-[#B8860B] via-[#D4AF37] to-[#B8860B] p-6 sm:p-12 md:p-14 text-[#0F7C55]">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 text-center">
            <FaBookQuran className="mx-auto text-3xl sm:text-4xl mb-4" />
            <p
              className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose"
              dir="rtl"
            >
              إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا
            </p>
            <p className="mt-6 italic text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              « Certes, Allah et Ses Anges prient sur le Prophète. Ô vous qui
              croyez, priez sur lui et adressez-lui vos salutations. »
            </p>
            <p className="mt-3 text-xs sm:text-sm font-bold">
              — Coran, sourate Al-Ahzâb (33), verset 56
            </p>
          </div>
        </div>
      </section>

      {/* PARTICIPER */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14">
          <div className="text-center mb-10 sm:mb-12">
            <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
              Participer à la Journée
            </span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
              Trois façons d&apos;être présent
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
            <div className="bg-[#F8F5EF] rounded-2xl sm:rounded-3xl p-6 sm:p-7">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] flex items-center justify-center text-white text-xl mb-4">
                <FaLocationDot />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#0F7C55]">
                Venir à Touba
              </h3>
              <p className="mt-3 text-gray-600 text-sm leading-6">
                Rejoignez physiquement la oumma au siège du Dahira. Contactez
                l&apos;équipe WhatsApp pour l&apos;hébergement et les détails
                pratiques.
              </p>
              <a
                href={LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-[#0F7C55] font-bold text-sm hover:underline"
              >
                <FaWhatsapp /> Contacter le Dahira
              </a>
            </div>

            <div className="bg-[#F8F5EF] rounded-2xl sm:rounded-3xl p-6 sm:p-7">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] flex items-center justify-center text-white text-xl mb-4">
                <FaUsers />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#0F7C55]">
                Participer à distance
              </h3>
              <p className="mt-3 text-gray-600 text-sm leading-6">
                Suivez le live sur YouTube et nos réseaux sociaux. Multipliez
                vos Salaatu depuis chez vous via l&apos;app KSN — ils comptent
                pour le Challenge 1 Milliard.
              </p>
              <Link
                href="/challenge"
                className="mt-5 inline-flex items-center gap-2 text-[#0F7C55] font-bold text-sm hover:underline"
              >
                Voir le Challenge →
              </Link>
            </div>

            <div className="bg-[#F8F5EF] rounded-2xl sm:rounded-3xl p-6 sm:p-7">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-[#0F7C55] text-xl mb-4">
                <FaHandshakeAngle />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#0F7C55]">
                Soutenir financièrement
              </h3>
              <p className="mt-3 text-gray-600 text-sm leading-6">
                L&apos;organisation de la journée (repas, sono, hébergement des
                invités) repose sur les dons des membres et sympathisants.
              </p>
              <Link
                href="/don"
                className="mt-5 inline-flex items-center gap-2 text-[#B8860B] font-bold text-sm hover:underline"
              >
                Faire un don dédié →
              </Link>
            </div>
          </div>

          {/* CTAs FINAUX */}
          <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] px-6 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition text-sm sm:text-base"
            >
              Rejoindre le Dahira →
            </Link>
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#0F7C55] hover:bg-[#0A3D24] text-white px-6 py-4 rounded-2xl font-bold shadow-xl transition text-sm sm:text-base"
            >
              <FaWhatsapp /> Recevoir les détails
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
