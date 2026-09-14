// Impression des documents de commission.
//
// POURQUOI UN DOCUMENT AUTONOME ?
// La premiere version masquait la page d'administration avec
// `body * { visibility: hidden }` et ne laissait voir qu'un bloc cache. Le
// resultat sortait sans en-tete : le bloc etait pris dans la mise en page de
// l'espace admin (positionnement, defilement, conteneurs), et ce que le
// navigateur imprimait ne correspondait pas a ce qu'on croyait.
//
// On construit donc un document HTML complet, ouvert dans une fenetre a lui.
// Aucun CSS de l'application ne s'y applique, l'en-tete officielle est la
// meme que sur les fiches papier, et le rendu est verifiable hors navigateur
// (scripts/test-impression.mjs).

import type { Dossier, StatutDossier } from "./commission-dossier";
import type { CompteRendu } from "./ag-reunion";
import type { CommissionReport } from "./commission-reports";
import type { Transfert } from "./commission-transferts";
import { bilanVersements, LIBELLE_TRANSFERT } from "./commission-transferts";
import type { Vente } from "./commission-ventes";
import type { Tache } from "./commission-taches";
import { LIBELLE_TACHE, bilanPreparation, estEnRetard } from "./commission-taches";
import type { Order } from "./admin-types";
import { montantEnLettres } from "./montant-lettres";
import { commissionNom, aBilanSalaatu } from "./commissions";

export const AG = {
  date: "19 septembre 2026",
  lieu: "Tuuba Saam Kër Sëriñ Basiiru Ture",
  tel: "+221 76 725 72 72",
};

/** Echappe le texte saisi : il finit dans du HTML, et rien ne garantit qu'il
 *  ne contient pas de chevrons. */
function e(v: string | number | null | undefined): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Retours a la ligne preserves. */
function multi(v: string): string {
  return e(v).replace(/\n/g, "<br>");
}

const vide = (t: string) => !t || !t.trim();

const STYLE = `
  @page { size: A4 portrait; margin: 0; }
  *{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    color:#12231C; background:#fff; -webkit-print-color-adjust:exact; print-color-adjust:exact;
  }
  /* Fond blanc explicite : la fenetre d'apercu a un fond sombre, et sans cela
     le document s'affiche delave avant meme d'etre imprime. */
  .page{ width:210mm; min-height:297mm; padding:0 0 18mm; margin:0 auto; background:#fff; }

  /* ── En-tete officielle ──────────────────────────────────────────── */
  .head{
    position:relative; overflow:hidden; text-align:center; color:#fff;
    background:linear-gradient(160deg,#06291D 0%,#082F22 45%,#0C5B3E 100%);
    padding:11mm 14mm 15mm;
  }
  .head:after{
    content:""; position:absolute; left:-8%; right:-8%; bottom:-13mm; height:24mm;
    background:#fff; border-radius:50% 50% 0 0; border-top:1.4mm solid #D4AF37;
  }
  .head .halo{position:absolute;width:64mm;height:64mm;border-radius:50%;
    background:radial-gradient(circle,rgba(212,175,55,.22),transparent 70%)}
  .halo.l{top:-22mm;left:-16mm}.halo.r{bottom:-14mm;right:-16mm}
  .crest{position:relative;z-index:2;width:24mm;height:24mm;margin:0 auto;display:block}
  .kicker{position:relative;z-index:2;margin-top:3.5mm;font-size:9.5px;font-weight:800;
    letter-spacing:.32em;text-transform:uppercase;color:#E8CE72}
  .head h1{position:relative;z-index:2;margin-top:2mm;font-size:26px;font-weight:900;
    font-family:Georgia,'Times New Roman',serif;
    background:linear-gradient(90deg,#B8860B,#E8CE72,#D4AF37);
    -webkit-background-clip:text;background-clip:text;color:transparent}
  .head .wolof{position:relative;z-index:2;margin-top:1.5mm;font-size:12.5px;font-weight:700;color:#EAF5EF}
  .head .meta{position:relative;z-index:2;margin-top:3.5mm;display:flex;justify-content:center;
    gap:5mm;flex-wrap:wrap;font-size:10px;color:#CFE4D9}
  .head .meta b{color:#fff}

  .ribbon{
    position:relative;z-index:3;margin:-4mm 14mm 0;padding:4.5mm 8mm;text-align:center;
    background:linear-gradient(90deg,#B8860B,#D4AF37,#B8860B);border-radius:3mm;
    box-shadow:0 3mm 8mm rgba(8,47,34,.2);
  }
  .ribbon small{display:block;font-size:8.5px;font-weight:800;letter-spacing:.28em;
    text-transform:uppercase;color:rgba(8,47,34,.72)}
  .ribbon strong{display:block;margin-top:.8mm;font-size:20px;font-weight:900;color:#06291D;
    font-family:Georgia,'Times New Roman',serif}

  /* ── Corps ───────────────────────────────────────────────────────── */
  .body{padding:8mm 14mm 0}
  .ident{display:flex;gap:6mm;margin-bottom:6mm;padding-bottom:4mm;border-bottom:.3mm solid #E2E9E5}
  .ident div{flex:1}
  .ident span{display:block;font-size:8px;font-weight:800;letter-spacing:.16em;
    text-transform:uppercase;color:#5C7268;margin-bottom:1mm}
  .ident b{font-size:12px;font-weight:700}

  .sec{margin-bottom:6mm;break-inside:avoid}
  .sec-t{display:flex;align-items:center;gap:3mm;margin-bottom:2.5mm}
  .sec-t i{flex:none;width:6.5mm;height:6.5mm;border-radius:50%;background:#0F7C55;color:#E8CE72;
    font-size:10px;font-weight:800;font-style:normal;display:flex;align-items:center;justify-content:center}
  .sec-t h2{font-size:12px;font-weight:800;color:#082F22}
  .sec-t h2 em{font-style:normal;font-weight:600;color:#5C7268;font-size:10.5px}
  .sec-t s{flex:1;height:.3mm;background:linear-gradient(90deg,#D4AF37,transparent);text-decoration:none}

  ol,ul{margin-left:6mm}
  li{font-size:11px;line-height:1.75;margin-bottom:1.5mm}
  p.txt{font-size:11px;line-height:1.75}
  .rien{font-size:11px;color:#9BB0A6;font-style:italic}

  .tally{border:.4mm solid #0F7C55;border-radius:2.5mm;padding:4mm 5mm;
    background:linear-gradient(135deg,rgba(15,124,85,.06),rgba(212,175,55,.09));
    display:flex;align-items:center;justify-content:space-between;gap:5mm}
  .tally span{font-size:10.5px;color:#082F22;font-weight:600}
  .tally b{font-size:20px;font-weight:900;color:#0F7C55}

  .prop{border-left:1mm solid #D4AF37;padding:1mm 0 1mm 4mm;margin-bottom:3.5mm;break-inside:avoid}
  .prop b{font-size:11.5px}
  .prop p{font-size:10.5px;line-height:1.7;color:#3A4D45;margin-top:.8mm}
  .prop u{display:block;font-size:10px;color:#5C7268;text-decoration:none;margin-top:.8mm}

  table{width:100%;border-collapse:collapse;font-size:10.5px}
  td{padding:1.2mm 0;vertical-align:top}
  td.k{width:42mm;font-weight:700;color:#082F22}

  .signs{display:flex;gap:12mm;margin-top:14mm;padding:0 14mm}
  .signs div{flex:1;text-align:center}
  .signs i{display:block;border-top:.3mm solid #9BB0A6;margin-bottom:1.5mm}
  .signs span{font-size:8.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#5C7268}

  .foot{margin-top:8mm;background:#06291D;color:#9FBFB1;padding:3mm 14mm;
    display:flex;justify-content:space-between;font-size:8.5px}
  .foot b{color:#D4AF37}

  /* ── Facture ─────────────────────────────────────────────────────── */
  .fact-tete{display:flex;gap:6mm;margin-bottom:6mm}
  .fact-tete > div{flex:1;border:.3mm solid #E2E9E5;border-radius:2.5mm;padding:3.5mm 4.5mm}
  .fact-tete h3{font-size:8px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;
    color:#5C7268;margin-bottom:1.5mm}
  .fact-tete p{font-size:10.5px;line-height:1.6}
  .fact-tete b{font-size:12px}
  .fact-num{background:linear-gradient(135deg,rgba(15,124,85,.07),rgba(212,175,55,.10));
    border-color:#D4AF37 !important}

  table.fact{width:100%;border-collapse:collapse;font-size:10.5px}
  table.fact th{background:#082F22;color:#E8CE72;font-size:8px;font-weight:800;
    letter-spacing:.12em;text-transform:uppercase;padding:2.5mm 3mm;text-align:left}
  table.fact th.n,table.fact td.n{text-align:right;white-space:nowrap}
  table.fact td{padding:2.4mm 3mm;border-bottom:.25mm solid #E2E9E5}
  table.fact tr:nth-child(even) td{background:#FAF8F4}
  table.fact thead{display:table-header-group}
  table.fact tr{break-inside:avoid}
  table.fact td.n{font-weight:700}
  table.fact tfoot td{border:0;padding-top:3mm;font-size:11px}
  table.fact tfoot tr.tot td{background:#0F7C55;color:#fff;font-size:13px;font-weight:900;
    padding:3.5mm 3mm}

  .lettres{margin-top:5mm;border-left:1mm solid #D4AF37;padding:2mm 0 2mm 4mm}
  .lettres span{display:block;font-size:8px;font-weight:800;letter-spacing:.16em;
    text-transform:uppercase;color:#5C7268}
  .lettres b{font-size:11px;font-weight:700;font-style:italic}

  .cachet{margin-top:6mm;display:flex;justify-content:flex-end}
  .cachet div{width:62mm;height:26mm;border:.4mm dashed #B9C9C1;border-radius:2.5mm;
    display:flex;align-items:flex-end;justify-content:center;padding-bottom:2mm}
  .cachet span{font-size:8px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;
    color:#9BB0A6}

  /* ── Registre : tableau de suivi, releve de versements ──────── */
  table.reg{width:100%;border-collapse:collapse;font-size:9.5px;margin-top:1mm}
  table.reg th{background:#082F22;color:#E8CE72;font-size:8px;font-weight:800;
    letter-spacing:.12em;text-transform:uppercase;padding:2.2mm 2.5mm;text-align:left}
  table.reg td{padding:2mm 2.5mm;border-bottom:.25mm solid #E2E9E5;vertical-align:top}
  table.reg tr:nth-child(even) td{background:#F8F5EF}
  /* Quand le registre passe sur une 2e feuille, les titres de colonnes la
     suivent, et aucune ligne n'est coupee en deux : sans cela, la seconde
     page est une suite de chiffres dont on ne sait plus ce qu'ils designent. */
  table.reg thead{display:table-header-group}
  table.reg tr{break-inside:avoid}
  table.reg td.n{width:26mm;text-align:right;font-weight:700;white-space:nowrap}
  table.reg tfoot td{background:#0F7C55;color:#fff;font-weight:800;border:0}
  .etat{display:inline-block;padding:.5mm 2mm;border-radius:1.5mm;font-size:8px;
    font-weight:800;letter-spacing:.04em;white-space:nowrap}
  .etat.ok{background:rgba(15,124,85,.15);color:#0A5C3F}
  .etat.att{background:rgba(212,175,55,.25);color:#7A5B06}
  .etat.non{background:#EDF1EF;color:#5C7268}

  /* Compteurs en bandeau, au-dessus d'un registre. */
  .cartes{display:flex;gap:4mm;margin-bottom:5mm}
  .cartes div{flex:1;border:.3mm solid #E2E9E5;border-radius:2.5mm;padding:3mm 4mm;
    background:linear-gradient(135deg,rgba(15,124,85,.05),rgba(212,175,55,.07))}
  .cartes span{display:block;font-size:7.5px;font-weight:800;letter-spacing:.14em;
    text-transform:uppercase;color:#5C7268}
  .cartes b{display:block;margin-top:1mm;font-size:16px;font-weight:900;color:#0F7C55}

  /* ── Fiche vierge : zones a remplir a la main ────────────────────── */
  .champs{display:flex;gap:6mm;margin-bottom:6mm}
  .champs div{flex:1}
  .champs span{display:block;font-size:8px;font-weight:800;letter-spacing:.16em;
    text-transform:uppercase;color:#5C7268;margin-bottom:1.5mm}
  .champs i{display:block;border-bottom:.35mm dotted #B9C9C1;height:7mm}
  .lignes{background-image:repeating-linear-gradient(to bottom,
    transparent 0, transparent 7.6mm, #B9C9C1 7.6mm, #B9C9C1 7.75mm)}
  .boite{border:.4mm solid #D4AF37;border-radius:2mm;height:15mm;
    display:flex;align-items:flex-end;justify-content:center;padding-bottom:2mm}
  .boite span{font-size:8px;font-weight:800;letter-spacing:.18em;
    text-transform:uppercase;color:#5C7268}

  /* Une fiche vierge doit tenir sur UNE feuille : hauteur verrouillee un
     poil sous 297mm (les arrondis suffisent a declencher une 2e page), pied
     epingle en bas.

     Les zones d'ecriture n'ont PAS de hauteur fixe : elles se PARTAGENT la
     place restante, chacune selon son poids. Avec des hauteurs figees, il
     fallait refaire le calcul a chaque section ajoutee — et quand la somme
     depassait, overflow:hidden coupait la derniere section EN SILENCE : la
     fiche sortait sans son cadre « Divers », et cela ne se voyait qu'une fois
     la feuille en main. Avec flex, il n'y a plus rien a calculer. */
  .page.fiche{height:296.5mm;min-height:0;padding:0;overflow:hidden;
    display:flex;flex-direction:column}
  .page.fiche .head{padding:9mm 14mm 13mm}
  .page.fiche .body{flex:1;min-height:0;padding:6mm 14mm 0;
    display:flex;flex-direction:column}
  .page.fiche .sec{flex:none;margin-bottom:4mm}
  /* Zone a remplir : elle s'etire, et ses lignes avec elle. */
  .page.fiche .sec.libre{display:flex;flex-direction:column;min-height:0;
    flex-shrink:0}
  .page.fiche .sec.libre .lignes{flex:1;min-height:9mm}
  .page.fiche .signs{flex:none;margin-top:4mm;padding-top:0}
  .page.fiche .foot{flex:none;margin-top:4mm}

  @media screen{ body{background:#33443D;padding:20px} .page{box-shadow:0 14px 40px rgba(0,0,0,.35)} }
`;

/** Bandeau de bas d'en-tete. Les pieces de l'assemblee annoncent la date et
 *  le lieu de l'assemblee ; une facture, elle, n'a rien a voir avec eux — elle
 *  porte les coordonnees du Dahira, comme toute piece commerciale. */
const META_AG = [
  ["\u{1F4C5}", AG.date],
  ["\u{1F4CD}", AG.lieu],
  ["\u{1F4DE}", AG.tel],
] as [string, string][];

const META_DAHIRA = [
  ["\u{1F4CD}", "Touba, Sénégal"],
  ["\u{1F4DE}", AG.tel],
  ["\u{1F310}", "salaatualaanabii.com"],
] as [string, string][];

function enTete(titre: string, sousTitre?: string, meta: [string, string][] = META_AG): string {
  return `
  <div class="head">
    <div class="halo l"></div><div class="halo r"></div>
    <img class="crest" src="/logo/ksn-logo.png" alt="Sceau KIPPAANGOG Salaatu 'Alaa Nabii">
    <div class="kicker">Dahira Kippangog Salaatu ’Alaa Nabii</div>
    <h1>${e(titre)}</h1>
    ${sousTitre ? `<div class="wolof">${e(sousTitre)}</div>` : ""}
    <div class="meta">
      ${meta.map(([icone, texte]) => `<span>${icone} <b>${e(texte)}</b></span>`).join("")}
    </div>
  </div>`;
}

const pied = (droite: string) => `
  <div class="foot">
    <span>KSN — Kippangog Salaatu ’Alaa Nabii · <b>salaatualaanabii.com</b></span>
    <span>${e(droite)}</span>
  </div>`;

const titreSection = (n: number, t: string, sous?: string) => `
  <div class="sec-t"><i>${n}</i><h2>${e(t)}${sous ? ` <em>— ${e(sous)}</em>` : ""}</h2><s></s></div>`;

const liste = (items: string[]) =>
  items.length
    ? `<ul>${items.map((t) => `<li>${multi(t)}</li>`).join("")}</ul>`
    : `<p class="rien">Rien de signalé.</p>`;

function document(titre: string, contenu: string, classe = ""): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
<title>${e(titre)}</title><style>${STYLE}</style></head>
<body><div class="page ${classe}">${contenu}</div></body></html>`;
}

/* ═══ Dossier d'une commission ═════════════════════════════════════════ */

/** Chiffres repris automatiquement de la caisse et des activites. Le
 *  responsable n'a pas a les recopier : ils voyagent avec le rapport. */
export type ResumeChiffre = {
  solde: number;
  entrees: number;
  sorties: number;
  activites?: { cout: number; recette: number; marge: number; invendus: number; lots: number };
  aides?: { total: number; nombre: number };
};

const fr = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " F";

export function htmlDossier(d: Dossier, slug: string, resume?: ResumeChiffre): string {
  const nom = commissionNom(slug);
  const bilan = aBilanSalaatu(slug);
  let n = 0;
  const num = () => ++n;

  const activites = d.activites.filter((l) => !vide(l.texte)).map((l) => l.texte);
  const difficultes = d.difficultes.filter((l) => !vide(l.texte)).map((l) => l.texte);
  const cellules = d.cellules.filter((l) => !vide(l.texte)).map((l) => l.texte);
  const divers = d.divers.filter((l) => !vide(l.texte)).map((l) => l.texte);
  const props = d.propositions.filter((p) => !vide(p.titre));

  const contenu = `
  ${enTete("Rapport de Commission", "Waccaayu bisub Salaatu ’Alaa Nabi")}
  <div class="ribbon"><small>Commission</small><strong>${e(nom)}</strong></div>
  <div class="body">
    <div class="ident">
      <div><span>Responsable</span><b>${e(d.responsable) || "—"}</b></div>
      <div><span>Téléphone</span><b>${e(d.telephone) || "—"}</b></div>
      <div><span>Membres</span><b>${e(d.membres) || "—"}</b></div>
    </div>

    <div class="sec">
      ${titreSection(num(), "Compte rendu des activités")}
      ${liste(activites)}
    </div>

    <div class="sec">
      ${titreSection(num(), "Difficultés rencontrées")}
      ${liste(difficultes)}
    </div>

    ${
      bilan
        ? `<div class="sec">
      ${titreSection(num(), "Bilan provisoire", "bisub Salaatu ’Alaa Nabii")}
      <div class="tally">
        <span>Total des Salaatu relevés par la commission</span>
        <b>${e(d.salaatu) || "—"}</b>
      </div>
      ${!vide(d.salaatuPrecisions) ? `<p class="txt" style="margin-top:2.5mm">${multi(d.salaatuPrecisions)}</p>` : ""}
    </div>`
        : ""
    }

    <div class="sec">
      ${titreSection(num(), "Cellules", "point à discuter en assemblée")}
      ${liste(cellules)}
    </div>

    <div class="sec">
      ${titreSection(num(), "Propositions pour la Journée Salaatu ’Alaa Nabii")}
      ${
        props.length
          ? props
              .map(
                (p) => `<div class="prop">
          <b>${e(p.titre)}</b>
          ${!vide(p.detail) ? `<p>${multi(p.detail)}</p>` : ""}
          ${!vide(p.moyens) ? `<u>Moyens nécessaires : ${multi(p.moyens)}</u>` : ""}
        </div>`
              )
              .join("")
          : `<p class="rien">Aucune proposition transmise.</p>`
      }
    </div>

    <div class="sec">
      ${titreSection(num(), "Divers")}
      ${liste(divers)}
    </div>

    ${
      resume
        ? `<div class="sec">
      ${titreSection(num(), "Caisse de la commission", "sans rapport avec les finances nationales")}
      <table>
        <tr><td class="k">Solde</td><td><b>${e(fr(resume.solde))}</b></td></tr>
        <tr><td class="k">Total des entrées</td><td>${e(fr(resume.entrees))}</td></tr>
        <tr><td class="k">Total des sorties</td><td>${e(fr(resume.sorties))}</td></tr>
        ${
          resume.activites
            ? `<tr><td class="k">Activités</td><td>${resume.activites.lots} lot(s) · ` +
              `${e(fr(resume.activites.cout))} dépensés · ${e(fr(resume.activites.recette))} encaissés · ` +
              `marge ${e(fr(resume.activites.marge))}${
                resume.activites.invendus ? ` · ${resume.activites.invendus} invendus` : ""
              }</td></tr>`
            : ""
        }
        ${
          resume.aides
            ? `<tr><td class="k">Aides aux membres</td><td>${resume.aides.nombre} aide(s) — ${e(fr(resume.aides.total))}</td></tr>`
            : ""
        }
      </table>
    </div>`
        : ""
    }
  </div>

  <div class="signs">
    <div><i></i><span>Responsable de la commission</span></div>
    <div><i></i><span>Secrétariat Général</span></div>
  </div>
  ${pied(`Établi le ${new Date().toLocaleDateString("fr-FR")}`)}`;

  return document(`Rapport — ${nom}`, contenu);
}

/* ═══ Fiche vierge d'une commission ════════════════════════════════════ */

/** Une seule page A4, a remplir a la main, pour LA commission concernee.
 *  Une commission n'a pas a imprimer le jeu complet des six fiches : elle
 *  n'y trouverait que du papier perdu. Le jeu complet reste accessible au
 *  Secretariat, via /fiches-ag-2026.html. */
export function htmlFicheVierge(slug: string): string {
  const nom = commissionNom(slug);
  const bilan = aBilanSalaatu(slug);
  let n = 0;
  const num = () => ++n;

  // Poids des zones d'ecriture, et non des hauteurs : elles se partagent la
  // place qui reste. Le compte rendu en recoit le plus — c'est la qu'on ecrit
  // le plus —, les divers le moins. Quand la commission ne tient pas le
  // decompte des Salaatu, la place du cadre revient d'elle-meme aux autres
  // zones : il n'y a aucun second jeu de valeurs a maintenir.
  const poids = { rendu: 3, cellules: 2, props: 2, divers: 1.4 };

  const contenu = `
  ${enTete("Fiche de Commission", "Waccaayu bisub Salaatu ’Alaa Nabi")}
  <div class="ribbon"><small>Commission</small><strong>${e(nom)}</strong></div>
  <div class="body">
    <div class="champs">
      <div><span>Responsable</span><i></i></div>
      <div><span>Membres présents</span><i></i></div>
      <div><span>Date</span><i></i></div>
    </div>

    <div class="sec libre" style="flex-grow:${poids.rendu}">
      ${titreSection(num(), "Compte rendu de la commission")}
      <div class="lignes"></div>
    </div>

    ${
      bilan
        ? `<div class="sec">
      ${titreSection(num(), "Bilan provisoire", "bisub Salaatu ’Alaa Nabii")}
      <div class="boite"><span>Nombre de Salaatu</span></div>
    </div>`
        : ""
    }

    <div class="sec libre" style="flex-grow:${poids.cellules}">
      ${titreSection(num(), "Cellules", "point à discuter")}
      <div class="lignes"></div>
    </div>

    <div class="sec libre" style="flex-grow:${poids.props}">
      ${titreSection(num(), "Propositions pour la Journée Salaatu ’Alaa Nabii")}
      <div class="lignes"></div>
    </div>

    <div class="sec libre" style="flex-grow:${poids.divers}">
      ${titreSection(num(), "Divers")}
      <div class="lignes"></div>
    </div>
  </div>

  <div class="signs">
    <div><i></i><span>Responsable de la commission</span></div>
    <div><i></i><span>Secrétariat Général</span></div>
  </div>
  ${pied("Brouillon à remplir")}`;

  return document(`Fiche vierge — ${nom}`, contenu, "fiche");
}

/* ═══ Compte rendu de reunion ══════════════════════════════════════════ */

export function htmlCompteRendu(cr: CompteRendu): string {
  const contenu = `
  ${enTete(cr.titre || "Compte rendu de réunion")}
  <div class="body" style="padding-top:12mm">
    <table style="margin-bottom:6mm">
      ${[
        ["Date", cr.date],
        ["Lieu", cr.lieu],
        ["Présidée par", cr.presidence],
        ["Secrétaire de séance", cr.secretaire],
        ["Présents", cr.presents],
        ["Excusés / absents", cr.excuses],
      ]
        .filter(([, v]) => !vide(v as string))
        .map(([k, v]) => `<tr><td class="k">${e(k)}</td><td>${multi(v as string)}</td></tr>`)
        .join("")}
    </table>

    ${cr.points
      .map(
        (p, i) => `<div class="sec">
      ${titreSection(i + 1, p.titre || "—")}
      ${!vide(p.resume) ? `<p class="txt">${multi(p.resume)}</p>` : ""}
      ${
        !vide(p.decisions)
          ? `<p class="txt" style="margin-top:2mm"><b>Décisions :</b> ${multi(p.decisions)}</p>`
          : ""
      }
      ${
        !vide(p.responsable) || !vide(p.echeance)
          ? `<p class="txt" style="color:#5C7268;margin-top:1.5mm">Suivi : ${
              e(p.responsable) || "—"
            }${!vide(p.echeance) ? ` · Échéance : ${e(p.echeance)}` : ""}</p>`
          : ""
      }
    </div>`
      )
      .join("")}

    ${
      !vide(cr.divers)
        ? `<div class="sec">${titreSection(cr.points.length + 1, "Observations générales")}
           <p class="txt">${multi(cr.divers)}</p></div>`
        : ""
    }
  </div>

  <div class="signs">
    <div><i></i><span>Le Président</span></div>
    <div><i></i><span>Le Secrétaire de séance</span></div>
  </div>
  ${pied(`Établi le ${new Date().toLocaleDateString("fr-FR")}`)}`;

  return document(cr.titre || "Compte rendu", contenu);
}

/* ═══ Rapport recu d'une commission ════════════════════════════════════ */

const jour = (ts: number) =>
  ts
    ? new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
    : "—";

const jourCourt = (ts: number) =>
  ts ? new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "—";

const dateIso = (d: string) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "—";

/** Un rapport arrive par le formulaire public (/commissions/<slug>) et
 *  s'affiche au Secretariat. Sur papier, il doit ressembler aux autres pieces
 *  de l'assemblee — d'ou la meme en-tete officielle. */
export function htmlRapport(r: CommissionReport): string {
  const nom = commissionNom(r.commission);
  const bilan = aBilanSalaatu(r.commission);
  let n = 0;
  const num = () => ++n;

  const bloc = (titre: string, texte: string, sous?: string) =>
    vide(texte)
      ? ""
      : `<div class="sec">${titreSection(num(), titre, sous)}
         <p class="txt">${multi(texte)}</p></div>`;

  const contenu = `
  ${enTete("Rapport de Commission", "Waccaayu bisub Salaatu ’Alaa Nabi")}
  <div class="ribbon"><small>Commission</small><strong>${e(nom)}</strong></div>
  <div class="body">
    <div class="ident">
      <div><span>Responsable</span><b>${e(r.responsable) || "—"}</b></div>
      <div><span>Téléphone</span><b>${e(r.telephone) || "—"}</b></div>
      <div><span>Membres</span><b>${r.membres != null ? e(r.membres) : "—"}</b></div>
      <div><span>Reçu le</span><b>${e(jour(r.createdAt))}</b></div>
    </div>

    ${bloc("Compte rendu des activités", r.activites)}
    ${bloc("Difficultés rencontrées", r.difficultes)}

    ${
      bilan && r.salaatu != null
        ? `<div class="sec">
      ${titreSection(num(), "Bilan provisoire", "bisub Salaatu ’Alaa Nabii")}
      <div class="tally">
        <span>Total des Salaatu relevés par la commission</span>
        <b>${e(new Intl.NumberFormat("fr-FR").format(r.salaatu))}</b>
      </div>
      ${!vide(r.salaatuPrecisions) ? `<p class="txt" style="margin-top:2.5mm">${multi(r.salaatuPrecisions)}</p>` : ""}
    </div>`
        : ""
    }

    ${bloc(
      `Cellules${r.cellulesActives != null ? ` (${r.cellulesActives} actives)` : ""}`,
      r.cellules,
      "point à discuter en assemblée"
    )}
    ${bloc("Propositions pour la Journée Salaatu ’Alaa Nabii", r.propositions)}
    ${bloc("Moyens nécessaires", r.moyens)}
    ${bloc("Divers", r.divers)}
  </div>

  <div class="signs">
    <div><i></i><span>Responsable de la commission</span></div>
    <div><i></i><span>Secrétariat Général</span></div>
  </div>
  ${pied(`Reçu le ${jour(r.createdAt)}`)}`;

  return document(`Rapport reçu — ${nom}`, contenu);
}

/* ═══ Suivi des retours (Secretariat) ══════════════════════════════════ */

export type LigneSuivi = {
  slug: string;
  nom: string;
  responsable: string;
  /** Date du dernier rapport recu, 0 si rien n'est arrive. */
  recuAt: number;
  /** Date de la derniere relance, 0 si la commission n'a pas ete relancee. */
  relanceAt: number;
  statut: StatutDossier;
  /** Renseigne pour la seule commission qui tient le decompte. */
  salaatu: number | null;
};

const ETAT_DOSSIER: Record<StatutDossier, [string, string]> = {
  brouillon: ["non", "Brouillon"],
  transmis: ["att", "Transmis au Secrétariat"],
  valide: ["ok", "Remis au Président"],
};

/** Le tableau de bord du Secretariat, sur papier : qui a repondu, qui reste a
 *  relancer, ou en est chaque dossier. C'est la piece qu'on pose sur la table
 *  au debut de l'assemblee. */
export function htmlSuivi(lignes: LigneSuivi[]): string {
  const repondu = lignes.filter((l) => l.recuAt > 0).length;
  const transmis = lignes.filter((l) => l.statut !== "brouillon").length;
  const salaatu = lignes.find((l) => l.salaatu != null)?.salaatu ?? null;

  const contenu = `
  ${enTete("Suivi des Commissions", "Waccaayu bisub Salaatu ’Alaa Nabi")}
  <div class="ribbon"><small>Secrétariat Général</small><strong>État des retours</strong></div>
  <div class="body">
    <div class="cartes">
      <div><span>Commissions</span><b>${lignes.length}</b></div>
      <div><span>Rapports reçus</span><b>${repondu} / ${lignes.length}</b></div>
      <div><span>Dossiers transmis</span><b>${transmis} / ${lignes.length}</b></div>
      ${
        salaatu != null
          ? `<div><span>Salaatu déclarés</span><b>${e(new Intl.NumberFormat("fr-FR").format(salaatu))}</b></div>`
          : ""
      }
    </div>

    <div class="sec">
      ${titreSection(1, "Retour de chaque commission")}
      <table class="reg">
        <thead><tr>
          <th>Commission</th><th>Responsable</th><th>Rapport reçu</th>
          <th>Relance</th><th>Dossier</th>
        </tr></thead>
        <tbody>
          ${lignes
            .map(
              (l) => `<tr>
            <td><b>${e(l.nom)}</b></td>
            <td>${e(l.responsable) || "—"}</td>
            <td>${
              l.recuAt
                ? `<span class="etat ok">Reçu le ${e(jourCourt(l.recuAt))}</span>`
                : `<span class="etat non">En attente</span>`
            }</td>
            <td>${l.relanceAt ? e(jourCourt(l.relanceAt)) : "—"}</td>
            <td><span class="etat ${ETAT_DOSSIER[l.statut][0]}">${e(ETAT_DOSSIER[l.statut][1])}</span></td>
          </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>

    <div class="sec">
      ${titreSection(2, "Observations du Secrétariat")}
      <div class="lignes" style="height:38mm"></div>
    </div>
  </div>

  <div class="signs">
    <div><i></i><span>Le Secrétaire Général</span></div>
    <div><i></i><span>Le Président</span></div>
  </div>
  ${pied(`Arrêté le ${new Date().toLocaleDateString("fr-FR")}`)}`;

  return document("Suivi des commissions", contenu);
}

/* ═══ Registre des versements ══════════════════════════════════════════ */

/** D'ou part l'argent, tel qu'on l'ecrit sur les pieces. Le Dahira n'a qu'un
 *  compte : la Finance ne verse pas « depuis sa caisse », elle verse depuis
 *  celle du Dahira, qu'elle tient. */
const NOM_EMETTEUR = "Trésorerie du Dahira";

/** Releve des sommes versees par la tresorerie du Dahira aux commissions,
 *  avec l'etat de l'accuse de reception.
 *
 *  C'est la piece de tracabilite : elle dit qui a recu quoi, quand, par quel
 *  moyen, et qui l'a confirme. Un versement qui n'a jamais ete accuse y
 *  apparait en clair — c'est precisement ce qu'on veut voir. */
export function htmlVersements(
  transferts: Transfert[],
  /** Titre du bandeau : « Versements émis », « Versements reçus »… */
  intitule: string
): string {
  const b = bilanVersements(transferts);

  const contenu = `
  ${enTete("Registre des Versements", "Waccaayu bisub Salaatu ’Alaa Nabi")}
  <div class="ribbon"><small>Compte principal du Dahira</small><strong>${e(intitule)}</strong></div>
  <div class="body">
    <div class="cartes">
      <div><span>Total versé</span><b>${e(fr(b.verse))}</b></div>
      <div><span>Réception accusée</span><b>${e(fr(b.recu))}</b></div>
      <div><span>En attente d’accusé</span><b>${e(fr(b.attente))}</b></div>
    </div>

    <div class="sec">
      ${titreSection(1, "Détail des versements")}
      ${
        transferts.length === 0
          ? `<p class="rien">Aucun versement enregistré.</p>`
          : `<table class="reg">
        <thead><tr>
          <th>Date</th><th>De</th><th>Vers</th><th>Motif</th>
          <th>Moyen / réf.</th><th class="n">Montant</th><th>Accusé de réception</th>
        </tr></thead>
        <tbody>
          ${transferts
            .map(
              (t) => `<tr>
            <td>${e(dateIso(t.date))}</td>
            <td>${e(NOM_EMETTEUR)}</td>
            <td><b>${e(commissionNom(t.vers))}</b></td>
            <td>${e(t.motif) || "—"}</td>
            <td>${e(t.moyen) || "—"}${t.reference ? `<br>${e(t.reference)}` : ""}</td>
            <td class="n">${e(fr(t.montant))}</td>
            <td>${
              t.statut === "recu"
                ? `<span class="etat ok">Reçu le ${e(jourCourt(t.recuAt))}</span>` +
                  (t.recuPar ? `<br>${e(t.recuPar)}` : "") +
                  (t.observation ? `<br>${e(t.observation)}` : "")
                : t.statut === "annule"
                  ? `<span class="etat non">Annulé</span>` +
                    (t.motifAnnulation ? `<br>${e(t.motifAnnulation)}` : "")
                  : `<span class="etat att">${e(LIBELLE_TRANSFERT.envoye)}</span>`
            }</td>
          </tr>`
            )
            .join("")}
        </tbody>
        <tfoot><tr>
          <td colspan="5">Total des versements (hors annulations)</td>
          <td class="n">${e(fr(b.verse))}</td>
          <td>${b.nombreAttente} en attente</td>
        </tr></tfoot>
      </table>`
      }
    </div>
  </div>

  <div class="signs">
    <div><i></i><span>Le Trésorier</span></div>
    <div><i></i><span>Le Président</span></div>
  </div>
  ${pied(`Arrêté le ${new Date().toLocaleDateString("fr-FR")}`)}`;

  return document(`Registre des versements — ${intitule}`, contenu);
}

/** Recu individuel d'un versement : une piece a signer et a classer.
 *  Une seule feuille, le pied epingle en bas comme sur la fiche vierge. */
export function htmlRecuVersement(t: Transfert): string {
  const contenu = `
  ${enTete("Reçu de Versement", "Waccaayu bisub Salaatu ’Alaa Nabi")}
  <div class="ribbon"><small>Versé à la commission</small><strong>${e(commissionNom(t.vers))}</strong></div>
  <div class="body">
    <div class="tally" style="margin-bottom:6mm">
      <span>Montant versé par la ${e(NOM_EMETTEUR)} — compte principal</span>
      <b>${e(fr(t.montant))}</b>
    </div>

    <div class="sec">
      ${titreSection(1, "Détail de la remise")}
      <table>
        <tr><td class="k">Date de la remise</td><td>${e(dateIso(t.date))}</td></tr>
        <tr><td class="k">Moyen</td><td>${e(t.moyen) || "—"}</td></tr>
        <tr><td class="k">Référence</td><td>${e(t.reference) || "—"}</td></tr>
        <tr><td class="k">Motif</td><td>${e(t.motif) || "—"}</td></tr>
        <tr><td class="k">Remis par</td><td>${e(t.envoyePar) || "—"}</td></tr>
      </table>
    </div>

    <div class="sec">
      ${titreSection(2, "Accusé de réception")}
      ${
        t.statut === "recu"
          ? `<table>
        <tr><td class="k">Reçu le</td><td><b>${e(jour(t.recuAt))}</b></td></tr>
        <tr><td class="k">Par</td><td>${e(t.recuPar) || "—"}</td></tr>
        ${t.observation ? `<tr><td class="k">Observation</td><td>${multi(t.observation)}</td></tr>` : ""}
      </table>`
          : t.statut === "annule"
            ? `<p class="txt">Versement annulé le ${e(jour(t.annuleAt))}${
                t.annulePar ? ` par ${e(t.annulePar)}` : ""
              }.${t.motifAnnulation ? ` ${e(t.motifAnnulation)}` : ""}</p>`
            : `<p class="txt" style="margin-bottom:3mm">La réception reste à confirmer par la
               responsable de la commission destinataire.</p>
         <div class="champs">
           <div><span>Reçu par</span><i></i></div>
           <div><span>Le</span><i></i></div>
           <div><span>Signature</span><i></i></div>
         </div>`
      }
    </div>
  </div>

  <div class="signs">
    <div><i></i><span>Le Trésorier</span></div>
    <div><i></i><span>Commission ${e(commissionNom(t.vers))}</span></div>
  </div>
  ${pied(`Établi le ${new Date().toLocaleDateString("fr-FR")}`)}`;

  return document(`Reçu — ${commissionNom(t.vers)}`, contenu, "fiche");
}

/* ═══ Facture ══════════════════════════════════════════════════════════ */

/** Ce dont une facture a besoin, d'ou qu'elle vienne : une vente au comptoir
 *  de la commission, ou une commande passee sur la boutique en ligne. Les deux
 *  donnent la meme piece — c'est le meme Dahira qui encaisse. */
export type DonneesFacture = {
  numero: string;
  date: string;
  clientNom: string;
  clientTelephone: string;
  clientAdresse: string;
  lignes: { designation: string; quantite: number; prixUnitaire: number }[];
  total: number;
  moyen: string;
  note: string;
  /** Vendeur ou commission a l'origine de la vente. */
  emetteur: string;
  /** Une facture annulee le dit en toutes lettres, elle ne disparait pas. */
  annulee?: boolean;
};

const MOYENS_LISIBLES: Record<string, string> = {
  wave: "Wave",
  "orange-money": "Orange Money",
  card: "Carte bancaire",
  paypal: "PayPal",
};

/** Facture d'une vente au comptoir. */
export function factureDeVente(v: Vente, emetteur: string): DonneesFacture {
  return {
    numero: v.numero,
    date: v.date,
    clientNom: v.clientNom,
    clientTelephone: v.clientTelephone,
    clientAdresse: "",
    lignes: v.lignes,
    total: v.total,
    moyen: v.moyen,
    note: v.note,
    emetteur,
    annulee: v.annulee,
  };
}

/** Facture d'une commande de la boutique en ligne.
 *
 *  La commande n'a pas de numero de facture a elle : on en derive un de son
 *  identifiant, stable et unique, plutot que d'ecrire dans un document deja
 *  remis au client. */
export function factureDeCommande(o: Order): DonneesFacture {
  return {
    numero: `FA-BTQ-${o.id.slice(0, 8).toUpperCase()}`,
    date: new Date(o.createdAt).toISOString().slice(0, 10),
    clientNom: o.customerName,
    clientTelephone: o.customerPhone,
    clientAdresse: o.deliveryAddress ?? "",
    lignes: o.items.map((i) => ({
      designation: i.title,
      quantite: i.quantity,
      prixUnitaire: i.price,
    })),
    total: o.total,
    moyen: MOYENS_LISIBLES[o.paymentMethod] ?? o.paymentMethod,
    note: o.transactionId ? `Transaction ${o.transactionId}` : "",
    emetteur: "Boutique KSN",
    annulee: o.status === "cancelled",
  };
}

export function htmlFacture(f: DonneesFacture): string {
  const ligne = (l: DonneesFacture["lignes"][number], i: number) => `<tr>
    <td>${i + 1}</td>
    <td><b>${e(l.designation)}</b></td>
    <td class="n">${e(l.quantite)}</td>
    <td class="n">${e(fr(l.prixUnitaire))}</td>
    <td class="n">${e(fr(l.quantite * l.prixUnitaire))}</td>
  </tr>`;

  const contenu = `
  ${enTete("Facture", undefined, META_DAHIRA)}
  <div class="ribbon">
    <small>${f.annulee ? "Facture annulée" : "Pièce de caisse"}</small>
    <strong>${e(f.numero)}</strong>
  </div>
  <div class="body">
    <div class="fact-tete">
      <div>
        <h3>Client</h3>
        <p><b>${e(f.clientNom) || "Client de passage"}</b></p>
        ${f.clientTelephone ? `<p>${e(f.clientTelephone)}</p>` : ""}
        ${f.clientAdresse ? `<p>${multi(f.clientAdresse)}</p>` : ""}
      </div>
      <div class="fact-num">
        <h3>Facture</h3>
        <p><b>${e(f.numero)}</b></p>
        <p>Date : ${e(dateIso(f.date))}</p>
        <p>Règlement : ${e(f.moyen) || "—"}</p>
      </div>
    </div>

    <table class="fact">
      <thead><tr>
        <th style="width:8mm">#</th><th>Désignation</th>
        <th class="n" style="width:16mm">Qté</th>
        <th class="n" style="width:28mm">P. unitaire</th>
        <th class="n" style="width:30mm">Montant</th>
      </tr></thead>
      <tbody>${f.lignes.map(ligne).join("")}</tbody>
      <tfoot>
        <tr class="tot">
          <td colspan="4">Total à payer</td>
          <td class="n">${e(fr(f.total))}</td>
        </tr>
      </tfoot>
    </table>

    <div class="lettres">
      <span>Arrêtée la présente facture à la somme de</span>
      <b>${e(montantEnLettres(f.total))}</b>
    </div>

    ${
      f.annulee
        ? `<p class="txt" style="margin-top:5mm;color:#B00020;font-weight:700">
             Cette facture a été annulée. Elle est conservée au registre pour mémoire.
           </p>`
        : ""
    }
    ${f.note ? `<p class="txt" style="margin-top:4mm;color:#5C7268">${multi(f.note)}</p>` : ""}

    <div class="cachet"><div><span>Cachet et signature</span></div></div>
  </div>
  ${pied(`${f.emetteur} · ${new Date().toLocaleDateString("fr-FR")}`)}`;

  return document(`Facture ${f.numero}`, contenu, "fiche");
}

/** Journal des ventes : ce que la commission a encaisse, facture par facture. */
export function htmlJournalVentes(ventes: Vente[], intitule: string): string {
  const vivantes = ventes.filter((v) => !v.annulee);
  const encaisse = vivantes.reduce((s, v) => s + v.total, 0);
  const articles = vivantes.reduce(
    (s, v) => s + v.lignes.reduce((q, l) => q + l.quantite, 0),
    0
  );

  const contenu = `
  ${enTete("Journal des Ventes", undefined, META_DAHIRA)}
  <div class="ribbon"><small>Boutique</small><strong>${e(intitule)}</strong></div>
  <div class="body">
    <div class="cartes">
      <div><span>Encaissé</span><b>${e(fr(encaisse))}</b></div>
      <div><span>Factures</span><b>${vivantes.length}</b></div>
      <div><span>Articles vendus</span><b>${articles}</b></div>
    </div>

    <div class="sec">
      ${titreSection(1, "Détail des ventes")}
      ${
        ventes.length === 0
          ? `<p class="rien">Aucune vente enregistrée.</p>`
          : `<table class="reg">
        <thead><tr>
          <th>Date</th><th>Facture</th><th>Client</th><th>Articles</th>
          <th>Règlement</th><th class="n">Montant</th>
        </tr></thead>
        <tbody>
          ${ventes
            .map(
              (v) => `<tr>
            <td>${e(dateIso(v.date))}</td>
            <td><b>${e(v.numero)}</b></td>
            <td>${e(v.clientNom) || "Client de passage"}</td>
            <td>${v.lignes.map((l) => `${l.quantite}× ${e(l.designation)}`).join("<br>")}</td>
            <td>${e(v.moyen) || "—"}</td>
            <td class="n">${
              v.annulee
                ? `<span class="etat non">Annulée</span>`
                : e(fr(v.total))
            }</td>
          </tr>`
            )
            .join("")}
        </tbody>
        <tfoot><tr>
          <td colspan="5">Total encaissé (hors annulations)</td>
          <td class="n">${e(fr(encaisse))}</td>
        </tr></tfoot>
      </table>`
      }
    </div>
  </div>

  <div class="signs">
    <div><i></i><span>Responsable de la commission</span></div>
    <div><i></i><span>Secrétariat Général</span></div>
  </div>
  ${pied(`Arrêté le ${new Date().toLocaleDateString("fr-FR")}`)}`;

  return document(`Journal des ventes — ${intitule}`, contenu);
}

/* ═══ Feuille de route d'une journée ═══════════════════════════════════ */

/** Ce que la commission emporte sur le terrain : qui fait quoi, pour quand,
 *  avec quel budget. Une case a cocher en bout de ligne — le jour J, on n'ouvre
 *  pas un telephone, on raye sur le papier. */
export function htmlPreparation(taches: Tache[], nomCommission: string): string {
  const b = bilanPreparation(taches);

  const contenu = `
  ${enTete("Feuille de Route", "Waccaayu bisub Salaatu ’Alaa Nabi")}
  <div class="ribbon"><small>Préparation — Commission</small><strong>${e(nomCommission)}</strong></div>
  <div class="body">
    <div class="cartes">
      <div><span>Avancement</span><b>${b.avancement} %</b></div>
      <div><span>Tâches</span><b>${b.faites} / ${b.total}</b></div>
      <div><span>Budget prévu</span><b>${e(fr(b.budget))}</b></div>
      <div><span>Déjà dépensé</span><b>${e(fr(b.depense))}</b></div>
    </div>

    <div class="sec">
      ${titreSection(1, "Ce qu’il reste à faire")}
      ${
        taches.length === 0
          ? `<p class="rien">Aucune tâche inscrite.</p>`
          : `<table class="reg">
        <thead><tr>
          <th style="width:8mm">✓</th><th>Tâche</th><th>Responsable</th>
          <th>Échéance</th><th class="n">Budget</th><th>État</th>
        </tr></thead>
        <tbody>
          ${taches
            .map(
              (t) => `<tr>
            <td style="font-size:13px;color:#B9C9C1">☐</td>
            <td><b>${e(t.libelle)}</b>${t.detail ? `<br><span style="color:#5C7268">${e(t.detail)}</span>` : ""}</td>
            <td>${e(t.responsable) || "—"}${
              t.responsableTelephone ? `<br>${e(t.responsableTelephone)}` : ""
            }</td>
            <td>${
              t.echeance
                ? `${e(dateIso(t.echeance))}${estEnRetard(t) ? `<br><span class="etat att">dépassée</span>` : ""}`
                : "—"
            }</td>
            <td class="n">${t.budget ? e(fr(t.budget)) : "—"}${
              t.depense ? `<br><span style="font-weight:400;color:#5C7268">dépensé ${e(fr(t.depense))}</span>` : ""
            }</td>
            <td><span class="etat ${
              t.statut === "fait" ? "ok" : t.statut === "bloque" ? "att" : "non"
            }">${e(LIBELLE_TACHE[t.statut])}</span></td>
          </tr>`
            )
            .join("")}
        </tbody>
        <tfoot><tr>
          <td colspan="4">Budget total prévu${b.depense ? ` · dépensé ${e(fr(b.depense))}` : ""}</td>
          <td class="n">${e(fr(b.budget))}</td>
          <td>${b.bloquees ? `${b.bloquees} bloquée(s)` : "—"}</td>
        </tr></tfoot>
      </table>`
      }
    </div>

    <div class="sec">
      ${titreSection(2, "Notes de dernière minute")}
      <div class="lignes" style="height:16mm"></div>
    </div>
  </div>

  <div class="signs">
    <div><i></i><span>Responsable de la commission</span></div>
    <div><i></i><span>Secrétariat Général</span></div>
  </div>
  ${pied(`Arrêtée le ${new Date().toLocaleDateString("fr-FR")}`)}`;

  return document(`Feuille de route — ${nomCommission}`, contenu);
}

/* ═══ Ouverture ════════════════════════════════════════════════════════ */

/** Ouvre le document dans une fenetre a lui et lance l'impression.
 *  On attend le chargement du sceau : sans cela, Chrome imprime parfois avant
 *  que l'image soit peinte, et l'en-tete sort sans logo. */
export function imprimer(html: string): void {
  const w = window.open("", "_blank", "width=900,height=1200");
  if (!w) {
    alert(
      "La fenêtre d'impression a été bloquée par le navigateur. Autorisez les fenêtres surgissantes pour ce site, puis réessayez."
    );
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
  const lancer = () => {
    w.focus();
    w.print();
  };
  const img = w.document.querySelector("img");
  if (img && !img.complete) {
    img.addEventListener("load", lancer, { once: true });
    img.addEventListener("error", lancer, { once: true });
    setTimeout(lancer, 3000); // filet de securite si l'image ne repond pas
  } else {
    setTimeout(lancer, 150);
  }
}
