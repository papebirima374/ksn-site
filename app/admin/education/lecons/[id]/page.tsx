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
  deleteLessonAudio,
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
  FaPlus,
} from "react-icons/fa6";

const TABS = ["Texte", "Audio", "Quiz", "Métadonnées"] as const;
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
  const [langTab, setLangTab] = useState<"fr" | "wo">("fr");
  const [error, setError] = useState("");

  // Audio gen/upload state
  const [generating, setGenerating] = useState(false);
  const [uploadingWo, setUploadingWo] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

      const res = await fetch("/api/education/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: fullText,
          language: "fr",
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

      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      const saved = await attachLessonAudio(lesson.id, "fr", blob, {
        contentHash,
        voiceId,
        provider,
        durationSec,
      });

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

  async function handleUploadWolofAudio(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !lesson) return;
    setUploadingWo(true);
    setError("");

    try {
      const audioUrl = URL.createObjectURL(file);
      const audioObj = new Audio(audioUrl);
      let durationSec = 0;
      await new Promise<void>((resolve) => {
        audioObj.addEventListener("loadedmetadata", () => {
          durationSec = Math.round(audioObj.duration);
          resolve();
        });
        audioObj.addEventListener("error", () => {
          durationSec = 60;
          resolve();
        });
      });
      URL.revokeObjectURL(audioUrl);

      const contentHash = "manual-" + Date.now();
      const saved = await attachLessonAudio(lesson.id, "wo", file, {
        contentHash,
        voiceId: "manual",
        provider: "manual_upload",
        durationSec,
      });

      setLesson({
        ...lesson,
        audio: { ...(lesson.audio || {}), wo: saved },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de téléversement");
    } finally {
      setUploadingWo(false);
    }
  }

  async function handleDeleteWolofAudio() {
    if (!lesson || !lesson.audio?.wo) return;
    if (!confirm("Supprimer l'audio Wolof ?\n\nLe fichier sera définitivement effacé du Storage.")) return;
    setUploadingWo(true);
    setError("");
    try {
      await deleteLessonAudio(lesson.id, "wo");
      const newAudio = { ...lesson.audio };
      delete newAudio.wo;
      setLesson({
        ...lesson,
        audio: newAudio,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression");
    } finally {
      setUploadingWo(false);
    }
  }

  async function handleAddQuestion() {
    if (!lesson) return;
    const newQ = {
      id: "q-" + Date.now(),
      question: { fr: "", wo: "" },
      options: [
        { id: "A", text: { fr: "", wo: "" } },
        { id: "B", text: { fr: "", wo: "" } },
      ],
      correctOptionId: "A",
      explanation: { fr: "", wo: "" },
    };
    const questions = [...(lesson.quiz?.questions || []), newQ];
    await patch({ quiz: { questions } });
  }

  async function handleDeleteQuestion(qId: string) {
    if (!lesson || !lesson.quiz) return;
    if (!confirm("Supprimer cette question du quiz ?")) return;
    const questions = lesson.quiz.questions.filter((q) => q.id !== qId);
    await patch({ quiz: { questions } });
  }

  async function handleAddOption(qId: string) {
    if (!lesson || !lesson.quiz) return;
    const questions = [...lesson.quiz.questions];
    const idx = questions.findIndex((q) => q.id === qId);
    if (idx !== -1) {
      const q = questions[idx];
      if (q.options.length >= 5) return;
      const nextId = String.fromCharCode(65 + q.options.length);
      q.options = [...q.options, { id: nextId, text: { fr: "", wo: "" } }];
      await patch({ quiz: { questions } });
    }
  }

  async function handleDeleteOption(qId: string, optId: string) {
    if (!lesson || !lesson.quiz) return;
    const questions = [...lesson.quiz.questions];
    const idx = questions.findIndex((q) => q.id === qId);
    if (idx !== -1) {
      const q = questions[idx];
      if (q.options.length <= 2) return;
      const filtered = q.options.filter((o) => o.id !== optId);
      // Re-index options
      q.options = filtered.map((o, index) => ({
        ...o,
        id: String.fromCharCode(65 + index),
      }));
      // Check correct id
      const found = q.options.find((o) => o.id === q.correctOptionId);
      if (!found) {
        q.correctOptionId = q.options[0].id;
      }
      await patch({ quiz: { questions } });
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
  const audioWo = lesson.audio?.wo;
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
          {/* Sélecteur de Langue */}
          <div className="flex gap-2 pb-2 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setLangTab("fr")}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                langTab === "fr"
                  ? "bg-[#0F7C55] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🇫🇷 Français
            </button>
            <button
              type="button"
              onClick={() => setLangTab("wo")}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                langTab === "wo"
                  ? "bg-[#0F7C55] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🇸🇳 Wolof
            </button>
          </div>

          {/* Titre arabe global visible dans les deux langues */}
          <Field
            label="Titre arabe (optionnel, partagé)"
            value={lesson.titleArabic ?? ""}
            onBlur={(v) => patch({ titleArabic: v.trim() || undefined })}
            isArabic
            placeholder="ex: الوضوء"
            disabled={!canEdit}
          />

          {langTab === "fr" ? (
            <>
              <Field
                label="Intention (Niya) — court paragraphe d'ouverture (FR)"
                value={lesson.intention?.fr ?? ""}
                onBlur={(v) => patch({ intention: { ...lesson.intention, fr: v } })}
                multiline
                rows={2}
                placeholder="Au nom d'Allah, le Tout Miséricordieux…"
                disabled={!canEdit}
              />

              <Field
                label="Contenu principal (Markdown supporté) (FR)"
                value={lesson.content?.fr ?? ""}
                onBlur={(v) => patch({ content: { ...lesson.content, fr: v } })}
                multiline
                rows={12}
                placeholder="L'enseignement principal de la leçon en français…"
                disabled={!canEdit}
                hint={`${charsCount} caractères · ~${estimatedSec} sec en audio`}
              />
            </>
          ) : (
            <>
              {/* Option de saisie d'un titre wolof si différent du français */}
              <Field
                label="Titre de la leçon en Wolof"
                value={lesson.title?.wo ?? ""}
                onBlur={(v) => patch({ title: { ...lesson.title, wo: v.trim() || undefined } })}
                placeholder="Titre en wolof (ex: Féexal..."
                disabled={!canEdit}
              />

              <Field
                label="Intention (Niya) — court paragraphe d'ouverture (Wolof)"
                value={lesson.intention?.wo ?? ""}
                onBlur={(v) => patch({ intention: { ...lesson.intention, wo: v } })}
                multiline
                rows={2}
                placeholder="Intention en wolof..."
                disabled={!canEdit}
              />

              <Field
                label="Contenu principal (Markdown) (Wolof)"
                value={lesson.content?.wo ?? ""}
                onBlur={(v) => patch({ content: { ...lesson.content, wo: v } })}
                multiline
                rows={12}
                placeholder="Rédiger l'enseignement principal de la leçon en wolof..."
                disabled={!canEdit}
              />
            </>
          )}

          {/* Citation (Champs communs + traductions bilingues) */}
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
            {langTab === "fr" ? (
              <textarea
                defaultValue={lesson.citation?.translations?.fr ?? ""}
                onBlur={(e) => patch({ citation: { ...lesson.citation, translations: { ...lesson.citation?.translations, fr: e.target.value } } })}
                disabled={!canEdit}
                rows={2}
                placeholder="Traduction française de la citation…"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white text-[#0F7C55] leading-6"
              />
            ) : (
              <textarea
                defaultValue={lesson.citation?.translations?.wo ?? ""}
                onBlur={(e) => patch({ citation: { ...lesson.citation, translations: { ...lesson.citation?.translations, wo: e.target.value } } })}
                disabled={!canEdit}
                rows={2}
                placeholder="Traduction wolof de la citation…"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white text-[#0F7C55] leading-6"
              />
            )}
          </div>

          {langTab === "fr" ? (
            <>
              <Field
                label="Application pratique (comment intégrer dans la vie quotidienne) (FR)"
                value={lesson.application?.fr ?? ""}
                onBlur={(v) => patch({ application: { ...lesson.application, fr: v } })}
                multiline
                rows={3}
                placeholder="Au quotidien, vous pouvez…"
                disabled={!canEdit}
              />

              <Field
                label="Rappel à mémoriser (1 phrase) (FR)"
                value={lesson.reminder?.fr ?? ""}
                onBlur={(v) => patch({ reminder: { ...lesson.reminder, fr: v } })}
                placeholder="Un message court à retenir en français…"
                disabled={!canEdit}
              />
            </>
          ) : (
            <>
              <Field
                label="Application pratique (Wolof)"
                value={lesson.application?.wo ?? ""}
                onBlur={(v) => patch({ application: { ...lesson.application, wo: v } })}
                multiline
                rows={3}
                placeholder="Au quotidien, en wolof..."
                disabled={!canEdit}
              />

              <Field
                label="Rappel à mémoriser (1 phrase) (Wolof)"
                value={lesson.reminder?.wo ?? ""}
                onBlur={(v) => patch({ reminder: { ...lesson.reminder, wo: v } })}
                placeholder="Rappel à retenir en wolof..."
                disabled={!canEdit}
              />
            </>
          )}
        </div>
      )}

      {/* TAB AUDIO */}
      {tab === "Audio" && (
        <div className="space-y-6">
          {/* AUDIO FRANÇAIS (TTS) */}
          <div className="bg-white rounded-3xl shadow-md p-6">
            <h3 className="font-display text-lg font-bold text-[#0F7C55] mb-2">
              Audio Français (Génération Automatique)
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
                    ? "Régénérer la voix"
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

          {/* AUDIO WOLOF (UPLOAD MANUEL) */}
          <div className="bg-white rounded-3xl shadow-md p-6">
            <h3 className="font-display text-lg font-bold text-[#0F7C55] mb-2">
              Audio Wolof (Import Manuel)
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Importez la récitation ou l&apos;explication audio de la Commission en Wolof (.mp3 uniquement).
            </p>

            {audioWo ? (
              <div className="bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-2xl p-5 text-[#0F7C55]">
                <div className="flex items-center gap-2 mb-3">
                  <FaCircleCheck className="text-[#0F7C55]" />
                  <span className="text-[10px] uppercase tracking-widest text-[#0F7C55] font-black">
                    Audio Wolof disponible
                  </span>
                </div>
                <p className="text-sm font-semibold mb-2">
                  Fichier téléversé manuellement
                </p>
                <p className="text-xs text-[#0F7C55]/70 mb-4">
                  ~{audioWo.durationSec}s · {Math.round(audioWo.sizeBytes / 1024)} Ko ·
                  importé le {new Date(audioWo.generatedAt).toLocaleDateString("fr-FR", { dateStyle: "medium" })}
                </p>
                <audio src={audioWo.url} controls className="w-full mb-4 border border-[#0F7C55]/20 rounded-lg bg-white/50" />
                
                {canEdit && (
                  <button
                    type="button"
                    onClick={handleDeleteWolofAudio}
                    disabled={uploadingWo}
                    className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-red-700 transition"
                  >
                    <FaTrash /> Supprimer l&apos;audio Wolof
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-6 text-center text-gray-500">
                <FaCloudArrowUp className="mx-auto text-3xl mb-2 text-gray-400" />
                <p className="text-sm">Aucun audio Wolof téléversé pour le moment.</p>
                <p className="text-xs mt-1">Choisissez un fichier MP3 ci-dessous.</p>
              </div>
            )}

            {canEdit && !audioWo && (
              <div className="mt-4">
                <label className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold px-5 py-2.5 rounded-xl shadow-sm hover:scale-105 transition cursor-pointer text-sm">
                  <FaCloudArrowUp />
                  {uploadingWo ? "Téléversement…" : "Choisir un fichier MP3"}
                  <input
                    type="file"
                    accept="audio/mpeg,audio/mp3"
                    onChange={handleUploadWolofAudio}
                    disabled={uploadingWo}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB QUIZ */}
      {tab === "Quiz" && (
        <div className="bg-white rounded-3xl shadow-md p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-display text-lg font-bold text-[#0F7C55]">
                Quiz d'évaluation de la leçon
              </h3>
              <p className="text-xs text-gray-500">
                Ajoutez des questions à choix multiples (QCM) pour tester les connaissances des apprenants.
              </p>
            </div>
            {canEdit && (
              <button
                type="button"
                onClick={handleAddQuestion}
                className="inline-flex items-center gap-1.5 bg-[#0F7C55] text-white font-bold px-4 py-2 rounded-xl text-xs hover:scale-105 transition shadow-sm"
              >
                <FaPlus /> Ajouter une question
              </button>
            )}
          </div>

          {/* Sélecteur de Langue de travail pour le Quiz */}
          <div className="flex gap-2 pb-2 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setLangTab("fr")}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                langTab === "fr"
                  ? "bg-[#0F7C55] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🇫🇷 Français
            </button>
            <button
              type="button"
              onClick={() => setLangTab("wo")}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                langTab === "wo"
                  ? "bg-[#0F7C55] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🇸🇳 Wolof
            </button>
          </div>

          {(!lesson.quiz || !lesson.quiz.questions || lesson.quiz.questions.length === 0) ? (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Aucune question n'a été configurée pour le moment.</p>
              {canEdit && (
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="inline-flex items-center gap-1.5 bg-[#B8860B] text-[#0F7C55] font-bold px-5 py-2.5 rounded-xl text-xs hover:scale-105 transition shadow-sm"
                >
                  <FaPlus /> Créer la première question
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {lesson.quiz.questions.map((q, qIdx) => (
                <div key={q.id} className="border border-gray-200 rounded-2xl p-5 relative bg-white shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B8860B]">
                      Question {qIdx + 1}
                    </span>
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-bold inline-flex items-center gap-1.5"
                      >
                        <FaTrash /> Supprimer
                      </button>
                    )}
                  </div>

                  {/* Intitulé de la question */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Intitulé de la question ({langTab === "fr" ? "Français" : "Wolof"})
                    </label>
                    <input
                      type="text"
                      defaultValue={q.question?.[langTab] ?? ""}
                      onBlur={(e) => {
                        const updatedVal = e.target.value.trim();
                        const questions = [...(lesson.quiz?.questions || [])];
                        const idx = questions.findIndex(item => item.id === q.id);
                        if (idx !== -1) {
                          questions[idx] = {
                            ...questions[idx],
                            question: {
                              ...questions[idx].question,
                              [langTab]: updatedVal
                            }
                          };
                          patch({ quiz: { questions } });
                        }
                      }}
                      disabled={!canEdit}
                      placeholder={langTab === "fr" ? "Entrez la question..." : "Waxal sa laaj..."}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55]"
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-gray-600">
                        Choix de réponses (Sélectionnez la bonne réponse)
                      </label>
                      {canEdit && q.options.length < 5 && (
                        <button
                          type="button"
                          onClick={() => handleAddOption(q.id)}
                          className="text-[11px] text-[#0F7C55] hover:underline font-bold"
                        >
                          + Ajouter une option
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-3">
                          {/* Case d'option correcte */}
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctOptionId === opt.id}
                            onChange={() => {
                              if (!canEdit) return;
                              const questions = [...(lesson.quiz?.questions || [])];
                              const idx = questions.findIndex(item => item.id === q.id);
                              if (idx !== -1) {
                                questions[idx] = {
                                  ...questions[idx],
                                  correctOptionId: opt.id
                                };
                                patch({ quiz: { questions } });
                              }
                            }}
                            disabled={!canEdit}
                            className="accent-[#0F7C55] w-4 h-4 cursor-pointer"
                          />
                          
                          <span className="text-xs font-bold text-[#B8860B] w-5">
                            {opt.id}.
                          </span>

                          <input
                            type="text"
                            defaultValue={opt.text?.[langTab] ?? ""}
                            onBlur={(e) => {
                              const updatedVal = e.target.value.trim();
                              const questions = [...(lesson.quiz?.questions || [])];
                              const idx = questions.findIndex(item => item.id === q.id);
                              if (idx !== -1) {
                                const optIdx = questions[idx].options.findIndex(o => o.id === opt.id);
                                if (optIdx !== -1) {
                                  const updatedOptions = [...questions[idx].options];
                                  updatedOptions[optIdx] = {
                                    ...updatedOptions[optIdx],
                                    text: {
                                      ...updatedOptions[optIdx].text,
                                      [langTab]: updatedVal
                                    }
                                  };
                                  questions[idx] = {
                                    ...questions[idx],
                                    options: updatedOptions
                                  };
                                  patch({ quiz: { questions } });
                                }
                              }
                            }}
                            disabled={!canEdit}
                            placeholder={langTab === "fr" ? `Texte option ${opt.id}...` : `Waxin option ${opt.id}...`}
                            className="flex-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs text-[#0F7C55]"
                          />

                          {canEdit && q.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteOption(q.id, opt.id)}
                              className="text-xs text-red-500 hover:text-red-700 font-bold p-1"
                              title="Supprimer l'option"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explication */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Explication pédagogique ({langTab === "fr" ? "Français" : "Wolof"})
                    </label>
                    <textarea
                      defaultValue={q.explanation?.[langTab] ?? ""}
                      onBlur={(e) => {
                        const updatedVal = e.target.value.trim();
                        const questions = [...(lesson.quiz?.questions || [])];
                        const idx = questions.findIndex(item => item.id === q.id);
                        if (idx !== -1) {
                          questions[idx] = {
                            ...questions[idx],
                            explanation: {
                              ...questions[idx].explanation,
                              [langTab]: updatedVal || undefined
                            }
                          };
                          patch({ quiz: { questions } });
                        }
                      }}
                      disabled={!canEdit}
                      rows={2}
                      placeholder={langTab === "fr" ? "Explication optionnelle révélée après validation..." : "Leral ya..."}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-[#0F7C55]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
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
