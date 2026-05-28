"use client";

import { useEffect, useState } from "react";
import { useVisibleInterval } from "@/lib/useVisibleInterval";
import { getJourneeSettings } from "@/lib/admin-data";

type EventCountdownProps = {
  /** Date cible ISO (ex. "2027-01-02T08:00:00+00:00").
   *  Sert de fallback si firestoreOverride est activee et Firestore vide. */
  target: string;
  /** Libelle court de l'evenement (affiche en cas de delta negatif) */
  passedLabel?: string;
  /** Si true, fetch la date depuis settings/journee dans Firestore.
   *  Permet a l'admin de modifier la date sans toucher au code. */
  firestoreOverride?: boolean;
};

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
};

function compute(target: number, now: number): Remaining {
  const delta = target - now;
  if (delta <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  }
  const sec = Math.floor(delta / 1000);
  return {
    days: Math.floor(sec / 86400),
    hours: Math.floor((sec % 86400) / 3600),
    minutes: Math.floor((sec % 3600) / 60),
    seconds: sec % 60,
    passed: false,
  };
}

/** Compte a rebours esthetique pour un evenement futur.
 *  Rendu cote client uniquement (evite hydration mismatch). */
export default function EventCountdown({
  target,
  passedLabel = "L'événement a eu lieu — à très bientôt pour la prochaine édition.",
  firestoreOverride = false,
}: EventCountdownProps) {
  const [effectiveTargetMs, setEffectiveTargetMs] = useState<number>(
    new Date(target).getTime()
  );
  const [mounted, setMounted] = useState(false);
  const [r, setR] = useState<Remaining>(() => compute(effectiveTargetMs, Date.now()));

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Firestore une seule fois au mount si demande
  useEffect(() => {
    if (!firestoreOverride) return;
    let cancelled = false;
    (async () => {
      try {
        const settings = await getJourneeSettings();
        if (cancelled) return;
        if (settings?.dateIso) {
          const ms = new Date(settings.dateIso).getTime();
          if (!isNaN(ms)) {
            setEffectiveTargetMs(ms);
            setR(compute(ms, Date.now()));
          }
        }
      } catch {
        // Silencieux : si Firestore plante on garde le fallback target
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [firestoreOverride]);

  // Tick chaque seconde mais SEULEMENT quand l'onglet est visible
  useVisibleInterval(() => setR(compute(effectiveTargetMs, Date.now())), 1000);

  if (!mounted) {
    // Placeholder cote serveur pour eviter mismatch
    return (
      <div className="h-[160px] sm:h-[180px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
    );
  }

  if (r.passed) {
    return (
      <div className="rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8 text-center">
        <p className="text-[#D4AF37] text-sm sm:text-base">{passedLabel}</p>
      </div>
    );
  }

  const cells: { value: number; label: string }[] = [
    { value: r.days, label: "Jours" },
    { value: r.hours, label: "Heures" },
    { value: r.minutes, label: "Minutes" },
    { value: r.seconds, label: "Secondes" },
  ];

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0F7C55]/30 to-[#0F7C55]/5 border border-[#D4AF37]/30 backdrop-blur-md p-5 sm:p-8">
      <p className="text-center text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-4">
        Compte à rebours
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {cells.map((c) => (
          <div
            key={c.label}
            className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-5 text-center"
          >
            <div className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-white tabular-nums">
              {String(c.value).padStart(2, "0")}
            </div>
            <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-widest text-white/60 font-semibold">
              {c.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
