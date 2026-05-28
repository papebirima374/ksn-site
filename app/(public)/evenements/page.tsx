"use client";

import { useState, useEffect } from "react";
import PageHero from "@/components/layout/PageHero";
import { FaCalendarDays, FaClock, FaLocationDot, FaCalculator, FaMoon } from "react-icons/fa6";

type HijriDate = {
  day: string;
  month: string;
  year: string;
  full: string;
};

type IslamicEvent = {
  title: string;
  hijriDate: string;
  approxGregorianDate2026: string;
  description: string;
  category: "fete" | "mouride" | "evenement_ksn";
  location?: string;
  icon: string;
};

const EVENTS: IslamicEvent[] = [
  {
    title: "Nouvel An Hégire (1er Mouharram 1448)",
    hijriDate: "1 Mouharram 1448",
    approxGregorianDate2026: "16 Juin 2026",
    description: "Commémoration de l'hégire (migration du Prophète ﷺ de la Mecque à Médine) et début de la nouvelle année islamique.",
    category: "fete",
    icon: "🌙",
  },
  {
    title: "Achoura (Tamkharit)",
    hijriDate: "10 Mouharram 1448",
    approxGregorianDate2026: "25 Juin 2026",
    description: "Jour de jeûne recommandé commémorant le salut de Moïse et du peuple d'Israël. Au Sénégal, tradition de partage du couscous traditionnel.",
    category: "fete",
    icon: "🥣",
  },
  {
    title: "Grand Magal de Touba",
    hijriDate: "18 Safar 1448",
    approxGregorianDate2026: "1er Août 2026",
    description: "Événement mouride majeur commémorant le départ en exil de Cheikh Ahmadou Bamba au Gabon. Un grand moment de ferveur spirituelle, d'action de grâce et de partage à Touba.",
    category: "mouride",
    location: "Touba, Sénégal",
    icon: "🕌",
  },
  {
    title: "Gamou / Maouloud",
    hijriDate: "12 Rabi' al-Awwal 1448",
    approxGregorianDate2026: "25 Septembre 2026",
    description: "Célébration mondiale de la naissance du Prophète Muhammad ﷺ. Une nuit de chants religieux (Rajass/Khassida), conférences et prières.",
    category: "fete",
    icon: "✨",
  },
  {
    title: "Journée Salaatu 'Alaa Nabii (Édition 2026)",
    hijriDate: "—",
    approxGregorianDate2026: "26 Décembre 2026",
    description: "Grand rassemblement spirituel annuel du Dahira KSN dédié au récital collectif de prières sur le Prophète ﷺ.",
    category: "evenement_ksn",
    location: "Touba, Sénégal (et en ligne)",
    icon: "📿",
  },
  {
    title: "Nuit du Destin (Laylatul Qadr)",
    hijriDate: "27 Ramadan 1448",
    approxGregorianDate2026: "15 Mars 2027",
    description: "La nuit la plus sainte de l'année, meilleure que mille mois, au cours de laquelle le Saint Coran a commencé à être révélé.",
    category: "fete",
    icon: "📖",
  },
  {
    title: "Aïd al-Fitr (Korité)",
    hijriDate: "1er Shawwal 1448",
    approxGregorianDate2026: "19 Mars 2027",
    description: "Fête marquant la fin du mois sacré de Ramadan. Prière collective au lever du jour et rassemblements familiaux.",
    category: "fete",
    icon: "🌙",
  },
  {
    title: "Aïd al-Adha (Tabaski)",
    hijriDate: "10 Dhou al-Hijja 1448",
    approxGregorianDate2026: "26 Mai 2027",
    description: "La fête du sacrifice commémorant la dévotion d'Ibrahim. Célébrée par le sacrifice d'un mouton et le partage avec les nécessiteux.",
    category: "fete",
    icon: "🐑",
  },
];

export default function EvenementsPage() {
  const [currentHijri, setCurrentHijri] = useState<HijriDate | null>(null);
  const [calcGregorian, setCalcGregorian] = useState("");
  const [calcHijri, setCalcHijri] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "fete" | "mouride" | "evenement_ksn">("all");

  // Get current Hijri Date using native Intl API
  useEffect(() => {
    try {
      const formatter = new Intl.DateTimeFormat("fr-FR-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const parts = formatter.formatToParts(new Date());
      const day = parts.find((p) => p.type === "day")?.value || "";
      const month = parts.find((p) => p.type === "month")?.value || "";
      const year = parts.find((p) => p.type === "year")?.value || "";
      
      setCurrentHijri({
        day,
        month,
        year,
        full: `${day} ${month} ${year}`,
      });
    } catch (e) {
      console.error("Intl Hijri translation not supported in this browser", e);
    }
  }, []);

  const handleConvert = (dateStr: string) => {
    setCalcGregorian(dateStr);
    if (!dateStr) {
      setCalcHijri("");
      return;
    }
    try {
      const date = new Date(dateStr);
      const formatter = new Intl.DateTimeFormat("fr-FR-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setCalcHijri(formatter.format(date));
    } catch {
      setCalcHijri("Erreur de conversion");
    }
  };

  const filteredEvents = activeCategory === "all"
    ? EVENTS
    : EVENTS.filter((e) => e.category === activeCategory);

  return (
    <>
      <PageHero
        overline="Calendrier & Fêtes religieuses"
        title="Événements Islamiques"
        arabic="التقويم الهجري والمناسبات"
        description="Consultez les dates clés du calendrier de l'Hégire et l'agenda des événements religieux de la communauté mouride et du Dahira KSN."
      />

      {/* HIJRI WIDGETS SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Current Hijri Date Box */}
          <div className="bg-gradient-to-br from-[#0F7C55] via-[#0A3D24] to-[#082F22] border border-[#D4AF37]/30 rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[220px]">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                <FaMoon className="text-sm" /> Date de l&apos;Hégire en direct
              </span>
              <span className="text-[10px] uppercase font-bold bg-white/10 px-2 py-0.5 rounded border border-white/10">
                Umm al-Qura
              </span>
            </div>
            
            {currentHijri ? (
              <div className="my-2">
                <p className="text-gray-300 text-xs sm:text-sm font-semibold">Aujourd&apos;hui nous sommes le :</p>
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#D4AF37] mt-1">
                  {currentHijri.full} H
                </h3>
              </div>
            ) : (
              <div className="animate-pulse flex space-x-4 py-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-10 bg-white/10 rounded"></div>
                </div>
              </div>
            )}

            <p className="text-[10px] text-white/50 leading-relaxed mt-2">
              Note : La date réelle peut varier d&apos;un jour selon l&apos;observation locale du croissant de lune (croissant lunaire).
            </p>
          </div>

          {/* Gregorian to Hijri Converter */}
          <div className="bg-white border border-[#E9E3D5] rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 shadow-xl flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B8860B] mb-4">
                <FaCalculator className="text-sm" /> Convertisseur de Calendrier
              </span>
              <div className="grid sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 ml-1 mb-1.5">
                    Date Grégorienne
                  </label>
                  <input
                    type="date"
                    value={calcGregorian}
                    onChange={(e) => handleConvert(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#0F7C55] text-xs sm:text-sm text-[#0F7C55] bg-gray-50 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 ml-1 mb-1.5">
                    Date Hégirienne
                  </label>
                  <div className="w-full rounded-xl border border-[#E9E3D5] p-3 text-xs sm:text-sm text-[#0F7C55] bg-[#F8F5EF] font-bold min-h-[46px] flex items-center">
                    {calcHijri || "Sélectionnez une date"}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed mt-4">
              Sélectionnez n&apos;importe quelle date grégorienne pour obtenir son équivalent astronomique dans le calendrier de l&apos;Hégire.
            </p>
          </div>

        </div>
      </section>

      {/* EVENTS CALENDAR AGENDA */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14 border border-[#E9E3D5]">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14">
            <div>
              <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
                Agenda Spirituel 2026 - 2027
              </span>
              <h2 className="font-display mt-3 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
                Grandes dates de la Oumma
              </h2>
            </div>
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              {[
                { id: "all", label: "Tous" },
                { id: "fete", label: "Fêtes & Commémorations" },
                { id: "mouride", label: "Mouridisme (Magal)" },
                { id: "evenement_ksn", label: "Événements KSN" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                    activeCategory === cat.id
                      ? "bg-[#0F7C55] text-white"
                      : "bg-[#F8F5EF] text-gray-500 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredEvents.map((evt, idx) => (
              <div
                key={idx}
                className="bg-[#F8F5EF] border border-[#E9E3D5] rounded-3xl p-6 sm:p-8 hover:shadow-lg transition flex gap-5 items-start relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#0F7C55]/5 rounded-full blur-xl pointer-events-none" />
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] flex items-center justify-center text-2xl sm:text-3xl text-white shadow-md flex-shrink-0">
                  {evt.icon}
                </div>
                
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      evt.category === "mouride"
                        ? "bg-[#D4AF37]/25 text-[#B8860B]"
                        : evt.category === "evenement_ksn"
                        ? "bg-[#0F7C55]/20 text-[#0F7C55]"
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {evt.category === "mouride" ? "Mouride" : evt.category === "evenement_ksn" ? "KSN" : "Général"}
                    </span>
                    {evt.location && (
                      <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                        <FaLocationDot className="text-gray-400" /> {evt.location}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-gray-800 text-base sm:text-lg leading-tight group-hover:text-[#B8860B] transition">
                    {evt.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs border-y border-gray-200/60 py-2.5 my-1">
                    <div className="flex items-center gap-1.5">
                      <FaCalendarDays className="text-[#0F7C55] text-xs" />
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Hégire</p>
                        <p className="font-bold text-gray-700">{evt.hijriDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaClock className="text-[#B8860B] text-xs" />
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Grégorien (Est.)</p>
                        <p className="font-bold text-gray-700">{evt.approxGregorianDate2026}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pt-1">
                    {evt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
