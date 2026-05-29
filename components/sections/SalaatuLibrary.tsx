"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaLock, FaCrown, FaShieldHalved } from "react-icons/fa6";
import { isFirebaseConfigured } from "@/lib/firebase";
import { listSalaatuLibrary } from "@/lib/admin-data";
import { SALAATU_FALLBACK, pickSalaatuOfTheDay } from "@/lib/salaatu-seed";
import {
  SalaatuLibraryItem,
  SALAATU_CATEGORIES,
  hasPremium,
} from "@/lib/admin-types";
import { useAuth } from "@/lib/auth-context";
import { useProtectionShield } from "@/lib/protection";

const FREE_PREVIEW_COUNT = 2;

export default function SalaatuLibrary() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<SalaatuLibraryItem[]>(SALAATU_FALLBACK);
  const [category, setCategory] = useState<string>("Toutes");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // ─── GATING : par achat premium "salaatuLibrary", indépendant du
  // statut de membre KSN officiel. ──────────────────────────────────
  const isPremium = hasPremium(user, "salaatuLibrary");
  // Protection only applies once content is unlocked.
  const shield = useProtectionShield(isPremium);
  // Conserve un badge informatif pour les membres KSN officiels.
  const isOfficialMember = user?.memberStatus === "actif";

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

  if (authLoading) {
    return (
      <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-white/80 rounded-3xl p-12 text-center">
          <div className="w-12 h-12 mx-auto border-4 border-[#0F7C55]/20 border-t-[#D4AF37] rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section
      id="bibliotheque"
      className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28 ${isPremium ? "protected-content" : ""}`}
      onCopy={isPremium ? (e) => e.preventDefault() : undefined}
      onContextMenu={isPremium ? (e) => e.preventDefault() : undefined}
    >
      <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-16 relative">
        {isPremium && shield.hidden && <ShieldOverlay reason={shield.reason} />}

        <div className="text-center">
          {isPremium ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F7C55]/10 text-[#0F7C55] text-xs font-semibold mb-3">
              <FaShieldHalved className="text-[#D4AF37]" />
              Accès premium débloqué
              {isOfficialMember && (
                <span className="ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#B8860B] text-[10px] uppercase tracking-widest font-black">
                  <FaCrown className="text-[9px]" /> Membre KSN
                </span>
              )}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-3">
              <FaLock /> Aperçu · {FREE_PREVIEW_COUNT} Salaats sur {items.length} accessibles
            </div>
          )}
          <span className="block uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
            Bibliothèque Sacrée
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
            Bibliothèque des Salaats
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            {items.length} Salaat{items.length > 1 ? "s" : ""} avec arabe,
            translittération, traduction, bienfaits et secrets
            d&apos;utilisation. Le Salaatu du jour reste en accès libre — la
            bibliothèque complète s&apos;ouvre à vie avec un paiement unique
            de 1 000 FCFA.
          </p>
          {user && (
            <p className="mt-3 text-xs text-gray-400">
              Connecté en tant que <span className="font-semibold text-[#0F7C55]">{user.displayName || user.email}</span>
            </p>
          )}
        </div>

        {/* SALAATU DU JOUR — accès libre */}
        {today && (
          <div className="mt-10 sm:mt-12 bg-gradient-to-br from-[#0F7C55] to-[#082F22] rounded-[24px] sm:rounded-[35px] p-6 sm:p-10 text-white">
            <p className="uppercase tracking-[0.2em] text-[#D4AF37] text-xs sm:text-sm font-bold mb-2">
              Salaatu du jour — {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
              <span className="ml-2 inline-block bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full text-[10px]">Accès libre</span>
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

        {/* FILTERS */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-3">
          <div className="flex flex-wrap gap-2 flex-1">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
                  c === category ? "bg-[#0F7C55] text-white" : "bg-[#F8F5EF] text-[#0F7C55] hover:bg-[#E8E6E1]"
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
            className="rounded-full border border-gray-200 px-4 py-2 text-sm text-[#0F7C55] bg-white outline-none focus:border-[#0F7C55] min-w-[180px]"
          />
        </div>

        {/* LIST */}
        <div className="mt-8 space-y-4">
          {filtered.length === 0 ? (
            <p className="text-center py-12 text-gray-500">Aucun Salaat ne correspond à ces critères.</p>
          ) : (
            filtered.map((s, idx) => {
              const locked = !isPremium && idx >= FREE_PREVIEW_COUNT;
              return (
                <SalaatuCard
                  key={s.id}
                  item={s}
                  isOpen={open === s.id}
                  locked={locked}
                  onToggle={() => {
                    if (locked) {
                      setUpgradeOpen(true);
                    } else {
                      setOpen(open === s.id ? null : s.id);
                    }
                  }}
                  watermark={user?.email ?? ""}
                />
              );
            })
          )}
        </div>

        {!isPremium && (
          <div className="mt-12 bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-3xl p-6 sm:p-8 text-[#0F7C55] text-center shadow-lg">
            <FaCrown className="inline text-2xl mb-2" />
            <h3 className="font-display text-xl sm:text-2xl font-bold">
              Ouvrir la bibliothèque sacrée
            </h3>
            <p className="mt-2 text-sm leading-6 max-w-xl mx-auto">
              {items.length - FREE_PREVIEW_COUNT} Salaats supplémentaires
              avec leurs translittérations, traductions et secrets — accès
              permanent à vie pour <strong>1 000 FCFA</strong>.
            </p>
            <Link
              href="/premium/bibliotheque"
              className="inline-flex items-center mt-5 bg-[#0F7C55] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#0A3D24] transition"
            >
              Débloquer pour 1 000 FCFA →
            </Link>
            <p className="text-[11px] text-[#0F7C55]/70 mt-3 italic">
              Paiement unique via Wave · validation sous 24h ouvrées
            </p>
          </div>
        )}
      </div>

      {upgradeOpen && (
        <UpgradeModal
          onClose={() => setUpgradeOpen(false)}
          loggedIn={!!user}
        />
      )}
    </section>
  );
}

function SalaatuCard({
  item,
  isOpen,
  locked,
  onToggle,
  watermark,
}: {
  item: SalaatuLibraryItem;
  isOpen: boolean;
  locked: boolean;
  onToggle: () => void;
  watermark: string;
}) {
  return (
    <div className={`rounded-2xl sm:rounded-3xl overflow-hidden border relative transition ${
      locked ? "bg-gray-50 border-gray-200" : "bg-[#F8F5EF] border-[#0F7C55]/10"
    }`}>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full text-start px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between gap-4 transition ${
          locked ? "hover:bg-gray-100" : "hover:bg-[#F0EBDF]"
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
              {item.category}
            </p>
            {locked && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                <FaLock className="w-2.5 h-2.5" /> Réservé Membres
              </span>
            )}
          </div>
          <h3 className={`font-display text-lg sm:text-xl font-bold mt-0.5 ${locked ? "text-gray-400" : "text-[#0F7C55]"}`}>
            {item.title}
          </h3>
        </div>
        {locked ? (
          <FaLock className="text-gray-400" />
        ) : (
          <span className={`text-[#0F7C55] transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
        )}
      </button>
      {!locked && isOpen && (
        <div className="px-5 sm:px-7 pb-6 sm:pb-8 border-t border-[#0F7C55]/10 relative">
          {watermark && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] -rotate-12 select-none">
              <p className="font-display text-3xl text-[#0F7C55] tracking-widest">{watermark}</p>
            </div>
          )}
          <p className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose text-[#0F7C55] text-center mt-6 relative" dir="rtl">
            {item.arabic}
          </p>
          {item.transliteration && (
            <div className="mt-5 relative">
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-1">Prononciation</p>
              <p className="italic text-sm sm:text-base text-[#0F7C55] leading-7">« {item.transliteration} »</p>
            </div>
          )}
          {item.translation && (
            <div className="mt-5 relative">
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-1">Traduction</p>
              <p className="text-sm sm:text-base text-gray-700 leading-7">{item.translation}</p>
            </div>
          )}
          {item.benefits && item.benefits.length > 0 && (
            <div className="mt-5 relative">
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-2">Bienfaits</p>
              <ul className="space-y-1.5">
                {item.benefits.map((b, i) => (
                  <li key={i} className="text-sm sm:text-base text-[#0F7C55] flex gap-2">
                    <span className="text-[#D4AF37]">✦</span><span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {item.usageNotes && item.usageNotes.length > 0 && (
            <div className="mt-5 relative">
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-2">Secrets & Pratique</p>
              <ul className="space-y-2">
                {item.usageNotes.map((n, i) => (
                  <li key={i} className="text-sm sm:text-base text-gray-700 leading-7 bg-white rounded-xl p-3 border border-[#0F7C55]/10">
                    <span className="text-[#B8860B] font-bold mr-1.5">{i + 1}.</span>{n}
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

function UpgradeModal({
  onClose,
  loggedIn,
}: {
  onClose: () => void;
  loggedIn: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-[#0F7C55] text-2xl">
          <FaCrown />
        </div>
        <h2 className="font-display mt-4 text-2xl font-bold text-[#0F7C55]">
          Salaat verrouillé
        </h2>
        <p className="mt-3 text-gray-600 text-sm leading-7">
          Ce contenu sacré fait partie du <strong>premium</strong>.
          Débloquez l&apos;intégralité de la bibliothèque (texte arabe,
          translittération, traduction, bienfaits et secrets) pour un
          paiement unique de <strong>1 000 FCFA</strong> via Wave.
        </p>
        <p className="text-[11px] text-gray-500 mt-2 italic">
          Accès à vie sur tous vos appareils.
        </p>

        <div className="mt-5 space-y-2">
          <Link
            href={
              loggedIn
                ? "/premium/bibliotheque"
                : "/espace-membre?next=/premium/bibliotheque"
            }
            className="block w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-3 rounded-xl font-bold hover:scale-[1.02] transition"
          >
            {loggedIn ? "Débloquer maintenant →" : "Créer un compte pour débloquer →"}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="block w-full bg-gray-100 text-[#0F7C55] py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 transition"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}

function ShieldOverlay({ reason }: { reason: string }) {
  return (
    <div className="absolute inset-0 z-30 bg-[#082F22]/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 rounded-[28px] sm:rounded-[45px]">
      <div className="w-20 h-20 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
        <FaShieldHalved className="text-[#D4AF37] text-4xl" />
      </div>
      <h3 className="font-display mt-5 text-2xl sm:text-3xl font-bold text-white">Contenu protégé</h3>
      <p className="mt-3 text-white/80 max-w-md text-sm sm:text-base">{reason}</p>
    </div>
  );
}
