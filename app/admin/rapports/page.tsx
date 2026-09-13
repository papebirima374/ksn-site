"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  FaClipboardList,
  FaTrash,
  FaPhone,
  FaUsers,
  FaPrint,
  FaCircleCheck,
  FaCircleXmark,
} from "react-icons/fa6";
import { COMMISSIONS, commissionNom } from "@/lib/commissions";
import {
  subscribeCommissionReports,
  deleteCommissionReport,
  type CommissionReport,
} from "@/lib/commission-reports";

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

function dateFr(ts: number): string {
  return new Date(ts).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminRapportsPage() {
  const [rapports, setRapports] = useState<CommissionReport[]>([]);
  const [filtre, setFiltre] = useState<string>("");
  const [ouvert, setOuvert] = useState<string | null>(null);

  useEffect(() => subscribeCommissionReports(setRapports), []);

  const visibles = useMemo(
    () => (filtre ? rapports.filter((r) => r.commission === filtre) : rapports),
    [rapports, filtre]
  );

  /** Derniere contribution recue par commission : c'est ce qui dit au
   *  secretariat qui a repondu et qui doit encore etre relance. */
  const dernierPar = useMemo(() => {
    const m = new Map<string, CommissionReport>();
    for (const r of rapports) if (!m.has(r.commission)) m.set(r.commission, r);
    return m;
  }, [rapports]);

  const totalSalaatu = useMemo(
    () =>
      COMMISSIONS.reduce((s, c) => s + (dernierPar.get(c.slug)?.salaatu ?? 0), 0),
    [dernierPar]
  );

  async function supprimer(r: CommissionReport) {
    if (
      !confirm(
        `Supprimer le rapport de « ${commissionNom(r.commission)} » transmis par ${r.responsable} ?\n\nCette action est définitive.`
      )
    )
      return;
    await deleteCommissionReport(r.id);
  }

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#082F22] flex items-center gap-3">
          <FaClipboardList className="text-[#0F7C55]" />
          Rapports de commission
        </h1>
        <p className="mt-2 text-[#5C7268]">
          Rapports transmis par les responsables via leur lien personnel
          (<code className="text-xs bg-[#F8F5EF] px-1.5 py-0.5 rounded">/commissions/…</code>).
        </p>
      </div>

      {/* ── Qui a repondu ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#0F7C55]/12 p-5 sm:p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h2 className="font-bold text-[#082F22]">Suivi des retours</h2>
          <span className="text-sm text-[#5C7268]">
            {dernierPar.size} / {COMMISSIONS.length} commissions ont répondu
          </span>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {COMMISSIONS.map((c) => {
            const r = dernierPar.get(c.slug);
            return (
              <button
                key={c.slug}
                onClick={() => setFiltre(filtre === c.slug ? "" : c.slug)}
                className={`text-left flex items-center gap-3 rounded-xl border px-3.5 py-3 transition ${
                  filtre === c.slug
                    ? "border-[#0F7C55] bg-[#0F7C55]/[.06]"
                    : "border-[#0F7C55]/12 hover:bg-[#F8F5EF]"
                }`}
              >
                {r ? (
                  <FaCircleCheck className="text-[#0F7C55] flex-none" />
                ) : (
                  <FaCircleXmark className="text-[#C9A227] flex-none" />
                )}
                <span className="min-w-0">
                  <span className="block font-semibold text-sm text-[#082F22] truncate">
                    {c.nom}
                  </span>
                  <span className="block text-xs text-[#5C7268]">
                    {r ? dateFr(r.createdAt) : "En attente"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {totalSalaatu > 0 && (
          <p className="mt-5 pt-4 border-t border-[#0F7C55]/10 text-sm text-[#082F22]">
            Cumul des Salaatu déclarés (dernier rapport de chaque commission) :{" "}
            <b className="text-lg tabular-nums text-[#0F7C55]">{fmt(totalSalaatu)}</b>
          </p>
        )}
      </div>

      {/* ── Liste des rapports ────────────────────────────────────────── */}
      {filtre && (
        <button
          onClick={() => setFiltre("")}
          className="mb-4 text-sm font-semibold text-[#0F7C55] hover:underline"
        >
          ← Voir toutes les commissions
        </button>
      )}

      {visibles.length === 0 ? (
        <p className="bg-white rounded-2xl border border-[#0F7C55]/12 p-10 text-center text-[#5C7268]">
          Aucun rapport reçu pour l&apos;instant.
        </p>
      ) : (
        <div className="space-y-4">
          {visibles.map((r) => {
            const open = ouvert === r.id;
            return (
              <article
                key={r.id}
                className="bg-white rounded-2xl border border-[#0F7C55]/12 overflow-hidden"
              >
                <header className="p-5 flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-[#082F22]">
                      {commissionNom(r.commission)}
                    </h3>
                    <p className="mt-1 text-sm text-[#5C7268] flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span>{r.responsable}</span>
                      {r.telephone && (
                        <a
                          href={`tel:${r.telephone.replace(/\s+/g, "")}`}
                          className="inline-flex items-center gap-1.5 hover:text-[#0F7C55]"
                        >
                          <FaPhone className="text-xs" /> {r.telephone}
                        </a>
                      )}
                      {r.membres != null && (
                        <span className="inline-flex items-center gap-1.5">
                          <FaUsers className="text-xs" /> {r.membres} membres
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-[#9BB0A6]">Reçu le {dateFr(r.createdAt)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {r.salaatu != null && (
                      <span className="bg-[#0F7C55]/10 text-[#0F7C55] font-bold px-3 py-1.5 rounded-lg text-sm tabular-nums">
                        {fmt(r.salaatu)} Salaatu
                      </span>
                    )}
                    <button
                      onClick={() => setOuvert(open ? null : r.id)}
                      className="text-sm font-semibold text-[#0F7C55] hover:underline px-2"
                    >
                      {open ? "Réduire" : "Lire"}
                    </button>
                    <button
                      onClick={() => supprimer(r)}
                      aria-label="Supprimer ce rapport"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </header>

                {open && (
                  <div className="px-5 pb-5 border-t border-[#0F7C55]/10 pt-5 space-y-5">
                    <Section titre="Compte rendu des activités" texte={r.activites} />
                    <Section titre="Difficultés rencontrées" texte={r.difficultes} />
                    <Section titre="Précisions sur le décompte" texte={r.salaatuPrecisions} />
                    <Section
                      titre={`Cellules${
                        r.cellulesActives != null ? ` (${r.cellulesActives} actives)` : ""
                      }`}
                      texte={r.cellules}
                    />
                    <Section
                      titre="Propositions pour la Journée Salaatu 'Alaa Nabii"
                      texte={r.propositions}
                      accent
                    />
                    <Section titre="Moyens nécessaires" texte={r.moyens} />
                    <Section titre="Divers" texte={r.divers} />

                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F7C55] hover:underline"
                    >
                      <FaPrint /> Imprimer ce rapport
                    </button>
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

function Section({
  titre,
  texte,
  accent = false,
}: {
  titre: string;
  texte: string;
  accent?: boolean;
}) {
  if (!texte?.trim()) return null;
  return (
    <div
      className={`rounded-xl p-4 ${
        accent ? "bg-gradient-to-br from-[#0F7C55]/[.07] to-[#D4AF37]/[.10]" : "bg-[#F8F5EF]"
      }`}
    >
      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#5C7268] mb-2">
        {titre}
      </h4>
      <p className="text-[#12231C] leading-7 whitespace-pre-wrap">{texte}</p>
    </div>
  );
}
