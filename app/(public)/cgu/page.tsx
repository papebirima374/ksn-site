import type { Metadata } from "next";
import LegalShell from "@/components/layout/LegalShell";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description:
    "Conditions générales d'utilisation du site officiel du Dahira KSN.",
};

export default function CGU() {
  return (
    <LegalShell
      overline="Utilisation du site"
      title="Conditions Générales d'Utilisation"
      activeHref="/cgu"
    >
      <h2>1. Objet</h2>
      <p>
        Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent
        l&apos;accès et l&apos;utilisation du site <strong>{SITE.domain}</strong> édité par le Dahira <strong>{SITE.fullName}</strong>.
      </p>
      <p>
        Toute personne qui accède au site ou crée un compte accepte sans
        réserve l&apos;intégralité des présentes CGU.
      </p>

      <h2>2. Accès au site</h2>
      <ul>
        <li>L&apos;accès aux pages publiques (Accueil, Le Dahira, Spiritualité — accès partiel, Média, Blog, Contact, Boutique, Don, Mentions légales) est <strong>libre et gratuit</strong></li>
        <li>L&apos;accès à la <strong>bibliothèque complète des Salaats</strong> et à l&apos;espace membre nécessite la création d&apos;un compte et l&apos;activation par le règlement de la cotisation</li>
        <li>L&apos;accès est ouvert à toute personne majeure ou aux mineurs avec autorisation parentale</li>
      </ul>

      <h2>3. Création de compte</h2>
      <p>L&apos;inscription se fait via la page <a href="/espace-membre">/espace-membre</a>. L&apos;utilisateur s&apos;engage à :</p>
      <ul>
        <li>Fournir des informations exactes, sincères et à jour</li>
        <li>Choisir un mot de passe robuste (6 caractères minimum) et le garder confidentiel</li>
        <li>Ne pas usurper l&apos;identité d&apos;un tiers</li>
        <li>Ne pas créer plusieurs comptes pour une même personne</li>
        <li>Mettre à jour ses informations en cas de changement (téléphone, ville, etc.)</li>
      </ul>
      <p>
        Le Dahira KSN se réserve le droit de suspendre ou supprimer tout compte
        en cas de manquement aux présentes CGU.
      </p>

      <h2>4. Statuts utilisateur</h2>
      <ul>
        <li><strong>Visiteur (inactif) :</strong> accès libre aux contenus publics et au Salaatu du jour + 2 premiers Salaats</li>
        <li><strong>En attente :</strong> a soumis sa demande d&apos;adhésion et complété son profil — attend le règlement de la cotisation</li>
        <li><strong>Membre actif :</strong> cotisation 1 000 FCFA réglée — accès complet à la bibliothèque, carte de membre officielle avec matricule</li>
        <li><strong>Commission :</strong> responsable d&apos;une commission officielle avec permissions admin spécifiques</li>
        <li><strong>Administrateur :</strong> contrôle total du site (Bureau du Dahira)</li>
      </ul>

      <h2>5. Engagement de respect du contenu sacré</h2>
      <p>
        Le Salaatu sur le Prophète Muhammad ﷺ et les contenus de la
        bibliothèque sont des éléments <strong>sacrés</strong>. En accédant à
        la bibliothèque complète, le membre s&apos;engage formellement à :
      </p>
      <ul>
        <li>Ne pas faire de capture d&apos;écran du contenu sacré</li>
        <li>Ne pas diffuser ces secrets hors du Dahira sans autorisation</li>
        <li>Revenir consulter régulièrement plutôt que sauvegarder</li>
        <li>Respecter la transmission orale et spirituelle traditionnelle</li>
        <li>Ne pas commercialiser ni dénaturer les contenus</li>
      </ul>

      <h2>6. Comportements interdits</h2>
      <p>L&apos;utilisateur s&apos;interdit notamment de :</p>
      <ul>
        <li>Diffuser des propos haineux, injurieux, racistes, sexistes ou contraires à l&apos;islam</li>
        <li>Tenter de pirater, contourner ou compromettre la sécurité du site</li>
        <li>Utiliser des robots, scrapers ou outils automatisés sans autorisation</li>
        <li>Usurper l&apos;identité du Dahira ou de ses membres</li>
        <li>Effectuer des transactions frauduleuses</li>
      </ul>

      <h2>7. Propriété intellectuelle</h2>
      <p>
        Voir les <a href="/mentions-legales">mentions légales</a> — section 5.
      </p>

      <h2>8. Disponibilité du service</h2>
      <p>
        Le Dahira s&apos;efforce de maintenir le site accessible 24h/24, 7j/7.
        Toutefois, des interruptions pour maintenance ou raisons techniques
        peuvent survenir. La responsabilité du Dahira ne peut être engagée en
        cas d&apos;indisponibilité temporaire.
      </p>

      <h2>9. Responsabilité</h2>
      <p>
        Le contenu spirituel publié sur le site reflète la voie suivie par le
        Dahira KSN. Le Dahira ne saurait être tenu responsable de
        l&apos;utilisation inappropriée des contenus par les utilisateurs.
      </p>

      <h2>10. Suspension et résiliation</h2>
      <p>
        En cas de non-respect des CGU, le Dahira peut suspendre temporairement
        ou définitivement le compte de l&apos;utilisateur, sans préavis si la
        gravité du manquement le justifie.
      </p>
      <p>
        L&apos;utilisateur peut à tout moment demander la suppression de son
        compte via la page <a href="/contact">contact</a> ou WhatsApp.
      </p>

      <h2>11. Modification des CGU</h2>
      <p>
        Le Dahira se réserve le droit de modifier les présentes CGU à tout
        moment. La version applicable est celle en vigueur à la date de
        l&apos;utilisation du site.
      </p>

      <h2>12. Droit applicable</h2>
      <p>
        Les présentes CGU sont régies par le droit sénégalais. En cas de
        litige, et après tentative de résolution amiable, les tribunaux de
        Dakar seront seuls compétents.
      </p>
    </LegalShell>
  );
}
