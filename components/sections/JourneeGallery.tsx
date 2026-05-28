"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaCamera, FaXmark, FaImage, FaYoutube, FaVideo } from "react-icons/fa6";
import { listGallery, listYoutubeLinks, YoutubeLink } from "@/lib/admin-data";
import { GalleryItem as DBGalleryItem } from "@/lib/admin-types";

type GalleryItem = {
  src: string | null;
  caption: string;
  year: string;
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

function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  const clean = url.trim();
  const liveMatch = clean.match(/(?:youtube\.com\/live\/)([a-zA-Z0-9_-]+)/);
  if (liveMatch && liveMatch[1]) return liveMatch[1];
  const shortMatch = clean.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (shortMatch && shortMatch[1]) return shortMatch[1];
  const watchMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) return watchMatch[1];
  const embedMatch = clean.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (embedMatch && embedMatch[1]) return embedMatch[1];
  return null;
}

export default function JourneeGallery() {
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [dbItems, setDbItems] = useState<DBGalleryItem[]>([]);
  const [ytLinks, setYtLinks] = useState<YoutubeLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [openYtId, setOpenYtId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      listGallery().then((items) => items.filter((item) => item.category === "journee")),
      listYoutubeLinks(),
    ])
      .then(([photos, videos]) => {
        setDbItems(photos);
        setYtLinks(videos);
      })
      .catch((err) => console.error("Failed to fetch gallery items / youtube links", err))
      .finally(() => setLoading(false));
  }, []);

  const closeLightbox = () => setOpenIdx(null);

  const displayItems = dbItems.length > 0
    ? dbItems.map((d) => ({
        src: d.src,
        caption: d.alt || "Souvenir KSN",
        year: d.year || "2025",
        bgClass: "bg-gradient-to-br from-[#0F7C55] to-[#0A3D24]"
      }))
    : ITEMS;

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="text-center mb-8">
        <span className="uppercase tracking-[0.25em] text-[#D4AF37] font-semibold text-xs sm:text-sm">
          Souvenirs Multimédias
        </span>
        <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          Les éditions précédentes
        </h2>
        <p className="mt-4 text-white/70 max-w-2xl mx-auto text-sm sm:text-base mb-8">
          Quelques instantanés et conférences capturés lors des précédentes éditions de la Journée Salaatu ʿAlaa Nabii à Touba.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          type="button"
          onClick={() => setActiveTab("photos")}
          className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all ${
            activeTab === "photos"
              ? "bg-[#D4AF37] text-[#0F7C55] shadow-lg shadow-[#D4AF37]/20"
              : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
          }`}
        >
          📷 Photos Souvenirs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("videos")}
          className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all ${
            activeTab === "videos"
              ? "bg-[#D4AF37] text-[#0F7C55] shadow-lg shadow-[#D4AF37]/20"
              : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
          }`}
        >
          🎥 Vidéos & Conférences ({ytLinks.length})
        </button>
      </div>

      {/* GRILLE PHOTOS */}
      {activeTab === "photos" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 animate-fadeIn">
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
                  <div
                    className={`absolute inset-0 ${item.bgClass} flex flex-col items-center justify-center text-white/80 p-4`}
                  >
                    <FaImage className="text-3xl sm:text-4xl text-white/40 mb-3" />
                    <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-white/60">
                      {item.year}
                    </div>
                  </div>
                )}

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
      )}

      {/* GRILLE VIDEOS */}
      {activeTab === "videos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {loading ? (
            <div className="col-span-full py-12 text-center text-white/50">
              Chargement des vidéos...
            </div>
          ) : ytLinks.length === 0 ? (
            <div className="col-span-full py-16 text-center text-white/50 bg-white/5 rounded-3xl border border-white/10">
              <FaYoutube className="mx-auto text-5xl text-white/30 mb-3" />
              <p className="text-sm">Aucune vidéo d&apos;archive disponible pour le moment.</p>
            </div>
          ) : (
            ytLinks.map((link) => {
              const videoId = getYoutubeVideoId(link.url);
              const thumbUrl = videoId
                ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                : null;

              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => videoId && setOpenYtId(videoId)}
                  className="group text-left bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden transition-all shadow-lg flex flex-col justify-between"
                >
                  <div className="w-full">
                    <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                      {thumbUrl ? (
                        <Image
                          src={thumbUrl}
                          alt={link.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                          unoptimized
                        />
                      ) : (
                        <FaYoutube className="text-red-600 text-5xl" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <FaYoutube className="text-white text-2xl" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                        <FaVideo className="text-[10px]" /> Vidéo {link.year ? `· Édition ${link.year}` : ""}
                      </span>
                      <h3 className="font-display font-bold text-white text-sm sm:text-base mt-1.5 leading-snug line-clamp-2">
                        {link.title}
                      </h3>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* AVIS PHOTOS BIENVENUES */}
      <div className="mt-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 max-w-3xl mx-auto text-center">
        <FaCamera className="mx-auto text-[#D4AF37] text-2xl mb-3" />
        <p className="text-white/80 text-sm sm:text-base leading-7">
          Vous avez des photos ou des vidéos des éditions précédentes ? Partagez-les avec
          nous via{" "}
          <a
            href="https://wa.me/message/2RQFZOER66SOC1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D4AF37] font-bold hover:underline"
          >
            WhatsApp
          </a>{" "}
          — elles enrichiront nos galeries pour toute la communauté.
        </p>
      </div>

      {/* LIGHTBOX PHOTOS */}
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

      {/* LIGHTBOX YOUTUBE */}
      {openYtId && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setOpenYtId(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setOpenYtId(null)}
            aria-label="Fermer"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl"
          >
            <FaXmark />
          </button>
          <div
            className="relative max-w-5xl w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37]/30"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${openYtId}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
