"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/layout/PageHero";
import { isFirebaseConfigured } from "@/lib/firebase";
import { listArticles } from "@/lib/admin-data";
import { Article } from "@/lib/admin-types";

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }
    listArticles()
      .then((items) =>
        setArticles(items.filter((a) => a.status === "published"))
      )
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        overline="Articles & Actualités"
        title="Blog KSN"
        description="Articles, annonces, réflexions spirituelles et actualités officielles du Dahira Kippangog Salaatu 'Alaa Nabii."
      />

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14">
          {loading ? (
            <p className="text-center text-gray-500 py-8">Chargement…</p>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <div className="text-5xl sm:text-6xl">📝</div>
              <p className="mt-4 text-gray-500 text-sm sm:text-base">
                Aucun article publié pour l&apos;instant. Revenez bientôt !
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group bg-[#F8F5EF] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:-translate-y-1 transition"
                >
                  {article.coverImage ? (
                    <div className="relative aspect-video">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                        unoptimized={article.coverImage.startsWith("http")}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-[#0F5132] to-[#B8860B] flex items-center justify-center text-5xl">
                      📰
                    </div>
                  )}
                  <div className="p-5 sm:p-6">
                    <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString(
                            "fr-FR",
                            { day: "numeric", month: "long", year: "numeric" }
                          )
                        : "Récent"}
                    </p>
                    <h3 className="font-display mt-2 text-lg sm:text-xl font-bold text-[#0F5132] line-clamp-2 group-hover:text-[#B8860B] transition">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm leading-6 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <p className="mt-3 text-[#B8860B] text-xs font-semibold">
                      Lire l&apos;article →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
