"use client";

import { Suspense, useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa6";
import { useAuth } from "@/lib/auth-context";
import { LINKS } from "@/lib/constants";

function ContentInner() {
  const { signIn, signUp, user, loading, configured } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const returnTo = search?.get("next") || "/spiritualite";

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace(returnTo);
  }, [loading, user, returnTo, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await signIn(email.trim(), password);
      } else {
        if (password.length < 6) throw new Error("Mot de passe : 6 caractères min.");
        await signUp(email.trim(), password, displayName.trim() || undefined);
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
          ? "Cet email a déjà un compte. Connectez-vous."
          : m.includes("auth/weak-password")
          ? "Mot de passe trop court (6 caractères min.)."
          : m
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative z-10 max-w-md mx-auto px-4 sm:px-6 pt-32 sm:pt-40 lg:pt-48 pb-20">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10">
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

        <div className="grid grid-cols-2 mt-8 bg-[#F8F5EF] rounded-2xl p-1 text-sm font-bold">
          <button
            type="button"
            onClick={() => setMode("login")}
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
            onClick={() => setMode("signup")}
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
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse email"
            className={inputClass}
            autoComplete="email"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              mode === "signup" ? "Mot de passe (6 min.)" : "Mot de passe"
            }
            className={inputClass}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />

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
