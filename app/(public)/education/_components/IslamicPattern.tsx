/**
 * Motifs SVG islamiques — direction artistique Éducation
 *
 * 3 variants :
 *  - "star8"  : étoile à 8 branches (motif marocain / zellige) — utilisée sur la hub des modules
 *  - "arabesque" : arabesque florale stylisée — utilisée dans les leçons (corps de lecture)
 *  - "hex"    : géométrie hexagonale — utilisée sur la bibliothèque / pages secondaires
 *
 * Rendus en arrière-plan via <pattern> SVG plein-écran, opacité 5–8 %.
 * Aucun script, purement décoratif (aria-hidden).
 */
import React from "react";

type Variant = "star8" | "arabesque" | "hex";

type Props = {
  variant?: Variant;
  /** Opacité globale (0 → 1). Défaut 0.06 (6 %). */
  opacity?: number;
  /** Couleur du trait. Défaut or muté. */
  color?: string;
  className?: string;
};

export default function IslamicPattern({
  variant = "star8",
  opacity = 0.06,
  color = "#C9A961",
  className = "",
}: Props) {
  const id = React.useId();

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {variant === "star8" && (
          <pattern
            id={`p-${id}`}
            x="0"
            y="0"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            {/* Étoile à 8 branches — composée de 2 carrés superposés à 45° */}
            <g
              fill="none"
              stroke={color}
              strokeWidth="1.2"
              strokeLinejoin="round"
            >
              <rect x="20" y="20" width="80" height="80" />
              <rect
                x="20"
                y="20"
                width="80"
                height="80"
                transform="rotate(45 60 60)"
              />
              <circle cx="60" cy="60" r="8" />
              {/* petites étoiles d'angle */}
              <circle cx="0" cy="0" r="3" />
              <circle cx="120" cy="0" r="3" />
              <circle cx="0" cy="120" r="3" />
              <circle cx="120" cy="120" r="3" />
            </g>
          </pattern>
        )}

        {variant === "arabesque" && (
          <pattern
            id={`p-${id}`}
            x="0"
            y="0"
            width="160"
            height="160"
            patternUnits="userSpaceOnUse"
          >
            {/* Arabesque florale stylisée : 4 pétales + tige courbée */}
            <g fill="none" stroke={color} strokeWidth="1" strokeLinecap="round">
              <path d="M80 20 C 100 50, 100 70, 80 80 C 60 70, 60 50, 80 20 Z" />
              <path d="M80 140 C 100 110, 100 90, 80 80 C 60 90, 60 110, 80 140 Z" />
              <path d="M20 80 C 50 60, 70 60, 80 80 C 70 100, 50 100, 20 80 Z" />
              <path d="M140 80 C 110 60, 90 60, 80 80 C 90 100, 110 100, 140 80 Z" />
              <circle cx="80" cy="80" r="3" fill={color} />
              {/* feuilles d'angle */}
              <path d="M0 0 Q 20 10, 20 20 Q 10 20, 0 0 Z" />
              <path d="M160 0 Q 140 10, 140 20 Q 150 20, 160 0 Z" />
              <path d="M0 160 Q 20 150, 20 140 Q 10 140, 0 160 Z" />
              <path d="M160 160 Q 140 150, 140 140 Q 150 140, 160 160 Z" />
            </g>
          </pattern>
        )}

        {variant === "hex" && (
          <pattern
            id={`p-${id}`}
            x="0"
            y="0"
            width="60"
            height="52"
            patternUnits="userSpaceOnUse"
          >
            {/* Pavage hexagonal — un hex centré + 2 demi-hex sur les côtés */}
            <g fill="none" stroke={color} strokeWidth="1">
              <polygon points="30,2 56,16 56,42 30,56 4,42 4,16" />
            </g>
          </pattern>
        )}
      </defs>
      <rect width="100%" height="100%" fill={`url(#p-${id})`} />
    </svg>
  );
}
