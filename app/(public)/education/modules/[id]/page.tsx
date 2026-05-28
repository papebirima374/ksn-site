"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaChevronRight,
  FaCircleCheck,
  FaGraduationCap,
  FaSeedling,
  FaDroplet,
  FaHandsPraying,
  FaMoon,
  FaSpa,
  FaStar,
  FaLock,
} from "react-icons/fa6";
import { EducationModule, EducationLesson } from "@/lib/admin-types";
import {
  getEducationModule,
  listEducationLessons,
  listEducationModules,
} from "@/lib/admin-data";
import {
  loadCompletedLessonIds,
  getUnlockedLessonIds,
  isModuleUnlocked,
  getCurrentLesson,
} from "@/lib/education/progress";
import IslamicPattern from "../../_components/IslamicPattern";

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
  const [allModules, setAllModules] = useState<EducationModule[]>([]);
  const [allLessons, setAllLessons] = useState<EducationLesson[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!moduleId) return;

    Promise.all([
      getEducationModule(moduleId),
      listEducationLessons(moduleId),
      listEducationModules(),
      listEducationLessons(),
    ])
      .then(([mod, lsns, mods, allLsns]) => {
        if (!mod || mod.publishStatus === "draft") {
          setError("Ce module n'est pas disponible.");
          return;
        }

        const completed = loadCompletedLessonIds();
        setCompletedLessonIds(completed);

        const visibleAllLessons = allLsns.filter(
          (l) => l.publishStatus !== "draft"
        );
        const visibleAllModules = mods.filter(
          (m) => m.publishStatus !== "draft"
        );
        setAllModules(visibleAllModules);
        setAllLessons(visibleAllLessons);

        const moduleOpen = isModuleUnlocked(
          mod.id,
          visibleAllModules,
          visibleAllLessons,
          completed
        );
        if (!moduleOpen) {
          const current = getCurrentLesson(
            visibleAllModules,
            visibleAllLessons,
            completed
          );
          if (current) {
            router.replace(`/education/lecons/${current.id}`);
          } else {
            router.replace("/education");
          }
          return;
        }

        setModule(mod);
        setLessons(lsns.filter((l) => l.publishStatus !== "draft"));
      })
      .catch((err) => {
        console.error("Erreur de chargement", err);
        setError("Impossible de charger les données du module.");
      })
      .finally(() => setLoading(false));
  }, [moduleId, router]);

  if (loading) {
    return (
      <main className="edu-surface relative min-h-screen flex items-center justify-center">
        <IslamicPattern variant="arabesque" opacity={0.05} />
        <div className="relative text-center">
          <div className="w-10 h-10 border-2 border-[#C9A961]/30 border-t-[#C9A961] rounded-full animate-spin mx-auto mb-4" />
          <p className="edu-prose text-base">Chargement du module…</p>
        </div>
      </main>
    );
  }

  if (error || !module) {
    return (
      <main className="edu-surface relative min-h-screen pt-32 sm:pt-40 pb-20 max-w-xl mx-auto px-4">
        <IslamicPattern variant="arabesque" opacity={0.05} />
        <div className="relative edu-card rounded-[30px] p-8 text-center">
          <p className="edu-prose text-lg">
            {error || "Module introuvable."}
          </p>
          <Link
            href="/education"
            className="inline-flex mt-6 bg-gradient-to-r from-[#C9A961] to-[#E0C97D] text-[#064E3B] font-bold px-6 py-3 rounded-2xl shadow-md hover:scale-[1.03] transition text-sm"
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
    lessons.length === 0
      ? 0
      : Math.round((completedInModule / lessons.length) * 100);

  const moduleIcon =
    module.iconKey && ICON_BY_KEY[module.iconKey] ? (
      ICON_BY_KEY[module.iconKey]
    ) : (
      <FaGraduationCap />
    );

  return (
    <main className="edu-surface relative z-10 min-h-screen pt-32 sm:pt-40 pb-20">
      <IslamicPattern variant="arabesque" opacity={0.05} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8 edu-book-open">
          <Link
            href="/education"
            className="inline-flex items-center gap-2 text-sm text-[#6B2E2E] hover:text-[#064E3B] transition mb-6 font-semibold"
          >
            <FaArrowLeft /> Retour à l&apos;Académie
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#064E3B] to-[#2D5547] text-[#E0C97D] flex items-center justify-center text-2xl flex-shrink-0">
                {moduleIcon}
              </div>
              <div>
                <span className="text-[#C9A961] text-xs uppercase tracking-widest font-black">
                  Module {module.order}
                </span>
                <h1 className="edu-title text-2xl sm:text-3xl font-black mt-1">
                  {module.title?.fr}
                </h1>
                {module.titleArabic && (
                  <p
                    className="font-arabic mt-1 text-xl text-[#C9A961]"
                    dir="rtl"
                  >
                    {module.titleArabic}
                  </p>
                )}
              </div>
            </div>

            <div className="edu-card rounded-2xl p-4 text-right flex-shrink-0 min-w-[160px]">
              <p className="text-[10px] text-[#1A1611]/60 uppercase tracking-wider font-semibold">
                Progression du module
              </p>
              <p className="text-xl font-bold text-[#064E3B] mt-1">
                {completedInModule}/{lessons.length} validées
              </p>
              <div className="h-1 bg-[#1A1611]/10 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-[#C9A961] rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {module.description?.fr && (
            <p className="mt-6 edu-prose text-sm sm:text-base">
              {module.description.fr}
            </p>
          )}
        </div>

        <div className="edu-card rounded-[30px] p-6 sm:p-10">
          {lessons.length === 0 ? (
            <p className="edu-prose text-center py-8 text-sm">
              Aucune leçon publiée dans ce module pour le moment.
            </p>
          ) : (
            <div className="relative pl-6 sm:pl-8 space-y-6 edu-stagger">
              <div className="absolute left-3.5 sm:left-4.5 top-2.5 bottom-2.5 w-[2px] bg-gradient-to-b from-[#064E3B] via-[#C9A961] to-[#2D5547]" />

              {(() => {
                const unlockedSet = getUnlockedLessonIds(
                  allModules,
                  allLessons,
                  completedLessonIds
                );
                return lessons.map((lesson) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const isUnlocked = unlockedSet.has(lesson.id);

                  return (
                    <div
                      key={lesson.id}
                      className="relative group flex items-start gap-4 sm:gap-6"
                    >
                      <div className="absolute -left-6 sm:-left-8 top-1.5 flex items-center justify-center">
                        {isCompleted ? (
                          <div className="w-5 h-5 rounded-full bg-[#064E3B] border-4 border-[#FAF7F0] flex items-center justify-center text-[10px] text-[#E0C97D] shadow-md">
                            <FaCircleCheck />
                          </div>
                        ) : isUnlocked ? (
                          <div className="w-5 h-5 rounded-full bg-[#C9A961] border-4 border-[#FAF7F0] animate-pulse shadow-md shadow-[#C9A961]/40" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#1A1611]/10 border-4 border-[#FAF7F0] flex items-center justify-center text-[8px] text-[#1A1611]/40">
                            <FaLock />
                          </div>
                        )}
                      </div>

                      {isUnlocked ? (
                        <Link
                          href={`/education/lecons/${lesson.id}`}
                          className={`flex-1 border rounded-2xl p-5 transition flex items-center justify-between gap-4 hover:-translate-y-0.5 ${
                            isCompleted
                              ? "bg-[#064E3B]/5 border-[#064E3B]/20 hover:border-[#064E3B]/40 hover:shadow-md"
                              : "bg-white border-[#C9A961]/30 hover:border-[#C9A961]/70 hover:shadow-lg"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-mono text-[#C9A961] tracking-wider font-bold">
                                Leçon {lesson.reference}
                              </span>
                              {isCompleted ? (
                                <span className="text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-[#064E3B]/15 text-[#064E3B]">
                                  ✓ Validée
                                </span>
                              ) : (
                                <span className="text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-[#C9A961]/20 text-[#6B2E2E] animate-pulse">
                                  En cours
                                </span>
                              )}
                            </div>
                            <h3 className="edu-title font-bold text-base mt-1.5 group-hover:text-[#6B2E2E] transition truncate">
                              {lesson.title?.fr || "Sans titre"}
                            </h3>
                            {lesson.titleArabic && (
                              <p
                                className="font-arabic mt-1 text-sm text-[#C9A961]/90"
                                dir="rtl"
                              >
                                {lesson.titleArabic}
                              </p>
                            )}
                            <p className="mt-2 text-[#1A1611]/55 text-[11px] flex items-center gap-2">
                              <span>Étude de texte</span>
                              {lesson.readingTimeMin && (
                                <>
                                  <span>•</span>
                                  <span>
                                    ~{lesson.readingTimeMin} min de lecture
                                  </span>
                                </>
                              )}
                            </p>
                          </div>

                          <div className="w-8 h-8 rounded-xl bg-[#C9A961]/15 text-[#6B2E2E] flex items-center justify-center group-hover:bg-[#C9A961] group-hover:text-[#064E3B] transition flex-shrink-0">
                            <FaChevronRight className="text-xs" />
                          </div>
                        </Link>
                      ) : (
                        <div
                          className="flex-1 bg-[#1A1611]/[0.03] border border-[#1A1611]/10 rounded-2xl p-5 flex items-center justify-between gap-4 opacity-60 cursor-not-allowed select-none"
                          aria-disabled
                          title="Validez d'abord la leçon précédente pour débloquer celle-ci"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-[#1A1611]/40 tracking-wider font-bold">
                                Leçon {lesson.reference}
                              </span>
                              <span className="text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-[#1A1611]/5 text-[#1A1611]/40 inline-flex items-center gap-1">
                                <FaLock className="text-[8px]" /> Verrouillée
                              </span>
                            </div>
                            <h3 className="edu-title font-bold text-base mt-1.5 truncate opacity-50">
                              {lesson.title?.fr || "Sans titre"}
                            </h3>
                            <p className="mt-2 text-[#1A1611]/40 text-[11px]">
                              Validez la leçon précédente pour la débloquer.
                            </p>
                          </div>

                          <div className="w-8 h-8 rounded-xl bg-[#1A1611]/5 text-[#1A1611]/30 flex items-center justify-center flex-shrink-0">
                            <FaLock className="text-xs" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
