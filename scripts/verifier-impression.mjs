// Verifie les documents imprimables de lib/impression.ts SANS navigateur ouvert
// a la main : on rend chaque document en PDF avec Chromium et on controle ce
// qui compte — le nombre de feuilles, la presence du sceau, celle de l'en-tete.
//
// Pourquoi : l'impression est la seule partie du site dont le resultat ne se
// voit pas a l'ecran. Un depassement d'un millimetre ajoute une page blanche,
// et personne ne s'en apercoit avant d'avoir imprime six exemplaires.
//
//   npm install --no-save puppeteer-core
//   node scripts/verifier-impression.mjs [dossier-de-sortie]

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SORTIE = path.resolve(process.argv[2] ?? path.join(RACINE, "build-impression"));
const CHROME =
  process.env.CHROME_PATH ??
  ["/opt/pw-browsers/chromium/chrome-linux/chrome", "/opt/pw-browsers/chromium"].find((p) =>
    fs.existsSync(p)
  );

/* ── Compilation a la volee de lib/impression.ts et de ses dependances ── */
// La compilation atterrit SOUS node_modules : les fichiers produits importent
// `firebase/firestore`, que Node ne resout que depuis l'arborescence du projet.
const tmp = fs.mkdtempSync(path.join(RACINE, "node_modules/.cache-ksn-impr-"));
process.on("exit", () => fs.rmSync(tmp, { recursive: true, force: true }));
execFileSync(
  path.join(RACINE, "node_modules/.bin/tsc"),
  ["lib/impression.ts", "--outDir", tmp, "--module", "esnext", "--target", "es2022",
   "--moduleResolution", "bundler", "--skipLibCheck"],
  { cwd: RACINE, stdio: "inherit" }
);
// tsc emet des imports sans extension : ESM les refuse. On renomme et on
// recrit les chemins relatifs.
for (const f of fs.readdirSync(tmp).filter((f) => f.endsWith(".js"))) {
  const p = path.join(tmp, f);
  fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace(/from "(\.\/[^"]+)"/g, 'from "$1.mjs"'));
  fs.renameSync(p, p.replace(/\.js$/, ".mjs"));
}
const I = await import(path.join(tmp, "impression.mjs"));

/* ── Jeux d'essai : le pire cas, pas le cas facile ────────────────────── */
const ligne = (t) => ({ id: Math.random().toString(36).slice(2), texte: t });
const long = "Récitation collective du Salaatu chaque vendredi après la prière, "
  + "suivie d'un enseignement sur les Khassidas et d'un temps d'échange avec les cellules.";

const dossier = {
  commission: "education-culture",
  responsable: "Serigne Mame Cheikh Anta Sall",
  telephone: "+221 76 438 28 84",
  membres: "18",
  activites: [ligne(long), ligne("Deux conférences publiques"), ligne("Cours du samedi matin")],
  difficultes: [ligne("Manque de salles"), ligne("Transport des intervenants")],
  cellules: [ligne("Les cellules de quartier fonctionnent, celles de la banlieue non.")],
  divers: [ligne("Prévoir une sonorisation")],
  propositions: [
    { id: "p1", titre: "Veillée de Salaatu la veille", detail: long, moyens: "Sonorisation, thé, nattes" },
    { id: "p2", titre: "Concours de Khassidas", detail: "Ouvert aux jeunes des cellules.", moyens: "Prix, jury" },
  ],
  salaatu: "1250000",
  salaatuPrecisions: "Relevé du 1er janvier au 31 août 2026",
  statut: "transmis",
  updatedAt: Date.now(),
};

const rapport = {
  id: "r1", commission: "organisation", responsable: "Serigne Assane Samb",
  telephone: "+221 76 528 59 11", membres: 30,
  activites: long + "\n" + long, difficultes: "Le matériel arrive tard.",
  salaatu: null, salaatuPrecisions: "",
  cellulesActives: 4, cellules: "Les cellules doivent être relancées.",
  propositions: "Monter les tentes la veille.", moyens: "Deux camions",
  divers: "", createdAt: Date.now(),
};

const suivi = [
  ["education-culture", "Éducation et Culture", "Serigne Mame Cheikh Anta Sall", Date.now(), 0, "valide", 1250000],
  ["finances", "Finances", "Serigne Massamba Mbaye", Date.now(), 0, "transmis", null],
  ["social-developpement", "Social et Développement", "Serigne Cheikhouna Sock", 0, Date.now(), "brouillon", null],
  ["organisation", "Organisation", "Serigne Assane Samb", Date.now(), 0, "transmis", null],
  ["communication", "Communication", "Serigne Birima Gueye", 0, 0, "brouillon", null],
  ["secretariat-administratif", "Secrétariat et Administratif", "Sokhna Khady Ndiaye", Date.now(), 0, "valide", null],
].map(([slug, nom, responsable, recuAt, relanceAt, statut, salaatu]) => ({
  slug, nom, responsable, recuAt, relanceAt, statut, salaatu,
}));

const versement = (vers, statut, extra = {}) => ({
  id: vers + statut, de: "finances", vers, montant: 150000,
  motif: "Dotation Journée Salaatu 'Alaa Nabii", moyen: "Wave", reference: "TX-884213",
  date: "2026-09-10", statut, envoyePar: "Serigne Massamba Mbaye", envoyeAt: Date.now(),
  ecritureEmetteur: "e1", recuPar: "", recuAt: 0, observation: "",
  ecritureDestinataire: "", annulePar: "", annuleAt: 0, motifAnnulation: "", ...extra,
});
const versements = [
  versement("organisation", "recu", { recuPar: "Serigne Assane Samb", recuAt: Date.now(), observation: "Reçu en espèces, remis au trésorier" }),
  versement("education-culture", "envoye"),
  versement("communication", "annule", { annulePar: "Trésorier", annuleAt: Date.now(), motifAnnulation: "Erreur de montant" }),
  versement("social-developpement", "recu", { montant: 75000, recuPar: "Serigne Cheikhouna Sock", recuAt: Date.now() }),
];

const ventes = [
  {
    id: "v1", commission: "social-developpement", numero: "FA-2026-0007",
    date: "2026-09-12", clientNom: "Sokhna Aminata Fall", clientTelephone: "+221 77 123 45 67",
    lignes: [
      { designation: "Café Touba moulu — sachet 250 g", quantite: 12, prixUnitaire: 2500 },
      { designation: "Thé Kinkeliba — boîte", quantite: 3, prixUnitaire: 4000 },
      { designation: "Khassida relié (grand format)", quantite: 1, prixUnitaire: 15000 },
    ],
    total: 57000, moyen: "Wave", note: "Livraison prévue lundi à Tuuba Saam.",
    createdAt: Date.now(), createdBy: "Boutique KSN", ecritureId: "e1",
    annulee: false, annuleePar: "", annuleeAt: 0, motifAnnulation: "",
  },
  {
    id: "v2", commission: "social-developpement", numero: "FA-2026-0008",
    date: "2026-09-13", clientNom: "", clientTelephone: "",
    lignes: [{ designation: "Café Touba — tasse", quantite: 40, prixUnitaire: 200 }],
    total: 8000, moyen: "Espèces", note: "",
    createdAt: Date.now(), createdBy: "Boutique KSN", ecritureId: "e2",
    annulee: false, annuleePar: "", annuleeAt: 0, motifAnnulation: "",
  },
  {
    id: "v3", commission: "social-developpement", numero: "FA-2026-0009",
    date: "2026-09-13", clientNom: "Serigne Modou", clientTelephone: "",
    lignes: [{ designation: "Tissu brodé", quantite: 1, prixUnitaire: 25000 }],
    total: 25000, moyen: "Orange Money", note: "",
    createdAt: Date.now(), createdBy: "Boutique KSN", ecritureId: "e3",
    annulee: true, annuleePar: "Responsable", annuleeAt: Date.now(),
    motifAnnulation: "Article rendu par le client",
  },
];

const commande = {
  id: "a1b2c3d4e5f6", customerName: "Ibrahima Diop", customerPhone: "+221 76 000 00 00",
  customerEmail: "", deliveryAddress: "Quartier Darou Khoudoss, Touba",
  paymentMethod: "wave", transactionId: "TXN-99182736", total: 31000, status: "pending",
  createdAt: Date.now(),
  items: [
    { productId: "p1", title: "Recueil de Khassidas", category: "book", price: 15000, quantity: 1 },
    { productId: "p2", title: "Café Touba — sachet 250 g", category: "physical", price: 2000, quantity: 8 },
  ],
};

const taches = [
  ["Louer la sonorisation (2 enceintes + micro)", "Serigne Assane Samb", "+221 76 528 59 11", "2026-09-16", 75000, 75000, "fait", "Fournisseur habituel de Tuuba Saam"],
  ["Monter les tentes et installer les nattes", "Moustapha Diagne", "+221 77 000 11 22", "2026-09-18", 40000, 0, "en_cours", ""],
  ["Transport des invités depuis Dakar", "Cheikh Fall", "", "2026-09-18", 120000, 60000, "en_cours", "Deux cars réservés"],
  ["Repas de l'assemblée — 300 couverts", "Sokhna Bineta Sow", "+221 76 333 44 55", "2026-09-19", 250000, 0, "a_faire", ""],
  ["Groupe électrogène de secours", "Ibrahima Ndoye", "", "2026-09-10", 60000, 0, "bloque", "Le loueur n'a pas confirmé"],
  ["Affiches et banderole d'accueil", "Serigne Birima Gueye", "", "", 30000, 28500, "fait", ""],
].map(([libelle, responsable, responsableTelephone, echeance, budget, depense, statut, detail], i) => ({
  id: `t${i}`, commission: "organisation", libelle, detail, responsable,
  responsableTelephone, echeance, budget, depense, statut,
  createdAt: Date.now() - i * 1000, createdBy: "Organisation", updatedAt: Date.now(),
}));

const compteRendu = {
  id: "cr", titre: "Assemblée Générale du 19 septembre 2026",
  date: "19 septembre 2026", lieu: "Tuuba Saam Kër Sëriñ Basiiru Ture",
  presidence: "Le Président", secretaire: "Sokhna Khady Ndiaye",
  presents: "Les six commissions", excuses: "—",
  points: [
    { id: "1", titre: "Compte rendu des commissions", resume: long, decisions: "Adopté", responsable: "Secrétariat", echeance: "30/09" },
    { id: "2", titre: "Bilan provisoire", resume: "1 250 000 Salaatu relevés.", decisions: "", responsable: "", echeance: "" },
  ],
  divers: "Prochaine réunion le 3 octobre.", publie: true, createdAt: Date.now(),
};

/* ── Ce qu'on attend de chaque document ───────────────────────────────── */
const DOCUMENTS = [
  ["dossier", I.htmlDossier(dossier, "education-culture", {
    solde: 320000, entrees: 500000, sorties: 180000,
    activites: { lots: 3, cout: 120000, recette: 260000, marge: 140000, invendus: 12 },
    aides: { total: 45000, nombre: 3 },
  }), { max: 2 }],
  ["fiche-vierge", I.htmlFicheVierge("education-culture"), { exact: 1 }],
  ["fiche-vierge-sans-salaatu", I.htmlFicheVierge("organisation"), { exact: 1 }],
  ["rapport-recu", I.htmlRapport(rapport), { max: 2 }],
  ["suivi-commissions", I.htmlSuivi(suivi), { exact: 1 }],
  ["registre-versements", I.htmlVersements(versements, "Toutes les commissions"), { exact: 1 }],
  ["recu-versement-en-attente", I.htmlRecuVersement(versements[1]), { exact: 1 }],
  ["recu-versement-accuse", I.htmlRecuVersement(versements[0]), { exact: 1 }],
  ["facture-vente", I.htmlFacture(I.factureDeVente(ventes[0], "Commission Social et Développement")), { exact: 1 }],
  ["facture-annulee", I.htmlFacture(I.factureDeVente(ventes[2], "Commission Social et Développement")), { exact: 1 }],
  ["facture-commande", I.htmlFacture(I.factureDeCommande(commande)), { exact: 1 }],
  ["journal-ventes", I.htmlJournalVentes(ventes, "Social et Développement"), { exact: 1 }],
  // Une feuille de route s'allonge avec la journee qu'elle prepare : elle a le
  // droit de courir sur deux feuilles, a condition que les titres de colonnes
  // suivent (cf. table.reg thead dans lib/impression.ts).
  ["feuille-de-route", I.htmlPreparation(taches, "Organisation"), { max: 2 }],
  ["compte-rendu", I.htmlCompteRendu(compteRendu), { max: 2 }],
];

let ok = 0, ko = 0;
const dit = (bon, texte) => (bon ? (ok++, console.log("  ✅", texte)) : (ko++, console.log("  ❌", texte)));

/* ── Le montant en toutes lettres ─────────────────────────────────────── */
// Une facture porte la somme en chiffres ET en lettres. Une erreur ici passe
// inapercue a la relecture — personne ne verifie « quatre-vingts » a l'oeil.
{
  const { enLettres } = await import(path.join(tmp, "montant-lettres.mjs"));
  const attendus = [
    [0, "zéro"], [1, "un"], [21, "vingt-et-un"], [71, "soixante-et-onze"],
    [80, "quatre-vingts"], [81, "quatre-vingt-un"], [91, "quatre-vingt-onze"],
    [100, "cent"], [200, "deux cents"], [203, "deux cent trois"],
    [1000, "mille"], [2000, "deux mille"],
    [57000, "cinquante-sept mille"],
    [375000, "trois cent soixante-quinze mille"],
    [1250000, "un million deux cent cinquante mille"],
  ];
  console.log("\nMontants en toutes lettres");
  for (const [n, mot] of attendus) {
    const rendu = enLettres(n);
    dit(rendu === mot, `${n} → ${rendu}${rendu === mot ? "" : ` (attendu : ${mot})`}`);
  }
}

/* ── Rendu ────────────────────────────────────────────────────────────── */
fs.mkdirSync(SORTIE, { recursive: true });
for (const [nom, html] of DOCUMENTS) fs.writeFileSync(path.join(SORTIE, `${nom}.html`), html);

// Le sceau est reference en /logo/ksn-logo.png : il faut servir public/.
const serveur = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  const candidats = [path.join(SORTIE, url.slice(1)), path.join(RACINE, "public", url)];
  const f = candidats.find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
  if (!f) return (res.statusCode = 404), res.end("introuvable");
  res.setHeader(
    "Content-Type",
    f.endsWith(".png") ? "image/png" : f.endsWith(".html") ? "text/html; charset=utf-8" : "application/octet-stream"
  );
  res.end(fs.readFileSync(f));
});
await new Promise((r) => serveur.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${serveur.address().port}`;

const navigateur = await puppeteer.launch({
  executablePath: CHROME,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

/** Compte les feuilles d'un PDF.
 *  Chromium comprime les objets, donc « /Type /Page » n'est pas lisible en
 *  clair ; l'arbre des pages, lui, porte un « /Count N » qui ne l'est pas. */
function pages(pdf) {
  // page.pdf() rend un Uint8Array : son .toString() liste les octets. D'ou le
  // Buffer.from, sans quoi la recherche ne trouve jamais rien.
  const octets = Buffer.from(pdf).toString("latin1");
  const comptes = [...octets.matchAll(/\/Count\s+(\d+)/g)].map((m) => +m[1]);
  return comptes.length ? Math.max(...comptes) : 0;
}

for (const [nom, , attendu] of DOCUMENTS) {
  const page = await navigateur.newPage();
  const manquants = [];
  // Le favicon n'est pas une ressource du document : Chromium le reclame tout
  // seul, et son absence ne change rien a ce qui sort de l'imprimante.
  const compte = (url) => !url.endsWith("/favicon.ico");
  page.on("requestfailed", (r) => compte(r.url()) && manquants.push(r.url()));
  page.on("response", (r) => r.status() >= 400 && compte(r.url()) && manquants.push(`${r.status()} ${r.url()}`));
  await page.goto(`${base}/${nom}.html`, { waitUntil: "networkidle0" });

  // Le sceau doit etre PEINT, pas seulement present dans le HTML.
  const sceau = await page.evaluate(() => {
    const img = document.querySelector("img.crest");
    return img ? img.complete && img.naturalWidth > 0 : false;
  });
  const entete = await page.evaluate(
    () => !!document.querySelector(".head h1") && !!document.querySelector(".foot")
  );

  // Une fiche tient sur une feuille grace a `overflow:hidden`. Le piege : quand
  // le contenu depasse, la derniere section est COUPEE sans un mot, et le
  // compteur de pages continue d'afficher 1. On mesure donc ce que le corps
  // contient reellement face a la place qu'il occupe.
  const deborde = await page.evaluate(() => {
    const corps = document.querySelector(".page.fiche .body");
    if (!corps) return 0;
    return +(corps.scrollHeight - corps.getBoundingClientRect().height).toFixed(1);
  });

  const pdf = await page.pdf({ format: "A4", printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  fs.writeFileSync(path.join(SORTIE, `${nom}.pdf`), pdf);
  const n = pages(pdf);

  console.log(`\n${nom} — ${n} page(s), ${(pdf.length / 1024).toFixed(0)} Ko`);
  dit(sceau, "le sceau est chargé");
  dit(entete, "l'en-tête officielle et le pied de page sont présents");
  dit(manquants.length === 0, `aucune ressource manquante${manquants.length ? ` (${manquants.join(", ")})` : ""}`);
  dit(deborde <= 1, `rien n'est coupé par le rognage${deborde > 1 ? ` (${(deborde / 96 * 25.4).toFixed(0)} mm perdus)` : ""}`);
  if (attendu.exact != null) dit(n === attendu.exact, `tient sur ${attendu.exact} feuille(s)`);
  if (attendu.max != null) dit(n >= 1 && n <= attendu.max, `au plus ${attendu.max} feuille(s)`);
  await page.close();
}

/* ── Le jeu complet des six fiches, servi tel quel depuis public/ ────── */
// Ce fichier ne passe pas par lib/impression.ts : c'est le document que le
// Secretariat imprime pour toute l'assemblee. Il merite le meme controle.
{
  const page = await navigateur.newPage();
  await page.goto(`${base}/fiches-ag-2026.html`, { waitUntil: "networkidle0" });
  await page.emulateMediaType("print");
  const feuilles = await page.evaluate(() =>
    [...document.querySelectorAll(".fiche")].map((f) => {
      const corps = f.querySelector(".body");
      return {
        titre: f.querySelector(".ribbon strong")?.textContent?.trim() || "Page de garde",
        coupe: corps ? corps.scrollHeight - corps.getBoundingClientRect().height : 0,
      };
    })
  );
  const pdf = await page.pdf({ format: "A4", printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  fs.writeFileSync(path.join(SORTIE, "fiches-ag-2026.pdf"), pdf);

  console.log(`\nfiches-ag-2026 (jeu complet) — ${pages(pdf)} page(s)`);
  dit(pages(pdf) === feuilles.length, `une feuille par fiche (${feuilles.length})`);
  const rognees = feuilles.filter((f) => f.coupe > 1);
  dit(
    rognees.length === 0,
    `aucune fiche rognée${rognees.length ? ` (${rognees.map((f) => f.titre).join(", ")})` : ""}`
  );
  await page.close();
}

await navigateur.close();
serveur.close();
console.log(`\n═══ ${ok} contrôles réussis, ${ko} échoués ═══`);
console.log(`Documents dans ${SORTIE}`);
process.exit(ko ? 1 : 0);
