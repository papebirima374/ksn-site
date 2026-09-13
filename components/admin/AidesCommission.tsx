"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaMagnifyingGlass,
  FaHandHoldingHeart,
  FaPhone,
  FaTriangleExclamation,
  FaCircleInfo,
} from "react-icons/fa6";
import {
  type Aide,
  MOTIFS_AIDE,
  subscribeAides,
  verserAide,
  totalAides,
} from "@/lib/commission-activites";
import { fcfa } from "@/lib/commission-caisse";
import { listMembers } from "@/lib/admin-data";
import type { Member } from "@/lib/admin-types";

const INPUT =
  "w-full rounded-xl border border-[#0F7C55]/25 bg-white px-3.5 py-2.5 text-[#12231C] placeholder:text-[#9BB0A6] outline-none focus:border-[#0F7C55] focus:ring-2 focus:ring-[#0F7C55]/20 transition";

const aujourdhui = () => new Date().toISOString().slice(0, 10);

const dateFr = (d: string) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—";

type Choisi = { matricule: string; nom: string; telephone: string };

/** Aides versees aux membres. Le suivi social se fait sur TOUS les membres du
 *  Dahira, pas sur une liste propre a la commission : quand quelqu'un tombe
 *  malade, il n'a pas a etre inscrit quelque part pour etre aide.
 *
 *  On n'affiche que le nom et le telephone — c'est tout ce qu'il faut pour
 *  verser une aide et rappeler la personne. */
export default function AidesCommission({
  slug,
  signature,
  pret,
}: {
  slug: string;
  signature: string;
  pret: boolean;
}) {
  const [aides, setAides] = useState<Aide[]>([]);
  const [tous, setTous] = useState<Member[] | null>(null);
  const [recherche, setRecherche] = useState("");
  const [choisi, setChoisi] = useState<Choisi | null>(null);
  const [motif, setMotif] = useState<string>(MOTIFS_AIDE[0]);
  const [precisions, setPrecisions] = useState("");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState(aujourdhui);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!pret) return;
    return subscribeAides(slug, setAides, (e) =>
      setErreur(
        /permission/i.test(e.message)
          ? "Accès refusé. Vérifiez que les règles Firestore publiées sont à jour."
          : "Aides indisponibles pour le moment."
      )
    );
  }, [slug, pret]);

  async function chargerAnnuaire() {
    if (tous) return;
    try {
      setTous(await listMembers());
    } catch {
      setErreur("Impossible de charger la liste des membres du Dahira.");
    }
  }

  const resultats = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    if (!tous || q.length < 2) return [];
    return tous
      .filter((m) => `${m.prenom} ${m.nom} ${m.matricule}`.toLowerCase().includes(q))
      .slice(0, 10);
  }, [tous, recherche]);

  const total = useMemo(() => totalAides(aides), [aides]);

  async function verser(e: React.FormEvent) {
    e.preventDefault();
    if (!choisi) return setErreur("Choisissez le membre concerné.");
    const n = parseInt(montant.replace(/\D+/g, ""), 10);
    if (!Number.isFinite(n) || n <= 0) return setErreur("Indiquez le montant de l'aide.");
    setEnvoi(true);
    try {
      await verserAide(
        slug,
        {
          membreMatricule: choisi.matricule,
          membreNom: choisi.nom,
          membreTelephone: choisi.telephone,
          motif,
          precisions,
          montant: n,
          date,
        },
        signature
      );
      setChoisi(null);
      setRecherche("");
      setMontant("");
      setPrecisions("");
      setErreur("");
    } catch {
      setErreur("Versement impossible. Vérifiez votre connexion.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#0F7C55]/15 bg-gradient-to-br from-[#0F7C55]/[.07] to-[#D4AF37]/[.10] p-6 text-center">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#5C7268]">
          Aides versées aux membres
        </p>
        <p className="mt-2 font-display text-4xl font-black text-[#0F7C55] tabular-nums">{fcfa(total)}</p>
        <p className="text-xs text-[#5C7268] mt-1">
          {aides.length} aide(s) · prélevées sur la caisse de la commission
        </p>
      </section>

      {erreur && (
        <p className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">
          <FaTriangleExclamation className="flex-none mt-0.5" />
          <span>{erreur}</span>
        </p>
      )}

      {/* ── Nouvelle aide ───────────────────────────────────────────── */}
      <form onSubmit={verser} className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5 sm:p-6">
        <h3 className="font-bold text-[#082F22] mb-1">Attribuer une aide</h3>
        <p className="text-xs text-[#5C7268] mb-4 leading-5">
          Cherchez n&apos;importe quel membre du Dahira — il n&apos;a pas besoin
          d&apos;appartenir à la commission pour être aidé.
        </p>

        {!choisi ? (
          <>
            <div className="relative">
              <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9BB0A6] text-sm" />
              <input
                value={recherche}
                onFocus={chargerAnnuaire}
                onChange={(e) => setRecherche(e.target.value)}
                className={`${INPUT} pl-10`}
                placeholder="Nom du membre…"
              />
            </div>
            <div className="mt-3 space-y-2">
              {resultats.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() =>
                    setChoisi({
                      matricule: m.matricule,
                      nom: `${m.prenom} ${m.nom}`.trim(),
                      telephone: m.telephone ?? "",
                    })
                  }
                  className="w-full text-left flex items-center gap-3 rounded-xl border border-[#0F7C55]/12 px-4 py-2.5 hover:bg-[#0F7C55]/5 transition"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-[#082F22] truncate">
                      {m.prenom} {m.nom}
                    </span>
                    {m.telephone && (
                      <span className="block text-xs text-[#9BB0A6]">{m.telephone}</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 rounded-xl bg-[#F8F5EF] px-4 py-3">
              <FaHandHoldingHeart className="text-[#0F7C55]" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-[#082F22]">{choisi.nom}</span>
                {choisi.telephone && (
                  <span className="block text-xs text-[#5C7268]">{choisi.telephone}</span>
                )}
              </span>
              <button
                type="button"
                onClick={() => setChoisi(null)}
                className="text-xs font-bold text-[#0F7C55] hover:underline"
              >
                Changer
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <label className="block">
                <span className="block text-sm font-semibold text-[#082F22] mb-1.5">Motif</span>
                <select value={motif} onChange={(e) => setMotif(e.target.value)} className={INPUT}>
                  {MOTIFS_AIDE.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-[#082F22] mb-1.5">Montant (FCFA)</span>
                <input
                  inputMode="numeric"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  className={`${INPUT} font-bold text-lg tabular-nums`}
                  placeholder="Ex. 15000"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-[#082F22] mb-1.5">Date</span>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={INPUT} />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-[#082F22] mb-1.5">
                  Précisions <span className="font-normal text-[#9BB0A6]">(facultatif)</span>
                </span>
                <input
                  value={precisions}
                  onChange={(e) => setPrecisions(e.target.value)}
                  className={INPUT}
                  placeholder="Hospitalisation, décès d'un proche…"
                />
              </label>
            </div>

            <p className="mt-4 flex items-start gap-2 text-xs text-[#5C7268] leading-5">
              <FaCircleInfo className="flex-none mt-0.5" />
              Le montant sortira automatiquement de la caisse de la commission, en une
              seule opération. Pour corriger une erreur, annulez l&apos;écriture depuis
              l&apos;onglet Caisse.
            </p>

            <button
              type="submit"
              disabled={envoi}
              className="mt-4 w-full bg-[#0F7C55] text-white font-bold py-3.5 rounded-xl hover:bg-[#0c6444] transition disabled:opacity-60"
            >
              {envoi ? "Versement…" : "Verser l'aide"}
            </button>
          </>
        )}
      </form>

      {/* ── Historique ──────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5 sm:p-6">
        <h3 className="font-bold text-[#082F22] mb-4">Historique des aides</h3>
        {aides.length === 0 ? (
          <p className="text-sm text-[#9BB0A6] italic py-4">Aucune aide versée pour l&apos;instant.</p>
        ) : (
          <div className="divide-y divide-[#0F7C55]/8">
            {aides.map((a) => (
              <div key={a.id} className="py-3.5 flex items-start gap-3">
                <span className="flex-none w-8 h-8 rounded-lg bg-[#D4AF37]/15 text-[#B8860B] flex items-center justify-center text-xs">
                  <FaHandHoldingHeart />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#082F22]">{a.membreNom}</p>
                  <p className="text-xs text-[#5C7268] mt-0.5">
                    {a.motif}
                    {a.precisions && ` — ${a.precisions}`}
                  </p>
                  <p className="text-xs text-[#9BB0A6] mt-0.5">
                    {dateFr(a.date)}
                    {a.membreTelephone && (
                      <>
                        {" · "}
                        <a href={`tel:${a.membreTelephone.replace(/\s+/g, "")}`} className="hover:text-[#0F7C55]">
                          <FaPhone className="inline text-[10px] mb-0.5" /> {a.membreTelephone}
                        </a>
                      </>
                    )}
                    {a.createdBy && ` · ${a.createdBy}`}
                  </p>
                </div>
                <p className="flex-none text-sm font-bold text-[#B8860B] tabular-nums">
                  {fcfa(a.montant)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
