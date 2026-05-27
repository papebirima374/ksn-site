import Link from "next/link";
import { ReactNode } from "react";
import PageHero from "@/components/layout/PageHero";

const LEGAL_PAGES = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Politique de confidentialité" },
  { href: "/cgu", label: "Conditions d'utilisation" },
  { href: "/cgv", label: "Conditions de vente" },
  { href: "/cookies", label: "Cookies" },
];

export default function LegalShell({
  overline,
  title,
  children,
  activeHref,
}: {
  overline: string;
  title: string;
  children: ReactNode;
  activeHref: string;
}) {
  return (
    <>
      <PageHero overline={overline} title={title} />
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="grid lg:grid-cols-[220px_1fr] gap-6 sm:gap-10">
          <aside className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-4 sm:p-5 h-fit">
            <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mb-3 px-2">
              Documents
            </p>
            <ul className="space-y-1">
              {LEGAL_PAGES.map((p) => {
                const active = p.href === activeHref;
                return (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      className={`block px-3 py-2 rounded-xl text-sm transition ${
                        active
                          ? "bg-[#0F7C55] text-white font-semibold"
                          : "text-[#0F7C55] hover:bg-[#F8F5EF]"
                      }`}
                    >
                      {p.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          <article className="bg-white rounded-3xl shadow-md p-6 sm:p-10 prose prose-emerald max-w-none text-gray-700 leading-7 [&_h2]:font-display [&_h2]:text-[#0F7C55] [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h3]:font-display [&_h3]:text-[#0F7C55] [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-xl [&_p]:my-3 [&_ul]:my-3 [&_ul]:pl-5 [&_li]:my-1 [&_li]:list-disc [&_strong]:text-[#0F7C55]">
            {children}
            <hr className="my-8 border-gray-200" />
            <p className="text-sm text-gray-500 italic">
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
