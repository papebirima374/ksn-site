"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
  FaImages,
  FaNewspaper,
  FaHandsPraying,
  FaListUl,
  FaUsers,
  FaHouse,
  FaRightFromBracket,
  FaBars,
  FaXmark,
  FaIdCard,
  FaBookOpen,
  FaCoins,
  FaBagShopping,
  FaCalendarDays,
  FaCommentDots,
  FaFilePdf,
  FaGraduationCap,
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth-context";
import { hasPermission } from "@/lib/admin-types";

const NAV = [
  { href: "/admin", label: "Tableau de bord", Icon: FaHouse, perm: null },
  { href: "/admin/membres", label: "Membres", Icon: FaIdCard, perm: "members.write" as const },
  { href: "/admin/finances", label: "Finances", Icon: FaCoins, perm: "finances.write" as const },
  { href: "/admin/boutique", label: "Boutique", Icon: FaBagShopping, perm: "boutique.write" as const },
  { href: "/admin/bibliotheque", label: "Bibliothèque Salaats", Icon: FaBookOpen, perm: "library.write" as const },
  { href: "/admin/salaatu", label: "Salaatu du jour", Icon: FaHandsPraying, perm: "salaatu.write" as const },
  { href: "/admin/galerie", label: "Galerie", Icon: FaImages, perm: "gallery.write" as const },
  { href: "/admin/articles", label: "Articles", Icon: FaNewspaper, perm: "articles.write" as const },
  { href: "/admin/temoignages", label: "Témoignages", Icon: FaCommentDots, perm: "articles.write" as const },
  { href: "/admin/documents", label: "Documents PDF", Icon: FaFilePdf, perm: "articles.write" as const },
  { href: "/admin/education", label: "Éducation & Culture", Icon: FaGraduationCap, perm: "education.write" as const },
  { href: "/admin/parametres-journee", label: "Journée Salaatu", Icon: FaCalendarDays, perm: null, adminOnly: true },
  { href: "/admin/utilisateurs", label: "Utilisateurs", Icon: FaUsers, perm: "users.write" as const },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const { user, signOut, configured, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("admin-theme") === "dark";
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("admin-theme", next ? "dark" : "light");
  };

  useEffect(() => {
    if (!configured) return;
    if (!loading && !user && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [configured, loading, user, pathname, router]);

  if (!configured) {
    return <FirebaseNotConfigured />;
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#082F22] flex flex-col items-center justify-center text-white gap-4">
        <div className="w-12 h-12 border-4 border-white/20 border-t-[#D4AF37] rounded-full animate-spin" />
        <p className="text-white/80 text-sm">
          {loading ? "Chargement…" : "Redirection vers la connexion…"}
        </p>
      </div>
    );
  }

  const visibleNav = NAV.filter((item) => {
    // Items reserves a l'administrateur principal
    if ("adminOnly" in item && item.adminOnly) {
      return user?.role === "admin";
    }
    // Items publics (perm null) ou items necessitant une permission specifique
    return !item.perm ? true : hasPermission(user, item.perm);
  });

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? "bg-[#082F22] text-white dark" : "bg-[#F8F5EF] text-[#1A1A1A]"}`}>
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-[#082F22] text-white transform transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-6 py-6 border-b border-white/10">
          <p className="font-display text-2xl font-bold">KSN Admin</p>
          <p className="text-xs text-white/60 mt-1 truncate">{user.email}</p>
          <p className="text-xs text-[#D4AF37] mt-1 uppercase tracking-widest">
            {user.role === "admin" ? "Administrateur" : user.commission ?? "Commission"}
          </p>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {visibleNav.map((item) => {
            const Icon = item.Icon;
            const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-[#D4AF37] text-[#0F7C55]"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="block w-full text-center text-xs text-white/70 hover:text-white transition"
          >
            ← Retour au site
          </Link>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              router.push("/admin/login");
            }}
            className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl text-sm font-medium transition"
          >
            <FaRightFromBracket className="w-3.5 h-3.5" /> Déconnexion
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MAIN */}
      <div className="flex-1 lg:pl-72 flex flex-col">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="text-[#0F7C55] text-xl lg:hidden"
              aria-label="Menu"
            >
              {open ? <FaXmark /> : <FaBars />}
            </button>
            <p className="font-display text-lg font-bold text-[#0F7C55]">
              KSN Admin
            </p>
          </div>
          
          <button
            type="button"
            onClick={toggleDarkMode}
            className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-[#D4AF37] transition hover:scale-105"
            title="Basculer le thème"
          >
            {darkMode ? "☀️ Mode Clair" : "🌙 Mode Sombre"}
          </button>
        </header>

        <main className="px-4 sm:px-8 py-8 sm:py-12 max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function FirebaseNotConfigured() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] flex items-center justify-center p-6">
      <div className="max-w-2xl bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center">
        <p className="font-arabic text-3xl text-[#D4AF37]">⚙️</p>
        <h1 className="font-display mt-4 text-3xl font-bold text-[#0F7C55]">
          Firebase non configuré
        </h1>
        <p className="mt-5 text-gray-600 leading-7">
          Le panneau d&apos;administration nécessite une configuration Firebase.
          Créez un projet sur{" "}
          <a
            href="https://console.firebase.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B8860B] underline font-semibold"
          >
            console.firebase.google.com
          </a>{" "}
          puis ajoutez les variables d&apos;environnement dans{" "}
          <code className="bg-[#F8F5EF] px-2 py-0.5 rounded">.env.local</code>{" "}
          (cf. <code>.env.local.example</code>).
        </p>
        <div className="mt-8 text-left bg-[#F8F5EF] rounded-2xl p-5 font-mono text-xs sm:text-sm text-[#0F7C55] overflow-x-auto">
          NEXT_PUBLIC_FIREBASE_API_KEY=…<br />
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=…<br />
          NEXT_PUBLIC_FIREBASE_PROJECT_ID=…<br />
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=…<br />
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=…<br />
          NEXT_PUBLIC_FIREBASE_APP_ID=…
        </div>
        <Link
          href="/"
          className="inline-flex mt-8 text-[#0F7C55] hover:text-[#B8860B] transition text-sm font-semibold"
        >
          ← Retour au site
        </Link>
      </div>
    </div>
  );
}
