/**
 * Briques réutilisables pour les diagrammes pédagogiques des leçons.
 * Centralise le rendu d'une "étape illustrée" (icône SVG + texte arabe +
 * description + nombre de répétitions) et l'enveloppe de section.
 */
import React from "react";

export type DiagramStep = {
  num: number;
  title: string;
  arabic?: string;
  text: string;
  repeats?: string;
  icon: React.ReactNode;
  /** Mots-clés courts pour la dernière ligne (ex: "obligatoire"). */
  tag?: string;
};

export function StepCard({ step }: { step: DiagramStep }) {
  return (
    <li className="edu-card rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center relative">
      <span className="absolute top-3 left-3 w-7 h-7 rounded-full bg-gradient-to-br from-[#C9A961] to-[#E0C97D] text-[#064E3B] flex items-center justify-center text-xs font-black shadow-sm">
        {step.num}
      </span>
      {step.repeats && (
        <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider uppercase bg-[#064E3B]/10 text-[#064E3B] px-2 py-0.5 rounded-full">
          {step.repeats}
        </span>
      )}
      <div className="w-20 h-20 sm:w-24 sm:h-24 mt-6 mb-3 flex items-center justify-center">
        {step.icon}
      </div>
      <h4 className="edu-title font-bold text-sm sm:text-base leading-tight">
        {step.title}
      </h4>
      {step.arabic && (
        <p className="font-arabic text-[#C9A961] mt-1 text-base" dir="rtl">
          {step.arabic}
        </p>
      )}
      <p className="edu-prose text-xs sm:text-[13px] mt-2 leading-5 mb-0">
        {step.text}
      </p>
      {step.tag && (
        <span className="mt-3 text-[10px] uppercase tracking-widest text-[#6B2E2E] font-bold bg-[#6B2E2E]/8 px-2 py-0.5 rounded">
          {step.tag}
        </span>
      )}
    </li>
  );
}

export function DiagramSection({
  overline,
  title,
  intro,
  steps,
  conclusion,
  conclusionSource,
  columns = 3,
}: {
  overline: string;
  title: string;
  intro?: string;
  steps: DiagramStep[];
  conclusion?: string;
  conclusionSource?: string;
  /** 2 ou 3 colonnes en desktop. */
  columns?: 2 | 3;
}) {
  const cols =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  return (
    <section className="my-8" aria-label={title}>
      <div className="text-center mb-5">
        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#C9A961] font-black">
          {overline}
        </p>
        <h3 className="edu-title text-xl sm:text-2xl font-bold mt-1">
          {title}
        </h3>
        {intro && (
          <p className="edu-prose text-xs sm:text-sm mt-2 max-w-md mx-auto mb-0">
            {intro}
          </p>
        )}
      </div>

      <ol className={`grid ${cols} gap-3 sm:gap-4`}>
        {steps.map((s) => (
          <StepCard key={s.num} step={s} />
        ))}
      </ol>

      {conclusion && (
        <div className="mt-5 bg-[#064E3B]/8 border border-[#064E3B]/20 rounded-2xl p-4 sm:p-5 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#C9A961] font-black mb-1">
            Rappel
          </p>
          <p className="edu-prose italic text-sm sm:text-base mb-0">
            « {conclusion} »
          </p>
          {conclusionSource && (
            <p className="text-[11px] text-[#1A1611]/60 mt-1">
              — {conclusionSource}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

// ============ Pictogrammes SVG réutilisables ============
const STROKE = "#064E3B";
const ACCENT = "#C9A961";

export const Icons = {
  /** Coeur stylisé (intention / Niya) */
  niya: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M32 12c-6 6-12 11-12 22a12 12 0 0024 0c0-11-6-16-12-22z" />
      <circle cx="32" cy="38" r="3" fill={STROKE} />
    </svg>
  ),
  hands: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M14 30c0-4 2-6 5-6h4l3-8c1-3 5-3 5 0v18" />
      <path d="M27 22c0-3 4-3 4 0v12M31 22c0-3 4-3 4 0v12M35 26c0-3 4-3 4 0v10" />
      <path d="M14 30c0 6 2 14 8 18l14-2c4-2 6-6 6-12" />
    </svg>
  ),
  face: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <ellipse cx="32" cy="32" rx="14" ry="18" />
      <circle cx="26" cy="28" r="1.5" fill={STROKE} />
      <circle cx="38" cy="28" r="1.5" fill={STROKE} />
      <path d="M28 40c2 2 6 2 8 0" />
    </svg>
  ),
  arms: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M14 50l10-26c1-3 6-3 7 0l3 8" />
      <path d="M24 24l8-2 4 4 4 16" />
      <circle cx="14" cy="50" r="3" fill={STROKE} />
    </svg>
  ),
  feet: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M12 38c0-6 4-10 8-10s8 4 8 8v8H12z" />
      <path d="M36 38c0-6 4-10 8-10s8 4 8 8v8H36z" />
    </svg>
  ),
  head: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M16 36c0-12 7-22 16-22s16 10 16 22" />
      <path d="M22 32c2-2 6-2 10-2s8 0 10 2" />
    </svg>
  ),
  /** Goutte d'eau */
  water: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M32 8c-8 12-16 22-16 30a16 16 0 0032 0c0-8-8-18-16-30z" />
      <path d="M22 34c0 4 2 8 6 10" />
    </svg>
  ),
  /** Plein corps (douche complète) */
  body: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <circle cx="32" cy="14" r="6" />
      <path d="M24 26h16l-3 18-5 8-5-8z" />
      <path d="M22 30c-4 2-6 6-6 12M42 30c4 2 6 6 6 12" />
    </svg>
  ),
  /** Plante / tayammum (poussière, terre) */
  earth: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <ellipse cx="32" cy="44" rx="22" ry="6" />
      <path d="M14 44c4-3 8-4 18-4s14 1 18 4" />
      <circle cx="20" cy="38" r="2" fill={ACCENT} />
      <circle cx="42" cy="36" r="2" fill={ACCENT} />
      <circle cx="32" cy="34" r="2" fill={ACCENT} />
    </svg>
  ),
  /** Mosquée stylisée */
  mosque: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M32 8c0 4 4 6 4 10s-4 6-4 6-4-2-4-6 4-6 4-10z" fill={ACCENT} fillOpacity="0.3" />
      <path d="M14 32c0-8 8-12 18-12s18 4 18 12" />
      <rect x="14" y="32" width="36" height="22" />
      <path d="M14 32h36M22 54v-8h6v8M36 54v-8h6v8" />
      <rect x="28" y="36" width="8" height="10" rx="2" />
      <path d="M8 54v-16M56 54v-16" />
    </svg>
  ),
  /** Kaaba (cube simple + tissu) */
  kaaba: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <rect x="18" y="22" width="28" height="30" fill={STROKE} fillOpacity="0.85" />
      <rect x="18" y="34" width="28" height="3" fill={ACCENT} />
      <path d="M22 22V12M42 22V12" stroke={ACCENT} />
    </svg>
  ),
  /** Soleil */
  sun: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <circle cx="32" cy="32" r="10" fill={ACCENT} fillOpacity="0.4" />
      <path d="M32 12v6M32 46v6M12 32h6M46 32h6M18 18l4 4M42 42l4 4M46 18l-4 4M22 42l-4 4" strokeLinecap="round" />
    </svg>
  ),
  /** Lune croissant */
  moon: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M40 14c-12 0-22 10-22 22s10 22 22 22c-10 0-18-10-18-22s8-22 18-22z" fill={ACCENT} fillOpacity="0.3" />
      <circle cx="48" cy="14" r="2" fill={ACCENT} />
    </svg>
  ),
  /** Soleil bas (matin / soir) */
  sunrise: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M8 44h48" strokeLinecap="round" />
      <path d="M22 44a10 10 0 0120 0" fill={ACCENT} fillOpacity="0.4" />
      <path d="M32 24v6M14 32l4 4M50 32l-4 4" strokeLinecap="round" />
    </svg>
  ),
  /** Étoile à 8 branches */
  star8: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <rect x="14" y="14" width="36" height="36" />
      <rect x="14" y="14" width="36" height="36" transform="rotate(45 32 32)" />
      <circle cx="32" cy="32" r="4" fill={ACCENT} />
    </svg>
  ),
  /** Livre ouvert */
  book: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M8 16h22c4 0 4 4 4 4v32s0-4-4-4H8z" />
      <path d="M56 16H34c-4 0-4 4-4 4v32s0-4 4-4h22z" />
      <path d="M14 24h14M14 30h14M14 36h12M38 24h14M38 30h14M38 36h12" />
    </svg>
  ),
  /** Personne stylisée */
  person: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <circle cx="32" cy="16" r="6" />
      <path d="M22 50c0-10 4-22 10-22s10 12 10 22" />
    </svg>
  ),
  /** Étoile (générique) */
  star: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M32 8l7 16 17 2-13 11 4 17-15-9-15 9 4-17-13-11 17-2z" fill={ACCENT} fillOpacity="0.3" />
    </svg>
  ),
  /** Ange (silhouette + ailes) */
  angel: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <circle cx="32" cy="20" r="5" />
      <path d="M24 50c0-10 4-20 8-20s8 10 8 20" />
      <path d="M16 22c-6-2-12 4-8 14M48 22c6-2 12 4 8 14" />
    </svg>
  ),
  /** Calendrier / décret */
  scroll: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <rect x="14" y="14" width="36" height="36" rx="3" />
      <path d="M14 24h36M22 14v36M42 14v36" />
    </svg>
  ),
  /** Pièces / Zakat */
  coin: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <circle cx="32" cy="32" r="16" fill={ACCENT} fillOpacity="0.3" />
      <path d="M28 28v8M36 28v8M28 28h8M28 32h8M28 36h8" />
    </svg>
  ),
  /** Croissant lune (jeûne) */
  fasting: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M40 12c-12 0-22 9-22 20s10 20 22 20c-10 0-18-9-18-20s8-20 18-20z" fill={ACCENT} fillOpacity="0.3" />
      <circle cx="50" cy="22" r="2" fill={ACCENT} />
      <circle cx="52" cy="40" r="2" fill={ACCENT} />
    </svg>
  ),
  /** Doigt levé (Shahada) */
  shahada: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M28 12c0-3 4-3 4 0v24" />
      <path d="M20 36c-2 0-4 2-4 6v10h22c4 0 6-2 6-6V32c0-3-4-3-4 0v6h-4v-8c0-3-4-3-4 0v8h-4v-10c0-3-4-3-4 0v10z" />
    </svg>
  ),
  /** Posture Qiyam (debout) */
  qiyam: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <circle cx="32" cy="14" r="4" />
      <path d="M32 18v22M28 24l8 0M28 40v12M36 40v12" />
    </svg>
  ),
  /** Ruku (inclinaison) */
  ruku: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <circle cx="22" cy="22" r="4" />
      <path d="M22 26l16 6M22 26v18M32 44v8M38 32v6" />
    </svg>
  ),
  /** Sujud (prosternation) */
  sujud: (
    <svg viewBox="0 0 64 64" fill="none" stroke={STROKE} strokeWidth="2">
      <path d="M8 50h48" strokeLinecap="round" />
      <circle cx="20" cy="46" r="3" />
      <path d="M20 46l16-4 14-4M28 42l8 8" />
    </svg>
  ),
};
