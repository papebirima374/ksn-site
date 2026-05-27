"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaBolt } from "react-icons/fa6";
import {
  estimatedChallengeStats,
  CHALLENGE_TARGET,
  fmtNumber,
  progressTowardTarget,
  type ChallengeStats,
} from "@/lib/challenge";
import { useVisibleInterval } from "@/lib/useVisibleInterval";

const STORAGE_KEY = "ksn-salaatu-count";
const DATE_KEY = "ksn-salaatu-date";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/** Mini-compteur sur la home : teaser du Challenge 1 Milliard.
 *  Partage la meme source de donnees que /challenge (lib/challenge.ts)
 *  pour eviter toute incoherence de chiffres entre pages. */
export default function CompteurSalaatu() {
  // IMPORTANT : on initialise a null pour eviter une hydration mismatch.
  // estimatedChallengeStats() depend de Date.now() qui differe entre le
  // rendu serveur (SSR) et l'hydratation client. On remplit en useEffect.
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const [displayTotal, setDisplayTotal] = useState(0);
  const [personal, setPersonal] = useState(0);
  const [pulse, setPulse] = useState(false);
  const raf = useRef<number | null>(null);

  // Tick initial cote client uniquement
  useEffect(() => {
    setStats(estimatedChallengeStats());
  }, []);

  // Refresh stats brutes — uniquement quand l'onglet est visible
  useVisibleInterval(() => setStats(estimatedChallengeStats()), 1000);

  // Animation fluide du compteur : on s'arrete des qu'on a rattrape la cible
  // pour eviter une boucle rAF infinie qui chauffe le mobile.
  useEffect(() => {
    if (!stats) return;
    const target = stats.total;
    function tick() {
      let reached = false;
      setDisplayTotal((current) => {
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
  }, [stats]);

  // Compteur personnel quotidien (localStorage)
  useEffect(() => {
    const today = todayKey();
    const savedDate = localStorage.getItem(DATE_KEY);
    let val = 0;
    if (savedDate !== today) {
      localStorage.setItem(DATE_KEY, today);
      localStorage.setItem(STORAGE_KEY, "0");
    } else {
      val = Number(localStorage.getItem(STORAGE_KEY) || "0");
    }
    setPersonal(val);
  }, []);

  const increment = () => {
    const next = personal + 1;
    setPersonal(next);
    localStorage.setItem(STORAGE_KEY, String(next));
    localStorage.setItem(DATE_KEY, todayKey());
    setPulse(true);
    setTimeout(() => setPulse(false), 200);
  };

  const reset = () => {
    if (confirm("Réinitialiser votre compteur du jour ?")) {
      setPersonal(0);
      localStorage.setItem(STORAGE_KEY, "0");
    }
  };

  const percent = progressTowardTarget(displayTotal);

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[45px] bg-gradient-to-br from-[#0F7C55] via-[#0A3D24] to-[#082F22] p-6 sm:p-12 md:p-16 text-white">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#B8860B]/10 blur-3xl" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* COLONNE GAUCHE — TEASER DU CHALLENGE */}
          <div className="text-center lg:text-left">
            <p className="font-arabic text-3xl sm:text-4xl text-[#D4AF37] mb-3">
              صلى الله على محمد
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 mb-4">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              <span className="uppercase tracking-[0.2em] text-[#D4AF37] text-[10px] sm:text-xs font-bold">
                Challenge 1 Milliard
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Salaatu offerts par
              <br />
              la communauté KSN
            </h2>

            <div className="font-display mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tabular-nums tracking-tight">
              {fmtNumber(displayTotal)}
            </div>

            <p className="mt-3 text-sm sm:text-base text-white/70">
              sur{" "}
              <span className="text-[#D4AF37] font-semibold">
                {fmtNumber(CHALLENGE_TARGET)}
              </span>{" "}
              — Challenge du milliard
            </p>

            <div className="mt-6 sm:mt-8 max-w-md mx-auto lg:mx-0">
              <div className="h-2 sm:h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#F5D76E] rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.max(percent, 0.5)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 sm:mt-3 text-xs text-white/60 tracking-wider tabular-nums">
                <span className="text-[#D4AF37] font-bold">{percent.toFixed(3)} %</span>
                <span>1 Milliard 🎯</span>
              </div>
            </div>

            <Link
              href="/challenge"
              className="inline-flex items-center gap-2 mt-7 sm:mt-9 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl shadow-xl hover:scale-105 transition text-sm sm:text-base"
            >
              Voir le Challenge complet
              <FaArrowRight className="text-sm" />
            </Link>
          </div>

          {/* COLONNE DROITE — COMPTEUR PERSO */}
          <div className="relative">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] sm:rounded-[35px] p-6 sm:p-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
                <FaBolt className="text-[#D4AF37] text-xs" />
                <span className="uppercase tracking-[0.2em] text-[#D4AF37] text-[10px] sm:text-xs font-bold">
                  Mon Compteur du Jour
                </span>
              </div>

              <div
                className={`font-display mt-2 text-6xl sm:text-7xl md:text-8xl font-bold tabular-nums transition-transform ${
                  pulse ? "scale-110 text-[#D4AF37]" : "text-white"
                }`}
              >
                {personal}
              </div>

              <p className="mt-3 text-white/60 text-xs sm:text-sm">
                Salaatu compté(s) aujourd&apos;hui
              </p>

              <button
                type="button"
                onClick={increment}
                className="mt-6 sm:mt-8 w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:scale-105 active:scale-95 transition"
              >
                + 1 Salaatu
              </button>

              <button
                type="button"
                onClick={reset}
                className="mt-3 text-xs sm:text-sm text-white/50 hover:text-white/80 transition underline"
              >
                Réinitialiser
              </button>

              <p className="mt-5 sm:mt-6 text-xs text-white/50 italic">
                « Allah prie 10 fois sur celui qui prie une fois sur le Prophète
                ﷺ »
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
