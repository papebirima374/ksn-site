export type GalleryCategoryId =
  | "tous"
  | "gamou"
  | "conferences"
  | "evenements"
  | "activites"
  | "journee";

export type GalleryPhoto = {
  src: string;
  alt: string;
  category: Exclude<GalleryCategoryId, "tous">;
  date?: string;
};

export const GALLERY_CATEGORIES: { id: GalleryCategoryId; label: string }[] = [
  { id: "tous", label: "Tous" },
  { id: "gamou", label: "Gamou" },
  { id: "conferences", label: "Conférences" },
  { id: "evenements", label: "Événements" },
  { id: "activites", label: "Activités" },
  { id: "journee", label: "Journée Salaatu" },
];

// Pour ajouter une photo : déposer le fichier dans /public/gallery/ puis
// ajouter une entrée ici (ou utiliser le panneau admin une fois en ligne).
const FEATURED: GalleryPhoto[] = [
  {
    src: "/images/bassirou.jpeg",
    alt: "Serigne Bassirou Touré — Président d'Honneur",
    category: "conferences",
  },
  {
    src: "/images/birima.jpeg",
    alt: "Serigne Birima Gueye — Président & Fondateur",
    category: "evenements",
  },
  {
    src: "/images/appksn.jpeg",
    alt: "Application mobile KSN",
    category: "activites",
  },
];

const KSN_PHOTOS = Array.from({ length: 46 }, (_, i): GalleryPhoto => {
  const n = i + 1;
  const padded = String(n).padStart(3, "0");
  let category: GalleryPhoto["category"];
  if (n <= 12) category = "gamou";
  else if (n <= 24) category = "conferences";
  else if (n <= 36) category = "evenements";
  else category = "activites";
  return {
    src: `/gallery/ksn-${padded}.jpg`,
    alt: `Activité KSN — Photo ${n}`,
    category,
  };
});

export const GALLERY: GalleryPhoto[] = [...FEATURED, ...KSN_PHOTOS];
