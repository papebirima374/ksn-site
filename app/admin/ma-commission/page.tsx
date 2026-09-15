"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import {
  COMMISSIONS,
  commissionNom,
  slugFromNom,
  aBilanSalaatu,
  aModuleSocial,
  aModulePreparation,
  aCaissePropre,
  tientCaisseNationale,
} from "@/lib/commissions";
import {
  type Dossier,
  type Ligne,
  type Proposition,
  nouvelId,
  subscribeDossier,
  enregistrerDossier,
  transmettreDossier,
  LIBELLE_STATUT,
} from "@/lib/commission-dossier";
import FilCommission from "@/components/admin/FilCommission";
import CaisseCommission from "@/components/admin/CaisseCommission";
import MembresCommission from "@/components/admin/MembresCommission";
import ReunionsCommission from "@/components/admin/ReunionsCommission";
import ActivitesCommission from "@/components/admin/ActivitesCommission";
import AidesCommission from "@/components/admin/AidesCommission";
import VersementsCommission from "@/components/admin/VersementsCommission";
import PreparationCommission from "@/components/admin/PreparationCommission";
import {
  type MembreCommission,
  subscribeMembresCommission,
} from "@/lib/commission-membres";
import { htmlDossier, htmlFicheVierge, imprimer, AG } from "@/lib/impression";
import BoutonEnvoyer from "@/components/admin/BoutonEnvoyer";
import { type Ecriture, fcfa, soldeDe, totalPar, subscribeCaisse } from "@/lib/commission-caisse";
import {
  type Lot,
  type Aide,
  bilanActivites,
  totalAides,
  subscribeLots,
  subscribeAides,
} from "@/lib/commission-activites";
import {
  FaPlus,
  FaTrash,
  FaFloppyDisk,
  FaPrint,
  FaFilePdf,
  FaCircleCheck,
  FaTriangleExclamation,
  FaPaperPlane,
  FaLock,
  FaFileLines,
  FaUsers,
  FaWallet,
  FaCalendarDays,
  FaComments,
  FaMugSaucer,
  FaHandHoldingHeart,
  FaMoneyBillTransfer,
  FaListCheck,
} from "react-icons/fa6";

/** useSearchParams() force le rendu cote client de tout ce qui l'entoure
 *  jusqu'a la frontiere Suspense la plus proche (cf. la documentation de
 *  Next 16). Sans cette frontiere, la compilation echoue au prerendu. */
export default function MaCommissionPage() {
  return (
    <Suspense fallback={<Patientez />}>
      <EspaceCommission />
    </Suspense>
  );
}

function Patientez() {
  return (
    <div className="min-h-screen bg-[#082F22] flex flex-col items-center justify-center text-white gap-4">
      <div className="w-12 h-12 border-4 border-white/20 border-t-[#D4AF37] rounded-full animate-spin" />
      <p className="text-white/80 text-sm">Ouverture de votre espace…</p>
    </div>
  );
}

function EspaceCommission() {
  const { user } = useAuth();
  const estAdmin = user?.role === "admin";
  const slugDuCompte = slugFromNom(user?.commission);

  // L'administrateur n'appartient a aucune commission : il choisit celle qu'il
  // veut consulter. Un responsable est rattache a la sienne, sans choix.
  const [slugChoisi, setSlugChoisi] = useState<string | null>(null);
  const slug = estAdmin ? slugChoisi ?? COMMISSIONS[0].slug : slugDuCompte;

  const monRole = estAdmin
    ? "presidence"
    : slugDuCompte === "secretariat-administratif"
      ? "secretariat"
      : "commission";
  const signature = user?.displayName || user?.email || "";

  type Onglet =
    | "dossier"
    | "membres"
    | "caisse"
    | "versements"
    | "preparation"
    | "activites"
    | "aides"
    | "reunions"
    | "echanges";
  // Une notification renvoie vers l'onglet concerne (?onglet=versements) :
  // atterrir sur le dossier alors qu'on vient d'etre prevenu d'un versement
  // obligerait a chercher, et c'est exactement ce qu'une notification doit
  // eviter.
  const params = useSearchParams();
  const ongletDemande = params.get("onglet") as Onglet | null;
  const [onglet, setOnglet] = useState<Onglet>(ongletDemande ?? "dossier");

  // Un onglet absent pour cette commission (la Finance n'a pas de caisse) ne
  // doit pas laisser une page vide : on revient au dossier.
  const ongletDisponible = (o: Onglet, s: string): boolean =>
    o === "caisse" || o === "versements"
      ? aCaissePropre(s)
      : o === "activites" || o === "aides"
        ? aModuleSocial(s)
        : o === "preparation"
          ? aModulePreparation(s)
          : true;
  const ongletActif: Onglet = slug && ongletDisponible(onglet, slug) ? onglet : "dossier";

  // La liste des membres sert a trois onglets (caisse, membres, reunions) :
  // un seul abonnement, partage.
  const [membres, setMembres] = useState<MembreCommission[]>([]);
  const [erreurMembres, setErreurMembres] = useState("");

  // Chiffres repris dans le rapport transmis au Secretariat : le responsable
  // n'a pas a les recopier a la main.
  const [ecritures, setEcritures] = useState<Ecriture[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [aides, setAides] = useState<Aide[]>([]);

  const [d, setD] = useState<Dossier | null>(null);
  const [etat, setEtat] = useState<"charge" | "modifie" | "enregistre" | "erreur">("charge");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!slug || !user) return;
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
  }, [slug, user]);

  useEffect(() => {
    if (!slug || !user) return;
    return subscribeMembresCommission(slug, setMembres, (e) =>
      setErreurMembres(
        /permission/i.test(e.message)
          ? "Accès refusé. Vérifiez que les règles Firestore publiées sont à jour."
          : "Liste indisponible pour le moment."
      )
    );
  }, [slug, user]);

  useEffect(() => {
    if (!slug || !user || !aCaissePropre(slug)) return;
    return subscribeCaisse(slug, setEcritures);
  }, [slug, user]);

  useEffect(() => {
    if (!slug || !user || !aModuleSocial(slug)) return;
    const stop = [subscribeLots(slug, setLots), subscribeAides(slug, setAides)];
    return () => stop.forEach((f) => f());
  }, [slug, user]);

  /** Ce que le rapport emportera avec lui.
   *
   *  Rien pour la commission qui tient la caisse nationale : ses chiffres sont
   *  ceux du Dahira, ils vivent a la Tresorerie et n'ont pas a etre recopies
   *  dans un rapport de commission comme s'il s'agissait d'une caisse a part. */
  const resume = useMemo(() => {
    if (!slug || !aCaissePropre(slug)) return undefined;
    const b = bilanActivites(lots);
    return {
      solde: soldeDe(ecritures),
      entrees: totalPar(ecritures, "entree"),
      sorties: totalPar(ecritures, "sortie"),
      activites: aModuleSocial(slug) && b.lots > 0 ? b : undefined,
      aides: aides.length ? { total: totalAides(aides), nombre: aides.length } : undefined,
    };
  }, [slug, ecritures, lots, aides]);

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

  async function transmettre() {
    if (!d) return;
    if (etat === "modifie") {
      setMessage("Enregistrez vos modifications avant de transmettre.");
      return;
    }
    if (
      !confirm(
        "Transmettre ce dossier au Secrétariat ?\n\nIl restera modifiable : vous pourrez le compléter et le transmettre à nouveau."
      )
    )
      return;
    try {
      await transmettreDossier(d.commission, signature);
      setMessage("");
    } catch {
      setMessage("Transmission impossible. Vérifiez votre connexion.");
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
          {/* ── Onglets ─────────────────────────────────────────────────── */}
          <div className="mb-6 flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-white border border-[#0F7C55]/12 no-print">
            {(
              [
                ["dossier", "Dossier AG", <FaFileLines key="a" />],
                ["membres", "Membres", <FaUsers key="b" />],
                ...(aCaissePropre(slug)
                  ? ([
                      ["caisse", "Caisse", <FaWallet key="c" />],
                      ["versements", "Versements", <FaMoneyBillTransfer key="h" />],
                    ] as [Onglet, string, React.ReactNode][])
                  : []),
                ...(aModulePreparation(slug)
                  ? ([["preparation", "Préparation", <FaListCheck key="i" />]] as [
                      Onglet,
                      string,
                      React.ReactNode,
                    ][])
                  : []),
                ...(aModuleSocial(slug)
                  ? ([
                      ["activites", "Activités", <FaMugSaucer key="f" />],
                      ["aides", "Aides", <FaHandHoldingHeart key="g" />],
                    ] as [Onglet, string, React.ReactNode][])
                  : []),
                ["reunions", "Réunions", <FaCalendarDays key="d" />],
                ["echanges", "Échanges", <FaComments key="e" />],
              ] as [Onglet, string, React.ReactNode][]
            ).map(([cle, label, icone]) => (
              <button
                key={cle}
                onClick={() => setOnglet(cle)}
                className={`flex-1 min-w-[7.5rem] inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition ${
                  ongletActif === cle
                    ? "bg-[#0F7C55] text-white"
                    : "text-[#5C7268] hover:bg-[#0F7C55]/6"
                }`}
              >
                {icone} {label}
              </button>
            ))}
          </div>

          {/* ── Barre d'actions (dossier uniquement) ────────────────────── */}
          {ongletActif === "dossier" && (
          <div className="sticky top-0 z-20 -mx-4 px-4 py-3 mb-6 bg-[#F8F5EF]/95 backdrop-blur border-b border-[#0F7C55]/10 flex flex-wrap items-center gap-3 no-print">
            <button
              onClick={enregistrer}
              className="inline-flex items-center gap-2 bg-[#0F7C55] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#0c6444] transition"
            >
              <FaFloppyDisk /> Enregistrer
            </button>
            <button
              onClick={() => imprimer(htmlDossier(d, slug, resume))}
              className="inline-flex items-center gap-2 border-2 border-[#0F7C55] text-[#0F7C55] px-5 py-2.5 rounded-xl font-bold hover:bg-[#0F7C55]/5 transition"
            >
              <FaPrint /> Imprimer / PDF rempli
            </button>
            <BoutonEnvoyer
              html={() => htmlDossier(d, slug, resume)}
              titre={`Dossier — ${commissionNom(slug)}`}
              message={`Dossier de la commission ${commissionNom(slug)} — Assemblée du ${AG.date}.`}
            />
            <button
              onClick={transmettre}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#082F22] px-5 py-2.5 rounded-xl font-bold hover:brightness-105 transition"
            >
              <FaPaperPlane /> Transmettre au Secrétariat
            </button>
            <button
              onClick={() => imprimer(htmlFicheVierge(slug))}
              className="inline-flex items-center gap-2 border-2 border-[#D4AF37] text-[#B8860B] px-5 py-2.5 rounded-xl font-bold hover:bg-[#D4AF37]/10 transition"
            >
              <FaFilePdf /> Ma fiche vierge
            </button>

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
          )}

          {/* ── Ou en est le dossier ────────────────────────────────────── */}
          {ongletActif === "dossier" && (
          <div
            className={`mb-6 rounded-2xl border px-5 py-4 flex flex-wrap items-center gap-3 no-print ${
              d.statut === "valide"
                ? "bg-[#0F7C55]/8 border-[#0F7C55]/30"
                : d.statut === "transmis"
                  ? "bg-[#D4AF37]/12 border-[#D4AF37]/35"
                  : "bg-[#F8F5EF] border-[#0F7C55]/12"
            }`}
          >
            {d.statut === "brouillon" ? (
              <FaLock className="text-[#9BB0A6]" />
            ) : (
              <FaCircleCheck className={d.statut === "valide" ? "text-[#0F7C55]" : "text-[#B8860B]"} />
            )}
            <span className="text-sm font-semibold text-[#082F22]">
              {LIBELLE_STATUT[d.statut]}
            </span>
            {d.transmisAt && d.statut !== "brouillon" && (
              <span className="text-xs text-[#5C7268]">
                le{" "}
                {new Date(d.transmisAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                })}
                {d.transmisPar && ` par ${d.transmisPar}`}
              </span>
            )}
            {d.valideAt && d.statut === "valide" && (
              <span className="text-xs text-[#0F7C55] font-semibold">
                · remis au Président le{" "}
                {new Date(d.valideAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                })}
              </span>
            )}
          </div>

          )}

          {/* ── Saisie ──────────────────────────────────────────────────── */}
          {ongletActif === "dossier" && (
          <div className="space-y-5 max-w-4xl no-print">
            {tientCaisseNationale(slug) && (
              <section className="rounded-2xl border border-[#D4AF37]/35 bg-[#D4AF37]/[.08] p-5">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#B8860B]">
                  Cette commission n&apos;a pas de caisse à elle
                </p>
                <p className="mt-2 text-sm text-[#082F22] leading-6">
                  Le Dahira n&apos;a qu&apos;un seul compte : le <b>compte principal</b>.
                  C&apos;est vous qui le tenez. Les entrées, les dépenses et les
                  versements aux autres commissions se gèrent depuis la{" "}
                  <a href="/admin/finances" className="font-bold text-[#0F7C55] hover:underline">
                    Trésorerie du Dahira
                  </a>
                  .
                </p>
              </section>
            )}
            {resume && (ecritures.length > 0 || resume.activites || resume.aides) && (
              <section className="rounded-2xl border border-[#D4AF37]/35 bg-[#D4AF37]/[.08] p-5">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#B8860B]">
                  Repris automatiquement dans le rapport
                </p>
                <p className="mt-2 text-sm text-[#082F22] leading-6">
                  Caisse : solde <b className="tabular-nums">{fcfa(resume.solde)}</b> ·{" "}
                  {fcfa(resume.entrees)} entrés · {fcfa(resume.sorties)} sortis
                  {resume.activites && (
                    <>
                      <br />
                      Activités : {resume.activites.lots} lot(s) · marge{" "}
                      <b className="tabular-nums">{fcfa(resume.activites.marge)}</b>
                    </>
                  )}
                  {resume.aides && (
                    <>
                      <br />
                      Aides : {resume.aides.nombre} · {fcfa(resume.aides.total)}
                    </>
                  )}
                </p>
                <p className="mt-2 text-xs text-[#5C7268]">
                  Ces chiffres partent avec le rapport — rien à recopier.
                </p>
              </section>
            )}

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

            {aBilanSalaatu(slug) && (
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
            )}

            <Carte n={4} titre="Cellules — point à discuter">
              <p className="-mt-2 mb-4 text-sm text-[#5C7268] leading-6">
                Ce n&apos;est pas un recensement : chacun dit ici ce qu&apos;il pense des
                cellules, pour nourrir la discussion en assemblée.
              </p>
              <Lignes
                lignes={d.cellules}
                onChange={(cellules) => maj({ cellules })}
                placeholder="Ce que la commission en pense…"
                ajouter="Ajouter un avis"
              />
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
          )}

          {ongletActif === "membres" && (
            <div className="max-w-4xl">
              <MembresCommission
                slug={slug}
                membres={membres}
                signature={signature}
                erreur={erreurMembres}
              />
            </div>
          )}

          {ongletActif === "caisse" && aCaissePropre(slug) && (
            <div className="max-w-4xl">
              <CaisseCommission
                slug={slug}
                nomCommission={commissionNom(slug)}
                membres={membres}
                signature={signature}
                pret={!!user}
              />
            </div>
          )}

          {ongletActif === "versements" && aCaissePropre(slug) && (
            <div className="max-w-4xl">
              <VersementsCommission slug={slug} signature={signature} pret={!!user} />
            </div>
          )}

          {ongletActif === "preparation" && aModulePreparation(slug) && (
            <div className="max-w-4xl">
              <PreparationCommission
                slug={slug}
                nomCommission={commissionNom(slug)}
                membres={membres}
                signature={signature}
                pret={!!user}
              />
            </div>
          )}

          {ongletActif === "activites" && aModuleSocial(slug) && (
            <div className="max-w-4xl">
              <ActivitesCommission slug={slug} signature={signature} pret={!!user} />
            </div>
          )}

          {ongletActif === "aides" && aModuleSocial(slug) && (
            <div className="max-w-4xl">
              <AidesCommission slug={slug} signature={signature} pret={!!user} />
            </div>
          )}

          {ongletActif === "reunions" && (
            <div className="max-w-4xl">
              <ReunionsCommission
                slug={slug}
                nomCommission={commissionNom(slug)}
                membres={membres}
                signature={signature}
                pret={!!user}
              />
            </div>
          )}

          {ongletActif === "echanges" && (
            <div className="max-w-4xl">
              <FilCommission
                slug={slug}
                auteur={signature}
                role={monRole}
                peutSupprimer={estAdmin}
                pret={!!user}
              />
            </div>
          )}

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

