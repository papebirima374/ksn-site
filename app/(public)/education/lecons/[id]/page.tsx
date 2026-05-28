"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaChevronRight,
  FaChevronLeft,
  FaCircleCheck,
  FaCircle,
  FaCheck,
  FaCircleInfo,
  FaLightbulb,
  FaXmark,
  FaPlay,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { EducationLesson, EducationModule } from "@/lib/admin-types";
import { getEducationLesson, getEducationModule, listEducationLessons, listEducationModules } from "@/lib/admin-data";
import {
  loadCompletedLessonIds,
  markLessonCompleted,
  isLessonUnlocked,
  getCurrentLesson,
  getNextLesson as helperGetNextLesson,
  getPrevLesson as helperGetPrevLesson,
} from "@/lib/education/progress";

export default function PublicLessonDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const lessonId = String(params?.id ?? "");

  const [lesson, setLesson] = useState<EducationLesson | null>(null);
  const [moduleParent, setModuleParent] = useState<EducationModule | null>(null);
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
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!lessonId) return;

    // Reset quiz state when switching lessons
    setQuizStarted(false);
    setCurrentQuestionIdx(0);
    setSelectedOptId(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setUserAnswers({});

    // Détection localhost uniquement (sécurité)
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (process.env.NODE_ENV !== "development" && !isLocal) {
      router.replace("/education");
      return;
    }

    setLoading(true);
    // On charge en parallèle : la leçon courante + TOUS les modules + TOUTES les leçons
    // (nécessaire pour calculer le gating séquentiel global)
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

        // Filtrage : seules les leçons et modules publiés sont accessibles publiquement
        const allLessons = allLessonsRaw.filter((x) => x.publishStatus !== "draft");
        const visibleModules = allModules.filter((m) => m.publishStatus !== "draft");

        // Récupérer la progression depuis localStorage
        const completed = loadCompletedLessonIds();
        setCompletedLessonIds(completed);

        // ═══ GATING : vérifier si la leçon est débloquée ═══
        const unlocked = isLessonUnlocked(l.id, visibleModules, allLessons, completed);
        if (!unlocked) {
          // Redirection vers la leçon "courante" (la première non complétée débloquée)
          const current = getCurrentLesson(visibleModules, allLessons, completed);
          if (current) {
            router.replace(`/education/lecons/${current.id}`);
          } else {
            router.replace("/education");
          }
          return;
        }

        setLesson(l);

        // Récupérer le module parent
        const m = await getEducationModule(l.moduleId);
        setModuleParent(m);

        // Navigation prev/next dans la séquence GLOBALE (pas seulement le module)
        setPrevLesson(helperGetPrevLesson(l.id, visibleModules, allLessons));
        setNextLesson(helperGetNextLesson(l.id, visibleModules, allLessons));

        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement", err);
        setError("Impossible de charger la leçon.");
        setLoading(false);
      });
  }, [lessonId, router]);

  // Handler pour marquer la leçon comme lue (toujours en avant, pas de toggle).
  // Une fois validée, on ne peut plus annuler — c'est une étape franchie.
  const toggleCompleted = () => {
    if (!lesson) return;
    if (completedLessonIds.includes(lesson.id)) return; // déjà validée

    const updated = markLessonCompleted(lesson.id);
    setCompletedLessonIds(updated);
    setShowCompletionAnimation(true);
    setTimeout(() => setShowCompletionAnimation(false), 2200);
  };

  if (loading) {
    return (
      <main className="relative z-10 min-h-screen pt-32 sm:pt-40 pb-20 text-center text-white/70">
        <div className="w-10 h-10 border-2 border-white/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4" />
        Chargement de la leçon…
      </main>
    );
  }

  if (error || !lesson) {
    return (
      <main className="relative z-10 min-h-screen pt-32 sm:pt-40 pb-20 max-w-xl mx-auto px-4">
        <div className="bg-white/5 border border-white/10 rounded-[30px] p-8 text-center text-white">
          <p className="text-lg text-white/80">{error || "Leçon introuvable."}</p>
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

  const isCompleted = completedLessonIds.includes(lesson.id);

  // Vérifier la présence de contenu Wolof
  const hasWolof = Boolean(
    lesson.title?.wo ||
    lesson.content?.wo ||
    lesson.intention?.wo ||
    lesson.audio?.wo ||
    lesson.citation?.translations?.wo ||
    lesson.application?.wo ||
    lesson.reminder?.wo
  );

  // Valeurs localisées avec repli sur le français
  const title = lang === "wo" ? (lesson.title?.wo || lesson.title?.fr) : lesson.title?.fr;
  const intention = lang === "wo" ? (lesson.intention?.wo || lesson.intention?.fr) : lesson.intention?.fr;
  const content = lang === "wo" ? (lesson.content?.wo || lesson.content?.fr) : lesson.content?.fr;
  const citationText = lang === "wo" ? (lesson.citation?.translations?.wo || lesson.citation?.translations?.fr) : lesson.citation?.translations?.fr;
  const application = lang === "wo" ? (lesson.application?.wo || lesson.application?.fr) : lesson.application?.fr;
  const reminder = lang === "wo" ? (lesson.reminder?.wo || lesson.reminder?.fr) : lesson.reminder?.fr;
  const audio = lang === "wo" ? lesson.audio?.wo : lesson.audio?.fr;

  return (
    <main className="relative z-10 min-h-screen pt-32 sm:pt-40 pb-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* RETOUR & MODULE HEADER */}
        <div className="mb-6 flex items-center justify-between gap-4">
          {moduleParent && (
            <Link
              href={`/education/modules/${moduleParent.id}`}
              className="inline-flex items-center gap-2 text-sm text-[#D4AF37] hover:text-white transition font-semibold"
            >
              <FaArrowLeft /> {moduleParent.title?.fr}
            </Link>
          )}

          {isCompleted && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <FaCheck /> Leçon validée
            </span>
          )}
        </div>

        {/* LECTEUR DE TEXTE BILINGUE */}
        <article className="bg-[#F8F5EF] text-gray-800 rounded-[35px] shadow-2xl overflow-hidden border border-white">
          {/* Barre supérieure : sélecteur de langue */}
          {hasWolof && (
            <div className="bg-[#0F7C55]/10 px-6 sm:px-10 py-3 flex justify-end gap-2 border-b border-[#0F7C55]/10">
              <button
                type="button"
                onClick={() => setLang("fr")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  lang === "fr"
                    ? "bg-[#0F7C55] text-white shadow-sm"
                    : "bg-transparent text-[#0F7C55]/60 hover:text-[#0F7C55]"
                }`}
              >
                🇫🇷 Français
              </button>
              <button
                type="button"
                onClick={() => setLang("wo")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  lang === "wo"
                    ? "bg-[#0F7C55] text-white shadow-sm"
                    : "bg-transparent text-[#0F7C55]/60 hover:text-[#0F7C55]"
                }`}
              >
                🇸🇳 Wolof
              </button>
            </div>
          )}

          <div className="p-6 sm:p-10 md:p-14">
            {/* SUR-TITRE */}
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#B8860B] font-black">
              Leçon {lesson.reference} {moduleParent ? `· ${moduleParent.title?.fr}` : ""}
            </p>

            {/* TITRE PRINCIPAL */}
            <h1 className="font-display mt-2 text-2xl sm:text-3xl md:text-4xl font-black text-[#0F7C55] leading-tight">
              {title}
            </h1>
            {lesson.titleArabic && (
              <p className="font-arabic mt-2 text-xl sm:text-2xl text-[#B8860B] text-right" dir="rtl">
                {lesson.titleArabic}
              </p>
            )}

            <div className="w-16 h-0.5 bg-[#D4AF37] my-6" />

            {/* LECTEUR AUDIO */}
            {audio && (
              <div className="bg-[#0F7C55]/5 border border-[#0F7C55]/10 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0F7C55] text-[#D4AF37] flex items-center justify-center text-sm shadow-md">
                    🔊
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#0F7C55] font-black">
                      Écouter l&apos;enseignement
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {lang === "fr" ? "Audio de synthèse apaisant" : "Récitation officielle wolof"}
                    </p>
                  </div>
                </div>
                <audio src={audio.url} controls className="w-full sm:w-auto flex-1 max-w-[240px] sm:max-w-xs" />
              </div>
            )}

            {/* INTENTION / NIYA */}
            {intention && (
              <div className="bg-[#0F7C55]/5 border-l-4 border-[#0F7C55] rounded-r-2xl p-5 mb-8 text-[#0F7C55] text-sm sm:text-base leading-7 italic">
                <p className="font-bold text-xs uppercase tracking-wider text-[#0F7C55]/60 mb-1">
                  Intention spirituelle (Niya)
                </p>
                « {intention} »
              </div>
            )}

            {/* CITATION CENTRALE (VERSET / HADITH) */}
            {lesson.citation && (lesson.citation.arabic || citationText) && (
              <div className="bg-[#0A3D24] text-white rounded-2xl p-6 sm:p-8 text-center my-8 shadow-md relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 flex items-center justify-center font-arabic text-7xl select-none pointer-events-none">
                  الله
                </div>

                {lesson.citation.arabic && (
                  <p className="font-arabic text-xl sm:text-2xl md:text-3xl leading-loose text-[#D4AF37] mb-6" dir="rtl">
                    {lesson.citation.arabic}
                  </p>
                )}
                {citationText && (
                  <p className="italic text-white/95 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                    « {citationText} »
                  </p>
                )}

                {(lesson.citation.author || lesson.citation.sourceRef) && (
                  <p className="mt-4 text-[10px] sm:text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                    — {lesson.citation.author || ""}{" "}
                    {lesson.citation.sourceRef ? `(${lesson.citation.sourceRef})` : ""}
                  </p>
                )}
              </div>
            )}

            {/* CORPS DE LA LEÇON */}
            <div className="prose prose-emerald max-w-none text-[#1A1A1A] leading-8 text-sm sm:text-base whitespace-pre-wrap my-8">
              {content || (
                <p className="text-gray-400 italic text-center py-6">
                  Le contenu de cet enseignement est en cours de rédaction par la Commission.
                </p>
              )}
            </div>

            {/* APPLICATION PRATIQUE */}
            {application && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 my-8 shadow-sm">
                <h3 className="text-xs uppercase tracking-widest text-[#B8860B] font-black flex items-center gap-2 mb-3">
                  <FaLightbulb /> Application dans votre vie
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-7 whitespace-pre-wrap">
                  {application}
                </p>
              </div>
            )}

            {/* RAPPEL À MÉMORISER */}
            {reminder && (
              <div className="border-2 border-dashed border-[#D4AF37] rounded-3xl p-5 sm:p-6 my-8 bg-amber-50/20 text-center">
                <span className="text-[10px] uppercase tracking-widest text-[#B8860B] font-black block mb-1">
                  À retenir aujourd&apos;hui
                </span>
                <p className="font-semibold text-[#0F7C55] text-sm sm:text-base leading-relaxed">
                  {reminder}
                </p>
              </div>
            )}

            {/* VALIDATION DE LA LECON — debloque la suivante */}
            <div className="mt-10 pt-8 border-t border-[#0F7C55]/15">
              {!isCompleted ? (
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-3">
                    Prêt(e) à valider cette leçon ?
                  </p>
                  <p className="text-sm text-gray-600 mb-5 max-w-lg mx-auto leading-6">
                    En validant, tu confirmes avoir lu et compris l&apos;enseignement.
                    La leçon suivante sera alors débloquée.
                  </p>
                  <button
                    type="button"
                    onClick={toggleCompleted}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] hover:from-[#B8860B] hover:to-[#D4AF37] text-white hover:text-[#0F7C55] font-bold px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition text-sm sm:text-base"
                  >
                    <FaCheck />
                    J&apos;ai compris — Valider la leçon
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center mb-3">
                    <FaCheck className="text-xl" />
                  </div>
                  <p className="font-display text-lg font-bold text-emerald-800">
                    Alhamdoulillah, leçon validée
                  </p>
                  {nextLesson ? (
                    <Link
                      href={`/education/lecons/${nextLesson.id}`}
                      className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold px-6 py-3 rounded-xl shadow-md hover:scale-105 transition text-sm"
                    >
                      Continuer vers la leçon suivante <FaChevronRight className="text-xs" />
                    </Link>
                  ) : (
                    <p className="mt-3 text-sm text-emerald-700 italic">
                      Tu as terminé toutes les leçons du Tazawwud. Macha&apos;Allah !
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </article>

        {/* SECTION QUIZ INTERACTIF */}
        {lesson.quiz?.questions && lesson.quiz.questions.length > 0 && (
          <div className="mt-8 bg-[#F8F5EF] text-gray-800 rounded-[35px] shadow-2xl border border-white p-6 sm:p-10 md:p-12">
            {!quizStarted ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#0F7C55]/10 text-[#D4AF37] flex items-center justify-center text-3xl mx-auto shadow-inner">
                  🎓
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl sm:text-2xl font-black text-[#0F7C55]">
                    {lang === "fr" ? "Testez votre compréhension !" : "Manoore sa xam-xam !"}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto">
                    {lang === "fr"
                      ? `Évaluez ce que vous venez d'apprendre dans cette leçon en répondant à un court quiz de ${lesson.quiz.questions.length} question${lesson.quiz.questions.length > 1 ? "s" : ""}.`
                      : `Gëstu-leen li ngen doon jàng tey ci laaj yi. (${lesson.quiz.questions.length} laaj)`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setQuizStarted(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] text-white hover:from-[#B8860B] hover:to-[#D4AF37] font-bold px-8 py-4 rounded-2xl transition shadow-lg hover:scale-105"
                >
                  <FaPlay className="text-xs" />
                  {lang === "fr" ? "Bismillah — Commencer" : "Bismillah — Tàmbalee"}
                </button>
              </div>
            ) : quizFinished ? (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#B8860B] to-[#D4AF37] text-white flex items-center justify-center text-3xl mx-auto shadow-md font-bold">
                  {score}/{lesson.quiz.questions.length}
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl sm:text-2xl font-black text-[#0F7C55]">
                    {score === lesson.quiz.questions.length
                      ? (lang === "fr" ? "Macha'Allah ! Score parfait !" : "Macha'Allah ! Mat na seuk !")
                      : (lang === "fr" ? "Alhamdoulillah, bel effort !" : "Alhamdoulillah, jéem nga !")}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                    {score === lesson.quiz.questions.length
                      ? (lang === "fr"
                          ? "Félicitations, vous avez parfaitement assimilé les enseignements de cette leçon. Bismillah !"
                          : "Rafet na lool, xam-xam bi leer na te dëgër na ci sa xol.")
                      : (score >= lesson.quiz.questions.length / 2
                          ? (lang === "fr"
                              ? "Vous avez validé l'essentiel. Relisez les points manqués pour ancrer vos connaissances."
                              : "Mën nga gën a jàngat ngir dëgëral ponk yi ci sa xel.")
                          : (lang === "fr"
                              ? "La recherche du savoir est une adoration. Prenez le temps de relire la leçon et recommencez."
                              : "Jàng gi jaamu Yalla la. Jéematel laaj yi ngir gën a xam."))}
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
                    className="bg-[#0F7C55] hover:bg-[#0A3D24] text-white font-bold px-6 py-3 rounded-xl text-sm transition"
                  >
                    {lang === "fr" ? "Recommencer le test" : "Jéemat laaj yi"}
                  </button>
                  {nextLesson && (
                    <Link
                      href={`/education/lecons/${nextLesson.id}`}
                      className="bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold px-6 py-3 rounded-xl text-sm hover:scale-105 transition"
                    >
                      {lang === "fr" ? "Leçon suivante" : "Jàng bu ci tégu"}
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header Question */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#B8860B] font-black">
                      {lang === "fr" ? "Quiz de Leçon" : "Laaji Jàng gi"}
                    </span>
                    <h4 className="text-sm font-bold text-[#0F7C55]">
                      Question {currentQuestionIdx + 1} sur {lesson.quiz.questions.length}
                    </h4>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {Math.round(((currentQuestionIdx) / lesson.quiz.questions.length) * 100)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4AF37] transition-all duration-300"
                    style={{ width: `${((currentQuestionIdx) / lesson.quiz.questions.length) * 100}%` }}
                  />
                </div>

                {/* Question */}
                <div className="my-6">
                  <p className="font-display text-base sm:text-lg font-bold text-gray-900 leading-relaxed">
                    {lesson.quiz.questions[currentQuestionIdx].question?.[lang] ||
                     lesson.quiz.questions[currentQuestionIdx].question?.fr}
                  </p>
                </div>

                {/* Options list */}
                <div className="grid gap-3">
                  {lesson.quiz.questions[currentQuestionIdx].options.map((opt) => {
                    const isSelected = selectedOptId === opt.id;
                    const isCorrect = lesson.quiz!.questions[currentQuestionIdx].correctOptionId === opt.id;
                    const showSuccess = isSubmitted && isCorrect;
                    const showDanger = isSubmitted && isSelected && !isCorrect;

                    let cardStyle = "bg-white border-gray-200 hover:border-[#D4AF37] text-gray-800";
                    let badgeStyle = "bg-gray-100 text-gray-600";

                    if (isSelected && !isSubmitted) {
                      cardStyle = "bg-[#D4AF37]/5 border-[#D4AF37] text-gray-900";
                      badgeStyle = "bg-[#D4AF37] text-[#0F7C55]";
                    } else if (showSuccess) {
                      cardStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-900";
                      badgeStyle = "bg-emerald-500 text-white";
                    } else if (showDanger) {
                      cardStyle = "bg-red-500/10 border-red-500 text-red-950";
                      badgeStyle = "bg-red-500 text-white";
                    } else if (isSubmitted && isCorrect) {
                      // Highlight the correct one if user missed it
                      cardStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-900";
                      badgeStyle = "bg-emerald-500 text-white";
                    } else if (isSubmitted) {
                      cardStyle = "bg-white opacity-60 border-gray-200 text-gray-400";
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
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm shrink-0 ${badgeStyle}`}>
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
                  })}
                </div>

                {/* Explanation block */}
                {isSubmitted && lesson.quiz.questions[currentQuestionIdx].explanation?.[lang] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0F7C55]/5 border-l-4 border-[#0F7C55] rounded-r-2xl p-4 text-xs sm:text-sm text-[#0F7C55] leading-relaxed"
                  >
                    <span className="font-bold uppercase tracking-wider block mb-1">
                      {lang === "fr" ? "L'explication" : "Leral ya"}
                    </span>
                    {lesson.quiz.questions[currentQuestionIdx].explanation?.[lang]}
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-end pt-4">
                  {!isSubmitted ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedOptId) return;
                        setIsSubmitted(true);
                        const isCorrect = lesson.quiz!.questions[currentQuestionIdx].correctOptionId === selectedOptId;
                        if (isCorrect) setScore((s) => s + 1);
                        setUserAnswers((prev) => ({ ...prev, [lesson.quiz!.questions[currentQuestionIdx].id]: selectedOptId }));
                      }}
                      disabled={!selectedOptId}
                      className="bg-[#0F7C55] text-white hover:bg-[#0A3D24] font-bold px-8 py-3.5 rounded-xl text-sm transition disabled:opacity-50"
                    >
                      {lang === "fr" ? "Valider la réponse" : "Dëggal li nga tann"}
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
                          // Auto validation if score >= 50%
                          const finalScore = score + (lesson.quiz!.questions[currentQuestionIdx].correctOptionId === selectedOptId ? 1 : 0);
                          if (finalScore >= lesson.quiz!.questions.length / 2 && !isCompleted) {
                            toggleCompleted();
                          }
                        }
                      }}
                      className="bg-[#B8860B] text-[#0F7C55] hover:bg-[#D4AF37] font-bold px-8 py-3.5 rounded-xl text-sm transition"
                    >
                      {currentQuestionIdx + 1 < lesson.quiz.questions.length
                        ? (lang === "fr" ? "Continuer" : "Wëy")
                        : (lang === "fr" ? "Voir le résultat" : "Guiss ndam li")}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LECTEUR D'ANIMATION DE SUCCÈS MICRO-INTERACTION */}
        <AnimatePresence>
          {showCompletionAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] text-white border border-[#D4AF37]/30 px-6 py-3.5 rounded-full flex items-center gap-3 shadow-2xl z-50 font-semibold text-sm"
            >
              <div className="w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0F7C55] text-xs">
                <FaCheck />
              </div>
              Leçon validée ! Bismillah.
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVIGATION PRECEDENT / SUIVANT */}
        <div className="mt-10 grid grid-cols-2 gap-4">
          <div>
            {prevLesson ? (
              <Link
                href={`/education/lecons/${prevLesson.id}`}
                className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition group text-left h-full justify-between"
              >
                <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold inline-flex items-center gap-1">
                  <FaChevronLeft className="text-[9px]" /> Précédente
                </span>
                <span className="text-white font-bold text-xs sm:text-sm mt-1 group-hover:text-[#D4AF37] transition line-clamp-1">
                  {prevLesson.title?.fr}
                </span>
              </Link>
            ) : (
              <div className="h-full border border-white/5 opacity-30 rounded-2xl p-4 text-left">
                <span className="text-[10px] text-white/50 uppercase tracking-wider block">
                  Début du module
                </span>
              </div>
            )}
          </div>

          <div>
            {nextLesson ? (
              <Link
                href={`/education/lecons/${nextLesson.id}`}
                className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition group text-right h-full justify-between items-end"
              >
                <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold inline-flex items-center gap-1">
                  Suivante <FaChevronRight className="text-[9px]" />
                </span>
                <span className="text-white font-bold text-xs sm:text-sm mt-1 group-hover:text-[#D4AF37] transition line-clamp-1">
                  {nextLesson.title?.fr}
                </span>
              </Link>
            ) : moduleParent ? (
              <Link
                href={`/education/modules/${moduleParent.id}`}
                className="flex flex-col bg-gradient-to-r from-[#B8860B] to-[#D4AF37] rounded-2xl p-4 hover:opacity-90 transition text-right h-full justify-between items-end text-[#0F7C55]"
              >
                <span className="text-[10px] text-[#0F7C55]/60 uppercase tracking-wider font-bold block">
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
    </main>
  );
}
