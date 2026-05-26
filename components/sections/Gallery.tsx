"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  GALLERY,
  GALLERY_CATEGORIES,
  GalleryCategoryId,
  GalleryPhoto,
} from "@/lib/gallery";
import { isFirebaseConfigured } from "@/lib/firebase";
import { listGallery } from "@/lib/admin-data";

export default function Gallery() {
  const [category, setCategory] = useState<GalleryCategoryId>("tous");
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);
  const [remote, setRemote] = useState<GalleryPhoto[]>([]);

  // Fetch admin-uploaded photos from Firestore (best effort, public read)
  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    listGallery()
      .then((items) =>
        setRemote(
          items.map((i) => ({
            src: i.src,
            alt: i.alt,
            category: i.category,
          }))
        )
      )
      .catch(() => {
        // ignore — galerie statique sera affichée seule
      });
  }, []);

  const all = useMemo(() => [...remote, ...GALLERY], [remote]);

  const filtered = useMemo(() => {
    if (category === "tous") return all;
    return all.filter((p) => p.category === category);
  }, [all, category]);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightbox, closeLightbox]);

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14">
        <div className="text-center mb-8 sm:mb-12">
          <span className="uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
            Galerie Photos KSN
          </span>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F5132]">
            Moments du Dahira
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto leading-7 text-sm sm:text-base">
            Cliquez sur une photo pour la voir en grand. Filtrez par catégorie
            pour retrouver un événement précis.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {GALLERY_CATEGORIES.map((cat) => {
            const active = cat.id === category;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition ${
                  active
                    ? "bg-[#0F5132] text-white shadow-md"
                    : "bg-[#F8F5EF] text-[#0F5132] hover:bg-[#E8E6E1]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <div className="text-5xl sm:text-6xl">📷</div>
            <p className="mt-4 text-gray-500 text-sm sm:text-base">
              Aucune photo dans cette catégorie pour l&apos;instant.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filtered.map((photo, i) => (
              <button
                key={`${photo.src}-${i}`}
                type="button"
                onClick={() => setLightbox(photo)}
                className="relative aspect-square overflow-hidden rounded-2xl sm:rounded-3xl group focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                aria-label={photo.alt}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized={photo.src.startsWith("http")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 sm:p-4">
                  <p className="text-white text-xs sm:text-sm font-medium line-clamp-2">
                    {photo.alt}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        <p className="mt-8 sm:mt-12 text-center text-gray-500 text-xs sm:text-sm italic">
          Galerie alimentée par l&apos;équipe KSN. {all.length} photo
          {all.length > 1 ? "s" : ""} disponibles.
        </p>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl transition"
            aria-label="Fermer"
          >
            ✕
          </button>

          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[70vh] sm:h-[75vh]">
              <Image
                src={lightbox.src}
                alt={lightbox.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
                unoptimized={lightbox.src.startsWith("http")}
              />
            </div>
            <p className="mt-4 text-center text-white/90 text-sm sm:text-base font-medium">
              {lightbox.alt}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
