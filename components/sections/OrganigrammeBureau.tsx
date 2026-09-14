"use client";

import { FaCrown, FaUserTie } from "react-icons/fa6";
import { PRESIDENCE, SECRETARIATS, COMMISSIONS_BUREAU, type Poste } from "@/lib/bureau";
import { useT } from "@/lib/i18n/context";

/** Initiales, pour la pastille qui tient lieu de portrait tant que le Dahira
 *  n'a pas fourni de photos. « Serigne » et « Sokhna » sont des titres, pas
 *  des prenoms : on les ignore pour ne pas obtenir « SB » partout. */
function initiales(nom: string): string {
  const mots = nom
    .split(/\s+/)
    .filter((m) => !/^(serigne|sokhna|el|elhadji|mame)$/i.test(m));
  return mots.slice(0, 2).map((m) => m[0]?.toUpperCase() ?? "").join("");
}

export default function OrganigrammeBureau() {
  const { t } = useT();

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="text-center mb-10 sm:mb-14">
        <span className="text-[#D4AF37] uppercase tracking-[0.25em] font-semibold text-xs sm:text-sm">
          {t("organigramme.overline")}
        </span>
        <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          {t("organigramme.title")}
        </h2>
        <p className="mt-5 text-white/65 max-w-2xl mx-auto leading-8">
          Composition officielle du Bureau, avec les attributions définies à
          l&apos;article&nbsp;3 du Règlement Intérieur.
        </p>
      </div>

      {/* ── Présidence ────────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-5 sm:gap-6 mb-6">
        {PRESIDENCE.map((p) => (
          <article
            key={p.titre}
            className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0A3A27] to-[#0F7C55] border border-[#D4AF37]/30 p-7 sm:p-8"
          >
            <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-[#D4AF37]/12 blur-3xl" />
            <div className="relative flex items-start gap-5">
              <span className="flex-none w-16 h-16 rounded-2xl bg-gradient-to-br from-[#B8860B] to-[#D4AF37] text-[#082F22] font-display text-xl font-black flex items-center justify-center shadow-lg">
                {initiales(p.titulaire)}
              </span>
              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E8CE72]">
                  <FaCrown className="text-xs" /> {p.titre}
                </p>
                <h3 className="font-display mt-2 text-2xl font-bold text-white leading-tight">
                  {p.titulaire}
                </h3>
                <p className="mt-3 text-sm text-white/70 leading-7">{p.role}</p>
                {p.adjoints.map((a) => (
                  <p key={a} className="mt-3 text-xs text-[#D4AF37]">
                    {a}
                  </p>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ── Secrétariat ───────────────────────────────────────────────── */}
      <Intertitre>Secrétariat</Intertitre>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SECRETARIATS.map((s) => (
          <CartePoste key={s.titre} poste={s} />
        ))}
      </div>

      {/* ── Les commissions ───────────────────────────────────────────── */}
      {/* Le renouvellement de septembre 2026 organise le Bureau par
          commission : sans ce bloc, la page n'en montrerait aucune. */}
      <Intertitre>Les commissions</Intertitre>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {COMMISSIONS_BUREAU.map((c) => (
          <CartePoste key={c.titre} poste={c} />
        ))}
      </div>
    </section>
  );
}

function Intertitre({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mt-12 mb-5">
      <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#D4AF37]">
        {children}
      </span>
      <span className="flex-1 h-px bg-gradient-to-r from-[#D4AF37]/50 to-transparent" />
    </div>
  );
}

function CartePoste({ poste }: { poste: Poste }) {
  return (
    <article className="rounded-[24px] bg-white/[.05] border border-white/10 p-6 flex flex-col hover:border-[#D4AF37]/35 transition">
      <div className="flex items-start gap-4">
        <span className="flex-none w-12 h-12 rounded-xl bg-[#0F7C55] text-[#E8CE72] font-bold text-sm flex items-center justify-center">
          {initiales(poste.titulaire)}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#D4AF37] leading-4">
            {poste.titre}
          </p>
          <h3 className="mt-1.5 font-bold text-white leading-snug">{poste.titulaire}</h3>
        </div>
      </div>

      <p className="mt-4 text-sm text-white/60 leading-7 flex-1">{poste.role}</p>

      {poste.adjoints.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/10">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/35 mb-2">
            Adjoints
          </p>
          <ul className="space-y-1.5">
            {poste.adjoints.map((a) => (
              <li key={a} className="flex items-start gap-2 text-xs text-white/70">
                <FaUserTie className="flex-none mt-0.5 text-[#D4AF37]/60 text-[10px]" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
