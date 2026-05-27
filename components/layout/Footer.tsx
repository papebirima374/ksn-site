"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa6";
import { LINKS, SITE } from "@/lib/constants";
import { useT } from "@/lib/i18n/context";

const SOCIALS = [
  { name: "Facebook", url: LINKS.facebook, Icon: FaFacebookF },
  { name: "Instagram", url: LINKS.instagram, Icon: FaInstagram },
  { name: "TikTok", url: LINKS.tiktok, Icon: FaTiktok },
  { name: "YouTube", url: LINKS.youtube, Icon: FaYoutube },
  { name: "Telegram", url: LINKS.telegram, Icon: FaTelegram },
  { name: "WhatsApp", url: LINKS.whatsapp, Icon: FaWhatsapp },
];

export default function Footer() {
  const { t } = useT();

  const navLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.dahira"), href: "/dahira" },
    { label: t("nav.spiritualite"), href: "/spiritualite" },
    { label: t("nav.media"), href: "/media" },
    { label: t("nav.boutique"), href: "/boutique" },
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#0B2E1F]/90 backdrop-blur-xl mt-16 sm:mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          <div>
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#D4AF37] flex-shrink-0">
                <Image
                  src="/logo/ksn-logo.png"
                  alt="KSN Logo"
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              <div>
                <h3 className="font-display text-2xl font-bold text-white">
                  {SITE.name}
                </h3>
                <p className="text-white/60 text-sm">{t("site.tagline")}</p>
              </div>
            </div>

            <p className="mt-5 text-white/70 leading-7 sm:leading-8 text-sm sm:text-base">
              {t("footer.mission_quote")}
            </p>
          </div>

          <div>
            <h4 className="text-[#D4AF37] font-bold text-base sm:text-lg">
              {t("footer.navigation")}
            </h4>
            <div className="mt-4 sm:mt-5 flex flex-col gap-2.5 sm:gap-3 text-white/70 text-sm sm:text-base">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-[#D4AF37] transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[#D4AF37] font-bold text-base sm:text-lg">
              {t("footer.contact")}
            </h4>
            <div className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3 text-white/70 text-sm sm:text-base">
              <p>📍 {t("site.location")}</p>
              <p>🌐 {SITE.domain}</p>
              <a
                href={LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#D4AF37] transition"
              >
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[#D4AF37] font-bold text-base sm:text-lg">
              {t("footer.suivez")}
            </h4>
            <div className="mt-4 sm:mt-5 grid grid-cols-3 gap-2">
              {SOCIALS.map((s) => {
                const Icon = s.Icon;
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    title={s.name}
                    className="aspect-square flex items-center justify-center rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-[#0F5132] text-white transition"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                );
              })}
            </div>

            <p className="mt-5 text-white/70 leading-7 italic text-xs sm:text-sm">
              {SITE.motto}
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 sm:mt-14 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-white/50 text-xs sm:text-sm text-center md:text-left">
            © 2021 - {new Date().getFullYear()} {SITE.fullName} ({SITE.name}).{" "}
            {t("footer.copyright")}
          </p>

          <p className="text-[#D4AF37] text-xs sm:text-sm">{SITE.domain}</p>
        </div>
      </div>
    </footer>
  );
}
