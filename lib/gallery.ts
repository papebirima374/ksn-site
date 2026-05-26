export type GalleryCategoryId =
  | "tous"
  | "gamou"
  | "conferences"
  | "evenements"
  | "activites";

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
];

// Pour ajouter une photo : la déposer dans /public/gallery/ puis ajouter
// l'entrée ici avec la catégorie correspondante.
export const GALLERY: GalleryPhoto[] = [
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
