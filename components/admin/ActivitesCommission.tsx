"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaMugSaucer,
  FaCartShopping,
  FaTriangleExclamation,
} from "react-icons/fa6";
import {
  type Lot,
  type TypeLot,
  LIBELLE_LOT,
  recette,
  marge,
  restant,
  bilanActivites,
  subscribeLots,
  ajouterLot,
  supprimerLot,
} from "@/lib/commission-activites";
import { fcfa } from "@/lib/commission-caisse";

const INPUT =
  "w-full rounded-xl border border-[#0F7C55]/25 bg-white px-3.5 py-2.5 text-[#12231C] placeholder:text-[#9BB0A6] outline-none focus:border-[#0F7C55] focus:ring-2 focus:ring-[#0F7C55]/20 transition";

const aujourdhui = () => new Date().toISOString().slice(0, 10);
const VIDE = { libelle: "", date: aujourdhui(), quantite: "", coutTotal: "", prixUnitaire: "", quantiteVendue: "" };
const nb = (v: string) => parseInt(v.replace(/\D+/g, ""), 10) || 0;

const dateFr = (d: string) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

/** Production et revente. Les deux ont la meme forme — on engage un cout, on
 *  vend une quantite a un prix — d'ou un seul ecran avec deux types. */
export default function ActivitesCommission({
  slug,
  signature,
  pret,
}: {
  slug: string;
  signature: string;
  pret: boolean;
}) {
  const [lots, setLots] = useState<Lot[]>([]);
  const [type, setType] = useState<TypeLot>("production");
  const [f, setF] = useState(VIDE);
  const [ouvert, setOuvert] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!pret) return;
    return subscribeLots(slug, setLots, (e) =>
      setErreur(
        /permission/i.test(e.message)
          ? "Accès refusé. Vérifiez que les règles Firestore publiées sont à jour."
          : "Activités indisponibles pour le moment."
      )
    );
  }, [slug, pret]);

  const bilan = useMemo(() => bilanActivites(lots), [lots]);

  // Apercu en direct pendant la saisie : on voit la marge avant d'enregistrer.
  const apercu = useMemo(() => {
    const r = nb(f.quantiteVendue) * nb(f.prixUnitaire);
    return { recette: r, marge: r - nb(f.coutTotal) };
  }, [f]);

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    if (!f.libelle.trim()) return setErreur("Donnez un nom à ce lot.");
    if (nb(f.quantiteVendue) > nb(f.quantite))
      return setErreur("La quantité vendue dépasse la quantité produite.");
    try {
      await ajouterLot(
        slug,
        {
          type,
          libelle: f.libelle,
          date: f.date,
          quantite: nb(f.quantite),
          coutTotal: nb(f.coutTotal),
          prixUnitaire: nb(f.prixUnitaire),
          quantiteVendue: nb(f.quantiteVendue),
        },
        signature
      );
      setF({ ...VIDE, date: f.date });
      setOuvert(false);
      setErreur("");
    } catch {
      setErreur("Enregistrement impossible. Vérifiez votre connexion.");
    }
  }

  return (
    <div className="space-y-5">
      {/* ── Bilan ───────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#0F7C55]/15 bg-gradient-to-br from-[#0F7C55]/[.07] to-[#D4AF37]/[.10] p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#5C7268] text-center">
          Bilan des activités
        </p>
        <p
          className={`mt-2 text-center font-display text-4xl font-black tabular-nums ${
            bilan.marge >= 0 ? "text-[#0F7C55]" : "text-red-600"
          }`}
        >
          {bilan.marge >= 0 ? "+" : "−"} {fcfa(Math.abs(bilan.marge))}
        </p>
        <p className="text-center text-xs text-[#5C7268] mt-1">de marge sur {bilan.lots} lot(s)</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-sm font-bold text-[#B8860B] tabular-nums">{fcfa(bilan.cout)}</p>
            <p className="text-[11px] text-[#5C7268]">dépensé</p>
          </div>
          <div>
            <p className="text-sm font-bold text-[#0F7C55] tabular-nums">{fcfa(bilan.recette)}</p>
            <p className="text-[11px] text-[#5C7268]">encaissé</p>
          </div>
          <div>
            <p className="text-sm font-bold text-[#5C7268] tabular-nums">{bilan.invendus}</p>
            <p className="text-[11px] text-[#5C7268]">invendus</p>
          </div>
        </div>
      </section>

      {erreur && (
        <p className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">
          <FaTriangleExclamation className="flex-none mt-0.5" />
          <span>{erreur}</span>
        </p>
      )}

      {/* ── Saisie ──────────────────────────────────────────────────── */}
      {!ouvert ? (
        <button
          onClick={() => setOuvert(true)}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#0F7C55] text-white font-bold py-3.5 rounded-xl hover:bg-[#0c6444] transition"
        >
          <FaPlus /> Enregistrer une production ou une revente
        </button>
      ) : (
        <form onSubmit={enregistrer} className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5 sm:p-6">
          <div className="flex gap-2 mb-5">
            {(["production", "evenement"] as TypeLot[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition ${
                  type === t ? "bg-[#0F7C55] text-white" : "bg-[#F8F5EF] text-[#5C7268] hover:bg-[#0F7C55]/5"
                }`}
              >
                {t === "production" ? <FaMugSaucer /> : <FaCartShopping />} {LIBELLE_LOT[t]}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <input
              value={f.libelle}
              onChange={(e) => setF({ ...f, libelle: e.target.value })}
              className={INPUT}
              placeholder={type === "production" ? "Fournée du 12 septembre" : "Revente — Journée Salaatu"}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Champ label="Date">
                <input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} className={INPUT} />
              </Champ>
              <Champ label={type === "production" ? "Quantité produite" : "Quantité achetée"}>
                <input inputMode="numeric" value={f.quantite} onChange={(e) => setF({ ...f, quantite: e.target.value })} className={INPUT} placeholder="Ex. 200" />
              </Champ>
              <Champ label={type === "production" ? "Coût des ingrédients (FCFA)" : "Coût d'achat (FCFA)"}>
                <input inputMode="numeric" value={f.coutTotal} onChange={(e) => setF({ ...f, coutTotal: e.target.value })} className={INPUT} placeholder="Ex. 40000" />
              </Champ>
              <Champ label="Prix de vente à l'unité (FCFA)">
                <input inputMode="numeric" value={f.prixUnitaire} onChange={(e) => setF({ ...f, prixUnitaire: e.target.value })} className={INPUT} placeholder="Ex. 500" />
              </Champ>
              <Champ label="Quantité vendue">
                <input inputMode="numeric" value={f.quantiteVendue} onChange={(e) => setF({ ...f, quantiteVendue: e.target.value })} className={INPUT} placeholder="Ex. 180" />
              </Champ>
            </div>

            {(apercu.recette > 0 || nb(f.coutTotal) > 0) && (
              <p className="rounded-xl bg-[#F8F5EF] px-4 py-3 text-sm text-[#082F22]">
                Recette <b className="tabular-nums">{fcfa(apercu.recette)}</b> · marge{" "}
                <b className={`tabular-nums ${apercu.marge >= 0 ? "text-[#0F7C55]" : "text-red-600"}`}>
                  {apercu.marge >= 0 ? "+" : "−"} {fcfa(Math.abs(apercu.marge))}
                </b>
              </p>
            )}
          </div>

          <div className="mt-5 flex gap-3">
            <button type="submit" className="flex-1 bg-[#0F7C55] text-white font-bold py-3 rounded-xl hover:bg-[#0c6444] transition">
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => {
                setOuvert(false);
                setF(VIDE);
              }}
              className="px-5 border-2 border-[#0F7C55]/25 text-[#5C7268] font-bold rounded-xl"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* ── Historique ──────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5 sm:p-6">
        <h3 className="font-bold text-[#082F22] mb-4">Productions et reventes</h3>
        {lots.length === 0 ? (
          <p className="text-sm text-[#9BB0A6] italic py-4">Rien d&apos;enregistré pour l&apos;instant.</p>
        ) : (
          <div className="divide-y divide-[#0F7C55]/8">
            {lots.map((l) => (
              <div key={l.id} className="py-3.5 flex items-start gap-3">
                <span className="flex-none w-8 h-8 rounded-lg bg-[#0F7C55]/10 text-[#0F7C55] flex items-center justify-center text-xs">
                  {l.type === "production" ? <FaMugSaucer /> : <FaCartShopping />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#082F22]">{l.libelle}</p>
                  <p className="text-xs text-[#9BB0A6] mt-0.5">
                    {dateFr(l.date)} · {l.quantiteVendue}/{l.quantite} vendus à {fcfa(l.prixUnitaire)}
                    {restant(l) > 0 && ` · ${restant(l)} restants`}
                  </p>
                  <p className="text-xs text-[#5C7268] mt-1">
                    Coût {fcfa(l.coutTotal)} · recette {fcfa(recette(l))}
                  </p>
                </div>
                <div className="flex-none text-right">
                  <p className={`text-sm font-bold tabular-nums ${marge(l) >= 0 ? "text-[#0F7C55]" : "text-red-600"}`}>
                    {marge(l) >= 0 ? "+" : "−"} {fcfa(Math.abs(marge(l)))}
                  </p>
                  <button
                    onClick={async () => {
                      if (!confirm(`Supprimer « ${l.libelle} » ?`)) return;
                      await supprimerLot(l.id);
                    }}
                    className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:underline"
                  >
                    <FaTrash /> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-5 pt-4 border-t border-[#0F7C55]/10 text-xs text-[#5C7268] leading-5">
          Ces montants décrivent l&apos;activité. Ils ne bougent pas la caisse tout seuls :
          portez la recette et les dépenses dans l&apos;onglet <b>Caisse</b> quand
          l&apos;argent entre ou sort réellement.
        </p>
      </section>
    </div>
  );
}

function Champ({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-[#082F22] mb-1.5">{label}</span>
      {children}
    </label>
  );
}
