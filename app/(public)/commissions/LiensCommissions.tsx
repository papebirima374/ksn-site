"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCopy, FaCheck, FaWhatsapp, FaArrowRight } from "react-icons/fa6";
import { COMMISSIONS } from "@/lib/commissions";
import { SITE } from "@/lib/constants";

export default function LiensCommissions() {
  const [copie, setCopie] = useState<string | null>(null);

  const lien = (slug: string) => `${SITE.url}/commissions/${slug}`;

  const message = (nom: string, url: string) =>
    encodeURIComponent(
      `As-salaamu 'alaykum.\n\n` +
        `Dans le cadre de l'Assemblée Générale du 19 septembre 2026, merci de remplir le ` +
        `formulaire de rapport de la commission ${nom} :\n\n${url}\n\n` +
        `Il contient le compte rendu de la commission, le bilan provisoire des Salaatu, ` +
        `la mise au point sur les cellules et vos propositions pour la prochaine Journée ` +
        `Salaatu 'Alaa Nabii.\n\nJazaakumu Laahu khayran.`
    );

  async function copier(slug: string) {
    try {
      await navigator.clipboard.writeText(lien(slug));
      setCopie(slug);
      setTimeout(() => setCopie((c) => (c === slug ? null : c)), 2200);
    } catch {
      window.prompt("Copiez ce lien :", lien(slug));
    }
  }

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-24">
      <div className="grid gap-5 sm:grid-cols-2">
        {COMMISSIONS.map((c) => (
          <div
            key={c.slug}
            className="bg-white/[.06] backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-none">{c.emoji}</span>
              <div className="min-w-0">
                <h2 className="font-display text-xl font-bold text-[#D4AF37]">{c.nom}</h2>
                <p className="mt-2 text-sm text-white/65 leading-6">{c.mission}</p>
              </div>
            </div>

            <code className="mt-5 block bg-black/25 border border-white/10 rounded-xl px-3 py-2.5 text-[11px] sm:text-xs text-[#CFE4D9] break-all">
              {lien(c.slug)}
            </code>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => copier(c.slug)}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                {copie === c.slug ? (
                  <>
                    <FaCheck className="text-[#7BD3A6]" /> Lien copié
                  </>
                ) : (
                  <>
                    <FaCopy /> Copier le lien
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/?text=${message(c.nom, lien(c.slug))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366]/90 hover:bg-[#25D366] text-[#06291D] px-4 py-2.5 rounded-xl text-sm font-bold transition"
              >
                <FaWhatsapp /> Envoyer
              </a>

              <Link
                href={`/commissions/${c.slug}`}
                className="inline-flex items-center gap-2 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 px-4 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Ouvrir <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-6 text-center">
        <p className="text-sm text-[#F1E7C9] leading-7">
          Chaque commission reçoit <b>son propre lien</b> : elle ne voit et ne remplit que sa
          fiche. Les rapports transmis arrivent dans l&apos;espace d&apos;administration,
          rubrique <b>« Rapports de commission »</b>.
        </p>
      </div>
    </div>
  );
}
