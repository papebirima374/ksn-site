"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaBookOpen,
  FaHeadphones,
  FaQuoteLeft,
  FaArrowRight,
  FaGraduationCap,
  FaSeedling,
  FaDroplet,
  FaHandsPraying,
  FaMoon,
  FaSpa,
  FaStar,
  FaChevronRight,
  FaCircleCheck,
  FaLock,
  FaAward,
} from "react-icons/fa6";
import { isModuleUnlocked } from "@/lib/education/progress";
import { motion } from "framer-motion";
import { LINKS } from "@/lib/constants";
import { EducationModule, EducationLesson } from "@/lib/admin-types";
import { listEducationModules, listEducationLessons } from "@/lib/admin-data";
import { collection, addDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import IslamicPattern from "./_components/IslamicPattern";

const ICON_BY_KEY: Record<string, React.ReactNode> = {
  seedling: <FaSeedling />,
  water: <FaDroplet />,
  prayer: <FaHandsPraying />,
  moon: <FaMoon />,
  flower: <FaSpa />,
  star: <FaStar />,
};

const TEASE_FEATURES = [
  {
    icon: <FaBookOpen />,
    title: "Enseignements de Serigne Touba",
    text: "Le Tazawwud, le Massalik al-Jinan et bien d'autres ouvrages traduits, audio, expliqués pour les francophones.",
  },
  {
    icon: <FaHeadphones />,
    title: "Audio premium multilingue",
    text: "Écoutez les leçons en français, anglais, arabe, italien, espagnol et wolof. Lecture lente et contemplative.",
  },
  {
    icon: <FaQuoteLeft />,
    title: "Rappels quotidiens",
    text: "Un hadith, un verset, un enseignement de Serigne Touba — chaque jour, court et inspirant.",
  },
];

export default function EducationPage() {
  const [modules, setModules] = useState<EducationModule[]>([]);
  const [lessons, setLessons] = useState<EducationLesson[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // States pour la liste d'attente (waitlist) — affichée si aucune leçon publiée
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [submittingWaitlist, setSubmittingWaitlist] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [waitlistErrorMsg, setWaitlistErrorMsg] = useState("");

  useEffect(() => {
    Promise.all([listEducationModules(), listEducationLessons()])
      .then(([mods, lsns]) => {
        const visibleModules = mods.filter((m) => m.publishStatus !== "draft");
        setModules(visibleModules);
        setLessons(lsns.filter((l) => l.publishStatus !== "draft"));

        const completed = localStorage.getItem(
          "ksn_education_completed_lessons"
        );
        if (completed) {
          try {
            setCompletedLessonIds(JSON.parse(completed));
          } catch {
            setCompletedLessonIds([]);
          }
        }
      })
      .catch((err) =>
        console.error("Erreur de chargement de l'académie", err)
      )
      .finally(() => setLoading(false));
  }, []);

  const resetProgress = () => {
    if (confirm("Réinitialiser votre progression d'apprentissage ?")) {
      localStorage.removeItem("ksn_education_completed_lessons");
      setCompletedLessonIds([]);
    }
  };

  const handleSubscribeWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;

    setSubmittingWaitlist(true);
    setWaitlistStatus("idle");
    setWaitlistErrorMsg("");

    try {
      const db = getDb();
      await addDoc(collection(db, "newsletter"), {
        email: waitlistEmail.trim().toLowerCase(),
        source: "education_waitlist",
        subscribedAt: Date.now(),
      });
      setWaitlistStatus("success");
      setWaitlistEmail("");
    } catch (err) {
      console.error("Erreur d'inscription liste d'attente:", err);
      setWaitlistStatus("error");
      setWaitlistErrorMsg(
        "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
      );
    } finally {
      setSubmittingWaitlist(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <main className="edu-surface relative min-h-screen flex items-center justify-center">
        <IslamicPattern variant="star8" opacity={0.05} />
        <div className="relative text-center">
          <div className="w-10 h-10 border-2 border-[#C9A961]/30 border-t-[#C9A961] rounded-full animate-spin mx-auto mb-4" />
          <p className="edu-prose text-base">
            Chargement de l&apos;Académie…
          </p>
        </div>
      </main>
    );
  }

  // === FALLBACK TEASER : aucune leçon publiée ===
  if (modules.length === 0) {
    return (
      <main className="edu-surface relative z-10 min-h-screen">
        <IslamicPattern variant="star8" opacity={0.06} />

        <section className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 lg:pt-48 pb-16 text-center">
          <p className="font-arabic text-3xl sm:text-4xl md:text-5xl text-[#C9A961] mb-6">
            صلى الله على محمد
          </p>

          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A961]/15 border border-[#C9A961]/40 mb-6">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-[#C9A961] opacity-75 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-[#C9A961]" />
            </span>
            <span className="uppercase tracking-[0.25em] text-[#6B2E2E] text-xs font-bold">
              Bientôt — Inch&apos;Allah
            </span>
          </span>

          <h1 className="edu-title text-4xl sm:text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">
            Éducation
            <br />
            <span className="bg-gradient-to-r from-[#C9A961] via-[#E0C97D] to-[#C9A961] bg-clip-text text-transparent">
              & Culture
            </span>
          </h1>

          <p className="mt-8 edu-prose max-w-3xl mx-auto">
            La Commission Éducation & Culture du Dahira KSN prépare une
            plateforme spirituelle immersive — pour apprendre, méditer et
            transmettre l&apos;enseignement de Serigne Touba sur la Salaatu
            ʿAlaa Nabii.
          </p>

          <p className="mt-4 text-sm text-[#6B2E2E]/70 italic max-w-2xl mx-auto">
            Texte de référence : <em>Tazawwudu-ss-Sighar</em>, le Viatique des
            Adolescents de Cheikh Ahmadou Bamba (qu&apos;Allah l&apos;agrée).
          </p>
        </section>

        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24">
          <div className="edu-card rounded-[28px] sm:rounded-[40px] p-6 sm:p-12">
            <div className="text-center mb-10">
              <span className="uppercase tracking-[0.25em] text-[#C9A961] font-semibold text-xs sm:text-sm">
                Aperçu
              </span>
              <h2 className="edu-title mt-3 text-3xl sm:text-4xl font-bold">
                Ce que vous y trouverez
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-5 sm:gap-6 edu-stagger">
              {TEASE_FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="edu-card rounded-2xl sm:rounded-3xl p-6"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C9A961] to-[#E0C97D] flex items-center justify-center text-[#064E3B] text-xl mb-4">
                    {f.icon}
                  </div>
                  <h3 className="edu-title text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 edu-prose text-sm leading-6">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24">
          <div className="relative overflow-hidden rounded-[28px] sm:rounded-[45px] bg-gradient-to-br from-[#C9A961] via-[#E0C97D] to-[#C9A961] p-6 sm:p-12 md:p-14 text-[#064E3B] text-center">
            <p
              className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose"
              dir="rtl"
            >
              مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا
            </p>
            <p className="mt-6 italic text-lg max-w-2xl mx-auto leading-relaxed">
              « Celui qui prie sur moi une fois, Allah prie sur lui dix fois. »
            </p>
            <p className="mt-3 text-xs sm:text-sm font-bold">
              — Le Prophète Muhammad ﷺ (rapporté par Muslim)
            </p>
          </div>
        </section>

        <section className="relative max-w-3xl mx-auto px-4 sm:px-6 pb-20 sm:pb-32 text-center">
          <h2 className="edu-title text-2xl sm:text-3xl font-bold mb-4">
            Ne manquez pas le lancement de l&apos;Académie
          </h2>
          <p className="edu-prose text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Rejoignez la liste d&apos;attente pour être averti en priorité de
            l&apos;ouverture officielle.
          </p>

          {waitlistStatus === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="edu-card rounded-2xl p-6 text-center max-w-md mx-auto"
            >
              <span className="text-3xl mb-2 block">✨</span>
              <h4 className="edu-title font-bold text-lg">
                Inscription réussie !
              </h4>
              <p className="edu-prose text-xs sm:text-sm mt-2">
                Barak&apos;Allahu Fihoum ! Vous serez informé dès
                l&apos;ouverture officielle, Inch&apos;Allah.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubscribeWaitlist}
              className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                required
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                disabled={submittingWaitlist}
                placeholder="Votre adresse e-mail"
                className="flex-1 rounded-2xl bg-white border border-[#C9A961]/40 focus:border-[#C9A961] px-4 py-3.5 text-[#1A1611] placeholder-[#1A1611]/40 text-sm outline-none transition"
              />
              <button
                type="submit"
                disabled={submittingWaitlist}
                className="bg-gradient-to-r from-[#C9A961] to-[#E0C97D] text-[#064E3B] px-6 py-3.5 rounded-2xl font-bold shadow-xl hover:scale-[1.02] active:scale-100 transition disabled:opacity-50 text-sm whitespace-nowrap"
              >
                {submittingWaitlist
                  ? "Envoi en cours..."
                  : "Rejoindre la liste"}
              </button>
            </form>
          )}

          {waitlistStatus === "error" && (
            <p className="text-red-700 text-xs mt-3">{waitlistErrorMsg}</p>
          )}

          <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
            <Link
              href="/inscription"
              className="text-[#064E3B] hover:underline text-xs sm:text-sm font-semibold flex items-center gap-1.5"
            >
              Devenir membre du Dahira{" "}
              <FaArrowRight className="text-[10px]" />
            </Link>
            <span className="text-[#1A1611]/20">|</span>
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A1611]/60 hover:text-[#064E3B] text-xs sm:text-sm font-medium"
            >
              Nous contacter sur WhatsApp
            </a>
          </div>
        </section>
      </main>
    );
  }

  // === ACADÉMIE PUBLIQUE ===
  const totalLessons = lessons.length;
  const completedLessonsCount = lessons.filter((l) =>
    completedLessonIds.includes(l.id)
  ).length;
  const progressPct =
    totalLessons === 0
      ? 0
      : Math.round((completedLessonsCount / totalLessons) * 100);
  const allDone = totalLessons > 0 && completedLessonsCount === totalLessons;

  return (
    <main className="edu-surface relative z-10 min-h-screen pb-20">
      <IslamicPattern variant="star8" opacity={0.05} />

      {/* HERO Éducation — palette parchemin */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-12 text-center">
        <p className="font-arabic text-3xl sm:text-4xl text-[#C9A961] mb-6">
          صلى الله على محمد
        </p>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#064E3B]/10 border border-[#064E3B]/20 mb-5">
          <span className="uppercase tracking-[0.25em] text-[#064E3B] text-[10px] font-bold">
            Académie KSN — Accès libre
          </span>
        </span>
        <h1 className="edu-title text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05]">
          Tazawwudu-ss-Sighar
        </h1>
        <p
          className="font-arabic text-2xl sm:text-3xl text-[#C9A961] mt-3"
          dir="rtl"
        >
          تزود الصغار
        </p>
        <p className="mt-6 edu-prose max-w-3xl mx-auto">
          Le Viatique des Adolescents de Cheikh Ahmadou Bamba — un cheminement
          structuré pour appréhender le Tawhîd, le Fiqh et le Taçawwuf.
        </p>
      </section>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div className="space-y-10">
          {/* CARTE PROGRESSION */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="edu-card rounded-[30px] p-6 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[#C9A961] text-xs uppercase tracking-widest font-black">
                  Votre cheminement
                </span>
                <h2 className="edu-title text-2xl font-bold mt-1">
                  Progression de l&apos;étude
                </h2>
                <p className="edu-prose text-xs sm:text-sm mt-1 mb-0">
                  {completedLessonsCount} sur {totalLessons} leçons validées (
                  {progressPct}%)
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                {allDone && (
                  <Link
                    href="/education/certificat"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9A961] to-[#E0C97D] text-[#064E3B] text-xs font-bold px-4 py-2 rounded-xl hover:shadow-lg transition"
                  >
                    <FaAward /> Demander mon certificat
                  </Link>
                )}
                {completedLessonsCount > 0 && (
                  <button
                    type="button"
                    onClick={resetProgress}
                    className="text-xs border border-[#1A1611]/15 hover:border-[#1A1611]/30 px-3 py-1.5 rounded-xl hover:bg-[#1A1611]/5 transition text-[#1A1611]/70"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>
            <div className="mt-6">
              <div className="h-2.5 bg-[#1A1611]/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C9A961] to-[#E0C97D] rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* MODULES */}
          <div>
            <div className="edu-divider mb-6">
              <span className="font-arabic">۞</span>
            </div>
            <h3 className="edu-title text-2xl font-bold mb-6 text-center">
              Les Modules d&apos;Étude
            </h3>

            <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 edu-stagger">
              {modules
                .sort((a, b) => a.order - b.order)
                .map((module) => {
                  const moduleLessons = lessons.filter(
                    (l) => l.moduleId === module.id
                  );
                  const completedInModule = moduleLessons.filter((l) =>
                    completedLessonIds.includes(l.id)
                  ).length;
                  const moduleLessonsCount = moduleLessons.length;
                  const modulePct =
                    moduleLessonsCount === 0
                      ? 0
                      : Math.round(
                          (completedInModule / moduleLessonsCount) * 100
                        );

                  const Icon =
                    module.iconKey && ICON_BY_KEY[module.iconKey] ? (
                      ICON_BY_KEY[module.iconKey]
                    ) : (
                      <FaGraduationCap />
                    );

                  const moduleOpen = isModuleUnlocked(
                    module.id,
                    modules,
                    lessons,
                    completedLessonIds
                  );
                  const isFullyDone =
                    moduleLessonsCount > 0 &&
                    completedInModule === moduleLessonsCount;

                  return (
                    <div
                      key={module.id}
                      className={`edu-card rounded-[28px] p-6 flex flex-col justify-between group ${
                        !moduleOpen ? "opacity-60" : ""
                      } ${
                        isFullyDone
                          ? "ring-1 ring-[#064E3B]/20"
                          : ""
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                              !moduleOpen
                                ? "bg-[#1A1611]/5 text-[#1A1611]/30"
                                : isFullyDone
                                ? "bg-[#064E3B] text-[#E0C97D]"
                                : "bg-gradient-to-br from-[#064E3B] to-[#2D5547] text-[#E0C97D]"
                            }`}
                          >
                            {!moduleOpen ? (
                              <FaLock />
                            ) : isFullyDone ? (
                              <FaCircleCheck />
                            ) : (
                              Icon
                            )}
                          </div>
                          <span
                            className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border ${
                              !moduleOpen
                                ? "text-[#1A1611]/40 bg-[#1A1611]/5 border-[#1A1611]/10"
                                : isFullyDone
                                ? "text-[#064E3B] bg-[#064E3B]/10 border-[#064E3B]/30"
                                : "text-[#6B2E2E] bg-[#C9A961]/15 border-[#C9A961]/40"
                            }`}
                          >
                            {!moduleOpen
                              ? "Verrouillé"
                              : isFullyDone
                              ? "Terminé ✓"
                              : `Module ${module.order}`}
                          </span>
                        </div>

                        <h4
                          className={`edu-title text-lg font-bold mt-5 leading-tight transition ${
                            !moduleOpen ? "opacity-60" : ""
                          }`}
                        >
                          {module.title?.fr || "Sans titre"}
                        </h4>
                        {module.titleArabic && (
                          <p
                            className={`font-arabic mt-1.5 text-base ${
                              !moduleOpen
                                ? "text-[#C9A961]/40"
                                : "text-[#C9A961]"
                            }`}
                            dir="rtl"
                          >
                            {module.titleArabic}
                          </p>
                        )}
                        <p
                          className={`mt-3 edu-prose text-sm leading-6 line-clamp-2 mb-0 ${
                            !moduleOpen ? "opacity-50" : ""
                          }`}
                        >
                          {!moduleOpen
                            ? "Validez les leçons du module précédent pour débloquer celui-ci."
                            : module.description?.fr ||
                              "Découvrez les enseignements fondamentaux de cette section."}
                        </p>
                      </div>

                      <div className="mt-6 pt-5 border-t border-[#C9A961]/20">
                        <div className="flex items-center justify-between text-xs text-[#1A1611]/60 mb-2">
                          <span>
                            {moduleLessonsCount} leçon
                            {moduleLessonsCount > 1 ? "s" : ""}
                          </span>
                          <span
                            className={`font-bold ${
                              isFullyDone
                                ? "text-[#064E3B]"
                                : "text-[#C9A961]"
                            }`}
                          >
                            {completedInModule}/{moduleLessonsCount} validées
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#1A1611]/10 rounded-full overflow-hidden mb-5">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isFullyDone ? "bg-[#064E3B]" : "bg-[#C9A961]"
                            }`}
                            style={{ width: `${modulePct}%` }}
                          />
                        </div>

                        {moduleOpen ? (
                          <Link
                            href={`/education/modules/${module.id}`}
                            className={`inline-flex w-full items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition duration-300 ${
                              isFullyDone
                                ? "bg-[#064E3B]/10 hover:bg-[#064E3B] text-[#064E3B] hover:text-[#E0C97D] border border-[#064E3B]/30"
                                : "bg-gradient-to-r from-[#C9A961] to-[#E0C97D] text-[#064E3B] hover:shadow-lg"
                            }`}
                          >
                            {isFullyDone
                              ? "Revoir le module"
                              : "Continuer le module"}{" "}
                            <FaChevronRight className="text-[10px]" />
                          </Link>
                        ) : (
                          <div className="inline-flex w-full items-center justify-center gap-2 bg-[#1A1611]/5 text-[#1A1611]/40 py-3 rounded-2xl text-xs font-bold cursor-not-allowed">
                            <FaLock className="text-[10px]" /> Verrouillé
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
