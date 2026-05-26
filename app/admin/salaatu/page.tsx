"use client";

import { useEffect, useState, FormEvent } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { hasPermission, SalaatuDuJour } from "@/lib/admin-types";
import { getSalaatuDuJour, saveSalaatuDuJour } from "@/lib/admin-data";

const DEFAULT: SalaatuDuJour = {
  arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
  translit: "Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad",
  translation: "Ô Allah, prie sur Muhammad et sur la famille de Muhammad.",
  lastUpdated: 0,
  lastUpdatedBy: "",
};

export default function AdminSalaatuPage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "salaatu.write");
  const [data, setData] = useState<SalaatuDuJour>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const s = await getSalaatuDuJour();
        if (s) setData(s);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await saveSalaatuDuJour({
        arabic: data.arabic,
        translit: data.translit,
        translation: data.translation,
        date: data.date,
        lastUpdatedBy: user.uid,
      });
      setMessage("Salaatu du jour mis à jour.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <header className="mb-8">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Spiritualité
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F5132]">
          Salaatu du jour
        </h1>
        <p className="mt-2 text-gray-600 text-sm">
          Modifiez le Salaatu mis en avant sur la page Spiritualité.
        </p>
      </header>

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-md p-6 sm:p-8 space-y-5"
          >
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Texte arabe
              </label>
              <textarea
                required
                disabled={!canEdit}
                value={data.arabic}
                onChange={(e) => setData({ ...data, arabic: e.target.value })}
                rows={3}
                dir="rtl"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#0F5132] text-2xl font-arabic text-[#0F5132] bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Translittération
              </label>
              <input
                type="text"
                required
                disabled={!canEdit}
                value={data.translit}
                onChange={(e) => setData({ ...data, translit: e.target.value })}
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#0F5132] text-sm italic text-[#0F5132] bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Traduction française
              </label>
              <textarea
                required
                disabled={!canEdit}
                value={data.translation}
                onChange={(e) =>
                  setData({ ...data, translation: e.target.value })
                }
                rows={2}
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#0F5132] text-sm text-[#0F5132] bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Date (optionnel)
              </label>
              <input
                type="text"
                disabled={!canEdit}
                value={data.date ?? ""}
                onChange={(e) => setData({ ...data, date: e.target.value })}
                placeholder="ex: Vendredi 30 mai"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#0F5132] text-sm text-[#0F5132] bg-white"
              />
            </div>

            {message && (
              <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                {message}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
                {error}
              </p>
            )}

            {canEdit && (
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-4 rounded-2xl font-bold hover:scale-[1.01] transition disabled:opacity-50"
              >
                {saving ? "Enregistrement…" : "Mettre à jour le Salaatu du jour"}
              </button>
            )}
          </form>

          {/* Preview */}
          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">
              Aperçu sur le site
            </p>
            <div className="bg-gradient-to-br from-[#0F5132] to-[#082F22] rounded-3xl p-8 sm:p-10 text-center text-white">
              <p className="font-arabic text-3xl sm:text-4xl text-[#D4AF37] leading-loose">
                {data.arabic}
              </p>
              <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto my-5" />
              <p className="font-display italic text-base sm:text-lg text-white/90">
                « {data.translit} »
              </p>
              <p className="mt-3 text-sm sm:text-base text-white/80">
                {data.translation}
              </p>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
