"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import MemberForm from "@/components/admin/MemberForm";
import { getMember } from "@/lib/admin-data";
import { Member } from "@/lib/admin-types";

export default function EditMemberPage() {
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

  return (
    <AdminShell>
      <header className="mb-8">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Éditer
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          {member ? `${member.prenom} ${member.nom}` : "Membre"}
        </h1>
      </header>

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : error ? (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
          {error}
        </p>
      ) : member ? (
        <MemberForm initial={member} />
      ) : null}
    </AdminShell>
  );
}
