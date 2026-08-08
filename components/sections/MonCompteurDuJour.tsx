"use client";

import { useEffect, useState } from "react";
import { FaBolt } from "react-icons/fa6";
import { useT } from "@/lib/i18n/context";

const STORAGE_KEY = "ksn-salaatu-count";
const DATE_KEY = "ksn-salaatu-date";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/** Compteur personnel quotidien (« Mon Compteur du Jour »).
 *  Stocké en local (localStorage), remis à 0 automatiquement chaque jour.
 *  Réutilisable : page d'accueil + page Challenge. */
export default function MonCompteurDuJour() {
  const { t } = useT();
  const [personal, setPersonal] = useState(0);
  const [pulse, setPulse] = useState(false);

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

    // Synchro entre onglets / pages : si le compteur change ailleurs
    // (autre onglet, ou l'autre exemplaire accueil↔challenge), on suit.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue != null) {
        setPersonal(Number(e.newValue) || 0);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = (n: number) => {
    setPersonal((prev) => {
      const next = prev + n;
      localStorage.setItem(STORAGE_KEY, String(next));
      localStorage.setItem(DATE_KEY, todayKey());
      return next;
    });
    setPulse(true);
    setTimeout(() => setPulse(false), 200);
  };

  const reset = () => {
    if (confirm(t("compteur.reset_confirm"))) {
      setPersonal(0);
      localStorage.setItem(STORAGE_KEY, "0");
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] sm:rounded-[35px] p-6 sm:p-10 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
        <FaBolt className="text-[#D4AF37] text-xs" />
        <span className="uppercase tracking-[0.2em] text-[#D4AF37] text-[10px] sm:text-xs font-bold">
          {t("compteur.perso_title")}
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
        {t("compteur.perso_desc")}
      </p>

      <button
        type="button"
        onClick={() => add(1)}
        className="mt-6 sm:mt-8 w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:scale-105 active:scale-95 transition"
      >
        {t("compteur.perso_btn")}
      </button>

      {/* Ajouts rapides */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[10, 33, 100].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => add(n)}
            className="bg-white/10 hover:bg-white/15 border border-white/15 text-white py-2.5 rounded-xl font-bold text-sm transition active:scale-95"
          >
            +{n}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={reset}
        className="mt-4 text-xs sm:text-sm text-white/50 hover:text-white/80 transition underline"
      >
        {t("compteur.reset")}
      </button>

      <p className="mt-5 sm:mt-6 text-xs text-white/50 italic">
        {t("compteur.hadith")}
      </p>
    </div>
  );
}
