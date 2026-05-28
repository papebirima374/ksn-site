"use client";

import { FaUserTie, FaUsers, FaFileSignature, FaCoins } from "react-icons/fa6";

type MemberRole = {
  title: string;
  name: string;
  icon: React.ReactNode;
  description: string;
};

const DIRECTION: MemberRole[] = [
  {
    title: "Président d'Honneur",
    name: "Serigne Bassirou Touré",
    icon: <FaUserTie className="text-xl" />,
    description: "Guide spirituel moral, garant des valeurs et des orientations de la KSN.",
  },
  {
    title: "Président & Fondateur",
    name: "Serigne Birima Gueye",
    icon: <FaUserTie className="text-xl" />,
    description: "Fondateur et directeur exécutif, gère la coordination générale internationale.",
  },
];

const SECRETARIAT: MemberRole[] = [
  {
    title: "Secrétaire Général",
    name: "Poste à pourvoir / Éditable",
    icon: <FaFileSignature className="text-lg" />,
    description: "Gère l'administration, la correspondance officielle et l'archivage.",
  },
  {
    title: "Secrétaire Général Adjoint",
    name: "Poste à pourvoir / Éditable",
    icon: <FaFileSignature className="text-lg" />,
    description: "Assiste le Secrétaire Général dans toutes les tâches administratives.",
  },
  {
    title: "Trésorier Général",
    name: "Poste à pourvoir / Éditable",
    icon: <FaCoins className="text-lg" />,
    description: "Gère le patrimoine financier du Dahira et présente les bilans comptables.",
  },
  {
    title: "Trésorier Général Adjoint",
    name: "Poste à pourvoir / Éditable",
    icon: <FaCoins className="text-lg" />,
    description: "Seconde le trésorier dans les flux financiers et la comptabilité courante.",
  },
];

const COMMISSIONS: MemberRole[] = [
  {
    title: "Commission Administrative",
    name: "Chef de commission",
    icon: <FaUsers className="text-lg" />,
    description: "Gère le registre des membres, les inscriptions, la validation des profils et cartes.",
  },
  {
    title: "Commission Finances & Logistique",
    name: "Chef de commission",
    icon: <FaUsers className="text-lg" />,
    description: "Responsable de la boutique, de la gestion des stocks et de la logistique d'approvisionnement.",
  },
  {
    title: "Commission Culturelle & Éducation",
    name: "Chef de commission",
    icon: <FaUsers className="text-lg" />,
    description: "Gère l'apprentissage des prières, la bibliothèque spirituelle des Salaats et les conférences.",
  },
  {
    title: "Commission Communication & Médias",
    name: "Chef de commission",
    icon: <FaUsers className="text-lg" />,
    description: "Gère les réseaux sociaux du Dahira, le site web, le matériel audiovisuel et les flux en direct.",
  },
  {
    title: "Commission Organisation",
    name: "Chef de commission",
    icon: <FaUsers className="text-lg" />,
    description: "Gère la préparation logistique des grands événements et la gestion du public.",
  },
  {
    title: "Commission Sociale & Solidarité",
    name: "Chef de commission",
    icon: <FaUsers className="text-lg" />,
    description: "Assure l'entraide sociale entre les membres, la solidarité communautaire et les actions caritatives.",
  },
];

export default function OrganigrammeBureau() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-white rounded-[28px] sm:rounded-[40px] p-6 sm:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[#B8860B] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-semibold text-xs sm:text-sm">
            Gouvernance
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
            Organigramme du Bureau KSN
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Découvrez la structure hiérarchique et fonctionnelle des 12 postes officiels qui composent l&apos;administration internationale de notre Dahira.
          </p>
        </div>

        {/* NIVEAU 1 : DIRECTION SPIRITUELLE */}
        <div className="space-y-6">
          <h3 className="text-center font-display text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B8860B] mb-6 flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]/40" />
            Direction Spirituelle & Fondateurs
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]/40" />
          </h3>
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
            {DIRECTION.map((role) => (
              <div
                key={role.title}
                className="bg-[#F8F5EF] rounded-2xl p-6 border border-[#0F7C55]/10 hover:border-[#D4AF37]/40 hover:shadow-md transition duration-300 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0F7C55] text-[#D4AF37] flex items-center justify-center flex-shrink-0">
                  {role.icon}
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#B8860B] uppercase tracking-wider">
                    {role.title}
                  </h4>
                  <p className="font-display text-lg font-bold text-[#0F7C55] mt-1">
                    {role.name}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NIVEAU 2 : SECRETARIAT & TRESORERIE */}
        <div className="mt-12 sm:mt-16 space-y-6">
          <h3 className="text-center font-display text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B8860B] mb-6 flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]/40" />
            Secrétariat Général & Trésorerie
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]/40" />
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SECRETARIAT.map((role) => (
              <div
                key={role.title}
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#0F7C55]/20 hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#0F7C55]/10 text-[#0F7C55] flex items-center justify-center mb-3">
                    {role.icon}
                  </div>
                  <h4 className="font-display font-bold text-xs text-gray-400 uppercase tracking-wider">
                    {role.title}
                  </h4>
                  <p className="font-display text-base font-bold text-[#0F7C55] mt-1">
                    {role.name}
                  </p>
                </div>
                <p className="text-gray-600 text-xs mt-3 leading-relaxed border-t border-gray-50 pt-3">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* NIVEAU 3 : LES COMMISSIONS SPECIFIQUE */}
        <div className="mt-12 sm:mt-16 space-y-6">
          <h3 className="text-center font-display text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B8860B] mb-6 flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]/40" />
            Commissions Spécialisées
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]/40" />
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMMISSIONS.map((role) => (
              <div
                key={role.title}
                className="bg-[#FAF8F3]/50 rounded-2xl p-5 border border-[#0F7C55]/5 hover:border-[#0F7C55]/15 hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center mb-3">
                    {role.icon}
                  </div>
                  <h4 className="font-display font-bold text-xs text-[#B8860B] uppercase tracking-wider">
                    {role.title}
                  </h4>
                  <p className="font-display text-base font-bold text-[#0F7C55] mt-1">
                    {role.name}
                  </p>
                </div>
                <p className="text-gray-600 text-xs mt-3 leading-relaxed border-t border-gray-100/50 pt-3">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
