export type GalleryCategoryId =
  | "tous"
  | "evenements"
  | "activites"
  | "journee"
  | "assemblee";

export type GalleryPhoto = {
  src: string;
  alt: string;
  category: Exclude<GalleryCategoryId, "tous">;
  date?: string;
};

export const GALLERY_CATEGORIES: { id: GalleryCategoryId; label: string }[] = [
  { id: "tous", label: "Tous" },
  { id: "evenements", label: "Événements" },
  { id: "activites", label: "Activités" },
  { id: "journee", label: "Journée Salaatu" },
  { id: "assemblee", label: "Assemblée générale" },
];

// Pour ajouter une photo : déposer le fichier dans /public/gallery/ puis
// ajouter une entrée ici (ou utiliser le panneau admin une fois en ligne).
const FEATURED: GalleryPhoto[] = [
  {
    src: "/images/bassirou.jpeg",
    alt: "Serigne Bassirou Touré — Président d'Honneur",
    category: "evenements",
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

// Migration des 46 photos hardcoded apres suppression des categories
// "gamou" et "conferences" : on les reaffecte aux categories restantes.
//   1-23 (anciennement gamou + conferences) -> "evenements"
//   24-36 (anciennement evenements) -> "evenements"
//   37-46 (anciennement activites) -> "activites"
const KSN_PHOTOS = Array.from({ length: 46 }, (_, i): GalleryPhoto => {
  const n = i + 1;
  const padded = String(n).padStart(3, "0");
  const category: GalleryPhoto["category"] = n <= 36 ? "evenements" : "activites";
  return {
    src: `/gallery/ksn-${padded}.jpg`,
    alt: `Activité KSN — Photo ${n}`,
    category,
  };
});

export const GALLERY: GalleryPhoto[] = [...FEATURED, ...KSN_PHOTOS];
