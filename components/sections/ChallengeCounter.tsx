"use client";

import { useEffect, useRef, useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";
import {
  CHALLENGE_TARGET,
  fmtNumber,
  progressTowardTarget,
  subscribeChallengeTotal,
  getChallengeTotal,
  setChallengeTotal,
} from "@/lib/challenge";
import { useT } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth-context";
import SalaatuCalligraphy from "@/components/ui/SalaatuCalligraphy";
import ShareButton from "@/components/ui/ShareButton";

/** Compteur LIVE du challenge 1 milliard.
 *  Total réel piloté par l'admin (Firestore settings/challenge), lu en
 *  temps réel via onSnapshot. Démarre à 0 tant que l'admin ne l'a pas défini. */
export default function ChallengeCounter() {
  const { t } = useT();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [total, setTotal] = useState<number | null>(null);
  const [displayTotal, setDisplayTotal] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const raf = useRef<number | null>(null);

  // Abonnement temps réel au total
  useEffect(() => {
    const unsub = subscribeChallengeTotal((value) => setTotal(value));
    return () => unsub();
  }, []);

  // Animation fluide du compteur vers la valeur live (s'arrête à la cible)
  useEffect(() => {
    if (total === null) return;
    const target = total;
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
      if (!reached) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [total]);

  const percent = progressTowardTarget(displayTotal);

  async function openEditor() {
    const cur = await getChallengeTotal().catch(() => total ?? 0);
    setDraft(String(cur));
    setEditing(true);
  }

  async function saveTotal() {
    const n = parseInt(draft.replace(/\D+/g, ""), 10);
    if (isNaN(n)) return;
    setSaving(true);
    try {
      await setChallengeTotal(n);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  const shareText = t("challenge.share_invite");

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="relative overflow-hidden rounded-[28px] sm:rounded-[45px] bg-gradient-to-br from-[#0F7C55] via-[#0A3D24] to-[#082F22] p-6 sm:p-12 md:p-16 text-white">
        {/* Glows */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/15 blur-[160px]" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#B8860B]/10 blur-[140px]" />

        <div className="relative z-10 text-center">
          <SalaatuCalligraphy className="mx-auto h-12 sm:h-14 md:h-16 mb-3" />
          <p className="uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#D4AF37] text-xs sm:text-sm font-bold">
            {t("compteur.badge")}
          </p>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {t("challenge.title")}
          </h2>

          {/* COMPTEUR PRINCIPAL */}
          <div className="mt-8 sm:mt-12">
            <p className="text-xs sm:text-sm uppercase tracking-widest text-white/60 font-semibold">
              {t("challenge.community_total")}
            </p>
            <div className="font-display mt-3 text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tabular-nums tracking-tight">
              {fmtNumber(displayTotal)}
            </div>
            <p className="mt-3 text-sm sm:text-base text-white/70">
              {t("compteur.target").split("{target}")[0]}
              <span className="text-[#D4AF37] font-bold">
                {fmtNumber(CHALLENGE_TARGET)}
              </span>
              {t("compteur.target").split("{target}")[1]}
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
            <span className="relative flex w-2.5 h-2.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-emerald-300">
              {t("challenge.live")}
            </span>
          </div>

          {/* ACTIONS : partager (tous) + mettre à jour (admin) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ShareButton
              title={`${t("challenge.title")} — KSN`}
              text={shareText}
              variant="primary"
              label={t("challenge.share_label")}
              className="!px-6 !py-3.5 !rounded-2xl"
            />
            {isAdmin && !editing && (
              <button
                type="button"
                onClick={openEditor}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/15 transition"
              >
                <FaPenToSquare /> Mettre à jour le compteur
              </button>
            )}
          </div>

          {/* ÉDITEUR ADMIN */}
          {isAdmin && editing && (
            <div className="mt-5 max-w-md mx-auto bg-white/10 border border-white/20 rounded-2xl p-4 text-left">
              <label className="block text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-2">
                Total cumulé (Salaatu)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl bg-white/90 text-[#0F7C55] font-bold px-4 py-3 outline-none tabular-nums"
              />
              <div className="flex gap-2 mt-3 justify-end">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white/80 text-sm font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={saveTotal}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] text-sm font-bold disabled:opacity-50"
                >
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-white/50 leading-snug">
                Visible en direct par tous les visiteurs dès l&apos;enregistrement.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
