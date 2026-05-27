"use client";

import { useEffect, useState } from "react";

type EventCountdownProps = {
  /** Date cible ISO (ex. "2027-01-02T08:00:00+00:00") */
  target: string;
  /** Libelle court de l'evenement (affiche en cas de delta negatif) */
  passedLabel?: string;
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
}: EventCountdownProps) {
  const targetMs = new Date(target).getTime();
  const [mounted, setMounted] = useState(false);
  const [r, setR] = useState<Remaining>(() => compute(targetMs, Date.now()));

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setR(compute(targetMs, Date.now())), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

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
