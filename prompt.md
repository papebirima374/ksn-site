# Spécifications du Projet & Guide d'Intégration Firebase KIPPAANGOG

Ce document contient le prompt de gestion complet mis à jour pour le site KSN, ainsi qu'un guide pratique étape par étape pour récupérer la configuration Firebase et localiser le document du compteur global dans Firestore.

---

## Part 1: Prompt Complet de Gestion du Site KSN (Mis à jour)

Copiez le contenu ci-dessous pour initialiser de futures sessions ou le fournir à un agent de développement :

```markdown
Tu es un expert Next.js, React et Firebase (Auth, Firestore, Storage) chargé de maintenir et développer le site officiel de la KSN (Dahira Kippangog Salaatu 'Alaa Nabii). 

Voici les spécifications fonctionnelles, de sécurité et d'architecture à respecter impérativement dans tout code produit :

---

### 1. ARCHITECTURE ET COLLECTES DE DONNÉES FIRESTORE
- Collection "users" : Document ID = Auth UID. Contient l'état utilisateur (email, displayName, role: "admin" | "commission" | "member", permissions: []).
- Collection "members" : Contient les informations d'adhérent (matricule, prenom, nom, email, telephone, domicile, photo, status: "actif" | "en_attente" | "inactif").
- L'utilisateur connecté possède les propriétés "memberStatus" ("actif" | "en_attente" | "inactif") et "memberId" injectées dynamiquement dans son contexte d'authentification ("useAuth").

---

### 2. SYSTÈME D'AUTHENTIFICATION FLEXIBLE (EMAIL OU TÉLÉPHONE)
- L'utilisateur peut s'inscrire ou se connecter avec une adresse e-mail OU un numéro de téléphone (style WhatsApp).
- S'il utilise un numéro de téléphone, générer un e-mail virtuel Firebase Auth standardisé : "tel-[chiffres]@ksn-member.com".
- Assistance mot de passe oublié :
  - Si email : envoi standard de mail de réinitialisation Firebase.
  - Si téléphone/WhatsApp : afficher un bouton vert de contact WhatsApp pré-rempli vers l'administration : *"Bonjour, j'ai oublié mon mot de passe pour mon compte KSN associé au numéro de téléphone [TELEPHONE]. Pouvez-vous m'envoyer un lien de connexion ou m'aider à le réinitialiser ?"*.

---

### 3. GESTION DES RÔLES : VISITEURS vs MEMBRES ACTIFS
- Visiteur (statut "inactif") : Inscription gratuite et rapide, sans photo de profil requise.
- Membre Actif (statut "en_attente" puis "actif") : Inscription avec photo de profil obligatoire + paiement de la cotisation de 1000 FCFA (lien direct Wave).
- Formulaire de mise à niveau pour les visiteurs existants sur leur profil.

---

### 4. RE-SOUMISSION ET CHANGEMENT DE STATUT
- Permettre à un visiteur (statut "inactif") d'uploader sa photo de profil, d'effectuer le paiement Wave de 1000 FCFA, et de soumettre sa demande de mise à niveau.
- Cela change son statut en "en_attente" de validation administrative.

---

### 5. ACCÈS DYNAMIQUE À LA BIBLIOTHÈQUE SPIRITUELLE (RESTRICTION PARTIELLE)
- L'accès à la page `/spiritualite` n'est pas bloqué entièrement.
- Tout le monde (connecté ou non) accède à la page. Le "Salaat du Jour" et les deux premiers Salaats de la bibliothèque sont en libre accès.
- À partir du 3e Salaat (index >= 2), les éléments de la liste sont verrouillés et affichent un badge `"🔒 Réservé Membres"`.
- Si un utilisateur non actif clique sur un Salaat verrouillé, ouvrir un **modal d'adhésion premium** :
  - *Si statut = "en_attente"* : Message d'attente ("Validation en cours") rappelant le règlement de la cotisation de 1000 FCFA et affichant le bouton Wave.
  - *Si statut = "inactif" (visiteur)* : Invitation à compléter son profil (avec photo obligatoire pour la carte) et régler la cotisation de 1000 FCFA pour débloquer l'accès.

---

### 6. ESPACE PROFIL MEMBRE ET CARTE CR80
- La page "/espace-membre" doit afficher le profil de l'utilisateur connecté ("ProfileDashboard.tsx") au lieu de rediriger.
- Si le membre est actif, afficher sa carte d'adhérent CR80 officielle (design premium vert/or avec le filigrane du sceau calligraphié).
- Permettre à l'utilisateur de modifier son prénom, son nom, son domicile et sa photo (la carte se met à jour en temps réel).
- Si l'utilisateur est visiteur ("inactif"), lui afficher un encadré premium "Devenir Membre Actif" pour téléverser sa photo, payer 1000 FCFA et soumettre sa demande (passage à "en_attente").

---

### 7. VÉRIFICATION STRICTE DES DOUBLONS
- Bloquer toute création ou modification si l'adresse email (insensible à la casse) ou le téléphone (comparaison basée uniquement sur les chiffres) est déjà lié à un autre compte existant dans la collection "members".

---

### 8. PANNEAU DE VALIDATION ADMIN (COMMISSIONS ADMINISTRATIVE ET FINANCES)
- Dans la vue liste d'administration des membres ("app/admin/membres/page.tsx") :
  - Ajouter un onglet filtre "En attente" affichant tous les membres ayant le statut "en_attente".
  - Afficher un bouton vert "Valider" pour chaque demande. Cliquer dessus valide l'adhésion active en changeant le statut à "actif" dans Firestore et génère automatiquement le matricule officiel de l'adhérent.

---

### 9. CONFIGURATION DE FIREBASE KIPPAANGOG ET COMPTEUR COMMUNAUTAIRE DYNAMIQUE
- Le projet doit être configuré avec les variables d'environnement Firebase du projet **KIPPAANGOG** dans `.env.local` :
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="kippaangog.firebaseapp.com"`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID="kippaangog"`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
- Connecter le composant `CompteurSalaatu.tsx` à Firestore en temps réel.
- Le total des Salaatus de la communauté (Challenge du milliard) doit être lu depuis le document Firestore partagé avec l'application mobile.
- Chemins probables du document dans Firestore :
  - `compteur/global` (champ `total` de type number)
  - `stats/totals` (champ `salaatuTotal` de type number)
  - `counters/salaatu` (champ `count` de type number)
- Mettre en place la mise à jour bidirectionnelle : quand un membre incrémente son compteur personnel du jour sur le site web, ajouter `+1` au champ total global dans Firestore.
```

---

## Part 2: Guide pour trouver les informations KIPPAANGOG

### Etape 1 : Récupérer les clés d'API Web de KIPPAANGOG
Si vous n'avez pas de profil développeur et devez récupérer vous-même les clés depuis la Console Firebase :
1. Allez sur la [Console Firebase](https://console.firebase.google.com/).
2. Connectez-vous avec le compte Google propriétaire du projet et cliquez sur le projet **KIPPAANGOG**.
3. Cliquez sur l'icône de rouage **Paramètres du projet** (⚙️ Project Settings) en haut à gauche.
4. Restez sur l'onglet **Général** (General) et faites défiler tout en bas jusqu'à la section **Vos applications** (Your apps).
5. **Si vous avez déjà une application Web** (indiquée par l'icône `</>` et le type "web") :
   - Vous verrez le bloc de code JavaScript avec les 6 valeurs nécessaires (`apiKey`, `authDomain`, `projectId`, etc.).
6. **Si vous n'avez pas d'application Web** (seulement l'application mobile Android/iOS) :
   - Cliquez sur le bouton **Ajouter une application** ou sur l'icône **`</>`** (Web).
   - Donnez-lui un nom (par exemple : `KSN Web App`) et cliquez sur **Enregistrer l'application**.
   - Firebase affichera immédiatement l'objet `firebaseConfig`. Copiez ces 6 valeurs.

Remplacez ces valeurs dans votre fichier `.env.local` localisé à la racine du projet :
```env
NEXT_PUBLIC_FIREBASE_API_KEY="votre_cle_api"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="kippaangog.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="kippaangog"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="kippaangog.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="votre_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="votre_app_id"
```

---

### Etape 2 : Trouver le chemin du document de compteur dans Firestore

#### Option A : Demander au développeur mobile
Copiez-collez ce message type pour l'envoyer directement au développeur mobile sur WhatsApp ou par e-mail :

> 💬 **Message à copier :**
>
> "Salut ! Pour intégrer le compteur de Salaatou de l'application sur le nouveau site internet de la KSN, j'ai besoin de savoir dans quel document de Firestore est stocké le total global des Salaatous (le cumul communautaire).
> Est-ce que tu peux me donner le chemin exact de la collection et du document, ainsi que le nom du champ qui contient ce nombre ? 
> Par exemple, est-ce que c'est `compteur/global` (champ `total`), `stats/totals` (champ `salaatuTotal`), ou un autre chemin ? Merci !"

#### Option B : Le chercher soi-même sur la Console Firebase
Si vous avez accès à la console d'administration et souhaitez le chercher vous-même :
1. Dans le menu de gauche de la Console Firebase de **KIPPAANGOG**, cliquez sur **Firestore Database**.
2. Dans l'onglet **Données** (Data), vous verrez la liste des collections de premier niveau.
3. Cherchez une collection nommée `compteur`, `counters`, `stats`, `globals`, `challenges`, ou `totals`.
4. Cliquez sur la collection, puis regardez les documents à l'intérieur :
   - Par exemple, s'il y a un document nommé `global`, `salaatu`, ou `totals`.
   - Cliquez dessus et vérifiez dans la colonne de droite si vous voyez un champ numérique (de type `number`) avec une valeur élevée (plusieurs millions).
5. Notez le chemin sous le format `NomCollection/NomDocument` ainsi que le nom exact du champ (sensible à la casse).

---

### Etape 3 : Script de Diagnostic Automatique (Probing)
Une fois que vous aurez mis à jour votre fichier `.env.local` avec les clés de **KIPPAANGOG**, nous pourrons exécuter un script de scan automatique pour tester les chemins les plus courants dans votre base de données et afficher les résultats.
Vous pourrez nous demander de lancer ce scan à tout moment après avoir mis à jour les clés.