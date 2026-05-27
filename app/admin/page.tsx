"use client";

import Link from "next/link";
import {
  FaImages,
  FaNewspaper,
  FaHandsPraying,
  FaListUl,
  FaUsers,
  FaIdCard,
  FaArrowRight,
} from "react-icons/fa6";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { hasPermission, Permission } from "@/lib/admin-types";

const SECTIONS = [
  {
    href: "/admin/membres",
    label: "Membres du Dahira",
    desc: "Inscriptions, filtres par région/ville/profession, génération de carte de membre imprimable.",
    Icon: FaIdCard,
    perm: "members.write" as Permission,
    color: "from-[#1B7A4A] to-[#0F5132]",
  },
  {
    href: "/admin/galerie",
    label: "Galerie photos",
    desc: "Uploadez de nouvelles photos, modifiez les catégories, supprimez celles obsolètes.",
    Icon: FaImages,
    perm: "gallery.write" as Permission,
    color: "from-[#B8860B] to-[#D4AF37]",
  },
  {
    href: "/admin/articles",
    label: "Articles & blog",
    desc: "Rédigez et publiez des articles, annonces et actualités du Dahira.",
    Icon: FaNewspaper,
    perm: "articles.write" as Permission,
    color: "from-[#0F5132] to-[#1B7A4A]",
  },
  {
    href: "/admin/salaatu",
    label: "Salaatu du jour",
    desc: "Mettez à jour le Salaatu recommandé du jour : arabe, translittération, traduction.",
    Icon: FaHandsPraying,
    perm: "salaatu.write" as Permission,
    color: "from-[#1DCEDB] to-[#0F5132]",
  },
  {
    href: "/admin/menu",
    label: "Menu de navigation",
    desc: "Ajoutez, réorganisez ou masquez des éléments du menu principal.",
    Icon: FaListUl,
    perm: "menu.write" as Permission,
    color: "from-[#FF7900] to-[#B8860B]",
  },
  {
    href: "/admin/utilisateurs",
    label: "Utilisateurs",
    desc: "Créez les comptes des responsables de commission avec leurs permissions.",
    Icon: FaUsers,
    perm: "users.write" as Permission,
    color: "from-[#0A3D24] to-[#082F22]",
  },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const visible = SECTIONS.filter((s) => hasPermission(user, s.perm));

  return (
    <AdminShell>
      <div className="mb-8 sm:mb-12">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Tableau de bord
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F5132]">
          Bienvenue, {user?.displayName || user?.email?.split("@")[0]}
        </h1>
        <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-2xl">
          Gérez le contenu du site KSN depuis cet espace. Tous les changements
          sont visibles instantanément sur{" "}
          <a
            href="https://salaatualaanabii.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0F5132] underline font-medium"
          >
            salaatualaanabii.com
          </a>
          .
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
        {visible.map((s) => {
          const Icon = s.Icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="group bg-white rounded-3xl shadow-md hover:shadow-xl p-6 sm:p-8 transition hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center text-2xl`}>
                <Icon />
              </div>
              <h3 className="font-display mt-5 text-xl sm:text-2xl font-bold text-[#0F5132]">
                {s.label}
              </h3>
              <p className="mt-2 text-gray-600 text-sm leading-6">{s.desc}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-[#B8860B] font-semibold text-sm group-hover:gap-3 transition-all">
                Ouvrir <FaArrowRight className="text-xs" />
              </div>
            </Link>
          );
        })}
      </div>

      {visible.length === 0 && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center">
          <p className="text-gray-500">
            Vous n&apos;avez accès à aucune section pour l&apos;instant.
            Contactez l&apos;administrateur principal.
          </p>
        </div>
      )}
    </AdminShell>
  );
}
