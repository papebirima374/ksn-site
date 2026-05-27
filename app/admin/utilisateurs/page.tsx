"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import {
  AppUser,
  ALL_PERMISSIONS,
  PERMISSION_LABELS,
  Permission,
  UserRole,
} from "@/lib/admin-types";
import { listUsers, updateUserPermissions, deleteUserDoc } from "@/lib/admin-data";
import { FaTrash, FaUserShield, FaUserGear } from "react-icons/fa6";

export default function AdminUsersPage() {
  const { user, refresh } = useAuth();
  const isAdmin = user?.role === "admin";
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    try {
      setUsers(await listUsers());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (isAdmin) reload();
      else setLoading(false);
    }, 0);
  }, [isAdmin]);

  async function updateUser(u: AppUser, patch: Partial<AppUser>) {
    await updateUserPermissions(u.uid, patch);
    if (u.uid === user?.uid) await refresh();
    await reload();
  }

  async function togglePerm(u: AppUser, p: Permission) {
    const has = u.permissions.includes(p);
    const next = has ? u.permissions.filter((x) => x !== p) : [...u.permissions, p];
    await updateUser(u, { permissions: next });
  }

  async function setRole(u: AppUser, role: UserRole) {
    await updateUser(u, { role });
  }

  async function setCommission(u: AppUser, commission: string) {
    await updateUser(u, { commission });
  }

  async function setDisplayName(u: AppUser, displayName: string) {
    await updateUser(u, { displayName });
  }

  async function handleDelete(u: AppUser) {
    if (u.uid === user?.uid) {
      alert("Vous ne pouvez pas supprimer votre propre compte.");
      return;
    }
    if (!confirm(`Supprimer le profil de ${u.email} ?\n\nCela retire ses permissions du Firestore, mais ne supprime pas le compte Firebase Auth (à faire dans la console).`))
      return;
    await deleteUserDoc(u.uid);
    await reload();
  }

  if (!isAdmin) {
    return (
      <AdminShell>
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center">
          <FaUserShield className="text-5xl text-[#B8860B] mx-auto" />
          <h2 className="font-display mt-4 text-2xl font-bold text-[#0F5132]">
            Accès réservé à l&apos;administrateur principal
          </h2>
          <p className="mt-3 text-gray-600 text-sm">
            Seul le compte avec le rôle « administrateur » peut gérer les
            utilisateurs.
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <header className="mb-8">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Comptes
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F5132]">
          Utilisateurs & permissions
        </h1>
        <p className="mt-2 text-gray-600 text-sm max-w-2xl">
          Gérez les comptes des responsables de commission. Pour <strong>créer un
          nouveau compte</strong>, allez sur la console Firebase →{" "}
          <em>Authentication</em> → <em>Add user</em>, puis revenez ici pour lui
          attribuer ses permissions.
        </p>
        <a
          href={`https://console.firebase.google.com/project/_/authentication/users`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex mt-3 text-sm text-[#B8860B] hover:text-[#D4AF37] underline font-semibold"
        >
          Ouvrir la console Firebase →
        </a>
      </header>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100 mb-4">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center">
          <p className="text-gray-500">
            Aucun utilisateur enregistré pour l&apos;instant.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((u) => {
            const isMe = u.uid === user?.uid;
            const editing = editingId === u.uid;
            return (
              <div
                key={u.uid}
                className="bg-white rounded-3xl shadow-md p-5 sm:p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[#0F5132] text-base sm:text-lg">
                        {u.displayName || u.email}
                      </p>
                      {u.role === "admin" ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-[#D4AF37]/20 text-[#B8860B]">
                          <FaUserShield className="inline mr-1" /> Admin
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-700">
                          <FaUserGear className="inline mr-1" /> {u.commission ?? "Commission"}
                        </span>
                      )}
                      {isMe && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-gray-100 text-gray-700">
                          Vous
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{u.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(editing ? null : u.uid)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F5132] font-semibold"
                    >
                      {editing ? "Fermer" : "Modifier"}
                    </button>
                    {!isMe && (
                      <button
                        type="button"
                        onClick={() => handleDelete(u)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold inline-flex items-center gap-1"
                      >
                        <FaTrash /> Suppr.
                      </button>
                    )}
                  </div>
                </div>

                {editing && (
                  <div className="mt-5 pt-5 border-t border-gray-100 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Nom affiché
                        </label>
                        <input
                          type="text"
                          defaultValue={u.displayName ?? ""}
                          onBlur={(e) => setDisplayName(u, e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F5132] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Rôle
                        </label>
                        <select
                          value={u.role}
                          onChange={(e) => setRole(u, e.target.value as UserRole)}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F5132] bg-white"
                        >
                          <option value="admin">Administrateur</option>
                          <option value="commission">Commission</option>
                        </select>
                      </div>
                    </div>
                    {u.role === "commission" && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Nom de la commission
                        </label>
                        <input
                          type="text"
                          defaultValue={u.commission ?? ""}
                          onBlur={(e) => setCommission(u, e.target.value)}
                          placeholder="ex: Communication, Finances, Éducation…"
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F5132] bg-white"
                        />
                      </div>
                    )}
                    {u.role === "admin" ? (
                      <p className="text-xs text-gray-500 italic">
                        L&apos;administrateur a accès à toutes les sections.
                      </p>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">
                          Permissions
                        </label>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {ALL_PERMISSIONS.map((p) => {
                            const checked = u.permissions.includes(p);
                            return (
                              <label
                                key={p}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F8F5EF] hover:bg-[#E8E6E1] cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => togglePerm(u, p)}
                                  className="w-4 h-4 accent-[#0F5132]"
                                />
                                <span className="text-sm text-[#0F5132]">
                                  {PERMISSION_LABELS[p]}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 bg-[#0F5132] rounded-3xl p-6 sm:p-8 text-white">
        <h3 className="font-display text-lg sm:text-xl font-bold">
          Comment créer un nouveau compte de commission ?
        </h3>
        <ol className="mt-4 space-y-2 text-sm text-white/80 list-decimal list-inside">
          <li>
            Ouvrez la{" "}
            <a
              href="https://console.firebase.google.com/project/_/authentication/users"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] underline"
            >
              console Firebase Auth
            </a>
          </li>
          <li>Cliquez sur « Add user » puis saisissez email + mot de passe</li>
          <li>
            La personne se connecte une fois sur{" "}
            <code className="bg-white/10 px-1.5 py-0.5 rounded">/admin/login</code>{" "}
            (son profil est créé automatiquement avec le rôle commission sans
            permissions)
          </li>
          <li>
            Revenez ici, cliquez « Modifier » sur sa ligne et attribuez ses
            permissions
          </li>
        </ol>
      </div>
    </AdminShell>
  );
}
