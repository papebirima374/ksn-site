"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import {
  getChallengeTotal,
  setChallengeTotal,
  CHALLENGE_TARGET,
  fmtNumber,
  progressTowardTarget,
} from "@/lib/challenge";
import { FaBullseye, FaFloppyDisk, FaArrowsRotate } from "react-icons/fa6";

export default function AdminChallengePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [draft, setDraft] = useState("");
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      try {
        const n = await getChallengeTotal();
        setCurrent(n);
        setDraft(String(n));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, [isAdmin]);

  async function save() {
    const n = parseInt(draft.replace(/\D+/g, ""), 10);
    if (isNaN(n)) {
      setError("Entrez un nombre valide.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await setChallengeTotal(n);
      setCurrent(n);
      setSuccess("✅ Compteur mis à jour. Visible en direct par tous les visiteurs.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  if (!isAdmin) {
    return (
      <AdminShell>
        <div className="bg-white rounded-3xl p-8 text-center">
          <p className="text-gray-600">
            Cette section est réservée à l&apos;administrateur principal.
          </p>
        </div>
      </AdminShell>
    );
  }

  const percent = progressTowardTarget(parseInt(draft.replace(/\D+/g, ""), 10) || 0);

  return (
    <AdminShell>
      <header className="mb-8">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Challenge 1 Milliard
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          Compteur du Challenge
        </h1>
        <p className="mt-2 text-gray-600 text-sm max-w-2xl">
          Saisissez le <strong>total cumulé de Salaatu</strong> (relevé depuis
          l&apos;application KSN). Le chiffre s&apos;affiche <strong>en direct</strong>{" "}
          sur la page d&apos;accueil et sur <code className="bg-gray-100 px-1.5 py-0.5 rounded">/challenge</code>{" "}
          pour tous les visiteurs.
        </p>
      </header>

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : (
        <div className="max-w-xl bg-white rounded-3xl shadow-md p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 text-[#0F7C55]">
            <div className="w-11 h-11 rounded-xl bg-[#F8F5EF] flex items-center justify-center text-[#B8860B]">
              <FaBullseye />
            </div>
            <div>
              <p className="text-xs text-gray-500">Valeur actuelle</p>
              <p className="font-display text-2xl font-bold tabular-nums">
                {fmtNumber(current)}
              </p>
            </div>
          </div>

          <label className="block text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-2">
            Nouveau total cumulé (Salaatu)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[#0F7C55] font-bold tabular-nums text-lg outline-none focus:border-[#0F7C55]"
          />

          {/* Aperçu de la progression */}
          <div className="mt-4">
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] rounded-full transition-all"
                style={{ width: `${Math.max(percent, 0.3)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 tabular-nums">
              <span className="text-[#B8860B] font-bold">{percent.toFixed(3)} %</span>
              <span>sur {fmtNumber(CHALLENGE_TARGET)}</span>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-4 text-sm text-emerald-800 bg-emerald-50 rounded-xl p-3 border border-emerald-200">
              {success}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
            >
              <FaFloppyDisk /> {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm("Remettre le compteur à 0 ?")) setDraft("0");
              }}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-[#0F7C55] px-5 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50"
            >
              <FaArrowsRotate /> Remettre à 0
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
