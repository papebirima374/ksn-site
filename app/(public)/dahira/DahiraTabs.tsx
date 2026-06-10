"use client";

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
import SectionTabs from "@/components/ui/SectionTabs";

// La page Dahira empilait 7 sections — trop longue à défiler.
// On groupe le contenu en onglets : une seule section visible à la fois.
const TABS = [
  { id: "presidence", labelKey: "dahiratabs.presidence", icon: <FaUserTie /> },
  { id: "dahira", labelKey: "dahiratabs.dahira", icon: <FaBuildingColumns /> },
  { id: "organigramme", labelKey: "dahiratabs.organigramme", icon: <FaSitemap /> },
  { id: "commissions", labelKey: "dahiratabs.commissions", icon: <FaPeopleGroup /> },
  { id: "documents", labelKey: "dahiratabs.documents", icon: <FaFileArrowDown /> },
];

export default function DahiraTabs() {
  return (
    <SectionTabs
      tabs={TABS}
      renderPanel={(id) => (
        <>
          {id === "presidence" && (
            <>
              <Presidence />
              <MotDuPresident />
            </>
          )}
          {id === "dahira" && <LeDahira />}
          {id === "organigramme" && <OrganigrammeBureau />}
          {id === "commissions" && <Commissions />}
          {id === "documents" && <DocumentsTelechargement />}
        </>
      )}
    />
  );
}
