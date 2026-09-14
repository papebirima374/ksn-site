// Fabrique la presentation PDF du Reglement Interieur, des Statuts et du
// Bureau, a partir de lib/reglement.ts et lib/bureau.ts — une seule source de
// verite, pas de texte recopie ici.
//
//   npm install --no-save puppeteer-core
//   node scripts/generer-reglement-pdf.mjs [dossier-de-sortie]
//
// Produit reglement-ksn.html (relisible au navigateur) et reglement-ksn.pdf.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SORTIE = path.resolve(process.argv[2] ?? path.join(RACINE, "build-reglement"));

/* ── Les donnees vivent en TypeScript : on les compile a la volee ─────── */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ksn-reg-"));
execFileSync(
  path.join(RACINE, "node_modules/.bin/tsc"),
  ["lib/reglement.ts", "lib/bureau.ts", "--outDir", tmp,
   "--module", "esnext", "--target", "es2022", "--moduleResolution", "bundler", "--skipLibCheck"],
  { cwd: RACINE, stdio: "inherit" }
);
for (const f of fs.readdirSync(tmp).filter((f) => f.endsWith(".js"))) {
  fs.renameSync(path.join(tmp, f), path.join(tmp, f.replace(/\.js$/, ".mjs")));
}
const { REGLEMENT, STATUTS, REPERES, ADOPTION } = await import(path.join(tmp, "reglement.mjs"));
const { PRESIDENCE, SECRETARIATS, COMMISSIONS_BUREAU, SIGNATAIRES } =
  await import(path.join(tmp, "bureau.mjs"));

/* ── Mise en page ─────────────────────────────────────────────────────── */
const e = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Le sigle ﷺ (U+FDFA) n'existe ni dans Inter ni dans Georgia : il sortait en
   carre vide sur chaque page du Reglement. Amiri le porte — c'est la police
   arabe du site. On l'embarque, et on la met en DERNIER dans les piles de
   polices : le navigateur y descend caractere par caractere, donc elle ne
   servira qu'aux glyphes que les autres n'ont pas. Rien a baliser dans le
   texte, qui vient de lib/reglement.ts. */
const AMIRI = fs
  .readFileSync(path.join(RACINE, ".next/static/media/05d29f0ed5b0e698-s.p.0ipr5zwy0u.~f.woff2"))
  .toString("base64");

const STYLE = `
@font-face{font-family:'Amiri';font-weight:400;font-style:normal;
  src:url(data:font/woff2;base64,${AMIRI}) format('woff2');font-display:block}
@page{size:A4 portrait;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',-apple-system,'Segoe UI',sans-serif,'Amiri';color:#12231C;background:#fff;
  -webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;min-height:297mm;background:#fff;position:relative;overflow:hidden;
  break-after:page;page-break-after:always;display:flex;flex-direction:column}
.page:last-child{break-after:auto;page-break-after:auto}

/* Couverture */
.cover{background:linear-gradient(160deg,#06291D 0%,#082F22 45%,#0C5B3E 100%);color:#fff;
  flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:24mm 20mm;position:relative;overflow:hidden}
.cover .halo{position:absolute;width:110mm;height:110mm;border-radius:50%;
  background:radial-gradient(circle,rgba(212,175,55,.2),transparent 70%)}
.cover .halo.a{top:-40mm;left:-30mm}.cover .halo.b{bottom:-40mm;right:-30mm}
.cover img{width:40mm;height:40mm;position:relative;z-index:2}
.cover .k{position:relative;z-index:2;margin-top:8mm;font-size:11px;font-weight:800;
  letter-spacing:.36em;text-transform:uppercase;color:#E8CE72}
.cover h1{position:relative;z-index:2;margin-top:5mm;font-size:40px;line-height:1.1;font-weight:900;
  font-family:Georgia,'Times New Roman',serif;
  background:linear-gradient(90deg,#B8860B,#E8CE72,#D4AF37);-webkit-background-clip:text;
  background-clip:text;color:transparent}
.cover .s{position:relative;z-index:2;margin-top:6mm;font-size:14px;color:#CFE4D9;line-height:1.8}
.cover .rule{position:relative;z-index:2;width:40mm;height:.8mm;background:#D4AF37;margin:8mm auto}
.reperes{position:relative;z-index:2;display:flex;gap:5mm;margin-top:4mm;flex-wrap:wrap;justify-content:center}
.rep{border:.4mm solid rgba(212,175,55,.45);border-radius:3mm;padding:4mm 5mm;min-width:36mm}
.rep b{display:block;font-size:19px;font-weight:900;color:#E8CE72;font-family:Georgia,serif}
.rep span{display:block;font-size:9.5px;font-weight:700;color:#fff;margin-top:1mm}
.rep i{display:block;font-size:8px;color:#9FBFB1;font-style:normal;margin-top:.8mm}

/* Sommaire : on doit savoir ou trouver un article sans feuilleter. */
.som{display:flex;flex-direction:column;gap:2.4mm}
.som .grp{font-size:9px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;
  color:#B8860B;margin:5mm 0 1mm}
.som .grp:first-child{margin-top:0}
.som a,.som div.l{display:flex;align-items:baseline;gap:3mm;text-decoration:none;color:#2E3F38}
.som .n{flex:none;width:9mm;font-family:Georgia,serif;font-weight:900;font-size:12px;color:#0F7C55}
.som .t{font-size:12px}
.som .p{flex:none;font-size:11px;color:#9BB0A6;font-variant-numeric:tabular-nums}
.som .pt{flex:1;border-bottom:.25mm dotted #C3D2CB;margin:0 2mm 1mm}

/* Intertitre d'une section du Bureau */
.sect{font-size:9px;font-weight:800;letter-spacing:.24em;text-transform:uppercase;
  color:#B8860B;margin:0 0 4mm;padding-bottom:1.5mm;border-bottom:.3mm solid rgba(212,175,55,.4)}
.sect.suite{margin-top:8mm}

/* Pages interieures */
.band{background:#082F22;color:#fff;padding:8mm 16mm;display:flex;align-items:center;gap:5mm}
.band img{width:14mm;height:14mm}
.band div{flex:1}
.band small{display:block;font-size:8px;font-weight:800;letter-spacing:.28em;
  text-transform:uppercase;color:#E8CE72}
.band h2{font-size:20px;font-weight:900;font-family:Georgia,serif,'Amiri';color:#fff;margin-top:1mm}
.band .n{font-size:9px;color:#9FBFB1}
.content{flex:1;padding:11mm 18mm 0}

.art{display:flex;gap:6mm;margin-bottom:8.5mm;break-inside:avoid}
.art .num{flex:none;width:11mm;height:11mm;border-radius:2.5mm;
  background:linear-gradient(135deg,#B8860B,#D4AF37);color:#06291D;
  font-family:Georgia,serif;font-weight:900;font-size:17px;
  display:flex;align-items:center;justify-content:center}
.art h3{font-size:15.5px;font-weight:800;color:#082F22;font-family:Georgia,serif,'Amiri';line-height:1.35}
.art p{font-size:12px;line-height:1.95;color:#2E3F38;margin-top:2.4mm}
.art ul{margin:3mm 0 0 5.5mm}
.art li{font-size:12px;line-height:1.95;color:#2E3F38;margin-bottom:1.8mm;padding-left:1mm}

.poste{border-left:1.2mm solid #D4AF37;padding-left:4.5mm;margin-bottom:6.5mm;break-inside:avoid}
.poste b{font-size:12px;color:#082F22}
.poste u{display:block;text-decoration:none;font-size:14px;font-weight:800;color:#0F7C55;margin-top:.8mm}
.poste p{font-size:11px;line-height:1.8;color:#5C7268;margin-top:1.4mm}
.poste .adj{font-size:10.5px;color:#7C8F86;margin-top:1.6mm;line-height:1.65}

.sign{margin:0 16mm;padding:6mm;border:.4mm solid rgba(212,175,55,.5);border-radius:3mm;
  background:linear-gradient(135deg,rgba(15,124,85,.05),rgba(212,175,55,.08))}
.sign p{font-size:12px;color:#2E3F38;line-height:1.85}
.sign .grid{display:flex;gap:6mm;margin-top:5mm;flex-wrap:wrap}
.sign .grid div{flex:1;min-width:38mm;border-top:.3mm solid rgba(212,175,55,.6);padding-top:2mm}
.sign .grid small{display:block;font-size:8px;font-weight:800;letter-spacing:.14em;
  text-transform:uppercase;color:#B8860B}
.sign .grid b{font-size:12px;color:#082F22}

.foot{margin-top:auto;background:#06291D;color:#9FBFB1;padding:3.5mm 16mm;
  display:flex;justify-content:space-between;font-size:8.5px}
.foot b{color:#D4AF37}
@media screen{body{background:#33443D;padding:20px}.page{margin:0 auto 20px;box-shadow:0 14px 40px rgba(0,0,0,.35)}}
`;

const bandeau = (titre, note) => `
<div class="band">
  <img src="/logo/ksn-logo.png" alt="">
  <div><small>Dahira Kippangog Salaatu ’Alaa Nabii</small><h2>${e(titre)}</h2></div>
  ${note ? `<span class="n">${e(note)}</span>` : ""}
</div>`;

const pied = (p) => `<div class="foot"><span>Adopté à ${e(ADOPTION.lieu)} — ${e(ADOPTION.date)}</span><span>${e(p)}</span></div>`;

const article = (a) => `
<div class="art">
  <div class="num">${a.numero}</div>
  <div>
    <h3>${e(a.titre)}</h3>
    ${(a.texte ?? []).map((t) => `<p>${e(t)}</p>`).join("")}
    ${a.points?.length ? `<ul>${a.points.map((x) => `<li>${e(x)}</li>`).join("")}</ul>` : ""}
  </div>
</div>`;

/** Repartit les articles en pages d'apres des hauteurs MESUREES.
 *
 *  L'ancienne version coupait tous les 4 articles, sans rien verifier. Un
 *  article rallonge, un corps de texte grossi, et la page debordait — en
 *  silence, le surplus glissant sur la feuille suivante ou disparaissant. Et
 *  a l'inverse, quatre articles courts laissaient une demi-page blanche.
 *
 *  `lots` est calcule par le navigateur, qui seul sait ce que le texte occupe
 *  reellement une fois compose. */
function pagesArticles(articles, titre, lots) {
  return lots
    .map(
      (lot, i) => `<div class="page">
      ${bandeau(titre, `${i + 1} / ${lots.length}`)}
      <div class="content">${lot.map(article).join("")}</div>
      ${pied(titre)}
    </div>`
    )
    .join("");
}

/** Page de mesure : les articles composes a la largeur exacte du document,
 *  sans decoupe. C'est elle qu'on interroge pour connaitre leur hauteur. */
const pageMesure = (articles) => `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
<style>${STYLE}</style></head><body><div class="page" id="mesure">
  ${bandeau("Mesure", "0 / 0")}
  <div class="content">${articles.map(article).join("")}</div>
  ${pied("Mesure")}
</div></body></html>`;

/** Remplit les pages jusqu'a une hauteur donnee, sans jamais la depasser. */
function remplir(articles, hauteurs, plafond, dispo) {
  const lots = [];
  let courant = [];
  let cumul = 0;
  articles.forEach((a, i) => {
    const h = hauteurs[i];
    // Un article seul plus haut qu'une page ne peut pas etre coupe ici : on le
    // laisse passer, la regle CSS break-inside s'en chargera.
    const limite = Math.min(plafond, dispo);
    if (courant.length && cumul + h > limite) {
      lots.push(courant);
      courant = [];
      cumul = 0;
    }
    courant.push(a);
    cumul += h;
  });
  if (courant.length) lots.push(courant);
  return lots;
}

/** Repartit les articles sur le moins de pages possible, puis EQUILIBRE.
 *
 *  Un remplissage purement glouton donnait « 7 articles puis 1 » : la premiere
 *  page saturee, la seconde presque vide. Une fois le nombre de feuilles connu,
 *  on recommence en visant la hauteur moyenne — meme nombre de pages, mais
 *  reparties. « Plus lisible » commence la. */
function repartir(articles, hauteurs, dispo) {
  const glouton = remplir(articles, hauteurs, dispo, dispo);
  if (glouton.length < 2) return glouton;

  const total = hauteurs.reduce((s, h) => s + h, 0);
  const cible = total / glouton.length;
  const equilibre = remplir(articles, hauteurs, cible * 1.06, dispo);

  // L'equilibrage ne doit jamais couter une feuille de plus.
  return equilibre.length === glouton.length ? equilibre : glouton;
}

const poste = (p) => `
<div class="poste">
  <b>${e(p.titre)}</b>
  <u>${e(p.titulaire)}</u>
  <p>${e(p.role)}</p>
  ${p.adjoints?.length ? `<div class="adj">${p.adjoints.map(e).join(" · ")}</div>` : ""}
</div>`;

const construireHtml = (lotsReg, lotsStat) => `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
<title>Règlement Intérieur, Statuts et Bureau — KSN</title><style>${STYLE}</style></head><body>

<div class="page"><div class="cover">
  <div class="halo a"></div><div class="halo b"></div>
  <img src="/logo/ksn-logo.png" alt="Sceau KIPPAANGOG">
  <div class="k">Dahira Kippangog Salaatu ’Alaa Nabii</div>
  <h1>Règlement Intérieur<br>& Statuts Officiels</h1>
  <div class="rule"></div>
  <div class="s">Adopté à ${e(ADOPTION.lieu)}, le ${e(ADOPTION.date)}<br>
    Dahira fondé le ${e(ADOPTION.fondation)} à Touba</div>
  <div class="reperes">
    ${REPERES.map((r) => `<div class="rep"><b>${e(r.valeur)}</b><span>${e(r.unite)}</span><i>${e(r.detail)}</i></div>`).join("")}
  </div>
</div></div>

${pagesArticles(REGLEMENT, "Règlement Intérieur", lotsReg)}
${pagesArticles(STATUTS, "Statuts Officiels", lotsStat)}

<div class="page">
  ${bandeau("Le Bureau", "Renouvellement — septembre 2026")}
  <div class="content">
    <p class="sect">Présidence</p>
    ${PRESIDENCE.map(poste).join("")}
    <p class="sect suite">Secrétariat</p>
    ${SECRETARIATS.map(poste).join("")}
  </div>
  ${pied("Le Bureau")}
</div>

<div class="page">
  ${bandeau("Les Commissions", "Renouvellement — septembre 2026")}
  <div class="content">
    <p class="sect">Les cinq commissions</p>
    ${COMMISSIONS_BUREAU.map(poste).join("")}
  </div>
  ${pied("Les Commissions")}
</div>

<div class="page">
  ${bandeau("Signatures", "")}
  <div class="content">
    <div class="sign" style="margin:0">
      <p>Fait à ${e(ADOPTION.lieu)}, le ${e(ADOPTION.date)}, sous la grâce d’Allah et la
         lumière éternelle du Prophète Muhammad ﷺ.</p>
      <div class="grid">
        ${SIGNATAIRES.map((s) => `<div><small>${e(s.role)}</small><b>${e(s.nom)}</b></div>`).join("")}
      </div>
    </div>
  </div>
  ${pied("Signatures")}
</div>

</body></html>`;

fs.mkdirSync(SORTIE, { recursive: true });
fs.mkdirSync(path.join(SORTIE, "logo"), { recursive: true });
fs.copyFileSync(path.join(RACINE, "public/logo/ksn-logo.png"), path.join(SORTIE, "logo/ksn-logo.png"));
fs.writeFileSync(path.join(SORTIE, "mesure-reglement.html"), pageMesure(REGLEMENT));
fs.writeFileSync(path.join(SORTIE, "mesure-statuts.html"), pageMesure(STATUTS));

/* ── Rendu PDF ────────────────────────────────────────────────────────── */
const { default: puppeteer } = await import("puppeteer-core");
const srv = http.createServer((q, r) => {
  const f = path.join(SORTIE, decodeURIComponent(q.url.split("?")[0]));
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  const t = { ".html": "text/html", ".png": "image/png" }[path.extname(f)] ?? "application/octet-stream";
  r.writeHead(200, { "Content-Type": t });
  fs.createReadStream(f).pipe(r);
});
await new Promise((r) => srv.listen(4620, r));
const p0 = (nav) => nav.newPage();
const b = await puppeteer.launch({
  executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const p = await p0(b);

/** Mesure la hauteur de chaque article et la place disponible sur une page. */
async function mesurer(fichier) {
  await p.goto(`http://localhost:4620/${fichier}`, { waitUntil: "networkidle2" });
  return p.evaluate(() => {
    const page = document.getElementById("mesure");
    const contenu = page.querySelector(".content");
    const style = getComputedStyle(contenu);
    // Place reellement offerte au texte : UNE feuille A4, moins le bandeau, le
    // pied et le retrait haut du contenu.
    //
    // 297 mm en dur, et non la hauteur mesuree de la page : la page de mesure
    // contient TOUS les articles, donc elle s'etire — l'interroger revenait a
    // demander « combien de place ai-je ? » a quelque chose qui grandit avec
    // ce qu'on y met. La reponse etait 393 mm sur une feuille de 297.
    const A4 = (297 / 25.4) * 96;
    const dispo =
      A4 -
      page.querySelector(".band").getBoundingClientRect().height -
      page.querySelector(".foot").getBoundingClientRect().height -
      parseFloat(style.paddingTop) -
      8; // marge de securite : les arrondis suffisent a faire deborder
    const hauteurs = [...contenu.querySelectorAll(".art")].map((a) => {
      const r = a.getBoundingClientRect().height;
      // La marge basse compte : deux articles colles n'existent pas.
      return r + parseFloat(getComputedStyle(a).marginBottom);
    });
    return { dispo, hauteurs };
  });
}

const mReg = await mesurer("mesure-reglement.html");
const mStat = await mesurer("mesure-statuts.html");
const lotsReg = repartir(REGLEMENT, mReg.hauteurs, mReg.dispo);
const lotsStat = repartir(STATUTS, mStat.hauteurs, mStat.dispo);
console.log(
  `  Répartition mesurée : Règlement ${lotsReg.map((l) => l.length).join("+")} · ` +
  `Statuts ${lotsStat.map((l) => l.length).join("+")}`
);

fs.writeFileSync(path.join(SORTIE, "reglement-ksn.html"), construireHtml(lotsReg, lotsStat));
await p.goto("http://localhost:4620/reglement-ksn.html", { waitUntil: "networkidle2" });
const logoOk = await p.evaluate(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));

// Une page A4 fait 297 mm, et rien ne le rappelait : la pagination etait
// FIXEE a l'aveugle (4 articles par page). Grossir le texte suffisait a faire
// deborder — sans erreur, le surplus glissant simplement sur la feuille
// suivante, ou disparaissant. On mesure donc chaque page.
const debordements = await p.evaluate(() => {
  const mm = (px) => +(px / 96 * 25.4).toFixed(1);
  return [...document.querySelectorAll(".page")]
    .map((pg, i) => ({
      page: i + 1,
      titre: pg.querySelector("h2")?.textContent ?? pg.querySelector("h1")?.textContent ?? "Couverture",
      hauteur: mm(pg.scrollHeight),
    }))
    .filter((x) => x.hauteur > 297.5);
});
if (debordements.length) {
  console.log("\n  PAGES QUI DEBORDENT :");
  for (const d of debordements) console.log(`    page ${d.page} — ${d.hauteur} mm  (${d.titre})`);
} else {
  console.log("\n  Aucune page ne deborde.");
}
await p.pdf({ path: path.join(SORTIE, "reglement-ksn.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });
const pages = fs.readFileSync(path.join(SORTIE, "reglement-ksn.pdf")).toString("latin1").match(/\/Type\s*\/Page[^s]/g)?.length ?? 0;
console.log(`\nPDF écrit : ${path.join(SORTIE, "reglement-ksn.pdf")}`);
console.log(`Pages : ${pages} · Sceau chargé : ${logoOk ? "oui" : "NON"}`);
await b.close();
srv.close();
fs.rmSync(tmp, { recursive: true, force: true });
