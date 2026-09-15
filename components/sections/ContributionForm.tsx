"use client";

import { useState } from "react";
import { FaHandHoldingHeart, FaCircleCheck } from "react-icons/fa6";
import { contributeSalaatu, MAX_CONTRIBUTION, fmtNumber } from "@/lib/challenge";
import { useT } from "@/lib/i18n/context";

/** Formulaire public : un visiteur ajoute son nombre de Salaatu au compteur
 *  communautaire. L'incrément est visible EN DIRECT sur le compteur (le même
 *  document settings/challenge écouté par ChallengeCounter / CompteurSalaatu). */
export default function ContributionForm() {
  const { t } = useT();
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function submit() {
    const n = parseInt(amount.replace(/\D+/g, ""), 10);
    if (!n || n < 1) {
      setError(t("contrib.err_amount"));
      return;
    }
    if (n > MAX_CONTRIBUTION) {
      setError(t("contrib.err_max").replace("{max}", fmtNumber(MAX_CONTRIBUTION)));
      return;
    }
    setSending(true);
    setError("");
    try {
      const added = await contributeSalaatu(n, name);
      setDone(added);
      setAmount("");
      setName("");
    } catch {
      setError(t("contrib.err_send"));
    } finally {
      setSending(false);
    }
  }

  return (
    // Resserre : le grand cartouche dore, le titre sur deux lignes et le
    // paragraphe d'explication poussaient les champs hors de l'ecran sur un
    // telephone. On garde une phrase, et la saisie arrive tout de suite.
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] sm:rounded-[35px] p-5 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-[#0F7C55] text-lg">
          <FaHandHoldingHeart />
        </span>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
          {t("contrib.title")}
        </h3>
      </div>
      <p className="mt-2.5 text-white/60 text-sm leading-relaxed">
        {t("contrib.desc")}
      </p>

      {done !== null ? (
        <div className="mt-5 bg-emerald-500/15 border border-emerald-400/30 rounded-2xl p-5 text-center">
          <FaCircleCheck className="text-emerald-300 text-3xl mx-auto" />
          <p className="mt-3 text-emerald-200 font-bold text-lg">
            {t("contrib.thanks").replace("{n}", fmtNumber(done))}
          </p>
          <p className="mt-1 text-white/60 text-sm">{t("contrib.thanks_sub")}</p>
          <button
            type="button"
            onClick={() => setDone(null)}
            className="mt-4 text-sm text-[#D4AF37] font-semibold underline"
          >
            {t("contrib.again")}
          </button>
        </div>
      ) : (
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!sending && amount.trim()) void submit();
          }}
        >
          {/* Un vrai <form> : sur un telephone, la touche « Envoyer » du
              clavier valide, au lieu de ne rien faire. */}
          <label className="block text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-1.5">
            {t("contrib.amount_label")}
          </label>
          <input
            type="text"
            inputMode="numeric"
            enterKeyHint="send"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ex : 100"
            className="w-full rounded-xl bg-white/90 text-[#0F7C55] font-bold px-4 py-3 outline-none tabular-nums text-lg"
          />
          <label className="block text-xs uppercase tracking-widest text-[#D4AF37] font-bold mt-3 mb-1.5">
            {t("contrib.name_label")}
          </label>
          <input
            type="text"
            enterKeyHint="send"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("contrib.name_ph")}
            maxLength={40}
            className="w-full rounded-xl bg-white/90 text-[#0F7C55] px-4 py-3 outline-none"
          />
          {error && (
            <p className="mt-3 text-sm text-red-300 bg-red-500/15 rounded-xl p-3 border border-red-400/20">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={sending || !amount.trim()}
            className="mt-4 w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-4 rounded-2xl font-bold text-base shadow-xl hover:scale-[1.02] active:scale-95 transition disabled:opacity-50"
          >
            {sending ? t("contrib.sending") : t("contrib.submit")}
          </button>
          <p className="mt-2.5 text-[11px] text-white/40 text-center leading-snug">
            {t("contrib.note")}
          </p>
        </form>
      )}
    </div>
  );
}
