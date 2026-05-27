"use client";

import { useState, FormEvent } from "react";
import { FaXmark, FaTrash, FaCartShopping } from "react-icons/fa6";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/lib/admin-data";
import { isFirebaseConfigured } from "@/lib/firebase";
import { Order } from "@/lib/admin-types";
import WaveLogo from "@/components/ui/WaveLogo";
import OrangeMoneyLogo from "@/components/ui/OrangeMoneyLogo";

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

type Step = "cart" | "checkout" | "payment" | "success";

export default function CartDrawer() {
  const { items, update, remove, clear, subtotal, count, open, setOpen } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState<Order["paymentMethod"]>("wave");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  const hasPhysical = items.some(
    (i) => i.category === "physical" || i.category === "cafe"
  );
  const hasBook = items.some((i) => i.category === "book");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (!isFirebaseConfigured()) {
        throw new Error(
          "Backend non configuré — la commande n'a pas pu être enregistrée."
        );
      }
      const id = await createOrder({
        items,
        customerName: name,
        customerPhone: phone,
        customerEmail: email || undefined,
        deliveryAddress: address || undefined,
        paymentMethod: method,
        transactionId: transactionId || undefined,
        total: subtotal,
      });
      setOrderId(id);
      setStep("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  }

  function close() {
    setOpen(false);
    setTimeout(() => {
      if (step === "success") {
        clear();
        setStep("cart");
        setName("");
        setPhone("");
        setEmail("");
        setAddress("");
        setTransactionId("");
        setOrderId("");
      }
    }, 300);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex">
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      <aside className="w-full sm:max-w-md bg-white shadow-2xl flex flex-col">
        {/* HEADER */}
        <div className="px-5 sm:px-7 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaCartShopping className="text-[#0F5132]" />
            <h2 className="font-display text-xl font-bold text-[#0F5132]">
              {step === "cart" && "Votre panier"}
              {step === "checkout" && "Vos informations"}
              {step === "payment" && "Paiement"}
              {step === "success" && "Commande confirmée"}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#0F5132]"
            aria-label="Fermer"
          >
            <FaXmark />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {step === "cart" && (
            <>
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-6xl">🛍️</p>
                  <p className="mt-4 text-gray-500">Votre panier est vide.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((i) => (
                    <li
                      key={i.productId}
                      className="bg-[#F8F5EF] rounded-2xl p-4 flex gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-[#0F5132] text-sm sm:text-base line-clamp-2">
                          {i.title}
                        </p>
                        <p className="text-xs text-[#B8860B] uppercase tracking-widest font-bold mt-0.5">
                          {i.category}
                        </p>
                        <p className="mt-1 text-sm text-[#0F5132] font-semibold tabular-nums">
                          {fmt(i.price)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          type="button"
                          onClick={() => remove(i.productId)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Supprimer"
                        >
                          <FaTrash />
                        </button>
                        <div className="inline-flex items-center bg-white rounded-lg border border-gray-200">
                          <button
                            type="button"
                            onClick={() => update(i.productId, i.quantity - 1)}
                            className="w-8 h-8 text-[#0F5132] hover:bg-[#F8F5EF] disabled:opacity-30"
                            disabled={i.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-[#0F5132] tabular-nums">
                            {i.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => update(i.productId, i.quantity + 1)}
                            className="w-8 h-8 text-[#0F5132] hover:bg-[#F8F5EF]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {step === "checkout" && (
            <form onSubmit={(e) => { e.preventDefault(); setStep("payment"); }} className="space-y-3">
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom complet *"
                className={inputClass}
              />
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Téléphone (+221...) *"
                className={inputClass}
              />
              {hasBook && (
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (pour recevoir les PDF) *"
                  className={inputClass}
                />
              )}
              {hasPhysical && (
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Adresse de livraison *"
                  rows={3}
                  className={inputClass}
                />
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-3.5 rounded-xl font-bold"
              >
                Continuer vers le paiement →
              </button>
            </form>
          )}

          {step === "payment" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                Choisissez votre moyen de paiement
              </p>
              <div className="grid grid-cols-2 gap-2">
                <PayButton selected={method === "wave"} onClick={() => setMethod("wave")}>
                  <WaveLogo className="w-8 h-8" /> Wave
                </PayButton>
                <PayButton selected={method === "orange-money"} onClick={() => setMethod("orange-money")}>
                  <OrangeMoneyLogo className="w-8 h-8" /> Orange Money
                </PayButton>
                <PayButton selected={method === "card"} onClick={() => setMethod("card")}>
                  💳 Carte bancaire
                </PayButton>
                <PayButton selected={method === "paypal"} onClick={() => setMethod("paypal")}>
                  🅿️ PayPal
                </PayButton>
              </div>

              <PaymentSimulator method={method} amount={subtotal} txId={transactionId} setTxId={setTransactionId} />

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-3.5 rounded-xl font-bold disabled:opacity-50"
              >
                {submitting ? "Validation…" : `Confirmer ${fmt(subtotal)}`}
              </button>
              <button
                type="button"
                onClick={() => setStep("checkout")}
                className="w-full text-center text-sm text-gray-500 hover:text-[#0F5132]"
              >
                ← Modifier mes informations
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl">
                ✓
              </div>
              <h3 className="font-display mt-4 text-2xl font-bold text-[#0F5132]">
                Merci !
              </h3>
              <p className="mt-2 text-gray-600 text-sm leading-7">
                Votre commande a été enregistrée. Vous serez contacté(e) au plus
                vite pour la confirmation. Référence :{" "}
                <span className="font-mono text-[#B8860B] font-bold">
                  {orderId.slice(0, 8).toUpperCase()}
                </span>
              </p>
              {hasBook && (
                <div className="mt-5 bg-[#F8F5EF] rounded-xl p-4 text-sm text-[#0F5132]">
                  📚 Les livres PDF achetés vous seront envoyés à{" "}
                  <span className="font-semibold">{email}</span> dès validation
                  du paiement.
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {(step === "cart" || step === "checkout" || step === "payment") &&
          items.length > 0 && (
            <div className="border-t border-gray-100 px-5 sm:px-7 py-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Sous-total ({count} article{count > 1 ? "s" : ""})
                </p>
                <p className="font-display text-2xl font-bold text-[#0F5132] tabular-nums">
                  {fmt(subtotal)}
                </p>
              </div>
              {step === "cart" && (
                <button
                  type="button"
                  onClick={() => setStep("checkout")}
                  className="w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-3.5 rounded-xl font-bold"
                >
                  Passer la commande
                </button>
              )}
            </div>
          )}
      </aside>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 p-3.5 outline-none focus:border-[#0F5132] text-sm text-[#0F5132] bg-white";

function PayButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 py-3 px-3 rounded-xl border-2 text-sm font-semibold transition ${
        selected
          ? "border-[#0F5132] bg-[#0F5132] text-white"
          : "border-gray-200 bg-white text-[#0F5132] hover:bg-[#F8F5EF]"
      }`}
    >
      {children}
    </button>
  );
}

function PaymentSimulator({
  method,
  amount,
  txId,
  setTxId,
}: {
  method: Order["paymentMethod"];
  amount: number;
  txId: string;
  setTxId: (s: string) => void;
}) {
  if (method === "wave") {
    return (
      <div className="bg-[#F8F5EF] rounded-2xl p-4 text-sm text-[#0F5132]">
        <p className="font-bold mb-2">Paiement Wave — {fmt(amount)}</p>
        <ol className="list-decimal list-inside space-y-1 text-xs leading-6">
          <li>Ouvrez Wave et envoyez {fmt(amount)} au +221 76 725 72 72</li>
          <li>Copiez l&apos;ID de transaction reçu</li>
          <li>Collez-le ci-dessous</li>
        </ol>
        <input
          required
          value={txId}
          onChange={(e) => setTxId(e.target.value)}
          placeholder="ID transaction Wave"
          className={inputClass + " mt-3"}
        />
      </div>
    );
  }
  if (method === "orange-money") {
    return (
      <div className="bg-[#FFF4E5] rounded-2xl p-4 text-sm text-[#0F5132]">
        <p className="font-bold mb-2">Orange Money — {fmt(amount)}</p>
        <ol className="list-decimal list-inside space-y-1 text-xs leading-6">
          <li>Composez <span className="font-mono font-bold">#144#</span></li>
          <li>Envoyez {fmt(amount)} au +221 78 017 84 44</li>
          <li>Saisissez le code OTP à 6 chiffres reçu</li>
        </ol>
        <input
          required
          value={txId}
          onChange={(e) => setTxId(e.target.value)}
          placeholder="Code OTP / ID transaction"
          className={inputClass + " mt-3"}
        />
      </div>
    );
  }
  if (method === "card") {
    return (
      <div className="bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-2xl p-5 text-[#0F5132]">
        <p className="text-xs uppercase tracking-widest font-bold mb-3">
          Carte bancaire — {fmt(amount)}
        </p>
        <p className="font-mono text-lg tracking-widest mb-3">
          •••• •••• •••• ••••
        </p>
        <input
          required
          inputMode="numeric"
          value={txId}
          onChange={(e) => setTxId(e.target.value.replace(/\D/g, "").slice(0, 16))}
          placeholder="Numéro de carte (16 chiffres)"
          className={inputClass + " mb-2"}
        />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="MM/AA" className={inputClass} />
          <input placeholder="CVV" className={inputClass} />
        </div>
        <p className="mt-3 text-[10px] italic opacity-80">
          Simulation — aucun paiement réel ne sera effectué.
        </p>
      </div>
    );
  }
  if (method === "paypal") {
    return (
      <div className="bg-[#003087]/10 rounded-2xl p-4 text-sm text-[#0F5132]">
        <p className="font-bold mb-2">PayPal — {fmt(amount)}</p>
        <p className="text-xs leading-6">
          Une fenêtre PayPal s&apos;ouvrirait normalement ici pour valider le
          paiement. Pour cette démo, saisissez votre email PayPal et un ID
          fictif.
        </p>
        <input
          required
          value={txId}
          onChange={(e) => setTxId(e.target.value)}
          placeholder="ID transaction PayPal"
          className={inputClass + " mt-3"}
        />
      </div>
    );
  }
  return null;
}
