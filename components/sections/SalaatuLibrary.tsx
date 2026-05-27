"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaLock, FaCrown, FaShieldHalved, FaClock } from "react-icons/fa6";
import { isFirebaseConfigured } from "@/lib/firebase";
import { listSalaatuLibrary } from "@/lib/admin-data";
import { SALAATU_FALLBACK, pickSalaatuOfTheDay } from "@/lib/salaatu-seed";
import { SalaatuLibraryItem, SALAATU_CATEGORIES } from "@/lib/admin-types";
import { useAuth } from "@/lib/auth-context";
import { useProtectionShield } from "@/lib/protection";
import { PAYMENT } from "@/lib/constants";

const FREE_PREVIEW_COUNT = 2;

export default function SalaatuLibrary() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<SalaatuLibraryItem[]>(SALAATU_FALLBACK);
  const [category, setCategory] = useState<string>("Toutes");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const status = user?.memberStatus ?? "inactif";
  const isActive = status === "actif";
  // Protection only applies for active members (they see the full content).
  // Visitors see the public preview without the aggressive blur.
  const shield = useProtectionShield(isActive);

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
          <div className="w-12 h-12 mx-auto border-4 border-[#0F5132]/20 border-t-[#D4AF37] rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section
      id="bibliotheque"
      className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28 ${isActive ? "protected-content" : ""}`}
      onCopy={isActive ? (e) => e.preventDefault() : undefined}
      onContextMenu={isActive ? (e) => e.preventDefault() : undefined}
    >
      <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-16 relative">
        {isActive && shield.hidden && <ShieldOverlay reason={shield.reason} />}

        <div className="text-center">
          {isActive ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F5132]/10 text-[#0F5132] text-xs font-semibold mb-3">
              <FaShieldHalved className="text-[#D4AF37]" /> Contenu protégé · Membre Actif
            </div>
          ) : !user ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-3">
              <FaLock /> Aperçu visiteur · 2 Salaats sur {items.length} accessibles
            </div>
          ) : status === "en_attente" ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-3">
              <FaClock /> En attente de validation · Réglez 1 000 FCFA pour débloquer
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-3">
              <FaLock /> Aperçu visiteur · Devenez membre actif pour tout débloquer
            </div>
          )}
          <span className="block uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
            Bibliothèque Sacrée
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F5132]">
            Bibliothèque des Salaats
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            {items.length} Salaat{items.length > 1 ? "s" : ""} avec arabe,
            translittération, traduction, bienfaits et secrets d&apos;utilisation.
            Le Salaatu du jour est en accès libre — la bibliothèque complète est
            réservée aux membres actifs.
          </p>
          {user && (
            <p className="mt-3 text-xs text-gray-400">
              Connecté en tant que <span className="font-semibold text-[#0F5132]">{user.displayName || user.email}</span>
            </p>
          )}
        </div>

        {/* SALAATU DU JOUR — accès libre */}
        {today && (
          <div className="mt-10 sm:mt-12 bg-gradient-to-br from-[#0F5132] to-[#082F22] rounded-[24px] sm:rounded-[35px] p-6 sm:p-10 text-white">
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
                  c === category ? "bg-[#0F5132] text-white" : "bg-[#F8F5EF] text-[#0F5132] hover:bg-[#E8E6E1]"
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

        {/* LIST */}
        <div className="mt-8 space-y-4">
          {filtered.length === 0 ? (
            <p className="text-center py-12 text-gray-500">Aucun Salaat ne correspond à ces critères.</p>
          ) : (
            filtered.map((s, idx) => {
              const locked = !isActive && idx >= FREE_PREVIEW_COUNT;
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

        {!isActive && (
          <div className="mt-12 bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-3xl p-6 sm:p-8 text-[#0F5132] text-center">
            <FaCrown className="inline text-2xl mb-2" />
            <h3 className="font-display text-xl sm:text-2xl font-bold">
              Débloquer la bibliothèque complète
            </h3>
            <p className="mt-2 text-sm leading-6 max-w-xl mx-auto">
              {items.length - FREE_PREVIEW_COUNT} Salaats supplémentaires + leurs secrets sont réservés aux membres actifs.
            </p>
            <Link
              href="/espace-membre/profil"
              className="inline-flex items-center mt-5 bg-[#0F5132] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#0A3D24] transition"
            >
              Devenir Membre Actif →
            </Link>
          </div>
        )}
      </div>

      {upgradeOpen && <UpgradeModal onClose={() => setUpgradeOpen(false)} status={status} loggedIn={!!user} />}
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
      locked ? "bg-gray-50 border-gray-200" : "bg-[#F8F5EF] border-[#0F5132]/10"
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
          <h3 className={`font-display text-lg sm:text-xl font-bold mt-0.5 ${locked ? "text-gray-400" : "text-[#0F5132]"}`}>
            {item.title}
          </h3>
        </div>
        {locked ? (
          <FaLock className="text-gray-400" />
        ) : (
          <span className={`text-[#0F5132] transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
        )}
      </button>
      {!locked && isOpen && (
        <div className="px-5 sm:px-7 pb-6 sm:pb-8 border-t border-[#0F5132]/10 relative">
          {watermark && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] -rotate-12 select-none">
              <p className="font-display text-3xl text-[#0F5132] tracking-widest">{watermark}</p>
            </div>
          )}
          <p className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-loose text-[#0F5132] text-center mt-6 relative" dir="rtl">
            {item.arabic}
          </p>
          {item.transliteration && (
            <div className="mt-5 relative">
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-1">Prononciation</p>
              <p className="italic text-sm sm:text-base text-[#0F5132] leading-7">« {item.transliteration} »</p>
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
                  <li key={i} className="text-sm sm:text-base text-[#0F5132] flex gap-2">
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
                  <li key={i} className="text-sm sm:text-base text-gray-700 leading-7 bg-white rounded-xl p-3 border border-[#0F5132]/10">
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
  status,
  loggedIn,
}: {
  onClose: () => void;
  status: "actif" | "en_attente" | "inactif";
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
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#B8860B] to-[#D4AF37] flex items-center justify-center text-[#0F5132] text-2xl">
          {status === "en_attente" ? <FaClock /> : <FaCrown />}
        </div>
        <h2 className="font-display mt-4 text-2xl font-bold text-[#0F5132]">
          {status === "en_attente" ? "Validation en cours" : "Adhésion membre actif"}
        </h2>
        <p className="mt-3 text-gray-600 text-sm leading-7">
          {status === "en_attente"
            ? "Votre demande est en attente. Réglez la cotisation de 1 000 FCFA via Wave — votre statut passera automatiquement à Actif et la bibliothèque complète sera débloquée."
            : "L'accès complet à la bibliothèque des Salaats (texte arabe, translittération, traduction, bienfaits et secrets d'utilisation) est réservé aux membres actifs. La cotisation est de 1 000 FCFA."}
        </p>

        <div className="mt-5 space-y-2">
          {status === "en_attente" ? (
            <a
              href={PAYMENT.membershipWave}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#1DCEDB] hover:bg-[#16b8c4] text-white py-3 rounded-xl font-bold"
            >
              Payer 1 000 FCFA via Wave
            </a>
          ) : (
            <Link
              href={loggedIn ? "/espace-membre/profil" : "/espace-membre?next=/espace-membre/profil"}
              className="block w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-3 rounded-xl font-bold"
            >
              {loggedIn ? "Compléter mon profil →" : "Créer un compte →"}
            </Link>
          )}
          <button
            type="button"
            onClick={onClose}
            className="block w-full bg-gray-100 text-[#0F5132] py-3 rounded-xl font-semibold text-sm"
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
