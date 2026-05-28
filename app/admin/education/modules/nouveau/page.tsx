"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaFloppyDisk, FaCircleInfo } from "react-icons/fa6";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { hasPermission } from "@/lib/admin-types";
import { listEducationModules, createEducationModule } from "@/lib/admin-data";

const ICON_OPTIONS = [
  { key: "seedling", label: "Pousse / Fondation (🌱)" },
  { key: "water", label: "Eau / Tahara (💧)" },
  { key: "prayer", label: "Prière / Salat (🤲)" },
  { key: "moon", label: "Lune / Koor (🌙)" },
  { key: "flower", label: "Fleur / Akhlaq (🌸)" },
  { key: "star", label: "Étoile / Salaatu (⭐)" },
];

export default function AdminNewEducationModulePage() {
  const router = useRouter();
  const { user } = useAuth();
  const canEdit = hasPermission(user, "education.write");

  const [titleFr, setTitleFr] = useState("");
  const [titleArabic, setTitleArabic] = useState("");
  const [slug, setSlug] = useState("");
  const [iconKey, setIconKey] = useState("seedling");
  const [order, setOrder] = useState(1);
  const [publishStatus, setPublishStatus] = useState<"draft" | "preview" | "published">("draft");
  const [sourceWork, setSourceWork] = useState("tazawwud");
  const [descriptionFr, setDescriptionFr] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Calcul automatique de l'ordre suivant
  useEffect(() => {
    listEducationModules()
      .then((mods) => {
        if (mods.length > 0) {
          const maxOrder = Math.max(...mods.map((m) => m.order));
          setOrder(maxOrder + 1);
        }
      })
      .catch(() => {});
  }, []);

  // Génération automatique du slug à partir du titre français
  const handleTitleChange = (val: string) => {
    setTitleFr(val);
    // Convertit en minuscules, remplace les accents, espaces et caractères spéciaux par des tirets
    const generatedSlug = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    if (!titleFr.trim()) {
      setError("Le titre français est obligatoire.");
      return;
    }
    if (!slug.trim()) {
      setError("Le slug d'URL est obligatoire.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const newId = await createEducationModule({
        slug: slug.trim(),
        title: { fr: titleFr.trim() },
        titleArabic: titleArabic.trim() || undefined,
        description: { fr: descriptionFr.trim() },
        iconKey,
        order,
        publishStatus,
        sourceWork,
      });

      router.push(`/admin/education/modules/${newId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du module");
      setSaving(false);
    }
  };

  if (!canEdit) {
    return (
      <AdminShell>
        <div className="bg-white rounded-3xl p-8 text-center">
          <p className="text-gray-500">Vous n&apos;avez pas la permission de gérer l&apos;éducation.</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <header className="mb-6">
        <Link
          href="/admin/education"
          className="inline-flex items-center gap-2 text-sm text-[#0F7C55] hover:text-[#B8860B] mb-4"
        >
          <FaArrowLeft /> Retour aux modules
        </Link>
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Nouveau module
        </p>
        <h1 className="font-display mt-2 text-3xl font-bold text-[#0F7C55]">
          Créer un chapitre
        </h1>
      </header>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100 mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-md p-6 sm:p-8 space-y-6 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Titre (Français) *
            </label>
            <input
              type="text"
              required
              value={titleFr}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="ex: Les Fondements de la Foi"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Titre arabe (optionnel)
            </label>
            <input
              type="text"
              value={titleArabic}
              onChange={(e) => setTitleArabic(e.target.value)}
              placeholder="ex: أصول الإيمان"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] font-arabic text-right"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Slug d&apos;URL * (calculé automatiquement)
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ex: fondements"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Icône du module
            </label>
            <select
              value={iconKey}
              onChange={(e) => setIconKey(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Ordre d&apos;affichage
            </label>
            <input
              type="number"
              min="1"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Statut de publication
            </label>
            <select
              value={publishStatus}
              onChange={(e) => setPublishStatus(e.target.value as any)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
            >
              <option value="draft">Brouillon</option>
              <option value="preview">Aperçu (admins)</option>
              <option value="published">Publié</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Ouvrage source
            </label>
            <input
              type="text"
              required
              value={sourceWork}
              onChange={(e) => setSourceWork(e.target.value)}
              placeholder="tazawwud"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Description courte
            </label>
            <textarea
              value={descriptionFr}
              onChange={(e) => setDescriptionFr(e.target.value)}
              rows={3}
              placeholder="Résumé ou présentation courte du module…"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] leading-6"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <Link
            href="/admin/education"
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] text-white font-bold px-6 py-2.5 rounded-xl shadow-md hover:scale-105 transition disabled:opacity-50 text-sm"
          >
            <FaFloppyDisk />
            {saving ? "Création…" : "Créer le module"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
