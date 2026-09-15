"use client";

// Le tableau de bord d'un responsable de commission.
//
// POURQUOI IL EXISTE. L'accueil de l'espace d'administration montrait les
// memes quatre chiffres a tout le monde : membres actifs, recettes du mois,
// comptes admin, courbe des inscriptions. Un responsable de commission n'a
// le droit de lire AUCUNE de ces donnees — les regles Firestore les lui
// refusent, et le code avalait le refus en silence. Il arrivait donc sur
// quatre cartes a zero, une courbe vide, « Aucun membre pour l'instant » et
// pas un seul raccourci. Le premier ecran de son espace ne lui disait rien.
//
// Celui-ci ne montre que ce qui le concerne, et d'abord CE QU'IL DOIT FAIRE :
// un versement a accuser, un dossier a transmettre. Le reste vient apres.

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaFolderOpen,
  FaMoneyBillTransfer,
  FaBell,
  FaArrowRight,
  FaCircleCheck,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { commissionNom } from "@/lib/commissions";
import { subscribeDossier, LIBELLE_STATUT, type StatutDossier } from "@/lib/commission-dossier";
import { subscribeVersementsRecus, type Transfert } from "@/lib/commission-transferts";
import { subscribeMesNotifications } from "@/lib/notifications-flux";
import { fcfa } from "@/lib/commission-caisse";

/** Ce qui attend le responsable, dans l'ordre ou il doit s'en occuper. */
type Devoir = {
  cle: string;
  titre: string;
  detail: string;
  lien: string;
  urgent: boolean;
};

export default function TableauCommission({
  slug,
  uid,
  raccourcis,
}: {
  slug: string;
  uid: string;
  /** Les outils de sa commission, tels que le menu les lui montre deja. */
  raccourcis: { href: string; label: string }[];
}) {
  const [statut, setStatut] = useState<StatutDossier | null>(null);
  const [versements, setVersements] = useState<Transfert[] | null>(null);
  const [nonLues, setNonLues] = useState(0);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!slug) return;
    return subscribeDossier(
      slug,
      (d) => setStatut(d.statut),
      () => setErreur("Votre dossier n'a pas pu être lu.")
    );
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    // Abonnement FILTRE sur sa commission. Lire tout le registre serait refuse :
    // la regle s'evalue document par document, et un seul document interdit
    // fait tomber la requete entiere.
    return subscribeVersementsRecus(slug, setVersements, () => setVersements([]));
  }, [slug]);

  useEffect(() => {
    if (!uid) return;
    return subscribeMesNotifications(
      uid,
      slug || null,
      (n) => setNonLues(n.filter((x) => !x.read).length),
      () => setNonLues(0)
    );
  }, [uid, slug]);

  const attente = (versements ?? []).filter((t) => t.statut === "envoye");
  const sommeAttente = attente.reduce((s, t) => s + t.montant, 0);

  const devoirs: Devoir[] = [];
  if (attente.length > 0) {
    devoirs.push({
      cle: "versements",
      titre: `${attente.length} versement${attente.length > 1 ? "s" : ""} à confirmer`,
      detail: `${fcfa(sommeAttente)} remis par la trésorerie. La somme n'entre dans votre caisse qu'une fois la réception accusée.`,
      lien: "/admin/ma-commission?onglet=versements",
      urgent: true,
    });
  }
  if (statut === "brouillon") {
    devoirs.push({
      cle: "dossier",
      titre: "Votre dossier n'est pas transmis",
      detail: "Il reste visible de votre commission seule tant qu'il n'est pas envoyé au Secrétariat.",
      lien: "/admin/ma-commission?onglet=dossier",
      urgent: false,
    });
  }

  return (
    <>
      {erreur && (
        <div className="mb-5 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <FaTriangleExclamation className="mt-0.5 shrink-0" />
          <span>{erreur}</span>
        </div>
      )}

      {/* ── Ce qui vous attend ─────────────────────────────────────────── */}
      {devoirs.length > 0 ? (
        <div className="mb-8 space-y-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#B8860B]">
            Ce qui vous attend
          </p>
          {devoirs.map((d) => (
            <Link
              key={d.cle}
              href={d.lien}
              className={`group block rounded-2xl p-4 sm:p-5 shadow-sm transition ${
                d.urgent
                  ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] hover:brightness-105"
                  : "border border-[#0F7C55]/15 bg-white text-[#082F22] hover:border-[#0F7C55]/40"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                      d.urgent ? "bg-[#0F7C55] text-[#D4AF37]" : "bg-[#0F7C55]/10 text-[#0F7C55]"
                    }`}
                  >
                    {d.cle === "versements" ? <FaMoneyBillTransfer /> : <FaFolderOpen />}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-base sm:text-lg font-bold leading-tight">
                      {d.titre}
                    </p>
                    <p className={`mt-1 text-xs sm:text-sm leading-relaxed ${d.urgent ? "opacity-80" : "text-gray-600"}`}>
                      {d.detail}
                    </p>
                  </div>
                </div>
                <FaArrowRight className="shrink-0 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        versements !== null &&
        statut !== null && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
            <FaCircleCheck className="shrink-0 text-lg" />
            <span>
              Rien ne vous attend : aucun versement à confirmer, et votre dossier est{" "}
              {statut === "valide" ? "chez le Président" : "transmis au Secrétariat"}.
            </span>
          </div>
        )
      )}

      {/* ── L'état de la commission ────────────────────────────────────── */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <Carte
          icone={<FaFolderOpen />}
          titre="Votre dossier"
          valeur={statut === null ? "…" : LIBELLE_STATUT[statut].split(" — ")[0]}
          lien="/admin/ma-commission?onglet=dossier"
        />
        <Carte
          icone={<FaMoneyBillTransfer />}
          titre="Versements reçus"
          valeur={versements === null ? "…" : String(versements.filter((t) => t.statut === "recu").length)}
          detail={attente.length > 0 ? `${attente.length} en attente de votre accusé` : "Tous confirmés"}
          lien="/admin/ma-commission?onglet=versements"
        />
        <Carte
          icone={<FaBell />}
          titre="Notifications"
          valeur={String(nonLues)}
          detail={nonLues === 0 ? "Rien de nouveau" : "non lue" + (nonLues > 1 ? "s" : "")}
          lien="/notifications"
        />
      </div>

      {/* ── Ses outils ─────────────────────────────────────────────────── */}
      {raccourcis.length > 0 && (
        <div>
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#B8860B]">
            Vos outils — {commissionNom(slug)}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {raccourcis.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex items-center justify-between rounded-2xl border border-[#0F7C55]/15 bg-white px-5 py-4 font-semibold text-[#0F7C55] shadow-sm transition hover:border-[#0F7C55]/40"
              >
                {r.label}
                <FaArrowRight className="text-sm text-[#B8860B] transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function Carte({
  icone,
  titre,
  valeur,
  detail,
  lien,
}: {
  icone: React.ReactNode;
  titre: string;
  valeur: string;
  detail?: string;
  lien: string;
}) {
  return (
    <Link
      href={lien}
      className="rounded-2xl border border-[#0F7C55]/15 bg-white p-5 shadow-sm transition hover:border-[#0F7C55]/40"
    >
      <div className="flex items-center gap-2 text-[#B8860B]">
        <span className="text-sm">{icone}</span>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{titre}</p>
      </div>
      <p className="font-display mt-2 text-2xl font-bold leading-tight text-[#0F7C55]">{valeur}</p>
      {detail && <p className="mt-1 text-xs text-gray-500">{detail}</p>}
    </Link>
  );
}
