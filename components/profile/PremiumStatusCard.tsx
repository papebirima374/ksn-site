"use client";

import Link from "next/link";
import {
  FaCrown,
  FaArrowRight,
  FaCircleCheck,
  FaBookOpen,
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth-context";
import { hasPremium, PREMIUM_PRODUCTS } from "@/lib/admin-types";

/**
 * Carte affichée dans /espace-membre/profil — récapitulatif des accès
 * premium débloqués par l'utilisateur, avec CTA pour débloquer ceux
 * qui restent.
 *
 * IMPORTANT : indépendant de tout statut "Membre KSN officiel". Chacun
 * paye sa biblio, même les membres actifs du Dahira.
 */
export default function PremiumStatusCard() {
  const { user } = useAuth();
  if (!user) return null;

  const items = Object.entries(PREMIUM_PRODUCTS).map(([key, product]) => ({
    key: key as keyof typeof PREMIUM_PRODUCTS,
    product,
    unlocked: hasPremium(user, key as keyof typeof PREMIUM_PRODUCTS),
  }));

  const unlockedCount = items.filter((i) => i.unlocked).length;

  return (
    <div className="bg-gradient-to-br from-[#0F7C55]/5 to-[#D4AF37]/8 border border-[#D4AF37]/30 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <p className="text-[10px] uppercase tracking-widest text-[#B8860B] font-black inline-flex items-center gap-2">
          <FaCrown /> Mes accès premium
        </p>
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#0F7C55] bg-white border border-[#0F7C55]/20 px-2 py-0.5 rounded-full">
          {unlockedCount} / {items.length}
        </span>
      </div>

      <ul className="space-y-2">
        {items.map(({ key, product, unlocked }) => (
          <li
            key={key}
            className={`flex items-start gap-3 p-3 rounded-xl border transition ${
              unlocked
                ? "bg-emerald-50/50 border-emerald-200"
                : "bg-white border-gray-200 hover:border-[#D4AF37]/40"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${
                unlocked
                  ? "bg-emerald-500 text-white"
                  : "bg-[#D4AF37]/10 text-[#B8860B]"
              }`}
            >
              {unlocked ? <FaCircleCheck /> : <FaBookOpen />}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-bold text-sm ${
                  unlocked ? "text-emerald-900" : "text-[#0F7C55]"
                }`}
              >
                {product.label}
              </p>
              <p className="text-[11px] text-gray-600 leading-4 mt-0.5">
                {unlocked ? (
                  <>Accès débloqué à vie — bravo, profitez-en.</>
                ) : (
                  <>
                    {product.amount.toLocaleString("fr-FR")} FCFA · paiement
                    unique
                  </>
                )}
              </p>
            </div>
            {!unlocked && key === "salaatuLibrary" && (
              <Link
                href="/premium/bibliotheque"
                className="inline-flex items-center gap-1 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg whitespace-nowrap hover:scale-[1.04] transition"
              >
                Débloquer <FaArrowRight className="text-[8px]" />
              </Link>
            )}
            {unlocked && key === "salaatuLibrary" && (
              <Link
                href="/spiritualite#bibliotheque"
                className="inline-flex items-center gap-1 text-emerald-700 text-[10px] font-bold uppercase tracking-wider hover:underline whitespace-nowrap"
              >
                Ouvrir <FaArrowRight className="text-[8px]" />
              </Link>
            )}
          </li>
        ))}
      </ul>

      <p className="text-[10px] text-gray-500 mt-3 italic leading-4">
        Vos accès premium sont indépendants de votre statut de membre KSN.
        Ils vous suivent sur tous vos appareils.
      </p>
    </div>
  );
}
