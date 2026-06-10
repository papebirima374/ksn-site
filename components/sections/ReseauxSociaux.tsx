"use client";

import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa6";
import { LINKS } from "@/lib/constants";
import { useT } from "@/lib/i18n/context";

const SOCIALS = [
  { Icon: FaFacebookF, title: "Facebook", textKey: "social.facebook", href: LINKS.facebook },
  { Icon: FaYoutube, title: "YouTube", textKey: "social.youtube", href: LINKS.youtube },
  { Icon: FaTiktok, title: "TikTok", textKey: "social.tiktok", href: LINKS.tiktok },
  { Icon: FaInstagram, title: "Instagram", textKey: "social.instagram", href: LINKS.instagram },
  { Icon: FaTelegram, title: "Telegram", textKey: "social.telegram", href: LINKS.telegram },
];

export default function ReseauxSociaux() {
  const { t } = useT();

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-16">
        <div className="text-center">
          <span className="uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
            {t("section.communaute_digitale")}
          </span>

          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
            {t("section.suivez_partout")}
          </h2>

          <p className="mt-4 sm:mt-6 text-gray-600 max-w-3xl mx-auto leading-7 sm:leading-8 text-sm sm:text-base">
            {t("social.desc")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 mt-10 sm:mt-16">
          {SOCIALS.map((s) => {
            const Icon = s.Icon;
            return (
              <a
                key={s.title}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F8F5EF] rounded-[24px] sm:rounded-[35px] p-6 sm:p-8 hover:-translate-y-2 duration-300 shadow-md transition"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] flex items-center justify-center text-white text-2xl sm:text-3xl">
                  <Icon />
                </div>
                <h3 className="font-display mt-4 sm:mt-5 text-xl sm:text-2xl font-bold text-[#0F7C55]">
                  {s.title}
                </h3>
                <p className="mt-3 sm:mt-4 text-gray-600 leading-6 sm:leading-7 text-sm sm:text-base">
                  {t(s.textKey)}
                </p>
              </a>
            );
          })}

          <a
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-[24px] sm:rounded-[35px] p-6 sm:p-8 hover:-translate-y-2 duration-300 shadow-md text-[#0F7C55] transition"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0F7C55] flex items-center justify-center text-white text-2xl sm:text-3xl">
              <FaWhatsapp />
            </div>
            <h3 className="font-display mt-4 sm:mt-5 text-xl sm:text-2xl font-bold">
              {t("social.wa_title")}
            </h3>
            <p className="mt-3 sm:mt-4 leading-6 sm:leading-7 text-sm sm:text-base">
              {t("social.wa_text")}
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
