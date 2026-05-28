"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaChevronRight,
  FaCircleCheck,
  FaCircle,
  FaGraduationCap,
  FaSeedling,
  FaDroplet,
  FaHandsPraying,
  FaMoon,
  FaSpa,
  FaStar,
} from "react-icons/fa6";
import { motion } from "framer-motion";
import { EducationModule, EducationLesson } from "@/lib/admin-types";
import { getEducationModule, listEducationLessons } from "@/lib/admin-data";

const ICON_BY_KEY: Record<string, React.ReactNode> = {
  seedling: <FaSeedling />,
  water: <FaDroplet />,
  prayer: <FaHandsPraying />,
  moon: <FaMoon />,
  flower: <FaSpa />,
  star: <FaStar />,
};

export default function PublicModuleDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const moduleId = String(params?.id ?? "");

  const [module, setModule] = useState<EducationModule | null>(null);
  const [lessons, setLessons] = useState<EducationLesson[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!moduleId) return;

    // Détection localhost uniquement (sécurité supplémentaire)
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (process.env.NODE_ENV !== "development" && !isLocal) {
      router.replace("/education");
      return;
    }

    Promise.all([getEducationModule(moduleId), listEducationLessons(moduleId)])
      .then(([mod, lsns]) => {
        if (!mod || mod.publishStatus === "draft") {
          setError("Ce module n'est pas disponible.");
          return;
        }
        setModule(mod);
        // Filtrer les leçons publiées
        setLessons(lsns.filter((l) => l.publishStatus !== "draft"));

        // Récupérer la progression
        const completed = localStorage.getItem("ksn_education_completed_lessons");
        if (completed) {
          try {
            setCompletedLessonIds(JSON.parse(completed));
          } catch (e) {
            setCompletedLessonIds([]);
          }
        }
      })
      .catch((err) => {
        console.error("Erreur de chargement", err);
        setError("Impossible de charger les données du module.");
      })
      .finally(() => setLoading(false));
  }, [moduleId, router]);

  if (loading) {
    return (
      <main className="relative z-10 min-h-screen pt-32 sm:pt-40 pb-20 text-center text-white/70">
        <div className="w-10 h-10 border-2 border-white/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4" />
        Chargement du module…
      </main>
    );
  }

  if (error || !module) {
    return (
      <main className="relative z-10 min-h-screen pt-32 sm:pt-40 pb-20 max-w-xl mx-auto px-4">
        <div className="bg-white/5 border border-white/10 rounded-[30px] p-8 text-center text-white">
          <p className="text-lg text-white/80">{error || "Module introuvable."}</p>
          <Link
            href="/education"
            className="inline-flex mt-6 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold px-6 py-3 rounded-2xl shadow-md hover:scale-105 transition text-sm"
          >
            Retour à l&apos;Académie
          </Link>
        </div>
      </main>
    );
  }

  const completedInModule = lessons.filter((l) =>
    completedLessonIds.includes(l.id)
  ).length;
  const progressPct =
    lessons.length === 0 ? 0 : Math.round((completedInModule / lessons.length) * 100);

  const moduleIcon = module.iconKey && ICON_BY_KEY[module.iconKey]
    ? ICON_BY_KEY[module.iconKey]
    : <FaGraduationCap />;

  return (
    <main className="relative z-10 min-h-screen pt-32 sm:pt-40 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* RETOUR & HEADER */}
        <div className="mb-8">
          <Link
            href="/education"
            className="inline-flex items-center gap-2 text-sm text-[#D4AF37] hover:text-white transition mb-6 font-semibold"
          >
            <FaArrowLeft /> Retour à l&apos;Académie
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] text-[#D4AF37] flex items-center justify-center text-2xl flex-shrink-0">
                {moduleIcon}
              </div>
              <div>
                <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-black">
                  Module {module.order}
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  {module.title?.fr}
                </h1>
                {module.titleArabic && (
                  <p className="font-arabic mt-1 text-xl text-[#D4AF37]" dir="rtl">
                    {module.titleArabic}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-right flex-shrink-0 min-w-[150px]">
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                Progression du module
              </p>
              <p className="text-xl font-bold text-white mt-1">
                {completedInModule}/{lessons.length} validées
              </p>
              <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-[#D4AF37] rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {module.description?.fr && (
            <p className="mt-6 text-white/70 text-sm sm:text-base leading-7">
              {module.description.fr}
            </p>
          )}
        </div>

        {/* LISTE DES LEÇONS (TIMELINE VISUELLE) */}
        <div className="bg-white/5 border border-white/10 rounded-[30px] p-6 sm:p-10 shadow-lg">
          {lessons.length === 0 ? (
            <p className="text-white/60 text-center py-8 text-sm">
              Aucune leçon publiée dans ce module pour le moment.
            </p>
          ) : (
            <div className="relative pl-6 sm:pl-8 space-y-8">
              {/* Ligne verticale de la timeline */}
              <div className="absolute left-3.5 sm:left-4.5 top-2.5 bottom-2.5 w-[2px] bg-gradient-to-b from-[#0F7C55] via-[#D4AF37] to-[#0A3D24]" />

              {lessons.map((lesson, idx) => {
                const isCompleted = completedLessonIds.includes(lesson.id);

                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative group flex items-start gap-4 sm:gap-6"
                  >
                    {/* Indicateur de statut (Puce sur la timeline) */}
                    <div className="absolute -left-6 sm:-left-8 top-1.5 flex items-center justify-center">
                      {isCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-[#D4AF37] border-4 border-[#082F22] flex items-center justify-center text-[10px] text-[#0F7C55] shadow-md shadow-[#D4AF37]/20">
                          <FaCircleCheck className="text-white font-bold" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-white/20 border-4 border-[#082F22] flex items-center justify-center transition group-hover:bg-[#D4AF37]/50" />
                      )}
                    </div>

                    {/* Bloc carte de la leçon */}
                    <Link
                      href={`/education/lecons/${lesson.id}`}
                      className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/10 hover:border-[#D4AF37]/20 transition flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[#D4AF37] tracking-wider font-bold">
                            Leçon {lesson.reference}
                          </span>
                          {lesson.publicAccess && (
                            <span className="text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                              Gratuit
                            </span>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-white text-base mt-1.5 group-hover:text-[#D4AF37] transition truncate">
                          {lesson.title?.fr || "Sans titre"}
                        </h3>
                        {lesson.titleArabic && (
                          <p className="font-arabic mt-1 text-sm text-[#D4AF37]/80" dir="rtl">
                            {lesson.titleArabic}
                          </p>
                        )}
                        <p className="mt-2 text-white/50 text-[11px] flex items-center gap-2">
                          <span>Étude de texte</span>
                          {lesson.readingTimeMin && (
                            <>
                              <span>•</span>
                              <span>~{lesson.readingTimeMin} min de lecture</span>
                            </>
                          )}
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-xl bg-white/5 text-white/70 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-[#0F7C55] transition flex-shrink-0">
                        <FaChevronRight className="text-xs" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
