"use client";

import { fmtNumber } from "@/lib/challenge";
import { FaCrown, FaMedal } from "react-icons/fa6";

type DivisionRank = {
  rank: number;
  name: string;
  region: string;
  totalSalaatu: number;
  contributors: number;
  emoji: string;
};

const LEADERBOARD: DivisionRank[] = [
  {
    rank: 1,
    name: "Dahira KSN Touba Darou Miname",
    region: "Touba, Sénégal",
    totalSalaatu: 112_450_000,
    contributors: 850,
    emoji: "🕌",
  },
  {
    rank: 2,
    name: "Dahira KSN France & Europe",
    region: "Paris, Diaspora",
    totalSalaatu: 84_120_000,
    contributors: 520,
    emoji: "✈️",
  },
  {
    rank: 3,
    name: "Dahira KSN Dakar Grand-Yoff",
    region: "Dakar, Sénégal",
    totalSalaatu: 65_900_000,
    contributors: 410,
    emoji: "🌊",
  },
  {
    rank: 4,
    name: "Dahira KSN États-Unis & Canada",
    region: "New York, Diaspora",
    totalSalaatu: 48_300_000,
    contributors: 310,
    emoji: "🗽",
  },
  {
    rank: 5,
    name: "Dahira KSN Thiès Ville",
    region: "Thiès, Sénégal",
    totalSalaatu: 32_800_000,
    contributors: 220,
    emoji: "🚉",
  },
  {
    rank: 6,
    name: "Dahira KSN Mbacké Khayra",
    region: "Diourbel, Sénégal",
    totalSalaatu: 18_600_000,
    contributors: 140,
    emoji: "📿",
  },
];

export default function TableauHonneur() {
  const maxTotal = LEADERBOARD[0].totalSalaatu;

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14">
        <div className="text-center mb-10 sm:mb-14">
          <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
            Tableau d&apos;Honneur
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
            Les sections leaders
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Félicitations et prières pour nos sections locales à travers le monde. Voici le classement des sections les plus actives du Challenge 1 Milliard.
          </p>
        </div>

        {/* Podium cards for Top 3 */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 items-stretch">
          {/* Second Place */}
          <div className="order-2 md:order-1 bg-[#F8F5EF] border border-[#E9E3D5] rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center relative overflow-hidden group hover:shadow-lg transition">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-300/10 rounded-full blur-2xl" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-2xl mx-auto mb-4 text-slate-500 font-black relative">
                2
                <span className="absolute -top-2 -right-2 text-slate-400"><FaMedal /></span>
              </div>
              <span className="text-3xl mb-2 block">{LEADERBOARD[1].emoji}</span>
              <h3 className="font-display text-lg font-bold text-[#0F7C55] group-hover:text-[#B8860B] transition">
                {LEADERBOARD[1].name}
              </h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">{LEADERBOARD[1].region}</p>
            </div>
            <div className="mt-6 w-full">
              <p className="text-2xl font-black text-[#0F7C55] tabular-nums">
                {fmtNumber(LEADERBOARD[1].totalSalaatu)}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-1">
                {LEADERBOARD[1].contributors} contributeurs
              </p>
            </div>
          </div>

          {/* First Place */}
          <div className="order-1 md:order-2 bg-[#F8F5EF] border-2 border-[#D4AF37] rounded-[32px] p-8 sm:p-10 flex flex-col justify-between items-center text-center relative overflow-hidden shadow-xl shadow-[#D4AF37]/5 group hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all scale-100 md:scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#0F7C55] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <FaCrown /> Leader
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center text-3xl mx-auto mb-4 text-[#B8860B] font-black relative">
                1
                <span className="absolute -top-3 -right-2 text-[#D4AF37] animate-bounce"><FaCrown /></span>
              </div>
              <span className="text-4xl mb-3 block">{LEADERBOARD[0].emoji}</span>
              <h3 className="font-display text-xl font-black text-[#0F7C55] group-hover:text-[#B8860B] transition">
                {LEADERBOARD[0].name}
              </h3>
              <p className="text-xs text-gray-500 font-bold mt-1">{LEADERBOARD[0].region}</p>
            </div>
            <div className="mt-8 w-full">
              <p className="text-3xl font-black text-[#0F7C55] tabular-nums">
                {fmtNumber(LEADERBOARD[0].totalSalaatu)}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[#B8860B] font-bold mt-1">
                {LEADERBOARD[0].contributors} contributeurs
              </p>
            </div>
          </div>

          {/* Third Place */}
          <div className="order-3 bg-[#F8F5EF] border border-[#E9E3D5] rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center relative overflow-hidden group hover:shadow-lg transition">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#B8860B]/5 rounded-full blur-2xl" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#CD7F32]/10 border-2 border-[#CD7F32]/30 flex items-center justify-center text-2xl mx-auto mb-4 text-[#CD7F32] font-black relative">
                3
                <span className="absolute -top-2 -right-2 text-[#CD7F32]"><FaMedal /></span>
              </div>
              <span className="text-3xl mb-2 block">{LEADERBOARD[2].emoji}</span>
              <h3 className="font-display text-lg font-bold text-[#0F7C55] group-hover:text-[#B8860B] transition">
                {LEADERBOARD[2].name}
              </h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">{LEADERBOARD[2].region}</p>
            </div>
            <div className="mt-6 w-full">
              <p className="text-2xl font-black text-[#0F7C55] tabular-nums">
                {fmtNumber(LEADERBOARD[2].totalSalaatu)}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-1">
                {LEADERBOARD[2].contributors} contributeurs
              </p>
            </div>
          </div>
        </div>

        {/* Remainder list */}
        <div className="border border-[#E9E3D5] rounded-2xl overflow-hidden bg-[#F8F5EF]/50">
          <div className="divide-y divide-[#E9E3D5]">
            {LEADERBOARD.slice(3).map((item) => {
              const pct = (item.totalSalaatu / maxTotal) * 100;
              return (
                <div
                  key={item.rank}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 hover:bg-[#F8F5EF] transition gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-display font-bold text-gray-500 text-sm border border-gray-200">
                      {item.rank}
                    </span>
                    <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                    <div className="flex-1">
                      <h4 className="font-display font-bold text-gray-800 text-sm sm:text-base leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-400 font-semibold">{item.region}</p>

                      {/* Small progress visualization */}
                      <div className="mt-2 w-full max-w-[250px] h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#0F7C55] to-[#D4AF37] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right flex sm:flex-col justify-between items-center sm:items-end flex-wrap gap-2">
                    <span className="font-display font-bold text-[#0F7C55] text-base sm:text-lg tabular-nums">
                      {fmtNumber(item.totalSalaatu)} Salaatu
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                      {item.contributors} contributeurs
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
