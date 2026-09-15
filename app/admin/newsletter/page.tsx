"use client";

// Les inscrits a la lettre d'information.
//
// Cet ecran n'existait pas : les gens s'inscrivaient depuis le pied de page,
// et personne n'avait jamais lu la liste. Elle est ici, lisible et
// exportable, pour que ces adresses servent enfin a quelque chose.

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { hasPermission } from "@/lib/admin-types";
import {
  type Abonne,
  dedoublonner,
  desinscrire,
  libelleSource,
  listerInscrits,
  telecharger,
  versCSV,
  versListeAdresses,
} from "@/lib/newsletter";
import {
  FaEnvelopeOpenText,
  FaFileCsv,
  FaListUl,
  FaTrash,
  FaCopy,
  FaCircleCheck,
  FaArrowsRotate,
} from "react-icons/fa6";
import { Message } from "@/components/admin/Etats";

const dateFr = (ms: number) =>
  new Date(ms).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/** Recherche insensible aux accents et a la casse. */
const sansAccent = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function AdminNewsletterPage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "articles.write");

  // null = pas encore charge. [] = charge, et vide. La distinction compte :
  // sans elle, l'ecran annonce « aucun inscrit » pendant le chargement.
  const [abonnes, setAbonnes] = useState<Abonne[] | null>(null);
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [recherche, setRecherche] = useState("");
  const [occupe, setOccupe] = useState(false);

  // Aucun setState AVANT le premier await : appelee depuis un effet, une mise
  // a jour synchrone declencherait un rendu en cascade (react-hooks).
  const charger = useCallback(async () => {
    try {
      const inscrits = await listerInscrits();
      setAbonnes(dedoublonner(inscrits));
      setErreur("");
    } catch (e) {
      console.error(e);
      setAbonnes([]);
      setErreur(
        "La liste n'a pas pu être lue. Ce compte doit avoir la permission « articles.write » (ou être administrateur), et la règle Firestore de la collection « newsletter » doit être publiée."
      );
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    // Le chargement est differe d'un tour de boucle. Appele directement dans
    // le corps de l'effet, il mettrait l'etat a jour pendant l'effet lui-meme
    // et declencherait un rendu en cascade. C'est le procede deja retenu par
    // les autres ecrans d'administration, avec le nettoyage en plus.
    const id = setTimeout(() => void charger(), 0);
    return () => clearTimeout(id);
  }, [user, charger]);

  const chargement = abonnes === null;
  const liste = useMemo(() => abonnes ?? [], [abonnes]);

  const visibles = useMemo(() => {
    const q = sansAccent(recherche.trim());
    if (!q) return liste;
    return liste.filter((a) => sansAccent(a.email).includes(q));
  }, [liste, recherche]);

  // Combien d'inscriptions en tout — doublons compris. L'ecart avec le nombre
  // d'adresses dit combien de personnes se sont inscrites plusieurs fois.
  const totalInscriptions = useMemo(
    () => liste.reduce((n, a) => n + a.documents.length, 0),
    [liste]
  );

  const parSource = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of liste) {
      for (const s of a.sources.length ? a.sources : [""]) {
        m.set(s, (m.get(s) ?? 0) + 1);
      }
    }
    return [...m.entries()].sort((x, y) => y[1] - x[1]);
  }, [liste]);

  function annoncer(txt: string) {
    setMessage(txt);
    setTimeout(() => setMessage(""), 4000);
  }

  function exporterCSV() {
    const jour = new Date().toISOString().slice(0, 10);
    telecharger(versCSV(visibles), `newsletter-ksn-${jour}.csv`, "text/csv");
    annoncer(`${visibles.length} adresse${visibles.length > 1 ? "s" : ""} exportée${visibles.length > 1 ? "s" : ""} en CSV.`);
  }

  function exporterAdresses() {
    const jour = new Date().toISOString().slice(0, 10);
    telecharger(versListeAdresses(visibles), `adresses-ksn-${jour}.txt`, "text/plain");
    annoncer("Liste d'adresses téléchargée.");
  }

  async function copierAdresses() {
    try {
      await navigator.clipboard.writeText(versListeAdresses(visibles));
      annoncer(`${visibles.length} adresse${visibles.length > 1 ? "s" : ""} copiée${visibles.length > 1 ? "s" : ""} — collez-les dans le champ Cci de votre messagerie.`);
    } catch {
      setErreur("Le navigateur a refusé l'accès au presse-papiers. Utilisez le téléchargement à la place.");
    }
  }

  async function retirer(a: Abonne) {
    const n = a.documents.length;
    const precision =
      n > 1 ? `\n\nCette adresse s'est inscrite ${n} fois : les ${n} enregistrements seront supprimés.` : "";
    if (!confirm(`Désinscrire ${a.email} ?${precision}\n\nCette suppression est définitive.`)) return;
    setOccupe(true);
    try {
      await desinscrire(a);
      setAbonnes((prev) => (prev ?? []).filter((x) => x.email !== a.email));
      annoncer(`${a.email} a été désinscrit.`);
    } catch (e) {
      console.error(e);
      setErreur("La désinscription a échoué. Vérifiez vos droits, puis réessayez.");
    } finally {
      setOccupe(false);
    }
  }

  return (
    <AdminShell>
      <header className="mb-8">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Commission Communication
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          Lettre d&apos;information
        </h1>
        <p className="mt-2 text-gray-600 text-sm max-w-2xl">
          Les adresses recueillies par le formulaire du pied de page du site.
          Exportez-les pour envoyer un message, ou copiez-les dans le champ Cci
          de votre messagerie.
        </p>
      </header>

      {message && (
        <div className="mb-5 flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          <FaCircleCheck className="mt-0.5 shrink-0" /> <span>{message}</span>
        </div>
      )}
      {erreur && (
        <Message ton="erreur" className="mb-5">{erreur}</Message>
      )}

      {/* ── Chiffres ───────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Carte
          titre="Adresses"
          valeur={chargement ? "—" : String(liste.length)}
          detail="Personnes distinctes"
        />
        <Carte
          titre="Inscriptions"
          valeur={chargement ? "—" : String(totalInscriptions)}
          detail={
            chargement
              ? ""
              : totalInscriptions > liste.length
                ? `${totalInscriptions - liste.length} réinscription${totalInscriptions - liste.length > 1 ? "s" : ""}`
                : "Aucun doublon"
          }
        />
        <Carte
          titre="Origine"
          valeur={chargement ? "—" : parSource.length ? String(parSource.length) : "0"}
          detail={
            chargement
              ? ""
              : parSource.map(([s, n]) => `${libelleSource(s)} : ${n}`).join(" · ") || "—"
          }
        />
      </div>

      {/* ── Barre d'actions ────────────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher une adresse…"
          className="flex-1 min-w-[12rem] rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0F7C55] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => void charger()}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <FaArrowsRotate /> Actualiser
        </button>
        <button
          type="button"
          onClick={() => void copierAdresses()}
          disabled={!visibles.length}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          <FaCopy /> Copier les adresses
        </button>
        <button
          type="button"
          onClick={exporterAdresses}
          disabled={!visibles.length}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          <FaListUl /> Liste .txt
        </button>
        <button
          type="button"
          onClick={exporterCSV}
          disabled={!visibles.length}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4AF37] px-4 py-2.5 text-sm font-bold text-[#0F7C55] shadow-md transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
        >
          <FaFileCsv /> Exporter en CSV
        </button>
      </div>

      {/* ── La liste ───────────────────────────────────────────────────── */}
      {chargement ? (
        <p className="py-16 text-center text-sm text-gray-500">Chargement de la liste…</p>
      ) : !liste.length ? (
        <Vide
          titre="Aucune inscription pour le moment"
          texte="Le formulaire du pied de page alimente cette liste. Dès qu'un visiteur s'inscrit, son adresse apparaît ici."
        />
      ) : !visibles.length ? (
        <Vide
          titre="Aucune adresse ne correspond"
          texte={`La recherche « ${recherche} » ne donne rien. Effacez-la pour revoir les ${liste.length} adresses.`}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[34rem] text-sm">
            <thead className="bg-[#F8F5EF] text-left text-xs uppercase tracking-wider text-[#082F22]">
              <tr>
                <th className="px-4 py-3 font-bold">Adresse</th>
                <th className="px-4 py-3 font-bold">Inscrit depuis</th>
                <th className="px-4 py-3 font-bold">Origine</th>
                {canEdit && <th className="px-4 py-3" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibles.map((a) => (
                <tr key={a.email} className="hover:bg-[#F8F5EF]/50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-[#082F22]">{a.email}</span>
                    {a.documents.length > 1 && (
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                        {a.documents.length} inscriptions
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {a.depuis === null ? (
                      <span className="text-gray-400">date inconnue</span>
                    ) : (
                      dateFr(a.depuis)
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {a.sources.length
                      ? a.sources.map(libelleSource).join(" + ")
                      : <span className="text-gray-400">origine inconnue</span>}
                  </td>
                  {canEdit && (
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => void retirer(a)}
                        disabled={occupe}
                        title={`Désinscrire ${a.email}`}
                        aria-label={`Désinscrire ${a.email}`}
                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!chargement && liste.length > 0 && (
        <p className="mt-4 text-xs text-gray-500">
          Les exports reprennent ce que la recherche affiche : {visibles.length} adresse
          {visibles.length > 1 ? "s" : ""} sur {liste.length}.
        </p>
      )}
    </AdminShell>
  );
}

function Carte({ titre, valeur, detail }: { titre: string; valeur: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{titre}</p>
      <p className="font-display mt-1 text-3xl font-bold text-[#0F7C55]">{valeur}</p>
      {detail && <p className="mt-1 text-xs text-gray-500">{detail}</p>}
    </div>
  );
}

function Vide({ titre, texte }: { titre: string; texte: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <FaEnvelopeOpenText className="mx-auto mb-3 text-3xl text-[#D4AF37]" />
      <p className="font-semibold text-[#082F22]">{titre}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">{texte}</p>
    </div>
  );
}
