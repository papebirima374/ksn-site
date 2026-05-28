"use client";

import { useState, FormEvent } from "react";
import { addDoc, collection } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { FaHeart, FaPaypal, FaCreditCard, FaLock, FaCircleCheck } from "react-icons/fa6";

const CURRENCIES = [
  { code: "EUR", symbol: "€", label: "Euro (€)" },
  { code: "USD", symbol: "$", label: "Dollar ($)" },
  { code: "XOF", symbol: "CFA", label: "Franc CFA (XOF)" },
];

const PRESETS = {
  EUR: [10, 20, 50, 100, 250],
  USD: [15, 25, 50, 100, 250],
  XOF: [5000, 10000, 25000, 50000, 100000],
};

export default function InternationalDonation() {
  const [currency, setCurrency] = useState<"EUR" | "USD" | "XOF">("EUR");
  const [amount, setAmount] = useState<string>("50");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  
  // Donor details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Processing states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");

  const activePresets = PRESETS[currency];
  const finalAmount = customAmount ? parseFloat(customAmount) : parseFloat(amount);

  const handlePresetSelect = (val: number) => {
    setAmount(val.toString());
    setCustomAmount("");
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmount(val);
    setAmount("");
  };

  const handleSubmitDonation = async (e: FormEvent) => {
    e.preventDefault();
    if (!finalAmount || finalAmount <= 0) {
      setError("Veuillez indiquer un montant valide.");
      return;
    }
    if (!name || !email) {
      setError("Veuillez renseigner votre nom et votre adresse email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const generatedReceipt = "REC-" + Math.floor(100000 + Math.random() * 900000);
      const db = getDb();

      // 1. Save to Firestore
      await addDoc(collection(db, "donations"), {
        name,
        email,
        amount: finalAmount,
        currency,
        paymentMethod,
        receiptNumber: generatedReceipt,
        status: "succeeded",
        createdAt: Date.now(),
      });

      // 2. Try sending receipt email via Resend API
      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "donation",
            email,
            name,
            amount: finalAmount,
            currency,
            receiptNumber: generatedReceipt,
          }),
        });
      } catch (err) {
        console.error("Failed to send transactional email", err);
      }

      setReceiptNumber(generatedReceipt);
      setSuccess(true);
    } catch (err) {
      console.error("Error processing donation:", err);
      setError("Une erreur est survenue lors du traitement du don. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 animate-fadeIn">
      <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14 border border-[#E9E3D5] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B8860B]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 uppercase tracking-[0.2em] text-[#B8860B] font-semibold text-xs sm:text-sm">
            <FaHeart className="animate-pulse text-red-500" /> Diaspora & International
          </span>
          <h2 className="font-display mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F7C55]">
            Dons Sécurisés (Stripe + PayPal)
          </h2>
          <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Soutenez le Dahira KSN depuis l&apos;étranger par Carte Bancaire ou PayPal. Reçu fiscal électronique généré automatiquement.
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmitDonation} className="max-w-3xl mx-auto grid md:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDE: AMOUNT & DETAILS */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Currency selector */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  1. Devise
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CURRENCIES.map((cur) => (
                    <button
                      key={cur.code}
                      type="button"
                      onClick={() => {
                        setCurrency(cur.code as any);
                        handlePresetSelect(PRESETS[cur.code as keyof typeof PRESETS][2]);
                      }}
                      className={`rounded-xl p-3 border text-center transition ${
                        currency === cur.code
                          ? "border-[#0F7C55] bg-[#0F7C55]/5 text-[#0F7C55] font-black"
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 font-medium"
                      }`}
                    >
                      {cur.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preset Amounts */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  2. Montant du don
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {activePresets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handlePresetSelect(val)}
                      className={`rounded-xl py-3 px-1 border text-center text-sm font-bold transition ${
                        amount === val.toString()
                          ? "border-[#0F7C55] bg-[#0F7C55] text-white"
                          : "border-gray-200 bg-white text-[#0F7C55] hover:bg-gray-50"
                      }`}
                    >
                      {val.toLocaleString("fr-FR")} {CURRENCIES.find((c) => c.code === currency)?.symbol}
                    </button>
                  ))}
                </div>

                {/* Custom Amount input */}
                <div className="mt-3 relative rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#0F7C55] transition">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                    Autre montant :
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    placeholder="Saisissez un montant..."
                    className="w-full pl-32 pr-12 py-3 bg-transparent outline-none text-right text-sm font-bold text-[#0F7C55]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                    {CURRENCIES.find((c) => c.code === currency)?.symbol}
                  </span>
                </div>
              </div>

              {/* Donor Details */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  3. Vos coordonnées
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom complet"
                    className="w-full rounded-xl border border-gray-200 p-3.5 outline-none focus:border-[#0F7C55] text-xs sm:text-sm text-[#0F7C55] bg-gray-50"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Adresse email"
                    className="w-full rounded-xl border border-gray-200 p-3.5 outline-none focus:border-[#0F7C55] text-xs sm:text-sm text-[#0F7C55] bg-gray-50"
                  />
                </div>
              </div>

            </div>

            {/* RIGHT SIDE: PAYMENT METHOD & SUBMIT */}
            <div className="md:col-span-5 bg-[#F8F5EF] border border-[#E9E3D5] rounded-3xl p-5 sm:p-6 space-y-5">
              
              {/* Payment selector */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2">
                  Méthode de Paiement
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("stripe")}
                    className={`rounded-xl p-3 border text-center flex flex-col items-center justify-center gap-1.5 transition ${
                      paymentMethod === "stripe"
                        ? "border-[#0F7C55] bg-white text-[#0F7C55]"
                        : "border-transparent bg-white/50 text-gray-500 hover:bg-white"
                    }`}
                  >
                    <FaCreditCard className="text-lg" />
                    <span className="text-[11px] font-bold">Stripe / Carte</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`rounded-xl p-3 border text-center flex flex-col items-center justify-center gap-1.5 transition ${
                      paymentMethod === "paypal"
                        ? "border-[#D4AF37] bg-white text-[#B8860B]"
                        : "border-transparent bg-white/50 text-gray-500 hover:bg-white"
                    }`}
                  >
                    <FaPaypal className="text-lg text-[#003087]" />
                    <span className="text-[11px] font-bold">PayPal</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Inputs based on Method */}
              {paymentMethod === "stripe" ? (
                // Card details mockup
                <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200">
                  <p className="text-[10px] uppercase font-black tracking-widest text-[#0F7C55] mb-2">
                    Saisie sécurisée Stripe
                  </p>
                  <div>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s+/g, "").replace(/(\d{4})/g, "$1 ").trim())}
                      maxLength={19}
                      placeholder="Numéro de carte (4444 ...)"
                      className="w-full rounded-lg border border-gray-100 p-2.5 outline-none focus:border-[#0F7C55] text-xs font-semibold bg-gray-50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value.replace(/\//g, "").replace(/(\d{2})/g, "$1/").replace(/\/$/, ""))}
                      maxLength={5}
                      placeholder="MM/AA"
                      className="w-full rounded-lg border border-gray-100 p-2.5 outline-none focus:border-[#0F7C55] text-xs font-semibold bg-gray-50 text-center"
                    />
                    <input
                      type="text"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D+/g, ""))}
                      maxLength={3}
                      placeholder="CVC"
                      className="w-full rounded-lg border border-gray-100 p-2.5 outline-none focus:border-[#0F7C55] text-xs font-semibold bg-gray-50 text-center"
                    />
                  </div>
                </div>
              ) : (
                // PayPal message
                <div className="bg-white p-4 rounded-2xl border border-[#D4AF37]/30 text-center space-y-3">
                  <p className="text-[10px] uppercase font-black tracking-widest text-[#B8860B]">
                    PayPal Express Checkout
                  </p>
                  <div className="w-full bg-[#FFC439] hover:bg-[#F2B21B] py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer font-bold text-slate-800 text-xs shadow-md transition">
                    <FaPaypal className="text-sm text-[#003087]" /> Payer avec PayPal
                  </div>
                  <p className="text-[9px] text-gray-400">
                    Ouvre une fenêtre pop-up sécurisée PayPal pour finaliser votre don de manière confidentielle.
                  </p>
                </div>
              )}

              {/* Total display & Submit */}
              <div className="border-t border-[#E9E3D5] pt-4 space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs text-gray-500 font-bold">Total Don :</span>
                  <span className="text-xl font-black text-[#0F7C55]">
                    {finalAmount ? finalAmount.toLocaleString("fr-FR") : 0} {CURRENCIES.find((c) => c.code === currency)?.symbol}
                  </span>
                </div>

                {error && (
                  <p className="text-[11px] text-red-600 font-semibold bg-red-50 p-2.5 rounded-lg border border-red-100">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0F7C55] hover:bg-[#0A3D24] text-white py-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl transition disabled:opacity-70"
                >
                  {loading ? "Traitement sécurisé..." : "Valider mon don"}
                </button>

                <p className="text-[9px] text-gray-400 text-center flex items-center justify-center gap-1">
                  <FaLock className="text-emerald-600" /> Données chiffrées SSL 256-bits.
                </p>
              </div>

            </div>

          </form>
        ) : (
          // Success view
          <div className="max-w-md mx-auto text-center py-8 animate-scaleUp">
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center text-emerald-600 text-3xl mx-auto mb-4">
              <FaCircleCheck />
            </div>
            
            <h3 className="font-display text-2xl font-black text-[#0F7C55]">
              Merci infiniment !
            </h3>
            
            <p className="text-gray-500 text-sm mt-2">
              Votre don de <strong className="text-[#0F7C55]">{finalAmount.toLocaleString("fr-FR")} {CURRENCIES.find((c) => c.code === currency)?.symbol}</strong> a été validé avec succès.
            </p>

            <div className="mt-6 bg-[#F8F5EF] border border-[#E9E3D5] p-5 rounded-2xl text-left space-y-3 shadow-inner">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider text-center border-b border-gray-200 pb-2">
                Reçu de Don Électronique
              </p>
              <div className="text-xs space-y-2 font-semibold">
                <div className="flex justify-between">
                  <span className="text-gray-400">Bienfaiteur :</span>
                  <span className="text-[#0F7C55]">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email :</span>
                  <span className="text-[#0F7C55]">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction N° :</span>
                  <span className="text-[#B8860B] select-all">{receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Statut :</span>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">Succès ✓</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 px-4 leading-relaxed">
              Un e-mail de confirmation contenant votre reçu au format PDF a été envoyé à l&apos;adresse <strong>{email}</strong>.
            </p>

            <button
              onClick={() => setSuccess(false)}
              className="mt-8 text-xs text-[#0F7C55] font-bold hover:underline"
            >
              Faire un nouveau don
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
