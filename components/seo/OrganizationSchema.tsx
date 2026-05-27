import { SITE, LINKS } from "@/lib/constants";

/** Schema.org structured data for the Dahira KSN. Renders a JSON-LD
 *  <script> tag so Google can show rich results (logo, social profiles,
 *  contact info) on search. */
export default function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ReligiousOrganization",
    name: SITE.fullName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo/ksn-logo.png`,
    image: `${SITE.url}/logo/ksn-logo.png`,
    description:
      "Dahira international au service de la prière sur le Prophète Muhammad ﷺ. Fondé le 02 janvier 2021 à Touba, Sénégal.",
    foundingDate: "2021-01-02",
    foundingLocation: {
      "@type": "Place",
      name: "Touba, Sénégal",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Touba",
      addressCountry: "SN",
    },
    sameAs: [
      LINKS.facebook,
      LINKS.youtube,
      LINKS.instagram,
      LINKS.tiktok,
      LINKS.telegram,
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        availableLanguage: ["French", "Arabic", "English", "Wolof"],
        url: LINKS.whatsapp,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
