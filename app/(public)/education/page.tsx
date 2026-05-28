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
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/layout/PageHero";
import { LINKS } from "@/lib/constants";
import { EducationModule, EducationLesson } from "@/lib/admin-types";
import { listEducationModules, listEducationLessons } from "@/lib/admin-data";
import { collection, addDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";

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
  const [isDev, setIsDev] = useState(false);
  const [modules, setModules] = useState<EducationModule[]>([]);
  const [lessons, setLessons] = useState<EducationLesson[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // States pour la liste d'attente (waitlist)
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [submittingWaitlist, setSubmittingWaitlist] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "success" | "error">("idle");
  const [waitlistErrorMsg, setWaitlistErrorMsg] = useState("");

  // Détection du mode développement / localhost
  useEffect(() => {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    const devMode = process.env.NODE_ENV === "development" || isLocal;
    setIsDev(devMode);

    if (devMode) {
      // Charger les données de l'académie en local
      Promise.all([listEducationModules(), listEducationLessons()])
        .then(([mods, lsns]) => {
          // Filtrer uniquement les modules publiés ou en aperçu
          const visibleModules = mods.filter(
            (m) => m.publishStatus !== "draft"
          );
          setModules(visibleModules);
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
        .catch((err) => console.error("Erreur de chargement de l'académie", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
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
      setWaitlistErrorMsg("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
    } finally {
      setSubmittingWaitlist(false);
    }
  };

  // VERSION PRODUCTION : TEASER "À VENIR" AVEC INSCRIPTION INTERACTIVE
  if (!isDev && !loading) {
    return (
      <main className="relative z-10">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 lg:pt-48 pb-16 text-center">
          <p className="font-arabic text-3xl sm:text-4xl md:text-5xl text-[#D4AF37] mb-6">
            صلى الله على محمد
          </p>

          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-6">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-[#D4AF37] opacity-75 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-[#D4AF37]" />
            </span>
            <span className="uppercase tracking-[0.25em] text-[#D4AF37] text-xs font-bold">
              Bientôt — Inch&apos;Allah
            </span>
          </span>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight">
            Éducation
            <br />
            <span className="bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#F5D76E] bg-clip-text text-transparent">
              & Culture
            </span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-white/80 leading-8 max-w-3xl mx-auto">
            La Commission Éducation & Culture du Dahira KSN prépare une
            plateforme spirituelle immersive — pour apprendre, méditer et
            transmettre l&apos;enseignement de Serigne Touba sur la Salaatu
            ʿAlaa Nabii.
          </p>

          <p className="mt-4 text-sm text-white/50 italic max-w-2xl mx-auto">
            Texte de référence pour le lancement : <em>Tazawwudu-ss-Sighar</em>,
            le Viatique des Adolescents de Cheikh Ahmadou Bamba
            (qu&apos;Allah l&apos;agrée).
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[28px] sm:rounded-[40px] p-6 sm:p-12">
            <div className="text-center mb-10">
              <span className="uppercase tracking-[0.25em] text-[#D4AF37] font-semibold text-xs sm:text-sm">
                Aperçu
              </span>
              <h2 className="font-display mt-3 text-3xl sm:text-4xl font-bold text-white">
                Ce que vous y trouverez
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
              {TEASE_FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="bg-[#0A3D24]/60 rounded-2xl sm:rounded-3xl p-6 border border-white/10 hover:border-[#D4AF37]/40 transition"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-[#0F7C55] text-xl mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-white/70 text-sm leading-6">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24">
          <div className="relative overflow-hidden rounded-[28px] sm:rounded-[45px] bg-gradient-to-br from-[#B8860B] via-[#D4AF37] to-[#B8860B] p-6 sm:p-12 md:p-14 text-[#0F7C55] text-center">
            <p className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose" dir="rtl">
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

        {/* SECTION LISTE D'ATTENTE FORMULAIRE */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 sm:pb-32 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
            Ne manquez pas le lancement de l&apos;Académie
          </h2>
          <p className="text-white/70 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Rejoignez la liste d&apos;attente pour être averti en priorité de l&apos;ouverture officielle de la Commission Éducation & Culture.
          </p>

          {waitlistStatus === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0A3D24]/80 border border-emerald-500/30 rounded-2xl p-6 text-center max-w-md mx-auto"
            >
              <span className="text-3xl mb-2 block">✨</span>
              <h4 className="font-display text-white font-bold text-lg">Inscription réussie !</h4>
              <p className="text-white/80 text-xs sm:text-sm mt-2">
                Barak&apos;Allahu Fihoum ! Vous serez informé dès l&apos;ouverture officielle de notre plateforme d&apos;apprentissage, Inch&apos;Allah.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribeWaitlist} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                disabled={submittingWaitlist}
                placeholder="Votre adresse e-mail"
                className="flex-1 rounded-2xl bg-white/10 border border-white/15 focus:border-[#D4AF37] px-4 py-3.5 text-white placeholder-white/40 text-sm outline-none transition"
              />
              <button
                type="submit"
                disabled={submittingWaitlist}
                className="bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] px-6 py-3.5 rounded-2xl font-bold shadow-xl hover:scale-102 active:scale-100 transition disabled:opacity-50 text-sm whitespace-nowrap"
              >
                {submittingWaitlist ? "Envoi en cours..." : "Rejoindre la liste"}
              </button>
            </form>
          )}

          {waitlistStatus === "error" && (
            <p className="text-red-400 text-xs mt-3">{waitlistErrorMsg}</p>
          )}

          <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
            <Link
              href="/inscription"
              className="text-[#D4AF37] hover:underline text-xs sm:text-sm font-semibold flex items-center gap-1.5"
            >
              Devenir membre du Dahira <FaArrowRight className="text-[10px]" />
            </Link>
            <span className="text-white/20">|</span>
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white text-xs sm:text-sm font-medium"
            >
              Nous contacter sur WhatsApp
            </a>
          </div>
        </section>
      </main>
    );
  }

  // VERSION DEVELOPPEMENT : L'ACADÉMIE INTERACTIVE (LOCALHOST)
  const totalLessons = lessons.length;
  const completedLessonsCount = lessons.filter((l) =>
    completedLessonIds.includes(l.id)
  ).length;
  const progressPct =
    totalLessons === 0 ? 0 : Math.round((completedLessonsCount / totalLessons) * 100);

  return (
    <main className="relative z-10 min-h-screen pb-20">
      <PageHero
        overline="Académie KSN (Localhost Preview)"
        title="Tazawwudu-ss-Sighar"
        arabic="تزود الصغار"
        description="Parcourez les leçons du Viatique des Adolescents de Cheikh Ahmadou Bamba. Un cheminement structuré pour appréhender le Tawhîd, le Fiqh et le Taçawwuf."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {loading ? (
          <div className="text-center py-20 text-white/70">
            <div className="w-10 h-10 border-2 border-white/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4" />
            Chargement de l&apos;académie interactive…
          </div>
        ) : modules.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-[30px] p-8 text-center text-white">
            <p className="text-lg text-white/80">Aucune leçon n&apos;est initialisée dans la base.</p>
            <p className="text-sm text-white/50 mt-2">
              Rendez-vous dans la section{" "}
              <Link href="/admin/education" className="text-[#D4AF37] underline font-bold">
                Admin &gt; Éducation
              </Link>{" "}
              pour cliquer sur le bouton <strong>« Initialiser le Tazawwud »</strong>.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* CARDE DE PROGRESSION GÉNÉRALE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] border border-white/10 rounded-[30px] p-6 sm:p-8 text-white shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-black">
                    Votre cheminement
                  </span>
                  <h2 className="font-display text-2xl font-bold mt-1">
                    Progression de l&apos;étude
                  </h2>
                  <p className="text-white/70 text-xs sm:text-sm mt-1">
                    {completedLessonsCount} sur {totalLessons} leçons validées ({progressPct}%)
                  </p>
                </div>
                {completedLessonsCount > 0 && (
                  <button
                    type="button"
                    onClick={resetProgress}
                    className="text-xs border border-white/20 hover:border-white/40 px-3 py-1.5 rounded-xl hover:bg-white/5 transition self-start sm:self-center"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
              <div className="mt-6">
                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </motion.div>

            {/* GRILLE DES MODULES */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-white">
                  Les Modules d&apos;Étude
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                {modules
                  .sort((a, b) => a.order - b.order)
                  .map((module, index) => {
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

                    const Icon = module.iconKey && ICON_BY_KEY[module.iconKey]
                      ? ICON_BY_KEY[module.iconKey]
                      : <FaGraduationCap />;

                    return (
                      <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/5 border border-white/10 rounded-[30px] p-6 flex flex-col justify-between hover:border-[#D4AF37]/30 transition group shadow-md"
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] text-[#D4AF37] flex items-center justify-center text-xl">
                              {Icon}
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/20">
                              Module {module.order}
                            </span>
                          </div>

                          <h4 className="font-display text-lg font-bold text-white mt-5 leading-tight group-hover:text-[#D4AF37] transition">
                            {module.title?.fr || "Sans titre"}
                          </h4>
                          {module.titleArabic && (
                            <p className="font-arabic mt-1.5 text-base text-[#D4AF37]" dir="rtl">
                              {module.titleArabic}
                            </p>
                          )}
                          <p className="mt-3 text-white/60 text-xs sm:text-sm leading-6 line-clamp-2">
                            {module.description?.fr ||
                              "Découvrez les enseignements fondamentaux de cette section."}
                          </p>
                        </div>

                        <div className="mt-6 pt-5 border-t border-white/5">
                          <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                            <span>
                              {moduleLessonsCount} leçon{moduleLessonsCount > 1 ? "s" : ""}
                            </span>
                            <span className="font-bold text-[#D4AF37]">
                              {completedInModule}/{moduleLessonsCount} validées
                            </span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-5">
                            <div
                              className="h-full bg-[#D4AF37] rounded-full transition-all duration-300"
                              style={{ width: `${modulePct}%` }}
                            />
                          </div>

                          <Link
                            href={`/education/modules/${module.id}`}
                            className="inline-flex w-full items-center justify-center gap-2 bg-white/10 hover:bg-gradient-to-r hover:from-[#B8860B] hover:to-[#D4AF37] text-white hover:text-[#0F7C55] py-3 rounded-2xl text-xs font-bold transition duration-300"
                          >
                            Ouvrir le module <FaChevronRight className="text-[10px]" />
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
