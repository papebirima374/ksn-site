"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaChevronRight,
  FaChevronLeft,
  FaCheck,
  FaLightbulb,
  FaXmark,
  FaPlay,
  FaAward,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { EducationLesson, EducationModule } from "@/lib/admin-types";
import {
  getEducationLesson,
  getEducationModule,
  listEducationLessons,
  listEducationModules,
} from "@/lib/admin-data";
import {
  loadCompletedLessonIds,
  markLessonCompleted,
  isLessonUnlocked,
  getCurrentLesson,
  getNextLesson as helperGetNextLesson,
  getPrevLesson as helperGetPrevLesson,
} from "@/lib/education/progress";
import IslamicPattern from "../../_components/IslamicPattern";
import LessonIllustrations from "../../_components/LessonIllustrations";
import ScreenshotGuard from "../../_components/ScreenshotGuard";

export default function PublicLessonDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const lessonId = String(params?.id ?? "");

  const [lesson, setLesson] = useState<EducationLesson | null>(null);
  const [moduleParent, setModuleParent] = useState<EducationModule | null>(null);
  const [nextModule, setNextModule] = useState<EducationModule | null>(null);
  const [nextModuleLessonsCount, setNextModuleLessonsCount] = useState(0);
  const [prevLesson, setPrevLesson] = useState<EducationLesson | null>(null);
  const [nextLesson, setNextLesson] = useState<EducationLesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [lang, setLang] = useState<"fr" | "wo">("fr");
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);

  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [, setUserAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!lessonId) return;

    // Reset quiz state — déferré pour éviter le warning
    // react-hooks/set-state-in-effect lié aux cascading renders.
    const reset = setTimeout(() => {
      setQuizStarted(false);
      setCurrentQuestionIdx(0);
      setSelectedOptId(null);
      setIsSubmitted(false);
      setScore(0);
      setQuizFinished(false);
      setUserAnswers({});
      setLoading(true);
    }, 0);

    Promise.all([
      getEducationLesson(lessonId),
      listEducationModules(),
      listEducationLessons(),
    ])
      .then(async ([l, allModules, allLessonsRaw]) => {
        if (!l || l.publishStatus === "draft") {
          setError("Cette leçon n'est pas disponible.");
          setLoading(false);
          return;
        }

        const allLessons = allLessonsRaw.filter(
          (x) => x.publishStatus !== "draft"
        );
        const visibleModules = allModules.filter(
          (m) => m.publishStatus !== "draft"
        );

        const completed = loadCompletedLessonIds();
        setCompletedLessonIds(completed);

        const unlocked = isLessonUnlocked(
          l.id,
          visibleModules,
          allLessons,
          completed
        );
        if (!unlocked) {
          const current = getCurrentLesson(
            visibleModules,
            allLessons,
            completed
          );
          if (current) {
            router.replace(`/education/lecons/${current.id}`);
          } else {
            router.replace("/education");
          }
          return;
        }

        setLesson(l);

        const m = await getEducationModule(l.moduleId);
        setModuleParent(m);

        const nextL = helperGetNextLesson(l.id, visibleModules, allLessons);
        setPrevLesson(helperGetPrevLesson(l.id, visibleModules, allLessons));
        setNextLesson(nextL);

        // Détection : la leçon suivante est-elle dans un AUTRE module ?
        // Si oui, on est sur la dernière leçon du module courant et on
        // proposera une carte de transition vers le module N+1.
        if (nextL && nextL.moduleId !== l.moduleId) {
          const nextMod =
            visibleModules.find((mm) => mm.id === nextL.moduleId) || null;
          setNextModule(nextMod);
          setNextModuleLessonsCount(
            allLessons.filter((x) => x.moduleId === nextL.moduleId).length
          );
        } else {
          setNextModule(null);
          setNextModuleLessonsCount(0);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement", err);
        setError("Impossible de charger la leçon.");
        setLoading(false);
      });

    return () => clearTimeout(reset);
  }, [lessonId, router]);

  const toggleCompleted = () => {
    if (!lesson) return;
    if (completedLessonIds.includes(lesson.id)) return;

    const updated = markLessonCompleted(lesson.id);
    setCompletedLessonIds(updated);
    setShowCompletionAnimation(true);
    setTimeout(() => setShowCompletionAnimation(false), 2200);
  };

  if (loading) {
    return (
      <main className="edu-surface relative min-h-screen flex items-center justify-center">
        <IslamicPattern variant="arabesque" opacity={0.05} />
        <div className="relative text-center">
          <div className="w-10 h-10 border-2 border-[#C9A961]/30 border-t-[#C9A961] rounded-full animate-spin mx-auto mb-4" />
          <p className="edu-prose">Chargement de la leçon…</p>
        </div>
      </main>
    );
  }

  if (error || !lesson) {
    return (
      <main className="edu-surface relative min-h-screen pt-32 sm:pt-40 pb-20 max-w-xl mx-auto px-4">
        <IslamicPattern variant="arabesque" opacity={0.05} />
        <div className="relative edu-card rounded-[30px] p-8 text-center">
          <p className="edu-prose text-lg">
            {error || "Leçon introuvable."}
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

  const isCompleted = completedLessonIds.includes(lesson.id);

  const hasWolof = Boolean(
    lesson.title?.wo ||
      lesson.content?.wo ||
      lesson.intention?.wo ||
      lesson.audio?.wo ||
      lesson.citation?.translations?.wo ||
      lesson.application?.wo ||
      lesson.reminder?.wo
  );

  const title =
    lang === "wo" ? lesson.title?.wo || lesson.title?.fr : lesson.title?.fr;
  const intention =
    lang === "wo"
      ? lesson.intention?.wo || lesson.intention?.fr
      : lesson.intention?.fr;
  const content =
    lang === "wo"
      ? lesson.content?.wo || lesson.content?.fr
      : lesson.content?.fr;
  const citationText =
    lang === "wo"
      ? lesson.citation?.translations?.wo ||
        lesson.citation?.translations?.fr
      : lesson.citation?.translations?.fr;
  const application =
    lang === "wo"
      ? lesson.application?.wo || lesson.application?.fr
      : lesson.application?.fr;
  const reminder =
    lang === "wo"
      ? lesson.reminder?.wo || lesson.reminder?.fr
      : lesson.reminder?.fr;
  const audio = lang === "wo" ? lesson.audio?.wo : lesson.audio?.fr;

  return (
    <main className="edu-surface relative z-10 min-h-screen pt-32 sm:pt-40 pb-28">
      <IslamicPattern variant="arabesque" opacity={0.05} />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          {moduleParent && (
            <Link
              href={`/education/modules/${moduleParent.id}`}
              className="inline-flex items-center gap-2 text-sm text-[#6B2E2E] hover:text-[#064E3B] transition font-semibold"
            >
              <FaArrowLeft /> {moduleParent.title?.fr}
            </Link>
          )}

          {isCompleted && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#064E3B]/15 border border-[#064E3B]/30 text-[#064E3B]">
              <FaCheck /> Leçon validée
            </span>
          )}
        </div>
      </div>

      <ScreenshotGuard>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">

        {/* LECTEUR DE TEXTE BILINGUE */}
        <article className="edu-card rounded-[35px] overflow-hidden edu-book-open">
          {hasWolof && (
            <div className="bg-[#064E3B]/8 px-6 sm:px-10 py-3 flex justify-end gap-2 border-b border-[#C9A961]/30">
              <button
                type="button"
                onClick={() => setLang("fr")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  lang === "fr"
                    ? "bg-[#064E3B] text-[#E0C97D] shadow-sm"
                    : "bg-transparent text-[#064E3B]/60 hover:text-[#064E3B]"
                }`}
              >
                🇫🇷 Français
              </button>
              <button
                type="button"
                onClick={() => setLang("wo")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  lang === "wo"
                    ? "bg-[#064E3B] text-[#E0C97D] shadow-sm"
                    : "bg-transparent text-[#064E3B]/60 hover:text-[#064E3B]"
                }`}
              >
                🇸🇳 Wolof
              </button>
            </div>
          )}

          <div className="p-6 sm:p-10 md:p-14">
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#C9A961] font-black">
              Leçon {lesson.reference}{" "}
              {moduleParent ? `· ${moduleParent.title?.fr}` : ""}
            </p>

            <h1 className="edu-title mt-2 text-2xl sm:text-3xl md:text-4xl font-black leading-tight">
              {title}
            </h1>
            {lesson.titleArabic && (
              <p
                className="font-arabic mt-2 text-xl sm:text-2xl text-[#C9A961] text-right"
                dir="rtl"
              >
                {lesson.titleArabic}
              </p>
            )}

            <div className="edu-divider my-6">
              <span className="font-arabic">۞</span>
            </div>

            {/* LECTEUR AUDIO */}
            {audio && (
              <div className="bg-[#064E3B]/5 border border-[#064E3B]/15 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#064E3B] text-[#E0C97D] flex items-center justify-center text-sm shadow-md">
                    🔊
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#064E3B] font-black">
                      Écouter l&apos;enseignement
                    </p>
                    <p className="text-[10px] text-[#1A1611]/50">
                      {lang === "fr"
                        ? "Audio de synthèse apaisant"
                        : "Récitation officielle wolof"}
                    </p>
                  </div>
                </div>
                <audio
                  src={audio.url}
                  controls
                  className="w-full sm:w-auto flex-1 max-w-[240px] sm:max-w-xs"
                />
              </div>
            )}

            {/* INTENTION */}
            {intention && (
              <div className="bg-[#064E3B]/5 border-l-4 border-[#064E3B] rounded-r-2xl p-5 mb-8 text-[#064E3B] text-sm sm:text-base leading-7 italic">
                <p className="font-bold text-xs uppercase tracking-wider text-[#064E3B]/70 mb-1 not-italic">
                  Intention spirituelle (Niya)
                </p>
                « {intention} »
              </div>
            )}

            {/* CITATION CENTRALE */}
            {lesson.citation && (lesson.citation.arabic || citationText) && (
              <div className="bg-gradient-to-br from-[#064E3B] to-[#2D5547] text-[#FAF7F0] rounded-2xl p-6 sm:p-8 text-center my-8 shadow-md relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.07] flex items-center justify-center font-arabic text-7xl select-none pointer-events-none">
                  الله
                </div>

                {lesson.citation.arabic && (
                  <p
                    className="edu-quote-arabic mb-6 !text-[#E0C97D]"
                    dir="rtl"
                  >
                    {lesson.citation.arabic}
                  </p>
                )}
                {citationText && (
                  <p className="italic text-[#FAF7F0]/95 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                    « {citationText} »
                  </p>
                )}

                {(lesson.citation.author || lesson.citation.sourceRef) && (
                  <p className="mt-4 text-[10px] sm:text-xs uppercase tracking-widest text-[#E0C97D] font-bold">
                    — {lesson.citation.author || ""}{" "}
                    {lesson.citation.sourceRef
                      ? `(${lesson.citation.sourceRef})`
                      : ""}
                  </p>
                )}
              </div>
            )}

            {/* CORPS DE LA LEÇON */}
            <div className="edu-prose whitespace-pre-wrap my-8">
              {content || (
                <p className="text-[#1A1611]/40 italic text-center py-6">
                  Le contenu de cet enseignement est en cours de rédaction par
                  la Commission.
                </p>
              )}
            </div>

            {/* ILLUSTRATIONS PEDAGOGIQUES (auto + uploadées) */}
            <LessonIllustrations lesson={lesson} />

            {/* APPLICATION PRATIQUE */}
            {application && (
              <div className="bg-white border border-[#C9A961]/30 rounded-3xl p-6 sm:p-8 my-8 shadow-sm">
                <h3 className="text-xs uppercase tracking-widest text-[#C9A961] font-black flex items-center gap-2 mb-3">
                  <FaLightbulb /> Application dans votre vie
                </h3>
                <p className="edu-prose whitespace-pre-wrap mb-0">
                  {application}
                </p>
              </div>
            )}

            {/* RAPPEL */}
            {reminder && (
              <div className="border-2 border-dashed border-[#C9A961] rounded-3xl p-5 sm:p-6 my-8 bg-[#E0C97D]/15 text-center">
                <span className="text-[10px] uppercase tracking-widest text-[#6B2E2E] font-black block mb-1">
                  À retenir aujourd&apos;hui
                </span>
                <p className="font-semibold text-[#064E3B] text-sm sm:text-base leading-relaxed">
                  {reminder}
                </p>
              </div>
            )}

            {/* VALIDATION */}
            <div className="mt-10 pt-8 border-t border-[#C9A961]/30">
              {!isCompleted ? (
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-[#C9A961] font-bold mb-3">
                    Prêt(e) à valider cette leçon ?
                  </p>
                  <p className="edu-prose text-sm mb-5 max-w-lg mx-auto">
                    En validant, tu confirmes avoir lu et compris
                    l&apos;enseignement. La leçon suivante sera alors
                    débloquée.
                  </p>
                  <button
                    type="button"
                    onClick={toggleCompleted}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#064E3B] to-[#2D5547] hover:from-[#C9A961] hover:to-[#E0C97D] text-[#E0C97D] hover:text-[#064E3B] font-bold px-8 py-4 rounded-2xl shadow-lg hover:scale-[1.03] transition text-sm sm:text-base"
                  >
                    <FaCheck />
                    J&apos;ai compris — Valider la leçon
                  </button>
                </div>
              ) : nextModule && nextLesson ? (
                // ─── TRANSITION DE MODULE (dernière leçon du module courant) ──
                <div className="space-y-5">
                  <div className="bg-[#064E3B]/8 border border-[#064E3B]/25 rounded-3xl p-6 text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#C9A961] to-[#E0C97D] text-[#064E3B] flex items-center justify-center mb-3 shadow-lg">
                      <FaAward className="text-2xl" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A961] font-black mb-1">
                      Module terminé
                    </p>
                    <h3 className="edu-title text-xl sm:text-2xl font-black">
                      Macha&apos;Allah !
                    </h3>
                    {moduleParent && (
                      <p className="edu-prose text-sm sm:text-base mt-2 mb-0">
                        Tu as parcouru entièrement le module{" "}
                        <strong>« {moduleParent.title?.fr} »</strong>. Une
                        belle étape franchie sur le chemin du savoir.
                      </p>
                    )}
                  </div>

                  {/* Carte du module suivant — appel à continuer */}
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064E3B] to-[#2D5547] text-[#FAF7F0] p-6 sm:p-8">
                    <IslamicPattern
                      variant="star8"
                      opacity={0.08}
                      color="#E0C97D"
                    />
                    <div className="relative text-center">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#E0C97D] font-bold mb-2">
                        Module suivant à découvrir
                      </p>
                      <h4 className="edu-title text-xl sm:text-2xl font-black mt-1 !text-[#FAF7F0]">
                        Module {nextModule.order} ·{" "}
                        {nextModule.title?.fr}
                      </h4>
                      {nextModule.titleArabic && (
                        <p
                          className="font-arabic mt-2 text-xl text-[#E0C97D]"
                          dir="rtl"
                        >
                          {nextModule.titleArabic}
                        </p>
                      )}
                      {nextModule.description?.fr && (
                        <p className="text-sm text-[#FAF7F0]/90 mt-3 max-w-xl mx-auto leading-6">
                          {nextModule.description.fr}
                        </p>
                      )}
                      <p className="text-[11px] text-[#E0C97D] mt-3 uppercase tracking-widest font-bold">
                        {nextModuleLessonsCount} leçon
                        {nextModuleLessonsCount > 1 ? "s" : ""} à parcourir
                      </p>

                      <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                          href={`/education/modules/${nextModule.id}`}
                          className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-[#E0C97D]/40 text-[#E0C97D] font-bold px-5 py-3 rounded-xl transition text-sm"
                        >
                          Voir le module
                        </Link>
                        <Link
                          href={`/education/lecons/${nextLesson.id}`}
                          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C9A961] to-[#E0C97D] text-[#064E3B] font-bold px-5 py-3 rounded-xl shadow-lg hover:scale-[1.03] transition text-sm"
                        >
                          Commencer le module {nextModule.order}{" "}
                          <FaChevronRight className="text-xs" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : nextLesson ? (
                // ─── Leçon suivante normale (même module) ──────────────────
                <div className="bg-[#064E3B]/8 border border-[#064E3B]/25 rounded-3xl p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#064E3B] text-[#E0C97D] flex items-center justify-center mb-3">
                    <FaCheck className="text-xl" />
                  </div>
                  <p className="edu-title text-lg font-bold">
                    Alhamdoulillah, leçon validée
                  </p>
                  <Link
                    href={`/education/lecons/${nextLesson.id}`}
                    className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-[#C9A961] to-[#E0C97D] text-[#064E3B] font-bold px-6 py-3 rounded-xl shadow-md hover:scale-[1.03] transition text-sm"
                  >
                    Continuer vers la leçon suivante{" "}
                    <FaChevronRight className="text-xs" />
                  </Link>
                </div>
              ) : (
                // ─── Fin totale du Tazawwud ─────────────────────────────────
                <div className="bg-gradient-to-br from-[#C9A961] to-[#E0C97D] text-[#064E3B] rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#064E3B] text-[#E0C97D] flex items-center justify-center mb-3 shadow-lg">
                    <FaAward className="text-3xl" />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#6B2E2E] font-black mb-1">
                    Tazawwud Terminé
                  </p>
                  <h3 className="edu-title text-2xl font-black !text-[#064E3B]">
                    Macha&apos;Allah, parcours achevé !
                  </h3>
                  <p className="text-sm sm:text-base mt-3 max-w-md mx-auto">
                    Tu as parcouru les six modules du Tazawwudu-ss-Sighar. Il
                    te reste une dernière étape : l&apos;entretien oral avec
                    la Commission Éducation.
                  </p>
                  <Link
                    href="/education/certificat"
                    className="inline-flex items-center gap-2 mt-5 bg-[#064E3B] text-[#E0C97D] font-bold px-6 py-3 rounded-xl shadow-md hover:scale-[1.03] transition text-sm"
                  >
                    <FaAward /> Demander mon certificat
                  </Link>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* QUIZ INTERACTIF */}
        {lesson.quiz?.questions && lesson.quiz.questions.length > 0 && (
          <div className="mt-8 edu-card rounded-[35px] p-6 sm:p-10 md:p-12">
            {!quizStarted ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#064E3B]/10 text-[#C9A961] flex items-center justify-center text-3xl mx-auto shadow-inner">
                  🎓
                </div>
                <div className="space-y-2">
                  <h3 className="edu-title text-xl sm:text-2xl font-black">
                    {lang === "fr"
                      ? "Testez votre compréhension !"
                      : "Manoore sa xam-xam !"}
                  </h3>
                  <p className="edu-prose text-sm sm:text-base max-w-lg mx-auto">
                    {lang === "fr"
                      ? `Évaluez ce que vous venez d'apprendre dans cette leçon en répondant à un court quiz de ${lesson.quiz.questions.length} question${lesson.quiz.questions.length > 1 ? "s" : ""}.`
                      : `Gëstu-leen li ngen doon jàng tey ci laaj yi. (${lesson.quiz.questions.length} laaj)`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setQuizStarted(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#064E3B] to-[#2D5547] text-[#E0C97D] hover:from-[#C9A961] hover:to-[#E0C97D] hover:text-[#064E3B] font-bold px-8 py-4 rounded-2xl transition shadow-lg hover:scale-[1.03]"
                >
                  <FaPlay className="text-xs" />
                  {lang === "fr"
                    ? "Bismillah — Commencer"
                    : "Bismillah — Tàmbalee"}
                </button>
              </div>
            ) : quizFinished ? (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A961] to-[#E0C97D] text-[#064E3B] flex items-center justify-center text-3xl mx-auto shadow-md font-bold">
                  {score}/{lesson.quiz.questions.length}
                </div>
                <div className="space-y-2">
                  <h3 className="edu-title text-xl sm:text-2xl font-black">
                    {score === lesson.quiz.questions.length
                      ? lang === "fr"
                        ? "Macha'Allah ! Score parfait !"
                        : "Macha'Allah ! Mat na seuk !"
                      : lang === "fr"
                      ? "Alhamdoulillah, bel effort !"
                      : "Alhamdoulillah, jéem nga !"}
                  </h3>
                  <p className="edu-prose text-sm sm:text-base max-w-md mx-auto">
                    {score === lesson.quiz.questions.length
                      ? lang === "fr"
                        ? "Félicitations, vous avez parfaitement assimilé les enseignements de cette leçon. Bismillah !"
                        : "Rafet na lool, xam-xam bi leer na te dëgër na ci sa xol."
                      : score >= lesson.quiz.questions.length / 2
                      ? lang === "fr"
                        ? "Vous avez validé l'essentiel. Relisez les points manqués pour ancrer vos connaissances."
                        : "Mën nga gën a jàngat ngir dëgëral ponk yi ci sa xel."
                      : lang === "fr"
                      ? "La recherche du savoir est une adoration. Prenez le temps de relire la leçon et recommencez."
                      : "Jàng gi jaamu Yalla la. Jéematel laaj yi ngir gën a xam."}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setQuizStarted(true);
                      setCurrentQuestionIdx(0);
                      setSelectedOptId(null);
                      setIsSubmitted(false);
                      setScore(0);
                      setQuizFinished(false);
                      setUserAnswers({});
                    }}
                    className="bg-[#064E3B] hover:bg-[#2D5547] text-[#E0C97D] font-bold px-6 py-3 rounded-xl text-sm transition"
                  >
                    {lang === "fr"
                      ? "Recommencer le test"
                      : "Jéemat laaj yi"}
                  </button>
                  {nextLesson && (
                    <Link
                      href={`/education/lecons/${nextLesson.id}`}
                      className="bg-gradient-to-r from-[#C9A961] to-[#E0C97D] text-[#064E3B] font-bold px-6 py-3 rounded-xl text-sm hover:scale-[1.03] transition"
                    >
                      {lang === "fr" ? "Leçon suivante" : "Jàng bu ci tégu"}
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#C9A961]/30 pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#C9A961] font-black">
                      {lang === "fr" ? "Quiz de Leçon" : "Laaji Jàng gi"}
                    </span>
                    <h4 className="text-sm font-bold text-[#064E3B]">
                      Question {currentQuestionIdx + 1} sur{" "}
                      {lesson.quiz.questions.length}
                    </h4>
                  </div>
                  <span className="text-xs text-[#1A1611]/50 font-mono">
                    {Math.round(
                      (currentQuestionIdx / lesson.quiz.questions.length) * 100
                    )}
                    %
                  </span>
                </div>

                <div className="h-1.5 bg-[#1A1611]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C9A961] transition-all duration-300"
                    style={{
                      width: `${(currentQuestionIdx / lesson.quiz.questions.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="my-6">
                  <p className="edu-title text-base sm:text-lg font-bold leading-relaxed">
                    {lesson.quiz.questions[currentQuestionIdx].question?.[lang] ||
                      lesson.quiz.questions[currentQuestionIdx].question?.fr}
                  </p>
                </div>

                <div className="grid gap-3">
                  {lesson.quiz.questions[currentQuestionIdx].options.map(
                    (opt) => {
                      const isSelected = selectedOptId === opt.id;
                      const isCorrect =
                        lesson.quiz!.questions[currentQuestionIdx]
                          .correctOptionId === opt.id;
                      const showSuccess = isSubmitted && isCorrect;
                      const showDanger =
                        isSubmitted && isSelected && !isCorrect;

                      let cardStyle =
                        "bg-white border-[#C9A961]/30 hover:border-[#C9A961] text-[#1A1611]";
                      let badgeStyle =
                        "bg-[#1A1611]/10 text-[#1A1611]/60";

                      if (isSelected && !isSubmitted) {
                        cardStyle =
                          "bg-[#C9A961]/10 border-[#C9A961] text-[#064E3B]";
                        badgeStyle = "bg-[#C9A961] text-[#064E3B]";
                      } else if (showSuccess) {
                        cardStyle =
                          "bg-[#064E3B]/10 border-[#064E3B] text-[#064E3B]";
                        badgeStyle = "bg-[#064E3B] text-[#E0C97D]";
                      } else if (showDanger) {
                        cardStyle =
                          "bg-[#6B2E2E]/10 border-[#6B2E2E] text-[#6B2E2E]";
                        badgeStyle = "bg-[#6B2E2E] text-white";
                      } else if (isSubmitted && isCorrect) {
                        cardStyle =
                          "bg-[#064E3B]/10 border-[#064E3B] text-[#064E3B]";
                        badgeStyle = "bg-[#064E3B] text-[#E0C97D]";
                      } else if (isSubmitted) {
                        cardStyle =
                          "bg-white opacity-60 border-[#1A1611]/15 text-[#1A1611]/40";
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            if (isSubmitted) return;
                            setSelectedOptId(opt.id);
                          }}
                          disabled={isSubmitted}
                          className={`flex items-center gap-4 w-full p-4 rounded-2xl border text-left font-semibold text-sm transition-all duration-200 ${cardStyle}`}
                        >
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm shrink-0 ${badgeStyle}`}
                          >
                            {showSuccess ? (
                              <FaCheck />
                            ) : showDanger ? (
                              <FaXmark />
                            ) : (
                              opt.id
                            )}
                          </span>
                          <span>{opt.text?.[lang] || opt.text?.fr}</span>
                        </button>
                      );
                    }
                  )}
                </div>

                {isSubmitted &&
                  lesson.quiz.questions[currentQuestionIdx].explanation?.[
                    lang
                  ] && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#064E3B]/5 border-l-4 border-[#064E3B] rounded-r-2xl p-4 text-xs sm:text-sm text-[#064E3B] leading-relaxed"
                    >
                      <span className="font-bold uppercase tracking-wider block mb-1">
                        {lang === "fr" ? "L'explication" : "Leral ya"}
                      </span>
                      {
                        lesson.quiz.questions[currentQuestionIdx]
                          .explanation?.[lang]
                      }
                    </motion.div>
                  )}

                <div className="flex justify-end pt-4">
                  {!isSubmitted ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedOptId) return;
                        setIsSubmitted(true);
                        const isCorrect =
                          lesson.quiz!.questions[currentQuestionIdx]
                            .correctOptionId === selectedOptId;
                        if (isCorrect) setScore((s) => s + 1);
                        setUserAnswers((prev) => ({
                          ...prev,
                          [lesson.quiz!.questions[currentQuestionIdx].id]:
                            selectedOptId,
                        }));
                      }}
                      disabled={!selectedOptId}
                      className="bg-[#064E3B] text-[#E0C97D] hover:bg-[#2D5547] font-bold px-8 py-3.5 rounded-xl text-sm transition disabled:opacity-50"
                    >
                      {lang === "fr"
                        ? "Valider la réponse"
                        : "Dëggal li nga tann"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const nextIdx = currentQuestionIdx + 1;
                        if (nextIdx < lesson.quiz!.questions.length) {
                          setCurrentQuestionIdx(nextIdx);
                          setSelectedOptId(null);
                          setIsSubmitted(false);
                        } else {
                          setQuizFinished(true);
                          const finalScore =
                            score +
                            (lesson.quiz!.questions[currentQuestionIdx]
                              .correctOptionId === selectedOptId
                              ? 1
                              : 0);
                          if (
                            finalScore >=
                              lesson.quiz!.questions.length / 2 &&
                            !isCompleted
                          ) {
                            toggleCompleted();
                          }
                        }
                      }}
                      className="bg-[#C9A961] text-[#064E3B] hover:bg-[#E0C97D] font-bold px-8 py-3.5 rounded-xl text-sm transition"
                    >
                      {currentQuestionIdx + 1 < lesson.quiz.questions.length
                        ? lang === "fr"
                          ? "Continuer"
                          : "Wëy"
                        : lang === "fr"
                        ? "Voir le résultat"
                        : "Guiss ndam li"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TOAST DE VALIDATION */}
        <AnimatePresence>
          {showCompletionAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#064E3B] to-[#2D5547] text-[#E0C97D] border border-[#C9A961]/40 px-6 py-3.5 rounded-full flex items-center gap-3 shadow-2xl z-50 font-semibold text-sm"
            >
              <div className="w-6 h-6 rounded-full bg-[#C9A961] flex items-center justify-center text-[#064E3B] text-xs">
                <FaCheck />
              </div>
              Leçon validée ! Bismillah.
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVIGATION PREV / NEXT */}
        <div className="mt-10 grid grid-cols-2 gap-4">
          <div>
            {prevLesson ? (
              <Link
                href={`/education/lecons/${prevLesson.id}`}
                className="edu-card flex flex-col rounded-2xl p-4 group text-left h-full justify-between"
              >
                <span className="text-[10px] text-[#1A1611]/50 uppercase tracking-wider font-semibold inline-flex items-center gap-1">
                  <FaChevronLeft className="text-[9px]" /> Précédente
                </span>
                <span className="text-[#064E3B] font-bold text-xs sm:text-sm mt-1 group-hover:text-[#6B2E2E] transition line-clamp-1">
                  {prevLesson.title?.fr}
                </span>
              </Link>
            ) : (
              <div className="h-full border border-[#1A1611]/10 opacity-50 rounded-2xl p-4 text-left">
                <span className="text-[10px] text-[#1A1611]/50 uppercase tracking-wider block">
                  Début du parcours
                </span>
              </div>
            )}
          </div>

          <div>
            {nextLesson ? (
              <Link
                href={`/education/lecons/${nextLesson.id}`}
                className="edu-card flex flex-col rounded-2xl p-4 group text-right h-full justify-between items-end"
              >
                <span className="text-[10px] text-[#1A1611]/50 uppercase tracking-wider font-semibold inline-flex items-center gap-1">
                  Suivante <FaChevronRight className="text-[9px]" />
                </span>
                <span className="text-[#064E3B] font-bold text-xs sm:text-sm mt-1 group-hover:text-[#6B2E2E] transition line-clamp-1">
                  {nextLesson.title?.fr}
                </span>
              </Link>
            ) : moduleParent ? (
              <Link
                href={`/education/modules/${moduleParent.id}`}
                className="flex flex-col bg-gradient-to-r from-[#C9A961] to-[#E0C97D] rounded-2xl p-4 hover:opacity-95 transition text-right h-full justify-between items-end text-[#064E3B]"
              >
                <span className="text-[10px] text-[#064E3B]/60 uppercase tracking-wider font-bold block">
                  Module Terminé
                </span>
                <span className="font-bold text-xs sm:text-sm mt-1 flex items-center gap-1">
                  Retour au module
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
      </ScreenshotGuard>
    </main>
  );
}
