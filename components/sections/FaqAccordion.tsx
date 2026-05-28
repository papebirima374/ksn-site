"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

type FaqItem = { q: string; a: string };

/** Accordion FAQ avec ouverture/fermeture animee + accessibilite ARIA.
 *  Une seule question ouverte a la fois (UX classique des FAQ). */
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((it, i) => {
        const isOpen = openIdx === i;
        return (
          <div
            key={i}
            className={`bg-white/5 backdrop-blur-md border rounded-2xl sm:rounded-3xl overflow-hidden transition-colors ${
              isOpen
                ? "border-[#D4AF37]/40 bg-white/10"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              className="w-full flex items-start justify-between gap-4 p-5 sm:p-6 text-left"
            >
              <span className="font-semibold text-white text-sm sm:text-base leading-snug">
                {it.q}
              </span>
              <FaChevronDown
                className={`text-[#D4AF37] text-sm sm:text-base mt-1 flex-shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              id={`faq-panel-${i}`}
              role="region"
              className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
                isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-white/80 text-sm sm:text-base leading-7 border-t border-white/10 pt-4">
                {it.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
