"use client";

import { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaWhatsapp,
  FaCalendarDays,
  FaCircleCheck,
  FaTriangleExclamation,
  FaBell,
} from "react-icons/fa6";
import {
  type Reunion,
  type MembreCommission,
  subscribeReunions,
  creerReunion,
  supprimerReunion,
  marquerConvoque,
  texteConvocation,
  lienConvocation,
} from "@/lib/commission-membres";

const INPUT =
  "w-full rounded-xl border border-[#0F7C55]/25 bg-white px-3.5 py-2.5 text-[#12231C] placeholder:text-[#9BB0A6] outline-none focus:border-[#0F7C55] focus:ring-2 focus:ring-[#0F7C55]/20 transition";

const VIDE = { titre: "", date: "", heure: "", lieu: "", ordreDuJour: "" };

const dateFr = (d: string) =>
  d
    ? new Date(d).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

export default function ReunionsCommission({
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
  const [reunions, setReunions] = useState<Reunion[]>([]);
  const [f, setF] = useState(VIDE);
  const [ouvert, setOuvert] = useState(false);
  const [erreur, setErreur] = useState("");
  const [convocation, setConvocation] = useState<Reunion | null>(null);

  useEffect(() => {
    if (!pret) return;
    return subscribeReunions(slug, setReunions, (e) =>
      setErreur(
        /permission/i.test(e.message)
          ? "Accès aux réunions refusé. Vérifiez que les règles Firestore publiées sont à jour."
          : "Réunions indisponibles pour le moment."
      )
    );
  }, [slug, pret]);

  async function creer(e: React.FormEvent) {
    e.preventDefault();
    if (!f.date) return setErreur("Indiquez la date de la réunion.");
    try {
      await creerReunion(slug, f, signature);
      setF(VIDE);
      setOuvert(false);
      setErreur("");
    } catch {
      setErreur("Création impossible. Vérifiez votre connexion.");
    }
  }

  const avecTel = membres.filter((m) => m.telephone.trim());

  return (
    <div className="space-y-5">
      {erreur && (
        <p className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">
          <FaTriangleExclamation className="flex-none mt-0.5" />
          <span>{erreur}</span>
        </p>
      )}

      {/* ── Nouvelle réunion ────────────────────────────────────────── */}
      {!ouvert ? (
        <button
          onClick={() => setOuvert(true)}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#0F7C55] text-white font-bold py-3.5 rounded-xl hover:bg-[#0c6444] transition"
        >
          <FaPlus /> Programmer une réunion
        </button>
      ) : (
        <form onSubmit={creer} className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5 sm:p-6">
          <h3 className="font-bold text-[#082F22] mb-4">Nouvelle réunion</h3>
          <div className="space-y-4">
            <input
              value={f.titre}
              onChange={(e) => setF({ ...f, titre: e.target.value })}
              className={INPUT}
              placeholder="Objet de la réunion"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-semibold text-[#082F22] mb-1.5">Date</span>
                <input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} className={INPUT} />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-[#082F22] mb-1.5">Heure</span>
                <input type="time" value={f.heure} onChange={(e) => setF({ ...f, heure: e.target.value })} className={INPUT} />
              </label>
            </div>
            <input
              value={f.lieu}
              onChange={(e) => setF({ ...f, lieu: e.target.value })}
              className={INPUT}
              placeholder="Lieu"
            />
            <textarea
              value={f.ordreDuJour}
              onChange={(e) => setF({ ...f, ordreDuJour: e.target.value })}
              rows={4}
              className={INPUT}
              placeholder="Ordre du jour — un point par ligne"
            />
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

      {/* ── Liste ───────────────────────────────────────────────────── */}
      {reunions.length === 0 ? (
        <p className="rounded-2xl border border-[#0F7C55]/12 bg-white p-8 text-center text-sm text-[#9BB0A6] italic">
          Aucune réunion programmée.
        </p>
      ) : (
        <div className="space-y-3">
          {reunions.map((r) => (
            <article key={r.id} className="rounded-2xl border border-[#0F7C55]/12 bg-white p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <h3 className="font-bold text-[#082F22]">{r.titre}</h3>
                  <p className="mt-1 text-sm text-[#5C7268] flex items-center gap-2">
                    <FaCalendarDays className="text-xs" />
                    {dateFr(r.date)}
                    {r.heure && ` à ${r.heure}`}
                    {r.lieu && ` · ${r.lieu}`}
                  </p>
                  {r.convoqueLe && (
                    <p className="mt-1 text-xs text-[#0F7C55] font-semibold inline-flex items-center gap-1.5">
                      <FaCircleCheck /> Convocations envoyées le{" "}
                      {new Date(r.convoqueLe).toLocaleDateString("fr-FR")}
                      {r.convoquePar && ` par ${r.convoquePar}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConvocation(convocation?.id === r.id ? null : r)}
                    className="inline-flex items-center gap-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#0F7C55] px-3.5 py-2 rounded-lg text-xs font-bold transition"
                  >
                    <FaBell /> Convoquer
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Supprimer « ${r.titre} » ?`)) return;
                      await supprimerReunion(r.id);
                    }}
                    aria-label="Supprimer la réunion"
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>

              {r.ordreDuJour && (
                <p className="mt-3 pt-3 border-t border-[#0F7C55]/8 text-sm text-[#3A4D45] whitespace-pre-wrap leading-6">
                  {r.ordreDuJour}
                </p>
              )}

              {/* ── Envoi des convocations ─────────────────────────── */}
              {convocation?.id === r.id && (
                <div className="mt-4 pt-4 border-t border-[#0F7C55]/10">
                  <p className="text-sm text-[#5C7268] leading-6">
                    Les membres de la commission n&apos;ont pas de compte sur le site : la
                    convocation leur part par WhatsApp, déjà rédigée. Touchez chaque nom
                    pour l&apos;envoyer.
                  </p>

                  {avecTel.length === 0 ? (
                    <p className="mt-3 text-sm text-[#B8860B] font-semibold">
                      Aucun membre avec un numéro. Ajoutez-les dans l&apos;onglet Membres.
                    </p>
                  ) : (
                    <>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {avecTel.map((m) => (
                          <a
                            key={m.id}
                            href={lienConvocation(m.telephone, texteConvocation(r, nomCommission))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#25D366]/90 hover:bg-[#25D366] text-[#06291D] px-3 py-2 rounded-lg text-xs font-bold transition"
                          >
                            <FaWhatsapp /> {m.nom}
                          </a>
                        ))}
                      </div>

                      <button
                        onClick={async () => {
                          await marquerConvoque(r.id, signature);
                          setConvocation(null);
                        }}
                        className="mt-4 inline-flex items-center gap-2 border-2 border-[#0F7C55] text-[#0F7C55] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#0F7C55]/5 transition"
                      >
                        <FaCircleCheck /> J&apos;ai fini d&apos;envoyer
                      </button>
                    </>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
