"use client";

import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa6";
import { LOCALES } from "@/lib/i18n/locales";
import { useT } from "@/lib/i18n/context";

type Variant = "navbar" | "compact";

export default function LanguageSwitcher({ variant = "navbar" }: { variant?: Variant }) {
  const { locale, setLocale } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const buttonClass =
    variant === "navbar"
      ? "inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm transition"
      : "inline-flex items-center gap-2 bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F7C55] px-4 py-2.5 rounded-xl font-semibold text-sm transition";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={buttonClass}
      >
        <span className="text-base">{current.flag}</span>
        <span>{current.short}</span>
        <FaChevronDown className="w-3 h-3 opacity-70" />
      </button>

      {open && (
        <div className="absolute end-0 mt-2 min-w-[180px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <ul role="listbox" className="py-1">
            {LOCALES.map((l) => {
              const active = l.code === locale;
              const isDisabled = l.disabled === true;
              return (
                <li key={l.code} role="option" aria-selected={active}>
                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (isDisabled) return;
                      setLocale(l.code);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium transition ${
                      isDisabled
                        ? "text-gray-400 cursor-not-allowed"
                        : active
                        ? "bg-[#0F7C55] text-white"
                        : "text-[#0F7C55] hover:bg-[#F8F5EF]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base">{l.flag}</span>
                      <span>{l.label}</span>
                    </span>
                    {active && !isDisabled && <FaCheck className="w-3 h-3" />}
                    {l.comingSoon && (
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#B8860B] bg-[#D4AF37]/10 rounded px-1.5 py-0.5">
                        Bientôt
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
