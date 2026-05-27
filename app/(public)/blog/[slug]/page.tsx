"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { isFirebaseConfigured } from "@/lib/firebase";
import { listArticles } from "@/lib/admin-data";
import { Article } from "@/lib/admin-types";

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug || !isFirebaseConfigured()) {
      setTimeout(() => setLoading(false), 0);
      return;
    }
    listArticles()
      .then((items) => {
        const found = items.find(
          (a) => a.slug === slug && a.status === "published"
        );
        if (found) setArticle(found);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 lg:pt-48 pb-20">
        <p className="text-center text-white/70">Chargement…</p>
      </section>
    );
  }

  if (notFound || !article) {
    return (
      <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 lg:pt-48 pb-20 text-center">
        <div className="text-5xl sm:text-6xl">📭</div>
        <h1 className="font-display mt-4 text-3xl sm:text-4xl font-bold text-white">
          Article introuvable
        </h1>
        <p className="mt-3 text-white/70">
          Cet article n&apos;existe pas ou n&apos;est plus publié.
        </p>
        <Link
          href="/blog"
          className="inline-flex mt-8 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] px-6 py-3 rounded-2xl font-bold"
        >
          ← Retour au blog
        </Link>
      </section>
    );
  }

  return (
    <article className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 lg:pt-48 pb-20 sm:pb-28">
      <Link
        href="/blog"
        className="inline-flex text-[#D4AF37] hover:text-white text-sm font-semibold mb-6 transition"
      >
        ← Tous les articles
      </Link>

      {article.coverImage && (
        <div className="relative aspect-video rounded-2xl sm:rounded-3xl overflow-hidden mb-8 shadow-2xl">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
            unoptimized={article.coverImage.startsWith("http")}
          />
        </div>
      )}

      <div className="bg-white rounded-[28px] sm:rounded-[40px] p-6 sm:p-10 md:p-14 shadow-2xl">
        <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
          {article.publishedAt &&
            new Date(article.publishedAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          {article.authorName && ` • Par ${article.authorName}`}
        </p>

        <h1 className="font-display mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55] leading-tight">
          {article.title}
        </h1>

        <p className="mt-4 text-lg sm:text-xl text-gray-600 leading-relaxed italic">
          {article.excerpt}
        </p>

        <div className="w-16 h-0.5 bg-[#D4AF37] my-8" />

        <div className="prose prose-lg max-w-none text-gray-700 leading-8 whitespace-pre-wrap">
          {article.content}
        </div>
      </div>
    </article>
  );
}
