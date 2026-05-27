"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  SalaatuLibraryItem,
  SALAATU_CATEGORIES,
} from "@/lib/admin-types";
import {
  createSalaatuLibraryItem,
  updateSalaatuLibraryItem,
} from "@/lib/admin-data";

export default function SalaatuLibraryForm({
  initial,
}: {
  initial?: SalaatuLibraryItem;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(
    initial?.category ?? SALAATU_CATEGORIES[0]
  );
  const [arabic, setArabic] = useState(initial?.arabic ?? "");
  const [transliteration, setTransliteration] = useState(initial?.transliteration ?? "");
  const [translation, setTranslation] = useState(initial?.translation ?? "");
  const [benefits, setBenefits] = useState((initial?.benefits ?? []).join("\n"));
  const [usageNotes, setUsageNotes] = useState(
    (initial?.usageNotes ?? []).join("\n\n")
  );
  const [orderStr, setOrderStr] = useState(String(initial?.order ?? 999));
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      const data = {
        title,
        category,
        arabic,
        transliteration: transliteration || undefined,
        translation: translation || undefined,
        benefits: benefits
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
        usageNotes: usageNotes
          .split(/\n{2,}/)
          .map((l) => l.trim())
          .filter(Boolean),
        order: parseInt(orderStr, 10) || 999,
        featured,
        createdBy: user.uid,
      };
      if (initial) {
        await updateSalaatuLibraryItem(initial.id, data);
      } else {
        await createSalaatuLibraryItem(data);
      }
      router.push("/admin/bibliotheque");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8 space-y-5">
        <div className="grid sm:grid-cols-[1fr_auto_auto] gap-4 items-end">
          <Field label="Titre *">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Salaatu Ibrahimiyya"
              className={inputClass}
            />
          </Field>
          <Field label="Catégorie">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              {SALAATU_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ordre">
            <input
              type="number"
              value={orderStr}
              onChange={(e) => setOrderStr(e.target.value)}
              className={`${inputClass} w-24`}
            />
          </Field>
        </div>

        <Field label="Texte arabe *">
          <textarea
            required
            rows={4}
            value={arabic}
            onChange={(e) => setArabic(e.target.value)}
            dir="rtl"
            className={`${inputClass} text-2xl font-arabic leading-loose`}
          />
        </Field>

        <Field label="Translittération">
          <textarea
            rows={3}
            value={transliteration}
            onChange={(e) => setTransliteration(e.target.value)}
            placeholder="Allāhumma ṣalli ʿalā..."
            className={`${inputClass} italic`}
          />
        </Field>

        <Field label="Traduction française">
          <textarea
            rows={3}
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8 space-y-5">
        <Field label="Bienfaits (un par ligne)">
          <textarea
            rows={4}
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            placeholder={"Récitée dans chaque prière canonique\nOuvre les cieux"}
            className={inputClass}
          />
        </Field>

        <Field label="Secrets / Pratique (séparez par une ligne vide)">
          <textarea
            rows={8}
            value={usageNotes}
            onChange={(e) => setUsageNotes(e.target.value)}
            placeholder={
              "1) Après ʿishaa, zikr 100 fois puis formuler ses vœux.\n\n2) Écrire 7 fois en nassi et boire chaque matin pendant 41 jours."
            }
            className={inputClass}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-[#0F7C55] font-semibold">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 accent-[#0F7C55]"
          />
          Épingler comme Salaatu du jour (remplace la rotation automatique)
        </label>
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
          {saving ? "Enregistrement…" : initial ? "Enregistrer" : "Créer le Salaat"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/bibliotheque")}
          className="px-6 bg-white border border-gray-200 text-[#0F7C55] rounded-2xl font-semibold"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#0F7C55] text-sm text-[#0F7C55] bg-white";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
