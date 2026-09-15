// Verifie que « Envoyer au President » produit un PDF qui contient vraiment
// le document — et pas une feuille blanche.
//
// Pourquoi ce script existe : la conversion HTML -> PDF se fait dans le
// navigateur, en photographiant le document rendu. Tout peut sembler marcher
// — pas d'erreur, un fichier telecharge, un poids plausible — alors que la
// page est vide, que le sceau manque, ou qu'il ne reste qu'une feuille sur
// deux. Rien de cela ne se voit sans ouvrir le fichier.
//
// On va donc jusqu'au bout : on genere le PDF avec le VRAI code
// (lib/partage-document.ts), on en ressort l'image qu'il contient, et on
// compte les pixels.
//
//   node scripts/verifier-partage.mjs [dossier-de-sortie]

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SORTIE = path.resolve(process.argv[2] ?? path.join(RACINE, "build-partage"));
const CHROME =
  process.env.CHROME_PATH ??
  ["/opt/pw-browsers/chromium/chrome-linux/chrome", "/opt/pw-browsers/chromium"].find((p) =>
    fs.existsSync(p)
  );

const A4_L = 210, A4_H = 297;
let ok = 0, ko = 0;
const dit = (bon, texte) => (bon ? (ok++, console.log("  ✅", texte)) : (ko++, console.log("  ❌", texte)));

/* ── Compilation du vrai code ──────────────────────────────────────────── */
const tmp = fs.mkdtempSync(path.join(RACINE, "node_modules/.cache-ksn-part-"));
process.on("exit", () => fs.rmSync(tmp, { recursive: true, force: true }));
execFileSync(
  path.join(RACINE, "node_modules/.bin/tsc"),
  ["lib/partage-document.ts", "lib/impression.ts", "--outDir", tmp, "--module", "esnext",
   "--target", "es2022", "--moduleResolution", "bundler", "--skipLibCheck"],
  { cwd: RACINE, stdio: "inherit" }
);
for (const f of fs.readdirSync(tmp).filter((f) => f.endsWith(".js"))) {
  const p = path.join(tmp, f);
  fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace(/from "(\.\/[^"]+)"/g, 'from "$1.mjs"'));
  fs.renameSync(p, p.replace(/\.js$/, ".mjs"));
}

/* ── Des bouchons pour Firebase ────────────────────────────────────────
   lib/impression.ts tire quelques helpers de modules qui, eux, importent le
   SDK Firebase. Dans un navigateur, « firebase/firestore » ne se resout pas :
   il n'y a pas de node_modules. Aucune de ces fonctions n'est appelee ici — on
   ne fabrique qu'un document — donc on sert des bouchons portant exactement
   les noms importes. Si un jour du code d'impression appelait vraiment
   Firestore, le bouchon leverait, et ce serait la bonne nouvelle : cela
   n'aurait rien a faire la. */
const NOMS = new Map();
for (const f of fs.readdirSync(tmp).filter((f) => f.endsWith(".mjs"))) {
  const src = fs.readFileSync(path.join(tmp, f), "utf8");
  for (const m of src.matchAll(/import\s*\{([^}]*)\}\s*from\s*"(firebase\/[^"]+)"/g)) {
    const liste = NOMS.get(m[2]) ?? new Set();
    for (const n of m[1].split(",")) {
      const propre = n.trim().split(/\s+as\s+/)[0].trim();
      if (propre) liste.add(propre);
    }
    NOMS.set(m[2], liste);
  }
}
const bouchon = (mod) =>
  [...(NOMS.get(mod) ?? [])]
    .map((n) => `export const ${n} = () => { throw new Error("${mod}.${n} ne doit pas être appelé pendant la fabrication d'un document"); };`)
    .join("\n") || "export default {};";

/* ── Un serveur minimal : le module a besoin d'une vraie origine ───────── */
const TYPES = { ".mjs": "text/javascript", ".js": "text/javascript", ".png": "image/png", ".html": "text/html" };
const servir = (res, fichier) => {
  // Certains paquets (fast-png) emettent des imports relatifs SANS extension :
  // Node les resout, le navigateur non. On complete ici plutot que de renvoyer
  // un 404 qui ferait echouer tout le chargement.
  if (!fs.existsSync(fichier) && fs.existsSync(`${fichier}.js`)) fichier += ".js";
  if (!fs.existsSync(fichier)) { res.writeHead(404).end("introuvable"); return; }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(fichier)] ?? "application/octet-stream" });
  res.end(fs.readFileSync(fichier));
};

/* ── Resolution des paquets npm pour le navigateur ─────────────────────
   Le navigateur ne connait pas node_modules : « import "jspdf" » n'y veut
   rien dire. On lui fabrique donc une carte d'imports, en lisant dans chaque
   package.json quelle est sa version ESM pour navigateur. Ajouter un paquet
   ici tient en un mot, au lieu d'un chemin a deviner. */
const PAQUETS = ["pako", "iobuffer", "fast-png", "jspdf", "html2canvas-pro", "fflate"];
/** Fichier d'entree ESM d'un paquet, relatif a sa racine. */
const entreePaquet = (nom) => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(RACINE, "node_modules", nom, "package.json"), "utf8")
  );
  const e = pkg.exports?.["."];
  const cible =
    (typeof e === "string" ? e : null) ??
    e?.browser ?? e?.import?.default ?? e?.import ?? e?.default ??
    pkg.module ?? pkg.main;
  if (typeof cible !== "string") throw new Error(`${nom} : pas de version ESM trouvée`);
  return cible.replace(/^\.\//, "");
};
// L'adresse servie GARDE l'arborescence du paquet : un module qui importe
// « ./PngDecoder.js » doit le trouver a cote de lui. En servant tout a plat,
// ces imports relatifs pointeraient a la racine et ne resoudraient rien.
const CARTE = Object.fromEntries(PAQUETS.map((n) => [n, `/nm/${n}/${entreePaquet(n)}`]));
CARTE["@babel/runtime/helpers/"] = "/babel/";

const PAGE = `<!DOCTYPE html><html><head><meta charset="utf-8">
<!-- jsPDF, compile pour Node autant que pour le navigateur, interroge
     process.env au chargement. Dans le site, le bundler le remplace ; ici,
     il faut le poser a la main, sinon le module echoue avant meme d'exporter
     quoi que ce soit. -->
<script>window.process = { env: {} };</script>
<script type="importmap">${JSON.stringify({ imports: {
  ...CARTE,
  "firebase/app": "/bouchon/firebase-app.mjs",
  "firebase/auth": "/bouchon/firebase-auth.mjs",
  "firebase/firestore": "/bouchon/firebase-firestore.mjs",
  "firebase/storage": "/bouchon/firebase-storage.mjs",
} })}</script></head><body>
<script type="module">
  import * as I from "/mod/impression.mjs";
  import * as P from "/mod/partage-document.mjs";
  window.I = I; window.P = P; window.pret = true;
</script></body></html>`;

const serveur = http.createServer((req, res) => {
  const u = req.url.split("?")[0];
  if (u === "/") { res.writeHead(200, { "Content-Type": "text/html" }); res.end(PAGE); return; }
  if (u.startsWith("/mod/")) return servir(res, path.join(tmp, u.slice(5)));
  if (u.startsWith("/bouchon/")) {
    const mod = "firebase/" + u.slice("/bouchon/firebase-".length).replace(/\.mjs$/, "");
    res.writeHead(200, { "Content-Type": "text/javascript" });
    res.end(bouchon(mod));
    return;
  }
  if (u.startsWith("/nm/")) return servir(res, path.join(RACINE, "node_modules", u.slice(4)));
  // html2canvas-pro s'appuie sur les helpers Babel. Le navigateur ne sait pas
  // les resoudre : on les sert depuis leur variante ESM, la seule qu'il sache
  // importer (les .js a la racine du paquet sont en CommonJS).
  if (u.startsWith("/babel/")) {
    const f = path.join(RACINE, "node_modules/@babel/runtime/helpers/esm", u.slice("/babel/".length));
    return servir(res, f.endsWith(".js") ? f : `${f}.js`);
  }
  if (u === "/favicon.ico") { res.writeHead(204).end(); return; }
  return servir(res, path.join(RACINE, "public", u));
});
await new Promise((r) => serveur.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${serveur.address().port}`;

// AVERTISSEMENT — LES NUMEROS DE CE FICHIER SONT FICTIFS.
// Ils ont la forme +221 77 000 00 0X, qu'aucune ligne reelle ne porte. Deux
// vrais numeros de responsables avaient servi de donnees d'essai ici, dont
// l'un attribue au mauvais nom. Un jeu d'essai n'a aucun besoin d'un numero
// qui sonne quelque part : il lui faut la bonne FORME, pas la bonne personne.
// Les vrais numeros vivent a un seul endroit, cote serveur :
// app/api/commission-contacts/route.ts

/* ── Le jeu d'essai : un dossier rempli, pas un squelette ──────────────── */
const ligne = (t) => ({ id: Math.random().toString(36).slice(2), texte: t });
const dossier = {
  commission: "education-culture",
  responsable: "Mame Cheikh Anta Sall",
  telephone: "+221 77 000 00 01",
  membres: "18",
  activites: [ligne("Récitation collective du Salaatu chaque vendredi, suivie d'un enseignement sur les Khassidas."), ligne("Deux conférences publiques"), ligne("Cours du samedi matin")],
  difficultes: [ligne("Manque de salles"), ligne("Transport des intervenants")],
  salaatu: "1 250 000",
  salaatuPrecisions: "Relevé arrêté au 10 septembre.",
  cellules: [ligne("Les cellules de quartier fonctionnent, celles de la banlieue non.")],
  propositions: [{ id: "p1", titre: "Sonorisation", detail: "Louer une sonorisation professionnelle", moyens: "250 000 FCFA" }],
  divers: [ligne("Prévoir des chaises supplémentaires")],
  statut: "valide", transmisAt: Date.now(), transmisPar: "Responsable",
  valideAt: Date.now(), validePar: "Secrétariat", updatedAt: Date.now(), updatedBy: "X",
};

/* Un versement recu et une feuille de route : ce sont les deux autres
   documents qu'un responsable de commission envoie depuis son espace. */
const versement = {
  id: "v1", de: "finances", vers: "organisation", montant: 150000,
  motif: "Dotation pour la Journée Salaatu 'Alaa Nabii",
  moyen: "Espèces", reference: "", date: "2026-09-10",
  envoyePar: "Serigne Massamba Mbaye", envoyeAt: Date.now(),
  statut: "recu", recuPar: "Serigne Saliou Lô", recuAt: Date.now(),
  observation: "Reçu en espèces, remis au trésorier de la commission",
  ecritureEmetteur: "e1", ecritureDestinataire: "e2",
  annulePar: "", annuleAt: 0, motifAnnulation: "",
};

const taches = [
  ["Louer la sonorisation (2 enceintes + micro)", "Serigne Assane Samb", "+221 77 000 00 02", "2026-09-16", 75000, 75000, "fait", "Fournisseur habituel de Tuuba Saam"],
  ["Monter les tentes et installer les nattes", "Moustapha Diagne", "+221 77 000 00 05", "2026-09-18", 40000, 0, "en_cours", ""],
  ["Transport des invités depuis Dakar", "Cheikh Fall", "", "2026-09-18", 120000, 60000, "en_cours", "Deux cars réservés"],
  ["Repas de l'assemblée — 300 couverts", "Sokhna Bineta Sow", "+221 77 000 00 06", "2026-09-19", 250000, 0, "a_faire", ""],
  ["Groupe électrogène de secours", "Ibrahima Ndoye", "", "2026-09-10", 60000, 0, "bloque", "Le loueur n'a pas confirmé"],
  ["Affiches et banderole d'accueil", "Serigne Birima Gueye", "", "", 30000, 28500, "fait", ""],
].map(([libelle, responsable, responsableTelephone, echeance, budget, depense, statut, detail], i) => ({
  id: `t${i}`, commission: "organisation", libelle, detail, responsable,
  responsableTelephone, echeance, budget, depense, statut,
  createdAt: Date.now() - i * 1000, createdBy: "Organisation", updatedAt: Date.now(),
}));

const navigateur = await puppeteer.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const page = await navigateur.newPage();
// Une erreur de module se produit AVANT tout appel : sans cette écoute, le
// script se contenterait d'expirer sans dire pourquoi.
page.on("pageerror", (e) => console.error("  ⚠ erreur de page :", e.message));
page.on("console", (m) => { if (m.type() === "error") console.error("  ⚠ console :", m.text()); });
page.on("requestfailed", (r) => console.error("  ⚠ requête échouée :", r.url(), r.failure()?.errorText));
page.on("response", (r) => { if (r.status() >= 400) console.error("  ⚠", r.status(), r.url()); });
await page.goto(BASE, { waitUntil: "networkidle0" });
await page.waitForFunction("window.pret === true", { timeout: 20000 });

fs.mkdirSync(SORTIE, { recursive: true });

async function fabriquer(nomTest, expression, feuillesAttendues) {
  console.log(`\n── ${nomTest} ──`);
  const res = await page.evaluate(async (expr) => {
    try {
      const html = eval(expr);
      const feuilles = (html.match(/class="page/g) || []).length;
      const blob = await window.P.pdfDepuisHtml(html);
      const buf = new Uint8Array(await blob.arrayBuffer());
      let bin = ""; for (const o of buf) bin += String.fromCharCode(o);
      return { ok: true, feuilles, b64: btoa(bin), taille: buf.length };
    } catch (e) {
      return { ok: false, erreur: String(e && e.stack || e) };
    }
  }, expression);

  if (!res.ok) { dit(false, `La génération a échoué : ${res.erreur}`); return; }

  const pdf = Buffer.from(res.b64, "base64");
  fs.writeFileSync(path.join(SORTIE, `${nomTest}.pdf`), pdf);
  dit(true, `PDF produit (${Math.round(res.taille / 1024)} Ko)`);

  const brut = pdf.toString("latin1");
  const compte = Number((brut.match(/\/Count\s+(\d+)/) || [])[1] ?? 0);
  dit(compte === feuillesAttendues,
    `${feuillesAttendues} page${feuillesAttendues > 1 ? "s" : ""} dans le PDF (obtenu : ${compte})`);
  // Une feuille `.page` du HTML n'a pas de hauteur fixe : elle peut valoir
  // plusieurs pages une fois posee sur de l'A4. Ce qu'on verifie, c'est
  // qu'aucune ne s'est PERDUE — jamais moins de pages que de feuilles.
  dit(compte >= res.feuilles && res.feuilles > 0,
    `Les ${res.feuilles} feuille${res.feuilles > 1 ? "s" : ""} du document tiennent sur ${compte} page${compte > 1 ? "s" : ""} A4`);

  /* L'image embarquee : c'est elle qui porte le document. On la ressort du
     PDF et on la regarde vraiment. */
  const images = [];
  let i = 0;
  while (true) {
    const d = brut.indexOf("/DCTDecode", i);
    if (d === -1) break;
    const s = brut.indexOf("stream", d);
    const f = brut.indexOf("endstream", s);
    if (s === -1 || f === -1) break;
    let debut = s + "stream".length;
    while (brut[debut] === "\r" || brut[debut] === "\n") debut++;
    images.push(pdf.subarray(debut, f));
    i = f;
  }
  dit(images.length === compte,
    `Chaque page du PDF porte son image (${images.length} pour ${compte} pages)`);
  if (!images.length) return;

  /* On regarde CHAQUE page, pas seulement la premiere : c'est sur la derniere
     qu'une erreur de decoupe se voit. */
  const mesures = [];
  for (const img of images) {
    mesures.push(await page.evaluate(async (b64) => {
      const image = new Image();
      image.src = "data:image/jpeg;base64," + b64;
      await image.decode();
      const c = document.createElement("canvas");
      c.width = image.naturalWidth; c.height = image.naturalHeight;
      const g = c.getContext("2d");
      g.drawImage(image, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      let encre = 0, vertFonce = 0;
      const bandeHaute = Math.floor(c.height * 0.12);
      for (let p = 0; p < d.length; p += 4) {
        const r = d[p], v = d[p + 1], b = d[p + 2];
        if (r < 235 || v < 235 || b < 235) encre++;
        const y = Math.floor(p / 4 / c.width);
        if (y < bandeHaute && r < 90 && v > r && v < 140 && b < 110) vertFonce++;
      }
      return {
        l: c.width, h: c.height,
        encre: encre / (d.length / 4),
        vertFonce: vertFonce / (c.width * bandeHaute),
      };
    }, img.toString("base64")));
  }

  const A4 = A4_H / A4_L;
  dit(mesures.every((m) => m.l > 1000),
    `Chaque page fait au moins 1 000 px de large (${mesures.map((m) => m.l).join(", ")}) — lisible et imprimable`);
  // LE controle qui compte. Une feuille plus haute qu'une A4 posee sur une A4
  // serait ECRASEE : le document sortirait tasse, et rien ne le dirait.
  dit(mesures.every((m) => m.h / m.l <= A4 + 0.02),
    `Aucune page n'est écrasée — proportions ${mesures.map((m) => (m.h / m.l).toFixed(3)).join(", ")} contre ${A4.toFixed(3)} pour une A4`);
  dit(mesures.every((m) => m.encre > 0.01),
    `Aucune page blanche : ${mesures.map((m) => (m.encre * 100).toFixed(0) + " %").join(", ")} de surface encrée`);
  dit(mesures[0].vertFonce > 0.3,
    `L'en-tête officielle est bien là — ${(mesures[0].vertFonce * 100).toFixed(0)} % de vert du Dahira en haut de la première page`);
}

await fabriquer("dossier-education", `window.I.htmlDossier(${JSON.stringify(dossier)}, "education-culture")`, 2);
await fabriquer("fiche-vierge", `window.I.htmlFicheVierge("organisation")`, 1);
await fabriquer("recu-versement", `window.I.htmlRecuVersement(${JSON.stringify(versement)})`, 1);
await fabriquer("feuille-de-route", `window.I.htmlPreparation(${JSON.stringify(taches)}, "Organisation")`, 1);

console.log("\n── Nom du fichier joint ──");
const noms = await page.evaluate(() => [
  window.P.nomDeFichier("Dossier — Éducation & Culture"),
  window.P.nomDeFichier(""),
]);
dit(/^dossier-education-culture-\d{4}-\d{2}-\d{2}\.pdf$/.test(noms[0]),
  `Sans accent ni espace, daté : ${noms[0]}`);
dit(noms[1].startsWith("document-"), `Un titre vide donne quand même un nom valable : ${noms[1]}`);

await navigateur.close();
serveur.close();
console.log(`\nFichiers dans ${SORTIE}`);
console.log(`\n═══ ${ok} réussis, ${ko} échoués ═══`);
process.exit(ko ? 1 : 0);
