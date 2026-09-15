"use client";

import { useEffect, useState, FormEvent } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import {
  getJourneeSettings,
  saveJourneeSettings,
  getStreamingLink,
  saveStreamingLink,
  JourneeSettings,
} from "@/lib/admin-data";
import { FaCalendarDays, FaLocationDot, FaFloppyDisk, FaYoutube } from "react-icons/fa6";

// Fallback hardcoded : visible si Firestore ne contient encore aucun parametre.
// Cette valeur est aussi utilisee par EventCountdown / JourneeBanner /
// /journee-salaatu en tant que valeur initiale avant le fetch Firestore.
const FALLBACK: JourneeSettings = {
  dateIso: "2026-12-26T08:00:00+00:00",
  label: "26 décembre 2026",
  location: "Touba, Sénégal",
};

function isoToLocalInput(iso: string): string {
  // <input type="datetime-local"> attend "YYYY-MM-DDTHH:mm" en heure locale.
  // On convertit l'ISO en heure locale puis on formate.
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localInputToIso(local: string): string {
  // Inverse : "YYYY-MM-DDTHH:mm" (local) -> ISO UTC
  const d = new Date(local);
  return d.toISOString();
}

export default function AdminParametresJourneePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dateInput, setDateInput] = useState("");
  const [label, setLabel] = useState("");
  const [location, setLocation] = useState("");
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  // Le lien du direct YouTube. Il vivait dans /admin/salaatu, c'est-a-dire
  // sous « Salaatu du jour » — la priere quotidienne, qui n'a rien a voir avec
  // la Journee. Deux choses portant presque le meme nom, rangees ensemble : on
  // le cherchait la ou il n'etait pas. Sa place est ici, avec la date et le
  // lieu de l'evenement qu'il retransmet.
  const [lienDirect, setLienDirect] = useState("");
  const [enregistreLien, setEnregistreLien] = useState(false);
  const [lienMsg, setLienMsg] = useState("");
  const [lienErreur, setLienErreur] = useState("");

  // Chargement initial
  useEffect(() => {
    (async () => {
      try {
        const [s, lien] = await Promise.all([
          getJourneeSettings(),
          getStreamingLink().catch(() => ""),
        ]);
        setLienDirect(lien);
        const current = s ?? FALLBACK;
        setDateInput(isoToLocalInput(current.dateIso));
        setLabel(current.label);
        setLocation(current.location ?? FALLBACK.location ?? "");
        if (s?.updatedAt) setLastUpdated(s.updatedAt);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!dateInput || !label) {
      setError("La date et le libellé sont obligatoires.");
      return;
    }
    setSaving(true);
    try {
      const iso = localInputToIso(dateInput);
      await saveJourneeSettings({
        dateIso: iso,
        label: label.trim(),
        location: location.trim() || undefined,
      });
      setSuccess("✓ Paramètres enregistrés. La page publique se met à jour automatiquement.");
      setLastUpdated(Date.now());
      setTimeout(() => setSuccess(""), 5000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la sauvegarde");
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

  return (
    <AdminShell>
      <header className="mb-8">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Configuration
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          Journée Salaatu
        </h1>
        <p className="mt-2 text-gray-600 text-sm max-w-2xl">
          La date, le lieu et le lien du direct de la prochaine édition. La date
          met à jour le compte à rebours de l&apos;accueil et de la page{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded">/journee-salaatu</code>.
        </p>
      </header>

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-md p-6 sm:p-8 space-y-5">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3 border border-emerald-200">
              {success}
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                <FaCalendarDays className="inline mr-1.5 text-[#B8860B]" />
                Date & heure (heure locale Sénégal)
              </label>
              <input
                type="datetime-local"
                required
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55] bg-white"
              />
              <p className="mt-1 text-[11px] text-gray-500">
                C&apos;est cette date qui pilote le compte à rebours en direct.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Libellé affiché
              </label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="ex: 26 décembre 2026"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55] bg-white"
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Texte court visible sur la page (ex : « 26 décembre 2026 »).
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              <FaLocationDot className="inline mr-1.5 text-[#B8860B]" />
              Lieu
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="ex: Touba, Sénégal"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55] bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition disabled:opacity-50 text-sm"
            >
              <FaFloppyDisk />
              {saving ? "Enregistrement…" : "Enregistrer les paramètres"}
            </button>

            {lastUpdated && (
              <p className="text-xs text-gray-500">
                Dernière modification :{" "}
                {new Date(lastUpdated).toLocaleString("fr-FR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}
          </div>
        </form>
      )}

      {/* ── Le direct de la Journée ─────────────────────────────────────── */}
      {!loading && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setEnregistreLien(true);
            setLienMsg("");
            setLienErreur("");
            try {
              await saveStreamingLink(lienDirect.trim());
              setLienMsg("✓ Lien du direct enregistré. Rechargez la page pour le vérifier.");
              setTimeout(() => setLienMsg(""), 6000);
            } catch (err) {
              // Un echec doit se VOIR. Auparavant il n'allait que dans la
              // console du navigateur : le bouton s'arretait de tourner, rien
              // ne s'affichait, et on repartait en croyant le lien enregistre.
              console.error("Enregistrement du lien du direct :", err);
              setLienErreur(
                "Le lien n'a PAS été enregistré. Vérifiez que les règles Firestore publiées autorisent la collection « config », puis réessayez."
              );
            } finally {
              setEnregistreLien(false);
            }
          }}
          className="mt-8 bg-white rounded-3xl shadow-md p-6 sm:p-8 space-y-4"
        >
          <div>
            <h2 className="font-display text-xl font-bold text-[#0F7C55]">
              <FaYoutube className="inline mr-2 text-[#B8860B]" />
              Direct YouTube de la Journée
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Le lien de la retransmission en direct, affiché sur la page{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded">/journee-salaatu</code>{" "}
              le jour de l&apos;événement. Laissez vide tant qu&apos;il n&apos;y a pas de direct.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Lien du direct
            </label>
            <input
              type="text"
              value={lienDirect}
              onChange={(e) => setLienDirect(e.target.value)}
              placeholder="ex : https://youtube.com/live/Ea-OwQNhH0I"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55] bg-white"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Les trois formes conviennent : youtube.com/live/…, youtu.be/… ou
              youtube.com/watch?v=…
            </p>
          </div>

          {lienMsg && (
            <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3 border border-emerald-200">
              {lienMsg}
            </p>
          )}
          {lienErreur && (
            <p className="text-sm text-red-700 bg-red-50 rounded-xl p-3 border border-red-200">
              {lienErreur}
            </p>
          )}

          <button
            type="submit"
            disabled={enregistreLien}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition disabled:opacity-50 text-sm"
          >
            <FaFloppyDisk />
            {enregistreLien ? "Enregistrement…" : "Enregistrer le lien du direct"}
          </button>
        </form>
      )}

      <div className="mt-8 bg-[#F8F5EF] border border-[#D4AF37]/30 rounded-3xl p-6 text-[#0F7C55]">
        <h3 className="font-display text-lg font-bold mb-2">📋 Pages affectées</h3>
        <ul className="space-y-1.5 text-sm text-gray-700 list-disc list-inside">
          <li>
            <strong>Accueil</strong> — bannière dorée avec compte à rebours
          </li>
          <li>
            <strong>/journee-salaatu</strong> — page dédiée à l&apos;événement, et
            le bloc du direct YouTube
          </li>
          <li>
            <strong>Footer & navbar</strong> — lien vers la page (libellé reste inchangé)
          </li>
        </ul>
        <p className="mt-3 text-xs text-gray-600 italic">
          La mise à jour est instantanée pour les visiteurs qui rechargent la page.
        </p>
      </div>
    </AdminShell>
  );
}
