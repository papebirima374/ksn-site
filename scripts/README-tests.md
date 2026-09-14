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

Sortie attendue : `132 réussis, 0 échoués`. Un échec signifie qu'une règle
laisse passer — ou bloque — quelque chose qu'elle ne devrait pas.

La suite teste aussi les **requêtes de collection**, et pas seulement la
lecture d'un document : Firestore évalue la règle sur chaque document candidat
et refuse la requête entière dès qu'un seul échoue. Une règle qui laisse
passer un `getDoc` peut donc refuser la liste — c'est comme cela que les pages
tombent en « Accès refusé » alors que tout semblait correct.

# Vérification des documents imprimables

`verifier-impression.mjs` rend chaque document de `lib/impression.ts` en PDF
avec Chromium et contrôle ce qui ne se voit pas à l'écran : le nombre de
feuilles, le chargement du sceau, la présence de l'en-tête officielle, et
surtout qu'**aucune section n'est coupée** par le rognage. Il vérifie aussi le
**montant en toutes lettres** des factures : une erreur y passe inaperçue à la
relecture — personne ne contrôle « quatre-vingts » à l'œil.

Ce dernier point est le piège de l'impression : une fiche tient sur une feuille
grâce à `overflow:hidden`, et quand le contenu déborde, la dernière section
disparaît sans un mot. Le compteur de pages, lui, continue d'afficher 1. Seule
une mesure du contenu réel face à la place disponible le révèle — avant d'avoir
imprimé six exemplaires.

```bash
npm install --no-save puppeteer-core
node scripts/verifier-impression.mjs build-impression
```

Sortie attendue : `82 contrôles réussis, 0 échoués`. Les PDF produits restent
dans le dossier de sortie, à relire à l'œil si besoin.

# Présentation PDF du Règlement

`generer-reglement-pdf.mjs` fabrique la plaquette (couverture, articles du
Règlement et des Statuts, composition du Bureau, signatures) à partir de
`lib/reglement.ts` et `lib/bureau.ts` — le texte n'est recopié nulle part.

```bash
npm install --no-save puppeteer-core
node scripts/generer-reglement-pdf.mjs build-reglement
```

Produit `reglement-ksn.html` et `reglement-ksn.pdf` (8 pages A4).
