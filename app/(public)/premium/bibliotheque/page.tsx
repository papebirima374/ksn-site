"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaCrown,
  FaCircleCheck,
  FaClock,
  FaCircleXmark,
  FaCircleInfo,
  FaArrowRight,
  FaBookOpen,
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth-context";
import {
  createPremiumPurchase,
  listUserPremiumPurchases,
} from "@/lib/admin-data";
import {
  hasPremium,
  PREMIUM_PRODUCTS,
  PremiumPurchase,
} from "@/lib/admin-types";
import { PAYMENT } from "@/lib/constants";
import WaveLogo from "@/components/ui/WaveLogo";

const PRODUCT = PREMIUM_PRODUCTS.salaatuLibrary;

export default function PremiumBibliothequePage() {
  const { user, loading: authLoading } = useAuth();

  const [myPurchases, setMyPurchases] = useState<PremiumPurchase[]>([]);
  const [, setLoadingPurchases] = useState(true);

  // Form
  const [transactionRef, setTransactionRef] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    const t = setTimeout(() => {
      if (!user) {
        setLoadingPurchases(false);
        return;
      }
      listUserPremiumPurchases(user.uid)
        .then((p) =>
          setMyPurchases(p.filter((x) => x.productKey === "salaatuLibrary"))
        )
        .catch((e) => console.error(e))
        .finally(() => setLoadingPurchases(false));
    }, 0);
    return () => clearTimeout(t);
  }, [user, authLoading]);

  const isAlreadyPremium = hasPremium(user, "salaatuLibrary");
  const pending = myPurchases.find((p) => p.status === "pending_review");
  const lastRejected = myPurchases.find((p) => p.status === "rejected");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError("");
    setSubmitting(true);
    try {
      await createPremiumPurchase({
        userId: user.uid,
        userEmail: user.email,
        userPhone: user.phone,
        userDisplayName: user.displayName,
        productKey: "salaatuLibrary",
        amount: PRODUCT.amount,
        method: "wave",
        applicantTransactionRef: transactionRef.trim() || undefined,
        applicantNote: note.trim() || undefined,
      });
      const fresh = await listUserPremiumPurchases(user.uid);
      setMyPurchases(fresh.filter((x) => x.productKey === "salaatuLibrary"));
      setSuccess(true);
      setTransactionRef("");
      setNote("");
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      // Cas Firestore permission-denied → diagnostic ciblé pour l'utilisateur
      if (msg.includes("permission-denied")) {
        setError(
          "Permission refusée par le serveur. Reconnectez-vous puis réessayez. Si le problème persiste, contactez-nous sur WhatsApp."
        );
      } else if (msg.includes("invalid-argument") || msg.includes("invalid data")) {
        setError(
          "Données invalides. Vérifiez votre référence Wave puis réessayez."
        );
      } else if (msg.includes("network") || msg.includes("unavailable")) {
        setError(
          "Problème de réseau. Vérifiez votre connexion et réessayez."
        );
      } else {
        setError(
          `Impossible d'envoyer la demande : ${msg}. Réessayez ou contactez-nous sur WhatsApp.`
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  // ─── ÉTAT : utilisateur déjà premium ────────────────────────────────
  if (!authLoading && isAlreadyPremium) {
    return (
      <main className="relative z-10 min-h-screen pt-32 sm:pt-40 pb-20 max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-[30px] shadow-xl p-8 sm:p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#B8860B] to-[#D4AF37] text-[#0F7C55] flex items-center justify-center text-3xl shadow-md mb-4">
            <FaCrown />
          </div>
          <p className="text-[#B8860B] text-[10px] uppercase tracking-[0.3em] font-black">
            Accès débloqué
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[#0F7C55] mt-2">
            La bibliothèque vous est ouverte
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-3 max-w-md mx-auto leading-6">
            Alhamdoulillah, votre paiement a été validé. Vous avez désormais
            accès <strong>à vie</strong> à toute la bibliothèque des Salaatu,
            sur tous vos appareils.
          </p>
          <Link
            href="/spiritualite#bibliotheque"
            className="inline-flex items-center gap-2 mt-6 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] text-white font-bold px-6 py-3 rounded-2xl shadow-md hover:scale-[1.02] transition text-sm"
          >
            <FaBookOpen /> Ouvrir la bibliothèque <FaArrowRight />
          </Link>
        </div>
      </main>
    );
  }

  // ─── ÉTAT : non connecté ────────────────────────────────────────────
  if (!authLoading && !user) {
    return (
      <main className="relative z-10 min-h-screen pt-32 sm:pt-40 pb-20 max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-[30px] shadow-xl p-8 sm:p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0F7C55]/10 text-[#0F7C55] flex items-center justify-center text-3xl mb-4">
            <FaCrown />
          </div>
          <p className="text-[#B8860B] text-[10px] uppercase tracking-[0.3em] font-black">
            Connexion requise
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[#0F7C55] mt-2">
            Un compte pour débloquer à vie
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-3 leading-6 max-w-md mx-auto">
            Votre achat est lié à votre compte site KSN. Il vous suit sur
            tous vos appareils et reste accessible{" "}
            <strong>en permanence</strong>.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] text-white font-bold px-6 py-3 rounded-2xl shadow-md hover:scale-[1.02] transition text-sm"
            >
              Créer un compte (30 sec.)
            </Link>
            <Link
              href={`/espace-membre?next=${encodeURIComponent("/premium/bibliotheque")}`}
              className="inline-flex items-center justify-center gap-2 border border-[#0F7C55] text-[#0F7C55] font-bold px-6 py-3 rounded-2xl text-sm"
            >
              J&apos;ai déjà un compte
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ─── ÉTAT : commande en attente de validation ───────────────────────
  if (pending && !success) {
    return (
      <main className="relative z-10 min-h-screen pt-32 sm:pt-40 pb-20 max-w-2xl mx-auto px-4 sm:px-6">
        <PendingCard pending={pending} />
      </main>
    );
  }

  // ─── ÉTAT NORMAL : page d'achat ─────────────────────────────────────
  return (
    <main className="relative z-10 min-h-screen pt-32 sm:pt-40 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* ─── Hero spirituel ─── */}
        <header className="text-center mb-10">
          <div className="font-arabic text-2xl sm:text-3xl text-[#D4AF37]">
            صلوا عليه وسلموا تسليما
          </div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#B8860B] text-[10px] uppercase tracking-widest font-bold mt-5">
            <FaCrown /> Premium · Paiement unique
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white mt-3 leading-tight">
            Ouvrir la bibliothèque
            <br />
            <span className="bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#F5D76E] bg-clip-text text-transparent">
              des Salaatu sacrés
            </span>
          </h1>
          <p className="text-white/75 text-sm sm:text-base mt-5 max-w-2xl mx-auto leading-7">
            « Celui qui prie sur moi une fois, Allah prie sur lui dix fois. »
            <br />
            <span className="text-xs text-white/50">
              — Le Prophète Muhammad ﷺ (rapporté par Muslim)
            </span>
          </p>
        </header>

        {/* ─── Carte de valeur + Wave ─── */}
        <section className="grid lg:grid-cols-5 gap-5 sm:gap-6 mb-8">
          {/* Bénéfices */}
          <div className="lg:col-span-3 bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0F7C55]">
              {PRODUCT.label}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 leading-6">
              {PRODUCT.description}
            </p>

            <ul className="mt-5 space-y-3">
              {PRODUCT.perks.map((p) => (
                <li
                  key={p}
                  className="flex gap-3 items-start text-sm text-gray-700"
                >
                  <FaCircleCheck className="text-[#0F7C55] flex-shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-5 border-t border-gray-100 text-xs text-gray-500 leading-5 italic">
              Votre paiement est un soutien à la mission spirituelle KSN.
              Le contenu reste accessible à vie sur votre compte.
            </div>
          </div>

          {/* Wave card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#0F7C55] to-[#082F22] text-white rounded-[28px] p-6 sm:p-8 shadow-2xl">
            <WaveLogo className="w-14 h-14 text-base mb-4" />
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold">
              Paiement unique · Wave
            </p>
            <p className="font-display text-5xl font-bold tabular-nums mt-2">
              {PRODUCT.amount.toLocaleString("fr-FR")}
              <span className="text-base font-normal text-white/70 ml-2">
                FCFA
              </span>
            </p>
            <p className="text-xs text-white/60 mt-1">
              Frais Wave inclus dans le lien
            </p>

            <a
              href={PAYMENT.premiumSalaatuLibraryWave}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center w-full gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold px-5 py-3.5 rounded-2xl shadow-xl hover:scale-[1.02] transition text-sm"
            >
              Payer avec Wave →
            </a>
            <p className="text-[11px] text-white/60 mt-3 leading-5">
              Une fois le paiement effectué via Wave, revenez sur cette page
              et soumettez le numéro de transaction ci-dessous.
            </p>
          </div>
        </section>

        {/* ─── Formulaire de soumission preuve ─── */}
        <section className="bg-white rounded-[28px] p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <div className="mb-5">
            <p className="text-[#B8860B] text-[10px] uppercase tracking-widest font-black">
              Étape finale · Validation
            </p>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0F7C55] mt-1">
              J&apos;ai payé via Wave
            </h3>
            <p className="text-gray-600 text-sm mt-2 leading-6">
              Soumettez votre référence Wave. Notre équipe vérifie et
              débloque votre accès sous <strong>24h ouvrées</strong>.
            </p>
          </div>

          {lastRejected && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 items-start text-sm">
              <FaCircleXmark className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-900">Demande précédente refusée</p>
                {lastRejected.reviewerNotes && (
                  <p className="text-red-800 mt-1 italic">
                    « {lastRejected.reviewerNotes} »
                  </p>
                )}
                <p className="text-red-700 text-xs mt-2">
                  Vérifiez votre référence et déposez à nouveau ci-dessous.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F7C55] mb-1.5">
                Numéro de transaction Wave *
              </label>
              <input
                type="text"
                required
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="Ex : T-XXXX-XXXX (visible dans votre app Wave)"
                className="w-full rounded-xl bg-white border border-gray-200 focus:border-[#0F7C55] px-4 py-3 text-gray-900 text-sm outline-none transition"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Dans l&apos;app Wave : Historique → ouvrir la transaction →
                copier le numéro de référence.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F7C55] mb-1.5">
                Note (optionnel)
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Date du paiement, montant exact, ou tout détail utile…"
                className="w-full rounded-xl bg-white border border-gray-200 focus:border-[#0F7C55] px-4 py-3 text-gray-900 text-sm outline-none transition resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] text-white font-bold px-6 py-4 rounded-2xl shadow-md hover:scale-[1.01] transition disabled:opacity-50 text-sm sm:text-base"
            >
              {submitting
                ? "Envoi en cours…"
                : "Soumettre ma référence Wave"}
            </button>
          </form>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start text-xs text-amber-900">
            <FaCircleInfo className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Pourquoi une validation manuelle ?</p>
              Cela nous permet de vérifier chaque paiement et de garder une
              expérience humaine. Vous recevrez une notification dès que
              votre accès est débloqué (généralement sous 24h).
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function PendingCard({ pending }: { pending: PremiumPurchase }) {
  return (
    <div className="bg-white rounded-[30px] shadow-xl p-8 sm:p-10 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl mb-4">
        <FaClock />
      </div>
      <p className="text-amber-700 text-[10px] uppercase tracking-[0.3em] font-black">
        En attente de validation
      </p>
      <h1 className="font-display text-2xl sm:text-3xl font-black text-[#0F7C55] mt-2">
        Votre demande a bien été reçue
      </h1>
      <p className="text-gray-600 text-sm sm:text-base mt-3 max-w-md mx-auto leading-6">
        Référence soumise :{" "}
        <strong className="font-mono">
          {pending.applicantTransactionRef || "—"}
        </strong>
        <br />
        Notre équipe vérifie sous <strong>24h ouvrées</strong> et débloque
        votre accès dès confirmation.
      </p>
      <p className="text-[11px] text-gray-500 mt-4 italic">
        Vous pouvez fermer cette page. Le déblocage sera automatique sur tous
        vos appareils.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 mt-5 border border-[#0F7C55] text-[#0F7C55] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#0F7C55]/5 transition"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
