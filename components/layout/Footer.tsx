"use client";

import { useState, FormEvent } from "react";
import { addDoc, collection } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
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
  
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success" | "error">("idle");
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);

  const handleSubscribeNewsletter = async (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubmittingNewsletter(true);
    setNewsletterStatus("idle");
    setNewsletterMsg("");

    try {
      const db = getDb();
      await addDoc(collection(db, "newsletter_subscribers"), {
        email: newsletterEmail.trim().toLowerCase(),
        subscribedAt: Date.now(),
      });
      setNewsletterStatus("success");
      setNewsletterEmail("");
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      setNewsletterStatus("error");
      setNewsletterMsg("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
    } finally {
      setSubmittingNewsletter(false);
    }
  };

  const navLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.dahira"), href: "/dahira" },
    { label: "Notre Histoire", href: "/notre-histoire" },
    { label: t("nav.spiritualite"), href: "/spiritualite" },
    { label: "Challenge 1 Milliard", href: "/challenge" },
    { label: "Journée Salaatu", href: "/journee-salaatu" },
    { label: "Événements", href: "/evenements" },
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
                    className="aspect-square flex items-center justify-center rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-[#0F7C55] text-white transition"
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

        {/* NEWSLETTER ROW */}
        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <h4 className="text-[#D4AF37] font-bold text-base sm:text-lg">
              S&apos;abonner à la Newsletter
            </h4>
            <p className="text-white/60 text-xs sm:text-sm mt-1 leading-relaxed">
              Recevez les actualités de la oumma KSN, les dates des événements et nos rappels spirituels directement dans votre boîte mail.
            </p>
          </div>

          <form onSubmit={handleSubscribeNewsletter} className="w-full md:w-auto max-w-md flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-white/40 focus:border-[#D4AF37] outline-none min-w-[240px] flex-1"
            />
            <button
              type="submit"
              disabled={submittingNewsletter}
              className="bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold px-5 py-3 rounded-xl hover:opacity-95 transition text-xs sm:text-sm whitespace-nowrap disabled:opacity-70"
            >
              {submittingNewsletter ? "Envoi..." : "S'abonner"}
            </button>
          </form>
        </div>

        {newsletterStatus === "success" && (
          <p className="text-emerald-400 text-xs mt-2 font-semibold text-center md:text-right">
            Inscription réussie ! Merci pour votre confiance.
          </p>
        )}
        {newsletterStatus === "error" && (
          <p className="text-red-400 text-xs mt-2 font-semibold text-center md:text-right">
            {newsletterMsg}
          </p>
        )}

        <div className="border-t border-white/10 mt-8 pt-6 sm:pt-8">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white/60 mb-5">
            <Link href="/mentions-legales" className="hover:text-[#D4AF37] transition">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-[#D4AF37] transition">Confidentialité</Link>
            <Link href="/cgu" className="hover:text-[#D4AF37] transition">CGU</Link>
            <Link href="/cgv" className="hover:text-[#D4AF37] transition">CGV</Link>
            <Link href="/cookies" className="hover:text-[#D4AF37] transition">Cookies</Link>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-white/50 text-xs sm:text-sm text-center md:text-left">
              © 2021 - {new Date().getFullYear()} {SITE.fullName} ({SITE.name}).{" "}
              {t("footer.copyright")}
            </p>
            <p className="text-[#D4AF37] text-xs sm:text-sm">{SITE.domain}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
