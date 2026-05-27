"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FaLock,
  FaRightToBracket,
  FaUserPlus,
  FaShieldHalved,
  FaXmark,
  FaHourglassHalf,
} from "react-icons/fa6";
import { isFirebaseConfigured } from "@/lib/firebase";
import { listSalaatuLibrary } from "@/lib/admin-data";
import { SALAATU_FALLBACK, pickSalaatuOfTheDay } from "@/lib/salaatu-seed";
import { SalaatuLibraryItem, SALAATU_CATEGORIES } from "@/lib/admin-types";
import { useAuth } from "@/lib/auth-context";
import { useProtectionShield } from "@/lib/protection";
import { PAYMENT } from "@/lib/constants";

export default function SalaatuLibrary() {
  const { user, loading: authLoading, configured } = useAuth();
  const [items, setItems] = useState<SalaatuLibraryItem[]>(SALAATU_FALLBACK);
  const [category, setCategory] = useState<string>("Toutes");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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

  const isActive = user?.memberStatus === "actif" || user?.role === "admin";

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
          {!isActive && (
            <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200/50 rounded-xl px-4 py-2 inline-block">
              🔒 Mode aperçu : 2 Salaats accessibles. Devenez membre actif pour débloquer l&apos;intégralité.
            </p>
          )}
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
            filtered.map((s, index) => (
              <SalaatuCard
                key={s.id}
                item={s}
                isOpen={open === s.id}
                onToggle={() => setOpen(open === s.id ? null : s.id)}
                watermark={`${user.email}`}
                isLocked={!isActive && index >= 2}
                onLockedClick={() => setShowUpgradeModal(true)}
              />
            ))
          )}
        </div>

        <Watermark email={user.email} />
      </div>

      {/* Upgrade / Subscription Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border border-gray-50 text-center space-y-6 animate-in fade-in zoom-in duration-200">
            <button
              type="button"
              onClick={() => setShowUpgradeModal(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
            >
              <FaXmark className="text-base" />
            </button>

            {user.memberStatus === "en_attente" ? (
              <>
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-amber-600 text-3xl">
                  <FaHourglassHalf className="animate-spin duration-1000" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-[#0F5132]">
                    Validation en cours
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Votre demande d&apos;adhésion active a bien été transmise à notre commission administrative. Elle est en attente de traitement.
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left space-y-2">
                  <p className="text-xs text-amber-900 leading-relaxed font-semibold">
                    Pour finaliser, assurez-vous d&apos;avoir réglé la cotisation unique de 1000 FCFA pour votre carte :
                  </p>
                  <a
                    href={PAYMENT.membershipWave}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#10c3af] text-white py-2.5 rounded-xl font-bold hover:scale-[1.01] transition text-xs shadow-sm"
                  >
                    Régler 1000 FCFA via Wave
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center text-red-600 text-2xl">
                  <FaLock />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-[#0F5132]">
                    Débloquer la Bibliothèque Sacrée
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    L&apos;accès complet à tous les secrets spirituels, prononciations et bienfaits est réservé aux membres officiels actifs de la KSN.
                  </p>
                </div>
                <div className="bg-[#F8F5EF] rounded-2xl p-4 text-left space-y-3">
                  <h4 className="font-display font-bold text-[#0F5132] text-xs">
                    Pour obtenir votre accès :
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold">1.</span>
                      <span>Complétez votre profil avec votre photo (obligatoire pour votre carte d&apos;adhérent).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold">2.</span>
                      <span>Réglez la cotisation unique de 1000 FCFA via Wave.</span>
                    </li>
                  </ul>
                  <Link
                    href="/espace-membre"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0F5132] text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition text-sm shadow-md"
                  >
                    Activer mon compte membre
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
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
  isLocked,
  onLockedClick,
}: {
  item: SalaatuLibraryItem;
  isOpen: boolean;
  onToggle: () => void;
  watermark: string;
  isLocked?: boolean;
  onLockedClick?: () => void;
}) {
  return (
    <div className="bg-[#F8F5EF] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#0F5132]/10 relative">
      <button
        type="button"
        onClick={isLocked ? onLockedClick : onToggle}
        className="w-full text-start px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between gap-4 hover:bg-[#F0EBDF] transition"
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold flex items-center gap-2">
            <span>{item.category}</span>
            {isLocked && (
              <span className="inline-flex items-center gap-1 bg-[#B8860B]/10 text-[#B8860B] text-[8px] sm:text-[9px] px-2 py-0.5 rounded font-extrabold tracking-wider uppercase">
                <FaLock className="text-[8px]" /> Réservé Membres
              </span>
            )}
          </p>
          <h3 className="font-display text-lg sm:text-xl font-bold text-[#0F5132] mt-0.5 truncate">
            {item.title}
          </h3>
        </div>
        {isLocked ? (
          <div className="w-8 h-8 rounded-full bg-[#B8860B]/10 flex items-center justify-center text-[#B8860B] flex-shrink-0">
            <FaLock className="text-xs" />
          </div>
        ) : (
          <span className={`text-[#0F5132] transition-transform ${isOpen ? "rotate-180" : ""} flex-shrink-0`}>▾</span>
        )}
      </button>

      {isOpen && !isLocked && (
        <div className="px-5 sm:px-7 pb-6 sm:pb-8 border-t border-[#0F5132]/10 relative">
          {/* Per-card faint watermark */}
          <div className="absolute inset-0 grid grid-cols-2 gap-x-6 gap-y-10 items-center justify-items-center pointer-events-none opacity-[0.14] -rotate-12 select-none overflow-hidden py-16">
            <p className="font-display text-base text-[#0F5132] font-extrabold tracking-widest">{watermark}</p>
            <p className="font-display text-base text-[#0F5132] font-extrabold tracking-widest">{watermark}</p>
            <p className="font-display text-base text-[#0F5132] font-extrabold tracking-widest">{watermark}</p>
            <p className="font-display text-base text-[#0F5132] font-extrabold tracking-widest">{watermark}</p>
            <p className="font-display text-base text-[#0F5132] font-extrabold tracking-widest">{watermark}</p>
            <p className="font-display text-base text-[#0F5132] font-extrabold tracking-widest">{watermark}</p>
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
