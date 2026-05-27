import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

/** Web App Manifest — permet l'installation du site comme application
 *  sur iPhone (Safari "Ajouter a l'ecran d'accueil"), Android Chrome
 *  (banniere "Installer l'application"), et desktop Chrome/Edge. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `Site KSN — ${SITE.fullName}`,
    short_name: "Site KSN",
    description:
      "Dahira international au service du Salaatu sur le Prophète Muhammad ﷺ. Compteur live du Challenge 1 Milliard, bibliothèque spirituelle, espace membre.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "fr",
    dir: "ltr",
    background_color: "#0A3D24",
    theme_color: "#0F7C55",
    categories: ["lifestyle", "education", "social"],
    icons: [
      {
        src: "/logo/ksn-logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo/ksn-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo/ksn-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Challenge 1 Milliard",
        short_name: "Challenge",
        description: "Voir le compteur live du Challenge",
        url: "/challenge",
      },
      {
        name: "Journée Salaatu",
        short_name: "Journée",
        description: "Prochaine édition de la Journée Salaatu",
        url: "/journee-salaatu",
      },
      {
        name: "Mon Espace Membre",
        short_name: "Espace Membre",
        description: "Accéder à mon profil membre",
        url: "/espace-membre",
      },
    ],
  };
}
