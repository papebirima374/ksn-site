"use client";

import { useEffect, useRef, useState } from "react";
import {
  estimatedChallengeStats,
  CHALLENGE_TARGET,
  fmtNumber,
  progressTowardTarget,
  type ChallengeStats,
} from "@/lib/challenge";
import { useVisibleInterval } from "@/lib/useVisibleInterval";

type Tab = "thisWeek" | "lastWeek" | "today" | "thisMonth" | "lastMonth";

const TABS: { id: Tab; label: string }[] = [
  { id: "thisWeek", label: "Cette semaine" },
  { id: "lastWeek", label: "Semaine passée" },
  { id: "today", label: "Aujourd'hui" },
  { id: "thisMonth", label: "Ce mois-ci" },
  { id: "lastMonth", label: "Le mois passé" },
];

/** Compteur live du challenge 1 milliard.
 *  Aujourd'hui : estimation animee, basee sur le rythme reel de l'app.
 *  Demain : branche sur Firestore KIPPAANGOG via une 2e Firebase app. */
export default function ChallengeCounter() {
  const [stats, setStats] = useState<ChallengeStats>(() => estimatedChallengeStats());
  const [tab, setTab] = useState<Tab>("thisWeek");
  const [displayTotal, setDisplayTotal] = useState(stats.total);
  const raf = useRef<number | null>(null);

  // Mise a jour des stats brutes — pause quand l'onglet est cache
  useVisibleInterval(() => setStats(estimatedChallengeStats()), 1000);

  // Animation fluide du compteur principal (tween 60fps).
  // S'arrete des qu'on a rattrape la cible pour eviter une boucle rAF
  // infinie qui ferait chauffer l'iPhone.
  useEffect(() => {
    function tick() {
      let reached = false;
      setDisplayTotal((current) => {
        const target = stats.total;
        const diff = target - current;
        if (Math.abs(diff) < 1) {
          reached = true;
          return target;
        }
        return Math.floor(current + diff * 0.08);
      });
      if (!reached) {
        raf.current = requestAnimationFrame(tick);
      }
    }
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [stats.total]);

  const percent = progressTowardTarget(displayTotal);
  const tabValue = (() => {
    switch (tab) {
      case "thisWeek":
        return stats.thisWeek;
      case "lastWeek":
        return Math.floor(7 * 24 * 3600 * (7_000_000 / (7 * 24 * 60 * 60)));
      case "today":
        return stats.today;
      case "thisMonth":
        return stats.thisMonth;
      case "lastMonth":
        return stats.lastMonth;
    }
  })();

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[45px] bg-gradient-to-br from-[#0F7C55] via-[#0A3D24] to-[#082F22] p-6 sm:p-12 md:p-16 text-white">
        {/* Glows */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/15 blur-[160px]" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#B8860B]/10 blur-[140px]" />

        <div className="relative z-10 text-center">
          <p className="font-arabic text-3xl sm:text-4xl md:text-5xl text-[#D4AF37] mb-3">
            صلى الله على محمد
          </p>
          <p className="uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#D4AF37] text-xs sm:text-sm font-bold">
            Challenge KSN
          </p>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            1 Milliard de Salaatu
            <br />
            offerts au Prophète ﷺ
          </h2>

          {/* COMPTEUR PRINCIPAL */}
          <div className="mt-8 sm:mt-12">
            <p className="text-xs sm:text-sm uppercase tracking-widest text-white/60 font-semibold">
              Total cumulé par la communauté KSN
            </p>
            <div className="font-display mt-3 text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tabular-nums tracking-tight">
              {fmtNumber(displayTotal)}
            </div>
            <p className="mt-3 text-sm sm:text-base text-white/70">
              sur{" "}
              <span className="text-[#D4AF37] font-bold">
                {fmtNumber(CHALLENGE_TARGET)}
              </span>{" "}
              — Challenge du milliard
            </p>
          </div>

          {/* BARRE DE PROGRESSION */}
          <div className="mt-10 sm:mt-12 max-w-3xl mx-auto">
            <div className="h-3 sm:h-4 bg-white/10 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#F5D76E] rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${Math.max(percent, 0.5)}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between mt-3 text-xs sm:text-sm text-white/70 tracking-wider tabular-nums">
              <span className="font-bold text-[#D4AF37]">{percent.toFixed(3)} %</span>
              <span>1 Milliard 🎯</span>
            </div>
          </div>

          {/* INDICATEUR LIVE */}
          <div className="mt-6 sm:mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            {stats.isLive ? (
              <>
                <span className="relative flex w-2.5 h-2.5">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-bold text-emerald-300">
                  EN DIRECT — synchronisé avec l&apos;application KSN
                </span>
              </>
            ) : (
              <>
                <span className="text-[#D4AF37]">📊</span>
                <span className="text-xs font-medium text-white/70">
                  Estimation basée sur le rythme de l&apos;application (~7M/semaine)
                </span>
              </>
            )}
          </div>
        </div>

        {/* ONGLETS PAR PERIODE */}
        <div className="relative z-10 mt-12 sm:mt-16">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
                  tab === t.id
                    ? "bg-[#D4AF37] text-[#0F7C55]"
                    : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center backdrop-blur-md">
            <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
              {TABS.find((t) => t.id === tab)?.label}
            </p>
            <p className="font-display mt-3 text-4xl sm:text-5xl md:text-6xl font-bold text-white tabular-nums">
              {fmtNumber(tabValue)}
            </p>
            <p className="mt-2 text-sm text-white/60">Salaatu offerts au Prophète ﷺ</p>
          </div>
        </div>
      </div>
    </section>
  );
}
