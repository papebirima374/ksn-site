"use client";

import { useEffect, useState, FormEvent } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { hasPermission, MenuItem } from "@/lib/admin-types";
import {
  listMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "@/lib/admin-data";
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaEye, FaEyeSlash } from "react-icons/fa6";

export default function AdminMenuPage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "menu.write");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [error, setError] = useState("");

  async function reload() {
    setLoading(true);
    try {
      setItems(await listMenu());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      reload();
    }, 0);
  }, []);

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const maxOrder = items.reduce((m, i) => Math.max(m, i.order), 0);
    await createMenuItem({
      label,
      href,
      order: maxOrder + 1,
      visible: true,
    });
    setLabel("");
    setHref("");
    await reload();
  }

  async function move(item: MenuItem, dir: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((i) => i.id === item.id);
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;
    const target = sorted[targetIdx];
    await Promise.all([
      updateMenuItem(item.id, { order: target.order }),
      updateMenuItem(target.id, { order: item.order }),
    ]);
    await reload();
  }

  async function toggleVisible(item: MenuItem) {
    await updateMenuItem(item.id, { visible: !item.visible });
    await reload();
  }

  async function handleDelete(item: MenuItem) {
    if (!confirm(`Supprimer "${item.label}" du menu ?`)) return;
    await deleteMenuItem(item.id);
    await reload();
  }

  return (
    <AdminShell>
      <header className="mb-8">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Navigation
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F5132]">
          Menu de navigation
        </h1>
        <p className="mt-2 text-gray-600 text-sm">
          Ajoutez, réorganisez ou masquez des liens du menu principal du site.
        </p>
      </header>

      {canEdit && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-3xl shadow-md p-6 sm:p-8 mb-8 grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end"
        >
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Libellé
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="ex: Boutique"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F5132] bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Lien (URL relative)
            </label>
            <input
              type="text"
              required
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="ex: /boutique"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F5132] bg-white"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-2.5 px-5 rounded-xl font-bold"
          >
            <FaPlus /> Ajouter
          </button>
        </form>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100 mb-4">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center">
          <p className="text-gray-500">
            Aucun lien custom — le menu utilise les liens par défaut (Accueil, Le
            Dahira, Spiritualité, Média, Contact).
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {[...items]
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[#0F5132] font-semibold text-sm sm:text-base">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {item.href}
                    </p>
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-1">
                      <IconButton onClick={() => move(item, -1)} label="Monter">
                        <FaArrowUp />
                      </IconButton>
                      <IconButton onClick={() => move(item, 1)} label="Descendre">
                        <FaArrowDown />
                      </IconButton>
                      <IconButton
                        onClick={() => toggleVisible(item)}
                        label={item.visible ? "Masquer" : "Afficher"}
                      >
                        {item.visible ? <FaEye /> : <FaEyeSlash />}
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(item)}
                        label="Supprimer"
                        variant="danger"
                      >
                        <FaTrash />
                      </IconButton>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}

      <p className="mt-6 text-xs text-gray-500 italic">
        Note : les liens par défaut du menu (Accueil, Le Dahira, Spiritualité,
        Média, Contact) sont gérés dans le code et ne peuvent pas être supprimés
        depuis cette interface. Les liens ajoutés ici s&apos;y ajoutent.
      </p>
    </AdminShell>
  );
}

function IconButton({
  children,
  onClick,
  label,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  variant?: "danger";
}) {
  const base =
    "w-9 h-9 rounded-lg flex items-center justify-center transition text-sm";
  const color =
    variant === "danger"
      ? "bg-red-50 hover:bg-red-100 text-red-600"
      : "bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F5132]";
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={`${base} ${color}`}>
      {children}
    </button>
  );
}
