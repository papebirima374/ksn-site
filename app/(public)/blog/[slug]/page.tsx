"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { isFirebaseConfigured } from "@/lib/firebase";
import { listArticles } from "@/lib/admin-data";
import {
  Article,
  ArticleLang,
  ARTICLE_LANGS,
  articleLangs,
} from "@/lib/admin-types";
import ShareButton from "@/components/ui/ShareButton";

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  /** Photo ouverte en grand (index dans article.images). */
  const [zoom, setZoom] = useState<number | null>(null);
  /** Langue choisie par le lecteur (null = langue principale). */
  const [lang, setLang] = useState<ArticleLang | null>(null);

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

  useEffect(() => {
    if (zoom === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

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

  const langs = articleLangs(article);
  const primary: ArticleLang = article.primaryLang ?? "fr";
  const effLang: ArticleLang = lang && langs.includes(lang) ? lang : langs[0];
  const view =
    effLang === primary || !article.translations?.[effLang]
      ? {
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
        }
      : article.translations[effLang]!;

  return (
    <article className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 lg:pt-48 pb-20 sm:pb-28">
      <div className="flex items-center justify-between gap-3 mb-6">
        <Link
          href="/blog"
          className="inline-flex text-[#D4AF37] hover:text-white text-sm font-semibold transition"
        >
          ← Tous les articles
        </Link>
        <ShareButton
          title={view.title}
          text={view.excerpt || view.title}
          variant="ghost"
          label="Partager"
        />
      </div>

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

        {langs.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {langs.map((l) => {
              const meta = ARTICLE_LANGS.find((x) => x.id === l);
              const on = l === effLang;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition ${
                    on
                      ? "bg-[#0F7C55] text-white shadow"
                      : "bg-[#F8F5EF] text-[#0F7C55] hover:bg-[#EAE7DF]"
                  }`}
                  aria-pressed={on}
                >
                  {meta?.native ?? l}
                </button>
              );
            })}
          </div>
        )}

        <h1
          dir="auto"
          className="article-title mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55] leading-tight"
        >
          {view.title}
        </h1>

        <p
          dir="auto"
          className="article-excerpt mt-4 text-lg sm:text-xl text-gray-600 leading-relaxed italic"
        >
          {view.excerpt}
        </p>

        <div className="w-16 h-0.5 bg-[#D4AF37] my-8" />

        <div
          dir="auto"
          className="article-body prose prose-lg max-w-none text-gray-700 leading-8 whitespace-pre-wrap"
        >
          {view.content}
        </div>

        {article.images && article.images.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold text-[#0F7C55]">
              En images
            </h2>
            <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {article.images.map((img, i) => (
                <figure key={img.url} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setZoom(i)}
                    className="relative aspect-square rounded-2xl overflow-hidden shadow-md hover:opacity-90 transition"
                  >
                    <Image
                      src={img.url}
                      alt={img.caption || `${article.title} — photo ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 250px"
                      className="object-cover"
                      unoptimized={img.url.startsWith("http")}
                    />
                  </button>
                  {img.caption && (
                    <figcaption className="mt-2 text-xs text-gray-500 leading-5">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Partage en bas d'article */}
        <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-gray-500 font-medium">
            Cet article vous a inspiré ? Partagez-le 🤲
          </p>
          <ShareButton
            title={view.title}
            text={view.excerpt || view.title}
            variant="primary"
            label="Partager l'article"
          />
        </div>
      </div>

      {zoom !== null && article.images?.[zoom] && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setZoom(null)}
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative w-full max-w-4xl aspect-[4/3]">
            <Image
              src={article.images[zoom].url}
              alt={article.images[zoom].caption || article.title}
              fill
              sizes="100vw"
              className="object-contain"
              unoptimized={article.images[zoom].url.startsWith("http")}
            />
          </div>
          {article.images[zoom].caption && (
            <p className="mt-4 text-white/80 text-sm text-center max-w-2xl">
              {article.images[zoom].caption}
            </p>
          )}
          <p className="mt-2 text-white/40 text-xs">
            Touchez l&apos;écran pour fermer
          </p>
        </div>
      )}
    </article>
  );
}
