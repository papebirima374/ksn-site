"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaCamera } from "react-icons/fa6";
import { useAuth } from "@/lib/auth-context";
import { LINKS, PAYMENT, buildWhatsAppLink } from "@/lib/constants";
import ProfileDashboard from "@/components/sections/ProfileDashboard";

function ContentInner() {
  const { signIn, signUp, resetPassword, user, configured } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const returnTo = search?.get("next") || "/spiritualite";

  const [mode, setMode] = useState<"login" | "signup">("login");
  
  // Credentials
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration additional details
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [domicile, setDomicile] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [isActifRequest, setIsActifRequest] = useState(false); // default to Visitor (false)

  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetting, setResetting] = useState(false);
  const [showWhatsAppReset, setShowWhatsAppReset] = useState(false);

  function handlePhotoSelected(file: File) {
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleResetPassword() {
    if (!emailOrPhone) {
      setError("Veuillez saisir votre adresse e-mail ou numéro dans le champ ci-dessus pour réinitialiser.");
      return;
    }
    setError("");
    setResetMessage("");
    
    const input = emailOrPhone.trim();
    const isEmail = input.includes("@");

    if (isEmail) {
      setResetting(true);
      try {
        await resetPassword(input);
        setResetMessage("Un e-mail de réinitialisation de mot de passe a été envoyé à cette adresse.");
      } catch {
        setError("Impossible d'envoyer l'e-mail de réinitialisation. Vérifiez l'adresse.");
      } finally {
        setResetting(false);
      }
    } else {
      // It's a phone number, show the WhatsApp reset support link
      setShowWhatsAppReset(true);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setResetMessage("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await signIn(emailOrPhone.trim(), password);
        router.replace(returnTo);
      } else {
        if (password.length < 6) throw new Error("Mot de passe : 6 caractères min.");
        if (!prenom.trim() || !nom.trim()) throw new Error("Le prénom et le nom sont requis.");
        
        if (isActifRequest) {
          if (!photoFile) throw new Error("Une photo de profil est obligatoire pour devenir membre actif.");
          if (!domicile.trim()) throw new Error("Le domicile est requis pour devenir membre actif.");
        }

        await signUp(emailOrPhone.trim(), password, {
          prenom: prenom.trim(),
          nom: nom.trim(),
          telephone: emailOrPhone.includes("@") ? telephone.trim() : emailOrPhone.trim(),
          domicile: domicile.trim(),
          photoFile,
          isActifRequest,
        });

        // After signup success, redirect to next page (e.g. /spiritualite)
        router.replace(returnTo);
      }
    } catch (err) {
      const m = err instanceof Error ? err.message : "Erreur";
      if (m.includes("DÉFINIR_MOT_DE_PASSE:")) {
        setError(m.replace("DÉFINIR_MOT_DE_PASSE:", "").trim());
        setMode("signup");
      } else {
        setError(
          m.includes("auth/invalid-credential") ||
            m.includes("auth/wrong-password") ||
            m.includes("auth/user-not-found")
            ? "Identifiants ou mot de passe incorrects."
            : m.includes("auth/email-already-in-use")
            ? "Cet email ou numéro de téléphone a déjà un compte. Connectez-vous."
            : m.includes("auth/weak-password")
            ? "Mot de passe trop court (6 caractères min.)."
            : m
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  // If user is logged in, show their dashboard
  if (user) {
    return (
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 lg:pt-48 pb-20">
        <ProfileDashboard user={user} />
      </section>
    );
  }

  return (
    <section className="relative z-10 max-w-lg mx-auto px-4 sm:px-6 pt-32 sm:pt-40 lg:pt-48 pb-20">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border border-gray-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#D4AF37]">
            <Image
              src="/logo/ksn-logo.png"
              alt="KSN"
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <h1 className="font-display mt-5 text-2xl sm:text-3xl font-bold text-[#0F5132]">
            Espace Membre KSN
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {mode === "login"
              ? "Connectez-vous pour accéder à la bibliothèque des Salaats."
              : "Créez votre compte membre — gratuit et rapide."}
          </p>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-2 mt-8 bg-[#F8F5EF] rounded-2xl p-1 text-sm font-bold">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
              setResetMessage("");
              setShowWhatsAppReset(false);
            }}
            className={`py-2.5 rounded-xl transition ${
              mode === "login"
                ? "bg-[#0F5132] text-white shadow-md"
                : "text-[#0F5132]"
            }`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError("");
              setResetMessage("");
              setShowWhatsAppReset(false);
            }}
            className={`py-2.5 rounded-xl transition ${
              mode === "signup"
                ? "bg-[#0F5132] text-white shadow-md"
                : "text-[#0F5132]"
            }`}
          >
            Inscription
          </button>
        </div>

        {!configured && (
          <p className="mt-5 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
            Service d&apos;authentification non configuré. Contactez l&apos;administrateur.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Signup additional details */}
          {mode === "signup" && (
            <>
              {/* Membership type toggle */}
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 space-y-2">
                <span className="block text-xs font-semibold text-gray-500 ml-1">
                  Type de compte :
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setIsActifRequest(false)}
                    className={`py-2 rounded-xl transition ${
                      !isActifRequest
                        ? "bg-[#0F5132] text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200"
                    }`}
                  >
                    Visiteur (Gratuit)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsActifRequest(true)}
                    className={`py-2 rounded-xl transition ${
                      isActifRequest
                        ? "bg-[#D4AF37] text-[#0F5132] shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200"
                    }`}
                  >
                    Membre Actif (1000 FCFA)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Prénom"
                  className={inputClass}
                  autoComplete="given-name"
                />
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Nom"
                  className={inputClass}
                  autoComplete="family-name"
                />
              </div>

              {/* Domicile - only for active members */}
              {isActifRequest && (
                <input
                  type="text"
                  required
                  value={domicile}
                  onChange={(e) => setDomicile(e.target.value)}
                  placeholder="Domicile / Ville"
                  className={inputClass}
                />
              )}
            </>
          )}

          {/* Email or Phone Input (Universal) */}
          <input
            type="text"
            required
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder={
              mode === "signup"
                ? "Adresse email ou Téléphone (ex: +221...)"
                : "Adresse email ou Téléphone"
            }
            className={inputClass}
            autoComplete="username"
          />

          {/* Telephone secondary field if signing up with Email */}
          {mode === "signup" && emailOrPhone.includes("@") && (
            <input
              type="tel"
              required={isActifRequest}
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="Numéro de Téléphone (ex: +221...)"
              className={inputClass}
            />
          )}

          {/* Photo upload for active members during signup */}
          {mode === "signup" && isActifRequest && (
            <div className="bg-[#F8F5EF] rounded-2xl p-4 border border-dashed border-[#0F5132]/20 space-y-3">
              <span className="block text-xs font-semibold text-[#0F5132]">
                Photo de profil (Obligatoire pour votre carte CR80) *
              </span>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-14 bg-white rounded-lg overflow-hidden flex items-center justify-center text-gray-400 border border-gray-200">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Photo"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <div>
                  <label className="inline-flex items-center gap-1.5 bg-[#0F5132] text-white py-1.5 px-3 rounded-lg text-xs font-bold cursor-pointer hover:bg-[#0c4228]">
                    <FaCamera /> Choisir
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handlePhotoSelected(f);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Password */}
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              mode === "signup" ? "Mot de passe (6 car. min)" : "Mot de passe"
            }
            className={inputClass}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />

          {/* Wave Payment instructions during signup */}
          {mode === "signup" && isActifRequest && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 space-y-3">
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                Veuillez effectuer le règlement de 1000 FCFA pour la carte de membre officielle via Wave en cliquant sur le lien ci-dessous. Votre compte sera actif dès validation de l&apos;administration.
              </p>
              <a
                href={PAYMENT.membershipWave}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#10c3af] text-white py-2.5 rounded-xl font-bold hover:scale-[1.01] transition text-xs shadow-sm"
              >
                Payer 1000 FCFA via Wave
              </a>
            </div>
          )}

          {mode === "login" && (
            <div className="text-right px-1">
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={resetting}
                className="text-xs text-[#B8860B] hover:text-[#D4AF37] font-semibold transition"
              >
                {resetting ? "Envoi..." : "Mot de passe oublié ?"}
              </button>
            </div>
          )}

          {resetMessage && (
            <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3 border border-emerald-200">
              {resetMessage}
            </p>
          )}

          {showWhatsAppReset && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 space-y-2">
              <p className="text-xs text-emerald-800">
                Pour réinitialiser le mot de passe de votre compte lié à ce numéro de téléphone, veuillez contacter l&apos;administration du Dahira sur WhatsApp :
              </p>
              <a
                href={buildWhatsAppLink(
                  `Bonjour, j'ai oublié mon mot de passe pour mon compte KSN associé au numéro de téléphone ${emailOrPhone.trim()}. Pouvez-vous m'envoyer un lien de connexion ou m'aider à le réinitialiser ?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-emerald-700 transition"
              >
                <FaWhatsapp className="text-sm" /> Contacter sur WhatsApp
              </a>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !configured}
            className="w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-4 rounded-2xl font-bold hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? "…"
              : mode === "login"
              ? "Se connecter"
              : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          {mode === "login" ? "Pas encore membre ?" : "Déjà membre ?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
              setResetMessage("");
              setShowWhatsAppReset(false);
            }}
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
            className="flex items-center justify-center gap-2 text-sm text-[#0F5132] hover:text-[#B8860B] transition"
          >
            <FaWhatsapp /> Besoin d&apos;aide ? Contactez le Dahira
          </a>
        </div>

        <Link
          href="/"
          className="block mt-4 text-center text-xs text-gray-400 hover:text-[#0F5132] transition"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-[#0F5132] text-sm text-[#0F5132] bg-white";

export default function EspaceMembrePage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center text-white/70">Chargement…</div>}>
      <ContentInner />
    </Suspense>
  );
}
