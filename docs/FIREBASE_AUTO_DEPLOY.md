# Déploiement automatique des règles Firestore

À chaque push qui modifie `firestore.rules`, GitHub Actions déploie
automatiquement les nouvelles règles dans Firebase Console. Plus besoin
de copier-coller manuellement.

## Setup initial (à faire UNE seule fois)

### 1. Générer un token Firebase CI

Ouvre un terminal **sur ton PC** (pas dans Cursor) et exécute :

```bash
npx firebase-tools login:ci
```

- Une fenêtre de navigateur s'ouvre
- Connecte-toi avec ton compte Google qui a accès à Firebase
- Autorise l'accès
- Reviens dans le terminal : un **token long** est affiché
  (format : `1//0gXXXXXXXXXXXXXXXXXX_YYYYYYYYYYYYYYYY`)
- **Copie ce token entièrement.**

### 2. Ajouter le token comme secret GitHub

1. Va sur : https://github.com/papebirima374/ksn-site/settings/secrets/actions
2. Clique **"New repository secret"**
3. Nom : `FIREBASE_TOKEN`
4. Valeur : **colle le token** copié à l'étape 1
5. Clique **"Add secret"**

### 3. Vérifier que ça marche

Modifie `firestore.rules` (n'importe quel commentaire ajouté suffit),
puis push :

```bash
git add firestore.rules
git commit -m "test: trigger firestore rules deploy"
git push
```

Va sur https://github.com/papebirima374/ksn-site/actions — tu vois le
workflow **"Deploy Firestore rules"** tourner. ~30 secondes plus tard
il passe en vert ✅, et les règles sont appliquées dans Firebase Console.

## Comment ça marche

Le workflow `.github/workflows/firebase-rules.yml` :

- **Trigger** : se déclenche uniquement quand `firestore.rules`,
  `firestore.indexes.json` ou `firebase.json` change sur la branche `main`
- **Action** : installe Firebase CLI, déploie via le token stocké en secret
- **Cible** : projet Firebase `ksn-site`

Le secret `FIREBASE_TOKEN` est utilisé uniquement par GitHub Actions
côté serveur — il n'est jamais exposé dans le code ni dans les logs.

## Cas où ça ne suffit pas

Si plus tard tu as besoin de déployer aussi des Cloud Functions ou
Storage rules, modifie la commande dans le workflow :

```yaml
firebase deploy --only firestore:rules,storage:rules,functions
```

## Révoquer l'accès

Si tu veux révoquer le token (ex: ancien dev parti) :

1. Va sur https://myaccount.google.com/permissions
2. Cherche "Firebase CLI" → Révoquer
3. Génère un nouveau token avec `npx firebase-tools login:ci`
4. Mets à jour le secret `FIREBASE_TOKEN` sur GitHub
