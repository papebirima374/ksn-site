"use client";

import { useEffect, useState } from "react";
import { FaShareNodes, FaCheck, FaLink, FaWhatsapp, FaTelegram, FaFacebookF, FaXTwitter } from "react-icons/fa6";

type ShareButtonProps = {
  /** Titre affiche dans la fenetre de partage native */
  title: string;
  /** Description / texte d'introduction */
  text: string;
  /** URL a partager. Par defaut = URL courante */
  url?: string;
  /** Style visuel du bouton :
   *  - "primary" : bouton dore plein (CTA fort)
   *  - "ghost" : bouton transparent avec bordure
   *  - "compact" : bouton vert standard */
  variant?: "primary" | "ghost" | "compact";
  /** Label personnalise (par defaut "Partager") */
  label?: string;
  /** Classes Tailwind supplementaires */
  className?: string;
};

/** Bouton "Partager" intelligent :
 *  - Sur mobile : ouvre la fenetre de partage native (Web Share API)
 *    -> WhatsApp, Telegram, Instagram, Messenger, AirDrop, Mail, etc.
 *  - Sur desktop sans Web Share : ouvre un menu mini avec WhatsApp/Telegram/
 *    Facebook/X + bouton "Copier le lien"
 *  - Feedback : "Lien copié" quand on copie */
export default function ShareButton({
  title,
  text,
  url,
  variant = "primary",
  label = "Partager",
  className = "",
}: ShareButtonProps) {
  const [shareSupported, setShareSupported] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fallbackOpen, setFallbackOpen] = useState(false);

  // Detecte Web Share API cote client uniquement
  useEffect(() => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      setShareSupported(true);
    }
  }, []);

  function getUrl(): string {
    if (url) return url;
    if (typeof window !== "undefined") return window.location.href;
    return "";
  }

  async function handleNativeShare() {
    const finalUrl = getUrl();
    try {
      await navigator.share({ title, text, url: finalUrl });
    } catch {
      // L'utilisateur a annule, pas grave
    }
  }

  async function copyLink() {
    const finalUrl = getUrl();
    try {
      await navigator.clipboard.writeText(finalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback ultime : prompt
      window.prompt("Copiez ce lien :", finalUrl);
    }
  }

  function handleClick() {
    if (shareSupported) {
      void handleNativeShare();
    } else {
      setFallbackOpen((v) => !v);
    }
  }

  const baseClasses = "inline-flex items-center justify-center gap-2 font-bold rounded-2xl transition whitespace-nowrap";
  const variantClasses: Record<NonNullable<ShareButtonProps["variant"]>, string> = {
    primary:
      "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] px-6 py-3.5 shadow-xl hover:scale-105 text-sm sm:text-base",
    ghost:
      "border border-[#D4AF37]/40 text-[#D4AF37] px-5 py-3 hover:bg-[#D4AF37]/10 text-sm",
    compact:
      "bg-[#0F7C55] hover:bg-[#0A3D24] text-white px-4 py-2.5 text-xs sm:text-sm",
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        <FaShareNodes className="text-sm" />
        <span>{label}</span>
      </button>

      {/* MENU FALLBACK (desktop sans Web Share) */}
      {fallbackOpen && !shareSupported && (
        <>
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setFallbackOpen(false)}
            aria-hidden
          />
          <div
            role="menu"
            className="absolute right-0 top-full mt-2 z-[61] w-64 bg-[#0A3D24] border border-[#D4AF37]/30 rounded-2xl shadow-2xl p-2"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold px-3 pt-2 pb-1.5">
              Partager via
            </p>
            <ShareOption
              icon={<FaWhatsapp className="text-[#25D366]" />}
              label="WhatsApp"
              onClick={() => {
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(`${text}\n${getUrl()}`)}`,
                  "_blank",
                  "noopener,noreferrer"
                );
                setFallbackOpen(false);
              }}
            />
            <ShareOption
              icon={<FaTelegram className="text-[#26A5E4]" />}
              label="Telegram"
              onClick={() => {
                window.open(
                  `https://t.me/share/url?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(text)}`,
                  "_blank",
                  "noopener,noreferrer"
                );
                setFallbackOpen(false);
              }}
            />
            <ShareOption
              icon={<FaFacebookF className="text-[#1877F2]" />}
              label="Facebook"
              onClick={() => {
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
                  "_blank",
                  "noopener,noreferrer"
                );
                setFallbackOpen(false);
              }}
            />
            <ShareOption
              icon={<FaXTwitter className="text-white" />}
              label="X (Twitter)"
              onClick={() => {
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getUrl())}`,
                  "_blank",
                  "noopener,noreferrer"
                );
                setFallbackOpen(false);
              }}
            />
            <div className="border-t border-white/10 my-1.5" />
            <ShareOption
              icon={copied ? <FaCheck className="text-emerald-400" /> : <FaLink className="text-[#D4AF37]" />}
              label={copied ? "Lien copié !" : "Copier le lien"}
              onClick={async () => {
                await copyLink();
                // On laisse le menu ouvert 1.5s pour montrer le feedback
                setTimeout(() => setFallbackOpen(false), 1500);
              }}
            />
          </div>
        </>
      )}

      {/* Toast "Lien copié" pour mobile (native share) — au cas où */}
      {copied && shareSupported && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-[#0F7C55] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#D4AF37]/40 flex items-center gap-2 text-sm font-semibold">
          <FaCheck className="text-emerald-300" />
          <span>Lien copié dans le presse-papier</span>
        </div>
      )}
    </div>
  );
}

function ShareOption({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white hover:bg-white/10 transition text-sm text-left"
    >
      <span className="text-lg w-6 flex justify-center">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
