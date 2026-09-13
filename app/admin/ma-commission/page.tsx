"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { COMMISSIONS, commissionNom, slugFromNom } from "@/lib/commissions";
import {
  type Dossier,
  type Ligne,
  type Cellule,
  type Proposition,
  nouvelId,
  nonVide,
  subscribeDossier,
  enregistrerDossier,
} from "@/lib/commission-dossier";
import {
  FaPlus,
  FaTrash,
  FaFloppyDisk,
  FaPrint,
  FaFilePdf,
  FaCircleCheck,
  FaTriangleExclamation,
} from "react-icons/fa6";

const AG = { date: "19 septembre 2026", lieu: "Tuuba Saam Kër Sëriñ Basiiru Ture" };

export default function MaCommissionPage() {
  const { user } = useAuth();
  const estAdmin = user?.role === "admin";
  const slugDuCompte = slugFromNom(user?.commission);

  // L'administrateur n'appartient a aucune commission : il choisit celle qu'il
  // veut consulter. Un responsable est rattache a la sienne, sans choix.
  const [slugChoisi, setSlugChoisi] = useState<string | null>(null);
  const slug = estAdmin ? slugChoisi ?? COMMISSIONS[0].slug : slugDuCompte;

  const [d, setD] = useState<Dossier | null>(null);
  const [etat, setEtat] = useState<"charge" | "modifie" | "enregistre" | "erreur">("charge");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!slug) return;
    // Pas de remise a zero ici : le changement de commission vide deja `d`
    // dans le gestionnaire du selecteur, et `d` demarre a null.
    return subscribeDossier(
      slug,
      (doc) => setD((actuel) => (actuel ? actuel : doc)),
      (e) =>
        setMessage(
          /permission/i.test(e.message)
            ? "Accès refusé par le serveur. Les règles Firestore doivent être publiées."
            : e.message
        )
    );
  }, [slug]);

  const maj = (patch: Partial<Dossier>) => {
    setD((p) => (p ? { ...p, ...patch } : p));
    setEtat("modifie");
  };

  async function enregistrer() {
    if (!d) return;
    try {
      await enregistrerDossier(d, user?.displayName || user?.email || "");
      setEtat("enregistre");
      setMessage("");
    } catch (e) {
      setEtat("erreur");
      setMessage(
        e instanceof Error && /permission/i.test(e.message)
          ? "Enregistrement refusé. Les règles Firestore doivent être publiées (voir firestore.rules)."
          : "Enregistrement impossible. Vérifiez votre connexion."
      );
    }
  }

  // ── Aucun rattachement : on le dit clairement plutot que d'afficher un
  //    dossier vide qui ne s'enregistrera jamais. ───────────────────────────
  if (!slug) {
    return (
      <AdminShell>
        <div className="max-w-2xl bg-white rounded-2xl border border-[#0F7C55]/12 p-8 text-center">
          <FaTriangleExclamation className="text-3xl text-[#C9A227] mx-auto" />
          <h1 className="mt-4 text-xl font-bold text-[#082F22]">
            Votre compte n&apos;est rattaché à aucune commission
          </h1>
          <p className="mt-3 text-[#5C7268] leading-7">
            Demandez à l&apos;administrateur de vous affecter une commission dans
            <b> Utilisateurs</b>. Votre espace de travail s&apos;ouvrira automatiquement
            ensuite.
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #impression, #impression * { visibility: visible !important; }
          #impression { position: absolute; inset: 0; width: 100%; padding: 0; }
          @page { size: A4 portrait; margin: 14mm; }
        }
      `}</style>

      {/* ── Entete ─────────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#082F22]">
            Espace de la commission
          </h1>
          <p className="mt-2 text-[#5C7268]">
            Dossier de travail pour l&apos;Assemblée Générale du {AG.date}. Vous pouvez le
            reprendre autant de fois que nécessaire.
          </p>
        </div>

        {estAdmin && (
          <label className="text-sm">
            <span className="block font-semibold text-[#082F22] mb-1.5">Commission</span>
            <select
              value={slug}
              onChange={(e) => {
                setSlugChoisi(e.target.value);
                setD(null);
              }}
              className="rounded-xl border border-[#0F7C55]/25 px-4 py-2.5 bg-white"
            >
              {COMMISSIONS.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.nom}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {message && (
        <p className="mb-5 flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm no-print">
          <FaTriangleExclamation className="flex-none mt-0.5" />
          <span>{message}</span>
        </p>
      )}

      {!d ? (
        <p className="text-[#5C7268]">Chargement du dossier…</p>
      ) : (
        <>
          {/* ── Barre d'actions ─────────────────────────────────────────── */}
          <div className="sticky top-0 z-20 -mx-4 px-4 py-3 mb-6 bg-[#F8F5EF]/95 backdrop-blur border-b border-[#0F7C55]/10 flex flex-wrap items-center gap-3 no-print">
            <button
              onClick={enregistrer}
              className="inline-flex items-center gap-2 bg-[#0F7C55] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#0c6444] transition"
            >
              <FaFloppyDisk /> Enregistrer
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 border-2 border-[#0F7C55] text-[#0F7C55] px-5 py-2.5 rounded-xl font-bold hover:bg-[#0F7C55]/5 transition"
            >
              <FaPrint /> Imprimer / PDF rempli
            </button>
            <a
              href="/fiches-ag-2026.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-[#D4AF37] text-[#B8860B] px-5 py-2.5 rounded-xl font-bold hover:bg-[#D4AF37]/10 transition"
            >
              <FaFilePdf /> Brouillon vierge
            </a>

            <span className="ml-auto text-sm flex items-center gap-2">
              {etat === "enregistre" && (
                <span className="text-[#0F7C55] font-semibold inline-flex items-center gap-1.5">
                  <FaCircleCheck /> Enregistré
                </span>
              )}
              {etat === "modifie" && (
                <span className="text-[#B8860B] font-semibold">Modifications non enregistrées</span>
              )}
              {d.updatedAt && etat !== "modifie" && (
                <span className="text-[#9BB0A6]">
                  Dernière mise à jour&nbsp;:{" "}
                  {new Date(d.updatedAt).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {d.updatedBy && ` — ${d.updatedBy}`}
                </span>
              )}
            </span>
          </div>

          {/* ── Saisie ──────────────────────────────────────────────────── */}
          <div className="space-y-5 max-w-4xl no-print">
            <Carte n={1} titre="Identification">
              <div className="grid sm:grid-cols-3 gap-4">
                <Champ label="Responsable">
                  <input
                    className={INPUT}
                    value={d.responsable}
                    onChange={(e) => maj({ responsable: e.target.value })}
                    placeholder="Prénom et nom"
                  />
                </Champ>
                <Champ label="Téléphone">
                  <input
                    className={INPUT}
                    value={d.telephone}
                    onChange={(e) => maj({ telephone: e.target.value })}
                    placeholder="+221 …"
                  />
                </Champ>
                <Champ label="Membres">
                  <input
                    className={INPUT}
                    inputMode="numeric"
                    value={d.membres}
                    onChange={(e) => maj({ membres: e.target.value })}
                    placeholder="Ex. 12"
                  />
                </Champ>
              </div>
            </Carte>

            <Carte n={2} titre="Compte rendu des activités">
              <Lignes
                lignes={d.activites}
                onChange={(activites) => maj({ activites })}
                placeholder="Une activité réalisée…"
                ajouter="Ajouter une activité"
              />
              <p className="mt-6 mb-2 text-sm font-semibold text-[#082F22]">
                Difficultés rencontrées
              </p>
              <Lignes
                lignes={d.difficultes}
                onChange={(difficultes) => maj({ difficultes })}
                placeholder="Une difficulté…"
                ajouter="Ajouter une difficulté"
              />
            </Carte>

            <Carte n={3} titre="Bilan provisoire — bisub Salaatu 'Alaa Nabii">
              <div className="grid sm:grid-cols-2 gap-4">
                <Champ label="Nombre de Salaatu réalisés">
                  <input
                    className={`${INPUT} font-bold text-lg tabular-nums`}
                    inputMode="numeric"
                    value={d.salaatu}
                    onChange={(e) => maj({ salaatu: e.target.value })}
                    placeholder="Ex. 250000"
                  />
                </Champ>
                <Champ label="Précisions sur le décompte">
                  <input
                    className={INPUT}
                    value={d.salaatuPrecisions}
                    onChange={(e) => maj({ salaatuPrecisions: e.target.value })}
                    placeholder="Période, méthode…"
                  />
                </Champ>
              </div>
            </Carte>

            <Carte n={4} titre="Mise au point sur les cellules">
              <Cellules cellules={d.cellules} onChange={(cellules) => maj({ cellules })} />
            </Carte>

            <Carte n={5} titre="Propositions pour la Journée Salaatu 'Alaa Nabii" accent>
              <Propositions
                propositions={d.propositions}
                onChange={(propositions) => maj({ propositions })}
              />
            </Carte>

            <Carte n={6} titre="Divers">
              <Lignes
                lignes={d.divers}
                onChange={(divers) => maj({ divers })}
                placeholder="Un point divers…"
                ajouter="Ajouter un point"
              />
            </Carte>
          </div>

          <ApercuImpression d={d} slug={slug} />
        </>
      )}
    </AdminShell>
  );
}

/* ═══ Listes dynamiques ═════════════════════════════════════════════════ */

function Lignes({
  lignes,
  onChange,
  placeholder,
  ajouter,
}: {
  lignes: Ligne[];
  onChange: (l: Ligne[]) => void;
  placeholder: string;
  ajouter: string;
}) {
  return (
    <div className="space-y-2.5">
      {lignes.map((l, i) => (
        <div key={l.id} className="flex items-start gap-2">
          <span className="flex-none w-7 h-11 flex items-center justify-center text-sm font-bold text-[#9BB0A6]">
            {i + 1}
          </span>
          <textarea
            rows={1}
            className={`${INPUT} min-h-11 resize-y`}
            value={l.texte}
            placeholder={placeholder}
            onChange={(e) =>
              onChange(lignes.map((x) => (x.id === l.id ? { ...x, texte: e.target.value } : x)))
            }
          />
          <BoutonSupprimer
            onClick={() =>
              onChange(
                lignes.length > 1
                  ? lignes.filter((x) => x.id !== l.id)
                  : [{ id: nouvelId(), texte: "" }]
              )
            }
          />
        </div>
      ))}
      <BoutonAjouter
        label={ajouter}
        onClick={() => onChange([...lignes, { id: nouvelId(), texte: "" }])}
      />
    </div>
  );
}

function Cellules({
  cellules,
  onChange,
}: {
  cellules: Cellule[];
  onChange: (c: Cellule[]) => void;
}) {
  const set = (id: string, patch: Partial<Cellule>) =>
    onChange(cellules.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  return (
    <div className="space-y-3">
      {cellules.map((c) => (
        <div key={c.id} className="flex items-start gap-2">
          <div className="flex-1 grid sm:grid-cols-[1fr_7rem_1.4fr] gap-2">
            <input
              className={INPUT}
              value={c.nom}
              placeholder="Nom de la cellule"
              onChange={(e) => set(c.id, { nom: e.target.value })}
            />
            <input
              className={INPUT}
              inputMode="numeric"
              value={c.effectif}
              placeholder="Effectif"
              onChange={(e) => set(c.id, { effectif: e.target.value })}
            />
            <input
              className={INPUT}
              value={c.etat}
              placeholder="État / besoins"
              onChange={(e) => set(c.id, { etat: e.target.value })}
            />
          </div>
          <BoutonSupprimer
            onClick={() =>
              onChange(
                cellules.length > 1
                  ? cellules.filter((x) => x.id !== c.id)
                  : [{ id: nouvelId(), nom: "", effectif: "", etat: "" }]
              )
            }
          />
        </div>
      ))}
      <BoutonAjouter
        label="Ajouter une cellule"
        onClick={() =>
          onChange([...cellules, { id: nouvelId(), nom: "", effectif: "", etat: "" }])
        }
      />
    </div>
  );
}

function Propositions({
  propositions,
  onChange,
}: {
  propositions: Proposition[];
  onChange: (p: Proposition[]) => void;
}) {
  const set = (id: string, patch: Partial<Proposition>) =>
    onChange(propositions.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  return (
    <div className="space-y-4">
      {propositions.map((p, i) => (
        <div
          key={p.id}
          className="rounded-xl border border-[#0F7C55]/15 bg-white/70 p-4 flex items-start gap-3"
        >
          <span className="flex-none w-7 h-7 rounded-full bg-[#D4AF37] text-[#082F22] text-sm font-bold flex items-center justify-center">
            {i + 1}
          </span>
          <div className="flex-1 space-y-2.5">
            <input
              className={`${INPUT} font-semibold`}
              value={p.titre}
              placeholder="Intitulé de la proposition"
              onChange={(e) => set(p.id, { titre: e.target.value })}
            />
            <textarea
              className={INPUT}
              rows={2}
              value={p.detail}
              placeholder="En quoi consiste-t-elle ? Qui la porte ? Pour quand ?"
              onChange={(e) => set(p.id, { detail: e.target.value })}
            />
            <input
              className={INPUT}
              value={p.moyens}
              placeholder="Moyens nécessaires (budget, matériel, personnes)"
              onChange={(e) => set(p.id, { moyens: e.target.value })}
            />
          </div>
          <BoutonSupprimer
            onClick={() =>
              onChange(
                propositions.length > 1
                  ? propositions.filter((x) => x.id !== p.id)
                  : [{ id: nouvelId(), titre: "", detail: "", moyens: "" }]
              )
            }
          />
        </div>
      ))}
      <BoutonAjouter
        label="Ajouter une proposition"
        onClick={() =>
          onChange([...propositions, { id: nouvelId(), titre: "", detail: "", moyens: "" }])
        }
      />
    </div>
  );
}

/* ═══ Apercu imprimable (masque a l'ecran) ══════════════════════════════ */

function ApercuImpression({ d, slug }: { d: Dossier; slug: string }) {
  const props = useMemo(() => d.propositions.filter((p) => nonVide(p.titre)), [d.propositions]);
  const cellules = useMemo(() => d.cellules.filter((c) => nonVide(c.nom)), [d.cellules]);

  return (
    <div id="impression" className="hidden print:block text-[#12231C]">
      <header className="text-center border-b-2 border-[#D4AF37] pb-4 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">
          Dahira Kippangog Salaatu &apos;Alaa Nabii
        </p>
        <h1 className="text-2xl font-bold mt-2">Commission {commissionNom(slug)}</h1>
        <p className="text-sm mt-1">
          Assemblée Générale du {AG.date} — {AG.lieu}
        </p>
        <p className="text-xs mt-2 text-[#5C7268]">
          Responsable : <b>{d.responsable || "—"}</b> · Téléphone : {d.telephone || "—"} ·
          Membres : {d.membres || "—"}
        </p>
      </header>

      <BlocImpr titre="1. Compte rendu des activités" items={d.activites.filter((l) => nonVide(l.texte)).map((l) => l.texte)} />
      <BlocImpr titre="Difficultés rencontrées" items={d.difficultes.filter((l) => nonVide(l.texte)).map((l) => l.texte)} />

      <section className="mb-5">
        <h2 className="font-bold text-[#082F22] border-b border-[#D4AF37]/50 pb-1 mb-2">
          2. Bilan provisoire — bisub Salaatu &apos;Alaa Nabii
        </h2>
        <p className="text-lg font-bold tabular-nums">{d.salaatu || "—"} Salaatu</p>
        {nonVide(d.salaatuPrecisions) && <p className="text-sm mt-1">{d.salaatuPrecisions}</p>}
      </section>

      <section className="mb-5">
        <h2 className="font-bold text-[#082F22] border-b border-[#D4AF37]/50 pb-1 mb-2">
          3. Mise au point sur les cellules
        </h2>
        {cellules.length === 0 ? (
          <p className="text-sm text-[#5C7268]">—</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left">
                <th className="border-b py-1">Cellule</th>
                <th className="border-b py-1 w-24">Effectif</th>
                <th className="border-b py-1">État / besoins</th>
              </tr>
            </thead>
            <tbody>
              {cellules.map((c) => (
                <tr key={c.id}>
                  <td className="border-b py-1">{c.nom}</td>
                  <td className="border-b py-1 tabular-nums">{c.effectif || "—"}</td>
                  <td className="border-b py-1">{c.etat || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="mb-5">
        <h2 className="font-bold text-[#082F22] border-b border-[#D4AF37]/50 pb-1 mb-2">
          4. Propositions pour la Journée Salaatu &apos;Alaa Nabii
        </h2>
        {props.length === 0 ? (
          <p className="text-sm text-[#5C7268]">—</p>
        ) : (
          <ol className="list-decimal ml-5 space-y-2 text-sm">
            {props.map((p) => (
              <li key={p.id}>
                <b>{p.titre}</b>
                {nonVide(p.detail) && <span> — {p.detail}</span>}
                {nonVide(p.moyens) && (
                  <span className="block text-[#5C7268]">Moyens : {p.moyens}</span>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      <BlocImpr titre="5. Divers" items={d.divers.filter((l) => nonVide(l.texte)).map((l) => l.texte)} />

      <footer className="mt-10 flex justify-between text-xs pt-10">
        <span className="border-t border-[#9BB0A6] pt-1 w-56 text-center">
          Responsable de la commission
        </span>
        <span className="border-t border-[#9BB0A6] pt-1 w-56 text-center">
          Secrétariat Général
        </span>
      </footer>
    </div>
  );
}

function BlocImpr({ titre, items }: { titre: string; items: string[] }) {
  return (
    <section className="mb-5">
      <h2 className="font-bold text-[#082F22] border-b border-[#D4AF37]/50 pb-1 mb-2">{titre}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-[#5C7268]">—</p>
      ) : (
        <ul className="list-disc ml-5 space-y-1 text-sm">
          {items.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ═══ Briques ═══════════════════════════════════════════════════════════ */

const INPUT =
  "w-full rounded-xl border border-[#0F7C55]/25 bg-white px-3.5 py-2.5 text-[#12231C] placeholder:text-[#9BB0A6] outline-none focus:border-[#0F7C55] focus:ring-2 focus:ring-[#0F7C55]/20 transition";

function Carte({
  n,
  titre,
  accent = false,
  children,
}: {
  n: number;
  titre: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border border-[#0F7C55]/12 p-5 sm:p-6 ${
        accent ? "bg-gradient-to-br from-[#0F7C55]/[.06] to-[#D4AF37]/[.09]" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="flex-none w-7 h-7 rounded-full bg-[#0F7C55] text-[#E8CE72] text-sm font-bold flex items-center justify-center">
          {n}
        </span>
        <h2 className="font-bold text-[#082F22]">{titre}</h2>
        <span className="flex-1 h-px bg-gradient-to-r from-[#D4AF37] to-transparent" />
      </div>
      {children}
    </section>
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

function BoutonAjouter({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-bold text-[#0F7C55] hover:bg-[#0F7C55]/8 px-3 py-2 rounded-lg transition"
    >
      <FaPlus className="text-xs" /> {label}
    </button>
  );
}

function BoutonSupprimer({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Supprimer cette ligne"
      className="flex-none w-11 h-11 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition"
    >
      <FaTrash />
    </button>
  );
}

