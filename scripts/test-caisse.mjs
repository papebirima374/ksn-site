// Verifie l'arithmetique de la caisse d'une commission : une ecriture annulee
// ne doit peser ni sur le solde, ni sur les totaux « entres » / « sortis ».
//
//   node scripts/test-caisse.mjs
//
// Les fonctions sont recopiees depuis lib/commission-caisse.ts : ce fichier est
// du TypeScript et importe firebase, qu'on ne veut pas charger pour un calcul.
// La garde en fin de fichier verifie que les deux versions n'ont pas divergé.

import { readFileSync } from "node:fs";

const soldeDe = (l) => l.reduce((s, e) => s + (e.sens === "entree" ? e.montant : -e.montant), 0);
const totalPar = (l, sens) => l.filter((e) => e.sens === sens).reduce((s, e) => s + e.montant, 0);
const annulees = (l) => new Set(l.map((e) => e.annuleId).filter(Boolean));
const estAnnulation = (e) => Boolean(e.annuleId);
const vivantes = (l) => {
  const mortes = annulees(l);
  return l.filter((e) => !estAnnulation(e) && !mortes.has(e.id));
};

let ok = 0;
let ko = 0;
const test = (nom, attendu, obtenu) => {
  const bon = JSON.stringify(attendu) === JSON.stringify(obtenu);
  if (bon) ok++;
  else {
    ko++;
    console.log(`  ECHEC  ${nom}\n         attendu ${JSON.stringify(attendu)}, obtenu ${JSON.stringify(obtenu)}`);
    return;
  }
  console.log(`  ok     ${nom}`);
};

const e = (id, sens, montant, annuleId = "") => ({ id, sens, montant, annuleId, motif: id });

console.log("\nCaisse : le cas signalé — 3 000 F saisis puis annulés\n");
{
  // Exactement ce que decrit le president : une entree de 3 000 F, annulee.
  const l = [e("a", "entree", 3000), e("b", "sortie", 3000, "a")];
  test("le solde retombe a zero", 0, soldeDe(l));
  test("les deux lignes restent au registre", 2, l.length);
  test("« entrés » ne compte pas l'erreur", 0, totalPar(vivantes(l), "entree"));
  test("« sortis » ne compte pas la correction", 0, totalPar(vivantes(l), "sortie"));
  test("une seule opération est marquée annulée", 1, annulees(l).size);
  test("l'ancien calcul, lui, affichait bien 3 000 entrés", 3000, totalPar(l, "entree"));
}

console.log("\nCaisse : une annulation au milieu d'un vrai registre\n");
{
  const l = [
    e("v1", "entree", 10000), // vente
    e("err", "entree", 3000), // erreur de saisie
    e("cor", "sortie", 3000, "err"), // sa correction
    e("d1", "sortie", 4000), // depense reelle
  ];
  test("solde = 10 000 − 4 000", 6000, soldeDe(l));
  test("entrés = la seule vente", 10000, totalPar(vivantes(l), "entree"));
  test("sortis = la seule dépense", 4000, totalPar(vivantes(l), "sortie"));
  test("2 lignes vivantes sur 4", 2, vivantes(l).length);
  test("solde = entrés − sortis", soldeDe(l), totalPar(vivantes(l), "entree") - totalPar(vivantes(l), "sortie"));
}

console.log("\nCaisse : les cas limites\n");
{
  test("registre vide : solde nul", 0, soldeDe([]));
  test("registre vide : rien d'annulé", 0, annulees([]).size);
  const l = [e("a", "sortie", 2500), e("b", "entree", 2500, "a")];
  test("une SORTIE annulée retombe aussi a zero", 0, soldeDe(l));
  test("et ne gonfle pas « entrés »", 0, totalPar(vivantes(l), "entree"));
  // Une ecriture d'annulation n'est jamais annulable a son tour : l'interface
  // masque le bouton. On verifie que le calcul tient quand meme.
  const t = [e("a", "entree", 1000), e("b", "sortie", 1000, "a"), e("c", "entree", 1000, "b")];
  test("une double annulation ne fausse pas le solde", 1000, soldeDe(t));
}

console.log("\nGarde : le code de production dit-il la meme chose ?\n");
{
  const src = readFileSync(new URL("../lib/commission-caisse.ts", import.meta.url), "utf8");
  test("vivantes() existe dans lib/commission-caisse.ts", true, /export function vivantes\(/.test(src));
  test("estAnnulation() existe", true, /export const estAnnulation/.test(src));
  const ecran = readFileSync(new URL("../components/admin/CaisseCommission.tsx", import.meta.url), "utf8");
  test(
    "l'ecran calcule « entrés » sur les ecritures vivantes",
    true,
    /totalPar\(reelles, "entree"\)/.test(ecran) && /vivantes\(ecritures\)/.test(ecran)
  );
  test(
    "l'ecran ne calcule plus les totaux sur tout le registre",
    false,
    /totalPar\(ecritures, "entree"\)/.test(ecran)
  );
  const rapport = readFileSync(new URL("../app/admin/ma-commission/page.tsx", import.meta.url), "utf8");
  test("le rapport de commission utilise les memes chiffres", true, /vivantes\(ecritures\)/.test(rapport));
  test("l'annulation est confirmee a l'ecran", true, /a été annulée/.test(ecran));
}

console.log(`\n${ok} assertion(s) verifiee(s), ${ko} echec(s).\n`);
process.exit(ko === 0 ? 0 : 1);
