"use client";

import { useRef, useState, type ReactNode } from "react";
import { useT } from "@/lib/i18n/context";

export type SectionTabDef = {
  id: string;
  labelKey: string;
  icon?: ReactNode;
};

type SectionTabsProps = {
  tabs: SectionTabDef[];
  /** Rend le contenu de l'onglet actif */
  renderPanel: (activeId: string) => ReactNode;
};

/** Barre d'onglets sticky (sous la navbar) qui n'affiche qu'une section à la
 *  fois — évite les pages interminables à défiler. Utilisée sur Dahira,
 *  Journée, Spiritualité, Média, Notre Histoire et Challenge. */
export default function SectionTabs({ tabs, renderPanel }: SectionTabsProps) {
  const { t } = useT();
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const topRef = useRef<HTMLDivElement>(null);

  const select = (id: string) => {
    setActive(id);
    requestAnimationFrame(() => {
      const y = (topRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 100;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    });
  };

  return (
    <div ref={topRef}>
      {/* BARRE D'ONGLETS — sticky sous la navbar */}
      <div className="sticky top-[86px] sm:top-[92px] z-30 px-4 sm:px-6 mb-10 sm:mb-12">
        <div className="max-w-4xl mx-auto bg-[#0A3D24]/90 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-2xl overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-1 min-w-max sm:justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => select(tab.id)}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                  active === tab.id
                    ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] shadow-lg"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.icon && <span className="text-sm">{tab.icon}</span>}
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENU DE L'ONGLET ACTIF */}
      <div key={active} className="animate-fadeIn">
        {renderPanel(active)}
      </div>
    </div>
  );
}
