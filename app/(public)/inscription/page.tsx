import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import {
  FaWhatsapp,
  FaRightToBracket,
  FaCircleCheck,
  FaCircleInfo,
  FaBookOpen,
  FaCrown,
  FaUser,
} from "react-icons/fa6";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Créer un compte",
  description:
    "Créez votre compte gratuit sur le site KSN — accès aux contenus, à votre progression Éducation et aux services premium. L'adhésion officielle au Dahira se fait via l'application KSN.",
};

const SITE_BENEFITS = [
  {
    icon: <FaBookOpen />,
    title: "Suivez votre progression",
    text: "Votre avancée dans l'académie du Tazawwud est sauvegardée et vous suit sur tous vos appareils.",
  },
  {
    icon: <FaCrown />,
    title: "Débloquez le premium",
    text: "Achetez l'accès permanent à la bibliothèque des Salaatu et aux futures sections premium.",
  },
  {
    icon: <FaUser />,
    title: "Profil personnel",
    text: "Photo optionnelle, préférences linguistiques, favoris — votre espace personnel KSN.",
  },
];

export default function InscriptionPage() {
  return (
    <>
      <PageHero
        overline="Rejoindre le site KSN"
        title="Créer mon compte"
        arabic="مرحبا بكم"
        description="Un compte gratuit pour accéder à toutes les fonctionnalités du site, suivre votre progression spirituelle et débloquer les services premium."
      />

      {/* ─── DISTINCTION CLAIRE : Compte site vs Membre Dahira ──── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 -mt-4 mb-12">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 flex gap-4 items-start">
          <FaCircleInfo className="text-amber-600 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display font-bold text-amber-900 text-base sm:text-lg">
              À propos de votre statut de Membre KSN
            </h3>
            <p className="text-sm text-amber-900/85 mt-1 leading-6">
              L&apos;adhésion officielle au Dahira KSN et la carte de membre
              sont gérées <strong>exclusivement via l&apos;application KSN</strong>{" "}
              et le groupe WhatsApp officiel.
              <br />
              <strong>Ce compte site est gratuit</strong> et indépendant.
              Si vous êtes déjà membre actif via l&apos;application, votre
              statut sera automatiquement reconnu et un badge décoratif
              apparaîtra sur votre profil.
            </p>
          </div>
        </div>
      </section>

      {/* ─── PARCOURS : 2 chemins ──── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Carte A : créer un compte site */}
          <div className="bg-white rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-6 sm:p-8 md:p-10 flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F7C55] to-[#0A3D24] text-[#D4AF37] flex items-center justify-center text-2xl shadow-md mb-4">
              <FaRightToBracket />
            </div>
            <span className="text-[#B8860B] text-[10px] uppercase tracking-widest font-black">
              Étape unique · Gratuit
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F7C55] mt-1">
              Créer mon compte site
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-3 leading-6">
              Avec votre email ou numéro de téléphone, en moins de{" "}
              <strong>30 secondes</strong>. Aucun paiement requis pour le compte
              de base.
            </p>

            <ul className="mt-5 space-y-2.5 flex-1">
              {SITE_BENEFITS.map((b) => (
                <li key={b.title} className="flex gap-3 items-start">
                  <span className="w-8 h-8 rounded-xl bg-[#0F7C55]/8 text-[#0F7C55] flex items-center justify-center flex-shrink-0 text-sm">
                    {b.icon}
                  </span>
                  <div>
                    <p className="font-bold text-[#0F7C55] text-sm">
                      {b.title}
                    </p>
                    <p className="text-xs text-gray-600 leading-5 mt-0.5">
                      {b.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/espace-membre?mode=signup"
              className="mt-6 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#0F7C55] to-[#0A3D24] text-white font-bold px-6 py-4 rounded-2xl shadow-md hover:scale-[1.02] active:scale-100 transition text-sm sm:text-base"
            >
              <FaRightToBracket /> Créer mon compte gratuit
            </Link>
            <p className="text-[11px] text-gray-500 text-center mt-3">
              Déjà un compte ?{" "}
              <Link
                href="/espace-membre"
                className="font-bold text-[#0F7C55] hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </div>

          {/* Carte B : devenir membre Dahira via app KSN */}
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0F7C55] via-[#0A3D24] to-[#082F22] text-white p-6 sm:p-8 md:p-10 flex flex-col">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#D4AF37]/15 blur-3xl" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B8860B] to-[#D4AF37] text-[#0F7C55] flex items-center justify-center text-2xl shadow-xl mb-4">
                <FaCrown />
              </div>
              <span className="text-[#D4AF37] text-[10px] uppercase tracking-widest font-black">
                Adhésion officielle · Via application
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                Devenir Membre du Dahira
              </h2>
              <p className="text-white/80 text-sm sm:text-base mt-3 leading-6">
                L&apos;adhésion officielle, la carte de membre et le suivi
                communautaire passent par l&apos;application KSN et le groupe
                WhatsApp.
              </p>

              <ul className="mt-5 space-y-2.5 flex-1">
                {[
                  "Carte de membre officielle avec matricule",
                  "Participation aux Salaatous collectifs",
                  "Accès au groupe WhatsApp du Dahira",
                  "Engagement communautaire international",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex gap-2.5 items-start text-sm text-white/90"
                  >
                    <FaCircleCheck className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <a
                href={LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold px-6 py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-100 transition text-sm sm:text-base"
              >
                <FaWhatsapp /> Contacter le Dahira sur WhatsApp
              </a>
              <p className="text-[11px] text-white/60 text-center mt-3">
                L&apos;équipe vous guidera pour l&apos;adhésion officielle
                et l&apos;installation de l&apos;application KSN.
              </p>
            </div>
          </div>
        </div>

        {/* ─── BANDEAU PREMIUM ──── */}
        <div className="mt-8 sm:mt-10 bg-white rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 text-center">
          <p className="text-[#B8860B] text-[10px] uppercase tracking-widest font-black">
            Premium · Optionnel
          </p>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0F7C55] mt-1">
            Et le premium dans tout ça ?
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto leading-6">
            Certaines sections du site (comme la bibliothèque sacrée des
            Salaatu) sont accessibles via un paiement unique de{" "}
            <strong>1 000 FCFA</strong> qui débloque l&apos;accès à vie.
            <br />
            Ce paiement est <strong>identique pour tous</strong> — visiteurs,
            utilisateurs standards et membres actifs du Dahira. Il soutient
            la mission tout en valorisant le contenu sacré.
          </p>
          <Link
            href="/premium/bibliotheque"
            className="inline-flex items-center gap-2 mt-5 border border-[#D4AF37] text-[#B8860B] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#D4AF37]/10 transition"
          >
            Découvrir le premium
          </Link>
        </div>
      </section>
    </>
  );
}
