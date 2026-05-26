import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez le Dahira Kippangog Salaatu 'Alaa Nabii : siège à Touba, WhatsApp officiel, formulaire de contact.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        overline="Contact Officiel"
        title="Entrer en Contact"
        description="Une question, une adhésion, une collaboration ou une demande d'information ? Notre équipe est disponible pour vous accompagner."
      />

      <Contact />
    </>
  );
}
