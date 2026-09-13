# Reprendre le projet apres la perte d'une machine

Machine HS, pas de sauvegarde externe. Ce document liste ce qui est deja
sauvegarde, ce qui ne l'est pas, et comment repartir.

## 1. Ce qui est intact

Tout le code du site est sur GitHub : `papebirima374/ksn-site`.
Le depot contient l'historique complet des commits, les regles Firestore et
Storage, les fichiers de traduction (`traduction-*.csv`), les scripts et le
contenu de `public/`. Rien de tout cela n'a besoin d'etre reconstruit.

Les **donnees** du site (membres, articles du blog, contributions du challenge,
images televersees) vivent dans Firebase — Firestore et Cloud Storage — donc
sur les serveurs Google, pas sur la machine. Elles sont intactes elles aussi.

Le **site en production** tourne sur Vercel et continue de fonctionner : un
deploiement ne depend pas du poste de travail.

## 2. Ce qui a disparu avec la machine

Seuls les fichiers volontairement exclus du depot (voir `.gitignore`) :

| Element | Comment le retrouver |
|---|---|
| `.env.local` (cles Firebase, Resend, Google TTS) | Vercel > Settings > Environment Variables, ou `npx vercel env pull` (voir plus bas) |
| `node_modules/`, `.next/` | Regeneres par `npm install` et `npm run build` |
| `.vercel/` (lien projet local) | Recree par `npx vercel link` |
| `/documents`, `docs/*.pdf`, `docs/membres-import.json` | Fichiers de travail de la commission administrative — a redemander a leur auteur, ou reexporter depuis Firestore |
| Branches locales jamais poussees | Perdues. Verifier `git log origin/main` pour voir jusqu'ou va le pousse |

Aucune cle de compte de service Firebase n'est utilisee par le projet
(`lib/auth`, verification par jeton via l'API Identity Toolkit), il n'y a donc
pas de fichier `serviceAccount.json` a retrouver.

## 3. Repartir sur une nouvelle machine

```bash
git clone https://github.com/papebirima374/ksn-site
cd ksn-site
npm install

# Recuperer les variables d'environnement depuis Vercel :
npx vercel login
npx vercel link          # choisir le projet KSN existant
npx vercel env pull .env.local

npm run dev
```

Si le compte Vercel n'est pas accessible, partir de `.env.example` et remplir a
la main : les six valeurs `NEXT_PUBLIC_FIREBASE_*` se relisent dans la console
Firebase (Parametres du projet > Vos applications > Configuration SDK).
`RESEND_API_KEY` et `GOOGLE_TTS_API_KEY` ne se relisent pas : en generer de
nouvelles dans les tableaux de bord respectifs et revoquer les anciennes.

## 4. Travailler sans machine, tout de suite

- **Claude Code sur le web** (claude.ai/code) : la session tourne dans un
  conteneur distant avec le depot deja clone. Modifier, commiter et pousser
  depuis un navigateur, y compris sur telephone.
- **GitHub Codespaces** : environnement VS Code complet dans le navigateur,
  depuis le bouton « Code » du depot. Ajouter les variables d'environnement
  dans les *Codespaces secrets* du depot.
- **github.dev** : appuyer sur `.` sur la page du depot pour une edition rapide
  de fichiers, sans terminal.
- **Vercel** : chaque push sur `main` redeploie le site, aucune machine locale
  n'est necessaire pour mettre en ligne.

## 5. Eviter que cela se reproduise

- Pousser souvent : un commit non pousse n'est pas une sauvegarde.
- Garder les secrets dans Vercel (source de verite) plutot que seulement dans
  un `.env.local` local ; `.env.example` documente la liste des variables.
- Les fichiers sensibles exclus du depot (`/documents`, cartes de membres)
  doivent avoir leur propre sauvegarde : Google Drive, Firebase Storage ou un
  disque externe.
- Exporter periodiquement Firestore : console Firebase > Firestore > Importer/
  Exporter, vers un bucket Cloud Storage.
