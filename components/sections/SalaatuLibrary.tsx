"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaLock, FaRightToBracket, FaUserPlus, FaShieldHalved } from "react-icons/fa6";
import { isFirebaseConfigured } from "@/lib/firebase";
import { listSalaatuLibrary } from "@/lib/admin-data";
import { SALAATU_FALLBACK, pickSalaatuOfTheDay } from "@/lib/salaatu-seed";
import { SalaatuLibraryItem, SALAATU_CATEGORIES } from "@/lib/admin-types";
import { useAuth } from "@/lib/auth-context";
import { useProtectionShield } from "@/lib/protection";

export default function SalaatuLibrary() {
  const { user, loading: authLoading, configured } = useAuth();
  const [items, setItems] = useState<SalaatuLibraryItem[]>(SALAATU_FALLBACK);
  const [category, setCategory] = useState<string>("Toutes");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const protectionEnabled = Boolean(user);
  const shield = useProtectionShield(protectionEnabled);

  useEffect(() => {
    if (!isFirebaseConfigured() || !user) return;
    listSalaatuLibrary()
      .then((arr) => {
        if (arr.length > 0) setItems(arr);
      })
      .catch(() => {});
  }, [user]);

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

  // While Firebase auth is still resolving, show a skeleton
  if (authLoading) {
    return (
      <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-white/80 rounded-3xl p-12 text-center">
          <div className="w-12 h-12 mx-auto border-4 border-[#0F5132]/20 border-t-[#D4AF37] rounded-full animate-spin" />
          <p className="mt-4 text-gray-500 text-sm">Vérification…</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return <AuthGate configured={configured} />;
  }

  return (
    <section
      id="bibliotheque"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28 protected-content"
      onCopy={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-16 relative">
        {shield.hidden && <ShieldOverlay reason={shield.reason} />}

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F5132]/10 text-[#0F5132] text-xs font-semibold mb-3">
            <FaShieldHalved className="text-[#D4AF37]" /> Contenu protégé
          </div>
          <span className="block uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
            Bibliothèque Sacrée
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F5132]">
            Bibliothèque des Salaats
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            {items.length} Salaat{items.length > 1 ? "s" : ""} avec arabe,
            translittération, traduction, bienfaits et secrets d&apos;utilisation.
            Consultez régulièrement — un Salaatu est mis à l&apos;honneur chaque jour.
          </p>
          <p className="mt-3 text-xs text-gray-400">
            Connecté en tant que <span className="font-semibold text-[#0F5132]">{user.displayName || user.email}</span>
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
                watermark={`${user.email}`}
              />
            ))
          )}
        </div>

        <Watermark email={user.email} />
      </div>
    </section>
  );
}

function AuthGate({ configured }: { configured: boolean }) {
  return (
    <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-gradient-to-br from-[#0F5132] to-[#082F22] rounded-[28px] sm:rounded-[40px] p-8 sm:p-12 text-center text-white">
        <p className="font-arabic text-3xl sm:text-4xl text-[#D4AF37]">صلى الله على محمد</p>
        <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-white/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold">
          <FaLock /> Accès réservé aux membres
        </div>
        <h2 className="font-display mt-4 text-2xl sm:text-3xl font-bold">
          Bibliothèque Sacrée des Salaats
        </h2>
        <p className="mt-5 text-white/80 leading-7 text-sm sm:text-base max-w-xl mx-auto">
          Cette bibliothèque contient les secrets et bienfaits des Salaats sur
          le Prophète Muhammad ﷺ. L&apos;accès est protégé : créez un compte
          membre ou connectez-vous pour la consulter.
        </p>

        <div className="mt-6 bg-white/5 border border-[#D4AF37]/30 rounded-2xl p-5 text-start text-sm text-white/80 leading-7">
          <p className="font-semibold text-[#D4AF37] mb-2">Engagement de respect</p>
          <ul className="space-y-1.5">
            <li>✦ Ne pas faire de capture d&apos;écran de ce contenu sacré</li>
            <li>✦ Ne pas diffuser ces secrets hors du Dahira</li>
            <li>✦ Revenir consulter régulièrement plutôt que sauvegarder</li>
            <li>✦ Respecter la transmission orale et spirituelle</li>
          </ul>
        </div>

        {!configured ? (
          <p className="mt-6 text-sm text-amber-200 bg-amber-900/30 border border-amber-700/30 rounded-xl p-3">
            Le service d&apos;authentification n&apos;est pas configuré. Contactez l&apos;administrateur.
          </p>
        ) : (
          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <Link
              href="/espace-membre?next=/spiritualite%23bibliotheque"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] px-6 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition"
            >
              <FaRightToBracket /> Se connecter
            </Link>
            <Link
              href="/espace-membre?next=/spiritualite%23bibliotheque"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] px-6 py-4 rounded-2xl font-bold hover:bg-white/15 transition"
            >
              <FaUserPlus /> Créer un compte
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function ShieldOverlay({ reason }: { reason: string }) {
  return (
    <div className="absolute inset-0 z-30 bg-[#082F22]/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 rounded-[28px] sm:rounded-[45px]">
      <div className="w-20 h-20 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
        <FaShieldHalved className="text-[#D4AF37] text-4xl" />
      </div>
      <h3 className="font-display mt-5 text-2xl sm:text-3xl font-bold text-white">
        Contenu protégé
      </h3>
      <p className="mt-3 text-white/80 max-w-md text-sm sm:text-base">{reason}</p>
      <p className="mt-6 text-xs text-white/50 italic max-w-sm">
        La bibliothèque se masque automatiquement lors d&apos;une tentative de
        capture, d&apos;impression ou si la fenêtre passe à l&apos;arrière-plan.
      </p>
    </div>
  );
}

function SalaatuCard({
  item,
  isOpen,
  onToggle,
  watermark,
}: {
  item: SalaatuLibraryItem;
  isOpen: boolean;
  onToggle: () => void;
  watermark: string;
}) {
  return (
    <div className="bg-[#F8F5EF] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#0F5132]/10 relative">
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
        <div className="px-5 sm:px-7 pb-6 sm:pb-8 border-t border-[#0F5132]/10 relative">
          {/* Per-card faint watermark */}
          <div className="absolute inset-0 flex flex-wrap items-center justify-around gap-x-12 gap-y-16 pointer-events-none opacity-[0.08] -rotate-12 select-none overflow-hidden py-12">
            <p className="font-display text-lg text-[#0F5132] font-semibold tracking-wider">{watermark}</p>
            <p className="font-display text-lg text-[#0F5132] font-semibold tracking-wider">{watermark}</p>
            <p className="font-display text-lg text-[#0F5132] font-semibold tracking-wider">{watermark}</p>
            <p className="font-display text-lg text-[#0F5132] font-semibold tracking-wider">{watermark}</p>
          </div>

          <p
            className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose text-[#0F5132] text-center mt-6 relative"
            dir="rtl"
          >
            {item.arabic}
          </p>
          {item.transliteration && (
            <div className="mt-5 relative">
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-1">
                Prononciation
              </p>
              <p className="italic text-sm sm:text-base text-[#0F5132] leading-7">
                « {item.transliteration} »
              </p>
            </div>
          )}
          {item.translation && (
            <div className="mt-5 relative">
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-1">
                Traduction
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-7">
                {item.translation}
              </p>
            </div>
          )}
          {item.benefits && item.benefits.length > 0 && (
            <div className="mt-5 relative">
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
            <div className="mt-5 relative">
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

function Watermark({ email }: { email: string }) {
  const [stamp, setStamp] = useState("");
  useEffect(() => {
    const now = new Date();
    const formatted = `${email} · ${now.toLocaleDateString("fr-FR")} ${now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
    setTimeout(() => {
      setStamp(formatted);
    }, 0);
  }, [email]);
  return (
    <p className="mt-8 text-center text-xs text-gray-400 italic select-none">
      {stamp} — Contenu sacré, ne pas diffuser
    </p>
  );
}
