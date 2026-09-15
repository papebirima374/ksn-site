"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaCashRegister,
  FaPlus,
  FaTrash,
  FaPrint,
  FaFileInvoice,
  FaBan,
  FaCircleInfo,
} from "react-icons/fa6";
import {
  type Vente,
  type LigneVente,
  MOYENS_VENTE,
  totalLignes,
  bilanVentes,
  prochainNumero,
  subscribeVentes,
  enregistrerVente,
  annulerVente,
} from "@/lib/commission-ventes";
import { type Ecriture, fcfa, soldeDe, subscribeCaisse } from "@/lib/commission-caisse";
import { commissionNom } from "@/lib/commissions";
import {
  imprimer,
  htmlFacture,
  htmlJournalVentes,
  factureDeVente,
} from "@/lib/impression";
import type { Product } from "@/lib/admin-types";
import { listProducts } from "@/lib/admin-data";
import { Message } from "./Etats";

const INPUT =
  "w-full rounded-xl border border-[#0F7C55]/25 bg-white px-3.5 py-2.5 text-[#12231C] placeholder:text-[#9BB0A6] outline-none focus:border-[#0F7C55] focus:ring-2 focus:ring-[#0F7C55]/20 transition";

const aujourdhui = () => new Date().toISOString().slice(0, 10);

const dateFr = (d: string) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—";

type Brouillon = { designation: string; quantite: string; prixUnitaire: string };
const LIGNE_VIDE: Brouillon = { designation: "", quantite: "1", prixUnitaire: "" };
const nb = (v: string) => parseInt(String(v).replace(/\D+/g, ""), 10) || 0;

/** Le comptoir de la boutique : on saisit une vente, elle entre dans la caisse
 *  de la commission et sort en facture.
 *
 *  C'est la commission Sociale qui tient la boutique — d'où cet écran ici et
 *  non dans son espace : vendre, encaisser et facturer se font au même
 *  endroit, au moment où le client est devant vous. */
export default function VentesBoutique({
  slug,
  signature,
  pret,
}: {
  slug: string;
  signature: string;
  pret: boolean;
}) {
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [ecritures, setEcritures] = useState<Ecriture[]>([]);
  const [produits, setProduits] = useState<Product[]>([]);
  const [erreur, setErreur] = useState("");

  const [lignes, setLignes] = useState<Brouillon[]>([{ ...LIGNE_VIDE }]);
  const [clientNom, setClientNom] = useState("");
  const [clientTelephone, setClientTelephone] = useState("");
  const [moyen, setMoyen] = useState<string>(MOYENS_VENTE[0]);
  const [date, setDate] = useState(aujourdhui);
  const [note, setNote] = useState("");
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    if (!pret) return;
    return subscribeVentes(slug, setVentes, (e) =>
      setErreur(
        /permission/i.test(e.message)
          ? "Accès refusé. Vérifiez que les règles Firestore publiées sont à jour."
          : "Ventes indisponibles pour le moment."
      )
    );
  }, [slug, pret]);

  useEffect(() => {
    if (!pret) return;
    return subscribeCaisse(slug, setEcritures);
  }, [slug, pret]);

  // Le catalogue sert de raccourci de saisie : un clic remplit la ligne au bon
  // prix, plutôt que de le retaper à chaque vente.
  useEffect(() => {
    if (!pret) return;
    let annule = false;
    listProducts()
      .then((p) => !annule && setProduits(p.filter((x) => x.visible)))
      .catch(() => {
        /* le comptoir marche très bien à la main */
      });
    return () => {
      annule = true;
    };
  }, [pret]);

  const bilan = useMemo(() => bilanVentes(ventes), [ventes]);
  const solde = useMemo(() => soldeDe(ecritures), [ecritures]);
  const numero = useMemo(() => prochainNumero(ventes), [ventes]);

  const propres = useMemo<LigneVente[]>(
    () =>
      lignes.map((l) => ({
        designation: l.designation,
        quantite: nb(l.quantite),
        prixUnitaire: nb(l.prixUnitaire),
      })),
    [lignes]
  );
  const total = useMemo(() => totalLignes(propres.filter((l) => l.designation.trim())), [propres]);

  const set = (i: number, patch: Partial<Brouillon>) =>
    setLignes((l) => l.map((x, k) => (k === i ? { ...x, ...patch } : x)));

  async function encaisser(e: React.FormEvent) {
    e.preventDefault();
    if (total <= 0) return setErreur("Ajoutez au moins un article avec un prix.");
    setEnvoi(true);
    try {
      const vente = await enregistrerVente(
        slug,
        { numero, date, clientNom, clientTelephone, lignes: propres, moyen, note },
        signature
      );
      setLignes([{ ...LIGNE_VIDE }]);
      setClientNom("");
      setClientTelephone("");
      setNote("");
      setErreur("");
      // La facture part à l'impression dans la foulée : c'est le geste qui
      // suit l'encaissement au comptoir.
      imprimer(htmlFacture(factureDeVente(vente, `Commission ${commissionNom(slug)}`)));
    } catch (err) {
      setErreur(
        err instanceof Error && !/permission/i.test(err.message)
          ? err.message
          : "Encaissement impossible. Vérifiez votre connexion."
      );
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* ── Chiffres du comptoir ──────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#0F7C55]/15 bg-gradient-to-br from-[#0F7C55]/[.07] to-[#D4AF37]/[.10] p-5 sm:p-6">
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-display text-2xl font-black text-[#0F7C55] tabular-nums">
              {fcfa(bilan.encaisse)}
            </p>
            <p className="text-xs text-[#5C7268] mt-0.5">Encaissé · {bilan.nombre} facture(s)</p>
          </div>
          <div>
            <p className="font-display text-2xl font-black text-[#0F7C55] tabular-nums">
              {bilan.articles}
            </p>
            <p className="text-xs text-[#5C7268] mt-0.5">Articles vendus</p>
          </div>
          <div>
            <p className="font-display text-2xl font-black text-[#B8860B] tabular-nums">
              {fcfa(solde)}
            </p>
            <p className="text-xs text-[#5C7268] mt-0.5">Solde de la caisse</p>
          </div>
        </div>
        <p className="mt-4 pt-3 border-t border-[#0F7C55]/10 text-xs text-[#5C7268] text-center leading-5">
          Cette caisse est celle de la commission {commissionNom(slug)}. Elle n&apos;a aucun
          rapport avec les finances nationales du Dahira.
        </p>
      </section>

      {erreur && (
        <Message ton="erreur">{erreur}</Message>
      )}

      {/* ── Nouvelle vente ────────────────────────────────────────────── */}
      <form onSubmit={encaisser} className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
          <h3 className="font-bold text-[#082F22] flex items-center gap-2">
            <FaCashRegister className="text-[#0F7C55]" /> Nouvelle vente
          </h3>
          <span className="text-xs font-bold text-[#B8860B] bg-[#D4AF37]/15 px-3 py-1.5 rounded-lg">
            Facture {numero}
          </span>
        </div>
        <p className="text-xs text-[#5C7268] mb-4 leading-5">
          Le montant entre dans la caisse de la commission et la facture part à
          l&apos;impression dès l&apos;enregistrement.
        </p>

        {produits.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-[#5C7268] mb-2">
              Articles de la boutique — un clic pour l&apos;ajouter
            </p>
            <div className="flex flex-wrap gap-2">
              {produits.slice(0, 12).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setLignes((l) => {
                      const vide = l.findIndex((x) => !x.designation.trim());
                      const ligne = {
                        designation: p.title,
                        quantite: "1",
                        prixUnitaire: String(p.price),
                      };
                      return vide >= 0
                        ? l.map((x, k) => (k === vide ? ligne : x))
                        : [...l, ligne];
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#0F7C55]/20 bg-[#F8F5EF] px-3 py-1.5 text-xs font-semibold text-[#082F22] hover:bg-[#0F7C55]/8 transition"
                >
                  {p.title}
                  <span className="text-[#B8860B] tabular-nums">{fcfa(p.price)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2.5">
          {lignes.map((l, i) => (
            <div key={i} className="flex flex-wrap items-start gap-2">
              <input
                value={l.designation}
                onChange={(ev) => set(i, { designation: ev.target.value })}
                className={`${INPUT} flex-1 min-w-[11rem]`}
                placeholder="Désignation — café, sachet, tissu…"
              />
              <input
                inputMode="numeric"
                value={l.quantite}
                onChange={(ev) => set(i, { quantite: ev.target.value })}
                className={`${INPUT} w-20 text-center tabular-nums`}
                placeholder="Qté"
                aria-label="Quantité"
              />
              <input
                inputMode="numeric"
                value={l.prixUnitaire}
                onChange={(ev) => set(i, { prixUnitaire: ev.target.value })}
                className={`${INPUT} w-32 text-right tabular-nums`}
                placeholder="Prix unit."
                aria-label="Prix unitaire"
              />
              <span className="w-28 pt-2.5 text-right text-sm font-bold text-[#082F22] tabular-nums">
                {fcfa(nb(l.quantite) * nb(l.prixUnitaire))}
              </span>
              <button
                type="button"
                aria-label="Supprimer cette ligne"
                onClick={() =>
                  setLignes((x) => (x.length > 1 ? x.filter((_, k) => k !== i) : [{ ...LIGNE_VIDE }]))
                }
                className="flex-none w-11 h-11 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setLignes((l) => [...l, { ...LIGNE_VIDE }])}
          className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#0F7C55] hover:bg-[#0F7C55]/8 px-3 py-2 rounded-lg transition"
        >
          <FaPlus className="text-xs" /> Ajouter une ligne
        </button>

        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-semibold text-[#082F22] mb-1.5">
              Client <span className="font-normal text-[#9BB0A6]">(facultatif)</span>
            </span>
            <input
              value={clientNom}
              onChange={(e) => setClientNom(e.target.value)}
              className={INPUT}
              placeholder="Nom du client"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold text-[#082F22] mb-1.5">
              Téléphone <span className="font-normal text-[#9BB0A6]">(facultatif)</span>
            </span>
            <input
              value={clientTelephone}
              onChange={(e) => setClientTelephone(e.target.value)}
              className={INPUT}
              placeholder="+221 …"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold text-[#082F22] mb-1.5">Règlement</span>
            <select value={moyen} onChange={(e) => setMoyen(e.target.value)} className={INPUT}>
              {MOYENS_VENTE.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-semibold text-[#082F22] mb-1.5">Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={INPUT} />
          </label>
          <label className="block sm:col-span-2">
            <span className="block text-sm font-semibold text-[#082F22] mb-1.5">
              Note sur la facture <span className="font-normal text-[#9BB0A6]">(facultatif)</span>
            </span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={INPUT}
              placeholder="Livraison prévue lundi, reste à payer…"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F8F5EF] px-4 py-3">
          <span className="text-sm font-semibold text-[#5C7268]">Total à encaisser</span>
          <span className="font-display text-2xl font-black text-[#0F7C55] tabular-nums">
            {fcfa(total)}
          </span>
        </div>

        <button
          type="submit"
          disabled={envoi || total <= 0}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#0F7C55] text-white font-bold py-3.5 rounded-xl hover:bg-[#0c6444] transition disabled:opacity-60"
        >
          <FaFileInvoice /> {envoi ? "Encaissement…" : "Encaisser et imprimer la facture"}
        </button>
      </form>

      {/* ── Journal des ventes ────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h3 className="font-bold text-[#082F22]">Journal des ventes</h3>
          {ventes.length > 0 && (
            <button
              onClick={() => imprimer(htmlJournalVentes(ventes, commissionNom(slug)))}
              className="inline-flex items-center gap-2 border-2 border-[#0F7C55] text-[#0F7C55] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#0F7C55]/5 transition"
            >
              <FaPrint /> Imprimer le journal
            </button>
          )}
        </div>

        {ventes.length === 0 ? (
          <p className="flex items-start gap-2 text-sm text-[#9BB0A6] italic py-2">
            <FaCircleInfo className="flex-none mt-0.5" />
            Aucune vente enregistrée pour l&apos;instant.
          </p>
        ) : (
          <div className="divide-y divide-[#0F7C55]/8">
            {ventes.map((v) => (
              <div key={v.id} className="py-3.5 flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#082F22]">
                    <span className={v.annulee ? "line-through text-[#9BB0A6]" : ""}>{v.numero}</span>
                    {v.clientNom && (
                      <span className="font-normal text-[#5C7268]"> — {v.clientNom}</span>
                    )}
                  </p>
                  <p className="text-xs text-[#5C7268] mt-0.5">
                    {v.lignes.map((l) => `${l.quantite}× ${l.designation}`).join(", ")}
                  </p>
                  <p className="text-xs text-[#9BB0A6] mt-0.5">
                    {dateFr(v.date)}
                    {v.moyen && ` · ${v.moyen}`}
                    {v.createdBy && ` · ${v.createdBy}`}
                    {v.annulee && v.motifAnnulation && ` · annulée : ${v.motifAnnulation}`}
                  </p>
                </div>
                <div className="flex-none flex flex-col items-end gap-1.5">
                  <p
                    className={`text-sm font-bold tabular-nums ${
                      v.annulee ? "text-[#9BB0A6] line-through" : "text-[#082F22]"
                    }`}
                  >
                    {fcfa(v.total)}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        imprimer(
                          htmlFacture(factureDeVente(v, `Commission ${commissionNom(slug)}`))
                        )
                      }
                      className="text-[11px] font-bold text-[#0F7C55] hover:underline"
                    >
                      Facture
                    </button>
                    {!v.annulee && (
                      <button
                        onClick={async () => {
                          const raison = prompt(
                            `Annuler la facture ${v.numero} (${fcfa(v.total)}) ?\n\nLa facture reste au registre, barrée, et le montant ressort de la caisse. Motif :`
                          );
                          if (raison === null) return;
                          try {
                            await annulerVente(v, raison, signature);
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
