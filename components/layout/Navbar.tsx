"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa6";
import { FaUser, FaRightToBracket } from "react-icons/fa6";
import { LINKS, SITE } from "@/lib/constants";
import { useT } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth-context";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const SOCIALS = [
  { name: "Facebook", url: LINKS.facebook, Icon: FaFacebookF },
  { name: "Instagram", url: LINKS.instagram, Icon: FaInstagram },
  { name: "TikTok", url: LINKS.tiktok, Icon: FaTiktok },
  { name: "YouTube", url: LINKS.youtube, Icon: FaYoutube },
  { name: "Telegram", url: LINKS.telegram, Icon: FaTelegram },
  { name: "WhatsApp", url: LINKS.whatsapp, Icon: FaWhatsapp },
];

export default function Navbar() {
  const { t } = useT();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const memberLabel =
    user?.memberStatus === "actif"
      ? "Mon Profil"
      : user
      ? "Mon Espace"
      : "Connexion";
  const memberInitials = user
    ? (user.displayName || user.email || "M")
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;

  const navItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.dahira"), href: "/dahira" },
    { label: t("nav.spiritualite"), href: "/spiritualite" },
    { label: t("nav.media"), href: "/media" },
    { label: "Challenge", href: "/challenge" },
    { label: t("nav.boutique"), href: "/boutique" },
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-[24px] sm:rounded-[30px] px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3 shadow-[0_10px_50px_rgba(0,0,0,0.35)]">

          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden bg-white shadow-xl flex-shrink-0">
              <Image
                src="/logo/ksn-logo.png"
                alt="KSN Logo"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 48px, (max-width: 1280px) 56px, 64px"
                priority
              />
            </div>

            <div className="hidden sm:block min-w-0">
              <h1 className="font-display text-white font-bold text-lg xl:text-2xl leading-tight whitespace-nowrap">
                {SITE.name}
              </h1>
              <p className="hidden xl:block text-white/60 text-xs tracking-wide whitespace-nowrap">
                {t("site.tagline")}
              </p>
              <p className="hidden xl:block text-[#D4AF37] text-[11px] mt-0.5 whitespace-nowrap">
                {t("site.motto")}
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-4 xl:gap-7 text-white font-medium text-sm xl:text-[15px]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-[#D4AF37] transition whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <LanguageSwitcher />

            {user ? (
              <Link
                href="/espace-membre/profil"
                className="hidden sm:inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold px-2.5 xl:px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition text-xs whitespace-nowrap"
                title={user.email}
              >
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-[#0F7C55] text-[10px] font-black">
                  {memberInitials}
                </span>
                <span className="hidden xl:inline">{memberLabel}</span>
              </Link>
            ) : (
              <Link
                href="/espace-membre"
                className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold px-2.5 xl:px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition text-xs whitespace-nowrap"
              >
                <FaRightToBracket className="text-[11px]" />
                <span className="hidden xl:inline">Connexion</span>
              </Link>
            )}

            <Link
              href="/don"
              className="hidden sm:inline-flex bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold px-3 xl:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-xl hover:scale-105 transition text-xs xl:text-sm whitespace-nowrap"
            >
              {t("cta.donate")}
            </Link>

            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              aria-expanded={open}
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-white"
            >
              <span
                className={`block w-6 h-0.5 bg-current transition-transform ${
                  open ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-current transition-opacity ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-current transition-transform ${
                  open ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden mt-3 bg-[#0A3D24]/95 backdrop-blur-2xl border border-white/10 rounded-[24px] p-5 shadow-2xl">
            {/* PROFIL / CONNEXION en tete du drawer */}
            {user ? (
              <Link
                href="/espace-membre/profil"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gradient-to-r from-[#0F7C55]/30 to-[#0F7C55]/10 border border-[#D4AF37]/30"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-[#0F7C55] text-sm font-black flex-shrink-0">
                  {memberInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold text-sm truncate">
                    {user.displayName || user.email}
                  </p>
                  <p className="text-[#D4AF37] text-[10px] uppercase tracking-widest">
                    {user.memberStatus === "actif"
                      ? "✓ Membre Actif"
                      : user.memberStatus === "en_attente"
                      ? "⏳ En attente"
                      : "Visiteur"}{" "}
                    · Voir mon profil →
                  </p>
                </div>
              </Link>
            ) : (
              <Link
                href="/espace-membre"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 mb-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-sm transition"
              >
                <FaRightToBracket /> Connexion / Inscription
              </Link>
            )}

            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 px-4 rounded-xl text-white hover:bg-white/10 hover:text-[#D4AF37] font-medium transition"
                >
                  {item.label}
                </Link>
              ))}

              {user && (
                <Link
                  href="/espace-membre/profil"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 py-3 px-4 rounded-xl text-white hover:bg-white/10 hover:text-[#D4AF37] font-medium transition"
                >
                  <FaUser className="text-[#D4AF37]" />
                  Mon Profil
                </Link>
              )}
            </div>

            <div className="border-t border-white/10 mt-4 pt-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-3 px-2">
                {t("cta.follow_us")}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {SOCIALS.map((s) => {
                  const Icon = s.Icon;
                  return (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      aria-label={s.name}
                      className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-[#0F7C55] text-white transition"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-medium">{s.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href="/inscription"
                onClick={() => setOpen(false)}
                className="block py-3 text-center font-semibold text-[#D4AF37] border border-[#D4AF37]/40 rounded-xl"
              >
                {t("cta.member")}
              </Link>
              <Link
                href="/don"
                onClick={() => setOpen(false)}
                className="block py-3 text-center font-bold text-[#0F7C55] bg-gradient-to-r from-[#B8860B] to-[#D4AF37] rounded-xl"
              >
                {t("cta.donate")}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
