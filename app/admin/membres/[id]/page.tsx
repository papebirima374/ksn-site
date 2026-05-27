"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaPrint, FaPenToSquare, FaTrash, FaArrowLeft } from "react-icons/fa6";
import AdminShell from "@/components/admin/AdminShell";
import MemberCard from "@/components/admin/MemberCard";
import { useAuth } from "@/lib/auth-context";
import { hasPermission, Member } from "@/lib/admin-types";
import { getMember, deleteMember } from "@/lib/admin-data";

export default function MemberDetailPage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "members.write");
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const m = await getMember(id);
        if (!m) setError("Membre introuvable.");
        else setMember(m);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleDelete() {
    if (!member) return;
    if (!confirm(`Supprimer ${member.prenom} ${member.nom} ?`)) return;
    await deleteMember(member);
    router.push("/admin/membres");
  }

  return (
    <AdminShell>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/membres"
          className="inline-flex items-center gap-2 text-[#0F5132] hover:text-[#B8860B] text-sm font-semibold"
        >
          <FaArrowLeft /> Retour aux membres
        </Link>

        {member && canEdit && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-2.5 px-4 rounded-xl font-bold text-sm"
            >
              <FaPrint /> Imprimer la carte
            </button>
            <Link
              href={`/admin/membres/${member.id}/editer`}
              className="inline-flex items-center gap-2 bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F5132] py-2.5 px-4 rounded-xl font-semibold text-sm"
            >
              <FaPenToSquare /> Éditer
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 px-4 rounded-xl font-semibold text-sm"
            >
              <FaTrash /> Supprimer
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : error ? (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
          {error}
        </p>
      ) : member ? (
        <>
          <div className="no-print bg-white rounded-3xl shadow-md p-6 sm:p-8 mb-6 grid sm:grid-cols-2 gap-4 text-sm">
            <Info label="Prénom" value={member.prenom} />
            <Info label="Nom" value={member.nom} />
            <Info label="Matricule" value={member.matricule} mono />
            <Info label="Statut" value={member.status} />
            <Info label="Téléphone" value={member.telephone || "—"} />
            <Info label="Email" value={member.email || "—"} />
            <Info label="Date de naissance" value={member.dateNaissance || "—"} />
            <Info label="Profession" value={member.profession || "—"} />
            <Info label="Région" value={member.region || "—"} />
            <Info label="Ville" value={member.ville || "—"} />
            <Info label="Pays" value={member.pays || "—"} />
          </div>

          <MemberCard member={member} size="print" />
        </>
      ) : null}
    </AdminShell>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
        {label}
      </p>
      <p className={`mt-1 text-[#0F5132] ${mono ? "font-mono tabular-nums" : ""}`}>
        {value}
      </p>
    </div>
  );
}
