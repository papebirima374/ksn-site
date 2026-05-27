"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaPlus, FaPenToSquare, FaTrash, FaStar, FaRegStar } from "react-icons/fa6";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import {
  hasPermission,
  SalaatuLibraryItem,
  SALAATU_CATEGORIES,
} from "@/lib/admin-types";
import {
  listSalaatuLibrary,
  deleteSalaatuLibraryItem,
  updateSalaatuLibraryItem,
  importSalaatuFullLibrary,
} from "@/lib/admin-data";

export default function AdminBibliothequePage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "library.write");
  const [items, setItems] = useState<SalaatuLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("Toutes");
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  async function reload() {
    setLoading(true);
    try {
      setItems(await listSalaatuLibrary());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  async function handleImport() {
    setImporting(true);
    setImportSuccess(false);
    setError("");
    try {
      await importSalaatuFullLibrary();
      setImportSuccess(true);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'importation");
    } finally {
      setImporting(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      reload();
    }, 0);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return items.filter((s) => {
      if (category !== "Toutes" && s.category !== category) return false;
      if (!q) return true;
      return `${s.title} ${s.translation ?? ""} ${s.arabic}`
        .toLowerCase()
        .includes(q);
    });
  }, [items, search, category]);

  async function handleDelete(s: SalaatuLibraryItem) {
    if (!confirm(`Supprimer définitivement "${s.title}" ?`)) return;
    await deleteSalaatuLibraryItem(s.id);
    await reload();
  }

  async function toggleFeatured(s: SalaatuLibraryItem) {
    // Only one featured at a time — clear others first.
    if (!s.featured) {
      for (const other of items.filter((i) => i.featured && i.id !== s.id)) {
        await updateSalaatuLibraryItem(other.id, { featured: false });
      }
    }
    await updateSalaatuLibraryItem(s.id, { featured: !s.featured });
    await reload();
  }

  return (
    <AdminShell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
            Spiritualité
          </p>
          <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
            Bibliothèque des Salaats
          </h1>
          <p className="mt-2 text-gray-600 text-sm">
            {items.length} Salaat{items.length > 1 ? "s" : ""}. Si vous épinglez
            un favori, il devient le Salaatu du jour. Sinon, la rotation est
            automatique selon le jour de l&apos;année.
          </p>
        </div>
        {canEdit && (
          <div className="flex flex-wrap gap-2">
            {items.length < 10 && (
              <button
                type="button"
                onClick={handleImport}
                disabled={importing}
                className="inline-flex items-center gap-2 bg-[#0F7C55]/10 hover:bg-[#0F7C55]/20 text-[#0F7C55] border border-[#0F7C55]/20 py-3 px-5 rounded-xl font-semibold text-sm transition disabled:opacity-50"
              >
                {importing ? "Importation..." : "Importer la bibliothèque (30)"}
              </button>
            )}
            <Link
              href="/admin/bibliotheque/nouveau"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-3 px-5 rounded-xl font-bold text-sm"
            >
              <FaPlus /> Ajouter un Salaat
            </Link>
          </div>
        )}
      </header>

      {importSuccess && (
        <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3 border border-emerald-200 mb-4">
          La bibliothèque complète a été importée avec succès !
        </p>
      )}

      <div className="bg-white rounded-3xl shadow-md p-4 sm:p-5 mb-6 grid sm:grid-cols-[1fr_auto] gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un Salaat..."
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55] bg-white"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55] bg-white"
        >
          <option value="Toutes">Toutes catégories</option>
          {SALAATU_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100 mb-4">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center">
          <p className="text-gray-500">
            {items.length === 0
              ? "Aucun Salaat pour l'instant. Cliquez « Ajouter un Salaat » pour commencer."
              : "Aucun Salaat ne correspond à ces filtres."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl shadow-md p-4 sm:p-5 flex flex-wrap gap-4 items-center"
            >
              <button
                type="button"
                onClick={() => canEdit && toggleFeatured(s)}
                disabled={!canEdit}
                aria-label={s.featured ? "Retirer le favori" : "Mettre en favori"}
                className={`text-2xl ${
                  s.featured ? "text-[#D4AF37]" : "text-gray-300 hover:text-[#D4AF37]"
                }`}
              >
                {s.featured ? <FaStar /> : <FaRegStar />}
              </button>

              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                  {s.category}
                </p>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#0F7C55] truncate">
                  {s.title}
                </h3>
                <p className="text-xs text-gray-500 truncate font-arabic" dir="rtl">
                  {s.arabic.slice(0, 60)}…
                </p>
              </div>

              {canEdit && (
                <div className="flex gap-2">
                  <Link
                    href={`/admin/bibliotheque/${s.id}`}
                    className="inline-flex items-center gap-1 bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F7C55] py-1.5 px-3 rounded-lg text-xs font-semibold"
                  >
                    <FaPenToSquare /> Éditer
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(s)}
                    className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 px-3 rounded-lg text-xs font-semibold"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
