import type { Metadata } from "next";
import LegalShell from "@/components/layout/LegalShell";
import { SITE, PAYMENT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description:
    "Conditions générales de vente de la boutique KSN : Café G, livres PDF, produits physiques. Paiements Wave / Orange Money / Carte / PayPal.",
};

export default function CGV() {
  return (
    <LegalShell
      overline="Boutique en ligne"
      title="Conditions Générales de Vente"
      activeHref="/cgv"
    >
      <h2>1. Vendeur</h2>
      <p>
        La <strong>Boutique KSN</strong> est exploitée par le Dahira{" "}
        <strong>{SITE.fullName}</strong>, dont le siège social est à{" "}
        {SITE.location}. Les présentes Conditions Générales de Vente (CGV)
        s&apos;appliquent à toute commande passée sur <a href="/boutique">{SITE.domain}/boutique</a>.
      </p>

      <h2>2. Produits</h2>
      <ul>
        <li><strong>Café G du Dahira</strong> : café spirituel torréfié — paquets 500 g et 1 kg</li>
        <li><strong>Livres PDF</strong> : recueils spirituels, Khassaïdes, enseignements — livraison par téléchargement</li>
        <li><strong>Produits physiques</strong> : tasbihs, calligraphies, vêtements et autres souvenirs du Dahira</li>
      </ul>
      <p>
        Les caractéristiques essentielles (description, photo, prix, stock) de
        chaque produit sont indiquées sur sa fiche dans la boutique. Les
        photos sont contractuelles dans la limite des contraintes
        d&apos;impression et d&apos;écran.
      </p>

      <h2>3. Prix</h2>
      <p>
        Les prix sont exprimés en <strong>franc CFA (FCFA)</strong>, toutes
        taxes comprises pour les ventes au Sénégal. Pour les livraisons
        internationales, les éventuels droits de douane et taxes locales
        restent à la charge de l&apos;acheteur.
      </p>
      <p>
        Le Dahira se réserve le droit de modifier les prix à tout moment. Les
        produits seront facturés sur la base des tarifs en vigueur au moment
        de l&apos;enregistrement de la commande.
      </p>

      <h2>4. Commande</h2>
      <p>
        Pour passer commande, l&apos;acheteur :
      </p>
      <ul>
        <li>Ajoute les produits à son panier</li>
        <li>Renseigne les informations requises : nom complet, téléphone, email (obligatoire pour les livres PDF), adresse de livraison (obligatoire pour Café G et produits physiques)</li>
        <li>Choisit son moyen de paiement</li>
        <li>Confirme et règle</li>
      </ul>
      <p>
        Une commande est définitive uniquement après confirmation du
        paiement. L&apos;acheteur reçoit un numéro de commande qui sert de
        référence pour le suivi.
      </p>

      <h2>5. Moyens de paiement</h2>
      <p>Plusieurs solutions sécurisées sont disponibles :</p>
      <ul>
        <li><strong>Wave</strong> — paiement instantané au +221 76 725 72 72</li>
        <li><strong>Orange Money</strong> — paiement via #144# au +221 78 017 84 44</li>
        <li><strong>Carte bancaire</strong> (Visa / Mastercard) — paiement sécurisé via Stripe</li>
        <li><strong>PayPal</strong> — pour la diaspora et les paiements internationaux</li>
        <li><strong>Virement UBA</strong> — compte 3075 0005 3070 (pour les commandes importantes)</li>
      </ul>
      <p>
        Aucune donnée bancaire n&apos;est stockée sur les serveurs du Dahira.
        Les transactions par carte sont traitées par Stripe (certifié PCI-DSS).
      </p>

      <h2>6. Livraison</h2>
      <h3>Livres PDF (téléchargement)</h3>
      <ul>
        <li>Lien de téléchargement envoyé par <strong>email</strong> sous 24h après confirmation du paiement</li>
        <li>Le téléchargement est <strong>personnel</strong> et lié à votre commande</li>
      </ul>
      <h3>Café G et produits physiques</h3>
      <ul>
        <li><strong>Sénégal :</strong> livraison sous 2 à 7 jours ouvrés (Dakar) ou 5 à 10 jours (autres régions)</li>
        <li><strong>International :</strong> selon faisabilité — devis personnalisé par WhatsApp</li>
        <li>Les frais de livraison sont indiqués lors de la finalisation de la commande</li>
        <li>L&apos;acheteur reçoit un appel ou un message WhatsApp pour fixer le rendez-vous de livraison</li>
      </ul>

      <h2>7. Droit de rétractation</h2>
      <p>
        Conformément aux usages locaux et à la nature spirituelle de certains
        produits :
      </p>
      <ul>
        <li><strong>Livres PDF :</strong> aucun droit de rétractation après téléchargement effectif (produit numérique consommé)</li>
        <li><strong>Café G :</strong> rétractation possible dans les 7 jours suivant la livraison, à condition que l&apos;emballage soit intact et non ouvert (frais de retour à la charge de l&apos;acheteur)</li>
        <li><strong>Produits physiques :</strong> rétractation possible dans les 14 jours, en l&apos;état d&apos;origine (frais de retour à la charge de l&apos;acheteur)</li>
      </ul>
      <p>
        En cas de produit défectueux ou non conforme à la commande, contactez
        immédiatement le Dahira sous 48h pour un remplacement ou un remboursement.
      </p>

      <h2>8. Remboursement</h2>
      <ul>
        <li>Les remboursements sont effectués par le même moyen de paiement que celui utilisé pour la commande</li>
        <li>Délai : 7 à 14 jours ouvrés selon le prestataire</li>
        <li>Les frais bancaires ou de transaction sont déduits du remboursement</li>
      </ul>

      <h2>9. Garantie et service après-vente</h2>
      <p>
        Le Dahira KSN garantit la conformité de ses produits aux descriptions
        publiées. Pour toute réclamation, contactez WhatsApp officiel{" "}
        <a href={`https://wa.me/221767257272`} target="_blank" rel="noopener noreferrer">+221 76 725 72 72</a> ou le formulaire de <a href="/contact">contact</a>.
      </p>

      <h2>10. Litiges</h2>
      <p>
        Tout litige relatif aux présentes CGV sera, à défaut de résolution
        amiable, soumis aux tribunaux compétents de Dakar (Sénégal). Le droit
        applicable est le droit sénégalais.
      </p>
    </LegalShell>
  );
}
