/**
 * Diagramme pédagogique du Wudu (petite ablution) — étapes illustrées.
 *
 * Source doctrinale : Coran 5:6, Sunna prophétique (rapporté par Bukhârî et
 * Muslim, Sahih). Ordre conforme au madh-hab mâlikî / shâfi'î le plus suivi
 * dans la Mouridiyya.
 *
 * Les icônes sont des SVG inline (aucun appel externe) pour rester
 * parfaitement protégeables et imprimables.
 */
import React from "react";

type Step = {
  num: number;
  title: string;
  arabic: string;
  text: string;
  repeats: string;
  icon: React.ReactNode;
};

const STROKE = "#064E3B";

// petits pictogrammes SVG dessinés à la main, opacité douce, traits or muté
const I = {
  niya: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M32 12c-6 6-12 11-12 22a12 12 0 0024 0c0-11-6-16-12-22z" />
      <circle cx="32" cy="38" r="3" fill={STROKE} />
    </svg>
  ),
  hands: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M14 30c0-4 2-6 5-6h4l3-8c1-3 5-3 5 0v18" />
      <path d="M27 22c0-3 4-3 4 0v12" />
      <path d="M31 22c0-3 4-3 4 0v12" />
      <path d="M35 26c0-3 4-3 4 0v10" />
      <path d="M14 30c0 6 2 14 8 18l14-2c4-2 6-6 6-12" />
      <path d="M18 12c0 2 2 4 4 4M40 14c2 1 2 3 1 5" />
    </svg>
  ),
  mouth: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <ellipse cx="32" cy="32" rx="18" ry="8" />
      <path d="M20 32c2-3 6-4 12-4s10 1 12 4" />
      <path d="M22 36c4 2 16 2 20 0" />
      <path d="M40 14c-1 4-3 6-6 8M36 50c-1-3 1-5 3-7" />
    </svg>
  ),
  nose: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M32 16c-1 6-4 12-8 16 0 4 3 6 8 6s8-2 8-6c-4-4-7-10-8-16z" />
      <path d="M28 38c1 2 3 4 4 4s3-2 4-4" />
      <path d="M22 16c2 3 2 6 0 8M42 16c-2 3-2 6 0 8" />
    </svg>
  ),
  face: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <ellipse cx="32" cy="32" rx="14" ry="18" />
      <circle cx="26" cy="28" r="1.5" fill={STROKE} />
      <circle cx="38" cy="28" r="1.5" fill={STROKE} />
      <path d="M28 40c2 2 6 2 8 0" />
      <path d="M14 30c-3 0-3 6 0 8M50 30c3 0 3 6 0 8" />
    </svg>
  ),
  arms: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M14 50l10-26c1-3 6-3 7 0l3 8" />
      <path d="M24 24l8-2 4 4 4 16" />
      <circle cx="14" cy="50" r="3" fill={STROKE} />
      <path d="M50 12c-3 1-5 3-5 6M50 18c-2 0-4 2-4 4" />
    </svg>
  ),
  head: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M16 36c0-12 7-22 16-22s16 10 16 22" />
      <path d="M22 32c2-2 6-2 10-2s8 0 10 2" />
      <path d="M18 38c1 4 4 6 6 6M46 38c-1 4-4 6-6 6" />
      <path d="M30 22c-2-3 0-6 2-6s4 3 2 6" />
    </svg>
  ),
  ears: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M22 16c-6 2-10 8-10 14s4 12 10 14" />
      <path d="M22 22c-3 1-5 4-5 8s2 7 5 8" />
      <path d="M42 16c6 2 10 8 10 14s-4 12-10 14" />
      <path d="M42 22c3 1 5 4 5 8s-2 7-5 8" />
    </svg>
  ),
  feet: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M12 38c0-6 4-10 8-10s8 4 8 8v8H12z" />
      <path d="M14 30c1-2 3-3 5-3M16 26c1-1 2-1 3-1M18 22c1-1 2-1 2-1" />
      <path d="M36 38c0-6 4-10 8-10s8 4 8 8v8H36z" />
      <path d="M38 30c1-2 3-3 5-3M40 26c1-1 2-1 3-1M42 22c1-1 2-1 2-1" />
    </svg>
  ),
};

const STEPS: Step[] = [
  {
    num: 1,
    title: "L'intention (Niya)",
    arabic: "النية",
    text: "Formuler dans le cœur l'intention de purifier ses membres pour Allah avant la prière. Sans prononcer à voix haute.",
    repeats: "Une fois",
    icon: I.niya,
  },
  {
    num: 2,
    title: "Bismillah + lavage des mains",
    arabic: "غسل اليدين",
    text: "Dire « Bismillâh ». Laver les deux mains jusqu'aux poignets en passant l'eau entre les doigts.",
    repeats: "× 3",
    icon: I.hands,
  },
  {
    num: 3,
    title: "Rinçage de la bouche",
    arabic: "المضمضة",
    text: "Prendre de l'eau dans la main droite, la porter à la bouche, rincer puis recracher.",
    repeats: "× 3",
    icon: I.mouth,
  },
  {
    num: 4,
    title: "Aspiration nasale (Istinshâq)",
    arabic: "الاستنشاق",
    text: "Aspirer doucement l'eau par les narines avec la main droite, puis l'expulser avec la main gauche.",
    repeats: "× 3",
    icon: I.nose,
  },
  {
    num: 5,
    title: "Lavage du visage",
    arabic: "غسل الوجه",
    text: "Du haut du front jusqu'au bas du menton, et d'une oreille à l'autre. Frictionner avec les mains.",
    repeats: "× 3",
    icon: I.face,
  },
  {
    num: 6,
    title: "Lavage des bras",
    arabic: "غسل اليدين إلى المرفقين",
    text: "Bras DROIT d'abord, puis GAUCHE, jusqu'aux coudes inclus. Bien faire passer l'eau partout.",
    repeats: "× 3 (chaque bras)",
    icon: I.arms,
  },
  {
    num: 7,
    title: "Essuyage de la tête",
    arabic: "مسح الرأس",
    text: "Mouiller les mains, passer du front à la nuque en aller-retour, sans soulever les mains.",
    repeats: "Une fois",
    icon: I.head,
  },
  {
    num: 8,
    title: "Essuyage des oreilles",
    arabic: "مسح الأذنين",
    text: "Index dans l'oreille interne, pouce derrière l'oreille externe. Geste continu après la tête.",
    repeats: "Une fois",
    icon: I.ears,
  },
  {
    num: 9,
    title: "Lavage des pieds",
    arabic: "غسل الرجلين",
    text: "Pied DROIT d'abord, puis GAUCHE, jusqu'aux chevilles inclus, en passant entre les orteils.",
    repeats: "× 3 (chaque pied)",
    icon: I.feet,
  },
];

export default function WuduStepsDiagram() {
  return (
    <section className="my-8" aria-label="Étapes illustrées du Wudu">
      <div className="text-center mb-5">
        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#C9A961] font-black">
          Guide pratique illustré
        </p>
        <h3 className="edu-title text-xl sm:text-2xl font-bold mt-1">
          Les 9 étapes du Wudu, en images
        </h3>
        <p className="edu-prose text-xs sm:text-sm mt-2 max-w-md mx-auto mb-0">
          Suis l&apos;ordre. Chaque étape se fait calmement, en pleine
          conscience que tu te prépares à la rencontre divine.
        </p>
      </div>

      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {STEPS.map((s) => (
          <li
            key={s.num}
            className="edu-card rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center relative"
          >
            <span className="absolute top-3 left-3 w-7 h-7 rounded-full bg-gradient-to-br from-[#C9A961] to-[#E0C97D] text-[#064E3B] flex items-center justify-center text-xs font-black shadow-sm">
              {s.num}
            </span>
            <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider uppercase bg-[#064E3B]/10 text-[#064E3B] px-2 py-0.5 rounded-full">
              {s.repeats}
            </span>
            <div className="w-20 h-20 sm:w-24 sm:h-24 mt-6 mb-3 flex items-center justify-center">
              {s.icon}
            </div>
            <h4 className="edu-title font-bold text-sm sm:text-base leading-tight">
              {s.title}
            </h4>
            <p
              className="font-arabic text-[#C9A961] mt-1 text-base"
              dir="rtl"
            >
              {s.arabic}
            </p>
            <p className="edu-prose text-xs sm:text-[13px] mt-2 leading-5 mb-0">
              {s.text}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-5 bg-[#064E3B]/8 border border-[#064E3B]/20 rounded-2xl p-4 sm:p-5 text-center">
        <p className="text-[10px] uppercase tracking-widest text-[#C9A961] font-black mb-1">
          Rappel du Prophète ﷺ
        </p>
        <p className="edu-prose italic text-sm sm:text-base mb-0">
          « Celui qui fait correctement les ablutions, ses péchés sortent de
          son corps, jusqu&apos;à sortir de sous ses ongles. »
        </p>
        <p className="text-[11px] text-[#1A1611]/60 mt-1">— Sahih Muslim</p>
      </div>
    </section>
  );
}
