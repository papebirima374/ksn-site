import type { Metadata } from "next";
import { SITE, LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Nos liens officiels",
  description:
    "Tous les liens officiels du Dahira Kippangog Salaatu 'Alaa Nabii : Canal Télégram, WhatsApp, TikTok, Instagram, Facebook, YouTube et applications mobiles.",
};

type LinkItem = {
  label: string;
  sub?: string;
  href: string;
  icon: React.ReactNode;
  accent?: boolean;
};

const I = {
  telegram: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-6 w-6">
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-6 w-6">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35zM12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.77.46 3.44 1.28 4.89L2 22l5.25-1.38c1.4.76 3 1.2 4.7 1.2h.01c5.52 0 10-4.48 10-10S17.54 2 12.02 2z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-6 w-6">
      <path d="M16.5 3c.4 2.3 1.7 3.7 3.9 3.85v2.53c-1.28.12-2.4-.3-3.7-1.08v4.9c0 4.9-5.35 6.43-7.5 2.93-1.38-2.26-.53-6.22 3.9-6.38v2.67c-.34.05-.7.14-1.03.26-1 .34-1.56 1-1.4 2.12.3 2.13 4.2 2.76 3.88-1.4V3h1.95z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-6 w-6">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.24A6.6 6.6 0 1012 18.6 6.6 6.6 0 0012 5.4zm0 10.89A4.29 4.29 0 1112 7.7a4.29 4.29 0 010 8.59zm6.86-11.15a1.54 1.54 0 11-3.08 0 1.54 1.54 0 013.08 0z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-6 w-6">
      <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-6 w-6">
      <path d="M23.5 6.2a3 3 0 00-2.12-2.12C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.53A3 3 0 00.5 6.2 31.3 31.3 0 000 12a31.3 31.3 0 00.5 5.8 3 3 0 002.12 2.12c1.88.53 9.38.53 9.38.53s7.5 0 9.38-.53a3 3 0 002.12-2.12A31.3 31.3 0 0024 12a31.3 31.3 0 00-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className="h-6 w-6">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-6 w-6">
      <path d="M16.36 12.9c.02 2.5 2.2 3.33 2.22 3.34-.02.06-.35 1.2-1.15 2.38-.7 1.02-1.42 2.04-2.56 2.06-1.12.02-1.48-.66-2.76-.66-1.28 0-1.68.64-2.74.68-1.1.04-1.94-1.1-2.64-2.12-1.44-2.08-2.54-5.88-1.06-8.44.73-1.28 2.04-2.08 3.46-2.1 1.08-.02 2.1.72 2.76.72.66 0 1.9-.9 3.2-.76.55.02 2.08.22 3.06 1.67-.08.05-1.83 1.07-1.8 3.19zM14.28 4.7c.58-.7.97-1.68.86-2.66-.84.04-1.85.56-2.45 1.26-.54.62-1.01 1.62-.88 2.58.93.07 1.89-.48 2.47-1.18z" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-6 w-6">
      <path d="M3.6 2.1c-.3.2-.5.6-.5 1.1v17.6c0 .5.2.9.5 1.1l9.3-9.9L3.6 2.1zm11.1 8.1l2.9-3.1L6.3 1.4c-.4-.2-.8-.2-1.1-.1l9.5 8.9zm3.9 1.8l-3-1.7-3.1 3.3 3.1 3.3 3-1.7c.9-.5.9-2 0-2.5v-.7zm-4.1 2.2l-2.9-3.1-9.3 9.9c.3.1.7.1 1.1-.1l11.1-6.7z" />
    </svg>
  ),
};

const links: LinkItem[] = [
  {
    label: "Canal Télégram",
    sub: "Rejoins le canal officiel",
    href: LINKS.telegram,
    icon: I.telegram,
    accent: true,
  },
  { label: "WhatsApp", sub: "Contact & Dahira", href: LINKS.whatsapp, icon: I.whatsapp },
  { label: "TikTok", href: LINKS.tiktok, icon: I.tiktok },
  { label: "Instagram", href: LINKS.instagram, icon: I.instagram },
  { label: "Facebook", href: LINKS.facebook, icon: I.facebook },
  { label: "YouTube", href: LINKS.youtube, icon: I.youtube },
  { label: "Site officiel", href: SITE.url, icon: I.globe },
  { label: "App iPhone (App Store)", href: LINKS.appStore, icon: I.apple },
  { label: "App Android (Play Store)", href: LINKS.playStore, icon: I.play },
];

export default function LiensPage() {
  return (
    <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-5 pb-24 pt-28 sm:pt-32">
      {/* En-tête */}
      <div className="flex flex-col items-center text-center">
        <div className="rounded-full bg-white/95 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,.45)] ring-2 ring-[#D4AF37]/70">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/ksn-logo.png"
            alt="Kippangog Salaatu 'Alaa Nabii"
            className="h-24 w-24 rounded-full object-contain"
          />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">
          Kippangog
        </h1>
        <p className="text-sm font-medium text-[#E7C86B]">
          Salaatu ʿAlaa Nabii
        </p>
        <p className="mt-1 text-xs text-white/60">
          {SITE.tagline} • {SITE.location}
        </p>
      </div>

      {/* Liens */}
      <nav className="mt-8 flex w-full flex-col gap-3">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={
              l.accent
                ? "group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] px-5 py-4 text-[#082F22] shadow-lg transition-transform active:scale-[.98]"
                : "group flex items-center gap-3 rounded-2xl bg-white/95 px-5 py-4 text-[#0A3D24] shadow-md transition-transform hover:bg-white active:scale-[.98]"
            }
          >
            <span className="shrink-0">{l.icon}</span>
            <span className="flex flex-col text-left leading-tight">
              <span className="text-[15px] font-semibold">{l.label}</span>
              {l.sub && (
                <span
                  className={
                    l.accent ? "text-xs text-[#082F22]/70" : "text-xs text-[#0A3D24]/60"
                  }
                >
                  {l.sub}
                </span>
              )}
            </span>
            <span className="ml-auto opacity-40 transition-opacity group-hover:opacity-70">
              →
            </span>
          </a>
        ))}
      </nav>

      <p className="mt-10 text-center text-[11px] text-white/40">
        © {new Date().getFullYear()} {SITE.fullName} — {SITE.domain}
      </p>
    </section>
  );
}
