/**
 * Dispatcher d'illustrations pour les leçons.
 *
 * Stratégie hybride :
 *  - Diagrammes pédagogiques pré-construits (SVG inline) déclenchés
 *    automatiquement quand la leçon traite d'un sujet visuel connu
 *    (référence "2.2" → Wudu, "2.3" → Tayammum…).
 *  - Images uploadées via l'admin (champ `illustrations` sur la leçon)
 *    rendues en galerie en dessous.
 */
import type { EducationLesson } from "@/lib/admin-types";
import WuduStepsDiagram from "./WuduStepsDiagram";
import {
  PiliersIslamDiagram,
  PiliersImanDiagram,
  GhuslStepsDiagram,
  TayammumStepsDiagram,
  CinqPrieresDiagram,
  HajjDiagram,
} from "./LessonDiagrams";

type Props = {
  lesson: EducationLesson;
};

export default function LessonIllustrations({ lesson }: Props) {
  const ref = lesson.reference;

  // 1. Diagramme pré-construit selon la référence
  const BuiltIn = (() => {
    switch (ref) {
      case "1.1":
        return PiliersIslamDiagram;
      case "1.2":
        return PiliersImanDiagram;
      case "2.2":
        return WuduStepsDiagram;
      case "2.3":
        return GhuslStepsDiagram;
      case "2.4":
        return TayammumStepsDiagram;
      case "3.1":
        return CinqPrieresDiagram;
      case "4.4":
        return HajjDiagram;
      default:
        return null;
    }
  })();

  const uploaded = lesson.illustrations || [];

  if (!BuiltIn && uploaded.length === 0) return null;

  return (
    <>
      {BuiltIn && <BuiltIn />}

      {uploaded.length > 0 && (
        <section className="my-8" aria-label="Illustrations de la leçon">
          <div className="text-center mb-5">
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#C9A961] font-black">
              Illustrations
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {uploaded.map((ill) => (
              <figure
                key={ill.url}
                className="edu-card rounded-2xl overflow-hidden"
              >
                <div className="relative w-full aspect-video bg-[#1A1611]/5">
                  {/* Note: Next/Image requires whitelisted hostnames. Pour
                   *  Firebase Storage qui sert toutes les images, on
                   *  utilise un <img> simple en désactivant le drag. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ill.url}
                    alt={ill.alt || ill.caption || "Illustration"}
                    className="w-full h-full object-contain select-none pointer-events-none"
                    draggable={false}
                  />
                </div>
                {ill.caption && (
                  <figcaption className="p-3 text-xs sm:text-sm text-[#1A1611]/80 italic text-center">
                    {ill.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

// Re-export type pour ergonomie côté admin
export type LessonIllustration = NonNullable<
  EducationLesson["illustrations"]
>[number];
