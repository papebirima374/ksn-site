"use client";

import { useEffect, useState, FormEvent } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import {
  AppUser,
  ALL_PERMISSIONS,
  COMMISSIONS_LIST,
  PERMISSION_LABELS,
  Permission,
  UserRole,
} from "@/lib/admin-types";
import {
  listUsers,
  updateUserPermissions,
  deleteUserDoc,
  createUserAccount,
} from "@/lib/admin-data";
import { FaTrash, FaUserShield, FaUserGear, FaUserPlus } from "react-icons/fa6";

export default function AdminUsersPage() {
  const { user, refresh } = useAuth();
  const isAdmin = user?.role === "admin";
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulaire creation de compte
  const [showCreate, setShowCreate] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("commission");
  const [newCommission, setNewCommission] = useState<string>(COMMISSIONS_LIST[0]);
  const [newPermissions, setNewPermissions] = useState<Permission[]>([]);
  const [creating, setCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState("");

  function toggleNewPermission(p: Permission) {
    setNewPermissions((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

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

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (creating) return;
    setError("");
    setCreateSuccess("");
    if (newPassword.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }
    setCreating(true);
    try {
      // Un admin a TOUTES les permissions par definition.
      // Un membre de commission n'a que les permissions cochees.
      const permissions: Permission[] =
        newRole === "admin" ? [...ALL_PERMISSIONS] : newPermissions;
      await createUserAccount(newEmail.trim(), newPassword, {
        displayName: newName.trim() || undefined,
        role: newRole,
        commission: newRole === "commission" ? newCommission : undefined,
        permissions,
      });
      const permsCount = permissions.length;
      setCreateSuccess(
        newRole === "admin"
          ? `Compte admin ${newEmail} créé avec toutes les permissions.`
          : `Compte ${newEmail} créé avec ${permsCount} permission${permsCount > 1 ? "s" : ""}.`
      );
      setNewEmail("");
      setNewPassword("");
      setNewName("");
      setNewCommission(COMMISSIONS_LIST[0]);
      setNewPermissions([]);
      setNewRole("commission");
      await reload();
      // Toast disparait apres 5s
      setTimeout(() => setCreateSuccess(""), 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      // Traduction des erreurs Firebase Auth en francais
      if (msg.includes("email-already-in-use")) {
        setError("Cet email a déjà un compte. Choisissez-en un autre ou supprimez l'ancien.");
      } else if (msg.includes("weak-password")) {
        setError("Mot de passe trop faible (minimum 6 caractères).");
      } else if (msg.includes("invalid-email")) {
        setError("Format d'email invalide.");
      } else {
        setError(msg);
      }
    } finally {
      setCreating(false);
    }
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
          <h2 className="font-display mt-4 text-2xl font-bold text-[#0F7C55]">
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
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          Utilisateurs & permissions
        </h1>
        <p className="mt-2 text-gray-600 text-sm max-w-2xl">
          Gérez les comptes des responsables de commission. Créez un nouveau
          compte ci-dessous, puis cliquez « Modifier » sur sa ligne pour
          attribuer ses permissions.
        </p>
        <button
          type="button"
          onClick={() => {
            setShowCreate((v) => !v);
            setError("");
            setCreateSuccess("");
          }}
          className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold px-4 py-2.5 rounded-xl shadow-md hover:scale-105 transition text-sm"
        >
          <FaUserPlus />
          {showCreate ? "Fermer le formulaire" : "Créer un nouveau compte"}
        </button>
      </header>

      {createSuccess && (
        <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3 border border-emerald-200 mb-4">
          ✓ {createSuccess}
        </p>
      )}

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-3xl shadow-md p-6 sm:p-8 mb-8 space-y-4"
        >
          <h2 className="font-display text-xl font-bold text-[#0F7C55] flex items-center gap-2">
            <FaUserPlus /> Nouveau compte
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="prenom.nom@example.com"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Mot de passe initial <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white font-mono"
                autoComplete="new-password"
              />
              <p className="mt-1 text-[10px] text-gray-500">
                Communiquez-le à la personne — elle pourra le changer ensuite via Mot de passe oublié.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Nom affiché
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Pape Diop"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Rôle
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
              >
                <option value="commission">Commission</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            {newRole === "commission" && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Nom de la commission
                </label>
                <select
                  value={newCommission}
                  onChange={(e) => setNewCommission(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
                >
                  {COMMISSIONS_LIST.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* PERMISSIONS — visibles uniquement pour role "commission" */}
          {newRole === "commission" ? (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <label className="block text-xs font-semibold text-gray-600">
                  Permissions de ce compte ({newPermissions.length}/{ALL_PERMISSIONS.length})
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPermissions([...ALL_PERMISSIONS])}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F7C55] font-semibold"
                  >
                    Tout cocher
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPermissions([])}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F7C55] font-semibold"
                  >
                    Tout décocher
                  </button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {ALL_PERMISSIONS.map((p) => {
                  const checked = newPermissions.includes(p);
                  return (
                    <label
                      key={p}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition ${
                        checked
                          ? "bg-[#0F7C55]/10 border border-[#0F7C55]/30"
                          : "bg-[#F8F5EF] hover:bg-[#E8E6E1] border border-transparent"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleNewPermission(p)}
                        className="w-4 h-4 accent-[#0F7C55]"
                      />
                      <span className="text-sm text-[#0F7C55]">
                        {PERMISSION_LABELS[p]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="pt-2 px-4 py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl">
              <p className="text-sm text-[#B8860B] flex items-center gap-2">
                <FaUserShield />
                <span>
                  <strong>Administrateur</strong> — accès complet à toutes les
                  sections, toutes les permissions activées automatiquement.
                </span>
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 items-center pt-3">
            <button
              type="submit"
              disabled={creating || !newEmail || !newPassword}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100 text-sm"
            >
              <FaUserPlus /> {creating ? "Création…" : "Créer le compte"}
            </button>
            <p className="text-xs text-gray-500">
              Les permissions peuvent être modifiées plus tard via le bouton « Modifier ».
            </p>
          </div>
        </form>
      )}

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
                      <p className="font-semibold text-[#0F7C55] text-base sm:text-lg">
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
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F7C55] font-semibold"
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
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Rôle
                        </label>
                        <select
                          value={u.role}
                          onChange={(e) => setRole(u, e.target.value as UserRole)}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
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
                        <select
                          value={
                            u.commission && (COMMISSIONS_LIST as readonly string[]).includes(u.commission)
                              ? u.commission
                              : COMMISSIONS_LIST[0]
                          }
                          onChange={(e) => setCommission(u, e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
                        >
                          {COMMISSIONS_LIST.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        {u.commission && !(COMMISSIONS_LIST as readonly string[]).includes(u.commission) && (
                          <p className="text-[11px] text-orange-600 mt-1.5">
                            ⚠️ Commission « {u.commission} » non standard. Sélectionnez une commission officielle ci-dessus.
                          </p>
                        )}
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
                                  className="w-4 h-4 accent-[#0F7C55]"
                                />
                                <span className="text-sm text-[#0F7C55]">
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

      <div className="mt-8 bg-[#F8F5EF] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-7 text-[#0F7C55]">
        <h3 className="font-display text-lg font-bold mb-2">
          💡 Note pour la suppression
        </h3>
        <p className="text-sm text-gray-700 leading-6">
          Cliquer « Suppr. » retire les permissions Firestore mais ne supprime
          pas le compte Firebase Auth lui-même. Pour révoquer totalement
          l&apos;accès, allez aussi sur{" "}
          <a
            href="https://console.firebase.google.com/project/_/authentication/users"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B8860B] hover:text-[#D4AF37] underline font-semibold"
          >
            Firebase Console → Authentication
          </a>{" "}
          et supprimez le compte là-bas.
        </p>
      </div>
    </AdminShell>
  );
}
