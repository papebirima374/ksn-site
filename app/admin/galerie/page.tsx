"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import { FaPlus, FaTrash, FaPenToSquare } from "react-icons/fa6";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { hasPermission, GalleryItem } from "@/lib/admin-types";
import {
  listGallery,
  uploadGalleryImage,
  updateGalleryItem,
  deleteGalleryItem,
} from "@/lib/admin-data";

const CATEGORIES: { id: GalleryItem["category"]; label: string }[] = [
  { id: "gamou", label: "Gamou" },
  { id: "conferences", label: "Conférences" },
  { id: "evenements", label: "Événements" },
  { id: "activites", label: "Activités" },
];

export default function AdminGaleriePage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "gallery.write");
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [category, setCategory] = useState<GalleryItem["category"]>("activites");
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<GalleryItem["category"] | "all">("all");

  async function reload() {
    setLoading(true);
    try {
      setItems(await listGallery());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      reload();
    }, 0);
  }, []);

  async function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file || !user) return;
    setUploading(true);
    try {
      await uploadGalleryImage(file, {
        alt: alt || file.name,
        category,
        createdBy: user.uid,
      });
      setFile(null);
      setAlt("");
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'upload");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(item: GalleryItem) {
    if (!confirm(`Supprimer définitivement « ${item.alt} » ?`)) return;
    await deleteGalleryItem(item);
    await reload();
  }

  async function handleEdit(item: GalleryItem) {
    const newAlt = prompt("Légende de la photo :", item.alt);
    if (newAlt === null) return;
    const newCat = prompt(
      "Catégorie (gamou / conferences / evenements / activites) :",
      item.category
    );
    if (newCat === null) return;
    if (!CATEGORIES.find((c) => c.id === newCat)) {
      alert("Catégorie invalide.");
      return;
    }
    await updateGalleryItem(item.id, {
      alt: newAlt,
      category: newCat as GalleryItem["category"],
    });
    await reload();
  }

  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <AdminShell>
      <header className="mb-8">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Contenu
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          Galerie photos
        </h1>
        <p className="mt-2 text-gray-600 text-sm">
          {items.length} photo{items.length > 1 ? "s" : ""} dans la galerie.
        </p>
      </header>

      {canEdit && (
        <form
          onSubmit={handleUpload}
          className="bg-white rounded-3xl shadow-md p-6 sm:p-8 mb-8 grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end"
        >
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Photo
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-[#0F7C55] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#0F7C55] file:text-white file:font-semibold file:cursor-pointer"
            />
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Légende (optionnel)"
              className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Catégorie
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as GalleryItem["category"])
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55] bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={!file || uploading}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-2.5 px-5 rounded-xl font-bold disabled:opacity-50"
          >
            <FaPlus /> {uploading ? "Upload…" : "Ajouter"}
          </button>
        </form>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100 mb-4">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
          Toutes ({items.length})
        </FilterPill>
        {CATEGORIES.map((c) => {
          const count = items.filter((i) => i.category === c.id).length;
          return (
            <FilterPill
              key={c.id}
              active={filter === c.id}
              onClick={() => setFilter(c.id)}
            >
              {c.label} ({count})
            </FilterPill>
          );
        })}
      </div>

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 bg-white rounded-3xl p-8 text-center">
          Aucune photo dans cette catégorie. Uploadez-en une ci-dessus.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md group"
            >
              <div className="relative aspect-square">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-xs text-[#B8860B] uppercase tracking-widest font-bold">
                  {item.category}
                </p>
                <p className="mt-1 text-sm text-[#0F7C55] line-clamp-2">
                  {item.alt}
                </p>
                {canEdit && (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F7C55] py-1.5 rounded-lg text-xs font-semibold"
                    >
                      <FaPenToSquare /> Éditer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="inline-flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 py-1.5 px-3 rounded-lg text-xs font-semibold"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
        active
          ? "bg-[#0F7C55] text-white"
          : "bg-white text-[#0F7C55] hover:bg-[#F8F5EF]"
      }`}
    >
      {children}
    </button>
  );
}
