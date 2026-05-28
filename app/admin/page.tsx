"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaImages,
  FaNewspaper,
  FaHandsPraying,
  FaUsers,
  FaIdCard,
  FaBookOpen,
  FaCoins,
  FaBagShopping,
  FaArrowRight,
  FaUserCheck,
  FaUserClock,
  FaSackDollar,
  FaChartLine,
  FaUserPlus,
} from "react-icons/fa6";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import {
  hasPermission,
  Permission,
  Member,
  FinanceEntry,
  AppUser,
  COMMISSIONS_LIST,
} from "@/lib/admin-types";
import {
  listMembers,
  listFinanceEntries,
  listUsers,
} from "@/lib/admin-data";

// Sections rapides en bas (raccourcis)
const SECTIONS = [
  { href: "/admin/membres", label: "Membres", Icon: FaIdCard, perm: "members.write" as Permission },
  { href: "/admin/finances", label: "Finances", Icon: FaCoins, perm: "finances.write" as Permission },
  { href: "/admin/boutique", label: "Boutique", Icon: FaBagShopping, perm: "boutique.write" as Permission },
  { href: "/admin/bibliotheque", label: "Bibliothèque", Icon: FaBookOpen, perm: "library.write" as Permission },
  { href: "/admin/salaatu", label: "Salaatu du jour", Icon: FaHandsPraying, perm: "salaatu.write" as Permission },
  { href: "/admin/galerie", label: "Galerie", Icon: FaImages, perm: "gallery.write" as Permission },
  { href: "/admin/articles", label: "Articles", Icon: FaNewspaper, perm: "articles.write" as Permission },
  { href: "/admin/utilisateurs", label: "Utilisateurs", Icon: FaUsers, perm: "users.write" as Permission },
];

function fmtFCFA(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

function fmtDateShort(ts: number): string {
  return new Date(ts).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

/** Renvoie les 6 derniers mois (du plus ancien au plus recent) au format
 *  { key: "2026-05", label: "Mai", year: 2026 } pour le mini-chart. */
function getLast6Months(): { key: string; label: string; year: number }[] {
  const now = new Date();
  const months: { key: string; label: string; year: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    months.push({
      key: `${y}-${m}`,
      label: d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", ""),
      year: y,
    });
  }
  return months;
}

export default function AdminDashboard() {
  const { user } = useAuth();

  const [members, setMembers] = useState<Member[]>([]);
  const [finances, setFinances] = useState<FinanceEntry[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingFinances, setLoadingFinances] = useState(true);

  // Fetch en parallele
  useEffect(() => {
    listMembers()
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoadingMembers(false));
    listFinanceEntries()
      .then(setFinances)
      .catch(() => setFinances([]))
      .finally(() => setLoadingFinances(false));
    listUsers()
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  // ═══ KPIs ═══════════════════════════════════════════════════════
  const activeMembers = members.filter((m) => m.status === "actif").length;
  const pendingMembers = members.filter((m) => m.status === "en_attente").length;

  const nowDate = new Date();
  const currentMonthKey = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, "0")}`;
  const monthIncome = finances
    .filter((f) => f.type === "income" && f.date.startsWith(currentMonthKey))
    .reduce((s, f) => s + f.amount, 0);
  const totalIncome = finances
    .filter((f) => f.type === "income")
    .reduce((s, f) => s + f.amount, 0);

  // ═══ Évolution membres 6 mois ═══════════════════════════════════
  const last6 = getLast6Months();
  const memberGrowth = last6.map((m) => {
    const count = members.filter((mem) => {
      const ts = mem.joinedAt || mem.createdAt;
      const d = new Date(ts);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return k === m.key;
    }).length;
    return { ...m, count };
  });
  const maxGrowth = Math.max(1, ...memberGrowth.map((m) => m.count));

  // ═══ 5 dernières inscriptions ═══════════════════════════════════
  const recentMembers = [...members]
    .sort((a, b) => (b.joinedAt || b.createdAt) - (a.joinedAt || a.createdAt))
    .slice(0, 5);

  // ═══ Activité commissions ═══════════════════════════════════════
  // Compte le nb d'utilisateurs admin par commission (proxy d'activite)
  const commissionStats = COMMISSIONS_LIST.map((name) => ({
    name,
    count: users.filter((u) => u.commission === name).length,
  }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const visibleSections = SECTIONS.filter((s) => hasPermission(user, s.perm));

  return (
    <AdminShell>
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Tableau de bord
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          Bienvenue, {user?.displayName || user?.email?.split("@")[0]}
        </h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
        <KpiCard
          icon={<FaUserCheck />}
          label="Membres actifs"
          value={loadingMembers ? "…" : String(activeMembers)}
          accent="green"
          hint={`${members.length} au total`}
        />
        <KpiCard
          icon={<FaUserClock />}
          label="En attente"
          value={loadingMembers ? "…" : String(pendingMembers)}
          accent="amber"
          hint="Paiement Wave à valider"
        />
        <KpiCard
          icon={<FaSackDollar />}
          label="Recettes ce mois"
          value={loadingFinances ? "…" : fmtFCFA(monthIncome)}
          accent="gold"
          hint={`vs total : ${fmtFCFA(totalIncome)}`}
        />
        <KpiCard
          icon={<FaChartLine />}
          label="Comptes admin"
          value={String(users.length)}
          accent="blue"
          hint={`${commissionStats.length} commissions actives`}
        />
      </div>

      {/* CHART + RECENT MEMBERS */}
      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        {/* Mini chart évolution membres */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#B8860B] font-bold">
                Évolution
              </p>
              <h2 className="font-display text-xl font-bold text-[#0F7C55]">
                Nouveaux membres / 6 mois
              </h2>
            </div>
            <span className="text-sm text-gray-500">
              {memberGrowth.reduce((s, m) => s + m.count, 0)} nouveaux
            </span>
          </div>
          <div className="flex items-end justify-between gap-2 h-40">
            {memberGrowth.map((m) => {
              const heightPct = (m.count / maxGrowth) * 100;
              return (
                <div key={m.key} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end h-full">
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        m.count > 0
                          ? "bg-gradient-to-t from-[#0F7C55] to-[#1B7A4A]"
                          : "bg-gray-100"
                      }`}
                      style={{ height: `${heightPct}%`, minHeight: m.count > 0 ? "6px" : "2px" }}
                      title={`${m.count} membre${m.count > 1 ? "s" : ""}`}
                    />
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
                    {m.label}
                  </span>
                  <span className="text-xs font-bold text-[#0F7C55] tabular-nums -mt-1.5">
                    {m.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dernières inscriptions */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#B8860B] font-bold">
                Récent
              </p>
              <h2 className="font-display text-xl font-bold text-[#0F7C55]">
                Dernières inscriptions
              </h2>
            </div>
            <Link
              href="/admin/membres"
              className="text-xs text-[#B8860B] hover:underline font-semibold"
            >
              Tout voir →
            </Link>
          </div>
          {loadingMembers ? (
            <p className="text-gray-400 text-sm">Chargement…</p>
          ) : recentMembers.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucun membre pour l&apos;instant.</p>
          ) : (
            <ul className="space-y-2.5">
              {recentMembers.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-3 py-2 px-3 -mx-3 rounded-xl hover:bg-[#F8F5EF] transition"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] flex items-center justify-center text-[#D4AF37] font-black text-xs flex-shrink-0">
                    {(m.prenom?.[0] || "") + (m.nom?.[0] || "")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#0F7C55] truncate">
                      {m.prenom} {m.nom}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {m.ville || m.pays || "Lieu non renseigné"} ·{" "}
                      {fmtDateShort(m.joinedAt || m.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={m.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* TOP COMMISSIONS */}
      {commissionStats.length > 0 && (
        <div className="bg-white rounded-3xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#B8860B] font-bold">
                Organisation
              </p>
              <h2 className="font-display text-xl font-bold text-[#0F7C55]">
                Commissions actives
              </h2>
            </div>
            <Link
              href="/admin/utilisateurs"
              className="text-xs text-[#B8860B] hover:underline font-semibold"
            >
              Gérer les comptes →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {commissionStats.map((c) => {
              const maxC = commissionStats[0].count;
              const widthPct = (c.count / maxC) * 100;
              return (
                <div
                  key={c.name}
                  className="bg-[#F8F5EF] rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-[#0F7C55] truncate pr-2">
                      {c.name}
                    </p>
                    <span className="text-lg font-black text-[#0F7C55] tabular-nums">
                      {c.count}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] rounded-full transition-all"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] text-gray-500 uppercase tracking-wider">
                    {c.count > 1 ? "responsables" : "responsable"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RACCOURCIS SECTIONS */}
      {visibleSections.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#B8860B] font-bold mb-4">
            Accès rapide
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {visibleSections.map((s) => {
              const Icon = s.Icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md p-4 transition hover:-translate-y-0.5 text-center"
                >
                  <div className="w-10 h-10 mx-auto rounded-xl bg-[#F8F5EF] text-[#0F7C55] flex items-center justify-center text-lg group-hover:bg-[#0F7C55] group-hover:text-[#D4AF37] transition">
                    <Icon />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-[#0F7C55] leading-tight">
                    {s.label}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {visibleSections.length === 0 && (
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

function KpiCard({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  accent: "green" | "amber" | "gold" | "blue";
}) {
  const accentStyles: Record<typeof accent, string> = {
    green: "from-[#0F7C55] to-[#0A3D24] text-white",
    amber: "from-orange-400 to-orange-500 text-white",
    gold: "from-[#B8860B] to-[#D4AF37] text-[#0F7C55]",
    blue: "from-blue-500 to-blue-600 text-white",
  };
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${accentStyles[accent]} flex items-center justify-center text-sm sm:text-base`}
        >
          {icon}
        </div>
      </div>
      <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">
        {label}
      </p>
      <p className="font-display mt-1 text-xl sm:text-2xl lg:text-3xl font-black text-[#0F7C55] tabular-nums leading-tight">
        {value}
      </p>
      {hint && <p className="mt-1 text-[10px] text-gray-400">{hint}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: Member["status"] }) {
  const config: Record<Member["status"], { label: string; cls: string }> = {
    actif: { label: "Actif", cls: "bg-emerald-100 text-emerald-700" },
    en_attente: { label: "En attente", cls: "bg-orange-100 text-orange-700" },
    inactif: { label: "Inactif", cls: "bg-gray-100 text-gray-600" },
  };
  const c = config[status];
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider flex-shrink-0 ${c.cls}`}
    >
      {c.label}
    </span>
  );
}
