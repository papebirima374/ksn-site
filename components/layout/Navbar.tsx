"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaTelegram,
  FaWhatsapp,
  FaChevronDown,
} from "react-icons/fa6";
import { FaUser, FaRightToBracket } from "react-icons/fa6";
import { LINKS, SITE } from "@/lib/constants";
import { useT } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth-context";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import SearchBar from "@/components/layout/SearchBar";

type NavLink = { kind: "link"; label: string; href: string };
type NavChild = {
  label: string;
  href: string;
  description?: string;
  /** Petit badge optionnel affiché à droite (ex : "À venir", "Nouveau"). */
  badge?: string;
};
type NavGroup = { kind: "group"; label: string; children: NavChild[] };
type NavEntry = NavLink | NavGroup;

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

  const navItems: NavEntry[] = [
    { kind: "link", label: t("nav.home"), href: "/" },
    {
      kind: "group",
      label: "Dahira",
      children: [
        {
          label: "Le Dahira",
          href: "/dahira",
          description: "Notre organisation, nos commissions, notre mission",
        },
        {
          label: "Notre Histoire",
          href: "/notre-histoire",
          description: "Fondation 2021, jalons clés, valeurs",
        },
        {
          label: "Événements & Calendrier",
          href: "/evenements",
          description: "Dates de l'Hégire, fêtes, Magal",
        },
      ],
    },
    {
      kind: "group",
      label: t("nav.spiritualite"),
      children: [
        {
          label: t("nav.spiritualite"),
          href: "/spiritualite",
          description: "Salaatu du jour, bibliothèque, dhikrs et invocations",
        },
        {
          label: "Éducation Islamique",
          href: "/education",
          description:
            "Tazawwud-ss-Sighar de Cheikh Ahmadou Bamba — académie spirituelle",
          badge: "À venir",
        },
      ],
    },
    { kind: "link", label: t("nav.media"), href: "/media" },
    { kind: "link", label: "Challenge", href: "/challenge" },
    { kind: "link", label: "Journée", href: "/journee-salaatu" },
    { kind: "link", label: t("nav.boutique"), href: "/boutique" },
    { kind: "link", label: t("nav.blog"), href: "/blog" },
    { kind: "link", label: t("nav.contact"), href: "/contact" },
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

          <nav className="hidden lg:flex items-center gap-2.5 xl:gap-5 text-white font-medium text-[12px] xl:text-[14px]">
            {navItems.map((item) =>
              item.kind === "link" ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-[#D4AF37] transition whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ) : (
                <NavDropdown key={item.label} group={item} />
              )
            )}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <SearchBar />
            <LanguageSwitcher />

            {user ? (
              <Link
                href="/espace-membre/profil"
                className="hidden sm:inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold px-2.5 xl:px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition text-xs whitespace-nowrap"
                title={user.email}
              >
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover border border-[#D4AF37]"
                    draggable={false}
                  />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-[#0F7C55] text-[10px] font-black">
                    {memberInitials}
                  </span>
                )}
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
              {navItems.map((item) =>
                item.kind === "link" ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 px-4 rounded-xl text-white hover:bg-white/10 hover:text-[#D4AF37] font-medium transition"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <div key={item.label} className="pt-2">
                    <p className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                      {item.label}
                    </p>
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between gap-2 py-3 px-6 rounded-xl text-white hover:bg-white/10 hover:text-[#D4AF37] font-medium transition"
                      >
                        <span>{c.label}</span>
                        {c.badge && (
                          <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40">
                            <span className="relative flex w-1.5 h-1.5">
                              <span className="absolute inline-flex w-full h-full rounded-full bg-[#D4AF37] opacity-75 animate-ping" />
                              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                            </span>
                            {c.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )
              )}

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

/** Element navbar dropdown : ouvre au hover (desktop) + au clic (touch).
 *  Ferme automatiquement en cliquant hors zone ou en pressant ESC. */
function NavDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Ferme au clic exterieur
  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="inline-flex items-center gap-1 hover:text-[#D4AF37] transition whitespace-nowrap py-1"
      >
        {group.label}
        <FaChevronDown
          className={`text-[9px] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
          // Note : pt-3 cree une zone "ponts" entre le trigger et le panel
          // pour eviter que onMouseLeave ferme prematurement
        >
          <div className="w-72 bg-[#0A3D24]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2">
            {group.children.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                onClick={() => setOpen(false)}
                className="block p-3 rounded-xl text-white hover:bg-white/10 hover:text-[#D4AF37] transition group"
              >
                <span className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm group-hover:text-[#D4AF37]">
                    {c.label}
                  </span>
                  {c.badge && (
                    <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40">
                      <span className="relative flex w-1.5 h-1.5">
                        <span className="absolute inline-flex w-full h-full rounded-full bg-[#D4AF37] opacity-75 animate-ping" />
                        <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      </span>
                      {c.badge}
                    </span>
                  )}
                </span>
                {c.description && (
                  <span className="block mt-0.5 text-[11px] text-white/60 leading-snug">
                    {c.description}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
