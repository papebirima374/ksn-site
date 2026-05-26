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
import { LINKS, SITE } from "@/lib/constants";

const NAV_ITEMS = [
  { label: "Accueil", href: "/" },
  { label: "Le Dahira", href: "/dahira" },
  { label: "Spiritualité", href: "/spiritualite" },
  { label: "Média", href: "/media" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const SOCIALS = [
  { name: "Facebook", url: LINKS.facebook, Icon: FaFacebookF },
  { name: "Instagram", url: LINKS.instagram, Icon: FaInstagram },
  { name: "TikTok", url: LINKS.tiktok, Icon: FaTiktok },
  { name: "YouTube", url: LINKS.youtube, Icon: FaYoutube },
  { name: "Telegram", url: LINKS.telegram, Icon: FaTelegram },
  { name: "WhatsApp", url: LINKS.whatsapp, Icon: FaWhatsapp },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-[24px] sm:rounded-[30px] px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3 shadow-[0_10px_50px_rgba(0,0,0,0.35)]">

          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-white shadow-xl flex-shrink-0">
              <Image
                src="/logo/ksn-logo.png"
                alt="KSN Logo"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 80px"
                priority
              />
            </div>

            <div className="hidden sm:block">
              <h1 className="font-display text-white font-bold text-xl lg:text-3xl leading-tight">
                {SITE.name}
              </h1>
              <p className="text-white/60 text-xs lg:text-sm tracking-wide">
                {SITE.tagline}
              </p>
              <p className="text-[#D4AF37] text-[10px] lg:text-sm mt-0.5">
                {SITE.motto}
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex gap-8 xl:gap-12 text-white font-medium">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-[#D4AF37] transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/don"
              className="hidden sm:inline-flex bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] font-bold px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-xl sm:rounded-2xl shadow-xl hover:scale-105 transition text-sm sm:text-base whitespace-nowrap"
            >
              Faire un Don
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
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 px-4 rounded-xl text-white hover:bg-white/10 hover:text-[#D4AF37] font-medium transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-white/10 mt-4 pt-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-3 px-2">
                Suivez-nous
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
                      className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-[#0F5132] text-white transition"
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
                Rejoindre
              </Link>
              <Link
                href="/don"
                onClick={() => setOpen(false)}
                className="block py-3 text-center font-bold text-[#0F5132] bg-gradient-to-r from-[#B8860B] to-[#D4AF37] rounded-xl"
              >
                Faire un Don
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
