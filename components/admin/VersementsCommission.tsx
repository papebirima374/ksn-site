"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaMoneyBillTransfer,
  FaArrowRightLong,
  FaCircleCheck,
  FaCircleInfo,
  FaTriangleExclamation,
  FaPrint,
  FaHandshake,
} from "react-icons/fa6";
import { commissionNom } from "@/lib/commissions";
import {
  type Transfert,
  LIBELLE_TRANSFERT,
  bilanVersements,
  subscribeVersementsRecus,
  accuserReception,
} from "@/lib/commission-transferts";
import { fcfa } from "@/lib/commission-caisse";
import { notifierCommission } from "@/lib/admin-data";
import { imprimer, htmlVersements, htmlRecuVersement } from "@/lib/impression";
import BoutonEnvoyer from "@/components/admin/BoutonEnvoyer";

const INPUT =
  "w-full rounded-xl border border-[#0F7C55]/25 bg-white px-3.5 py-2.5 text-[#12231C] placeholder:text-[#9BB0A6] outline-none focus:border-[#0F7C55] focus:ring-2 focus:ring-[#0F7C55]/20 transition";

const dateFr = (d: string) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—";

const horodatage = (ts: number) =>
  ts ? new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "long" }) : "—";

/** Ce que la commission a reçu de la trésorerie du Dahira — et ce qu'elle doit
 *  encore confirmer.
 *
 *  L'envoi ne se fait PAS ici : il part de la trésorerie (/admin/finances),
 *  puisée sur le compte principal. Ici, on accuse réception — et c'est cet
 *  accusé qui fait entrer la somme dans la caisse de la commission. */
export default function VersementsCommission({
  slug,
  signature,
  pret,
}: {
  slug: string;
  signature: string;
  pret: boolean;
}) {
  const [liste, setListe] = useState<Transfert[]>([]);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!pret) return;
    return subscribeVersementsRecus(slug, setListe, (e) =>
      setErreur(
        /permission/i.test(e.message)
          ? "Accès refusé. Vérifiez que les règles Firestore publiées sont à jour."
          : "Versements indisponibles pour le moment."
      )
    );
  }, [slug, pret]);

  const bilan = useMemo(() => bilanVersements(liste), [liste]);
  const attente = useMemo(() => liste.filter((t) => t.statut === "envoye"), [liste]);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#0F7C55]/15 bg-gradient-to-br from-[#0F7C55]/[.07] to-[#D4AF37]/[.10] p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#5C7268] text-center">
          Versements reçus de la trésorerie du Dahira
        </p>
        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-center">
          <div>
            <p className="font-display text-2xl font-black text-[#0F7C55] tabular-nums">
              {fcfa(bilan.verse)}
            </p>
            <p className="text-xs text-[#5C7268] mt-0.5">Total reçu</p>
          </div>
          <div>
            <p className="font-display text-2xl font-black text-[#0F7C55] tabular-nums">
              {fcfa(bilan.recu)}
            </p>
            <p className="text-xs text-[#5C7268] mt-0.5">Réception accusée</p>
          </div>
          <div>
            <p className="font-display text-2xl font-black text-[#B8860B] tabular-nums">
              {fcfa(bilan.attente)}
            </p>
            <p className="text-xs text-[#5C7268] mt-0.5">
              {bilan.nombreAttente} à confirmer
            </p>
          </div>
        </div>
      </section>

      {erreur && (
        <p className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">
          <FaTriangleExclamation className="flex-none mt-0.5" />
          <span>{erreur}</span>
        </p>
      )}

      {/* ── Ce qui attend un accusé de réception ─────────────────────── */}
      {attente.length > 0 && (
        <section className="rounded-2xl border-2 border-[#D4AF37] bg-[#D4AF37]/[.10] p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-1">
            <FaHandshake className="text-[#B8860B]" />
            <h3 className="font-bold text-[#082F22]">
              {attente.length} versement{attente.length > 1 ? "s" : ""} à confirmer
            </h3>
          </div>
          <p className="text-xs text-[#5C7268] mb-4 leading-5">
            Confirmez ce que vous avez réellement reçu : la trésorerie attend votre
            accusé, et la somme n&apos;entrera dans la caisse de votre commission
            qu&apos;à ce moment-là.
          </p>
          <div className="space-y-3">
            {attente.map((t) => (
              <Accuser key={t.id} t={t} signature={signature} onErreur={setErreur} />
            ))}
          </div>
        </section>
      )}

      {/* ── Registre ─────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h3 className="font-bold text-[#082F22]">Registre des versements reçus</h3>
          {liste.length > 0 && (
            <div className="flex flex-wrap items-start gap-3">
              <button
                onClick={() => imprimer(htmlVersements(liste, `Reçus — ${commissionNom(slug)}`))}
                className="inline-flex items-center gap-2 border-2 border-[#0F7C55] text-[#0F7C55] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#0F7C55]/5 transition"
              >
                <FaPrint /> Imprimer
              </button>
              <BoutonEnvoyer
                html={() => htmlVersements(liste, `Reçus — ${commissionNom(slug)}`)}
                titre={`Versements reçus — ${commissionNom(slug)}`}
                message={`Registre des versements reçus par la commission ${commissionNom(slug)}.`}
              />
            </div>
          )}
        </div>

        {liste.length === 0 ? (
          <p className="flex items-start gap-2 text-sm text-[#9BB0A6] italic py-2">
            <FaCircleInfo className="flex-none mt-0.5" />
            Aucun versement reçu pour l&apos;instant.
          </p>
        ) : (
          <div className="divide-y divide-[#0F7C55]/8">
            {liste.map((t) => (
              <div key={t.id} className="py-3.5 flex flex-wrap items-start gap-3">
                <span className="flex-none w-8 h-8 rounded-lg bg-[#0F7C55]/10 text-[#0F7C55] flex items-center justify-center text-xs">
                  <FaMoneyBillTransfer />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#082F22]">
                    Trésorerie du Dahira
                    <FaArrowRightLong className="inline text-xs text-[#9BB0A6] mx-1.5" />
                    {commissionNom(t.vers)}
                  </p>
                  <p className="text-xs text-[#5C7268] mt-0.5">
                    {t.motif || "Sans motif précisé"}
                    {t.moyen && ` · ${t.moyen}`}
                    {t.reference && ` · ${t.reference}`}
                  </p>
                  <p className="text-xs text-[#9BB0A6] mt-0.5">
                    Remis le {dateFr(t.date)}
                    {t.envoyePar && ` par ${t.envoyePar}`}
                    {t.statut === "recu" && (
                      <>
                        {" · "}
                        <span className="text-[#0F7C55] font-semibold">
                          reçu le {horodatage(t.recuAt)}
                          {t.recuPar && ` par ${t.recuPar}`}
                        </span>
                      </>
                    )}
                    {t.statut === "annule" && t.motifAnnulation && ` · ${t.motifAnnulation}`}
                  </p>
                  {t.observation && (
                    <p className="text-xs text-[#5C7268] mt-1 italic">« {t.observation} »</p>
                  )}
                </div>

                <div className="flex-none flex flex-col items-end gap-1.5">
                  <p className="text-sm font-bold text-[#082F22] tabular-nums">{fcfa(t.montant)}</p>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      t.statut === "recu"
                        ? "bg-[#0F7C55]/12 text-[#0F7C55]"
                        : t.statut === "annule"
                          ? "bg-[#F8F5EF] text-[#9BB0A6]"
                          : "bg-[#D4AF37]/18 text-[#8A6A08]"
                    }`}
                  >
                    {LIBELLE_TRANSFERT[t.statut]}
                  </span>
                  <button
                    onClick={() => imprimer(htmlRecuVersement(t))}
                    className="text-[11px] font-bold text-[#0F7C55] hover:underline"
                  >
                    Reçu
                  </button>
                  <BoutonEnvoyer
                    html={() => htmlRecuVersement(t)}
                    titre={`Reçu de versement — ${commissionNom(slug)}`}
                    message={`Reçu du versement de ${t.montant.toLocaleString("fr-FR")} FCFA — ${t.motif}.`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#128C7E] hover:underline"
                    libelle="Envoyer"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ═══ Accusé de réception ═══════════════════════════════════════════════ */

function Accuser({
  t,
  signature,
  onErreur,
}: {
  t: Transfert;
  signature: string;
  onErreur: (m: string) => void;
}) {
  const [observation, setObservation] = useState("");
  const [envoi, setEnvoi] = useState(false);

  async function confirmer() {
    if (
      !confirm(
        `Confirmer avoir reçu ${fcfa(t.montant)} de la trésorerie du Dahira ?\n\nLa somme entrera dans la caisse de votre commission.`
      )
    )
      return;
    setEnvoi(true);
    try {
      await accuserReception(t, observation, signature);
      // La notification ne fait pas partie du registre : si elle échoue,
      // l'accusé reste valable et visible à la trésorerie.
      try {
        await notifierCommission({
          commission: t.de,
          type: "transfert_recu",
          title: `Réception accusée — ${commissionNom(t.vers)}`,
          body: `${commissionNom(t.vers)} confirme avoir reçu ${fcfa(t.montant)}${
            signature ? ` (${signature})` : ""
          }.`,
          link: "/admin/finances",
          meta: { transfert: t.id, montant: t.montant },
        });
      } catch {
        /* sans effet sur l'accusé */
      }
      onErreur("");
    } catch {
      onErreur("Impossible d'enregistrer l'accusé de réception. Vérifiez votre connexion.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="rounded-xl bg-white border border-[#D4AF37]/40 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-bold text-[#082F22]">
          {fcfa(t.montant)}{" "}
          <span className="font-normal text-sm text-[#5C7268]">
            — {t.motif || "sans motif précisé"}
          </span>
        </p>
        <p className="text-xs text-[#9BB0A6]">
          Remis le {dateFr(t.date)}
          {t.moyen && ` · ${t.moyen}`}
          {t.reference && ` · ${t.reference}`}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2.5">
        <input
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          className={`${INPUT} flex-1 min-w-[14rem]`}
          placeholder="Observation (facultatif) — reçu en espèces, remis à…"
        />
        <button
          onClick={confirmer}
          disabled={envoi}
          className="inline-flex items-center gap-2 bg-[#0F7C55] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#0c6444] transition disabled:opacity-60"
        >
          <FaCircleCheck /> {envoi ? "Enregistrement…" : "Accuser réception"}
        </button>
      </div>
    </div>
  );
}
