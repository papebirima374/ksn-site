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
  subscribeContributions,
  deleteContribution,
  type Contribution,
} from "@/lib/challenge";
import {
  ChallengeMedia,
  addChallengeMedia,
  listChallengeMedia,
  deleteChallengeMedia,
} from "@/lib/admin-data";
import Image from "next/image";
import { FaBullseye, FaFloppyDisk, FaArrowsRotate, FaTrash, FaClockRotateLeft, FaUser, FaImage, FaBullhorn, FaMoon } from "react-icons/fa6";

export default function AdminChallengePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [draft, setDraft] = useState("");
  const [current, setCurrent] = useState(0);
  const [contribs, setContribs] = useState<Contribution[]>([]);
  // Médias (annonces / Jour J)
  const [media, setMedia] = useState<ChallengeMedia[]>([]);
  const [mType, setMType] = useState<ChallengeMedia["type"]>("annonce");
  const [mComment, setMComment] = useState("");
  const [mFile, setMFile] = useState<File | null>(null);
  const [mUploading, setMUploading] = useState(false);

  async function reloadMedia() {
    try {
      setMedia(await listChallengeMedia());
    } catch {
      /* non bloquant */
    }
  }

  async function addMedia() {
    if (!mFile || !user) return;
    setMUploading(true);
    setError("");
    try {
      await addChallengeMedia(mFile, { type: mType, comment: mComment, createdBy: user.uid });
      setMFile(null);
      setMComment("");
      await reloadMedia();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'envoi de l'image");
    } finally {
      setMUploading(false);
    }
  }

  async function removeMedia(item: ChallengeMedia) {
    if (!confirm("Supprimer cette image ?")) return;
    try {
      await deleteChallengeMedia(item);
      await reloadMedia();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de suppression");
    }
  }

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
    reloadMedia();
    const unsub = subscribeContributions(setContribs);
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  async function removeContribution(c: Contribution) {
    if (!confirm(`Supprimer cette contribution de ${fmtNumber(c.amount)} Salaatu ?\n\nLe total sera diminué d'autant.`)) return;
    try {
      await deleteContribution(c.id, c.amount);
      // Rafraîchit la valeur affichée (le décrément est déjà appliqué en base)
      setCurrent((prev) => Math.max(0, prev - c.amount));
      setDraft((prev) => String(Math.max(0, (parseInt(prev.replace(/\D+/g, ""), 10) || 0) - c.amount)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de suppression");
    }
  }

  const contribTotal = contribs.reduce((s, c) => s + (c.amount || 0), 0);

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

          <p className="mt-5 text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
            💡 Le total ci-dessus inclut <strong>tes saisies</strong> (relevé de
            l&apos;app) <strong>et les contributions des visiteurs</strong> du site
            (ci-dessous). Chaque contribution s&apos;ajoute automatiquement.
          </p>
        </div>
      )}

      {/* ── HISTORIQUE DES CONTRIBUTIONS DES VISITEURS ── */}
      {!loading && (
        <div className="max-w-2xl bg-white rounded-3xl shadow-md p-6 sm:p-8 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-[#0F7C55] flex items-center gap-2">
              <FaClockRotateLeft className="text-[#B8860B]" /> Contributions des visiteurs
            </h2>
            <span className="text-sm text-gray-500 tabular-nums">
              {contribs.length} · {fmtNumber(contribTotal)} Salaatu
            </span>
          </div>

          {contribs.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">
              Aucune contribution pour l&apos;instant. Elles apparaîtront ici en direct.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {contribs.map((c) => (
                <li key={c.id} className="flex items-center gap-3 py-3">
                  <div className="w-9 h-9 rounded-full bg-[#F8F5EF] flex items-center justify-center text-[#B8860B] flex-shrink-0">
                    <FaUser className="text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0F7C55] truncate">
                      {c.name || "Anonyme"}
                      <span className="ml-2 text-[#B8860B] font-bold tabular-nums">
                        +{fmtNumber(c.amount)}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleString("fr-FR", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeContribution(c)}
                    title="Supprimer (corrige le total)"
                    className="flex-shrink-0 w-9 h-9 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ── IMAGES : ANNONCES / JOUR J ── */}
      {!loading && (
        <div className="max-w-2xl bg-white rounded-3xl shadow-md p-6 sm:p-8 mt-6">
          <h2 className="font-display text-xl font-bold text-[#0F7C55] flex items-center gap-2 mb-2">
            <FaImage className="text-[#B8860B]" /> Images — Annonces & Jour J
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Ajoutez des visuels d&apos;annonce ou des photos du Jour J, avec un
            commentaire. Ils s&apos;affichent sur la page{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">/challenge</code>.
          </p>

          {/* Formulaire d'ajout */}
          <div className="bg-[#F8F5EF] rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex gap-2">
              {(["annonce", "jourj"] as const).map((tp) => (
                <button
                  key={tp}
                  type="button"
                  onClick={() => setMType(tp)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    mType === tp
                      ? "bg-[#0F7C55] text-white"
                      : "bg-white text-[#0F7C55] border border-gray-200"
                  }`}
                >
                  {tp === "annonce" ? <FaBullhorn /> : <FaMoon />}
                  {tp === "annonce" ? "Annonce" : "Jour J"}
                </button>
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMFile(e.target.files?.[0] ?? null)}
              className="text-sm text-[#0F7C55] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#0F7C55] file:text-white file:font-semibold file:cursor-pointer"
            />
            <textarea
              value={mComment}
              onChange={(e) => setMComment(e.target.value)}
              rows={2}
              placeholder="Commentaire (ex : Lancement du challenge, rejoignez-nous ce soir…)"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55] bg-white outline-none"
            />
            <button
              type="button"
              onClick={addMedia}
              disabled={mUploading || !mFile}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] px-5 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50"
            >
              <FaImage /> {mUploading ? "Envoi…" : "Ajouter l'image"}
            </button>
          </div>

          {/* Liste */}
          {media.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              {media.map((m) => (
                <div key={m.id} className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="relative aspect-video bg-gray-100">
                    <Image src={m.src} alt={m.comment || "Image challenge"} fill sizes="300px" className="object-cover" unoptimized />
                    <span className="absolute top-2 left-2 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-black/55 text-white">
                      {m.type === "annonce" ? "Annonce" : "Jour J"}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-gray-700 line-clamp-2">{m.comment || "—"}</p>
                    <button
                      type="button"
                      onClick={() => removeMedia(m)}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-semibold"
                    >
                      <FaTrash /> Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}
