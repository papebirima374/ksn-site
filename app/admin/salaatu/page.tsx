"use client";

import { useEffect, useState, FormEvent } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import {
  hasPermission,
  SalaatuDuJour,
  SalaatuMode,
  SalaatuLibraryItem,
} from "@/lib/admin-types";
import {
  getSalaatuDuJour,
  saveSalaatuDuJour,
  listSalaatuLibrary,
} from "@/lib/admin-data";
import { pickSalaatuOfTheDay, SALAATU_FALLBACK } from "@/lib/salaatu-seed";
import { FaWandMagicSparkles, FaPenToSquare, FaCheck } from "react-icons/fa6";

const DEFAULT: SalaatuDuJour = {
  mode: "auto",
  arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
  translit: "Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad",
  translation: "Ô Allah, prie sur Muhammad et sur la famille de Muhammad.",
  title: "Salaatu Ibrahimiyya",
  lastUpdated: 0,
  lastUpdatedBy: "",
};

export default function AdminSalaatuPage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "salaatu.write");
  const [data, setData] = useState<SalaatuDuJour>(DEFAULT);
  const [library, setLibrary] = useState<SalaatuLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dbMode, setDbMode] = useState<SalaatuMode>("auto");

  useEffect(() => {
    (async () => {
      try {
        const [s, lib] = await Promise.all([
          getSalaatuDuJour(),
          listSalaatuLibrary().catch(() => [] as SalaatuLibraryItem[]),
        ]);
        if (s) {
          setData({ ...DEFAULT, ...s });
          setDbMode(s.mode ?? "auto");
        }
        setLibrary(lib.length > 0 ? lib : SALAATU_FALLBACK);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const mode: SalaatuMode = data.mode ?? "auto";
  const autoPick = pickSalaatuOfTheDay(library);

  function setMode(newMode: SalaatuMode) {
    setData({ ...data, mode: newMode });
  }

  function applyLibraryItem(item: SalaatuLibraryItem) {
    setData({
      ...data,
      title: item.title,
      arabic: item.arabic,
      translit: item.transliteration ?? "",
      translation: item.translation ?? "",
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await saveSalaatuDuJour({
        mode,
        title: data.title,
        arabic: data.arabic,
        translit: data.translit,
        translation: data.translation,
        date: data.date,
        lastUpdatedBy: user.uid,
      });
      setDbMode(mode);
      setMessage("Le mode de rotation a été mis à jour avec succès.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  // Auto mode preview uses the day's auto-picked library item
  const previewArabic = mode === "auto" && autoPick ? autoPick.arabic : data.arabic;
  const previewTitle = mode === "auto" && autoPick ? autoPick.title : data.title;
  const previewTranslit = mode === "auto" && autoPick ? autoPick.transliteration ?? "" : data.translit;
  const previewTranslation = mode === "auto" && autoPick ? autoPick.translation ?? "" : data.translation;

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
          {library.length} Salaat{library.length > 1 ? "s" : ""} dans la bibliothèque. Choisissez le mode automatique (rotation quotidienne) ou manuel (édition libre).
        </p>
      </header>

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : (
        <>
          {/* TOGGLE Auto/Manuel */}
          <div className="bg-white rounded-3xl shadow-md p-4 sm:p-5 mb-6">
            <div className="grid grid-cols-2 gap-2 bg-[#F8F5EF] rounded-2xl p-1.5">
              <button
                type="button"
                onClick={() => canEdit && setMode("auto")}
                disabled={!canEdit}
                className={`py-3 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 transition ${
                  mode === "auto"
                    ? "bg-[#0F5132] text-white shadow-md"
                    : "text-[#0F5132] hover:bg-white"
                }`}
              >
                <FaWandMagicSparkles /> Automatique
              </button>
              <button
                type="button"
                onClick={() => canEdit && setMode("manual")}
                disabled={!canEdit}
                className={`py-3 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 transition ${
                  mode === "manual"
                    ? "bg-[#0F5132] text-white shadow-md"
                    : "text-[#0F5132] hover:bg-white"
                }`}
              >
                <FaPenToSquare /> Manuel
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500 leading-6">
              {mode === "auto"
                ? `Mode automatique : un Salaat différent est mis en avant chaque jour, en parcourant les ${library.length} Salaat${library.length > 1 ? "s" : ""} de la bibliothèque.`
                : "Mode manuel : vous éditez le Salaatu du jour vous-même. Cliquez une carte ci-dessous pour pré-remplir les champs."}
            </p>
          </div>

          {/* MANUAL MODE — library picker */}
          {mode === "manual" && (
            <div className="bg-white rounded-3xl shadow-md p-5 sm:p-7 mb-6">
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-3">
                Bibliothèque — cliquez pour pré-remplir
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
                {library.map((s) => {
                  const active = data.arabic === s.arabic;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => applyLibraryItem(s)}
                      className={`text-start p-4 rounded-xl border transition ${
                        active
                          ? "bg-[#0F5132] text-white border-[#0F5132]"
                          : "bg-[#F8F5EF] border-[#0F5132]/10 hover:bg-[#E8E6E1] text-[#0F5132]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-[10px] uppercase tracking-widest font-bold ${active ? "text-[#D4AF37]" : "text-[#B8860B]"}`}>
                          {s.category}
                        </p>
                        {active && <FaCheck className="text-[#D4AF37] mt-0.5" />}
                      </div>
                      <h4 className="font-display font-bold mt-1 text-sm sm:text-base">
                        {s.title}
                      </h4>
                      <p className={`mt-2 font-arabic text-base line-clamp-1 ${active ? "text-[#D4AF37]" : "text-[#0F5132]/80"}`} dir="rtl">
                        {s.arabic.slice(0, 50)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MANUAL MODE — form */}
          {mode === "manual" && (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-md p-6 sm:p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={data.title ?? ""}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    placeholder="ex: Salaatu Ibrahimiyya"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Date (libellé optionnel)
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={data.date ?? ""}
                    onChange={(e) => setData({ ...data, date: e.target.value })}
                    placeholder="ex: Vendredi 30 mai"
                    className={inputClass}
                  />
                </div>
              </div>
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
                  className={`${inputClass} text-2xl font-arabic`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Translittération
                </label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={data.translit}
                  onChange={(e) => setData({ ...data, translit: e.target.value })}
                  className={`${inputClass} italic`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Traduction
                </label>
                <textarea
                  disabled={!canEdit}
                  value={data.translation}
                  onChange={(e) => setData({ ...data, translation: e.target.value })}
                  rows={2}
                  className={inputClass}
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
                  className="w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-4 rounded-2xl font-bold disabled:opacity-50"
                >
                  {saving ? "Enregistrement…" : "Enregistrer (mode manuel)"}
                </button>
              )}
            </form>
          )}

          {/* AUTO MODE — info + save button */}
          {mode === "auto" && (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-md p-6 sm:p-8 space-y-5">
              <div className="bg-[#F8F5EF] rounded-2xl p-5">
                <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-2">
                  Aujourd&apos;hui ({new Date().toLocaleDateString("fr-FR")})
                </p>
                <h3 className="font-display text-xl font-bold text-[#0F5132]">
                  {autoPick?.title ?? "—"}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  La rotation est automatique : chaque jour de l&apos;année correspond à un Salaat différent. Pour épingler un favori spécifique, ouvrez{" "}
                  <span className="font-semibold text-[#0F5132]">/admin/bibliotheque</span>{" "}
                  et étoilez le Salaat — il devient le préféré du jour quelle que soit la rotation.
                </p>
              </div>

              {message && (
                <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                  {message}
                </p>
              )}

              {dbMode === "auto" ? (
                <div className="flex items-center gap-3 bg-emerald-50 text-[#0F5132] border border-emerald-200 rounded-2xl p-4 font-semibold text-sm">
                  <FaCheck className="text-emerald-600" />
                  <span>Le mode automatique (rotation quotidienne) est actuellement actif sur le site public.</span>
                </div>
              ) : (
                canEdit && (
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-4 rounded-2xl font-bold disabled:opacity-50"
                  >
                    {saving ? "Enregistrement…" : "Activer le mode automatique"}
                  </button>
                )
              )}
            </form>
          )}

          {/* PREVIEW */}
          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">
              Aperçu sur le site public ({mode === "auto" ? "auto" : "manuel"})
            </p>
            <div className="bg-gradient-to-br from-[#0F5132] to-[#082F22] rounded-3xl p-8 sm:p-10 text-center text-white">
              {previewTitle && (
                <p className="font-display text-xl sm:text-2xl font-bold mb-3 text-[#D4AF37]">
                  {previewTitle}
                </p>
              )}
              <p className="font-arabic text-3xl sm:text-4xl text-[#D4AF37] leading-loose" dir="rtl">
                {previewArabic}
              </p>
              <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto my-5" />
              {previewTranslit && (
                <p className="font-display italic text-base sm:text-lg text-white/90">
                  « {previewTranslit} »
                </p>
              )}
              {previewTranslation && (
                <p className="mt-3 text-sm sm:text-base text-white/80">
                  {previewTranslation}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#0F5132] text-sm text-[#0F5132] bg-white";
