import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/layout/PageHero";
import { COMMISSIONS, getCommission } from "@/lib/commissions";
import ReportForm from "./ReportForm";

export function generateStaticParams() {
  return COMMISSIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCommission(slug);
  return {
    title: c ? `Rapport — Commission ${c.nom}` : "Rapport de commission",
    // Document de travail interne : il ne doit pas remonter dans les moteurs
    // de recherche, seuls les responsables recoivent le lien.
    robots: { index: false, follow: false },
  };
}

export default async function CommissionReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const commission = getCommission(slug);
  if (!commission) notFound();

  return (
    <>
      <PageHero
        overline="Assemblée Générale du 19 septembre 2026"
        title={`Commission ${commission.nom}`}
        salaatuCalligraphy
        description={commission.mission}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 -mt-4 mb-8">
        <p className="text-center text-sm text-white/70 leading-7">
          Ce formulaire est réservé au responsable de la commission{" "}
          <b className="text-[#D4AF37]">{commission.nom}</b>. Il rassemble le compte rendu
          demandé à l&apos;ordre du jour et les propositions de la commission pour la
          prochaine Journée Salaatu &apos;Alaa Nabii.
        </p>
      </div>

      <ReportForm commission={commission} />
    </>
  );
}
