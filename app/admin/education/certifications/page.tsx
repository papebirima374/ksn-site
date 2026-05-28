"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaAward,
  FaArrowLeft,
  FaPhone,
  FaWhatsapp,
  FaCheck,
  FaCalendar,
  FaXmark,
  FaEnvelope,
} from "react-icons/fa6";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { hasPermission } from "@/lib/admin-types";
import type {
  EducationCertification,
  EducationCertificationStatus,
} from "@/lib/admin-types";
import {
  listCertifications,
  approveCertification,
  rejectCertification,
  scheduleCertificationExam,
} from "@/lib/admin-data";

const STATUS_TABS: {
  id: "all" | EducationCertificationStatus;
  label: string;
}[] = [
  { id: "all", label: "Toutes" },
  { id: "pending_review", label: "À planifier" },
  { id: "scheduled", label: "Planifiées" },
  { id: "oral_passed", label: "Validées" },
  { id: "rejected", label: "Rejetées" },
];

const STATUS_BADGE: Record<
  EducationCertificationStatus,
  { label: string; cls: string }
> = {
  pending_review: {
    label: "En attente d'entretien",
    cls: "bg-amber-100 text-amber-800",
  },
  scheduled: {
    label: "Entretien planifié",
    cls: "bg-blue-100 text-blue-800",
  },
  oral_passed: {
    label: "Validée ✓",
    cls: "bg-emerald-100 text-emerald-800",
  },
  rejected: { label: "Rejetée", cls: "bg-red-100 text-red-800" },
};

export default function AdminCertificationsPage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "education.write");

  const [items, setItems] = useState<EducationCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | EducationCertificationStatus>(
    "pending_review"
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // dialog state pour validation
  const [activeId, setActiveId] = useState<string | null>(null);
  const [examinerName, setExaminerName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examNotes, setExamNotes] = useState("");
  const [acting, setActing] = useState(false);

  async function reload() {
    setLoading(true);
    try {
      const all = await listCertifications();
      setItems(all);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => {
      reload();
      setExaminerName(user?.displayName || user?.email || "");
    }, 0);
    return () => clearTimeout(t);
  }, [user]);

  const filtered =
    filter === "all" ? items : items.filter((c) => c.status === filter);

  function openDialog(id: string) {
    setActiveId(id);
    setExamDate(new Date().toISOString().slice(0, 10));
    setExamNotes("");
    setError("");
    setSuccess("");
  }

  function closeDialog() {
    setActiveId(null);
  }

  async function handleApprove() {
    if (!activeId || !user) return;
    if (!examinerName.trim()) {
      setError("Nom de l'examinateur obligatoire.");
      return;
    }
    setActing(true);
    setError("");
    try {
      const certNumber = await approveCertification(
        activeId,
        { uid: user.uid, name: examinerName.trim() },
        examDate,
        examNotes.trim() || undefined
      );
      setSuccess(
        `✓ Certificat délivré (N° ${certNumber}). L'apprenant pourra le télécharger.`
      );
      closeDialog();
      await reload();
      setTimeout(() => setSuccess(""), 8000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la validation");
    } finally {
      setActing(false);
    }
  }

  async function handleSchedule() {
    if (!activeId) return;
    if (!examDate) {
      setError("Date de l'entretien obligatoire.");
      return;
    }
    setActing(true);
    setError("");
    try {
      await scheduleCertificationExam(
        activeId,
        examDate,
        examNotes.trim() || undefined
      );
      setSuccess(`✓ Entretien planifié au ${examDate}.`);
      closeDialog();
      await reload();
      setTimeout(() => setSuccess(""), 6000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la planification");
    } finally {
      setActing(false);
    }
  }

  async function handleReject() {
    if (!activeId || !user) return;
    if (!examNotes.trim()) {
      setError("Notes obligatoires pour expliquer le rejet à l'apprenant.");
      return;
    }
    if (
      !confirm(
        "Rejeter cette demande ? L'apprenant verra vos notes et pourra reprendre contact."
      )
    )
      return;
    setActing(true);
    setError("");
    try {
      await rejectCertification(
        activeId,
        { uid: user.uid, name: examinerName.trim() || user.email },
        examNotes.trim()
      );
      setSuccess("Demande rejetée. L'apprenant en sera informé.");
      closeDialog();
      await reload();
      setTimeout(() => setSuccess(""), 6000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors du rejet");
    } finally {
      setActing(false);
    }
  }

  return (
    <AdminShell>
      <header className="mb-6">
        <Link
          href="/admin/education"
          className="inline-flex items-center gap-2 text-sm text-[#0F7C55] hover:text-[#D4AF37] transition mb-4 font-semibold"
        >
          <FaArrowLeft /> Retour à la plateforme éducative
        </Link>
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Commission Éducation & Culture
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          Certifications Tazawwud
        </h1>
        <p className="mt-2 text-gray-600 text-sm max-w-3xl">
          Chaque demande nécessite un <strong>entretien oral</strong>{" "}
          (téléphone ou physique) avec l&apos;apprenant avant délivrance du
          certificat. Cette étape humaine garantit la sincérité de
          l&apos;apprentissage.
        </p>
      </header>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100 mb-4">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3 border border-emerald-200 mb-4">
          {success}
        </p>
      )}

      {/* TABS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => {
          const count =
            tab.id === "all"
              ? items.length
              : items.filter((c) => c.status === tab.id).length;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                filter === tab.id
                  ? "bg-[#0F7C55] text-white border-[#0F7C55]"
                  : "bg-white text-[#0F7C55] border-gray-200 hover:border-[#0F7C55]"
              }`}
            >
              {tab.label}{" "}
              <span className="opacity-70 ml-1">({count})</span>
            </button>
          );
        })}
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-sm text-gray-500">Chargement…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <FaAward className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">
            Aucune demande dans cette catégorie pour le moment.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((cert) => {
            const badge = STATUS_BADGE[cert.status];
            const isOpen = activeId === cert.id;
            return (
              <article
                key={cert.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-display text-lg font-bold text-[#0F7C55]">
                        {cert.fullName}
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                      {cert.certificateNumber && (
                        <span className="text-[10px] font-mono text-[#B8860B] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                          {cert.certificateNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mt-2">
                      <a
                        href={`tel:${cert.phone}`}
                        className="inline-flex items-center gap-1 hover:text-[#0F7C55]"
                      >
                        <FaPhone className="text-[10px]" /> {cert.phone}
                      </a>
                      <a
                        href={`https://wa.me/${cert.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-[#0F7C55]"
                      >
                        <FaWhatsapp className="text-[10px]" /> WhatsApp
                      </a>
                      {cert.email && (
                        <a
                          href={`mailto:${cert.email}`}
                          className="inline-flex items-center gap-1 hover:text-[#0F7C55]"
                        >
                          <FaEnvelope className="text-[10px]" /> {cert.email}
                        </a>
                      )}
                      {(cert.city || cert.country) && (
                        <span>
                          📍 {cert.city}
                          {cert.city && cert.country ? ", " : ""}
                          {cert.country}
                        </span>
                      )}
                    </div>
                    {cert.availability && (
                      <p className="mt-3 text-xs text-gray-500 italic">
                        <span className="font-bold not-italic">Dispo : </span>
                        {cert.availability}
                      </p>
                    )}
                    {cert.examinerName && (
                      <p className="mt-2 text-xs text-gray-700">
                        Examiné par <strong>{cert.examinerName}</strong>
                        {cert.oralExamDate ? ` · ${cert.oralExamDate}` : ""}
                      </p>
                    )}
                    {cert.examinerNotes && (
                      <p className="mt-2 text-xs text-gray-600 bg-gray-50 border-l-2 border-gray-300 rounded-r px-3 py-1.5 italic">
                        « {cert.examinerNotes} »
                      </p>
                    )}
                    <p className="mt-3 text-[10px] text-gray-400">
                      Demande déposée le{" "}
                      {new Date(cert.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>

                  {canEdit && cert.status !== "oral_passed" && (
                    <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => openDialog(cert.id)}
                        className="bg-[#0F7C55] text-white font-bold text-xs px-3 py-2 rounded-xl hover:bg-[#0A3D24] transition"
                      >
                        Gérer
                      </button>
                    </div>
                  )}
                </div>

                {/* INLINE DIALOG */}
                {isOpen && (
                  <div className="mt-5 pt-5 border-t border-gray-100 grid gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                        Examinateur (vous)
                      </label>
                      <input
                        type="text"
                        value={examinerName}
                        onChange={(e) => setExaminerName(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                          Date de l&apos;entretien
                        </label>
                        <input
                          type="date"
                          value={examDate}
                          onChange={(e) => setExamDate(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                        Notes de la Commission (optionnel pour validation,
                        obligatoire pour rejet)
                      </label>
                      <textarea
                        rows={3}
                        value={examNotes}
                        onChange={(e) => setExamNotes(e.target.value)}
                        placeholder="Ex : très bonne maîtrise des piliers du Tawhîd, à approfondir la partie Salaat…"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={closeDialog}
                        disabled={acting}
                        className="border border-gray-300 text-gray-700 font-bold text-xs px-3 py-2 rounded-xl hover:bg-gray-50 transition"
                      >
                        Annuler
                      </button>
                      {cert.status === "pending_review" && (
                        <button
                          type="button"
                          onClick={handleSchedule}
                          disabled={acting}
                          className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-xs px-3 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          <FaCalendar /> Planifier
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleReject}
                        disabled={acting}
                        className="inline-flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 font-bold text-xs px-3 py-2 rounded-xl hover:bg-red-100 transition disabled:opacity-50"
                      >
                        <FaXmark /> Rejeter
                      </button>
                      <button
                        type="button"
                        onClick={handleApprove}
                        disabled={acting}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] text-white font-bold text-xs px-4 py-2 rounded-xl hover:scale-[1.02] transition disabled:opacity-50"
                      >
                        <FaCheck /> Valider — délivrer le certificat
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
