"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FaMagnifyingGlass,
  FaXmark,
  FaArrowRight,
  FaFolderClosed,
  FaUser,
  FaCalendarDays,
  FaCircleQuestion,
  FaUsers,
  FaGavel,
} from "react-icons/fa6";
import {
  searchIndex,
  SEARCH_INDEX,
  type SearchEntry,
  type SearchCategory,
} from "@/lib/search-index";

const CATEGORY_ICONS: Record<SearchCategory, React.ReactNode> = {
  Page: <FaFolderClosed />,
  "Espace membre": <FaUser />,
  Événement: <FaCalendarDays />,
  FAQ: <FaCircleQuestion />,
  Commission: <FaUsers />,
  Légal: <FaGavel />,
};

const CATEGORY_COLORS: Record<SearchCategory, string> = {
  Page: "text-[#D4AF37]",
  "Espace membre": "text-emerald-400",
  Événement: "text-orange-400",
  FAQ: "text-blue-400",
  Commission: "text-purple-400",
  Légal: "text-gray-400",
};

/** Bouton de recherche dans le navbar + overlay plein écran. */
export default function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Raccourci clavier : Cmd/Ctrl + K pour ouvrir, ESC pour fermer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Focus auto sur l'input quand on ouvre
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      // Bloque le scroll du body
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      setResults([]);
      setActiveIdx(0);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Recherche live (debounced via React batching, suffisant ici)
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    setResults(searchIndex(query, 10));
    setActiveIdx(0);
  }, [query]);

  // Navigation clavier dans les résultats (↑ ↓ Enter)
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (results.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => (i - 1 + results.length) % results.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const target = results[activeIdx];
        if (target) {
          router.push(target.url);
          setOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, results, activeIdx, router]);

  // Suggestions à afficher quand l'utilisateur n'a encore rien tapé
  const SUGGESTIONS: SearchEntry[] = [
    SEARCH_INDEX.find((e) => e.url === "/challenge")!,
    SEARCH_INDEX.find((e) => e.url === "/journee-salaatu")!,
    SEARCH_INDEX.find((e) => e.url === "/inscription")!,
    SEARCH_INDEX.find((e) => e.url === "/faq")!,
    SEARCH_INDEX.find((e) => e.url === "/don")!,
  ].filter(Boolean);

  return (
    <>
      {/* BOUTON DANS LE NAVBAR */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Rechercher dans le site"
        title="Rechercher (Ctrl+K)"
        className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition"
      >
        <FaMagnifyingGlass className="text-sm" />
      </button>

      {/* OVERLAY DE RECHERCHE */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 sm:p-8"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Recherche dans le site"
        >
          <div
            className="w-full max-w-2xl bg-[#0A3D24] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#D4AF37]/30 overflow-hidden mt-12 sm:mt-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input + close */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-white/10">
              <FaMagnifyingGlass className="text-[#D4AF37] text-lg flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une page, une question, une commission…"
                className="flex-1 bg-transparent text-white text-base sm:text-lg placeholder:text-white/40 outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="text-white/50 hover:text-white text-xl flex-shrink-0"
              >
                <FaXmark />
              </button>
            </div>

            {/* Résultats / Suggestions */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.length < 2 ? (
                <>
                  <p className="px-4 sm:px-5 pt-4 pb-2 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]/70 font-bold">
                    Suggestions
                  </p>
                  <ul>
                    {SUGGESTIONS.map((entry, i) => (
                      <SearchResultRow
                        key={entry.url}
                        entry={entry}
                        active={i === activeIdx}
                        onClick={() => setOpen(false)}
                      />
                    ))}
                  </ul>
                </>
              ) : results.length === 0 ? (
                <div className="px-4 sm:px-5 py-12 text-center">
                  <p className="text-white/60 text-sm">
                    Aucun résultat pour « <span className="text-[#D4AF37]">{query}</span> »
                  </p>
                  <p className="text-white/40 text-xs mt-2">
                    Essayez d&apos;autres mots-clés ou{" "}
                    <Link
                      href="/contact"
                      onClick={() => setOpen(false)}
                      className="text-[#D4AF37] hover:underline"
                    >
                      contactez-nous
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <>
                  <p className="px-4 sm:px-5 pt-4 pb-2 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]/70 font-bold">
                    {results.length} résultat{results.length > 1 ? "s" : ""}
                  </p>
                  <ul>
                    {results.map((entry, i) => (
                      <SearchResultRow
                        key={entry.url + i}
                        entry={entry}
                        active={i === activeIdx}
                        onClick={() => setOpen(false)}
                      />
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Footer aide clavier */}
            <div className="px-4 sm:px-5 py-3 border-t border-white/10 flex flex-wrap items-center gap-3 sm:gap-5 text-[10px] sm:text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/70 font-mono">↑↓</kbd>
                naviguer
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/70 font-mono">↵</kbd>
                ouvrir
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/70 font-mono">esc</kbd>
                fermer
              </span>
              <span className="ml-auto hidden sm:inline">
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/70 font-mono">ctrl</kbd>
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/70 font-mono ml-0.5">k</kbd>{" "}
                pour rouvrir
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchResultRow({
  entry,
  active,
  onClick,
}: {
  entry: SearchEntry;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <Link
        href={entry.url}
        onClick={onClick}
        className={`flex items-start gap-3 px-4 sm:px-5 py-3 transition group ${
          active ? "bg-white/10" : "hover:bg-white/5"
        }`}
      >
        <span
          className={`text-base sm:text-lg mt-0.5 flex-shrink-0 ${CATEGORY_COLORS[entry.category]}`}
        >
          {CATEGORY_ICONS[entry.category]}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white text-sm sm:text-base font-semibold leading-snug">
              {entry.title}
            </p>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-white/40 font-bold">
              {entry.category}
            </span>
          </div>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5 truncate">
            {entry.description}
          </p>
        </div>
        <FaArrowRight
          className={`text-[#D4AF37] text-xs mt-1.5 flex-shrink-0 transition-transform ${
            active ? "translate-x-0.5" : "opacity-0 group-hover:opacity-100"
          }`}
        />
      </Link>
    </li>
  );
}
