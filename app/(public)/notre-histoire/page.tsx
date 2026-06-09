import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  FaSeedling,
  FaPeopleGroup,
  FaWhatsapp,
  FaStar,
  FaHandHoldingHeart,
} from "react-icons/fa6";
import PageHero from "@/components/layout/PageHero";
import ShareButton from "@/components/ui/ShareButton";
import { LINKS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Notre Histoire — Fondation 2021 à Touba",
  description:
    "L'histoire du Dahira Kippangog Salaatu ʿAlaa Nabii : de la fondation à Touba en janvier 2021 à un mouvement spirituel international rassemblant des milliers de membres autour de la Prière sur le Prophète Muhammad ﷺ.",
  openGraph: {
    title: "Notre Histoire — Dahira KSN depuis 2021",
    description:
      "Comment un cercle de fidèles à Touba est devenu un Dahira international au service de la Prière sur le Prophète Muhammad ﷺ.",
  },
};

type Milestone = {
  year: string;
  date: string;
  icon: ReactNode;
  title: string;
  text: string;
  isFuture?: boolean;
};

const MILESTONES: Milestone[] = [
  {
    year: "2021",
    date: "02 janvier",
    icon: <FaSeedling />,
    title: "Fondation du Dahira à Touba",
    text: "Un cercle de fidèles, sous l'impulsion de Serigne Birima Gueye, crée officiellement le Dahira Kippangog Salaatu ʿAlaa Nabii avec une mission claire : faire de la prière sur le Prophète Muhammad ﷺ un acte communautaire quotidien, structuré et rayonnant à l'international.",
  },
  {
    year: "2021",
    date: "Chaque semaine",
    icon: <FaHandHoldingHeart />,
    title: "Des millions de Salaatu ʿAlaa Nabii",
    text: "Dès la première année, la communauté se réunit régulièrement pour réciter ensemble des millions de Prières sur le Prophète Muhammad ﷺ. Cette pratique collective devient le cœur battant et l'identité du Dahira.",
  },
  {
    year: "2022",
    date: "Anniversaire",
    icon: <FaPeopleGroup />,
    title: "Visite à Serigne Ahmadou Mbacké — Daroul Mouhty",
    text: "Pour l'anniversaire du Dahira, une délégation rend visite à Serigne Ahmadou Mbacké à Daroul Mouhty, pour une interview sur les immenses bienfaits du Salaatu ʿAlaa Nabii.",
  },
  {
    year: "2023",
    date: "Anniversaire",
    icon: <FaPeopleGroup />,
    title: "Causerie auprès de Serigne Khalil Mbacké",
    text: "À l'occasion de l'anniversaire, la communauté est reçue par Serigne Khalil Mbacké pour une causerie spirituelle dédiée aux bienfaits et aux mérites de la Prière sur le Prophète Muhammad ﷺ.",
  },
  {
    year: "2023",
    date: "30 décembre",
    icon: <FaStar />,
    title: "1ʳᵉ Journée Salaatu ʿAlaa Nabii",
    text: "Organisation du tout premier grand rassemblement annuel à Touba : récitals du Coran, conférences d'érudits, déclamation des Khassida et dhikr collectif. La Journée devient la pierre angulaire de la vie du Dahira.",
  },
  {
    year: "2024",
    date: "14 décembre",
    icon: <FaStar />,
    title: "2ᵉ édition de la Journée Salaatu",
    text: "La deuxième édition confirme l'ancrage de l'événement : une affluence grandissante et une mobilisation internationale autour de la Prière sur le Prophète ﷺ.",
  },
  {
    year: "2025",
    date: "13 décembre",
    icon: <FaStar />,
    title: "3ᵉ édition de la Journée Salaatu",
    text: "La troisième édition rassemble une oumma toujours plus large, unie par la prière collective sur le Prophète Muhammad ﷺ, à Touba et à travers le monde.",
  },
];

const VALUES = [
  {
    title: "Centralité du Prophète ﷺ",
    text: "Toute notre activité gravite autour de la prière sur le Prophète Muhammad ﷺ. C'est notre boussole et notre identité.",
  },
  {
    title: "Culte collectif",
    text: "L'Islam place le groupe au cœur de la spiritualité. Le Dahira incarne cette dimension : multiplier l'effort individuel par la baraka du groupe.",
  },
  {
    title: "Rayonnement international",
    text: "Depuis Touba, capitale spirituelle, vers les cinq continents. Une oumma sans frontières unie par le Salaatu.",
  },
  {
    title: "Modernité au service du sacré",
    text: "Application mobile, site web, compteurs live — la technologie ne remplace pas la spiritualité, elle la sert et la diffuse.",
  },
];

export default function NotreHistoirePage() {
  return (
    <>
      <PageHero
        overline="Notre histoire"
        title="De Touba au monde, depuis 2021"
        arabic="تاريخنا في خدمة الصلاة على النبي ﷺ"
        description="L'histoire du Dahira Kippangog Salaatu ʿAlaa Nabii : un cercle de fidèles devenu un mouvement spirituel international, animé par une seule intention — multiplier les prières sur le Prophète Muhammad ﷺ à travers le monde."
      />

      {/* ORIGINES */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14">
          <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
            Les origines
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
            Une vision née à Touba
          </h2>

          <div className="mt-8 space-y-5 text-gray-700 leading-7 sm:leading-8 text-sm sm:text-base">
            <p>
              <strong>Le 2 janvier 2021</strong>, à Touba, capitale spirituelle
              de la voie mouride et terre du Cheikh Ahmadou Bamba (qu&apos;Allah
              l&apos;agrée), un cercle de fidèles s&apos;est constitué autour
              d&apos;une conviction simple : la prière sur le Prophète Muhammad
              ﷺ ne doit pas rester un acte solitaire — elle doit devenir
              <em> un mouvement collectif, structuré et international</em>.
            </p>
            <p>
              De cette intention est né le Dahira{" "}
              <strong>{SITE.fullName}</strong>, dont le nom même proclame la
              mission : <em>Kippangog</em> (rassembler, unir) +{" "}
              <em>Salaatu ʿAlaa Nabii</em> (prière sur le Prophète ﷺ).
            </p>
            <p>
              Cinq ans plus tard, le Dahira rassemble des milliers de membres à
              travers l&apos;Afrique, l&apos;Europe, l&apos;Amérique et
              l&apos;Asie — tous unis dans un même geste quotidien : la
              récitation du Salaatu sur le Sceau des Prophètes ﷺ.
            </p>
          </div>

          {/* Quelques chiffres */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { value: "5", label: "ans d'existence" },
              { value: "4 300+", label: "membres actifs" },
              { value: "5", label: "continents" },
              { value: "1 Md", label: "Salaatu visés" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-[#F8F5EF] rounded-2xl p-4 sm:p-5 text-center"
              >
                <div className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-[#0F7C55] tabular-nums">
                  {s.value}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-gray-600 font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="text-center mb-10 sm:mb-14">
          <span className="uppercase tracking-[0.25em] text-[#D4AF37] font-semibold text-xs sm:text-sm">
            Les grandes étapes
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Les jalons de notre histoire
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto text-sm sm:text-base">
            Une trajectoire qui passe du local au global, du papier au
            numérique, du cercle fondateur à la communauté internationale.
          </p>
        </div>

        {/* Timeline rail */}
        <div className="relative">
          {/* Ligne verticale */}
          <div className="absolute left-7 sm:left-1/2 top-0 bottom-0 w-px bg-[#D4AF37]/30 sm:-translate-x-1/2" />

          <div className="space-y-6 sm:space-y-10">
            {MILESTONES.map((m, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={m.title}
                  className={`relative flex sm:items-center gap-4 sm:gap-8 ${
                    isEven ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Bulle icone sur le rail */}
                  <div className="relative z-10 flex-shrink-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-xl border-2 ${
                        m.isFuture
                          ? "bg-gradient-to-br from-[#B8860B] to-[#D4AF37] text-[#0F7C55] border-[#F5D76E] animate-pulse"
                          : "bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] text-[#D4AF37] border-[#D4AF37]/40"
                      }`}
                    >
                      {m.icon}
                    </div>
                  </div>

                  {/* Carte */}
                  <div className="flex-1 sm:w-[calc(50%-3rem)] sm:max-w-[calc(50%-3rem)]">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 hover:bg-white/10 transition">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-display text-2xl sm:text-3xl font-black text-[#D4AF37] tabular-nums leading-none">
                          {m.year}
                        </span>
                        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/50 font-bold pt-1">
                          {m.date}
                        </span>
                        {m.isFuture && (
                          <span className="ml-auto text-[9px] sm:text-[10px] uppercase tracking-widest bg-[#D4AF37] text-[#0F7C55] px-2 py-0.5 rounded-full font-black">
                            À venir
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                        {m.title}
                      </h3>
                      <p className="mt-2 text-white/70 text-sm sm:text-base leading-6 sm:leading-7">
                        {m.text}
                      </p>
                    </div>
                  </div>

                  {/* Espacement cote oppose pour aligner avec rail vertical */}
                  <div className="hidden sm:block sm:flex-1" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NOS VALEURS */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14">
          <div className="text-center mb-10 sm:mb-12">
            <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
              Nos valeurs
            </span>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
              Ce qui nous guide
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            {VALUES.map((v, i) => (
              <div
                key={v.title}
                className="bg-[#F8F5EF] rounded-2xl sm:rounded-3xl p-6 sm:p-7"
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-display text-3xl sm:text-4xl font-black text-[#D4AF37]/40 tabular-nums leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#0F7C55]">
                    {v.title}
                  </h3>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-6 sm:leading-7">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CITATION SPIRITUELLE */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[45px] bg-gradient-to-br from-[#0F7C55] via-[#0A3D24] to-[#082F22] p-6 sm:p-12 md:p-14 text-white text-center">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <p
              className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose text-[#D4AF37]"
              dir="rtl"
            >
              مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا
            </p>
            <p className="mt-6 italic text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
              « Celui qui prie sur moi une fois, Allah prie sur lui dix fois. »
            </p>
            <p className="mt-3 text-xs sm:text-sm text-[#D4AF37]/90">
              — Le Prophète Muhammad ﷺ (rapporté par Muslim)
            </p>
            <p className="mt-6 sm:mt-8 max-w-2xl mx-auto text-sm sm:text-base text-white/80 leading-7">
              Voilà la promesse divine qui anime chaque jour le Dahira KSN
              depuis 2021. Multiplier ces moments, les coordonner à l&apos;échelle
              de la oumma, les rendre accessibles à tous — voilà notre mission
              hier, aujourd&apos;hui et demain.
            </p>
          </div>
        </div>
      </section>

      {/* CTAs FINAUX */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-[#0F7C55] text-2xl mb-5">
            <FaHandHoldingHeart />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F7C55]">
            Écrire la suite avec nous
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            L&apos;histoire du Dahira KSN s&apos;écrit chaque jour, avec chaque
            nouveau membre, chaque nouveau Salaatu. Rejoignez le mouvement.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] px-6 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition text-sm sm:text-base"
            >
              Devenir membre →
            </Link>
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#0F7C55] hover:bg-[#0A3D24] text-white px-6 py-4 rounded-2xl font-bold shadow-xl transition text-sm sm:text-base"
            >
              <FaWhatsapp /> Nous contacter
            </a>
          </div>

          <div className="mt-6 flex justify-center">
            <ShareButton
              title="L'histoire du Dahira KSN depuis 2021"
              text="Comment un cercle de fidèles à Touba est devenu un Dahira international au service de la Prière sur le Prophète ﷺ."
              variant="ghost"
              label="Partager notre histoire"
            />
          </div>
        </div>
      </section>
    </>
  );
}
