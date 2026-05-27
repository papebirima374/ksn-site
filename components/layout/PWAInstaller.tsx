"use client";

import { useEffect, useState } from "react";
import { FaDownload, FaApple, FaXmark } from "react-icons/fa6";

/** Evenement Chrome non-encore type dans lib.dom. */
type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt(): Promise<void>;
};

const DISMISSED_KEY = "ksn-pwa-dismissed";
const SHOW_DELAY_MS = 6000; // attendre 6s avant d'embeter l'utilisateur

/** Bandeau "Installer l'app KSN" :
 *  - Sur Chrome/Edge : declenche le prompt natif via beforeinstallprompt
 *  - Sur iOS Safari : affiche les instructions manuelles (Apple n'expose pas
 *    l'API beforeinstallprompt) */
export default function PWAInstaller() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  // 1) Enregistre le service worker (necessaire pour le critere d'install Chrome)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // Asynchrone — ne bloque pas le rendu
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Silencieux : le SW est un nice-to-have, pas critique
      });
    });
  }, []);

  // 2) Detection iOS Safari + mode standalone
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = window.navigator.userAgent.toLowerCase();
    const iosDetected = /iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua);
    setIsIOS(iosDetected);

    // navigator.standalone est specifique iOS ; matchMedia couvre Android/Desktop
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
  }, []);

  // 3) Capture l'evenement Chrome
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  // 4) Decide d'afficher (avec delai + verification dismiss + standalone)
  useEffect(() => {
    if (isStandalone) return; // deja installe
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;

    // Sur iOS on affiche directement (pas d'event natif)
    // Sur Chrome/Android on attend qu'on ait l'event
    if (!isIOS && !promptEvent) return;

    const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, [isIOS, isStandalone, promptEvent]);

  const dismiss = () => {
    setVisible(false);
    window.localStorage.setItem(DISMISSED_KEY, "1");
  };

  const triggerInstall = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
    } else {
      // L'utilisateur a refuse — on n'embete plus
      dismiss();
    }
    setPromptEvent(null);
  };

  if (!visible || isStandalone) return null;

  // ─── Bandeau iOS Safari ────────────────────────────────────────────
  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-[60] bg-[#0F7C55] text-white rounded-2xl shadow-2xl border border-[#D4AF37]/40 p-4 sm:p-5">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fermer"
          className="absolute top-3 right-3 text-white/60 hover:text-white"
        >
          <FaXmark />
        </button>
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-[#0F7C55] flex-shrink-0">
            <FaApple className="text-xl" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm sm:text-base">
              Installer le Site KSN sur votre iPhone
            </p>
            {showIOSHelp ? (
              <div className="mt-2 text-xs sm:text-sm text-white/85 leading-5 space-y-1">
                <p>1. Touchez l&apos;icône <span className="inline-block px-1.5 py-0.5 rounded bg-white/10">⬆️ Partager</span> en bas de Safari</p>
                <p>2. Faites défiler et touchez <strong>« Sur l&apos;écran d&apos;accueil »</strong></p>
                <p>3. Touchez <strong>Ajouter</strong> en haut à droite</p>
              </div>
            ) : (
              <p className="mt-1 text-xs sm:text-sm text-white/80">
                Accédez à KSN comme une vraie app, sans passer par Safari.
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowIOSHelp((v) => !v)}
              className="mt-3 text-xs sm:text-sm font-bold text-[#D4AF37] hover:underline"
            >
              {showIOSHelp ? "Masquer" : "Comment faire ?"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Bandeau Chrome / Edge / Brave ─────────────────────────────────
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-[60] bg-[#0F7C55] text-white rounded-2xl shadow-2xl border border-[#D4AF37]/40 p-4 sm:p-5">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fermer"
        className="absolute top-3 right-3 text-white/60 hover:text-white"
      >
        <FaXmark />
      </button>
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-[#0F7C55] flex-shrink-0">
          <FaDownload className="text-lg" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm sm:text-base">
            Installer le Site KSN
          </p>
          <p className="mt-1 text-xs sm:text-sm text-white/80">
            Accédez au site KSN depuis votre écran d&apos;accueil, en plein
            écran, comme une vraie application (distinct de l&apos;app mobile).
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={triggerInstall}
              className="bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg hover:scale-105 transition"
            >
              Installer
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="text-white/70 hover:text-white text-xs sm:text-sm px-3 py-2"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
