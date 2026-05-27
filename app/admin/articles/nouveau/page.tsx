"use client";

import AdminShell from "@/components/admin/AdminShell";
import ArticleEditor from "@/components/admin/ArticleEditor";

export default function NewArticlePage() {
  return (
    <AdminShell>
      <header className="mb-8">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Nouvel article
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          Rédiger un article
        </h1>
      </header>

      <ArticleEditor />
    </AdminShell>
  );
}
