"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaBan,
  FaCircleInfo,
  FaTriangleExclamation,
} from "react-icons/fa6";
import {
  type Ecriture,
  type Sens,
  MAX_MOTIF,
  fcfa,
  soldeDe,
  totalPar,
  annulees,
  subscribeCaisse,
  ajouterEcriture,
  annulerEcriture,
} from "@/lib/commission-caisse";
import type { MembreCommission } from "@/lib/commission-membres";

const INPUT =
  "w-full rounded-xl border border-[#0F7C55]/25 bg-white px-3.5 py-2.5 text-[#12231C] placeholder:text-[#9BB0A6] outline-none focus:border-[#0F7C55] focus:ring-2 focus:ring-[#0F7C55]/20 transition";

const aujourdhui = () => new Date().toISOString().slice(0, 10);

const dateFr = (d: string) =>
  d
    ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

export default function CaisseCommission({
  slug,
  nomCommission,
  membres,
  signature,
  pret,
}: {
  slug: string;
  nomCommission: string;
  membres: MembreCommission[];
  signature: string;
  pret: boolean;
}) {
  const [ecritures, setEcritures] = useState<Ecriture[]>([]);
  const [erreur, setErreur] = useState("");
  const [sens, setSens] = useState<Sens>("entree");
  const [montant, setMontant] = useState("");
  const [motif, setMotif] = useState("");
  const [date, setDate] = useState(aujourdhui);
  const [matricule, setMatricule] = useState("");
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    if (!pret) return;
    return subscribeCaisse(slug, setEcritures, (e) =>
      setErreur(
        /permission/i.test(e.message)
          ? "Accès à la caisse refusé. Vérifiez que les règles Firestore publiées sont à jour."
          : "Caisse indisponible pour le moment."
      )
    );
  }, [slug, pret]);

  const solde = useMemo(() => soldeDe(ecritures), [ecritures]);
  const entrees = useMemo(() => totalPar(ecritures, "entree"), [ecritures]);
  const sorties = useMemo(() => totalPar(ecritures, "sortie"), [ecritures]);
  const dejaAnnulees = useMemo(() => annulees(ecritures), [ecritures]);

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    const n = parseInt(montant.replace(/\D+/g, ""), 10);
    if (!Number.isFinite(n) || n <= 0) return setErreur("Indiquez un montant.");
    if (!motif.trim()) return setErreur("Indiquez un motif.");
    setEnvoi(true);
    try {
      const m = membres.find((x) => x.matricule === matricule);
      await ajouterEcriture(
        slug,
        {
          sens,
          montant: n,
          motif,
          date,
          membreMatricule: m?.matricule,
          membreNom: m?.nom,
        },
        signature
      );
      setMontant("");
      setMotif("");
      setMatricule("");
      setErreur("");
    } catch {
      setErreur("Enregistrement impossible. Vérifiez votre connexion.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* ── Solde ───────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#0F7C55]/15 bg-gradient-to-br from-[#0F7C55]/[.07] to-[#D4AF37]/[.10] p-6 text-center">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#5C7268]">
          Solde de la caisse — {nomCommission}
        </p>
        <p className="mt-2 font-display text-4xl sm:text-5xl font-black text-[#0F7C55] tabular-nums">
          {fcfa(solde)}
        </p>
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <span className="text-[#0F7C55] font-semibold">
            <FaArrowDown className="inline mb-0.5" /> {fcfa(entrees)} entrés
          </span>
          <span className="text-[#B8860B] font-semibold">
            <FaArrowUp className="inline mb-0.5" /> {fcfa(sorties)} sortis
          </span>
        </div>
        <p className="mt-4 inline-flex items-start gap-2 text-[11px] text-[#5C7268] leading-5 max-w-md">
          <FaCircleInfo className="flex-none mt-0.5" />
          Cette caisse est propre à la commission. Elle n&apos;entre dans aucun compte
          national du Dahira.
        </p>
      </section>

      {erreur && (
        <p className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">
          <FaTriangleExclamation className="flex-none mt-0.5" />
          <span>{erreur}</span>
        </p>
      )}

      {/* ── Nouvelle écriture ───────────────────────────────────────── */}
      <form onSubmit={enregistrer} className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5 sm:p-6">
        <h3 className="font-bold text-[#082F22] mb-4">Nouvelle écriture</h3>

        <div className="flex gap-2 mb-4">
          {(["entree", "sortie"] as Sens[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSens(s)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${
                sens === s
                  ? s === "entree"
                    ? "bg-[#0F7C55] text-white"
                    : "bg-[#B8860B] text-white"
                  : "bg-[#F8F5EF] text-[#5C7268] hover:bg-[#0F7C55]/5"
              }`}
            >
              {s === "entree" ? "↓ Entrée" : "↑ Sortie"}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-semibold text-[#082F22] mb-1.5">Montant (FCFA)</span>
            <input
              inputMode="numeric"
              value={montant}
              onChange={(ev) => setMontant(ev.target.value)}
              className={`${INPUT} font-bold text-lg tabular-nums`}
              placeholder="Ex. 5000"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold text-[#082F22] mb-1.5">Date</span>
            <input type="date" value={date} onChange={(ev) => setDate(ev.target.value)} className={INPUT} />
          </label>
        </div>

        <label className="block mt-4">
          <span className="block text-sm font-semibold text-[#082F22] mb-1.5">Motif</span>
          <input
            value={motif}
            onChange={(ev) => setMotif(ev.target.value)}
            maxLength={MAX_MOTIF}
            className={INPUT}
            placeholder="Cotisation de septembre, achat de nattes…"
          />
        </label>

        {membres.length > 0 && (
          <label className="block mt-4">
            <span className="block text-sm font-semibold text-[#082F22] mb-1.5">
              Membre concerné <span className="font-normal text-[#9BB0A6]">(facultatif)</span>
            </span>
            <select value={matricule} onChange={(ev) => setMatricule(ev.target.value)} className={INPUT}>
              <option value="">— Aucun —</option>
              {membres.map((m) => (
                <option key={m.id} value={m.matricule}>
                  {m.nom}
                </option>
              ))}
            </select>
          </label>
        )}

        <button
          type="submit"
          disabled={envoi}
          className="mt-5 w-full bg-[#0F7C55] text-white font-bold py-3.5 rounded-xl hover:bg-[#0c6444] transition disabled:opacity-60"
        >
          {envoi ? "Enregistrement…" : "Enregistrer l'écriture"}
        </button>
      </form>

      {/* ── Historique ──────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5 sm:p-6">
        <h3 className="font-bold text-[#082F22] mb-1">Historique</h3>
        <p className="text-xs text-[#5C7268] mb-4 leading-5">
          Une erreur ne s&apos;efface pas : on l&apos;annule, et les deux lignes restent
          visibles. C&apos;est ce qui rend la caisse vérifiable.
        </p>

        {ecritures.length === 0 ? (
          <p className="text-sm text-[#9BB0A6] italic py-4">Aucune écriture pour l&apos;instant.</p>
        ) : (
          <div className="divide-y divide-[#0F7C55]/8">
            {ecritures.map((e) => {
              const morte = dejaAnnulees.has(e.id);
              return (
                <div key={e.id} className="py-3 flex items-start gap-3">
                  <span
                    className={`flex-none w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                      e.sens === "entree"
                        ? "bg-[#0F7C55]/10 text-[#0F7C55]"
                        : "bg-[#D4AF37]/15 text-[#B8860B]"
                    }`}
                  >
                    {e.sens === "entree" ? <FaArrowDown /> : <FaArrowUp />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-semibold text-[#082F22] ${
                        morte ? "line-through opacity-50" : ""
                      }`}
                    >
                      {e.motif}
                    </p>
                    <p className="text-xs text-[#9BB0A6] mt-0.5">
                      {dateFr(e.date)}
                      {e.membreNom && ` · ${e.membreNom}`}
                      {e.createdBy && ` · saisi par ${e.createdBy}`}
                    </p>
                  </div>
                  <div className="flex-none text-right">
                    <p
                      className={`text-sm font-bold tabular-nums ${
                        morte
                          ? "line-through text-[#9BB0A6]"
                          : e.sens === "entree"
                            ? "text-[#0F7C55]"
                            : "text-[#B8860B]"
                      }`}
                    >
                      {e.sens === "entree" ? "+" : "−"} {fcfa(e.montant)}
                    </p>
                    {!morte && !e.annuleId && (
                      <button
                        onClick={async () => {
                          if (!confirm(`Annuler « ${e.motif} » ?\n\nUne écriture inverse sera ajoutée ; les deux resteront visibles.`))
                            return;
                          try {
                            await annulerEcriture(e, signature);
                          } catch {
                            setErreur("Annulation impossible. Vérifiez votre connexion.");
                          }
                        }}
                        className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:underline"
                      >
                        <FaBan /> Annuler
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
