"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import {
  hasPermission,
  EducationLesson,
  EducationModule,
} from "@/lib/admin-types";
import {
  getEducationLesson,
  getEducationModule,
  updateEducationLesson,
  deleteEducationLesson,
  attachLessonAudio,
  computeContentHash,
} from "@/lib/admin-data";
import {
  FaArrowLeft,
  FaTrash,
  FaCloudArrowUp,
  FaWandMagicSparkles,
  FaCircleCheck,
  FaCircleInfo,
  FaPlay,
  FaPause,
  FaRotate,
} from "react-icons/fa6";

const TABS = ["Texte", "Audio", "Métadonnées"] as const;
type Tab = (typeof TABS)[number];

const PUBLISH_OPTIONS: EducationLesson["publishStatus"][] = ["draft", "preview", "published"];

export default function AdminEducationLessonEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const canEdit = hasPermission(user, "education.write");

  const lessonId = String(params?.id ?? "");
  const [lesson, setLesson] = useState<EducationLesson | null>(null);
  const [moduleParent, setModuleParent] = useState<EducationModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("Texte");
  const [error, setError] = useState("");

  // Audio gen state
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function reload() {
    setLoading(true);
    try {
      const l = await getEducationLesson(lessonId);
      if (l) {
        setLesson(l);
        const m = await getEducationModule(l.moduleId);
        setModuleParent(m);
      }
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (lessonId) setTimeout(reload, 0);
  }, [lessonId]);

  async function patch(p: Partial<EducationLesson>) {
    if (!lesson) return;
    setSaving(true);
    try {
      await updateEducationLesson(lesson.id, p);
      setLesson({ ...lesson, ...p });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de sauvegarde");
    } finally {
      setTimeout(() => setSaving(false), 200);
    }
  }

  async function handleDelete() {
    if (!lesson) return;
    if (!confirm(`Supprimer la leçon « ${lesson.title?.fr} » ?\n\nLes audios associés seront aussi effacés du Storage.`)) return;
    await deleteEducationLesson(lesson.id);
    router.push(`/admin/education/modules/${lesson.moduleId}`);
  }

  async function generateAudioFR() {
    if (!lesson) return;
    const fr = lesson.content?.fr ?? "";
    if (!fr.trim()) {
      setError("Le contenu FR est vide — rédigez d'abord la leçon.");
      return;
    }
    setError("");
    setGenerating(true);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);

    try {
      // Compose le texte complet a synthetiser (titre + intention + contenu + citation + application + rappel)
      const parts: string[] = [];
      if (lesson.title?.fr) parts.push(lesson.title.fr + ".");
      if (lesson.intention?.fr) parts.push(lesson.intention.fr);
      if (fr) parts.push(fr);
      if (lesson.citation?.translations?.fr) {
        parts.push(`Citation : ${lesson.citation.translations.fr}`);
      }
      if (lesson.application?.fr) parts.push(lesson.application.fr);
      if (lesson.reminder?.fr) parts.push(`À retenir : ${lesson.reminder.fr}`);
      const fullText = parts.join("\n\n");
      const contentHash = await computeContentHash(fullText);

      // Appel API serveur
      const res = await fetch("/api/education/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: fullText,
          language: "fr",
          // pas de voiceId -> utilise DEFAULT (Marc Neural2-C)
          provider: "auto",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Erreur serveur" }));
        throw new Error(err.error || "Échec génération");
      }
      const blob = await res.blob();
      const provider = res.headers.get("X-Tts-Provider") as "google" | "edge" || "edge";
      const voiceId = res.headers.get("X-Tts-Voice") || "fr-FR-Neural2-C";
      const durationSec = Number(res.headers.get("X-Tts-Estimated-Seconds") || 0);

      // Preview immediat
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      // Sauvegarde Storage + maj Firestore
      const saved = await attachLessonAudio(lesson.id, "fr", blob, {
        contentHash,
        voiceId,
        provider,
        durationSec,
      });

      // Recharge la leçon pour avoir l'audio attaché
      setLesson({
        ...lesson,
        audio: { ...(lesson.audio || {}), fr: saved },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur génération");
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <p className="text-gray-400">Chargement…</p>
      </AdminShell>
    );
  }

  if (!lesson) {
    return (
      <AdminShell>
        <div className="bg-white rounded-3xl p-8 text-center">
          <p className="text-gray-600 mb-3">Leçon introuvable.</p>
          <Link href="/admin/education" className="text-[#B8860B] underline text-sm">
            Retour aux modules
          </Link>
        </div>
      </AdminShell>
    );
  }

  const audioFr = lesson.audio?.fr;
  const charsCount = (lesson.content?.fr ?? "").length;
  const estimatedSec = Math.ceil(charsCount / 13 / 0.92);

  return (
    <AdminShell>
      <header className="mb-6">
        {moduleParent && (
          <Link
            href={`/admin/education/modules/${moduleParent.id}`}
            className="inline-flex items-center gap-2 text-sm text-[#0F7C55] hover:text-[#B8860B] mb-4"
          >
            <FaArrowLeft /> {moduleParent.title?.fr || "Module"}
          </Link>
        )}
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Leçon {lesson.reference}
        </p>
        <input
          type="text"
          value={lesson.title?.fr ?? ""}
          onChange={(e) => setLesson({
            ...lesson,
            title: { ...lesson.title, fr: e.target.value },
          })}
          onBlur={(e) => patch({ title: { ...lesson.title, fr: e.target.value } })}
          disabled={!canEdit}
          className="font-display mt-2 text-2xl sm:text-3xl font-bold text-[#0F7C55] bg-transparent outline-none w-full border-b-2 border-transparent focus:border-[#D4AF37] py-1"
          placeholder="Titre de la leçon"
        />
      </header>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100 mb-4">
          {error}
        </p>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition ${
              tab === t
                ? "border-[#0F7C55] text-[#0F7C55]"
                : "border-transparent text-gray-500 hover:text-[#0F7C55]"
            }`}
          >
            {t}
          </button>
        ))}
        {saving && (
          <span className="ml-auto self-center text-[11px] text-gray-400 italic">Sauvegarde…</span>
        )}
      </div>

      {/* TAB TEXTE */}
      {tab === "Texte" && (
        <div className="bg-white rounded-3xl shadow-md p-6 space-y-5">
          <Field
            label="Titre arabe (optionnel)"
            value={lesson.titleArabic ?? ""}
            onBlur={(v) => patch({ titleArabic: v.trim() || undefined })}
            isArabic
            placeholder="ex: الوضوء"
            disabled={!canEdit}
          />

          <Field
            label="Intention (Niya) — court paragraphe d'ouverture"
            value={lesson.intention?.fr ?? ""}
            onBlur={(v) => patch({ intention: { ...lesson.intention, fr: v } })}
            multiline
            rows={2}
            placeholder="Au nom d'Allah, le Tout Miséricordieux…"
            disabled={!canEdit}
          />

          <Field
            label="Contenu principal (Markdown supporté)"
            value={lesson.content?.fr ?? ""}
            onBlur={(v) => patch({ content: { ...lesson.content, fr: v } })}
            multiline
            rows={12}
            placeholder="L'enseignement principal de la leçon…"
            disabled={!canEdit}
            hint={`${charsCount} caractères · ~${estimatedSec} sec en audio`}
          />

          {/* Citation */}
          <div className="bg-[#F8F5EF] rounded-2xl p-4 sm:p-5 space-y-3">
            <p className="text-xs font-bold text-[#B8860B] uppercase tracking-widest">
              Citation centrale (verset / hadith / Serigne Touba)
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                defaultValue={lesson.citation?.author ?? ""}
                onBlur={(e) => patch({ citation: { ...lesson.citation, author: e.target.value.trim() || undefined } })}
                disabled={!canEdit}
                placeholder="Auteur (ex: Serigne Touba)"
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white text-[#0F7C55]"
              />
              <input
                type="text"
                defaultValue={lesson.citation?.sourceRef ?? ""}
                onBlur={(e) => patch({ citation: { ...lesson.citation, sourceRef: e.target.value.trim() || undefined } })}
                disabled={!canEdit}
                placeholder="Référence (ex: Coran 33:56)"
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white text-[#0F7C55]"
              />
            </div>
            <textarea
              defaultValue={lesson.citation?.arabic ?? ""}
              onBlur={(e) => patch({ citation: { ...lesson.citation, arabic: e.target.value.trim() || undefined } })}
              disabled={!canEdit}
              rows={2}
              placeholder="النص العربي"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-base bg-white text-[#0F7C55] font-arabic text-right leading-loose"
              dir="rtl"
            />
            <textarea
              defaultValue={lesson.citation?.translations?.fr ?? ""}
              onBlur={(e) => patch({ citation: { ...lesson.citation, translations: { ...lesson.citation?.translations, fr: e.target.value } } })}
              disabled={!canEdit}
              rows={2}
              placeholder="Traduction française…"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white text-[#0F7C55] leading-6"
            />
          </div>

          <Field
            label="Application pratique (comment intégrer dans la vie quotidienne)"
            value={lesson.application?.fr ?? ""}
            onBlur={(v) => patch({ application: { ...lesson.application, fr: v } })}
            multiline
            rows={3}
            placeholder="Au quotidien, vous pouvez…"
            disabled={!canEdit}
          />

          <Field
            label="Rappel à mémoriser (1 phrase)"
            value={lesson.reminder?.fr ?? ""}
            onBlur={(v) => patch({ reminder: { ...lesson.reminder, fr: v } })}
            placeholder="Un message court à retenir…"
            disabled={!canEdit}
          />
        </div>
      )}

      {/* TAB AUDIO */}
      {tab === "Audio" && (
        <div className="space-y-5">
          <div className="bg-white rounded-3xl shadow-md p-6">
            <h3 className="font-display text-lg font-bold text-[#0F7C55] mb-2">
              Audio Français
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Voix officielle : <strong>Marc (fr-FR-Neural2-C)</strong> · Vitesse 0.92x · Pauses spirituelles automatiques
            </p>

            {audioFr ? (
              <div className="bg-gradient-to-br from-[#0A3D24] to-[#082F22] rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <FaCircleCheck className="text-emerald-400" />
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                    Audio sauvegardé
                  </span>
                </div>
                <p className="text-sm mb-3">
                  <strong>{audioFr.provider === "google" ? "🌐 Google Cloud" : "⚡ Edge TTS"}</strong> ·{" "}
                  <span className="text-[#D4AF37]">{audioFr.voiceId}</span>
                </p>
                <p className="text-white/60 text-xs mb-4">
                  ~{audioFr.durationSec}s · {Math.round(audioFr.sizeBytes / 1024)} Ko ·
                  généré le {new Date(audioFr.generatedAt).toLocaleDateString("fr-FR", { dateStyle: "medium" })}
                </p>
                <audio src={audioFr.url} controls className="w-full" />
              </div>
            ) : previewUrl ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <p className="text-xs uppercase font-bold tracking-widest text-amber-700 mb-2">
                  Aperçu généré
                </p>
                <audio src={previewUrl} controls className="w-full" />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-6 text-center text-gray-500">
                <FaCircleInfo className="mx-auto text-2xl mb-2 text-gray-400" />
                <p className="text-sm">Aucun audio généré pour cette leçon.</p>
                <p className="text-xs mt-1">Cliquez ci-dessous pour créer le premier.</p>
              </div>
            )}

            {canEdit && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={generateAudioFR}
                  disabled={generating || charsCount === 0}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100 text-sm"
                >
                  {audioFr ? <FaRotate /> : <FaWandMagicSparkles />}
                  {generating
                    ? "Génération en cours…"
                    : audioFr
                    ? "Régénérer avec Marc"
                    : "Générer l'audio (Marc)"}
                </button>
                {charsCount === 0 && (
                  <p className="mt-2 text-xs text-orange-600">
                    Le contenu FR est vide. Allez dans l&apos;onglet « Texte » d&apos;abord.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="bg-[#F8F5EF] border border-[#D4AF37]/30 rounded-3xl p-5 text-sm text-[#0F7C55] leading-6">
            <p className="flex items-start gap-2">
              <FaCircleInfo className="text-[#B8860B] mt-1 flex-shrink-0" />
              <span>
                Les autres langues (EN, AR, IT, ES) seront disponibles
                dans la prochaine itération. Le wolof reste un upload
                manuel par la commission pour préserver la qualité authentique.
              </span>
            </p>
          </div>
        </div>
      )}

      {/* TAB METADONNEES */}
      {tab === "Métadonnées" && (
        <div className="bg-white rounded-3xl shadow-md p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Référence
              </label>
              <input
                type="text"
                defaultValue={lesson.reference}
                onBlur={(e) => patch({ reference: e.target.value.trim() || lesson.reference })}
                disabled={!canEdit}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Slug URL
              </label>
              <input
                type="text"
                defaultValue={lesson.slug}
                onBlur={(e) => patch({ slug: e.target.value.trim() || lesson.slug })}
                disabled={!canEdit}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Statut
              </label>
              <select
                value={lesson.publishStatus}
                onChange={(e) => patch({ publishStatus: e.target.value as EducationLesson["publishStatus"] })}
                disabled={!canEdit}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
              >
                {PUBLISH_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s === "draft" ? "Brouillon" : s === "preview" ? "Aperçu" : "Publié"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Accès public
              </label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lesson.publicAccess}
                  onChange={(e) => patch({ publicAccess: e.target.checked })}
                  disabled={!canEdit}
                  className="w-4 h-4 accent-[#0F7C55]"
                />
                <span className="text-sm text-[#0F7C55]">
                  Gratuit pour tous les visiteurs
                </span>
              </label>
              {!lesson.publicAccess && (
                <p className="mt-1 text-[11px] text-gray-500">
                  Réservée aux membres actifs.
                </p>
              )}
            </div>
          </div>

          {canEdit && (
            <div className="pt-5 border-t border-gray-100">
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1.5"
              >
                <FaTrash /> Supprimer cette leçon (et son audio)
              </button>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}

function Field({
  label,
  value,
  onBlur,
  multiline,
  rows = 3,
  isArabic,
  placeholder,
  disabled,
  hint,
}: {
  label: string;
  value: string;
  onBlur: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  isArabic?: boolean;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}
        {hint && <span className="ml-2 text-gray-400 font-normal">· {hint}</span>}
      </label>
      {multiline ? (
        <textarea
          defaultValue={value}
          onBlur={(e) => onBlur(e.target.value)}
          rows={rows}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55] leading-6 font-mono ${isArabic ? "font-arabic text-base text-right" : ""}`}
          dir={isArabic ? "rtl" : "ltr"}
        />
      ) : (
        <input
          type="text"
          defaultValue={value}
          onBlur={(e) => onBlur(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] ${isArabic ? "font-arabic text-base text-right" : ""}`}
          dir={isArabic ? "rtl" : "ltr"}
        />
      )}
    </div>
  );
}
