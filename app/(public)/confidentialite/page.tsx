import type { Metadata } from "next";
import LegalShell from "@/components/layout/LegalShell";
import { LINKS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité du Dahira KSN : collecte, traitement et protection des données personnelles, conformément à la loi sénégalaise et au RGPD.",
};

export default function Confidentialite() {
  return (
    <LegalShell
      overline="Données personnelles"
      title="Politique de confidentialité"
      activeHref="/confidentialite"
    >
      <p>
        Le Dahira <strong>{SITE.fullName}</strong> ({SITE.name}) accorde une
        importance primordiale à la protection des données personnelles de ses
        membres, donateurs, acheteurs de la boutique et visiteurs du site
        <strong> {SITE.domain}</strong>. La présente politique explique
        comment vos données sont collectées, utilisées et protégées,
        conformément à la <strong>loi sénégalaise n° 2008-12 du 25 janvier 2008
        sur la protection des données personnelles</strong> et au{" "}
        <strong>Règlement Général sur la Protection des Données (RGPD)</strong> pour les visiteurs résidant dans l&apos;Union européenne.
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement des données est le <strong>Dahira KSN</strong>, représenté par son Président Fondateur Serigne Birima Gueye, dont le siège est à {SITE.location}.
      </p>

      <h2>2. Données collectées</h2>
      <p>Nous collectons uniquement les données strictement nécessaires :</p>
      <ul>
        <li><strong>Inscription membre :</strong> nom, prénom, email, téléphone, ville, région, pays, photo, date de naissance, profession</li>
        <li><strong>Espace membre (compte) :</strong> email ou téléphone, mot de passe (haché), historique de connexion</li>
        <li><strong>Boutique :</strong> nom, téléphone, adresse de livraison, email (si livre PDF), identifiant de transaction</li>
        <li><strong>Dons :</strong> identifiant de transaction Wave / Orange Money / UBA / Stripe</li>
        <li><strong>Contact :</strong> nom, email, téléphone, message</li>
        <li><strong>Données techniques :</strong> adresse IP, type de navigateur, durée de visite, pages consultées (via Vercel Analytics et Google Analytics si activé)</li>
      </ul>

      <h2>3. Finalités du traitement</h2>
      <ul>
        <li>Gérer l&apos;adhésion des membres et générer leur carte de membre officielle</li>
        <li>Traiter les commandes de la boutique et organiser les livraisons</li>
        <li>Émettre des reçus pour les dons</li>
        <li>Communiquer avec les membres (annonces, événements, notifications spirituelles)</li>
        <li>Améliorer le site et son contenu (statistiques anonymisées)</li>
        <li>Respecter nos obligations légales et comptables</li>
      </ul>

      <h2>4. Base légale</h2>
      <p>
        Le traitement de vos données repose sur :
      </p>
      <ul>
        <li>Votre <strong>consentement explicite</strong> lors de l&apos;inscription, de la commande ou du don</li>
        <li>L&apos;exécution du <strong>contrat d&apos;adhésion</strong> au Dahira</li>
        <li>Le respect d&apos;<strong>obligations légales</strong> (comptabilité, lutte anti-blanchiment pour les dons)</li>
      </ul>

      <h2>5. Durée de conservation</h2>
      <ul>
        <li><strong>Compte membre actif :</strong> tant que l&apos;adhésion est en vigueur</li>
        <li><strong>Compte inactif :</strong> 3 ans après la dernière connexion, puis anonymisation</li>
        <li><strong>Commandes :</strong> 10 ans (obligations comptables)</li>
        <li><strong>Reçus de dons :</strong> 10 ans</li>
        <li><strong>Logs techniques :</strong> 12 mois maximum</li>
      </ul>

      <h2>6. Destinataires des données</h2>
      <p>Vos données ne sont jamais vendues. Elles sont accessibles uniquement à :</p>
      <ul>
        <li>L&apos;administrateur du site (Birima Gueye)</li>
        <li>Les commissions habilitées (Administration, Finance, Communication, Éducation), dans la limite de leurs missions</li>
        <li>Nos sous-traitants techniques sous accord de confidentialité : <strong>Google Firebase</strong> (authentification, base de données), <strong>Vercel</strong> (hébergement)</li>
        <li>Les prestataires de paiement : <strong>Wave</strong>, <strong>Orange Money</strong>, <strong>UBA</strong>, <strong>Stripe</strong> (chacun applique sa propre politique de confidentialité)</li>
      </ul>

      <h2>7. Transferts hors du Sénégal</h2>
      <p>
        Certaines de vos données sont hébergées par Google Firebase (États-Unis,
        Europe) et Vercel (États-Unis). Ces transferts sont encadrés par les
        clauses contractuelles types de la Commission européenne et par les
        certifications de sécurité (ISO 27001, SOC 2).
      </p>

      <h2>8. Sécurité</h2>
      <ul>
        <li>Chiffrement HTTPS systématique (certificat SSL/TLS)</li>
        <li>Mots de passe hachés (bcrypt via Firebase Authentication)</li>
        <li>Données financières <strong>jamais</strong> stockées sur nos serveurs (prestataires PCI-DSS)</li>
        <li>Accès admin protégé par mot de passe fort + permissions granulaires</li>
        <li>Sauvegardes automatiques quotidiennes</li>
        <li>reCAPTCHA pour bloquer les robots</li>
      </ul>

      <h2>9. Vos droits</h2>
      <p>Conformément à la loi sénégalaise et au RGPD, vous disposez des droits suivants :</p>
      <ul>
        <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données</li>
        <li><strong>Droit de rectification :</strong> corriger des données inexactes (directement sur /espace-membre/profil)</li>
        <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de votre compte</li>
        <li><strong>Droit d&apos;opposition :</strong> refuser certains traitements (marketing, statistiques)</li>
        <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
        <li><strong>Droit de plainte :</strong> auprès de la <strong>Commission de Protection des Données Personnelles (CDP)</strong> du Sénégal</li>
      </ul>
      <p>Pour exercer ces droits, contactez-nous via WhatsApp : <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer">+221 76 725 72 72</a> ou le <a href="/contact">formulaire de contact</a>.</p>

      <h2>10. Cookies</h2>
      <p>
        Pour plus de détails sur l&apos;utilisation des cookies, consultez notre <a href="/cookies">politique cookies</a>.
      </p>
    </LegalShell>
  );
}
