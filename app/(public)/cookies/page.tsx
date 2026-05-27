import type { Metadata } from "next";
import LegalShell from "@/components/layout/LegalShell";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Politique de cookies",
  description:
    "Politique d'utilisation des cookies sur le site officiel du Dahira KSN.",
};

export default function Cookies() {
  return (
    <LegalShell
      overline="Cookies et traceurs"
      title="Politique de Cookies"
      activeHref="/cookies"
    >
      <h2>1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
      <p>
        Un cookie est un petit fichier texte déposé sur votre appareil
        (ordinateur, tablette, smartphone) lors de la visite d&apos;un site
        web. Il permet au site de mémoriser certaines informations pour
        améliorer votre expérience de navigation.
      </p>

      <h2>2. Cookies utilisés sur {SITE.domain}</h2>

      <h3>2.1 Cookies strictement nécessaires (toujours actifs)</h3>
      <p>
        Ces cookies sont indispensables au bon fonctionnement du site. Vous ne pouvez pas les refuser.
      </p>
      <ul>
        <li><strong>Session d&apos;authentification</strong> (Firebase Auth) — vous garde connecté à votre espace membre</li>
        <li><strong>Préférence de langue</strong> (localStorage) — mémorise votre choix FR / EN / AR / IT / ES</li>
        <li><strong>Panier de la boutique</strong> (localStorage) — conserve vos produits entre les visites</li>
        <li><strong>Compteur Salaatu personnel</strong> (localStorage) — sauvegarde votre compte quotidien</li>
        <li><strong>Consentement cookies</strong> — mémorise votre choix d&apos;acceptation/refus</li>
      </ul>

      <h3>2.2 Cookies de mesure d&apos;audience (optionnels)</h3>
      <p>
        Ces cookies nous aident à comprendre comment le site est utilisé pour
        l&apos;améliorer. Vous pouvez les refuser sans impact sur la
        navigation.
      </p>
      <ul>
        <li><strong>Vercel Analytics</strong> — comptage anonyme des visites par page</li>
        <li><strong>Google Analytics 4</strong> (si activé) — analyse du comportement de navigation, sources de trafic</li>
      </ul>

      <h3>2.3 Cookies de tiers</h3>
      <p>
        Certains contenus intégrés (vidéos YouTube, lecteurs de streaming,
        modules réseaux sociaux) peuvent déposer leurs propres cookies. Vous
        pouvez consulter leurs politiques respectives :
      </p>
      <ul>
        <li>YouTube / Google : <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com</a></li>
        <li>Facebook / Instagram : <a href="https://www.facebook.com/policies/cookies/" target="_blank" rel="noopener noreferrer">facebook.com/policies/cookies</a></li>
        <li>TikTok : <a href="https://www.tiktok.com/legal/cookie-policy" target="_blank" rel="noopener noreferrer">tiktok.com/legal/cookie-policy</a></li>
      </ul>

      <h2>3. Durée de conservation</h2>
      <ul>
        <li><strong>Session :</strong> supprimé à la fermeture du navigateur</li>
        <li><strong>Préférences (langue, panier) :</strong> 1 an</li>
        <li><strong>Authentification :</strong> 30 jours (renouvelable)</li>
        <li><strong>Statistiques :</strong> 13 mois maximum (recommandation CNIL)</li>
      </ul>

      <h2>4. Comment gérer vos cookies ?</h2>
      <p>
        Lors de votre première visite, un bandeau vous permet d&apos;accepter
        ou refuser les cookies optionnels.
      </p>
      <p>Vous pouvez également :</p>
      <ul>
        <li>Modifier votre choix à tout moment en effaçant les cookies de votre navigateur</li>
        <li>Bloquer tous les cookies depuis les paramètres de votre navigateur (Chrome, Firefox, Safari, Edge, Brave)</li>
        <li>Utiliser la navigation privée pour ne déposer aucun cookie persistant</li>
      </ul>
      <p>
        Attention : le blocage de tous les cookies peut empêcher le bon
        fonctionnement du site (notamment l&apos;espace membre et la boutique).
      </p>

      <h2>5. Plus d&apos;informations</h2>
      <p>
        Pour toute question sur les cookies, consultez notre <a href="/confidentialite">politique de confidentialité</a> ou contactez-nous via WhatsApp.
      </p>
    </LegalShell>
  );
}
