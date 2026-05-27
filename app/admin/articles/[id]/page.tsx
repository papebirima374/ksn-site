"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ArticleEditor from "@/components/admin/ArticleEditor";
import { getArticle } from "@/lib/admin-data";
import { Article } from "@/lib/admin-types";

export default function EditArticlePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const a = await getArticle(id);
        if (!a) setError("Article introuvable.");
        else setArticle(a);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <AdminShell>
      <header className="mb-8">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Éditer
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          {article?.title ?? "Article"}
        </h1>
      </header>

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : error ? (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
          {error}
        </p>
      ) : article ? (
        <ArticleEditor initial={article} />
      ) : null}
    </AdminShell>
  );
}
