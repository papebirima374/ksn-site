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
      // Collection « newsletter », et non « newsletter_subscribers » : cette
      // seconde n'a jamais eu de regle Firestore, donc chaque inscription
      // depuis le pied de page etait refusee. Et le formulaire de la page
      // Education ecrivait deja dans « newsletter » : les inscrits se
      // retrouvaient repartis entre deux endroits dont l'un n'existait pas.
      await addDoc(collection(db, "newsletter"), {
        email: newsletterEmail.trim().toLowerCase(),
        source: "pied de page",
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

  // Le pied de page reprend EXACTEMENT le regroupement de la barre de
  // navigation (components/layout/Navbar.tsx). Auparavant il alignait douze
  // liens en une seule colonne : le visiteur y cherchait « Journee Salaatu »
  // sous un classement qui n'existait plus nulle part ailleurs sur le site.
  // Aucune page n'est retiree — elles sont rangees comme en haut.
  const groupes = [
    {
      titre: "Dahira",
      liens: [
        { label: "Le Dahira", href: "/dahira" },
        { label: "Notre Histoire", href: "/notre-histoire" },
        { label: "Événements", href: "/evenements" },
      ],
    },
    {
      titre: t("nav.vie_spirituelle"),
      liens: [
        { label: t("nav.spiritualite"), href: "/spiritualite" },
        { label: "Challenge", href: "/challenge" },
        { label: "Journée Salaatu", href: "/journee-salaatu" },
      ],
    },
    {
      titre: t("nav.actualites"),
      liens: [
        { label: t("nav.media"), href: "/media" },
        { label: t("nav.blog"), href: "/blog" },
        { label: "FAQ", href: "/faq" },
      ],
    },
  ];

  /** Les pages qui n'appartiennent a aucun groupe, en une seule ligne. */
  const liensDirects = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.boutique"), href: "/boutique" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  return (
    <footer /* Pas de marge haute : les sections de contenu finissent deja par
         pb-20/pb-28, soit 80 a 112 px de respiration. La marge du pied
         s'ajoutait par-dessus et creusait plus de 200 px de vide vert sur
         chaque page. Le pied a son propre py-12/py-16 a l'interieur. */
      className="relative z-10 border-t border-white/10 bg-[#0B2E1F]/90 backdrop-blur-xl">
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

          <div className="sm:col-span-2">
            <h4 className="text-[#D4AF37] font-bold text-base sm:text-lg">
              {t("footer.navigation")}
            </h4>
            <div className="mt-4 sm:mt-5 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">
              {groupes.map((g) => (
                <div key={g.titre}>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-wider">
                    {g.titre}
                  </p>
                  <div className="mt-2.5 flex flex-col gap-2 text-white/70 text-sm">
                    {g.liens.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="hover:text-[#D4AF37] transition"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-white/70 text-sm">
              {liensDirects.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-[#D4AF37] transition">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact et reseaux ne font plus qu'une colonne. Trois doublons en
              sont sortis : WhatsApp y figurait en lien ET en icone, l'adresse
              du site y etait alors qu'elle est deja en bas a droite, et la
              devise du Dahira s'y repetait — la barre du haut la porte deja,
              sur le meme ecran. */}
          <div>
            <h4 className="text-[#D4AF37] font-bold text-base sm:text-lg">
              {t("footer.contact")}
            </h4>
            <p className="mt-4 sm:mt-5 text-white/70 text-sm sm:text-base">
              📍 {t("site.location")}
            </p>
            <p className="mt-5 text-white/50 text-xs font-bold uppercase tracking-wider">
              {t("footer.suivez")}
            </p>
            {/* Des boutons de taille fixe, et non `aspect-square` : dans une
                colonne etroite, trois carres elastiques donnaient des pastilles
                de 115 px et plus de 300 px de pied de page sur un telephone.
                44 px, c'est la taille ou le doigt vise juste. Trois par rangee,
                donc deux rangees pleines — aucune icone esseulee. */}
            <div className="mt-2.5 grid w-fit grid-cols-3 gap-2">
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
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-[#0F7C55] text-white transition"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                );
              })}
            </div>

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
