"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaChevronRight, FaXmark } from "react-icons/fa6";
import { useT } from "@/lib/i18n/context";

export default function FloatingChallengeBanner() {
  const { t } = useT();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);

    const dismissed = localStorage.getItem("ksn-challenge-banner-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted) return null;

  const isExcludedRoute =
    pathname === "/challenge" ||
    pathname.startsWith("/admin");

  if (isExcludedRoute || !visible) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("ksn-challenge-banner-dismissed", "1");
    setVisible(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
      
      <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none">
        <div className="w-full max-w-xl pointer-events-auto animate-fade-in-up">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A3D24] via-[#0F7C55] to-[#0A3D24] border border-[#D4AF37]/35 shadow-[0_12px_40px_rgba(0,0,0,0.35)] p-3.5 pr-9 sm:p-5 sm:pr-11 text-white flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#D4AF37]/15 blur-2xl pointer-events-none" />

            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1.5 text-white/50 hover:text-white transition duration-200 z-10"
              title="Fermer"
            >
              <FaXmark size={14} />
            </button>

            <div className="min-w-0 flex-1">
              <span className="inline-block bg-[#D4AF37] text-[#06251a] font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded mb-1.5 shadow-sm">
                Challenge 1 Milliard
              </span>
              <p className="text-xs sm:text-sm text-gray-100 font-medium leading-relaxed">
                {t("banner.challenge_text")}
              </p>
            </div>

            <Link
              href="/challenge"
              className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-1.5 bg-[#D4AF37] text-[#06251a] hover:bg-[#F5D76E] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition duration-300"
            >
              {t("banner.challenge_btn")} <FaChevronRight size={10} className="stroke-[3px]" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
