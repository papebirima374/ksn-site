"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ksn-salaatu-count";
const DATE_KEY = "ksn-salaatu-date";

const BASE_GLOBAL = 127_384_219;
const PER_SECOND = 7;
const OBJECTIF = 1_000_000_000;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function CompteurSalaatu() {
  const [personal, setPersonal] = useState(0);
  const [global, setGlobal] = useState(BASE_GLOBAL);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const today = todayKey();
    const savedDate = localStorage.getItem(DATE_KEY);
    if (savedDate !== today) {
      localStorage.setItem(DATE_KEY, today);
      localStorage.setItem(STORAGE_KEY, "0");
      setPersonal(0);
    } else {
      setPersonal(Number(localStorage.getItem(STORAGE_KEY) || "0"));
    }
  }, []);

  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - start) / 1000;
      setGlobal(BASE_GLOBAL + Math.floor(elapsed * PER_SECOND));
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
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

  const percentage = (global / OBJECTIF) * 100;

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[45px] bg-gradient-to-br from-[#0F5132] via-[#0A3D24] to-[#082F22] p-6 sm:p-12 md:p-16 text-white">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#B8860B]/10 blur-3xl" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">

          <div className="text-center lg:text-left">
            <p className="font-arabic text-3xl sm:text-4xl text-[#D4AF37] mb-3">
              صلى الله على محمد
            </p>

            <span className="uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#D4AF37] text-xs sm:text-sm font-semibold">
              Compteur Communautaire
            </span>

            <h2 className="font-display mt-3 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Salaatou offerts par
              <br />
              la communauté KSN
            </h2>

            <div className="font-display mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tabular-nums tracking-tight">
              {global.toLocaleString("fr-FR")}
            </div>

            <p className="mt-3 text-sm sm:text-base text-white/70">
              sur{" "}
              <span className="text-[#D4AF37] font-semibold">
                {OBJECTIF.toLocaleString("fr-FR")}
              </span>{" "}
              — Challenge du milliard
            </p>

            <div className="mt-6 sm:mt-8 max-w-md mx-auto lg:mx-0">
              <div className="h-2 sm:h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 sm:mt-3 text-xs text-white/60 tracking-wider">
                <span>{percentage.toFixed(2)} %</span>
                <span>1 Milliard</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] sm:rounded-[35px] p-6 sm:p-10 text-center">
              <span className="uppercase tracking-[0.2em] text-[#D4AF37] text-xs sm:text-sm font-semibold">
                Mon Compteur du Jour
              </span>

              <div
                className={`font-display mt-4 text-6xl sm:text-7xl md:text-8xl font-bold tabular-nums transition-transform ${
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
                className="mt-6 sm:mt-8 w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:scale-105 active:scale-95 transition"
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
