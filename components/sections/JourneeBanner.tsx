import Link from "next/link";
import { FaArrowRight, FaLocationDot, FaCalendarDays } from "react-icons/fa6";
import EventCountdown from "@/components/sections/EventCountdown";

// Date synchronisee avec /journee-salaatu (lib partagee a creer si plusieurs
// points de presence). Pour l'instant la date vit ici + dans la page dediee :
// les deux endroits a mettre a jour pour la prochaine edition.
const EVENT_DATE_ISO = "2026-12-26T08:00:00+00:00";
const EVENT_DATE_LABEL = "26 décembre 2026";

/** Banniere de l'accueil annonçant la prochaine Journee Salaatu 'Alaa Nabii.
 *  Reutilise le composant EventCountdown deja construit. */
export default function JourneeBanner() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[45px] bg-gradient-to-br from-[#B8860B] via-[#D4AF37] to-[#B8860B] p-6 sm:p-12 md:p-16 text-[#0F7C55]">
        {/* Decorative glows */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/25 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#0F7C55]/20 blur-[120px] pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-14 items-center">
          {/* COLONNE GAUCHE — TEXTE */}
          <div className="text-center lg:text-left">
            <p
              className="font-arabic text-3xl sm:text-4xl text-[#0F7C55] mb-3"
              dir="rtl"
            >
              يوم الصلاة على النبي ﷺ
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F7C55] text-[#D4AF37] mb-5">
              <FaCalendarDays className="text-xs" />
              <span className="uppercase tracking-[0.2em] text-[10px] sm:text-xs font-bold">
                Événement annuel
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Journée Salaatu
              <br />
              ʿAlaa Nabii
            </h2>

            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#0F7C55]/85 leading-7 max-w-xl mx-auto lg:mx-0">
              La oumma KSN se réunit à Touba pour une journée entière de
              prières, chants et dhikr collectif autour du Prophète Muhammad ﷺ.
            </p>

            <div className="mt-5 flex flex-wrap justify-center lg:justify-start gap-4 text-xs sm:text-sm font-bold">
              <span className="inline-flex items-center gap-2 text-[#0F7C55]">
                <FaCalendarDays /> {EVENT_DATE_LABEL}
              </span>
              <span className="inline-flex items-center gap-2 text-[#0F7C55]">
                <FaLocationDot /> Touba, Sénégal
              </span>
            </div>

            <Link
              href="/journee-salaatu"
              className="inline-flex items-center gap-2 mt-7 sm:mt-9 bg-[#0F7C55] hover:bg-[#0A3D24] text-[#D4AF37] font-bold px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl shadow-xl hover:scale-105 transition text-sm sm:text-base"
            >
              Découvrir la journée
              <FaArrowRight className="text-sm" />
            </Link>
          </div>

          {/* COLONNE DROITE — COMPTE A REBOURS */}
          <div className="w-full lg:w-[440px]">
            <EventCountdown
              target={EVENT_DATE_ISO}
              passedLabel="La Journée a eu lieu — à très bientôt pour la prochaine édition."
            />
            <p className="mt-4 text-center text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#0F7C55]/80 font-bold">
              Avant le grand rassemblement
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
