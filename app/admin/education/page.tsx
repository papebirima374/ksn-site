"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import {
  hasPermission,
  EducationModule,
  EducationLesson,
} from "@/lib/admin-types";
import {
  listEducationModules,
  listEducationLessons,
  seedTazawwud,
  fillTazawwudContent,
} from "@/lib/admin-data";
import {
  FaGraduationCap,
  FaSeedling,
  FaDroplet,
  FaHandsPraying,
  FaMoon,
  FaSpa,
  FaStar,
  FaArrowRight,
  FaWandMagicSparkles,
  FaCirclePlus,
  FaWaveSquare,
} from "react-icons/fa6";

const ICON_BY_KEY: Record<string, React.ReactNode> = {
  seedling: <FaSeedling />,
  water: <FaDroplet />,
  prayer: <FaHandsPraying />,
  moon: <FaMoon />,
  flower: <FaSpa />,
  star: <FaStar />,
};

const STATUS_LABELS: Record<EducationModule["publishStatus"], { label: string; cls: string }> = {
  draft: { label: "Brouillon", cls: "bg-gray-100 text-gray-700" },
  preview: { label: "Aperçu", cls: "bg-orange-100 text-orange-700" },
  published: { label: "Publié", cls: "bg-emerald-100 text-emerald-700" },
};

export default function AdminEducationOverviewPage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "education.write");
  const [modules, setModules] = useState<EducationModule[]>([]);
  const [lessons, setLessons] = useState<EducationLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [filling, setFilling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function reload() {
    setLoading(true);
    try {
      const [mods, lessons] = await Promise.all([
        listEducationModules(),
        listEducationLessons(),
      ]);
      setModules(mods);
      setLessons(lessons);
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

  async function handleSeed() {
    if (!confirm("Initialiser la base avec le Tazawwud (6 modules + 25 leçons skeletons) ?\n\nCette opération créera la structure complète. Tu pourras ensuite remplir le contenu de chaque leçon.")) return;
    setSeeding(true);
    setError("");
    try {
      const result = await seedTazawwud();
      setSuccess(`✓ ${result.modules} modules et ${result.lessons} leçons créés. Bismillah !`);
      await reload();
      setTimeout(() => setSuccess(""), 6000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors du seed");
    } finally {
      setSeeding(false);
    }
  }

  async function handleFillContent() {
    if (!confirm(
      "Remplir AUTOMATIQUEMENT toutes les 25 leçons du Tazawwud avec le contenu préparé ?\n\n" +
      "⚠️ Le contenu existant sera ÉCRASÉ. Idéal pour un premier remplissage en masse.\n\n" +
      "Le contenu doit ensuite être relu/affiné par la Commission Éducation & Culture avant publication.\n\n" +
      "Continuer ?"
    )) return;
    setFilling(true);
    setError("");
    setSuccess("");
    try {
      const result = await fillTazawwudContent({ overrideExisting: true });
      let msg = `✓ ${result.filled} leçons remplies avec contenu.`;
      if (result.skipped > 0) msg += ` ${result.skipped} sautées (déjà remplies).`;
      if (result.notFound.length > 0) {
        msg += ` ⚠️ Références non trouvées : ${result.notFound.join(", ")}.`;
      }
      setSuccess(msg);
      await reload();
      setTimeout(() => setSuccess(""), 10000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors du remplissage");
    } finally {
      setFilling(false);
    }
  }

  const lessonsByModule = modules.map((m) => ({
    module: m,
    lessons: lessons.filter((l) => l.moduleId === m.id),
  }));

  const totalPublished = lessons.filter((l) => l.publishStatus === "published").length;
  const totalAudios = lessons.reduce(
    (s, l) => s + Object.keys(l.audio || {}).length,
    0
  );

  return (
    <AdminShell>
      <header className="mb-8">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Commission Éducation & Culture
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          Plateforme éducative
        </h1>
        <p className="mt-2 text-gray-600 text-sm max-w-3xl">
          Gérez les modules, leçons et audios du Tazawwud et des autres
          ouvrages. La section publique <code className="bg-gray-100 px-1.5 py-0.5 rounded">/education</code> affiche
          actuellement « À venir Inch&apos;Allah » pour les visiteurs.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/admin/education/atelier"
            className="inline-flex items-center gap-2 bg-white border border-[#D4AF37]/40 text-[#0F7C55] font-bold px-4 py-2 rounded-xl shadow-sm hover:scale-105 transition text-sm"
          >
            <FaWaveSquare /> Atelier audio TTS
          </Link>
          {canEdit && modules.length > 0 && (
            <button
              type="button"
              onClick={handleFillContent}
              disabled={filling}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold px-4 py-2 rounded-xl shadow-md hover:scale-105 transition text-sm disabled:opacity-50"
            >
              <FaWandMagicSparkles />
              {filling ? "Remplissage…" : "Remplir tout le Tazawwud (FR)"}
            </button>
          )}
        </div>
      </header>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100 mb-4">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3 border border-emerald-200 mb-4">
          {success}
        </p>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Kpi label="Modules" value={String(modules.length)} hint="6 prévus pour le Tazawwud" />
        <Kpi label="Leçons" value={String(lessons.length)} hint={`${totalPublished} publiées`} />
        <Kpi label="Audios générés" value={String(totalAudios)} hint="Toutes langues confondues" />
        <Kpi
          label="Coverage FR"
          value={
            lessons.length === 0
              ? "—"
              : `${Math.round((lessons.filter((l) => l.title?.fr).length / lessons.length) * 100)}%`
          }
          hint="Leçons avec titre français"
        />
      </div>

      {/* Empty state -> seed prompt */}
      {!loading && modules.length === 0 && canEdit && (
        <div className="bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] text-white rounded-3xl shadow-xl p-6 sm:p-10 mb-8 text-center">
          <FaGraduationCap className="mx-auto text-5xl text-[#D4AF37] mb-4" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
            Bismillah — Initialisons le Tazawwud
          </h2>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto mb-6">
            La base est vide. Un clic suffit pour créer la structure complète
            du <em>Tazawwud-ss-Sighar</em> : 6 modules thématiques et 25
            leçons skeletons que vous remplirez ensuite.
          </p>
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold px-6 py-3 rounded-2xl shadow-md hover:scale-105 transition disabled:opacity-50 text-sm"
          >
            <FaWandMagicSparkles />
            {seeding ? "Création en cours…" : "Initialiser le Tazawwud"}
          </button>
        </div>
      )}

      {/* Modules grid */}
      {modules.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-[#0F7C55]">
              Modules
            </h2>
            {canEdit && (
              <Link
                href="/admin/education/modules/nouveau"
                className="inline-flex items-center gap-2 text-sm text-[#B8860B] hover:text-[#D4AF37] font-semibold"
              >
                <FaCirclePlus /> Nouveau module
              </Link>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessonsByModule.map(({ module, lessons }) => {
              const audioCount = lessons.reduce(
                (s, l) => s + Object.keys(l.audio || {}).length,
                0
              );
              const fr = lessons.filter((l) => l.title?.fr).length;
              const status = STATUS_LABELS[module.publishStatus];
              return (
                <Link
                  key={module.id}
                  href={`/admin/education/modules/${module.id}`}
                  className="group bg-white rounded-3xl shadow-md hover:shadow-xl p-6 transition hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] text-[#D4AF37] flex items-center justify-center text-xl">
                      {module.iconKey && ICON_BY_KEY[module.iconKey]
                        ? ICON_BY_KEY[module.iconKey]
                        : <FaGraduationCap />}
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${status.cls}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-[#B8860B] font-bold mb-1">
                    Module {module.order}
                  </p>
                  <h3 className="font-display text-lg font-bold text-[#0F7C55] leading-tight">
                    {module.title?.fr || "Sans titre"}
                  </h3>
                  {module.titleArabic && (
                    <p className="font-arabic mt-1 text-base text-[#D4AF37]" dir="rtl">
                      {module.titleArabic}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
                    <span className="font-semibold">
                      {lessons.length} leçon{lessons.length > 1 ? "s" : ""}
                    </span>
                    <span>{fr} FR rédigées</span>
                    {audioCount > 0 && (
                      <span className="text-emerald-700 font-semibold">
                        🎧 {audioCount} audios
                      </span>
                    )}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 text-[#B8860B] font-semibold text-xs group-hover:gap-3 transition-all">
                    Ouvrir <FaArrowRight className="text-[10px]" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {loading && modules.length === 0 && (
        <p className="text-gray-400 text-sm">Chargement…</p>
      )}
    </AdminShell>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">
        {label}
      </p>
      <p className="font-display mt-1 text-2xl font-black text-[#0F7C55] tabular-nums leading-tight">
        {value}
      </p>
      {hint && <p className="mt-0.5 text-[10px] text-gray-400">{hint}</p>}
    </div>
  );
}
