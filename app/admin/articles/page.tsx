"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus, FaTrash, FaPenToSquare } from "react-icons/fa6";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { hasPermission, Article } from "@/lib/admin-types";
import { listArticles, deleteArticle } from "@/lib/admin-data";

export default function AdminArticlesPage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "articles.write");
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function reload() {
    setLoading(true);
    try {
      setItems(await listArticles());
      setError("");
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

  async function handleDelete(article: Article) {
    if (!confirm(`Supprimer définitivement "${article.title}" ?`)) return;
    await deleteArticle(article.id);
    await reload();
  }

  return (
    <AdminShell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
            Contenu éditorial
          </p>
          <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F5132]">
            Articles & blog
          </h1>
          <p className="mt-2 text-gray-600 text-sm">
            {items.length} article{items.length > 1 ? "s" : ""} au total.
          </p>
        </div>
        {canEdit && (
          <Link
            href="/admin/articles/nouveau"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-3 px-5 rounded-xl font-bold text-sm"
          >
            <FaPlus /> Nouvel article
          </Link>
        )}
      </header>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100 mb-4">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center">
          <p className="text-gray-500">
            Aucun article publié pour l&apos;instant.
          </p>
          {canEdit && (
            <Link
              href="/admin/articles/nouveau"
              className="inline-flex items-center gap-2 mt-5 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-3 px-5 rounded-xl font-bold text-sm"
            >
              <FaPlus /> Créer le premier article
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {items.map((article) => (
              <li
                key={article.id}
                className="flex items-start gap-4 px-4 sm:px-6 py-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-[#0F5132] font-semibold text-base sm:text-lg">
                      {article.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest ${
                        article.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {article.status === "published" ? "Publié" : "Brouillon"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {article.authorName ?? "—"} •{" "}
                    {new Date(article.updatedAt).toLocaleDateString("fr-FR")}
                  </p>
                  {article.excerpt && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                </div>
                {canEdit && (
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F5132] py-1.5 px-3 rounded-lg text-xs font-semibold"
                    >
                      <FaPenToSquare /> Éditer
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(article)}
                      className="inline-flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 px-3 rounded-lg text-xs font-semibold"
                    >
                      <FaTrash /> Suppr.
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminShell>
  );
}
