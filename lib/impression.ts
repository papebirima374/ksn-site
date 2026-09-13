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

import type { Dossier } from "./commission-dossier";
import type { CompteRendu } from "./ag-reunion";
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
     poil sous 297mm (les arrondis suffisent a declencher une 2e page),
     corps qui rogne plutot que de pousser, pied epingle en bas. */
  .page.fiche{height:296.5mm;min-height:0;padding:0;overflow:hidden;
    display:flex;flex-direction:column}
  .page.fiche .head{padding:9mm 14mm 13mm}
  .page.fiche .body{flex:1;min-height:0;overflow:hidden;padding:6mm 14mm 0}
  .page.fiche .sec{margin-bottom:4mm}
  .page.fiche .signs{margin-top:auto;padding-top:4mm}
  .page.fiche .foot{flex:none;margin-top:4mm}

  @media screen{ body{background:#33443D;padding:20px} .page{box-shadow:0 14px 40px rgba(0,0,0,.35)} }
`;

function enTete(titre: string, sousTitre?: string): string {
  return `
  <div class="head">
    <div class="halo l"></div><div class="halo r"></div>
    <img class="crest" src="/logo/ksn-logo.png" alt="Sceau KIPPAANGOG Salaatu 'Alaa Nabii">
    <div class="kicker">Dahira Kippangog Salaatu ’Alaa Nabii</div>
    <h1>${e(titre)}</h1>
    ${sousTitre ? `<div class="wolof">${e(sousTitre)}</div>` : ""}
    <div class="meta">
      <span>📅 <b>${e(AG.date)}</b></span>
      <span>📍 <b>${e(AG.lieu)}</b></span>
      <span>📞 <b>${e(AG.tel)}</b></span>
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

export function htmlDossier(d: Dossier, slug: string): string {
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

  // Hauteurs d'ecriture : la place liberee quand il n'y a pas de bilan
  // Salaatu revient aux zones de texte.
  const h = bilan
    ? { rendu: "38", cellules: "30.4", props: "30.4", divers: "22.8" }
    : { rendu: "53.2", cellules: "38", props: "38", divers: "22.8" };

  const contenu = `
  ${enTete("Fiche de Commission", "Waccaayu bisub Salaatu ’Alaa Nabi")}
  <div class="ribbon"><small>Commission</small><strong>${e(nom)}</strong></div>
  <div class="body">
    <div class="champs">
      <div><span>Responsable</span><i></i></div>
      <div><span>Membres présents</span><i></i></div>
      <div><span>Date</span><i></i></div>
    </div>

    <div class="sec">
      ${titreSection(num(), "Compte rendu de la commission")}
      <div class="lignes" style="height:${h.rendu}mm"></div>
    </div>

    ${
      bilan
        ? `<div class="sec">
      ${titreSection(num(), "Bilan provisoire", "bisub Salaatu ’Alaa Nabii")}
      <div class="boite"><span>Nombre de Salaatu</span></div>
    </div>`
        : ""
    }

    <div class="sec">
      ${titreSection(num(), "Cellules", "point à discuter")}
      <div class="lignes" style="height:${h.cellules}mm"></div>
    </div>

    <div class="sec">
      ${titreSection(num(), "Propositions pour la Journée Salaatu ’Alaa Nabii")}
      <div class="lignes" style="height:${h.props}mm"></div>
    </div>

    <div class="sec">
      ${titreSection(num(), "Divers")}
      <div class="lignes" style="height:${h.divers}mm"></div>
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
