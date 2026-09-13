"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { slugFromNom } from "@/lib/commissions";
import {
  type CompteRendu,
  type PointOdj,
  compteRenduVide,
  pointVide,
  subscribeComptesRendus,
  enregistrerCompteRendu,
  supprimerCompteRendu,
  nouvelId,
} from "@/lib/ag-reunion";
import {
  FaPlus,
  FaTrash,
  FaFloppyDisk,
  FaPrint,
  FaFileLines,
  FaCircleCheck,
  FaTriangleExclamation,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa6";

const INPUT =
  "w-full rounded-xl border border-[#0F7C55]/25 bg-white px-3.5 py-2.5 text-[#12231C] placeholder:text-[#9BB0A6] outline-none focus:border-[#0F7C55] focus:ring-2 focus:ring-[#0F7C55]/20 transition";

export default function CompteRenduPage() {
  const { user } = useAuth();
  const estAdmin = user?.role === "admin";
  const estSecretariat = slugFromNom(user?.commission) === "secretariat-administratif";
  const peutEcrire = estAdmin || estSecretariat;

  const [liste, setListe] = useState<CompteRendu[] | null>(null);
  const [cr, setCr] = useState<CompteRendu | null>(null);
  const [etat, setEtat] = useState<"vu" | "modifie" | "enregistre">("vu");
  const [message, setMessage] = useState("");

  useEffect(
    () =>
      subscribeComptesRendus(
        (l) => setListe(l),
        (e) =>
          setMessage(
            /permission/i.test(e.message)
              ? "Accès refusé. Les règles Firestore doivent être publiées."
              : e.message
          )
      ),
    []
  );

  const maj = (patch: Partial<CompteRendu>) => {
    setCr((p) => (p ? { ...p, ...patch } : p));
    setEtat("modifie");
  };

  const majPoint = (id: string, patch: Partial<PointOdj>) => {
    setCr((p) =>
      p ? { ...p, points: p.points.map((x) => (x.id === id ? { ...x, ...patch } : x)) } : p
    );
    setEtat("modifie");
  };

  async function enregistrer() {
    if (!cr) return;
    try {
      await enregistrerCompteRendu(cr, user?.displayName || user?.email || "");
      setEtat("enregistre");
      setMessage("");
    } catch (e) {
      setMessage(
        e instanceof Error && /permission/i.test(e.message)
          ? "Enregistrement refusé. Les règles Firestore doivent être publiées."
          : "Enregistrement impossible. Vérifiez votre connexion."
      );
    }
  }

  if (!peutEcrire && liste && liste.filter((c) => c.publie).length === 0) {
    return (
      <AdminShell>
        <div className="max-w-2xl bg-white rounded-2xl border border-[#0F7C55]/12 p-8 text-center">
          <FaFileLines className="text-3xl text-[#9BB0A6] mx-auto" />
          <h1 className="mt-4 text-xl font-bold text-[#082F22]">Aucun compte rendu publié</h1>
          <p className="mt-3 text-[#5C7268] leading-7">
            Les comptes rendus de réunion sont rédigés par le Secrétariat. Ils
            apparaîtront ici une fois publiés.
          </p>
        </div>
      </AdminShell>
    );
  }

  const visibles = (liste ?? []).filter((c) => peutEcrire || c.publie);

  return (
    <AdminShell>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #cr-impression, #cr-impression * { visibility: visible !important; }
          #cr-impression { position: absolute; inset: 0; width: 100%; }
          @page { size: A4 portrait; margin: 16mm; }
        }
      `}</style>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#082F22] flex items-center gap-3">
            <FaFileLines className="text-[#0F7C55]" /> Comptes rendus de réunion
          </h1>
          <p className="mt-2 text-[#5C7268]">
            {peutEcrire
              ? "Rédigez le compte rendu après l'assemblée, puis publiez-le pour les commissions."
              : "Comptes rendus publiés par le Secrétariat."}
          </p>
        </div>
        {peutEcrire && !cr && (
          <button
            onClick={() => {
              setCr(compteRenduVide(`reunion-${nouvelId()}`));
              setEtat("modifie");
            }}
            className="inline-flex items-center gap-2 bg-[#0F7C55] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#0c6444] transition"
          >
            <FaPlus /> Nouveau compte rendu
          </button>
        )}
      </div>

      {message && (
        <p className="mb-5 flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">
          <FaTriangleExclamation className="flex-none mt-0.5" />
          <span>{message}</span>
        </p>
      )}

      {/* ── Liste ─────────────────────────────────────────────────────── */}
      {!cr && (
        <div className="space-y-3">
          {liste === null ? (
            <p className="text-[#5C7268]">Chargement…</p>
          ) : visibles.length === 0 ? (
            <p className="bg-white rounded-2xl border border-[#0F7C55]/12 p-10 text-center text-[#5C7268]">
              Aucun compte rendu pour l&apos;instant.
            </p>
          ) : (
            visibles.map((c) => (
              <article
                key={c.id}
                className="bg-white rounded-2xl border border-[#0F7C55]/12 p-5 flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <h2 className="font-bold text-[#082F22]">{c.titre}</h2>
                  <p className="text-sm text-[#5C7268] mt-1">
                    {c.date} · {c.lieu}
                  </p>
                  <p className="text-xs mt-1">
                    {c.publie ? (
                      <span className="text-[#0F7C55] font-semibold inline-flex items-center gap-1.5">
                        <FaEye /> Publié pour les commissions
                      </span>
                    ) : (
                      <span className="text-[#B8860B] font-semibold inline-flex items-center gap-1.5">
                        <FaEyeSlash /> Brouillon — visible du Secrétariat seul
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCr(c);
                      setEtat("vu");
                    }}
                    className="text-sm font-semibold text-[#0F7C55] hover:underline px-3 py-2"
                  >
                    {peutEcrire ? "Ouvrir" : "Lire"}
                  </button>
                  {peutEcrire && (
                    <button
                      onClick={async () => {
                        if (!confirm(`Supprimer « ${c.titre} » ? Cette action est définitive.`))
                          return;
                        await supprimerCompteRendu(c.id);
                      }}
                      aria-label="Supprimer"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {/* ── Edition ───────────────────────────────────────────────────── */}
      {cr && (
        <>
          <div className="sticky top-0 z-20 -mx-4 px-4 py-3 mb-6 bg-[#F8F5EF]/95 backdrop-blur border-b border-[#0F7C55]/10 flex flex-wrap items-center gap-3 no-print">
            <button
              onClick={() => {
                setCr(null);
                setEtat("vu");
              }}
              className="text-sm font-semibold text-[#5C7268] hover:underline px-2"
            >
              ← Retour à la liste
            </button>
            {peutEcrire && (
              <button
                onClick={enregistrer}
                className="inline-flex items-center gap-2 bg-[#0F7C55] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#0c6444] transition"
              >
                <FaFloppyDisk /> Enregistrer
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 border-2 border-[#0F7C55] text-[#0F7C55] px-5 py-2.5 rounded-xl font-bold hover:bg-[#0F7C55]/5 transition"
            >
              <FaPrint /> Imprimer / PDF
            </button>
            {peutEcrire && (
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#082F22] cursor-pointer px-2">
                <input
                  type="checkbox"
                  checked={cr.publie}
                  onChange={(e) => maj({ publie: e.target.checked })}
                  className="w-4 h-4 accent-[#0F7C55]"
                />
                Publier pour les commissions
              </label>
            )}
            <span className="ml-auto text-sm">
              {etat === "enregistre" && (
                <span className="text-[#0F7C55] font-semibold inline-flex items-center gap-1.5">
                  <FaCircleCheck /> Enregistré
                </span>
              )}
              {etat === "modifie" && (
                <span className="text-[#B8860B] font-semibold">Non enregistré</span>
              )}
            </span>
          </div>

          <div className="space-y-5 max-w-4xl no-print">
            <section className="bg-white rounded-2xl border border-[#0F7C55]/12 p-5 sm:p-6">
              <h2 className="font-bold text-[#082F22] mb-5">Séance</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <L label="Intitulé">
                  <input className={INPUT} value={cr.titre} disabled={!peutEcrire}
                    onChange={(e) => maj({ titre: e.target.value })} />
                </L>
                <L label="Date">
                  <input type="date" className={INPUT} value={cr.date} disabled={!peutEcrire}
                    onChange={(e) => maj({ date: e.target.value })} />
                </L>
                <L label="Lieu">
                  <input className={INPUT} value={cr.lieu} disabled={!peutEcrire}
                    onChange={(e) => maj({ lieu: e.target.value })} />
                </L>
                <L label="Présidée par">
                  <input className={INPUT} value={cr.presidence} disabled={!peutEcrire}
                    placeholder="Nom" onChange={(e) => maj({ presidence: e.target.value })} />
                </L>
                <L label="Secrétaire de séance">
                  <input className={INPUT} value={cr.secretaire} disabled={!peutEcrire}
                    placeholder="Nom" onChange={(e) => maj({ secretaire: e.target.value })} />
                </L>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <L label="Présents">
                  <textarea className={INPUT} rows={3} value={cr.presents} disabled={!peutEcrire}
                    placeholder="Un nom par ligne…" onChange={(e) => maj({ presents: e.target.value })} />
                </L>
                <L label="Excusés / absents">
                  <textarea className={INPUT} rows={3} value={cr.excuses} disabled={!peutEcrire}
                    placeholder="Un nom par ligne…" onChange={(e) => maj({ excuses: e.target.value })} />
                </L>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-[#0F7C55]/12 p-5 sm:p-6">
              <h2 className="font-bold text-[#082F22] mb-5">Points de l&apos;ordre du jour</h2>
              <div className="space-y-4">
                {cr.points.map((pt, i) => (
                  <div key={pt.id} className="rounded-xl border border-[#0F7C55]/15 p-4 flex gap-3">
                    <span className="flex-none w-7 h-7 rounded-full bg-[#0F7C55] text-[#E8CE72] text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1 space-y-2.5">
                      <input className={`${INPUT} font-semibold`} value={pt.titre} disabled={!peutEcrire}
                        placeholder="Intitulé du point"
                        onChange={(e) => { majPoint(pt.id, { titre: e.target.value }); }} />
                      <textarea className={INPUT} rows={3} value={pt.resume} disabled={!peutEcrire}
                        placeholder="Ce qui a été dit, les échanges…"
                        onChange={(e) => { majPoint(pt.id, { resume: e.target.value }); }} />
                      <textarea className={INPUT} rows={2} value={pt.decisions} disabled={!peutEcrire}
                        placeholder="Décisions prises"
                        onChange={(e) => { majPoint(pt.id, { decisions: e.target.value }); }} />
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <input className={INPUT} value={pt.responsable} disabled={!peutEcrire}
                          placeholder="Chargé du suivi"
                          onChange={(e) => { majPoint(pt.id, { responsable: e.target.value }); }} />
                        <input className={INPUT} value={pt.echeance} disabled={!peutEcrire}
                          placeholder="Échéance"
                          onChange={(e) => { majPoint(pt.id, { echeance: e.target.value }); }} />
                      </div>
                    </div>
                    {peutEcrire && (
                      <button
                        onClick={() =>
                          maj({
                            points:
                              cr.points.length > 1
                                ? cr.points.filter((x) => x.id !== pt.id)
                                : [pointVide()],
                          })
                        }
                        aria-label="Supprimer ce point"
                        className="flex-none w-11 h-11 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {peutEcrire && (
                <button
                  onClick={() => maj({ points: [...cr.points, pointVide()] })}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0F7C55] hover:bg-[#0F7C55]/8 px-3 py-2 rounded-lg transition"
                >
                  <FaPlus className="text-xs" /> Ajouter un point
                </button>
              )}
            </section>

            <section className="bg-white rounded-2xl border border-[#0F7C55]/12 p-5 sm:p-6">
              <h2 className="font-bold text-[#082F22] mb-4">Observations générales</h2>
              <textarea className={INPUT} rows={4} value={cr.divers} disabled={!peutEcrire}
                placeholder="Annonces, remerciements, prochaine réunion…"
                onChange={(e) => maj({ divers: e.target.value })} />
            </section>
          </div>

          {/* ── Version imprimable ──────────────────────────────────────── */}
          <div id="cr-impression" className="hidden print:block text-[#12231C]">
            <header className="text-center border-b-2 border-[#D4AF37] pb-4 mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">
                Dahira Kippangog Salaatu &apos;Alaa Nabii
              </p>
              <h1 className="text-2xl font-bold mt-2">{cr.titre}</h1>
              <p className="text-sm mt-1">
                {cr.date} — {cr.lieu}
              </p>
            </header>

            <table className="w-full text-sm mb-5">
              <tbody>
                <Ligne k="Présidée par" v={cr.presidence} />
                <Ligne k="Secrétaire de séance" v={cr.secretaire} />
                <Ligne k="Présents" v={cr.presents} />
                <Ligne k="Excusés / absents" v={cr.excuses} />
              </tbody>
            </table>

            {cr.points.map((pt, i) => (
              <section key={pt.id} className="mb-5">
                <h2 className="font-bold text-[#082F22] border-b border-[#D4AF37]/50 pb-1 mb-2">
                  {i + 1}. {pt.titre || "—"}
                </h2>
                {pt.resume.trim() && <p className="text-sm whitespace-pre-wrap">{pt.resume}</p>}
                {pt.decisions.trim() && (
                  <p className="text-sm mt-2">
                    <b>Décisions : </b>
                    <span className="whitespace-pre-wrap">{pt.decisions}</span>
                  </p>
                )}
                {(pt.responsable.trim() || pt.echeance.trim()) && (
                  <p className="text-sm mt-1 text-[#5C7268]">
                    Suivi : {pt.responsable || "—"}
                    {pt.echeance && ` · Échéance : ${pt.echeance}`}
                  </p>
                )}
              </section>
            ))}

            {cr.divers.trim() && (
              <section className="mb-5">
                <h2 className="font-bold text-[#082F22] border-b border-[#D4AF37]/50 pb-1 mb-2">
                  Observations générales
                </h2>
                <p className="text-sm whitespace-pre-wrap">{cr.divers}</p>
              </section>
            )}

            <footer className="mt-12 flex justify-between text-xs pt-10">
              <span className="border-t border-[#9BB0A6] pt-1 w-56 text-center">Le Président</span>
              <span className="border-t border-[#9BB0A6] pt-1 w-56 text-center">
                Le Secrétaire de séance
              </span>
            </footer>
          </div>
        </>
      )}
    </AdminShell>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-[#082F22] mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Ligne({ k, v }: { k: string; v: string }) {
  if (!v?.trim()) return null;
  return (
    <tr>
      <td className="align-top py-1 pr-4 font-semibold w-48">{k}</td>
      <td className="align-top py-1 whitespace-pre-wrap">{v}</td>
    </tr>
  );
}
