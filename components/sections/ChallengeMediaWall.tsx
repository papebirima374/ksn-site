"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaBullhorn, FaMoon } from "react-icons/fa6";
import { listChallengeMedia, type ChallengeMedia } from "@/lib/admin-data";
import { useT } from "@/lib/i18n/context";

/** Mur public des annonces / photos Jour J du Challenge (avec commentaires).
 *  Ne s'affiche que s'il y a du contenu. */
export default function ChallengeMediaWall() {
  const { t } = useT();
  const [media, setMedia] = useState<ChallengeMedia[]>([]);

  useEffect(() => {
    listChallengeMedia()
      .then(setMedia)
      .catch(() => setMedia([]));
  }, []);

  if (media.length === 0) return null;

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="text-center mb-8 sm:mb-10">
        <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
          {t("challmedia.overline")}
        </span>
        <h2 className="font-display mt-3 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          {t("challmedia.title")}
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {media.map((m) => (
          <figure
            key={m.id}
            className="bg-white rounded-[24px] overflow-hidden shadow-[0_12px_50px_rgba(0,0,0,0.08)] flex flex-col"
          >
            <div className="relative aspect-[4/5] bg-[#EBF0ED]">
              <Image
                src={m.src}
                alt={m.comment || "Challenge KSN"}
                fill
                sizes="(max-width:768px) 100vw, 33vw"
                className="object-cover"
                unoptimized={m.src.startsWith("http")}
              />
              <span
                className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                  m.type === "jourj"
                    ? "bg-[#0F7C55] text-[#D4AF37]"
                    : "bg-[#D4AF37] text-[#0F7C55]"
                }`}
              >
                {m.type === "jourj" ? <FaMoon /> : <FaBullhorn />}
                {m.type === "jourj" ? t("challmedia.jourj") : t("challmedia.annonce")}
              </span>
            </div>
            {m.comment && (
              <figcaption className="p-5 text-gray-700 text-sm leading-6 flex-1">
                {m.comment}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
