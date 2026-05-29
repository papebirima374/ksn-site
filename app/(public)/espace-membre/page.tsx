"use client";

import { Suspense, useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaEnvelope, FaPhone } from "react-icons/fa6";
import { useAuth, isPhoneIdentifier } from "@/lib/auth-context";
import { LINKS, buildWhatsAppLink } from "@/lib/constants";

function ContentInner() {
  const { signIn, signUp, resetPassword, user, loading, configured } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const returnTo = search?.get("next") || "/espace-membre/profil";

  // Mode initial : "signup" si ?mode=signup dans l'URL (depuis /inscription)
  const initialMode =
    search?.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [idType, setIdType] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace(returnTo);
  }, [loading, user, returnTo, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      const cleaned = identifier.trim();
      if (mode === "signup" && password.length < 6) {
        throw new Error("Mot de passe : 6 caractères min.");
      }
      if (mode === "login") {
        await signIn(cleaned, password);
      } else {
        await signUp(cleaned, password, displayName.trim() || undefined);
      }
      router.replace(returnTo);
    } catch (err) {
      const m = err instanceof Error ? err.message : "Erreur";
      setError(
        m.includes("auth/invalid-credential") ||
          m.includes("auth/wrong-password") ||
          m.includes("auth/user-not-found")
          ? "Identifiants incorrects."
          : m.includes("auth/email-already-in-use")
          ? "Cet identifiant est déjà utilisé. Connectez-vous."
          : m.includes("auth/weak-password")
          ? "Mot de passe trop court (6 caractères min.)."
          : m.includes("auth/invalid-email")
          ? "Adresse email ou numéro invalide."
          : m
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReset() {
    setError("");
    setInfo("");
    const cleaned = identifier.trim();
    if (!cleaned) {
      setError("Saisissez d'abord votre email ou numéro.");
      return;
    }
    try {
      await resetPassword(cleaned);
      setInfo("Lien de réinitialisation envoyé. Vérifiez votre boîte mail.");
    } catch (err) {
      const m = err instanceof Error ? err.message : "Erreur";
      if (m === "PHONE_ACCOUNT") {
        // Tell the UI to use the WhatsApp fallback
        setShowForgot(true);
      } else {
        setError(m);
      }
    }
  }

  const phonePlaceholder = "Numéro (ex: +221 76 725 72 72)";
  const isPhone = idType === "phone" || isPhoneIdentifier(identifier);
  const whatsappResetLink = buildWhatsAppLink(
    `Bonjour, j'ai oublié mon mot de passe pour mon compte KSN associé au numéro de téléphone ${identifier}. Pouvez-vous m'envoyer un lien de connexion ou m'aider à le réinitialiser ?`
  );

  return (
    <section className="relative z-10 max-w-md mx-auto px-4 sm:px-6 pt-32 sm:pt-40 lg:pt-48 pb-20">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#D4AF37]">
            <Image src="/logo/ksn-logo.png" alt="KSN" fill className="object-cover" sizes="80px" />
          </div>
          <h1 className="font-display mt-5 text-2xl sm:text-3xl font-bold text-[#0F7C55]">
            Espace Membre KSN
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {mode === "login"
              ? "Connectez-vous pour accéder à votre espace."
              : "Inscription gratuite — devenez visiteur du Dahira."}
          </p>
        </div>

        <div className="grid grid-cols-2 mt-8 bg-[#F8F5EF] rounded-2xl p-1 text-sm font-bold">
          <button
            type="button"
            onClick={() => { setMode("login"); setShowForgot(false); }}
            className={`py-2.5 rounded-xl transition ${mode === "login" ? "bg-[#0F7C55] text-white shadow-md" : "text-[#0F7C55]"}`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setShowForgot(false); }}
            className={`py-2.5 rounded-xl transition ${mode === "signup" ? "bg-[#0F7C55] text-white shadow-md" : "text-[#0F7C55]"}`}
          >
            Inscription
          </button>
        </div>

        <div className="grid grid-cols-2 mt-3 bg-[#F8F5EF] rounded-xl p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setIdType("email")}
            className={`py-2 rounded-lg transition inline-flex items-center justify-center gap-1.5 ${idType === "email" ? "bg-white text-[#0F7C55] shadow-sm" : "text-[#0F7C55]/60"}`}
          >
            <FaEnvelope className="w-3 h-3" /> Email
          </button>
          <button
            type="button"
            onClick={() => setIdType("phone")}
            className={`py-2 rounded-lg transition inline-flex items-center justify-center gap-1.5 ${idType === "phone" ? "bg-white text-[#0F7C55] shadow-sm" : "text-[#0F7C55]/60"}`}
          >
            <FaPhone className="w-3 h-3" /> Téléphone
          </button>
        </div>

        {!configured && (
          <p className="mt-5 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
            Service d&apos;authentification non configuré. Contactez l&apos;administrateur.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Prénom et nom (optionnel)"
              className={inputClass}
              autoComplete="name"
            />
          )}
          <input
            type={idType === "email" ? "email" : "tel"}
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={idType === "email" ? "Adresse email" : phonePlaceholder}
            className={inputClass}
            autoComplete={idType === "email" ? "email" : "tel"}
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signup" ? "Mot de passe (6 min.)" : "Mot de passe"}
            className={inputClass}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
              {error}
            </p>
          )}
          {info && (
            <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3 border border-emerald-200">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !configured}
            className="w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-4 rounded-2xl font-bold hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "…" : mode === "login" ? "Se connecter" : "Créer mon compte (gratuit)"}
          </button>

          {mode === "login" && (
            <div className="text-center">
              {!showForgot ? (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-[#B8860B] hover:text-[#D4AF37] font-semibold underline"
                >
                  Mot de passe oublié ?
                </button>
              ) : (
                <a
                  href={whatsappResetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm"
                >
                  <FaWhatsapp /> Demander de l&apos;aide sur WhatsApp
                </a>
              )}
            </div>
          )}
        </form>

        {mode === "signup" && (
          <p className="mt-5 text-center text-xs text-gray-500 leading-6">
            L&apos;inscription crée un compte <strong>visiteur</strong>.<br />
            Pour devenir membre actif (carte officielle + accès complet), vous compléterez votre profil avec photo et règlerez 1 000 FCFA après connexion.
          </p>
        )}

        <p className="mt-6 text-center text-xs text-gray-500">
          {mode === "login" ? "Pas encore membre ?" : "Déjà membre ?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-[#B8860B] hover:text-[#D4AF37] font-semibold"
          >
            {mode === "login" ? "Créer un compte" : "Se connecter"}
          </button>
        </p>

        <div className="border-t border-gray-100 mt-6 pt-6">
          <a
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-[#0F7C55] hover:text-[#B8860B] transition"
          >
            <FaWhatsapp /> Besoin d&apos;aide ? Contactez le Dahira
          </a>
        </div>

        <Link
          href="/"
          className="block mt-4 text-center text-xs text-gray-400 hover:text-[#0F7C55] transition"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-[#0F7C55] text-sm text-[#0F7C55] bg-white";

export default function EspaceMembrePage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center text-white/70">Chargement…</div>}>
      <ContentInner />
    </Suspense>
  );
}
