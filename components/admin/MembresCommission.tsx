"use client";

import { useMemo, useState } from "react";
import {
  FaMagnifyingGlass,
  FaPlus,
  FaTrash,
  FaPhone,
  FaUsers,
  FaTriangleExclamation,
} from "react-icons/fa6";
import {
  type MembreCommission,
  type RoleCommission,
  LIBELLE_ROLE,
  ajouterMembre,
  changerRole,
  retirerMembre,
} from "@/lib/commission-membres";
import { listMembers } from "@/lib/admin-data";
import type { Member } from "@/lib/admin-types";

const INPUT =
  "w-full rounded-xl border border-[#0F7C55]/25 bg-white px-3.5 py-2.5 text-[#12231C] placeholder:text-[#9BB0A6] outline-none focus:border-[#0F7C55] focus:ring-2 focus:ring-[#0F7C55]/20 transition";

/** Liste des membres de la commission, piochee dans les membres du Dahira.
 *
 *  Ces personnes n'ont PAS de compte sur le site : cette liste ne donne aucun
 *  acces, elle sert a tenir la caisse et a convoquer. */
export default function MembresCommission({
  slug,
  membres,
  signature,
  erreur,
}: {
  slug: string;
  membres: MembreCommission[];
  signature: string;
  erreur: string;
}) {
  const [tous, setTous] = useState<Member[] | null>(null);
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(false);
  const [msg, setMsg] = useState("");

  const dejaLa = useMemo(() => new Set(membres.map((m) => m.matricule)), [membres]);

  async function chargerAnnuaire() {
    if (tous || chargement) return;
    setChargement(true);
    try {
      setTous(await listMembers());
      setMsg("");
    } catch {
      setMsg("Impossible de charger la liste des membres du Dahira.");
    } finally {
      setChargement(false);
    }
  }

  const resultats = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    if (!tous || q.length < 2) return [];
    return tous
      .filter((m) => !dejaLa.has(m.matricule))
      .filter((m) =>
        `${m.prenom} ${m.nom} ${m.matricule}`.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [tous, recherche, dejaLa]);

  return (
    <div className="space-y-5">
      {/* ── Ajouter ─────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5 sm:p-6">
        <h3 className="font-bold text-[#082F22]">Ajouter un membre</h3>
        <p className="mt-1 mb-4 text-xs text-[#5C7268] leading-5">
          On pioche dans les membres déjà enregistrés du Dahira — rien à ressaisir.
          Ces personnes n&apos;ont pas de compte sur le site : cette liste sert à tenir
          la caisse et à convoquer.
        </p>

        <div className="relative">
          <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9BB0A6] text-sm" />
          <input
            value={recherche}
            onFocus={chargerAnnuaire}
            onChange={(e) => setRecherche(e.target.value)}
            className={`${INPUT} pl-10`}
            placeholder="Chercher par nom ou matricule…"
          />
        </div>

        {chargement && <p className="mt-3 text-sm text-[#5C7268]">Chargement de l&apos;annuaire…</p>}
        {msg && (
          <p className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-2.5 text-sm">
            <FaTriangleExclamation className="flex-none mt-0.5" />
            <span>{msg}</span>
          </p>
        )}

        {recherche.trim().length >= 2 && tous && resultats.length === 0 && (
          <p className="mt-3 text-sm text-[#9BB0A6] italic">Aucun membre trouvé.</p>
        )}

        <div className="mt-3 space-y-2">
          {resultats.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-xl border border-[#0F7C55]/12 px-4 py-2.5"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#082F22] truncate">
                  {m.prenom} {m.nom}
                </span>
                <span className="block text-xs text-[#9BB0A6]">
                  {m.matricule}
                  {m.telephone && ` · ${m.telephone}`}
                </span>
              </span>
              <button
                onClick={async () => {
                  try {
                    await ajouterMembre(
                      slug,
                      {
                        matricule: m.matricule,
                        nom: `${m.prenom} ${m.nom}`.trim(),
                        telephone: m.telephone ?? "",
                      },
                      signature
                    );
                    setRecherche("");
                  } catch {
                    setMsg("Ajout impossible. Vérifiez votre connexion.");
                  }
                }}
                className="flex-none inline-flex items-center gap-1.5 bg-[#0F7C55] text-white px-3.5 py-2 rounded-lg text-xs font-bold hover:bg-[#0c6444] transition"
              >
                <FaPlus /> Ajouter
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── La liste ────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h3 className="font-bold text-[#082F22] flex items-center gap-2">
            <FaUsers className="text-[#0F7C55]" /> Membres de la commission
          </h3>
          <span className="text-sm text-[#5C7268]">{membres.length} inscrits</span>
        </div>

        {erreur && (
          <p className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-2.5 text-sm">
            {erreur}
          </p>
        )}

        {membres.length === 0 ? (
          <p className="text-sm text-[#9BB0A6] italic py-4">
            Aucun membre pour l&apos;instant. Cherchez un nom ci-dessus pour commencer.
          </p>
        ) : (
          <div className="divide-y divide-[#0F7C55]/8">
            {membres.map((m) => (
              <div key={m.id} className="py-3 flex items-center gap-3">
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[#082F22] truncate">{m.nom}</span>
                  <span className="block text-xs text-[#9BB0A6]">
                    {m.matricule}
                    {m.telephone && (
                      <>
                        {" · "}
                        <a href={`tel:${m.telephone.replace(/\s+/g, "")}`} className="hover:text-[#0F7C55]">
                          <FaPhone className="inline text-[10px] mb-0.5" /> {m.telephone}
                        </a>
                      </>
                    )}
                  </span>
                </span>

                <select
                  value={m.role}
                  onChange={(e) => changerRole(m.id, e.target.value as RoleCommission)}
                  className="flex-none rounded-lg border border-[#0F7C55]/25 px-2.5 py-1.5 text-xs font-semibold bg-white"
                >
                  {(Object.keys(LIBELLE_ROLE) as RoleCommission[]).map((r) => (
                    <option key={r} value={r}>
                      {LIBELLE_ROLE[r]}
                    </option>
                  ))}
                </select>

                <button
                  onClick={async () => {
                    if (!confirm(`Retirer ${m.nom} de la commission ?`)) return;
                    await retirerMembre(m.id);
                  }}
                  aria-label={`Retirer ${m.nom}`}
                  className="flex-none p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="mt-5 pt-4 border-t border-[#0F7C55]/10 text-xs text-[#5C7268] leading-5">
          Le rôle <b>Trésorier</b> est indicatif ici. Pour qu&apos;il puisse saisir dans la
          caisse, l&apos;administrateur doit lui créer un compte rattaché à la même
          commission, dans <b>Utilisateurs</b>.
        </p>
      </section>
    </div>
  );
}
