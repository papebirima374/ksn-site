"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
  FaImages,
  FaNewspaper,
  FaHandsPraying,
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
  FaCrown,
  FaBullseye,
  FaClipboardList,
  FaFolderOpen,
  FaFileLines,
  FaEnvelopeOpenText,
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth-context";
import NotificationBell from "@/components/layout/NotificationBell";
import { hasPermission, type Permission } from "@/lib/admin-types";
import { slugFromNom } from "@/lib/commissions";

/** Le menu est regroupe par commission : chaque responsable retrouve ses
 *  outils sous le nom de sa commission, au lieu d'une liste de quinze entrees.
 *
 *  ATTENTION : le regroupement est une mise en forme, PAS un controle d'acces.
 *  Ce qu'un utilisateur peut ouvrir reste decide par `perm` / `adminOnly`,
 *  comme avant — sinon un compte perdrait en route un acces qu'il avait.
 *  Un groupe disparait simplement quand aucun de ses outils n'est accessible.
 *
 *  Le rattachement d'un outil a une commission est un choix d'organisation :
 *  a ajuster librement, rien d'autre n'en depend. */
const GROUPES: {
  titre: string;
  slug: string | null;
  items: {
    href: string;
    label: string;
    Icon: typeof FaHouse;
    perm: Permission | null;
    adminOnly?: boolean;
    secretariat?: boolean;
    /** Ouvert a cette commission meme sans la permission indiquee. */
    commission?: string;
  }[];
}[] = [
  {
    titre: "Vue d'ensemble",
    slug: null,
    items: [
      { href: "/admin", label: "Tableau de bord", Icon: FaHouse, perm: null },
      { href: "/admin/ma-commission", label: "Ma commission", Icon: FaFolderOpen, perm: null },
    ],
  },
  {
    titre: "Secrétariat et Administratif",
    slug: "secretariat-administratif",
    items: [
      { href: "/admin/rapports", label: "Rapports de commission", Icon: FaClipboardList, perm: null, secretariat: true },
      { href: "/admin/compte-rendu", label: "Comptes rendus", Icon: FaFileLines, perm: null },
      { href: "/admin/membres", label: "Membres", Icon: FaIdCard, perm: "members.write" },
      { href: "/admin/documents", label: "Documents PDF", Icon: FaFilePdf, perm: "articles.write" },
      { href: "/admin/utilisateurs", label: "Utilisateurs", Icon: FaUsers, perm: "users.write" },
    ],
  },
  {
    titre: "Finances",
    slug: "finances",
    items: [
      { href: "/admin/finances", label: "Finances", Icon: FaCoins, perm: "finances.write" },
      { href: "/admin/premium/paiements", label: "Premium · Paiements", Icon: FaCrown, perm: "users.write" },
    ],
  },
  {
    // La boutique est l'activite de la commission Sociale : c'est elle qui
    // tient le comptoir, encaisse et facture. Elle y accede donc sans avoir
    // besoin de la permission boutique.write, qui reste ce qui commande le
    // catalogue et les commandes en ligne.
    titre: "Social et Développement",
    slug: "social-developpement",
    items: [
      { href: "/admin/boutique", label: "Boutique", Icon: FaBagShopping, perm: "boutique.write", commission: "social-developpement" },
    ],
  },
  {
    titre: "Éducation et Culture",
    slug: "education-culture",
    items: [
      { href: "/admin/bibliotheque", label: "Bibliothèque Salaats", Icon: FaBookOpen, perm: "library.write" },
      { href: "/admin/salaatu", label: "Salaatu du jour", Icon: FaHandsPraying, perm: "salaatu.write" },
    ],
  },
  {
    titre: "Communication",
    slug: "communication",
    items: [
      { href: "/admin/articles", label: "Articles", Icon: FaNewspaper, perm: "articles.write" },
      { href: "/admin/temoignages", label: "Témoignages", Icon: FaCommentDots, perm: "articles.write" },
      { href: "/admin/galerie", label: "Galerie", Icon: FaImages, perm: "gallery.write" },
      { href: "/admin/newsletter", label: "Lettre d'information", Icon: FaEnvelopeOpenText, perm: "articles.write" },
    ],
  },
  {
    titre: "Organisation",
    slug: "organisation",
    items: [
      { href: "/admin/parametres-journee", label: "Journée Salaatu", Icon: FaCalendarDays, perm: null, adminOnly: true },
      { href: "/admin/challenge", label: "Compteur Challenge", Icon: FaBullseye, perm: null, adminOnly: true },
    ],
  },
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

  const estAdmin = user?.role === "admin";
  const maCommission = slugFromNom(user?.commission);

  const itemVisible = (item: {
    href: string;
    perm: Permission | null;
    adminOnly?: boolean;
    secretariat?: boolean;
    commission?: string;
  }) => {
    // Reserve a l'administrateur principal
    if (item.adminOnly) return estAdmin;
    // Reserve a l'administrateur et au Secretariat : celui-ci depouille les
    // rapports de TOUTES les commissions, c'est son role a l'assemblee.
    if (item.secretariat) return estAdmin || maCommission === "secretariat-administratif";
    // Outil rattache a une commission : elle y entre de plein droit, meme sans
    // la permission — c'est son metier. Les autres passent par la permission.
    if (item.commission && maCommission === item.commission) return true;
    // Membres : accessible avec members.write OU finances.write
    if (item.href === "/admin/membres") {
      return hasPermission(user, "members.write") || hasPermission(user, "finances.write");
    }
    return !item.perm ? true : hasPermission(user, item.perm);
  };

  const groupesVisibles = GROUPES
    .map((g) => ({ ...g, items: g.items.filter(itemVisible) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? "bg-[#082F22] text-white dark" : "bg-[#F8F5EF] text-[#1A1A1A]"}`}>
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-[#082F22] text-white transform transition-transform lg:translate-x-0 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-6 pb-6 border-b border-white/10 flex-shrink-0" style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.5rem)" }}>
          <p className="font-display text-2xl font-bold">KSN Admin</p>
          <p className="text-xs text-white/60 mt-1 truncate">{user.email}</p>
          <p className="text-xs text-[#D4AF37] mt-1 uppercase tracking-widest">
            {user.role === "admin" ? "Administrateur" : user.commission ?? "Commission"}
          </p>
        </div>

        <nav className="px-3 py-4 flex-1 overflow-y-auto">
          {groupesVisibles.map((groupe, i) => (
            <div key={groupe.titre} className={i === 0 ? "" : "mt-6"}>
              {groupe.slug && (
                <p className="px-4 mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#D4AF37]/75">
                  {groupe.titre}
                </p>
              )}
              <div className="space-y-1">
                {groupe.items.map((item) => {
                  const Icon = item.Icon;
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                        active
                          ? "bg-[#D4AF37] text-[#082F22] font-bold"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-none" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex-shrink-0 px-4 pt-4 border-t border-white/10 space-y-2" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}>
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
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <header
          className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 pb-4 flex items-center justify-between"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 1rem)" }}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="lg:hidden -ml-2 inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#0F7C55] text-2xl active:bg-black/10 transition"
              aria-label="Menu"
            >
              {open ? <FaXmark /> : <FaBars />}
            </button>
            <p className="font-display text-lg font-bold text-[#0F7C55]">
              KSN Admin
            </p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Un versement a accuser, un dossier renvoye : la nouvelle arrive
                ici, ou le responsable travaille. Sans cette cloche, seul un
                bandeau fugace la signalait — invisible pour qui se connecte
                apres coup. */}
            <NotificationBell fond="clair" />
            <button
              type="button"
              onClick={toggleDarkMode}
              className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-[#D4AF37] transition hover:scale-105"
              title="Basculer le thème"
            >
              {darkMode ? "☀️ Mode Clair" : "🌙 Mode Sombre"}
            </button>
          </div>
        </header>

        <main
          className="px-4 sm:px-8 pt-8 sm:pt-12 max-w-6xl w-full mx-auto"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 2.5rem)" }}
        >
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
