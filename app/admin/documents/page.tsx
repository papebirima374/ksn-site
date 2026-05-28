"use client";

import { useEffect, useState, FormEvent } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { hasPermission, OfficialDocument } from "@/lib/admin-types";
import {
  listOfficialDocuments,
  uploadOfficialDocument,
  updateOfficialDocument,
  deleteOfficialDocument,
} from "@/lib/admin-data";
import {
  FaPlus,
  FaTrash,
  FaPenToSquare,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEyeSlash,
  FaFilePdf,
  FaCloudArrowUp,
} from "react-icons/fa6";

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${bytes} o`;
}

const MAX_SIZE_MB = 10;

export default function AdminDocumentsPage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "articles.write");

  const [items, setItems] = useState<OfficialDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Formulaire d'upload
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  async function reload() {
    setLoading(true);
    try {
      setItems(await listOfficialDocuments());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(reload, 0);
  }, []);

  function reset() {
    setFile(null);
    setTitle("");
    setDescription("");
    setShowForm(false);
  }

  async function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file || !user) return;
    setError("");
    setSuccess("");

    // Validation taille
    const mb = file.size / (1024 * 1024);
    if (mb > MAX_SIZE_MB) {
      setError(`Le fichier fait ${mb.toFixed(1)} Mo. Maximum autorisé : ${MAX_SIZE_MB} Mo.`);
      return;
    }
    if (!title.trim() || !description.trim()) {
      setError("Le titre et la description sont obligatoires.");
      return;
    }

    setUploading(true);
    try {
      const maxOrder = items.reduce((m, i) => Math.max(m, i.order), -1);
      await uploadOfficialDocument(file, {
        title: title.trim(),
        description: description.trim(),
        order: maxOrder + 1,
        createdBy: user.uid,
      });
      setSuccess(`✓ « ${title} » ajouté avec succès.`);
      reset();
      await reload();
      setTimeout(() => setSuccess(""), 5000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  }

  async function move(d: OfficialDocument, dir: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((i) => i.id === d.id);
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;
    const target = sorted[targetIdx];
    await Promise.all([
      updateOfficialDocument(d.id, { order: target.order }),
      updateOfficialDocument(target.id, { order: d.order }),
    ]);
    await reload();
  }

  async function toggleVisible(d: OfficialDocument) {
    await updateOfficialDocument(d.id, { visible: !d.visible });
    await reload();
  }

  async function handleEdit(d: OfficialDocument) {
    const newTitle = prompt("Titre du document :", d.title);
    if (newTitle === null) return;
    const newDesc = prompt("Description :", d.description);
    if (newDesc === null) return;
    await updateOfficialDocument(d.id, {
      title: newTitle.trim() || d.title,
      description: newDesc.trim() || d.description,
    });
    await reload();
  }

  async function handleDelete(d: OfficialDocument) {
    if (!confirm(`Supprimer définitivement « ${d.title} » ?\n\nLe fichier PDF sera effacé du serveur.`))
      return;
    await deleteOfficialDocument(d);
    await reload();
  }

  return (
    <AdminShell>
      <header className="mb-8">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Contenu
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          Documents officiels
        </h1>
        <p className="mt-2 text-gray-600 text-sm max-w-2xl">
          Uploadez les PDF officiels du Dahira (règlement intérieur, statuts,
          plans d&apos;actions, rapports…). Ils sont affichés dans la section
          « Documents Officiels KSN » du site public.
        </p>
        {canEdit && !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold px-4 py-2.5 rounded-xl shadow-md hover:scale-105 transition text-sm"
          >
            <FaPlus /> Uploader un document
          </button>
        )}
      </header>

      {/* FORMULAIRE UPLOAD */}
      {canEdit && showForm && (
        <form
          onSubmit={handleUpload}
          className="bg-white rounded-3xl shadow-md p-6 sm:p-8 mb-8 space-y-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-[#0F7C55] flex items-center gap-2">
              <FaCloudArrowUp /> Nouveau document
            </h2>
            <button
              type="button"
              onClick={reset}
              className="text-sm text-gray-500 hover:text-[#0F7C55]"
            >
              Annuler
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
              {error}
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Fichier (PDF, DOC, max {MAX_SIZE_MB} Mo) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-[#0F7C55] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#0F7C55] file:text-white file:font-semibold file:cursor-pointer"
            />
            {file && (
              <p className="mt-2 text-xs text-gray-600 flex items-center gap-2">
                <FaFilePdf className="text-red-500" />
                <span className="font-mono">{file.name}</span>
                <span className="text-gray-400">— {formatSize(file.size)}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Titre affiché <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Règlement Intérieur & Statuts"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Description courte <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ex: Les règles fondamentales du Dahira KSN, les principes d'adhésion..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] leading-6"
            />
            <p className="mt-1 text-[11px] text-gray-500">
              2-3 lignes max. Visible sous le titre du document sur la page publique.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={uploading || !file || !title || !description}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100 text-sm"
            >
              <FaCloudArrowUp />
              {uploading ? "Upload en cours…" : "Publier le document"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="text-sm text-gray-500 hover:text-[#0F7C55] px-4 py-2.5"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {success && (
        <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3 border border-emerald-200 mb-4">
          {success}
        </p>
      )}

      {error && !showForm && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100 mb-4">
          {error}
        </p>
      )}

      {/* LISTE */}
      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center">
          <FaFilePdf className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500">
            Aucun document. Le site affiche les{" "}
            <strong>2 placeholders par défaut</strong> (Règlement & Plans d&apos;actions)
            tant que vous n&apos;avez rien uploadé ici.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {[...items]
            .sort((a, b) => a.order - b.order)
            .map((d) => (
              <article
                key={d.id}
                className={`bg-white rounded-2xl shadow-md p-5 border-l-4 ${
                  d.visible ? "border-l-[#0F7C55]" : "border-l-gray-300 opacity-60"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 text-xl">
                    <FaFilePdf />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#0F7C55] text-sm">
                      {d.title}
                      {!d.visible && (
                        <span className="ml-2 text-[10px] uppercase font-bold text-gray-500">
                          (masqué)
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                      {d.filename} — {formatSize(d.sizeBytes)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-6 line-clamp-3 mb-4">
                  {d.description}
                </p>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#B8860B] hover:underline font-semibold inline-flex items-center gap-1"
                >
                  Prévisualiser le PDF →
                </a>
                {canEdit && (
                  <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-gray-100">
                    <IconBtn onClick={() => move(d, -1)} label="Monter">
                      <FaArrowUp />
                    </IconBtn>
                    <IconBtn onClick={() => move(d, 1)} label="Descendre">
                      <FaArrowDown />
                    </IconBtn>
                    <IconBtn
                      onClick={() => toggleVisible(d)}
                      label={d.visible ? "Masquer" : "Afficher"}
                    >
                      {d.visible ? <FaEye /> : <FaEyeSlash />}
                    </IconBtn>
                    <div className="flex-1" />
                    <IconBtn onClick={() => handleEdit(d)} label="Éditer">
                      <FaPenToSquare />
                    </IconBtn>
                    <IconBtn
                      onClick={() => handleDelete(d)}
                      label="Supprimer"
                      variant="danger"
                    >
                      <FaTrash />
                    </IconBtn>
                  </div>
                )}
              </article>
            ))}
        </div>
      )}
    </AdminShell>
  );
}

function IconBtn({
  children,
  onClick,
  label,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  variant?: "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition ${
        variant === "danger"
          ? "bg-red-50 hover:bg-red-100 text-red-600"
          : "bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F7C55]"
      }`}
    >
      {children}
    </button>
  );
}
