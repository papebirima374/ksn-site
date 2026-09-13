"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaCheck, FaCircleExclamation, FaPrint, FaFloppyDisk } from "react-icons/fa6";
import type { Commission } from "@/lib/commissions";
import { submitCommissionReport, MAX } from "@/lib/commission-reports";

type Champs = {
  responsable: string;
  telephone: string;
  membres: string;
  activites: string;
  difficultes: string;
  salaatu: string;
  salaatuPrecisions: string;
  cellulesActives: string;
  cellules: string;
  propositions: string;
  moyens: string;
  divers: string;
};

const VIDE: Champs = {
  responsable: "",
  telephone: "",
  membres: "",
  activites: "",
  difficultes: "",
  salaatu: "",
  salaatuPrecisions: "",
  cellulesActives: "",
  cellules: "",
  propositions: "",
  moyens: "",
  divers: "",
};

const nombre = (v: string): number | null => {
  const n = parseInt(v.replace(/\D+/g, ""), 10);
  return Number.isFinite(n) ? n : null;
};

export default function ReportForm({ commission }: { commission: Commission }) {
  const cleBrouillon = `ksn-rapport-${commission.slug}`;
  const [f, setF] = useState<Champs>(VIDE);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [brouillonRestaure, setBrouillonRestaure] = useState(false);
  const hautRef = useRef<HTMLDivElement>(null);

  // ── Brouillon local : une commission remplit rarement ce formulaire d'une
  //    traite, et une coupure de connexion ne doit pas effacer son travail.
  useEffect(() => {
    try {
      const brut = localStorage.getItem(cleBrouillon);
      if (brut) {
        // localStorage n'existe pas au rendu serveur : la restauration ne peut
        // donc se faire qu'apres le montage. Cas prevu par la regle (lecture
        // d'un systeme externe au navigateur), et sans cascade : l'effet ne
        // s'execute qu'une fois, a la premiere ouverture de la page.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setF({ ...VIDE, ...JSON.parse(brut) });
        setBrouillonRestaure(true);
      }
    } catch {
      /* stockage indisponible (navigation privee) : on continue sans brouillon */
    }
  }, [cleBrouillon]);

  useEffect(() => {
    if (reference) return;
    try {
      const vide = Object.values(f).every((v) => !v);
      if (!vide) localStorage.setItem(cleBrouillon, JSON.stringify(f));
    } catch {
      /* idem */
    }
  }, [f, cleBrouillon, reference]);

  const set = (k: keyof Champs) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);

    if (!f.responsable.trim()) return setErreur("Merci d'indiquer le nom du responsable.");
    if (!f.telephone.trim()) return setErreur("Merci d'indiquer un numéro de téléphone.");
    if (!f.activites.trim()) return setErreur("Le compte rendu des activités est obligatoire.");
    if (!f.propositions.trim())
      return setErreur("Merci de renseigner au moins une proposition pour la Journée Salaatu.");

    setEnvoi(true);
    try {
      const id = await submitCommissionReport({
        commission: commission.slug,
        responsable: f.responsable,
        telephone: f.telephone,
        membres: nombre(f.membres),
        activites: f.activites,
        difficultes: f.difficultes,
        salaatu: nombre(f.salaatu),
        salaatuPrecisions: f.salaatuPrecisions,
        cellulesActives: nombre(f.cellulesActives),
        cellules: f.cellules,
        propositions: f.propositions,
        moyens: f.moyens,
        divers: f.divers,
      });
      try {
        localStorage.removeItem(cleBrouillon);
      } catch {
        /* rien a nettoyer */
      }
      setReference(id.slice(0, 8).toUpperCase());
      hautRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      setErreur(
        err instanceof Error && /permission|insufficient/i.test(err.message)
          ? "L'envoi a été refusé par le serveur. Prévenez le secrétariat : les règles Firestore doivent être publiées."
          : "L'envoi a échoué. Vérifiez votre connexion et réessayez — votre saisie est conservée sur cet appareil."
      );
    } finally {
      setEnvoi(false);
    }
  }

  // ── Ecran de confirmation ─────────────────────────────────────────────
  if (reference) {
    return (
      <div ref={hautRef} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-24">
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#0F7C55] text-white flex items-center justify-center text-3xl">
            <FaCheck />
          </div>
          <h2 className="font-display mt-6 text-2xl sm:text-3xl font-bold text-[#082F22]">
            Rapport transmis
          </h2>
          <p className="mt-3 text-[#5C7268] leading-7">
            Le rapport de la commission <b>{commission.nom}</b> a bien été reçu par le
            secrétariat. Conservez ce numéro de référence :
          </p>
          <p className="mt-5 inline-block bg-[#F8F5EF] border-2 border-[#D4AF37] rounded-2xl px-6 py-3 font-mono text-xl font-bold tracking-widest text-[#082F22]">
            {reference}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 bg-[#0F7C55] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0c6444] transition"
            >
              <FaPrint /> Imprimer une copie
            </button>
            <Link
              href="/commissions"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#0F7C55] text-[#0F7C55] px-6 py-3 rounded-xl font-bold hover:bg-[#0F7C55]/5 transition"
            >
              Retour aux commissions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Formulaire ────────────────────────────────────────────────────────
  return (
    <div ref={hautRef} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      {brouillonRestaure && (
        <p className="mb-5 flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F1E7C9] rounded-xl px-4 py-3 text-sm">
          <FaFloppyDisk className="flex-shrink-0" />
          Un brouillon enregistré sur cet appareil a été restauré.
        </p>
      )}

      <form onSubmit={envoyer} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <Bloc n={1} titre="Identification">
          <Grille>
            <Champ label="Nom du responsable" requis>
              <input
                type="text"
                value={f.responsable}
                onChange={set("responsable")}
                maxLength={MAX.court}
                required
                className={INPUT}
                placeholder="Prénom et nom"
              />
            </Champ>
            <Champ label="Téléphone (WhatsApp)" requis>
              <input
                type="tel"
                value={f.telephone}
                onChange={set("telephone")}
                maxLength={MAX.court}
                required
                className={INPUT}
                placeholder="+221 ..."
              />
            </Champ>
          </Grille>
          <Champ label="Nombre de membres de la commission">
            <input
              type="text"
              inputMode="numeric"
              value={f.membres}
              onChange={set("membres")}
              className={INPUT}
              placeholder="Ex. 12"
            />
          </Champ>
        </Bloc>

        <Bloc n={2} titre="Compte rendu des activités">
          <Champ label="Activités réalisées depuis la dernière assemblée" requis>
            <textarea
              value={f.activites}
              onChange={set("activites")}
              maxLength={MAX.long}
              required
              rows={7}
              className={INPUT}
              placeholder="Décrivez les actions menées, les dates, les résultats obtenus…"
            />
          </Champ>
          <Champ label="Difficultés rencontrées">
            <textarea
              value={f.difficultes}
              onChange={set("difficultes")}
              maxLength={MAX.long}
              rows={4}
              className={INPUT}
              placeholder="Obstacles, manques, points de blocage…"
            />
          </Champ>
        </Bloc>

        <Bloc n={3} titre="Bilan provisoire" sous="bisub Salaatu 'Alaa Nabii">
          <Grille>
            <Champ label="Nombre de Salaatu réalisés">
              <input
                type="text"
                inputMode="numeric"
                value={f.salaatu}
                onChange={set("salaatu")}
                className={`${INPUT} font-bold text-lg tabular-nums`}
                placeholder="Ex. 250000"
              />
            </Champ>
            <Champ label="Nombre de cellules actives">
              <input
                type="text"
                inputMode="numeric"
                value={f.cellulesActives}
                onChange={set("cellulesActives")}
                className={INPUT}
                placeholder="Ex. 4"
              />
            </Champ>
          </Grille>
          <Champ label="Précisions sur le décompte">
            <textarea
              value={f.salaatuPrecisions}
              onChange={set("salaatuPrecisions")}
              maxLength={MAX.long}
              rows={3}
              className={INPUT}
              placeholder="Période couverte, méthode de comptage, part de chaque cellule…"
            />
          </Champ>
        </Bloc>

        <Bloc n={4} titre="Mise au point sur les cellules">
          <Champ label="État des cellules de la commission">
            <textarea
              value={f.cellules}
              onChange={set("cellules")}
              maxLength={MAX.long}
              rows={5}
              className={INPUT}
              placeholder="Effectifs, animation, cellules à créer ou à redynamiser, besoins remontés du terrain…"
            />
          </Champ>
        </Bloc>

        <Bloc
          n={5}
          titre="Propositions pour la Journée Salaatu 'Alaa Nabii"
          sous="à venir"
          accent
        >
          <Champ label="Propositions et actions de la commission" requis>
            <textarea
              value={f.propositions}
              onChange={set("propositions")}
              maxLength={MAX.long}
              required
              rows={7}
              className={INPUT}
              placeholder="Que propose votre commission pour la prochaine Journée ? Actions concrètes, programme, engagements chiffrés…"
            />
          </Champ>
          <Champ label="Moyens nécessaires">
            <textarea
              value={f.moyens}
              onChange={set("moyens")}
              maxLength={MAX.long}
              rows={4}
              className={INPUT}
              placeholder="Budget, matériel, personnes, appuis attendus des autres commissions…"
            />
          </Champ>
        </Bloc>

        <Bloc n={6} titre="Divers">
          <Champ label="Autres points à porter à l'assemblée">
            <textarea
              value={f.divers}
              onChange={set("divers")}
              maxLength={MAX.long}
              rows={4}
              className={INPUT}
              placeholder="Questions diverses, annonces, remerciements…"
            />
          </Champ>
        </Bloc>

        <div className="p-6 sm:p-8 bg-[#F8F5EF] border-t border-[#0F7C55]/10">
          {erreur && (
            <p className="mb-5 flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">
              <FaCircleExclamation className="flex-shrink-0 mt-0.5" />
              <span>{erreur}</span>
            </p>
          )}
          <button
            type="submit"
            disabled={envoi}
            className="w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#082F22] font-extrabold text-lg py-4 rounded-xl shadow-lg hover:brightness-105 active:scale-[.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {envoi ? "Envoi en cours…" : "Transmettre le rapport au secrétariat"}
          </button>
          <p className="mt-4 text-center text-xs text-[#5C7268] leading-6">
            Votre saisie est enregistrée automatiquement sur cet appareil.
            <br className="hidden sm:block" />
            Vous pouvez fermer cette page et revenir plus tard par le même lien.
          </p>
        </div>
      </form>
    </div>
  );
}

/* ── Petits blocs de presentation ──────────────────────────────────────── */

const INPUT =
  "w-full rounded-xl border border-[#0F7C55]/25 bg-white px-4 py-3 text-[#12231C] placeholder:text-[#9BB0A6] outline-none focus:border-[#0F7C55] focus:ring-2 focus:ring-[#0F7C55]/20 transition";

function Bloc({
  n,
  titre,
  sous,
  accent = false,
  children,
}: {
  n: number;
  titre: string;
  sous?: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`p-6 sm:p-8 border-b border-[#0F7C55]/10 ${
        accent ? "bg-gradient-to-br from-[#0F7C55]/[.06] to-[#D4AF37]/[.08]" : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="flex-none w-8 h-8 rounded-full bg-[#0F7C55] text-[#E8CE72] font-bold text-sm flex items-center justify-center">
          {n}
        </span>
        <h2 className="font-display text-lg sm:text-xl font-bold text-[#082F22]">
          {titre}
          {sous && <em className="not-italic font-medium text-[#5C7268] text-base"> — {sous}</em>}
        </h2>
        <span className="flex-1 h-px bg-gradient-to-r from-[#D4AF37] to-transparent" />
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Grille({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-5">{children}</div>;
}

function Champ({
  label,
  requis = false,
  children,
}: {
  label: string;
  requis?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-[#082F22] mb-2">
        {label}
        {requis && <span className="text-[#B8860B]"> *</span>}
      </span>
      {children}
    </label>
  );
}
