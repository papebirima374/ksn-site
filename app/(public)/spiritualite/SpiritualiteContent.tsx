"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import PageHero from "@/components/layout/PageHero";
import SalaatouDuJour from "@/components/sections/SalaatouDuJour";
import SalaatuLibrary from "@/components/sections/SalaatuLibrary";
import Spiritualite from "@/components/sections/Spiritualite";

export default function SpiritualiteContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/espace-membre?next=/spiritualite");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#082F22] flex flex-col items-center justify-center text-white/70">
        <div className="w-12 h-12 border-4 border-white/20 border-t-[#D4AF37] rounded-full animate-spin" />
        <p className="mt-4 text-sm font-sans tracking-wide">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <PageHero
        overline="Spiritualité KSN"
        title="Nourrir le Cœur par le Salaatu ﷺ"
        arabic="صلى الله عليه وسلم"
        description="Salaatou du jour, bibliothèque sacrée des Salaats, Khassidas, invocations et enseignements pour vivre pleinement votre lien avec le Prophète Muhammad ﷺ."
      />

      <SalaatouDuJour />
      <SalaatuLibrary />
      <Spiritualite />
    </>
  );
}

