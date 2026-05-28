"use client";

import { useEffect, useState, FormEvent } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import {
  getJourneeSettings,
  saveJourneeSettings,
  JourneeSettings,
} from "@/lib/admin-data";
import { FaCalendarDays, FaLocationDot, FaFloppyDisk } from "react-icons/fa6";

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

  // Chargement initial
  useEffect(() => {
    (async () => {
      try {
        const s = await getJourneeSettings();
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
          Date de la Journée Salaatu
        </h1>
        <p className="mt-2 text-gray-600 text-sm max-w-2xl">
          Modifiez ici la date de la prochaine édition. Cela met à jour
          automatiquement le compte à rebours de la home et de la page{" "}
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

      <div className="mt-8 bg-[#F8F5EF] border border-[#D4AF37]/30 rounded-3xl p-6 text-[#0F7C55]">
        <h3 className="font-display text-lg font-bold mb-2">📋 Pages affectées</h3>
        <ul className="space-y-1.5 text-sm text-gray-700 list-disc list-inside">
          <li>
            <strong>Accueil</strong> — bannière dorée avec compte à rebours
          </li>
          <li>
            <strong>/journee-salaatu</strong> — page dédiée à l&apos;événement
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
