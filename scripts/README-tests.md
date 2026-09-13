# Tests des règles Firestore

`test-firestore-rules.mjs` vérifie le contrôle d'accès (qui lit quoi, qui écrit
quoi) contre l'émulateur Firestore, sans toucher à la base de production.

Les deux outils ne sont pas des dépendances du site : on les installe le temps
du test, sans les inscrire dans `package.json`.

```bash
npm install --no-save firebase-tools @firebase/rules-unit-testing
npx firebase emulators:exec --only firestore --project ksn-rules-test \
  "node scripts/test-firestore-rules.mjs"
```

Sortie attendue : `41 réussis, 0 échoués`. Un échec signifie qu'une règle
laisse passer — ou bloque — quelque chose qu'elle ne devrait pas.

# Présentation PDF du Règlement

`generer-reglement-pdf.mjs` fabrique la plaquette (couverture, articles du
Règlement et des Statuts, composition du Bureau, signatures) à partir de
`lib/reglement.ts` et `lib/bureau.ts` — le texte n'est recopié nulle part.

```bash
npm install --no-save puppeteer-core
node scripts/generer-reglement-pdf.mjs build-reglement
```

Produit `reglement-ksn.html` et `reglement-ksn.pdf` (8 pages A4).
