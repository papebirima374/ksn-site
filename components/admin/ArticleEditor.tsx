"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Article, ArticleStatus } from "@/lib/admin-types";
import {
  createArticle,
  updateArticle,
  uploadArticleCover,
} from "@/lib/admin-data";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Props = {
  initial?: Article;
};

export default function ArticleEditor({ initial }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [status, setStatus] = useState<ArticleStatus>(initial?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [autoSlug, setAutoSlug] = useState(!initial);

  async function handleCoverUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadArticleCover(file);
      setCoverImage(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'upload");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      if (initial) {
        await updateArticle(initial.id, {
          title,
          slug,
          excerpt,
          content,
          coverImage,
          status,
          publishedAt: status === "published" ? initial.publishedAt ?? Date.now() : undefined,
        });
      } else {
        await createArticle({
          title,
          slug,
          excerpt,
          content,
          coverImage,
          status,
          publishedAt: status === "published" ? Date.now() : undefined,
          authorId: user.uid,
          authorName: user.displayName ?? user.email,
        });
      }
      router.push("/admin/articles");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Titre
          </label>
          <input
            type="text"
            required
            onChange={(e) => {
              const val = e.target.value;
              setTitle(val);
              if (autoSlug) {
                setSlug(slugify(val));
              }
            }}
            className="w-full rounded-xl border border-gray-200 p-3 text-lg font-bold text-[#0F5132] bg-white"
            placeholder="Le titre de votre article"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Slug (URL)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setAutoSlug(false);
                setSlug(slugify(e.target.value));
              }}
              className="flex-1 rounded-xl border border-gray-200 p-3 text-sm font-mono text-[#0F5132] bg-white"
            />
            <button
              type="button"
              onClick={() => {
                setAutoSlug(true);
                setSlug(slugify(title));
              }}
              className="text-xs px-3 rounded-xl bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F5132] font-semibold"
            >
              Auto
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Résumé court (affiché dans la liste)
          </label>
          <textarea
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-gray-200 p-3 text-sm text-[#0F5132] bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Contenu (texte simple, Markdown supporté basique)
          </label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="w-full rounded-xl border border-gray-200 p-3 text-sm text-[#0F5132] bg-white font-mono leading-7"
            placeholder="Écrivez votre article ici. Vous pouvez utiliser Markdown : ## titre, **gras**, *italique*, etc."
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Image de couverture
          </label>
          {coverImage && (
            <div className="relative w-full max-w-md aspect-video rounded-2xl overflow-hidden mb-3">
              <Image src={coverImage} alt="Couverture" fill sizes="500px" className="object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleCoverUpload(f);
            }}
            className="text-sm text-[#0F5132] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#0F5132] file:text-white file:font-semibold file:cursor-pointer"
          />
          {uploading && <p className="text-xs text-gray-500 mt-2">Upload…</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Statut
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ArticleStatus)}
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F5132] bg-white"
          >
            <option value="draft">Brouillon (non visible)</option>
            <option value="published">Publié (visible sur le site)</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-4 rounded-2xl font-bold disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : initial ? "Enregistrer les modifications" : "Créer l'article"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/articles")}
          className="px-6 bg-white border border-gray-200 text-[#0F5132] rounded-2xl font-semibold"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
