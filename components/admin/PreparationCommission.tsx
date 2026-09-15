"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaWhatsapp,
  FaPrint,
  FaCircleInfo,
  FaClock,
} from "react-icons/fa6";
import {
  type Tache,
  type StatutTache,
  LIBELLE_TACHE,
  ORDRE_STATUT,
  bilanPreparation,
  estEnRetard,
  subscribeTaches,
  ajouterTache,
  modifierTache,
  supprimerTache,
  texteRappel,
} from "@/lib/commission-taches";
import type { MembreCommission } from "@/lib/commission-membres";
import { fcfa } from "@/lib/commission-caisse";
import { imprimer, htmlPreparation } from "@/lib/impression";
import BoutonEnvoyer from "@/components/admin/BoutonEnvoyer";
import { Message } from "./Etats";
import { messageEcriture } from "@/lib/message-erreur";

const INPUT =
  "w-full rounded-xl border border-[#0F7C55]/25 bg-white px-3.5 py-2.5 text-[#12231C] placeholder:text-[#9BB0A6] outline-none focus:border-[#0F7C55] focus:ring-2 focus:ring-[#0F7C55]/20 transition";

const VIDE = { libelle: "", detail: "", responsable: "", echeance: "", budget: "" };
const nb = (v: string) => parseInt(String(v).replace(/\D+/g, ""), 10) || 0;

const dateFr = (d: string) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long" }) : "";

/** Couleurs d'état. Le bloqué se voit de loin : c'est celui qui fait rater
 *  une journée, et il doit sauter aux yeux avant les autres. */
const TEINTE: Record<StatutTache, string> = {
  bloque: "bg-red-100 text-red-700",
  en_cours: "bg-[#D4AF37]/20 text-[#8A6A08]",
  a_faire: "bg-[#F8F5EF] text-[#5C7268]",
  fait: "bg-[#0F7C55]/12 text-[#0F7C55]",
};

/** Préparation d'une journée : qui fait quoi, pour quand, avec quel budget. */
export default function PreparationCommission({
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
  const [taches, setTaches] = useState<Tache[]>([]);
  const [f, setF] = useState(VIDE);
  const [ouvert, setOuvert] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!pret) return;
    return subscribeTaches(slug, setTaches, (e) =>
      setErreur(
        /permission/i.test(e.message)
          ? "Accès refusé. Vérifiez que les règles Firestore publiées sont à jour."
          : "Préparation indisponible pour le moment."
      )
    );
  }, [slug, pret]);

  const bilan = useMemo(() => bilanPreparation(taches), [taches]);

  async function ajouter(e: React.FormEvent) {
    e.preventDefault();
    const membre = membres.find((m) => m.nom === f.responsable);
    try {
      await ajouterTache(
        slug,
        {
          libelle: f.libelle,
          detail: f.detail,
          responsable: f.responsable,
          responsableTelephone: membre?.telephone ?? "",
          echeance: f.echeance,
          budget: nb(f.budget),
        },
        signature
      );
      setF(VIDE);
      setOuvert(false);
      setErreur("");
    } catch (err) {
      setErreur(messageEcriture(err, "l'enregistrement"));
    }
  }

  return (
    <div className="space-y-5">
      {/* ── Où en est-on ──────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#0F7C55]/15 bg-gradient-to-br from-[#0F7C55]/[.07] to-[#D4AF37]/[.10] p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#5C7268]">
            Avancement de la préparation
          </p>
          <p className="font-display text-2xl font-black text-[#0F7C55] tabular-nums">
            {bilan.avancement} %
          </p>
        </div>
        <div className="h-2.5 rounded-full bg-white/70 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0F7C55] to-[#D4AF37] transition-all"
            style={{ width: `${bilan.avancement}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[#5C7268]">
          {bilan.faites} tâche(s) faite(s) sur {bilan.total}
          {bilan.bloquees > 0 && (
            <span className="text-red-700 font-bold"> · {bilan.bloquees} bloquée(s)</span>
          )}
          {bilan.enRetard > 0 && (
            <span className="text-[#B8860B] font-bold"> · {bilan.enRetard} en retard</span>
          )}
        </p>

        <div className="mt-4 pt-4 border-t border-[#0F7C55]/10 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-sm font-bold text-[#5C7268] tabular-nums">{fcfa(bilan.budget)}</p>
            <p className="text-[11px] text-[#5C7268]">budget prévu</p>
          </div>
          <div>
            <p className="text-sm font-bold text-[#B8860B] tabular-nums">{fcfa(bilan.depense)}</p>
            <p className="text-[11px] text-[#5C7268]">déjà dépensé</p>
          </div>
          <div>
            <p
              className={`text-sm font-bold tabular-nums ${
                bilan.ecart >= 0 ? "text-[#0F7C55]" : "text-red-600"
              }`}
            >
              {bilan.ecart >= 0 ? "" : "− "}
              {fcfa(Math.abs(bilan.ecart))}
            </p>
            <p className="text-[11px] text-[#5C7268]">
              {bilan.ecart >= 0 ? "de marge" : "de dépassement"}
            </p>
          </div>
        </div>
      </section>

      {erreur && (
        <Message ton="erreur">{erreur}</Message>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setOuvert((v) => !v)}
          className="inline-flex items-center gap-2 bg-[#0F7C55] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#0c6444] transition"
        >
          <FaPlus /> {ouvert ? "Fermer" : "Ajouter une tâche"}
        </button>
        {taches.length > 0 && (
          <>
            <button
              onClick={() => imprimer(htmlPreparation(taches, nomCommission))}
              className="inline-flex items-center gap-2 border-2 border-[#0F7C55] text-[#0F7C55] px-5 py-2.5 rounded-xl font-bold hover:bg-[#0F7C55]/5 transition"
            >
              <FaPrint /> Imprimer la feuille de route
            </button>
            <BoutonEnvoyer
              html={() => htmlPreparation(taches, nomCommission)}
              titre={`Feuille de route — ${nomCommission}`}
              message={`Feuille de route de la commission ${nomCommission}.`}
            />
          </>
        )}
      </div>

      {/* ── Nouvelle tâche ────────────────────────────────────────────── */}
      {ouvert && (
        <form onSubmit={ajouter} className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5 sm:p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block sm:col-span-2">
              <span className="block text-sm font-semibold text-[#082F22] mb-1.5">
                Ce qu&apos;il faut faire
              </span>
              <input
                value={f.libelle}
                onChange={(e) => setF({ ...f, libelle: e.target.value })}
                className={INPUT}
                placeholder="Louer la sonorisation, monter les tentes, prévoir le repas…"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-[#082F22] mb-1.5">
                Qui s&apos;en charge
              </span>
              <input
                list="membres-commission"
                value={f.responsable}
                onChange={(e) => setF({ ...f, responsable: e.target.value })}
                className={INPUT}
                placeholder="Nom du responsable"
              />
              {/* Un membre de la commission se choisit dans la liste ; on peut
                  aussi écrire un nom libre — tout le monde n'y est pas inscrit. */}
              <datalist id="membres-commission">
                {membres.map((m) => (
                  <option key={m.id} value={m.nom} />
                ))}
              </datalist>
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-[#082F22] mb-1.5">
                Pour quand <span className="font-normal text-[#9BB0A6]">(facultatif)</span>
              </span>
              <input
                type="date"
                value={f.echeance}
                onChange={(e) => setF({ ...f, echeance: e.target.value })}
                className={INPUT}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-[#082F22] mb-1.5">
                Budget prévu (FCFA)
              </span>
              <input
                inputMode="numeric"
                value={f.budget}
                onChange={(e) => setF({ ...f, budget: e.target.value })}
                className={`${INPUT} tabular-nums`}
                placeholder="Ex. 75000"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-[#082F22] mb-1.5">
                Précisions <span className="font-normal text-[#9BB0A6]">(facultatif)</span>
              </span>
              <input
                value={f.detail}
                onChange={(e) => setF({ ...f, detail: e.target.value })}
                className={INPUT}
                placeholder="Fournisseur, lieu, contraintes…"
              />
            </label>
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-[#0F7C55] text-white font-bold py-3.5 rounded-xl hover:bg-[#0c6444] transition"
          >
            Ajouter à la feuille de route
          </button>
        </form>
      )}

      {/* ── La feuille de route ───────────────────────────────────────── */}
      {taches.length === 0 ? (
        <p className="flex items-start gap-2 rounded-2xl border border-[#0F7C55]/12 bg-white p-6 text-sm text-[#5C7268] leading-6">
          <FaCircleInfo className="flex-none mt-1 text-[#9BB0A6]" />
          <span>
            Rien n&apos;est encore inscrit. Ajoutez ce qu&apos;il faut préparer :
            la sonorisation, les tentes, le transport des invités, le repas — chacun
            avec son responsable et son budget.
          </span>
        </p>
      ) : (
        <div className="space-y-2.5">
          {taches.map((t) => {
            const retard = estEnRetard(t);
            return (
              <article
                key={t.id}
                className={`rounded-2xl border bg-white p-4 sm:p-5 ${
                  t.statut === "bloque"
                    ? "border-red-300"
                    : retard
                      ? "border-[#D4AF37]/50"
                      : "border-[#0F7C55]/12"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-semibold text-[#082F22] ${
                        t.statut === "fait" ? "line-through text-[#9BB0A6]" : ""
                      }`}
                    >
                      {t.libelle}
                    </p>
                    {t.detail && <p className="text-xs text-[#5C7268] mt-1">{t.detail}</p>}
                    <p className="text-xs text-[#9BB0A6] mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      {t.responsable && <span>{t.responsable}</span>}
                      {t.echeance && (
                        <span className={retard ? "text-[#B8860B] font-bold" : ""}>
                          {retard && <FaClock className="inline text-[10px] mb-0.5 mr-1" />}
                          {dateFr(t.echeance)}
                          {retard && " — dépassée"}
                        </span>
                      )}
                      {t.budget > 0 && <span>Prévu {fcfa(t.budget)}</span>}
                      {t.depense > 0 && (
                        <span className={t.depense > t.budget ? "text-red-600 font-bold" : ""}>
                          Dépensé {fcfa(t.depense)}
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className={`flex-none text-[11px] font-bold px-2.5 py-1 rounded-lg ${TEINTE[t.statut]}`}
                  >
                    {LIBELLE_TACHE[t.statut]}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-[#0F7C55]/8 flex flex-wrap items-center gap-2">
                  <select
                    value={t.statut}
                    onChange={(e) => modifierTache(t.id, { statut: e.target.value as StatutTache })}
                    className="rounded-lg border border-[#0F7C55]/25 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#082F22]"
                    aria-label="État de la tâche"
                  >
                    {ORDRE_STATUT.map((s) => (
                      <option key={s} value={s}>
                        {LIBELLE_TACHE[s]}
                      </option>
                    ))}
                  </select>

                  <label className="inline-flex items-center gap-1.5 text-xs text-[#5C7268]">
                    Dépensé
                    <input
                      inputMode="numeric"
                      defaultValue={t.depense || ""}
                      onBlur={(e) => {
                        const v = nb(e.target.value);
                        if (v !== t.depense) modifierTache(t.id, { depense: v });
                      }}
                      className="w-24 rounded-lg border border-[#0F7C55]/25 px-2 py-1.5 text-right tabular-nums"
                      placeholder="0"
                    />
                  </label>

                  {t.responsableTelephone && (
                    <a
                      href={`https://wa.me/${t.responsableTelephone.replace(/\D+/g, "")}?text=${encodeURIComponent(
                        texteRappel(t, nomCommission)
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#0F7C55] px-2.5 py-1.5 rounded-lg text-xs font-bold transition"
                    >
                      <FaWhatsapp /> Rappeler
                    </a>
                  )}

                  <button
                    onClick={() => {
                      if (!confirm(`Retirer « ${t.libelle} » de la feuille de route ?`)) return;
                      supprimerTache(t.id);
                    }}
                    aria-label="Supprimer cette tâche"
                    className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="flex items-start gap-2 text-xs text-[#5C7268] leading-5">
        <FaCircleInfo className="flex-none mt-0.5" />
        Le budget indiqué ici est <b>prévisionnel</b> : il ne touche pas la caisse.
        Quand l&apos;argent sort réellement, enregistrez la dépense depuis
        l&apos;onglet <b>Caisse</b> — c&apos;est elle qui fait foi.
      </p>
    </div>
  );
}
