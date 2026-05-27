import type { Metadata } from "next";
import LegalShell from "@/components/layout/LegalShell";
import { SITE, LINKS, PAYMENT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site officiel du Dahira Kippangog Salaatu 'Alaa Nabii : éditeur, hébergeur, directeur de publication.",
};

export default function MentionsLegales() {
  return (
    <LegalShell overline="Informations légales" title="Mentions légales" activeHref="/mentions-legales">
      <h2>1. Éditeur du site</h2>
      <p>
        Le présent site <strong>{SITE.url}</strong> est édité par le{" "}
        <strong>Dahira {SITE.fullName}</strong> ({SITE.name}), organisation
        religieuse à but non lucratif fondée le 02 janvier 2021, dont le siège
        social se situe à {SITE.location}.
      </p>
      <ul>
        <li><strong>Dénomination :</strong> Dahira Kippangog Salaatu &apos;Alaa Nabii</li>
        <li><strong>Sigle :</strong> KSN</li>
        <li><strong>Forme juridique :</strong> Association religieuse</li>
        <li><strong>Siège social :</strong> {SITE.location}</li>
        <li><strong>Président d&apos;Honneur :</strong> Serigne Bassirou Touré</li>
        <li><strong>Président &amp; Fondateur :</strong> Serigne Birima Gueye</li>
        <li><strong>Téléphone (WhatsApp officiel) :</strong> +221 76 725 72 72</li>
        <li><strong>Site officiel :</strong> {SITE.domain}</li>
      </ul>

      <h2>2. Directeur de la publication</h2>
      <p>
        Le directeur de la publication est <strong>Serigne Birima Gueye</strong>,
        Fondateur et Président du Dahira. Il est responsable des contenus
        diffusés sur le présent site.
      </p>

      <h2>3. Hébergement</h2>
      <p>
        Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave
        #4133, Walnut, CA 91789, États-Unis — <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>.
      </p>
      <p>
        Le nom de domaine <strong>{SITE.domain}</strong> est enregistré auprès
        d&apos;un registrar sénégalais agréé.
      </p>

      <h2>4. Conception et développement</h2>
      <p>
        Le site a été conçu et développé pour le compte du Dahira KSN. La
        maintenance technique est assurée sous la supervision de la
        Commission Communication du Dahira.
      </p>

      <h2>5. Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des éléments du site (textes, photographies,
        graphismes, logo, identité visuelle, calligraphies arabes, vidéos,
        bases de données) sont la propriété exclusive du Dahira KSN ou de ses
        ayants droit, ou utilisés avec l&apos;autorisation de leurs auteurs.
      </p>
      <p>
        Toute reproduction, représentation, modification, publication,
        adaptation totale ou partielle des éléments du site, quel que soit le
        moyen ou le procédé utilisé, est interdite sans autorisation écrite
        préalable du Dahira KSN, sauf exceptions légales (droit de citation,
        usage privé, etc.).
      </p>
      <p>
        Les <strong>contenus de la bibliothèque des Salaats</strong>
        (formulations, secrets d&apos;utilisation et notes spirituelles
        compilées par le Dahira) sont protégés. Toute capture d&apos;écran,
        copie ou diffusion hors du Dahira sans autorisation est strictement
        interdite.
      </p>

      <h2>6. Crédits</h2>
      <ul>
        <li><strong>Calligraphies arabes :</strong> tradition islamique, libres de droit</li>
        <li><strong>Logo et identité visuelle KSN :</strong> propriété du Dahira KSN</li>
        <li><strong>Photographies :</strong> archives du Dahira et contributions des membres</li>
      </ul>

      <h2>7. Liens hypertextes</h2>
      <p>
        Le site peut contenir des liens vers des sites tiers (réseaux sociaux,
        plateformes de paiement, application mobile KSN, etc.). Le Dahira KSN
        n&apos;exerce aucun contrôle sur ces sites et décline toute
        responsabilité quant à leur contenu.
      </p>

      <h2>8. Contact</h2>
      <p>
        Pour toute question relative aux présentes mentions légales :
      </p>
      <ul>
        <li>WhatsApp officiel : <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer">+221 76 725 72 72</a></li>
        <li>Formulaire : <a href="/contact">/contact</a></li>
      </ul>

      <h2>9. Droit applicable</h2>
      <p>
        Les présentes mentions légales sont régies par le droit sénégalais.
        Tout litige relatif à l&apos;utilisation du site sera, à défaut
        d&apos;accord amiable, soumis aux tribunaux compétents de Dakar
        (Sénégal).
      </p>
    </LegalShell>
  );
}
