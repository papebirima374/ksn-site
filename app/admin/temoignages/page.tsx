"use client";

import { useEffect, useState, FormEvent } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { hasPermission, Testimonial } from "@/lib/admin-types";
import {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/admin-data";
import {
  FaPlus,
  FaTrash,
  FaPenToSquare,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEyeSlash,
  FaQuoteLeft,
  FaStar,
} from "react-icons/fa6";

type FormState = {
  name: string;
  role: string;
  location: string;
  flag: string;
  since: string;
  quote: string;
  accent: "green" | "gold" | "sand";
};

const EMPTY_FORM: FormState = {
  name: "",
  role: "",
  location: "",
  flag: "🇸🇳",
  since: String(new Date().getFullYear()),
  quote: "",
  accent: "green",
};

const ACCENT_PREVIEW: Record<FormState["accent"], string> = {
  green: "from-[#0F7C55] to-[#0A3D24] text-[#D4AF37]",
  gold: "from-[#B8860B] to-[#D4AF37] text-[#0F7C55]",
  sand: "from-[#D4AF37] to-[#F5D76E] text-[#0F7C55]",
};

const FLAGS = ["🇸🇳", "🇫🇷", "🇮🇹", "🇪🇸", "🇨🇦", "🇺🇸", "🇨🇮", "🇲🇦", "🇩🇿", "🇬🇧", "🇩🇪", "🇧🇪"];

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminTemoignagesPage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "articles.write");

  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function reload() {
    setLoading(true);
    try {
      const list = await listTestimonials();
      setItems(list);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(reload, 0);
  }, []);

  function startEdit(t: Testimonial) {
    setForm({
      name: t.name,
      role: t.role ?? "",
      location: t.location,
      flag: t.flag,
      since: t.since ?? "",
      quote: t.quote,
      accent: t.accent,
    });
    setEditingId(t.id);
    setShowForm(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  }

  function startCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function cancelForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim() || !form.quote.trim()) {
      setError("Nom, lieu et témoignage sont obligatoires.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      if (editingId) {
        await updateTestimonial(editingId, {
          name: form.name.trim(),
          role: form.role.trim() || undefined,
          location: form.location.trim(),
          flag: form.flag,
          since: form.since.trim() || undefined,
          quote: form.quote.trim(),
          accent: form.accent,
        });
      } else {
        const maxOrder = items.reduce((m, i) => Math.max(m, i.order), -1);
        await createTestimonial({
          name: form.name.trim(),
          role: form.role.trim() || undefined,
          location: form.location.trim(),
          flag: form.flag,
          since: form.since.trim() || undefined,
          quote: form.quote.trim(),
          accent: form.accent,
          order: maxOrder + 1,
          visible: true,
        });
      }
      cancelForm();
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  }

  async function move(t: Testimonial, dir: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((i) => i.id === t.id);
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;
    const target = sorted[targetIdx];
    await Promise.all([
      updateTestimonial(t.id, { order: target.order }),
      updateTestimonial(target.id, { order: t.order }),
    ]);
    await reload();
  }

  async function toggleVisible(t: Testimonial) {
    await updateTestimonial(t.id, { visible: !t.visible });
    await reload();
  }

  async function handleDelete(t: Testimonial) {
    if (!confirm(`Supprimer définitivement le témoignage de « ${t.name} » ?`))
      return;
    await deleteTestimonial(t.id);
    await reload();
  }

  return (
    <AdminShell>
      <header className="mb-8">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Contenu
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          Témoignages
        </h1>
        <p className="mt-2 text-gray-600 text-sm max-w-2xl">
          Ajoutez et gérez les témoignages de membres affichés sur la home.
          Si aucun témoignage n&apos;est défini ici, le site affichera
          automatiquement les 6 placeholders par défaut.
        </p>
        {canEdit && !showForm && (
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold px-4 py-2.5 rounded-xl shadow-md hover:scale-105 transition text-sm"
          >
            <FaPlus /> Ajouter un témoignage
          </button>
        )}
      </header>

      {/* FORMULAIRE */}
      {canEdit && showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-md p-6 sm:p-8 mb-8 space-y-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-[#0F7C55]">
              {editingId ? "Modifier le témoignage" : "Nouveau témoignage"}
            </h2>
            <button
              type="button"
              onClick={cancelForm}
              className="text-sm text-gray-500 hover:text-[#0F7C55]"
            >
              Annuler
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
              {error}
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="ex: Aïcha Diop"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Rôle / Profil
              </label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="ex: Commission Communication"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55]"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Lieu (ville, pays) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="ex: Touba, Sénégal"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Drapeau
              </label>
              <select
                value={form.flag}
                onChange={(e) => setForm({ ...form, flag: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
              >
                {FLAGS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Membre depuis
              </label>
              <input
                type="text"
                value={form.since}
                onChange={(e) => setForm({ ...form, since: e.target.value })}
                placeholder="ex: 2022"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Couleur de l&apos;avatar
              </label>
              <div className="flex gap-2">
                {(["green", "gold", "sand"] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setForm({ ...form, accent: a })}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition border-2 ${
                      form.accent === a
                        ? "border-[#0F7C55] bg-[#F8F5EF]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block w-5 h-5 rounded-full bg-gradient-to-br ${ACCENT_PREVIEW[a]} mr-1.5 align-middle`}
                    />
                    {a === "green" ? "Vert" : a === "gold" ? "Or" : "Sable"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Témoignage <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              rows={4}
              placeholder="Le Dahira KSN a transformé ma pratique quotidienne..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] leading-6"
            />
            <p className="mt-1 text-[11px] text-gray-500">
              200-400 caractères recommandés. Pas besoin de guillemets, ils sont ajoutés automatiquement.
            </p>
          </div>

          {/* PREVIEW */}
          {form.name && form.quote && (
            <div className="bg-[#0A3D24] rounded-2xl p-5 border border-[#D4AF37]/20">
              <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold mb-3">
                Aperçu en direct
              </p>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative">
                <FaQuoteLeft className="absolute top-4 right-4 text-2xl text-[#D4AF37]/20" />
                <div className="flex gap-1 mb-3 text-[#D4AF37]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FaStar key={s} className="text-[10px]" />
                  ))}
                </div>
                <p className="text-white/85 text-sm leading-7 italic mb-4">
                  « {form.quote} »
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                  <div
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${ACCENT_PREVIEW[form.accent]} flex items-center justify-center font-black text-sm`}
                  >
                    {getInitials(form.name)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{form.name}</p>
                    {form.role && (
                      <p className="text-[11px] text-[#D4AF37] uppercase tracking-wider">
                        {form.role}
                      </p>
                    )}
                    <p className="text-[11px] text-white/60">
                      {form.flag} {form.location}
                      {form.since && ` · depuis ${form.since}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition disabled:opacity-50 text-sm"
            >
              {submitting ? "Enregistrement…" : editingId ? "Mettre à jour" : "Publier"}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="text-sm text-gray-500 hover:text-[#0F7C55] px-4 py-2.5"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {error && !showForm && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100 mb-4">
          {error}
        </p>
      )}

      {/* LISTE */}
      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center">
          <p className="text-gray-500">
            Aucun témoignage enregistré. Le site affiche les{" "}
            <strong>6 placeholders par défaut</strong> tant que vous n&apos;avez
            rien ajouté ici.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {[...items]
            .sort((a, b) => a.order - b.order)
            .map((t) => (
              <article
                key={t.id}
                className={`bg-white rounded-2xl shadow-md p-5 border-l-4 ${
                  t.visible
                    ? "border-l-[#0F7C55]"
                    : "border-l-gray-300 opacity-60"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${ACCENT_PREVIEW[t.accent]} flex items-center justify-center font-black text-sm flex-shrink-0`}
                  >
                    {getInitials(t.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#0F7C55] text-sm truncate">
                      {t.name}
                      {!t.visible && (
                        <span className="ml-2 text-[10px] uppercase font-bold text-gray-500">
                          (masqué)
                        </span>
                      )}
                    </p>
                    {t.role && (
                      <p className="text-[11px] text-[#B8860B] uppercase tracking-wider font-semibold">
                        {t.role}
                      </p>
                    )}
                    <p className="text-[11px] text-gray-500">
                      {t.flag} {t.location}
                      {t.since && ` · depuis ${t.since}`}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic leading-6 line-clamp-4 mb-4">
                  « {t.quote} »
                </p>
                {canEdit && (
                  <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100">
                    <IconBtn onClick={() => move(t, -1)} label="Monter">
                      <FaArrowUp />
                    </IconBtn>
                    <IconBtn onClick={() => move(t, 1)} label="Descendre">
                      <FaArrowDown />
                    </IconBtn>
                    <IconBtn
                      onClick={() => toggleVisible(t)}
                      label={t.visible ? "Masquer" : "Afficher"}
                    >
                      {t.visible ? <FaEye /> : <FaEyeSlash />}
                    </IconBtn>
                    <div className="flex-1" />
                    <IconBtn onClick={() => startEdit(t)} label="Éditer">
                      <FaPenToSquare />
                    </IconBtn>
                    <IconBtn
                      onClick={() => handleDelete(t)}
                      label="Supprimer"
                      variant="danger"
                    >
                      <FaTrash />
                    </IconBtn>
                  </div>
                )}
              </article>
            ))}
        </div>
      )}
    </AdminShell>
  );
}

function IconBtn({
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
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition ${
        variant === "danger"
          ? "bg-red-50 hover:bg-red-100 text-red-600"
          : "bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F7C55]"
      }`}
    >
      {children}
    </button>
  );
}
