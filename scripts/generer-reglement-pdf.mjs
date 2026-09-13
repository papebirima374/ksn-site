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
const { PRESIDENCE, SECRETARIATS, SIGNATAIRES } = await import(path.join(tmp, "bureau.mjs"));

/* ── Mise en page ─────────────────────────────────────────────────────── */
const e = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const STYLE = `
@page{size:A4 portrait;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',-apple-system,'Segoe UI',sans-serif;color:#12231C;background:#fff;
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

/* Pages interieures */
.band{background:#082F22;color:#fff;padding:8mm 16mm;display:flex;align-items:center;gap:5mm}
.band img{width:14mm;height:14mm}
.band div{flex:1}
.band small{display:block;font-size:8px;font-weight:800;letter-spacing:.28em;
  text-transform:uppercase;color:#E8CE72}
.band h2{font-size:20px;font-weight:900;font-family:Georgia,serif;color:#fff;margin-top:1mm}
.band .n{font-size:9px;color:#9FBFB1}
.content{flex:1;padding:10mm 16mm 0}

.art{display:flex;gap:5mm;margin-bottom:7mm;break-inside:avoid}
.art .num{flex:none;width:10mm;height:10mm;border-radius:2.5mm;
  background:linear-gradient(135deg,#B8860B,#D4AF37);color:#06291D;
  font-family:Georgia,serif;font-weight:900;font-size:15px;
  display:flex;align-items:center;justify-content:center}
.art h3{font-size:13.5px;font-weight:800;color:#082F22;font-family:Georgia,serif}
.art p{font-size:10.5px;line-height:1.8;color:#3A4D45;margin-top:2mm}
.art ul{margin:2.5mm 0 0 5mm}
.art li{font-size:10.5px;line-height:1.8;color:#3A4D45;margin-bottom:1.2mm}

.poste{border-left:1mm solid #D4AF37;padding-left:4mm;margin-bottom:5mm;break-inside:avoid}
.poste b{font-size:11px;color:#082F22}
.poste u{display:block;text-decoration:none;font-size:12px;font-weight:800;color:#0F7C55;margin-top:.6mm}
.poste p{font-size:10px;line-height:1.7;color:#5C7268;margin-top:1mm}
.poste .adj{font-size:9.5px;color:#7C8F86;margin-top:1.2mm}

.sign{margin:0 16mm;padding:6mm;border:.4mm solid rgba(212,175,55,.5);border-radius:3mm;
  background:linear-gradient(135deg,rgba(15,124,85,.05),rgba(212,175,55,.08))}
.sign p{font-size:10.5px;color:#3A4D45;line-height:1.7}
.sign .grid{display:flex;gap:6mm;margin-top:5mm;flex-wrap:wrap}
.sign .grid div{flex:1;min-width:38mm;border-top:.3mm solid rgba(212,175,55,.6);padding-top:2mm}
.sign .grid small{display:block;font-size:8px;font-weight:800;letter-spacing:.14em;
  text-transform:uppercase;color:#B8860B}
.sign .grid b{font-size:10.5px;color:#082F22}

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

/** Repartit les articles en pages, pour qu'aucune ne deborde. */
function pagesArticles(articles, titre, parPage) {
  const lots = [];
  for (let i = 0; i < articles.length; i += parPage) lots.push(articles.slice(i, i + parPage));
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

const poste = (p) => `
<div class="poste">
  <b>${e(p.titre)}</b>
  <u>${e(p.titulaire)}</u>
  <p>${e(p.role)}</p>
  ${p.adjoints?.length ? `<div class="adj">${p.adjoints.map(e).join(" · ")}</div>` : ""}
</div>`;

const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
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

${pagesArticles(REGLEMENT, "Règlement Intérieur", 4)}
${pagesArticles(STATUTS, "Statuts Officiels", 5)}

<div class="page">
  ${bandeau("Le Bureau", "Composition officielle")}
  <div class="content">
    ${PRESIDENCE.map(poste).join("")}
    ${SECRETARIATS.map(poste).join("")}
  </div>
  ${pied("Le Bureau")}
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
fs.writeFileSync(path.join(SORTIE, "reglement-ksn.html"), html);

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
const b = await puppeteer.launch({
  executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const p = await b.newPage();
await p.goto("http://localhost:4620/reglement-ksn.html", { waitUntil: "networkidle2" });
const logoOk = await p.evaluate(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
await p.pdf({ path: path.join(SORTIE, "reglement-ksn.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });
const pages = fs.readFileSync(path.join(SORTIE, "reglement-ksn.pdf")).toString("latin1").match(/\/Type\s*\/Page[^s]/g)?.length ?? 0;
console.log(`\nPDF écrit : ${path.join(SORTIE, "reglement-ksn.pdf")}`);
console.log(`Pages : ${pages} · Sceau chargé : ${logoOk ? "oui" : "NON"}`);
await b.close();
srv.close();
fs.rmSync(tmp, { recursive: true, force: true });
