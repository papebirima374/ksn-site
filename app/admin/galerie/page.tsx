"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import { FaPlus, FaTrash, FaPenToSquare } from "react-icons/fa6";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { hasPermission, GalleryItem } from "@/lib/admin-types";
import { addDoc, collection, getDoc, setDoc, doc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import {
  listGallery,
  uploadGalleryImage,
  updateGalleryItem,
  deleteGalleryItem,
} from "@/lib/admin-data";

const DEFAULT_G_ITEMS = [
  {
    src: "/images/journee/recital_coran.png",
    alt: "Récital du Saint Coran à l'ouverture",
    category: "journee" as const,
    year: "2025"
  },
  {
    src: "/images/journee/rajass_collectif.png",
    alt: "Rajass collectif — Muqàddamatul Xidma",
    category: "journee" as const,
    year: "2025"
  },
  {
    src: "/images/journee/conference_badiane.png",
    alt: "Conférence de Serigne Moustapha Badiane",
    category: "journee" as const,
    year: "2025"
  },
  {
    src: "/images/journee/declamation_khassida.png",
    alt: "Déclamation des Khassida — Kourel Hizbut Tarqiya",
    category: "journee" as const,
    year: "2024"
  },
  {
    src: "/images/journee/mosquee_touba.png",
    alt: "La oumma réunie devant la grande mosquée",
    category: "journee" as const,
    year: "2024"
  },
  {
    src: "/images/journee/discours_bassirou.png",
    alt: "Mot de la Fin par Serigne Bassirou Toure",
    category: "journee" as const,
    year: "2024"
  }
];

const CATEGORIES: { id: GalleryItem["category"]; label: string }[] = [
  { id: "evenements", label: "Événements" },
  { id: "activites", label: "Activités" },
  { id: "journee", label: "Journée Salaatu" },
  { id: "assemblee", label: "Assemblée générale" },
];

/** Categories pour lesquelles le champ "Annee" est important (editions
 *  annuelles d'evenements). Pour les autres, on accepte mais on ne le
 *  rend pas obligatoire. */
const YEAR_RELEVANT: GalleryItem["category"][] = ["journee", "assemblee", "evenements"];

export default function AdminGaleriePage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "gallery.write");
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [alt, setAlt] = useState("");
  const [category, setCategory] = useState<GalleryItem["category"]>("activites");
  const [year, setYear] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number; failed: number } | null>(null);
  const [filter, setFilter] = useState<GalleryItem["category"] | "all">("all");

  async function reload() {
    setLoading(true);
    try {
      const db = getDb();
      const seedDocRef = doc(db, "config", "gallery_seeded");
      const seedSnap = await getDoc(seedDocRef);
      if (!seedSnap.exists()) {
        for (const d of DEFAULT_G_ITEMS) {
          await addDoc(collection(db, "gallery"), {
            src: d.src,
            alt: d.alt,
            category: d.category,
            year: d.year,
            createdAt: Date.now(),
            createdBy: "system",
          });
        }
        await setDoc(seedDocRef, { seeded: true, timestamp: Date.now() });
      }

      setItems(await listGallery());
      setError("");
    } catch (e) {
      console.error("Gallery reload/seed error:", e);
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
    if (files.length === 0 || !user) return;
    setUploading(true);
    setError("");
    setProgress({ current: 0, total: files.length, failed: 0 });
    let failed = 0;
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      // Si plusieurs fichiers + legende fournie, on l'index (1/N, 2/N...)
      // Sinon on garde la legende OU on retombe sur le nom de fichier.
      const baseAlt = alt.trim() || f.name.replace(/\.[^.]+$/, "");
      const finalAlt =
        files.length > 1 ? `${baseAlt} (${i + 1}/${files.length})` : baseAlt;
      try {
        await uploadGalleryImage(f, {
          alt: finalAlt,
          category,
          year: year.trim() || undefined,
          createdBy: user.uid,
        });
      } catch (err) {
        console.error("Upload failed for", f.name, err);
        failed++;
      }
      setProgress({ current: i + 1, total: files.length, failed });
    }
    if (failed > 0) {
      setError(`${failed} fichier(s) sur ${files.length} ont échoué.`);
    }
    setFiles([]);
    setAlt("");
    setYear("");
    setUploading(false);
    // Laisse le toast de progression visible 2 sec
    setTimeout(() => setProgress(null), 2000);
    await reload();
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
      "Catégorie (evenements / activites / journee / assemblee) :",
      item.category
    );
    if (newCat === null) return;
    if (!CATEGORIES.find((c) => c.id === newCat)) {
      alert("Catégorie invalide.");
      return;
    }
    const newYear = prompt(
      "Année (ex: 2024) — laissez vide si non applicable :",
      item.year || ""
    );
    await updateGalleryItem(item.id, {
      alt: newAlt,
      category: newCat as GalleryItem["category"],
      year: newYear?.trim() || undefined,
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
          className="bg-white rounded-3xl shadow-md p-6 sm:p-8 mb-8 grid sm:grid-cols-2 lg:grid-cols-[1fr_1fr_140px_auto] gap-4 items-end"
        >
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Photo{files.length > 1 && (
                <span className="ml-2 text-[#B8860B] font-bold">
                  · {files.length} fichiers sélectionnés
                </span>
              )}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              required
              onChange={(e) =>
                setFiles(e.target.files ? Array.from(e.target.files) : [])
              }
              className="w-full text-sm text-[#0F7C55] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#0F7C55] file:text-white file:font-semibold file:cursor-pointer"
            />
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder={
                files.length > 1
                  ? "Légende commune (numérotée auto: 1/N, 2/N…)"
                  : "Légende (optionnel)"
              }
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
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Année {YEAR_RELEVANT.includes(category) && <span className="text-[#B8860B]">★</span>}
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="ex: 2024"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55]"
            />
          </div>
          <button
            type="submit"
            disabled={files.length === 0 || uploading}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-2.5 px-5 rounded-xl font-bold disabled:opacity-50 whitespace-nowrap"
          >
            <FaPlus />{" "}
            {uploading
              ? `Upload ${progress?.current ?? 0}/${progress?.total ?? files.length}…`
              : files.length > 1
              ? `Envoyer ${files.length}`
              : "Ajouter"}
          </button>
        </form>
      )}

      {progress && (
        <div className="bg-white rounded-2xl border border-[#D4AF37]/30 p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-[#0F7C55]">
              Envoi en cours · {progress.current}/{progress.total}
              {progress.failed > 0 && (
                <span className="ml-2 text-red-600">
                  ({progress.failed} échec{progress.failed > 1 ? "s" : ""})
                </span>
              )}
            </p>
            <span className="text-xs text-gray-500 tabular-nums">
              {Math.round((progress.current / progress.total) * 100)} %
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0F7C55] to-[#D4AF37] transition-all duration-300"
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
              }}
            />
          </div>
        </div>
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
                  {item.year && (
                    <span className="text-gray-400 normal-case font-medium ml-1.5">
                      · {item.year}
                    </span>
                  )}
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
