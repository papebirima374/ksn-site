#!/usr/bin/env bash
#
# Supprime les donnees de l'ancienne section Education, retiree du site en
# septembre 2026 : trois collections Firestore et deux dossiers de fichiers.
#
# POURQUOI UN SCRIPT PLUTOT QUE LA CONSOLE ?
# Pour que l'export precede la suppression sans qu'on puisse l'oublier. Une
# suppression Firestore est definitive : il n'y a pas de corbeille, pas de
# « annuler », et l'une de ces collections contient des noms, des telephones
# et des e-mails de personnes reelles qui avaient demande un certificat.
#
# Ce script ne supprime RIEN sans deux choses : un export reussi, et votre
# confirmation tapee a la main.
#
#   npm install -g firebase-tools     (si besoin)
#   firebase login
#   bash scripts/vider-education.sh

set -euo pipefail

COLLECTIONS=(education_modules education_lessons educationCertifications)
DOSSIERS=(education_audio education_illustrations)

rouge()  { printf "\033[31m%s\033[0m\n" "$*"; }
vert()   { printf "\033[32m%s\033[0m\n" "$*"; }
gras()   { printf "\033[1m%s\033[0m\n" "$*"; }

command -v firebase >/dev/null 2>&1 || {
  rouge "firebase-tools est introuvable."
  echo "   npm install -g firebase-tools && firebase login"
  exit 1
}

PROJET="$(firebase use 2>/dev/null | head -1 | sed 's/.*(\(.*\)).*/\1/' || true)"
[ -n "${PROJET:-}" ] || PROJET="$(firebase projects:list 2>/dev/null | awk '/│/ && !/Project/ {print $4; exit}')"
[ -n "${PROJET:-}" ] || { rouge "Aucun projet Firebase actif. Lancez : firebase use <votre-projet>"; exit 1; }

echo
gras "Projet visé : $PROJET"
echo
echo "Seront supprimés — définitivement :"
for c in "${COLLECTIONS[@]}"; do echo "   collection Firestore   $c"; done
for d in "${DOSSIERS[@]}";    do echo "   dossier de fichiers    $d/"; done
echo

# ── 1. L'export, avant tout ─────────────────────────────────────────────
gras "Étape 1 sur 3 — sauvegarde"
echo "L'export copie les collections dans un bucket Cloud Storage. Sans lui,"
echo "ce qui part ne revient pas."
echo
read -rp "Chemin du bucket d'export (ex : gs://$PROJET.appspot.com/sauvegardes/education-2026-09) : " DESTINATION
[ -n "$DESTINATION" ] || { rouge "Aucune destination : on s'arrête ici."; exit 1; }

echo
echo "Export en cours…"
firebase firestore:export "$DESTINATION" \
  --collection-ids "$(IFS=,; echo "${COLLECTIONS[*]}")" \
  --project "$PROJET"
vert "Export terminé → $DESTINATION"

# ── 2. La confirmation ──────────────────────────────────────────────────
echo
gras "Étape 2 sur 3 — confirmation"
rouge "Cette suppression est DÉFINITIVE. Il n'y a pas de corbeille dans Firestore."
echo "educationCertifications contient des noms, téléphones et e-mails de"
echo "personnes qui avaient demandé un certificat."
echo
read -rp "Tapez exactement  SUPPRIMER  pour continuer : " REPONSE
[ "$REPONSE" = "SUPPRIMER" ] || { echo "Annulé. Rien n'a été supprimé."; exit 0; }

# ── 3. La suppression ───────────────────────────────────────────────────
echo
gras "Étape 3 sur 3 — suppression"
for c in "${COLLECTIONS[@]}"; do
  echo "→ $c"
  firebase firestore:delete "$c" --recursive --force --project "$PROJET"
done
vert "Les trois collections Firestore sont vidées."

echo
gras "Reste les fichiers (audio et images des leçons)"
echo "Ils vivent dans Cloud Storage, que firebase-tools ne sait pas effacer."
echo "Si vous avez gsutil :"
for d in "${DOSSIERS[@]}"; do echo "   gsutil -m rm -r gs://$PROJET.appspot.com/$d"; done
echo
echo "Sinon : Console Firebase → Storage → supprimez les dossiers"
echo "   ${DOSSIERS[*]}"
echo
vert "Terminé. La sauvegarde reste dans $DESTINATION."
