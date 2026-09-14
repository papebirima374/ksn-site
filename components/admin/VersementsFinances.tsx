"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaMoneyBillTransfer,
  FaArrowRightLong,
  FaCircleCheck,
  FaCircleInfo,
  FaTriangleExclamation,
  FaPrint,
  FaWhatsapp,
  FaBan,
} from "react-icons/fa6";
import { COMMISSIONS, commissionNom } from "@/lib/commissions";
import {
  type Transfert,
  EMETTRICE,
  MOYENS,
  LIBELLE_TRANSFERT,
  bilanVersements,
  subscribeVersementsEmis,
  verser,
  annulerVersement,
} from "@/lib/commission-transferts";
import { fcfa } from "@/lib/commission-caisse";
import { notifierCommission } from "@/lib/admin-data";
import { authHeader } from "@/lib/client-auth-header";
import { imprimer, htmlVersements, htmlRecuVersement } from "@/lib/impression";

const INPUT =
  "w-full rounded-xl border border-[#0F7C55]/25 bg-white px-3.5 py-2.5 text-[#12231C] placeholder:text-[#9BB0A6] outline-none focus:border-[#0F7C55] focus:ring-2 focus:ring-[#0F7C55]/20 transition";

const aujourdhui = () => new Date().toISOString().slice(0, 10);

const dateFr = (d: string) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—";

const horodatage = (ts: number) =>
  ts ? new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "long" }) : "—";

/** Versements de la trésorerie du Dahira vers les commissions.
 *
 *  L'argent sort du COMPTE PRINCIPAL — le Dahira n'en a qu'un — et la sortie
 *  est portée à la trésorerie dans la même opération que le versement : soit
 *  les deux passent, soit aucun.
 *
 *  Il n'entre dans la caisse de la commission qu'à son accusé de réception,
 *  écrit par sa responsable depuis son propre espace. Tant qu'elle n'a pas
 *  confirmé, on sait qu'on a remis, pas que c'est arrivé. */
export default function VersementsFinances({
  signature,
  peutVerser,
  pret,
}: {
  signature: string;
  /** Seul le trésorier verse. Les autres lisent le registre. */
  peutVerser: boolean;
  pret: boolean;
}) {
  const [liste, setListe] = useState<Transfert[]>([]);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!pret) return;
    return subscribeVersementsEmis(EMETTRICE, setListe, (e) =>
      setErreur(
        /permission/i.test(e.message)
          ? "Accès refusé. Vérifiez que les règles Firestore publiées sont à jour."
          : "Versements indisponibles pour le moment."
      )
    );
  }, [pret]);

  const bilan = useMemo(() => bilanVersements(liste), [liste]);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#0F7C55]/15 bg-gradient-to-br from-[#0F7C55]/[.07] to-[#D4AF37]/[.10] p-5 sm:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#5C7268] text-center">
          Versements aux commissions
        </p>
        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-center">
          <div>
            <p className="font-display text-2xl font-black text-[#0F7C55] tabular-nums">
              {fcfa(bilan.verse)}
            </p>
            <p className="text-xs text-[#5C7268] mt-0.5">Total versé · {bilan.nombre}</p>
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
              {bilan.nombreAttente} sans accusé
            </p>
          </div>
        </div>
        <p className="mt-4 pt-3 border-t border-[#0F7C55]/10 text-xs text-[#5C7268] text-center leading-5">
          Ces sommes sortent du <b>compte principal</b> du Dahira et figurent dans les
          transactions ci-dessous, en dépense.
        </p>
      </section>

      {erreur && (
        <p className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">
          <FaTriangleExclamation className="flex-none mt-0.5" />
          <span>{erreur}</span>
        </p>
      )}

      {peutVerser && <Verser signature={signature} onErreur={setErreur} />}

      <section className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h3 className="font-bold text-[#082F22]">Registre des versements</h3>
          {liste.length > 0 && (
            <button
              onClick={() => imprimer(htmlVersements(liste, "Trésorerie du Dahira"))}
              className="inline-flex items-center gap-2 border-2 border-[#0F7C55] text-[#0F7C55] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#0F7C55]/5 transition"
            >
              <FaPrint /> Imprimer le registre
            </button>
          )}
        </div>

        {liste.length === 0 ? (
          <p className="flex items-start gap-2 text-sm text-[#9BB0A6] italic py-2">
            <FaCircleInfo className="flex-none mt-0.5" />
            Aucun versement effectué pour l&apos;instant.
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
                    Compte principal
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => imprimer(htmlRecuVersement(t))}
                      className="text-[11px] font-bold text-[#0F7C55] hover:underline"
                    >
                      Reçu
                    </button>
                    {peutVerser && t.statut === "envoye" && (
                      <button
                        onClick={async () => {
                          const raison = prompt(
                            `Annuler le versement de ${fcfa(t.montant)} à « ${commissionNom(t.vers)} » ?\n\nLa somme reviendra au compte principal par une écriture d'annulation. Motif :`
                          );
                          if (raison === null) return;
                          try {
                            await annulerVersement(t, raison, signature);
                          } catch {
                            setErreur("Annulation impossible. Vérifiez votre connexion.");
                          }
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:underline"
                      >
                        <FaBan className="text-[10px]" /> Annuler
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ═══ Nouveau versement ═════════════════════════════════════════════════ */

function Verser({
  signature,
  onErreur,
}: {
  signature: string;
  onErreur: (m: string) => void;
}) {
  const destinataires = COMMISSIONS.filter((c) => c.slug !== EMETTRICE);
  const [vers, setVers] = useState(destinataires[0].slug);
  const [montant, setMontant] = useState("");
  const [motif, setMotif] = useState("");
  const [moyen, setMoyen] = useState<string>(MOYENS[0]);
  const [reference, setReference] = useState("");
  const [date, setDate] = useState(aujourdhui);
  const [envoi, setEnvoi] = useState(false);
  const [fait, setFait] = useState<{ vers: string; montant: number } | null>(null);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    const n = parseInt(montant.replace(/\D+/g, ""), 10);
    if (!Number.isFinite(n) || n <= 0) return onErreur("Indiquez le montant à verser.");
    setEnvoi(true);
    try {
      await verser(EMETTRICE, { vers, montant: n, motif, moyen, reference, date }, signature);
      try {
        await notifierCommission({
          commission: vers,
          type: "transfert_envoye",
          title: `Versement de ${fcfa(n)} — trésorerie du Dahira`,
          body: `${motif || "Versement"} · ${moyen}. Merci d'accuser réception depuis l'onglet Versements.`,
          link: "/admin/ma-commission?onglet=versements",
          meta: { montant: n, de: EMETTRICE },
        });
      } catch {
        /* le versement est enregistré : la notification n'est qu'un rappel */
      }
      setFait({ vers, montant: n });
      setMontant("");
      setMotif("");
      setReference("");
      onErreur("");
    } catch {
      onErreur("Versement impossible. Vérifiez votre connexion.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form onSubmit={soumettre} className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5 sm:p-6">
      <h3 className="font-bold text-[#082F22] mb-1">Verser à une commission</h3>
      <p className="text-xs text-[#5C7268] mb-4 leading-5">
        La somme est retirée du <b>compte principal</b> du Dahira et apparaît
        immédiatement en dépense dans les transactions. Elle n&apos;entrera dans la
        caisse de la commission qu&apos;une fois la réception accusée par sa
        responsable — c&apos;est ce qui vous confirme que l&apos;argent est bien arrivé.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm font-semibold text-[#082F22] mb-1.5">Commission</span>
          <select value={vers} onChange={(e) => setVers(e.target.value)} className={INPUT}>
            {destinataires.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nom}
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
            placeholder="Ex. 150000"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="block text-sm font-semibold text-[#082F22] mb-1.5">Motif</span>
          <input
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            className={INPUT}
            placeholder="Dotation Journée Salaatu, achat de matériel…"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-[#082F22] mb-1.5">Moyen</span>
          <select value={moyen} onChange={(e) => setMoyen(e.target.value)} className={INPUT}>
            {MOYENS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-[#082F22] mb-1.5">
            Référence <span className="font-normal text-[#9BB0A6]">(facultatif)</span>
          </span>
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className={INPUT}
            placeholder="N° Wave, n° de chèque…"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-[#082F22] mb-1.5">Date de la remise</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={INPUT} />
        </label>
      </div>

      <button
        type="submit"
        disabled={envoi}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#0F7C55] text-white font-bold py-3.5 rounded-xl hover:bg-[#0c6444] transition disabled:opacity-60"
      >
        <FaMoneyBillTransfer /> {envoi ? "Enregistrement…" : "Verser depuis le compte principal"}
      </button>

      {fait && <Prevenir vers={fait.vers} montant={fait.montant} />}
    </form>
  );
}

/* ═══ Prévenir la responsable sur WhatsApp ══════════════════════════════ */

/** La cloche prévient le compte de la commission. WhatsApp prévient la
 *  personne — c'est le canal réel du Dahira, et celui qui fait bouger les
 *  choses le jour même. */
function Prevenir({ vers, montant }: { vers: string; montant: number }) {
  const [tel, setTel] = useState("");

  useEffect(() => {
    let annule = false;
    (async () => {
      try {
        const res = await fetch("/api/commission-contacts", { headers: await authHeader() });
        if (!res.ok) return;
        const d = await res.json();
        if (!annule) setTel((d?.contacts?.[vers] ?? "").replace(/\D+/g, ""));
      } catch {
        // Sans numéro, le bouton ouvre WhatsApp sans destinataire : dégradé,
        // mais la notification in-app est déjà partie.
      }
    })();
    return () => {
      annule = true;
    };
  }, [vers]);

  const texte = encodeURIComponent(
    `As-salaamu 'alaykum.\n\nLa trésorerie du Dahira vient de verser ${fcfa(montant)} à la commission ${commissionNom(vers)}.\n\n` +
      `Merci d'accuser réception depuis votre espace, onglet « Versements ».\n\nJazaakumu Laahu khayran.`
  );

  return (
    <div className="mt-4 rounded-xl bg-[#0F7C55]/[.06] border border-[#0F7C55]/15 px-4 py-3.5">
      <p className="text-sm text-[#082F22] flex items-start gap-2">
        <FaCircleCheck className="flex-none mt-0.5 text-[#0F7C55]" />
        <span>
          Versement enregistré et porté en dépense. La commission {commissionNom(vers)}{" "}
          a été notifiée dans son espace.
        </span>
      </p>
      <a
        href={tel ? `https://wa.me/${tel}?text=${texte}` : `https://wa.me/?text=${texte}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#0F7C55] px-3.5 py-2 rounded-lg text-sm font-bold transition"
      >
        <FaWhatsapp /> Prévenir aussi sur WhatsApp
      </a>
    </div>
  );
}
