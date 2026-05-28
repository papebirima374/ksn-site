"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import {
  hasPermission,
  EducationModule,
  EducationLesson,
} from "@/lib/admin-types";
import {
  getEducationModule,
  listEducationLessons,
  updateEducationModule,
  deleteEducationModule,
  createEducationLesson,
  updateEducationLesson,
  deleteEducationLesson,
} from "@/lib/admin-data";
import {
  FaArrowLeft,
  FaPenToSquare,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaCirclePlus,
  FaCircleCheck,
  FaCircle,
  FaHeadphones,
  FaChevronRight,
} from "react-icons/fa6";

const PUBLISH_OPTIONS: EducationModule["publishStatus"][] = ["draft", "preview", "published"];

export default function AdminEducationModuleEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const canEdit = hasPermission(user, "education.write");

  const moduleId = String(params?.id ?? "");
  const [module, setModule] = useState<EducationModule | null>(null);
  const [lessons, setLessons] = useState<EducationLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function reload() {
    setLoading(true);
    setError("");
    try {
      // On charge le module en premier — c'est lui qui détermine
      // l'existence. Si le get fail, on n'essaie meme pas les lecons.
      const m = await getEducationModule(moduleId);
      setModule(m);
      if (m) {
        try {
          const lsns = await listEducationLessons(moduleId);
          setLessons(lsns);
        } catch (e2) {
          // Si la liste des lecons fail (composite index, perms),
          // on garde le module visible et on affiche l'erreur listing.
          setError(
            e2 instanceof Error
              ? `Module chargé, mais erreur sur les leçons : ${e2.message}`
              : "Erreur de chargement des leçons"
          );
          setLessons([]);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (moduleId) setTimeout(reload, 0);
  }, [moduleId]);

  async function patchModule(patch: Partial<EducationModule>) {
    if (!module) return;
    setSaving(true);
    try {
      await updateEducationModule(module.id, patch);
      setModule({ ...module, ...patch });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteModule() {
    if (!module) return;
    if (!confirm(`Supprimer le module « ${module.title?.fr} » et ses ${lessons.length} leçons ?\n\nCette action est irréversible.`)) return;
    await deleteEducationModule(module.id);
    router.push("/admin/education");
  }

  async function addLesson() {
    if (!module) return;
    const title = prompt("Titre de la nouvelle leçon (français) :");
    if (!title?.trim()) return;
    const maxOrder = lessons.reduce((m, l) => Math.max(m, l.order), 0);
    const nextOrder = maxOrder + 1;
    await createEducationLesson({
      moduleId: module.id,
      slug: `${module.slug}-${nextOrder}`,
      reference: `${module.order}.${nextOrder}`,
      order: nextOrder,
      title: { fr: title.trim() },
      content: { fr: "" },
      publishStatus: "draft",
      publicAccess: false,
    });
    await reload();
  }

  async function moveLesson(l: EducationLesson, dir: -1 | 1) {
    const sorted = [...lessons].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((x) => x.id === l.id);
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;
    const target = sorted[targetIdx];
    await Promise.all([
      updateEducationLesson(l.id, { order: target.order }),
      updateEducationLesson(target.id, { order: l.order }),
    ]);
    await reload();
  }

  async function deleteLesson(l: EducationLesson) {
    if (!confirm(`Supprimer la leçon « ${l.title?.fr || "Sans titre"} » ?`)) return;
    await deleteEducationLesson(l.id);
    await reload();
  }

  if (loading) {
    return (
      <AdminShell>
        <p className="text-gray-400">Chargement…</p>
      </AdminShell>
    );
  }

  if (!module) {
    return (
      <AdminShell>
        <div className="bg-white rounded-3xl p-8 text-center">
          <p className="text-gray-600 mb-3">Module introuvable.</p>
          <Link href="/admin/education" className="text-[#B8860B] underline text-sm">
            Retour aux modules
          </Link>
        </div>
      </AdminShell>
    );
  }

  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);

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
          Module {module.order} · {module.sourceWork}
        </p>
        <input
          type="text"
          value={module.title?.fr ?? ""}
          onChange={(e) => setModule({
            ...module,
            title: { ...module.title, fr: e.target.value },
          })}
          onBlur={(e) => patchModule({ title: { ...module.title, fr: e.target.value } })}
          disabled={!canEdit}
          className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55] bg-transparent outline-none w-full border-b-2 border-transparent focus:border-[#D4AF37] py-1"
          placeholder="Titre du module"
        />
        {module.titleArabic && (
          <p className="font-arabic mt-2 text-2xl text-[#D4AF37]" dir="rtl">
            {module.titleArabic}
          </p>
        )}
      </header>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100 mb-4">
          {error}
        </p>
      )}

      {/* Métadonnées module */}
      {canEdit && (
        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
          <h2 className="text-[10px] uppercase tracking-widest text-[#B8860B] font-bold mb-4">
            Paramètres du module
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Titre arabe
              </label>
              <input
                type="text"
                defaultValue={module.titleArabic ?? ""}
                onBlur={(e) => patchModule({ titleArabic: e.target.value.trim() || undefined })}
                placeholder="ex: أصول الإيمان"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] font-arabic text-right"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Statut de publication
              </label>
              <select
                value={module.publishStatus}
                onChange={(e) => patchModule({ publishStatus: e.target.value as EducationModule["publishStatus"] })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
              >
                {PUBLISH_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s === "draft" ? "Brouillon" : s === "preview" ? "Aperçu (admins)" : "Publié"}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Description courte (FR)
              </label>
              <textarea
                defaultValue={module.description?.fr ?? ""}
                onBlur={(e) => patchModule({ description: { ...module.description, fr: e.target.value } })}
                rows={2}
                placeholder="Une phrase pour situer le module…"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] leading-6"
              />
            </div>
          </div>
          {saving && (
            <p className="mt-3 text-xs text-gray-400 italic">Sauvegarde en cours…</p>
          )}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={handleDeleteModule}
              className="text-xs text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1.5"
            >
              <FaTrash /> Supprimer le module (+ {lessons.length} leçons)
            </button>
          </div>
        </div>
      )}

      {/* Leçons */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-[#0F7C55]">
          Leçons ({lessons.length})
        </h2>
        {canEdit && (
          <button
            type="button"
            onClick={addLesson}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold px-3 py-1.5 rounded-xl text-sm shadow-sm hover:scale-105 transition"
          >
            <FaCirclePlus /> Nouvelle leçon
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-md overflow-hidden">
        {sortedLessons.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm">Aucune leçon dans ce module.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {sortedLessons.map((l) => {
              const hasFr = Boolean(l.title?.fr);
              const hasContent = Boolean(l.content?.fr?.trim());
              const audioCount = Object.keys(l.audio || {}).length;
              const statusInfo = l.publishStatus === "published"
                ? { label: "Publié", cls: "bg-emerald-100 text-emerald-700" }
                : l.publishStatus === "preview"
                ? { label: "Aperçu", cls: "bg-orange-100 text-orange-700" }
                : { label: "Brouillon", cls: "bg-gray-100 text-gray-700" };
              return (
                <li key={l.id} className="flex items-center gap-3 px-4 sm:px-6 py-4 hover:bg-[#F8F5EF]/50 transition">
                  <span className="text-[10px] font-mono text-gray-400 tabular-nums w-8 flex-shrink-0">
                    {l.reference}
                  </span>
                  <Link
                    href={`/admin/education/lecons/${l.id}`}
                    className="min-w-0 flex-1"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[#0F7C55] text-sm">
                        {l.title?.fr || "Sans titre"}
                      </p>
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${statusInfo.cls}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        {hasFr ? <FaCircleCheck className="text-emerald-500" /> : <FaCircle className="text-gray-300" />}
                        Titre FR
                      </span>
                      <span className="inline-flex items-center gap-1">
                        {hasContent ? <FaCircleCheck className="text-emerald-500" /> : <FaCircle className="text-gray-300" />}
                        Contenu FR
                      </span>
                      {audioCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <FaHeadphones /> {audioCount}
                        </span>
                      )}
                    </div>
                  </Link>
                  {canEdit && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <IconBtn onClick={() => moveLesson(l, -1)} label="Monter">
                        <FaArrowUp />
                      </IconBtn>
                      <IconBtn onClick={() => moveLesson(l, 1)} label="Descendre">
                        <FaArrowDown />
                      </IconBtn>
                      <Link
                        href={`/admin/education/lecons/${l.id}`}
                        className="w-8 h-8 rounded-lg bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F7C55] flex items-center justify-center text-xs"
                        title="Éditer"
                      >
                        <FaPenToSquare />
                      </Link>
                      <IconBtn onClick={() => deleteLesson(l)} label="Supprimer" variant="danger">
                        <FaTrash />
                      </IconBtn>
                    </div>
                  )}
                  <FaChevronRight className="text-gray-300 text-xs hidden sm:block" />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}

function IconBtn({ children, onClick, label, variant }: {
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
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition ${
        variant === "danger"
          ? "bg-red-50 hover:bg-red-100 text-red-600"
          : "bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F7C55]"
      }`}
    >
      {children}
    </button>
  );
}
