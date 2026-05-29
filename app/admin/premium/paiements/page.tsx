"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaCrown,
  FaCheck,
  FaXmark,
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaCircleInfo,
} from "react-icons/fa6";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { hasPermission } from "@/lib/admin-types";
import type {
  PremiumPurchase,
  PremiumPurchaseStatus,
} from "@/lib/admin-types";
import { PREMIUM_PRODUCTS } from "@/lib/admin-types";
import {
  listPremiumPurchases,
  approvePremiumPurchase,
  rejectPremiumPurchase,
} from "@/lib/admin-data";

const TABS: { id: "all" | PremiumPurchaseStatus; label: string }[] = [
  { id: "pending_review", label: "À valider" },
  { id: "completed", label: "Validées" },
  { id: "rejected", label: "Refusées" },
  { id: "all", label: "Toutes" },
];

const STATUS_BADGE: Record<
  PremiumPurchaseStatus,
  { label: string; cls: string }
> = {
  pending_review: {
    label: "En attente",
    cls: "bg-amber-100 text-amber-800",
  },
  completed: { label: "Validée ✓", cls: "bg-emerald-100 text-emerald-800" },
  rejected: { label: "Refusée", cls: "bg-red-100 text-red-800" },
};

export default function AdminPremiumPaiementsPage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "users.write");

  const [items, setItems] = useState<PremiumPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | PremiumPurchaseStatus>(
    "pending_review"
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [activeId, setActiveId] = useState<string | null>(null);
  const [confirmedTransactionId, setConfirmedTransactionId] = useState("");
  const [notes, setNotes] = useState("");
  const [acting, setActing] = useState(false);

  async function reload() {
    setLoading(true);
    try {
      const all = await listPremiumPurchases();
      setItems(all);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(reload, 0);
    return () => clearTimeout(t);
  }, []);

  const filtered =
    filter === "all" ? items : items.filter((p) => p.status === filter);

  function openDialog(p: PremiumPurchase) {
    setActiveId(p.id);
    setConfirmedTransactionId(p.applicantTransactionRef || "");
    setNotes("");
    setError("");
    setSuccess("");
  }

  function closeDialog() {
    setActiveId(null);
  }

  async function handleApprove() {
    if (!activeId || !user) return;
    if (!confirmedTransactionId.trim()) {
      setError("L'ID de transaction Wave est obligatoire pour valider.");
      return;
    }
    setActing(true);
    setError("");
    try {
      await approvePremiumPurchase(
        activeId,
        { uid: user.uid, name: user.displayName || user.email },
        confirmedTransactionId.trim(),
        notes.trim() || undefined
      );
      setSuccess(
        "✓ Paiement validé — l'utilisateur a maintenant accès premium."
      );
      closeDialog();
      await reload();
      setTimeout(() => setSuccess(""), 7000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de validation");
    } finally {
      setActing(false);
    }
  }

  async function handleReject() {
    if (!activeId || !user) return;
    if (!notes.trim()) {
      setError("Notes obligatoires pour expliquer le refus à l'utilisateur.");
      return;
    }
    if (
      !confirm(
        "Refuser cette demande ? L'utilisateur verra vos notes et pourra reprendre."
      )
    )
      return;
    setActing(true);
    setError("");
    try {
      await rejectPremiumPurchase(
        activeId,
        { uid: user.uid, name: user.displayName || user.email },
        notes.trim()
      );
      setSuccess("Demande refusée — l'utilisateur en est informé.");
      closeDialog();
      await reload();
      setTimeout(() => setSuccess(""), 6000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de rejet");
    } finally {
      setActing(false);
    }
  }

  return (
    <AdminShell>
      <header className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-[#0F7C55] hover:text-[#D4AF37] transition mb-4 font-semibold"
        >
          <FaArrowLeft /> Retour au tableau de bord
        </Link>
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold inline-flex items-center gap-2">
          <FaCrown /> Premium · Paiements
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          Validation des paiements premium
        </h1>
        <p className="mt-2 text-gray-600 text-sm max-w-3xl">
          Chaque demande contient une référence Wave fournie par
          l&apos;utilisateur. <strong>Vérifiez-la dans votre app Wave</strong>{" "}
          (historique des reçus) avant de valider. La validation débloque
          immédiatement l&apos;accès premium sur le compte concerné.
        </p>
      </header>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 rounded-xl p-3 border border-red-200 mb-4">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-emerald-800 bg-emerald-50 rounded-xl p-3 border border-emerald-200 mb-4">
          {success}
        </p>
      )}

      {/* TABS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => {
          const count =
            tab.id === "all"
              ? items.length
              : items.filter((p) => p.status === tab.id).length;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                filter === tab.id
                  ? "bg-[#0F7C55] text-white border-[#0F7C55]"
                  : "bg-white text-[#0F7C55] border-gray-200 hover:border-[#0F7C55]"
              }`}
            >
              {tab.label} <span className="opacity-70 ml-1">({count})</span>
            </button>
          );
        })}
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-sm text-gray-500">Chargement…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <FaCrown className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">
            Aucun paiement dans cette catégorie.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const product =
              PREMIUM_PRODUCTS[p.productKey] || { label: p.productKey };
            const badge = STATUS_BADGE[p.status];
            const isOpen = activeId === p.id;
            return (
              <article
                key={p.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-display text-lg font-bold text-[#0F7C55]">
                        {p.userDisplayName ||
                          p.userEmail ||
                          p.userPhone ||
                          p.userId.slice(0, 8)}
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#0F7C55] mt-1 font-bold">
                      {product.label} ·{" "}
                      {p.amount.toLocaleString("fr-FR")} FCFA · {p.method}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mt-2">
                      {p.userPhone && (
                        <a
                          href={`tel:${p.userPhone}`}
                          className="inline-flex items-center gap-1 hover:text-[#0F7C55]"
                        >
                          <FaPhone className="text-[10px]" /> {p.userPhone}
                        </a>
                      )}
                      {p.userPhone && (
                        <a
                          href={`https://wa.me/${p.userPhone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-[#0F7C55]"
                        >
                          <FaWhatsapp className="text-[10px]" /> WhatsApp
                        </a>
                      )}
                      {p.userEmail && (
                        <a
                          href={`mailto:${p.userEmail}`}
                          className="inline-flex items-center gap-1 hover:text-[#0F7C55]"
                        >
                          <FaEnvelope className="text-[10px]" /> {p.userEmail}
                        </a>
                      )}
                    </div>

                    {p.applicantTransactionRef && (
                      <p className="mt-3 text-xs text-gray-700">
                        Référence Wave fournie :{" "}
                        <strong className="font-mono">
                          {p.applicantTransactionRef}
                        </strong>
                      </p>
                    )}
                    {p.applicantNote && (
                      <p className="mt-1 text-xs text-gray-500 italic">
                        Note : {p.applicantNote}
                      </p>
                    )}
                    {p.reviewerName && (
                      <p className="mt-2 text-xs text-gray-700">
                        {p.status === "completed"
                          ? "Validé par "
                          : "Refusé par "}
                        <strong>{p.reviewerName}</strong>
                      </p>
                    )}
                    {p.reviewerNotes && (
                      <p className="mt-1 text-xs text-gray-600 bg-gray-50 border-l-2 border-gray-300 rounded-r px-3 py-1.5 italic">
                        « {p.reviewerNotes} »
                      </p>
                    )}
                    {p.confirmedTransactionId && (
                      <p className="mt-2 text-[11px] text-emerald-700">
                        Transaction confirmée :{" "}
                        <span className="font-mono">
                          {p.confirmedTransactionId}
                        </span>
                      </p>
                    )}
                    <p className="mt-3 text-[10px] text-gray-400">
                      Soumis le{" "}
                      {new Date(p.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>

                  {canEdit && p.status === "pending_review" && (
                    <button
                      type="button"
                      onClick={() => openDialog(p)}
                      className="bg-[#0F7C55] text-white font-bold text-xs px-3 py-2 rounded-xl hover:bg-[#0A3D24] transition self-start"
                    >
                      Gérer
                    </button>
                  )}
                </div>

                {/* INLINE DIALOG */}
                {isOpen && (
                  <div className="mt-5 pt-5 border-t border-gray-100 grid gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex gap-2">
                      <FaCircleInfo className="flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Procédure :</strong> ouvrez votre app Wave →
                        Historique → vérifiez que la transaction de{" "}
                        <strong>{p.amount} FCFA</strong> existe bien et
                        correspond. Copiez son ID dans le champ ci-dessous
                        pour traçabilité.
                      </span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                        ID transaction confirmé *
                      </label>
                      <input
                        type="text"
                        value={confirmedTransactionId}
                        onChange={(e) =>
                          setConfirmedTransactionId(e.target.value)
                        }
                        placeholder="Ex : T-AB123XYZ"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                        Notes (optionnelles pour validation, obligatoires
                        pour refus)
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ex : Transaction vérifiée, montant correct…"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={closeDialog}
                        disabled={acting}
                        className="border border-gray-300 text-gray-700 font-bold text-xs px-3 py-2 rounded-xl hover:bg-gray-50 transition"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={handleReject}
                        disabled={acting}
                        className="inline-flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 font-bold text-xs px-3 py-2 rounded-xl hover:bg-red-100 transition disabled:opacity-50"
                      >
                        <FaXmark /> Refuser
                      </button>
                      <button
                        type="button"
                        onClick={handleApprove}
                        disabled={acting}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] text-white font-bold text-xs px-4 py-2 rounded-xl hover:scale-[1.02] transition disabled:opacity-50"
                      >
                        <FaCheck /> Valider — débloquer
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
