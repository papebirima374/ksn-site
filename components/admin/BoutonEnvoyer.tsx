"use client";

// « Envoyer sur WhatsApp » — le meme document que celui qui s'imprime, en
// piece jointe PDF.
//
// Ce bouton accompagne systematiquement un bouton « Imprimer » : tout ce qui
// se pose sur du papier peut aussi partir sur un telephone. Le President est
// aussi l'administrateur ; il voit tout depuis cet ecran, il n'a besoin que
// d'un moyen d'emporter la piece avec lui.
//
// IL DIT CE QUI S'EST PASSE. Selon l'appareil, deux choses tres differentes
// se produisent (cf. lib/partage-document.ts) : sur telephone le PDF part
// reellement en piece jointe ; sur ordinateur il est enregistre et WhatsApp
// s'ouvre a cote, le fichier restant a glisser dans la conversation. Laisser
// croire au second que c'est parti serait le meilleur moyen qu'un dossier
// n'arrive jamais.

import { useState } from "react";
import { FaWhatsapp, FaSpinner, FaCircleCheck, FaDownload, FaTriangleExclamation } from "react-icons/fa6";
import { envoyerSurWhatsApp } from "@/lib/partage-document";

type Etat = "repos" | "preparation" | "partage" | "telecharge" | "erreur";

export default function BoutonEnvoyer({
  html,
  titre,
  message,
  telephone = "",
  className = "",
  libelle = "Envoyer sur WhatsApp",
}: {
  /** Le document, produit par lib/impression.ts. Fabrique a la demande : on
   *  ne construit pas tous les documents de l'ecran au cas ou. */
  html: () => string;
  titre: string;
  message: string;
  telephone?: string;
  className?: string;
  /** Texte du bouton. A raccourcir la ou la place manque — dans une ligne de
   *  liste, « Envoyer sur WhatsApp » deborde et pousse le reste. */
  libelle?: string;
}) {
  const [etat, setEtat] = useState<Etat>("repos");
  const [detail, setDetail] = useState("");

  async function envoyer() {
    setEtat("preparation");
    setDetail("");
    try {
      const issue = await envoyerSurWhatsApp(html(), titre, message, telephone);
      setEtat(issue === "partage" ? "partage" : "telecharge");
      setTimeout(() => setEtat("repos"), 8000);
    } catch (e) {
      // L'utilisateur a ferme la feuille de partage : ce n'est pas une panne,
      // on revient simplement au repos sans rien lui reprocher.
      if (e instanceof DOMException && e.name === "AbortError") {
        setEtat("repos");
        return;
      }
      console.error(e);
      setEtat("erreur");
      setDetail(e instanceof Error ? e.message : "Erreur inconnue");
    }
  }

  const occupe = etat === "preparation";

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={() => void envoyer()}
        disabled={occupe}
        title={`Envoyer « ${titre} » sur WhatsApp, en PDF`}
        className={
          className ||
          "inline-flex items-center gap-2 rounded-xl border border-[#25D366] px-3 py-2 text-sm font-semibold text-[#128C7E] transition hover:bg-[#25D366]/10 disabled:opacity-50"
        }
      >
        {occupe ? <FaSpinner className="animate-spin" /> : <FaWhatsapp />}
        {occupe ? "Préparation du PDF…" : libelle}
      </button>

      {etat === "partage" && (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <FaCircleCheck /> Le PDF est joint — choisissez WhatsApp et le destinataire.
        </span>
      )}
      {etat === "telecharge" && (
        <span className="inline-flex items-start gap-1.5 text-xs font-medium text-[#B8860B]">
          <FaDownload className="mt-0.5 shrink-0" />
          <span>
            PDF enregistré et WhatsApp ouvert. <b>Il reste à glisser le fichier</b> dans la
            conversation : aucun site ne peut joindre une pièce à WhatsApp sur ordinateur.
          </span>
        </span>
      )}
      {etat === "erreur" && (
        <span className="inline-flex items-start gap-1.5 text-xs font-medium text-red-700">
          <FaTriangleExclamation className="mt-0.5 shrink-0" />
          <span>Le PDF n&apos;a pas pu être fabriqué{detail ? ` — ${detail}` : ""}. Utilisez « Imprimer » en attendant.</span>
        </span>
      )}
    </span>
  );
}
