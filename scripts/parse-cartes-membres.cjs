// Parse les cartes de membre extraites des 2 PDF (pdftotext -enc UTF-8)
// et produit un JSON prêt pour l'outil "Importer JSON" de l'admin KSN.
// Champs par carte : Prémon & Nom, Téléphone, Domicile, Matricule.
const fs = require("fs");
const path = require("path");

const DOCS = path.join("C:", "Users", "7MAKSACOD PC", "Desktop", "ksn-website", "docs");
const FILES = ["pdf01.txt", "pdf02.txt"];

// Coupe un nom "Prénom NOM" en {prenom, nom}. Heuristique : le dernier mot
// entièrement en MAJUSCULES marque le nom ; sinon le dernier mot = nom.
function splitName(full) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { prenom: "", nom: "" };
  if (parts.length === 1) return { prenom: parts[0], nom: "" };
  // Mots en MAJUSCULES (au moins 2 lettres) → nom de famille
  const upperIdx = parts.findIndex(
    (w, i) => i > 0 && w.length >= 2 && w === w.toUpperCase() && /[A-ZÀ-Þ]/.test(w)
  );
  if (upperIdx > 0) {
    return {
      prenom: parts.slice(0, upperIdx).join(" "),
      nom: parts.slice(upperIdx).join(" "),
    };
  }
  // Sinon : dernier mot = nom, le reste = prénom
  return {
    prenom: parts.slice(0, -1).join(" "),
    nom: parts[parts.length - 1],
  };
}

function cleanPhone(raw) {
  if (!raw) return "";
  return raw.replace(/\s+/g, " ").trim();
}

const members = [];
const anomalies = [];

// Les matricules sont attribués par POSITION de carte (PDF01 = 1..500,
// PDF02 = 501..765). Raison : le PDF02 (Canva) a glitché l'affichage du
// numéro (510→"5010", 600→"6100", 700→"7200"…) — l'ordre des cartes, lui,
// est fiable. Pour le PDF01 on recoupe avec le matricule lisible et on
// signale toute divergence.
let position = 0;

for (const file of FILES) {
  const full = fs.readFileSync(path.join(DOCS, file), "utf8");
  // Chaque carte commence par "CARTE DE MEMBRE"
  const chunks = full.split(/CARTE DE MEMBRE/g).slice(1);
  for (const chunk of chunks) {
    position++;
    // Aplatir en une ligne pour les regex à cheval sur plusieurs lignes
    const flat = chunk.replace(/\s+/g, " ").trim();

    // Nom : entre "Prémon & Nom" et "Téléphone"
    const nameM = flat.match(/Pr[ée]mon & Nom\s+(.*?)\s+T[ée]l[ée]phone/i);
    // Téléphone : entre "Téléphone" et "Domicile"
    const phoneM = flat.match(/T[ée]l[ée]phone\s*:?\s*(.*?)\s+Domicile/i);
    // Domicile : entre "Domicile" et "Matricule"
    const domM = flat.match(/Domicile\s+(.*?)\s+Matricule/i);
    // Matricule lisible (peut être glitché) — sert juste de contrôle
    const matM = flat.match(/Matricule\s*:?\s*([\d ]+)/i);

    const rawName = nameM ? nameM[1].trim() : "";
    const phone = cleanPhone(phoneM ? phoneM[1] : "");
    const domicile = domM ? domM[1].trim() : "";
    const matLu = matM ? matM[1].replace(/\s+/g, "") : "";

    // Matricule de référence = position de la carte, padé sur 4 chiffres
    const matPadded = String(position).padStart(4, "0");

    // Contrôle : pour le PDF01 le matricule lisible doit valoir la position
    if (file === "pdf01.txt" && matLu && parseInt(matLu, 10) !== position) {
      anomalies.push(
        `PDF01 position ${position} : matricule lu "${matLu}" ≠ position (carte: ${rawName})`
      );
    }
    if (!rawName) {
      anomalies.push(`Matricule ${matPadded} : nom illisible`);
    }

    const { prenom, nom } = splitName(rawName);

    members.push({
      matricule: matPadded,
      prenom,
      nom,
      telephone: phone || undefined,
      // Le PDF dit "Domicile" mais le site affiche le champ "Ville / Localité".
      // On mappe donc la localité vers `ville` (et on garde `domicile` aussi).
      ville: domicile || undefined,
      domicile: domicile || undefined,
      sourceUid: `carte-pdf-${matPadded}`, // clé de dé-doublonnage stable
    });
  }
}

const OUT = path.join(DOCS, "membres-import.json");
fs.writeFileSync(OUT, JSON.stringify(members, null, 2), "utf8");

// Rapport
console.log(`Total membres parsés : ${members.length}`);
console.log(`Premier : ${members[0].matricule} ${members[0].prenom} ${members[0].nom}`);
console.log(`Dernier : ${members[members.length - 1].matricule} ${members[members.length - 1].prenom} ${members[members.length - 1].nom}`);
console.log(`Sans téléphone : ${members.filter((m) => !m.telephone).length}`);
console.log(`Sans domicile : ${members.filter((m) => !m.domicile).length}`);
console.log(`Sans nom de famille : ${members.filter((m) => !m.nom).length}`);
console.log(`\nAnomalies (${anomalies.length}) :`);
anomalies.slice(0, 30).forEach((a) => console.log("  - " + a));
// Vérifier la continuité des matricules
const nums = members.map((m) => parseInt(m.matricule, 10));
const gaps = [];
for (let i = 1; i < nums.length; i++) {
  if (nums[i] !== nums[i - 1] + 1) gaps.push(`${nums[i - 1]} → ${nums[i]}`);
}
console.log(`\nTrous/sauts dans la numérotation (${gaps.length}) :`);
gaps.slice(0, 20).forEach((g) => console.log("  - " + g));
console.log(`\nJSON écrit : ${OUT}`);
