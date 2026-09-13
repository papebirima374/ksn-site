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

Sortie attendue : `26 réussis, 0 échoués`. Un échec signifie qu'une règle
laisse passer — ou bloque — quelque chose qu'elle ne devrait pas.
