"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import SalaatuLibraryForm from "@/components/admin/SalaatuLibraryForm";
import { getSalaatuLibraryItem } from "@/lib/admin-data";
import { SalaatuLibraryItem } from "@/lib/admin-types";

export default function EditSalaatuPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [item, setItem] = useState<SalaatuLibraryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const s = await getSalaatuLibraryItem(id);
        if (!s) setError("Salaat introuvable.");
        else setItem(s);
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
          Édition
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F5132]">
          {item ? item.title : "Salaat"}
        </h1>
      </header>
      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : error ? (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3">{error}</p>
      ) : item ? (
        <SalaatuLibraryForm initial={item} />
      ) : null}
    </AdminShell>
  );
}
