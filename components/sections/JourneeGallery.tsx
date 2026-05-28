"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaCamera, FaXmark, FaImage } from "react-icons/fa6";
import { listGallery } from "@/lib/admin-data";
import { GalleryItem as DBGalleryItem } from "@/lib/admin-types";

/** Configuration des photos de la galerie.
 *  Pour ajouter de vraies photos :
 *    1. Placer les fichiers dans public/images/journee/  (jpg/webp/png)
 *    2. Remplacer null par le chemin "/images/journee/xxx.jpg"
 *    3. Renseigner caption + year pour le contexte
 */
type GalleryItem = {
  src: string | null;
  caption: string;
  year: string;
  // hint visuel quand pas de photo (couleur de fond pastel)
  bgClass: string;
};

const ITEMS: GalleryItem[] = [
  {
    src: "/images/journee/recital_coran.png",
    caption: "Récital du Saint Coran à l'ouverture",
    year: "2025",
    bgClass: "bg-gradient-to-br from-[#0F7C55] to-[#0A3D24]",
  },
  {
    src: "/images/journee/rajass_collectif.png",
    caption: "Rajass collectif — Muqàddamatul Xidma",
    year: "2025",
    bgClass: "bg-gradient-to-br from-[#B8860B] to-[#D4AF37]",
  },
  {
    src: "/images/journee/conference_badiane.png",
    caption: "Conférence de Serigne Moustapha Badiane",
    year: "2025",
    bgClass: "bg-gradient-to-br from-[#0A3D24] to-[#082F22]",
  },
  {
    src: "/images/journee/declamation_khassida.png",
    caption: "Déclamation des Khassida — Kourel Hizbut Tarqiya",
    year: "2024",
    bgClass: "bg-gradient-to-br from-[#D4AF37] to-[#B8860B]",
  },
  {
    src: "/images/journee/mosquee_touba.png",
    caption: "La oumma réunie devant la grande mosquée",
    year: "2024",
    bgClass: "bg-gradient-to-br from-[#0F7C55] via-[#0A3D24] to-[#082F22]",
  },
  {
    src: "/images/journee/discours_bassirou.png",
    caption: "Mot de la Fin par Serigne Bassirou Toure",
    year: "2024",
    bgClass: "bg-gradient-to-br from-[#F5D76E] via-[#D4AF37] to-[#B8860B]",
  },
];

export default function JourneeGallery() {
  const [dbItems, setDbItems] = useState<DBGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    listGallery()
      .then((items) => {
        const filtered = items.filter((item) => item.category === "journee");
        setDbItems(filtered);
      })
      .catch((err) => console.error("Failed to fetch gallery items", err))
      .finally(() => setLoading(false));
  }, []);

  const closeLightbox = () => setOpenIdx(null);

  const displayItems = [
    ...ITEMS,
    ...dbItems.map((d) => ({
      src: d.src,
      caption: d.alt || "Souvenir KSN",
      year: d.year || "2025",
      bgClass: "bg-gradient-to-br from-[#0F7C55] to-[#0A3D24]"
    }))
  ];

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="text-center mb-10 sm:mb-14">
        <span className="uppercase tracking-[0.25em] text-[#D4AF37] font-semibold text-xs sm:text-sm">
          Galerie souvenirs
        </span>
        <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          Les éditions précédentes
        </h2>
        <p className="mt-4 text-white/70 max-w-2xl mx-auto text-sm sm:text-base">
          Quelques instantanés des moments forts vécus à Touba lors des
          précédentes éditions de la Journée Salaatu ʿAlaa Nabii.
        </p>
      </div>

      {/* GRILLE */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-white/50">
            Chargement des photos...
          </div>
        ) : (
          displayItems.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => item.src && setOpenIdx(i)}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 hover:border-[#D4AF37]/50 transition shadow-lg"
              aria-label={item.caption}
            >
              {item.src ? (
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                // Placeholder esthétique en attendant les vraies photos
                <div
                  className={`absolute inset-0 ${item.bgClass} flex flex-col items-center justify-center text-white/80 p-4`}
                >
                  <FaImage className="text-3xl sm:text-4xl text-white/40 mb-3" />
                  <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-white/60">
                    {item.year}
                  </div>
                </div>
              )}

              {/* Caption gradient au survol */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 sm:p-4 text-left opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs sm:text-sm font-bold leading-snug">
                  {item.caption}
                </p>
                <p className="text-[#D4AF37] text-[10px] sm:text-xs mt-1 font-semibold">
                  {item.year}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* AVIS PHOTOS BIENVENUES */}
      <div className="mt-8 sm:mt-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 max-w-3xl mx-auto text-center">
        <FaCamera className="mx-auto text-[#D4AF37] text-2xl mb-3" />
        <p className="text-white/80 text-sm sm:text-base leading-7">
          Vous avez des photos des éditions précédentes ? Partagez-les avec
          nous via{" "}
          <a
            href="https://wa.me/message/2RQFZOER66SOC1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D4AF37] font-bold hover:underline"
          >
            WhatsApp
          </a>{" "}
          — elles enrichiront cette galerie pour toute la communauté.
        </p>
      </div>

      {/* LIGHTBOX */}
      {openIdx !== null && displayItems[openIdx].src && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Fermer"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl"
          >
            <FaXmark />
          </button>
          <div
            className="relative max-w-5xl w-full aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={displayItems[openIdx].src as string}
              alt={displayItems[openIdx].caption}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-5 sm:p-7 text-center">
              <p className="text-white text-base sm:text-lg font-bold">
                {displayItems[openIdx].caption}
              </p>
              <p className="text-[#D4AF37] text-sm mt-1 font-semibold">
                Édition {displayItems[openIdx].year}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
