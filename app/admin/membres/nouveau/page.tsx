"use client";

import AdminShell from "@/components/admin/AdminShell";
import MemberForm from "@/components/admin/MemberForm";

export default function NewMemberPage() {
  return (
    <AdminShell>
      <header className="mb-8">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Nouveau membre
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F5132]">
          Enregistrer un membre
        </h1>
      </header>

      <MemberForm />
    </AdminShell>
  );
}
