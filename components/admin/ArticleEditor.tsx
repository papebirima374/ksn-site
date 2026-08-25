"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import {
  Article,
  ArticleImage,
  ArticleStatus,
  ArticleLang,
  ArticleTranslation,
  ARTICLE_LANGS,
} from "@/lib/admin-types";
import {
  createArticle,
  updateArticle,
  uploadArticleCover,
  uploadArticleImage,
} from "@/lib/admin-data";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const EMPTY: ArticleTranslation = { title: "", excerpt: "", content: "" };

/** Construit l'etat par-langue a partir d'un article existant. */
function initialByLang(
  initial?: Article
): Record<ArticleLang, ArticleTranslation> {
  const base: Record<ArticleLang, ArticleTranslation> = {
    fr: { ...EMPTY },
    ar: { ...EMPTY },
    en: { ...EMPTY },
    wo: { ...EMPTY },
  };
  if (initial) {
    const primary = initial.primaryLang ?? "fr";
    base[primary] = {
      title: initial.title ?? "",
      excerpt: initial.excerpt ?? "",
      content: initial.content ?? "",
    };
    if (initial.translations) {
      for (const [lang, tr] of Object.entries(initial.translations)) {
        if (tr) base[lang as ArticleLang] = { ...EMPTY, ...tr };
      }
    }
  }
  return base;
}

type Props = {
  initial?: Article;
};

export default function ArticleEditor({ initial }: Props) {
  const router = useRouter();
  const { user } = useAuth();

  const [primaryLang, setPrimaryLang] = useState<ArticleLang>(
    initial?.primaryLang ?? "fr"
  );
  const [activeLang, setActiveLang] = useState<ArticleLang>(
    initial?.primaryLang ?? "fr"
  );
  const [byLang, setByLang] = useState<Record<ArticleLang, ArticleTranslation>>(
    () => initialByLang(initial)
  );

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [images, setImages] = useState<ArticleImage[]>(initial?.images ?? []);
  const [status, setStatus] = useState<ArticleStatus>(initial?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(0);
  const [error, setError] = useState("");
  const [autoSlug, setAutoSlug] = useState(!initial);

  const activeDir = activeLang === "ar" ? "rtl" : "ltr";
  const cur = byLang[activeLang];

  /** Met a jour un champ (title/excerpt/content) de la langue active. */
  function setField(field: keyof ArticleTranslation, value: string) {
    setByLang((prev) => ({
      ...prev,
      [activeLang]: { ...prev[activeLang], [field]: value },
    }));
    // Le slug se derive du titre de la langue PRINCIPALE.
    if (field === "title" && activeLang === primaryLang && autoSlug) {
      setSlug(slugify(value));
    }
  }

  function hasContent(lang: ArticleLang) {
    const t = byLang[lang];
    return Boolean(t.title.trim() || t.content.trim());
  }

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

  async function handleGalleryUpload(files: FileList) {
    const list = Array.from(files);
    setUploadingGallery(list.length);
    try {
      for (const file of list) {
        const url = await uploadArticleImage(file);
        setImages((prev) => [...prev, { url, caption: "" }]);
        setUploadingGallery((n) => n - 1);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'upload");
      setUploadingGallery(0);
    }
  }

  function updateCaption(index: number, caption: string) {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, caption } : img))
    );
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function moveImage(index: number, delta: number) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    const main = byLang[primaryLang];
    if (!main.title.trim() || !main.content.trim()) {
      setError(
        "La langue principale doit avoir au moins un titre et un contenu."
      );
      setActiveLang(primaryLang);
      return;
    }
    if (!slug.trim()) {
      setError("Le slug (URL) est obligatoire.");
      return;
    }

    // Traductions = langues secondaires non vides.
    const translations: Partial<Record<ArticleLang, ArticleTranslation>> = {};
    for (const { id } of ARTICLE_LANGS) {
      if (id === primaryLang) continue;
      const t = byLang[id];
      if (t.title.trim() || t.content.trim()) {
        translations[id] = {
          title: t.title,
          excerpt: t.excerpt,
          content: t.content,
        };
      }
    }

    setSaving(true);
    setError("");
    try {
      const shared = {
        title: main.title,
        excerpt: main.excerpt,
        content: main.content,
        slug,
        coverImage,
        images,
        status,
        primaryLang,
        translations,
      };
      if (initial) {
        await updateArticle(initial.id, {
          ...shared,
          publishedAt:
            status === "published"
              ? initial.publishedAt ?? Date.now()
              : undefined,
        });
      } else {
        await createArticle({
          ...shared,
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
        {/* Onglets de langue */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Langues de l&apos;article
          </label>
          <div className="flex flex-wrap gap-2">
            {ARTICLE_LANGS.map((l) => {
              const active = l.id === activeLang;
              const filled = hasContent(l.id);
              const isPrimary = l.id === primaryLang;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setActiveLang(l.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold border transition ${
                    active
                      ? "bg-[#0F7C55] text-white border-[#0F7C55]"
                      : "bg-white text-[#0F7C55] border-gray-200 hover:border-[#0F7C55]"
                  }`}
                >
                  {l.native}
                  {isPrimary && (
                    <span
                      className={`ml-1.5 text-[10px] ${active ? "text-[#E7C86B]" : "text-[#B8860B]"}`}
                    >
                      ★
                    </span>
                  )}
                  {filled && !isPrimary && (
                    <span className="ml-1.5 text-[10px] text-emerald-400">
                      ●
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <span>Langue principale (★, affichée par défaut) :</span>
            <select
              value={primaryLang}
              onChange={(e) => setPrimaryLang(e.target.value as ArticleLang)}
              className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-[#0F7C55] bg-white"
            >
              {ARTICLE_LANGS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.native}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Titre ({ARTICLE_LANGS.find((l) => l.id === activeLang)?.native})
          </label>
          <input
            type="text"
            dir={activeDir}
            value={cur.title}
            onChange={(e) => setField("title", e.target.value)}
            className="w-full rounded-xl border border-gray-200 p-3 text-lg font-bold text-[#0F7C55] bg-white"
            placeholder="Le titre de votre article"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Slug (URL) — commun a toutes les langues
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
              className="flex-1 rounded-xl border border-gray-200 p-3 text-sm font-mono text-[#0F7C55] bg-white"
              placeholder="ex : laylat-al-mawlid-jadhb-al-qulub"
            />
            <button
              type="button"
              onClick={() => {
                setAutoSlug(true);
                setSlug(slugify(byLang[primaryLang].title));
              }}
              className="text-xs px-3 rounded-xl bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F7C55] font-semibold"
            >
              Auto
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">
            Pour un titre arabe, le bouton Auto ne genere rien : tape le slug en
            lettres latines.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Resume court ({ARTICLE_LANGS.find((l) => l.id === activeLang)?.native})
          </label>
          <textarea
            dir={activeDir}
            value={cur.excerpt}
            onChange={(e) => setField("excerpt", e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-gray-200 p-3 text-sm text-[#0F7C55] bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Contenu ({ARTICLE_LANGS.find((l) => l.id === activeLang)?.native}) —
            texte tel quel, sauts de ligne conserves
          </label>
          <textarea
            dir={activeDir}
            value={cur.content}
            onChange={(e) => setField("content", e.target.value)}
            rows={16}
            className="w-full rounded-xl border border-gray-200 p-3 text-sm text-[#0F7C55] bg-white font-mono leading-7"
            placeholder="Collez votre texte ici. Il sera affiche exactement comme saisi."
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
              <Image
                src={coverImage}
                alt="Couverture"
                fill
                sizes="500px"
                className="object-cover"
                unoptimized={coverImage.startsWith("http")}
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleCoverUpload(f);
            }}
            className="text-sm text-[#0F7C55] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#0F7C55] file:text-white file:font-semibold file:cursor-pointer"
          />
          {uploading && <p className="text-xs text-gray-500 mt-2">Upload…</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Photos de l&apos;article (galerie affichee sous le texte)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Tu peux en selectionner plusieurs d&apos;un coup. La legende est
            facultative.
          </p>

          {images.length > 0 && (
            <ul className="grid sm:grid-cols-2 gap-4 mb-4">
              {images.map((img, i) => (
                <li
                  key={img.url}
                  className="bg-[#F8F5EF] rounded-2xl p-3 flex flex-col gap-2"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-white">
                    <Image
                      src={img.url}
                      alt={img.caption || `Photo ${i + 1}`}
                      fill
                      sizes="300px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <input
                    type="text"
                    value={img.caption ?? ""}
                    onChange={(e) => updateCaption(i, e.target.value)}
                    placeholder="Legende (facultative)"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-[#0F7C55] bg-white"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveImage(i, -1)}
                        disabled={i === 0}
                        className="px-2 py-1 rounded-lg bg-white text-[#0F7C55] text-xs font-bold disabled:opacity-30"
                        aria-label="Deplacer vers la gauche"
                      >
                        &larr;
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(i, 1)}
                        disabled={i === images.length - 1}
                        className="px-2 py-1 rounded-lg bg-white text-[#0F7C55] text-xs font-bold disabled:opacity-30"
                        aria-label="Deplacer vers la droite"
                      >
                        &rarr;
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold"
                    >
                      Retirer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length) handleGalleryUpload(files);
              e.target.value = "";
            }}
            className="text-sm text-[#0F7C55] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#0F7C55] file:text-white file:font-semibold file:cursor-pointer"
          />
          {uploadingGallery > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Upload de {uploadingGallery} photo
              {uploadingGallery > 1 ? "s" : ""}…
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Statut
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ArticleStatus)}
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55] bg-white"
          >
            <option value="draft">Brouillon (non visible)</option>
            <option value="published">Publie (visible sur le site)</option>
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
          className="flex-1 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-4 rounded-2xl font-bold disabled:opacity-50"
        >
          {saving
            ? "Enregistrement…"
            : initial
              ? "Enregistrer les modifications"
              : "Creer l'article"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/articles")}
          className="px-6 bg-white border border-gray-200 text-[#0F7C55] rounded-2xl font-semibold"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
