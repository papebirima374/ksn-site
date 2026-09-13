"use client";

import { useState } from "react";
import { FaFilePdf, FaScaleBalanced, FaLandmark, FaFeatherPointed } from "react-icons/fa6";
import { REGLEMENT, STATUTS, REPERES, ADOPTION, type Article } from "@/lib/reglement";
import { SECRETARIATS, SIGNATAIRES } from "@/lib/bureau";

type Onglet = "reglement" | "statuts";

export default function ReglementContent() {
  const [onglet, setOnglet] = useState<Onglet>("reglement");
  const articles = onglet === "reglement" ? REGLEMENT : STATUTS;

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-24">
      {/* ── Repères chiffrés ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
        {REPERES.map((r) => (
          <div
            key={r.detail}
            className="rounded-2xl bg-white/[.06] border border-white/10 p-4 sm:p-5 text-center"
          >
            <p className="font-display text-2xl sm:text-3xl font-black text-[#D4AF37] leading-none">
              {r.valeur}
            </p>
            <p className="mt-1.5 text-xs font-bold text-white/85">{r.unite}</p>
            <p className="mt-1 text-[11px] text-white/45 leading-4">{r.detail}</p>
          </div>
        ))}
      </div>

      {/* ── Onglets ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-2xl bg-white/[.05] border border-white/10">
        <Onglets actif={onglet === "reglement"} onClick={() => setOnglet("reglement")}
          icone={<FaScaleBalanced />} label="Règlement Intérieur" nb={REGLEMENT.length} />
        <Onglets actif={onglet === "statuts"} onClick={() => setOnglet("statuts")}
          icone={<FaLandmark />} label="Statuts Officiels" nb={STATUTS.length} />
      </div>

      {/* ── Articles ──────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {articles.map((a) => (
          <CarteArticle key={`${onglet}-${a.numero}`} article={a} />
        ))}
      </div>

      {/* ── Les postes du Bureau (article 3) ──────────────────────────── */}
      {onglet === "reglement" && (
        <div className="mt-6 rounded-[24px] bg-white/[.05] border border-white/10 p-6 sm:p-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#D4AF37]">
            Article 3 — le détail
          </p>
          <h3 className="font-display mt-2 text-xl font-bold text-white">
            Les postes du Bureau et leurs attributions
          </h3>
          <div className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-5">
            {SECRETARIATS.map((s) => (
              <div key={s.titre} className="border-l-2 border-[#D4AF37]/40 pl-4">
                <p className="text-sm font-bold text-[#E8CE72] leading-snug">{s.titre}</p>
                <p className="mt-1 text-sm text-white/60 leading-6">{s.role}</p>
              </div>
            ))}
          </div>
          <a
            href="/dahira?section=organigramme"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#D4AF37] hover:underline"
          >
            Voir qui occupe chaque poste →
          </a>
        </div>
      )}

      {/* ── Adoption et signatures ────────────────────────────────────── */}
      <div className="mt-8 rounded-[24px] bg-gradient-to-br from-[#0A3A27] to-[#0F7C55] border border-[#D4AF37]/25 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <FaFeatherPointed className="text-[#D4AF37]" />
          <p className="text-sm text-white/80">
            Adopté à <b className="text-white">{ADOPTION.lieu}</b>, le{" "}
            <b className="text-white">{ADOPTION.date}</b>, sous la grâce d&apos;Allah et la
            lumière éternelle du Prophète Muhammad ﷺ.
          </p>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SIGNATAIRES.map((s) => (
            <div key={s.role} className="border-t border-[#D4AF37]/30 pt-3">
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#D4AF37] font-bold">
                {s.role}
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{s.nom}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Document signé ────────────────────────────────────────────── */}
      <a
        href="/documents/reglement-statuts-ksn.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-center gap-3 rounded-2xl border-2 border-[#D4AF37]/45 hover:bg-[#D4AF37]/10 px-6 py-4 font-bold text-[#D4AF37] transition"
      >
        <FaFilePdf /> Télécharger le document officiel signé (PDF)
      </a>
      <p className="mt-3 text-center text-xs text-white/40">
        En cas de divergence, le document signé fait foi.
      </p>
    </div>
  );
}

function Onglets({
  actif,
  onClick,
  icone,
  label,
  nb,
}: {
  actif: boolean;
  onClick: () => void;
  icone: React.ReactNode;
  label: string;
  nb: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-[10rem] inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold transition ${
        actif
          ? "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#082F22]"
          : "text-white/65 hover:text-white hover:bg-white/5"
      }`}
    >
      {icone} {label}
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded-md ${
          actif ? "bg-[#082F22]/15" : "bg-white/10"
        }`}
      >
        {nb}
      </span>
    </button>
  );
}

function CarteArticle({ article }: { article: Article }) {
  return (
    <article className="rounded-[22px] bg-white/[.05] border border-white/10 p-5 sm:p-7 hover:border-[#D4AF37]/30 transition">
      <div className="flex items-start gap-4">
        <span className="flex-none w-11 h-11 rounded-xl bg-gradient-to-br from-[#B8860B] to-[#D4AF37] text-[#082F22] font-display font-black flex items-center justify-center">
          {article.numero}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
            {article.titre}
          </h3>

          {article.texte?.map((p, i) => (
            <p key={i} className="mt-3 text-sm sm:text-[15px] text-white/70 leading-7">
              {p}
            </p>
          ))}

          {article.points && (
            <ul className="mt-4 space-y-2.5">
              {article.points.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/75 leading-7">
                  <span className="flex-none mt-2.5 w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
