"use client";

import { useEffect, useMemo, useState } from "react";
import { isFirebaseConfigured } from "@/lib/firebase";
import { listSalaatuLibrary } from "@/lib/admin-data";
import { SALAATU_FALLBACK, pickSalaatuOfTheDay } from "@/lib/salaatu-seed";
import { SalaatuLibraryItem, SALAATU_CATEGORIES } from "@/lib/admin-types";
import { useAuth } from "@/lib/auth-context";

export default function SalaatuLibrary() {
  const [items, setItems] = useState<SalaatuLibraryItem[]>(SALAATU_FALLBACK);
  const [category, setCategory] = useState<string>("Toutes");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    listSalaatuLibrary()
      .then((arr) => {
        if (arr.length > 0) setItems(arr);
      })
      .catch(() => {});
  }, []);

  const today = useMemo(() => pickSalaatuOfTheDay(items), [items]);

  const categories = useMemo(() => {
    const used = new Set(items.map((s) => s.category));
    return ["Toutes", ...SALAATU_CATEGORIES.filter((c) => used.has(c))];
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return items.filter((s) => {
      if (category !== "Toutes" && s.category !== category) return false;
      if (!q) return true;
      return `${s.title} ${s.translation ?? ""} ${s.transliteration ?? ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [items, category, search]);

  // Block right-click and common screenshot shortcuts when content visible
  useEffect(() => {
    if (!confirmed) return;
    const handler = (e: KeyboardEvent) => {
      // Block Print Screen (best effort — OS may capture before JS runs)
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && e.shiftKey && (e.key === "s" || e.key === "S")) ||
        (e.metaKey && e.shiftKey && /[3-5]/.test(e.key)) // macOS
      ) {
        e.preventDefault();
        // eslint-disable-next-line no-alert
        alert(
          "Les captures d'écran sont déconseillées pour ce contenu sacré. Merci de revenir consulter le site régulièrement."
        );
      }
    };
    window.addEventListener("keydown", handler);
    document.body.classList.add("salaatu-protected");
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.classList.remove("salaatu-protected");
    };
  }, [confirmed]);

  if (!confirmed) {
    return <ProtectionGate onAccept={() => setConfirmed(true)} count={items.length} />;
  }

  return (
    <section
      id="bibliotheque"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28 protected-content"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-16">
        <div className="text-center">
          <span className="uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
            Bibliothèque Sacrée
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F5132]">
            Bibliothèque des Salaats
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            {items.length} Salaat{items.length > 1 ? "s" : ""} avec arabe,
            translittération, traduction, bienfaits et secrets d&apos;utilisation.
            Consultez régulièrement — un nouveau Salaat est mis à l&apos;honneur
            chaque jour.
          </p>
        </div>

        {today && (
          <div className="mt-10 sm:mt-12 bg-gradient-to-br from-[#0F5132] to-[#082F22] rounded-[24px] sm:rounded-[35px] p-6 sm:p-10 text-white">
            <p className="uppercase tracking-[0.2em] text-[#D4AF37] text-xs sm:text-sm font-bold mb-2">
              Salaatu du jour — {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-bold">
              {today.title}
            </h3>
            <p className="font-arabic mt-5 text-2xl sm:text-3xl md:text-4xl leading-loose text-[#D4AF37] text-center" dir="rtl">
              {today.arabic}
            </p>
            {today.transliteration && (
              <p className="mt-5 italic font-display text-base sm:text-lg text-white/90 text-center">
                « {today.transliteration} »
              </p>
            )}
            {today.translation && (
              <p className="mt-3 text-sm sm:text-base text-white/80 text-center">
                {today.translation}
              </p>
            )}
          </div>
        )}

        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-3">
          <div className="flex flex-wrap gap-2 flex-1">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
                  c === category
                    ? "bg-[#0F5132] text-white"
                    : "bg-[#F8F5EF] text-[#0F5132] hover:bg-[#E8E6E1]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            type="search"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm text-[#0F5132] bg-white outline-none focus:border-[#0F5132] min-w-[180px]"
          />
        </div>

        <div className="mt-8 space-y-4">
          {filtered.length === 0 ? (
            <p className="text-center py-12 text-gray-500">
              Aucun Salaat ne correspond à ces critères.
            </p>
          ) : (
            filtered.map((s) => (
              <SalaatuCard
                key={s.id}
                item={s}
                isOpen={open === s.id}
                onToggle={() => setOpen(open === s.id ? null : s.id)}
              />
            ))
          )}
        </div>

        <Watermark />
      </div>
    </section>
  );
}

function SalaatuCard({
  item,
  isOpen,
  onToggle,
}: {
  item: SalaatuLibraryItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-[#F8F5EF] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#0F5132]/10">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-start px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between gap-4 hover:bg-[#F0EBDF] transition"
      >
        <div>
          <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
            {item.category}
          </p>
          <h3 className="font-display text-lg sm:text-xl font-bold text-[#0F5132] mt-0.5">
            {item.title}
          </h3>
        </div>
        <span className={`text-[#0F5132] transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
      </button>
      {isOpen && (
        <div className="px-5 sm:px-7 pb-6 sm:pb-8 border-t border-[#0F5132]/10">
          <p
            className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose text-[#0F5132] text-center mt-6"
            dir="rtl"
          >
            {item.arabic}
          </p>
          {item.transliteration && (
            <div className="mt-5">
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-1">
                Prononciation
              </p>
              <p className="italic text-sm sm:text-base text-[#0F5132] leading-7">
                « {item.transliteration} »
              </p>
            </div>
          )}
          {item.translation && (
            <div className="mt-5">
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-1">
                Traduction
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-7">
                {item.translation}
              </p>
            </div>
          )}
          {item.benefits && item.benefits.length > 0 && (
            <div className="mt-5">
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-2">
                Bienfaits
              </p>
              <ul className="space-y-1.5">
                {item.benefits.map((b, i) => (
                  <li
                    key={i}
                    className="text-sm sm:text-base text-[#0F5132] flex gap-2"
                  >
                    <span className="text-[#D4AF37]">✦</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {item.usageNotes && item.usageNotes.length > 0 && (
            <div className="mt-5">
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-2">
                Secrets & Pratique
              </p>
              <ul className="space-y-2">
                {item.usageNotes.map((n, i) => (
                  <li
                    key={i}
                    className="text-sm sm:text-base text-gray-700 leading-7 bg-white rounded-xl p-3 border border-[#0F5132]/10"
                  >
                    <span className="text-[#B8860B] font-bold mr-1.5">{i + 1}.</span>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProtectionGate({
  onAccept,
  count,
}: {
  onAccept: () => void;
  count: number;
}) {
  return (
    <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-gradient-to-br from-[#0F5132] to-[#082F22] rounded-[28px] sm:rounded-[40px] p-8 sm:p-12 text-center text-white">
        <p className="font-arabic text-3xl sm:text-4xl text-[#D4AF37]">صلى الله على محمد</p>
        <h2 className="font-display mt-4 text-2xl sm:text-3xl font-bold">
          Bibliothèque Sacrée des Salaats
        </h2>
        <p className="mt-5 text-white/80 leading-7 text-sm sm:text-base">
          Vous êtes sur le point d&apos;accéder à {count} Salaats avec leurs
          bienfaits et secrets d&apos;utilisation. Ce contenu est sacré.
        </p>
        <div className="mt-6 bg-white/5 border border-[#D4AF37]/30 rounded-2xl p-5 text-start text-sm text-white/80 leading-7">
          <p className="font-semibold text-[#D4AF37] mb-2">Engagement de respect</p>
          En continuant, vous vous engagez à :
          <ul className="mt-2 space-y-1.5">
            <li>✦ Ne pas faire de capture d&apos;écran de ce contenu</li>
            <li>✦ Ne pas diffuser ces secrets hors du Dahira</li>
            <li>✦ Revenir consulter régulièrement plutôt que sauvegarder</li>
            <li>✦ Respecter la transmission orale et spirituelle</li>
          </ul>
        </div>
        <button
          type="button"
          onClick={onAccept}
          className="mt-8 inline-flex bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition"
        >
          J&apos;accepte et j&apos;entre
        </button>
      </div>
    </section>
  );
}

function Watermark() {
  const [stamp, setStamp] = useState("");
  useEffect(() => {
    const now = new Date();
    setStamp(`KSN • ${now.toLocaleDateString("fr-FR")} ${now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`);
  }, []);
  return (
    <p className="mt-8 text-center text-xs text-gray-400 italic select-none">
      {stamp} — Contenu sacré, ne pas diffuser
    </p>
  );
}
