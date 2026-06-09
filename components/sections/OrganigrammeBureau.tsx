"use client";

import { FaUserTie, FaUsers, FaFileSignature, FaCoins } from "react-icons/fa6";
import { useT } from "@/lib/i18n/context";

type MemberRole = {
  titleKey: string;
  name?: string;
  nameKey?: string;
  icon: React.ReactNode;
  descKey: string;
};

const DIRECTION: MemberRole[] = [
  {
    titleKey: "presidence.p1_role",
    name: "Serigne Bassirou Touré",
    icon: <FaUserTie className="text-xl" />,
    descKey: "organigramme.dir1_desc",
  },
  {
    titleKey: "presidence.p2_role",
    name: "Serigne Birima Gueye",
    icon: <FaUserTie className="text-xl" />,
    descKey: "organigramme.dir2_desc",
  },
];

const SECRETARIAT: MemberRole[] = [
  { titleKey: "organigramme.sec1_title", nameKey: "organigramme.vacant", icon: <FaFileSignature className="text-lg" />, descKey: "organigramme.sec1_desc" },
  { titleKey: "organigramme.sec2_title", nameKey: "organigramme.vacant", icon: <FaFileSignature className="text-lg" />, descKey: "organigramme.sec2_desc" },
  { titleKey: "organigramme.sec3_title", nameKey: "organigramme.vacant", icon: <FaCoins className="text-lg" />, descKey: "organigramme.sec3_desc" },
  { titleKey: "organigramme.sec4_title", nameKey: "organigramme.vacant", icon: <FaCoins className="text-lg" />, descKey: "organigramme.sec4_desc" },
];

const COMMISSIONS: MemberRole[] = [
  { titleKey: "organigramme.com1_title", nameKey: "organigramme.commission_chief", icon: <FaUsers className="text-lg" />, descKey: "organigramme.com1_desc" },
  { titleKey: "organigramme.com2_title", nameKey: "organigramme.commission_chief", icon: <FaUsers className="text-lg" />, descKey: "organigramme.com2_desc" },
  { titleKey: "organigramme.com3_title", nameKey: "organigramme.commission_chief", icon: <FaUsers className="text-lg" />, descKey: "organigramme.com3_desc" },
  { titleKey: "organigramme.com4_title", nameKey: "organigramme.commission_chief", icon: <FaUsers className="text-lg" />, descKey: "organigramme.com4_desc" },
  { titleKey: "organigramme.com5_title", nameKey: "organigramme.commission_chief", icon: <FaUsers className="text-lg" />, descKey: "organigramme.com5_desc" },
  { titleKey: "organigramme.com6_title", nameKey: "organigramme.commission_chief", icon: <FaUsers className="text-lg" />, descKey: "organigramme.com6_desc" },
];

export default function OrganigrammeBureau() {
  const { t } = useT();
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-white rounded-[28px] sm:rounded-[40px] p-6 sm:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[#B8860B] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-semibold text-xs sm:text-sm">
            {t("organigramme.overline")}
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
            {t("organigramme.title")}
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {t("organigramme.intro")}
          </p>
        </div>

        {/* NIVEAU 1 : DIRECTION SPIRITUELLE */}
        <div className="space-y-6">
          <h3 className="text-center font-display text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B8860B] mb-6 flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]/40" />
            {t("organigramme.level1")}
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]/40" />
          </h3>
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
            {DIRECTION.map((role) => (
              <div
                key={role.titleKey}
                className="bg-[#F8F5EF] rounded-2xl p-6 border border-[#0F7C55]/10 hover:border-[#D4AF37]/40 hover:shadow-md transition duration-300 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0F7C55] text-[#D4AF37] flex items-center justify-center flex-shrink-0">
                  {role.icon}
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#B8860B] uppercase tracking-wider">
                    {t(role.titleKey)}
                  </h4>
                  <p className="font-display text-lg font-bold text-[#0F7C55] mt-1">
                    {role.nameKey ? t(role.nameKey) : role.name}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    {t(role.descKey)}
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
            {t("organigramme.level2")}
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]/40" />
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SECRETARIAT.map((role) => (
              <div
                key={role.titleKey}
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#0F7C55]/20 hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#0F7C55]/10 text-[#0F7C55] flex items-center justify-center mb-3">
                    {role.icon}
                  </div>
                  <h4 className="font-display font-bold text-xs text-gray-400 uppercase tracking-wider">
                    {t(role.titleKey)}
                  </h4>
                  <p className="font-display text-base font-bold text-[#0F7C55] mt-1">
                    {role.nameKey ? t(role.nameKey) : role.name}
                  </p>
                </div>
                <p className="text-gray-600 text-xs mt-3 leading-relaxed border-t border-gray-50 pt-3">
                  {t(role.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* NIVEAU 3 : LES COMMISSIONS SPECIFIQUE */}
        <div className="mt-12 sm:mt-16 space-y-6">
          <h3 className="text-center font-display text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B8860B] mb-6 flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]/40" />
            {t("organigramme.level3")}
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]/40" />
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMMISSIONS.map((role) => (
              <div
                key={role.titleKey}
                className="bg-[#FAF8F3]/50 rounded-2xl p-5 border border-[#0F7C55]/5 hover:border-[#0F7C55]/15 hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center mb-3">
                    {role.icon}
                  </div>
                  <h4 className="font-display font-bold text-xs text-[#B8860B] uppercase tracking-wider">
                    {t(role.titleKey)}
                  </h4>
                  <p className="font-display text-base font-bold text-[#0F7C55] mt-1">
                    {role.nameKey ? t(role.nameKey) : role.name}
                  </p>
                </div>
                <p className="text-gray-600 text-xs mt-3 leading-relaxed border-t border-gray-100/50 pt-3">
                  {t(role.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
