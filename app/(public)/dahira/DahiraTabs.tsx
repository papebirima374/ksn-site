"use client";

import { useRef, useState } from "react";
import {
  FaUserTie,
  FaBuildingColumns,
  FaSitemap,
  FaPeopleGroup,
  FaFileArrowDown,
} from "react-icons/fa6";
import Commissions from "@/components/sections/Commissions";
import LeDahira from "@/components/sections/LeDahira";
import Presidence from "@/components/sections/Presidence";
import MotDuPresident from "@/components/sections/MotDuPresident";
import OrganigrammeBureau from "@/components/sections/OrganigrammeBureau";
import DocumentsTelechargement from "@/components/sections/DocumentsTelechargement";
import { useT } from "@/lib/i18n/context";

// La page Dahira empilait 7 sections — trop longue à défiler.
// On groupe le contenu en onglets : une seule section visible à la fois.
const TABS = [
  { id: "presidence", labelKey: "dahiratabs.presidence", icon: <FaUserTie /> },
  { id: "dahira", labelKey: "dahiratabs.dahira", icon: <FaBuildingColumns /> },
  { id: "organigramme", labelKey: "dahiratabs.organigramme", icon: <FaSitemap /> },
  { id: "commissions", labelKey: "dahiratabs.commissions", icon: <FaPeopleGroup /> },
  { id: "documents", labelKey: "dahiratabs.documents", icon: <FaFileArrowDown /> },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function DahiraTabs() {
  const { t } = useT();
  const [active, setActive] = useState<TabId>("presidence");
  const topRef = useRef<HTMLDivElement>(null);

  const select = (id: TabId) => {
    setActive(id);
    // Ramène l'utilisateur en haut du contenu de l'onglet
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
            {TABS.map((tab) => (
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
                <span className="text-sm">{tab.icon}</span>
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENU DE L'ONGLET ACTIF */}
      {active === "presidence" && (
        <div className="animate-fadeIn">
          <Presidence />
          <MotDuPresident />
        </div>
      )}
      {active === "dahira" && (
        <div className="animate-fadeIn">
          <LeDahira />
        </div>
      )}
      {active === "organigramme" && (
        <div className="animate-fadeIn">
          <OrganigrammeBureau />
        </div>
      )}
      {active === "commissions" && (
        <div className="animate-fadeIn">
          <Commissions />
        </div>
      )}
      {active === "documents" && (
        <div className="animate-fadeIn">
          <DocumentsTelechargement />
        </div>
      )}
    </div>
  );
}
