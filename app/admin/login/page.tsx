"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { signIn, user, loading, configured } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/admin");
  }, [loading, user, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.replace("/admin");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur de connexion";
      setError(
        msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password") || msg.includes("auth/user-not-found")
          ? "Identifiants incorrects."
          : msg
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!configured) {
    return (
      <div className="min-h-screen bg-[#082F22] flex items-center justify-center p-6 text-white">
        <div className="max-w-md text-center">
          <p className="text-[#D4AF37] text-3xl">⚙️</p>
          <h1 className="font-display mt-4 text-2xl font-bold">
            Firebase non configuré
          </h1>
          <p className="mt-4 text-white/70 text-sm leading-7">
            Ajoutez les variables NEXT_PUBLIC_FIREBASE_* dans .env.local pour
            activer la connexion administrateur.
          </p>
          <Link
            href="/"
            className="inline-flex mt-6 text-[#D4AF37] underline text-sm"
          >
            ← Retour au site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#082F22] via-[#0A3D24] to-[#0F7C55] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-10">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#D4AF37]">
            <Image src="/logo/ksn-logo.png" alt="KSN" fill className="object-cover" sizes="80px" />
          </div>
          <h1 className="font-display mt-5 text-2xl sm:text-3xl font-bold text-[#0F7C55]">
            Administration KSN
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Connectez-vous pour gérer le site.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse email"
            className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-[#0F7C55] text-sm sm:text-base bg-white text-[#0F7C55]"
            autoComplete="email"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-[#0F7C55] text-sm sm:text-base bg-white text-[#0F7C55]"
            autoComplete="current-password"
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-4 rounded-2xl font-bold hover:scale-[1.02] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Accès réservé à l&apos;administrateur et aux responsables de commission.
        </p>

        <Link
          href="/"
          className="block mt-6 text-center text-sm text-[#0F7C55] hover:text-[#B8860B] transition"
        >
          ← Retour au site
        </Link>
      </div>
    </div>
  );
}
