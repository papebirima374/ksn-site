"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaCookieBite, FaXmark } from "react-icons/fa6";

const STORAGE_KEY = "ksn-cookie-consent";

type Consent = "accepted" | "rejected" | null;

export default function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Consent | null;
        if (saved === "accepted" || saved === "rejected") {
          setConsent(saved);
        }
      } catch {
        // ignore
      }
    });
  }, []);

  function setChoice(c: "accepted" | "rejected") {
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {}
    setConsent(c);
  }

  if (!mounted || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Bandeau de gestion des cookies"
      className="fixed bottom-0 left-0 right-0 z-[70] p-3 sm:p-5 pointer-events-none"
    >
      <div className="max-w-3xl mx-auto pointer-events-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#0F7C55]/10 p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="hidden sm:flex w-10 h-10 rounded-full bg-[#F8F5EF] items-center justify-center text-[#B8860B] text-lg flex-shrink-0">
            <FaCookieBite />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-base sm:text-lg font-bold text-[#0F7C55]">
              Cookies & vie privée
            </p>
            <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-6">
              Nous utilisons uniquement les cookies nécessaires (auth, panier,
              langue) et, si vous acceptez, des cookies de mesure d&apos;audience anonymes pour améliorer le site.{" "}
              <Link href="/cookies" className="text-[#B8860B] hover:text-[#D4AF37] font-semibold underline">
                En savoir plus
              </Link>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setChoice("accepted")}
                className="bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-2 px-4 rounded-xl font-bold text-xs sm:text-sm hover:scale-105 transition"
              >
                Tout accepter
              </button>
              <button
                type="button"
                onClick={() => setChoice("rejected")}
                className="bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F7C55] py-2 px-4 rounded-xl font-semibold text-xs sm:text-sm transition"
              >
                Refuser les optionnels
              </button>
              <Link
                href="/cookies"
                className="ml-auto self-center text-xs text-gray-500 hover:text-[#0F7C55] underline"
              >
                Paramétrer
              </Link>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setChoice("rejected")}
            aria-label="Fermer"
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            <FaXmark />
          </button>
        </div>
      </div>
    </div>
  );
}
