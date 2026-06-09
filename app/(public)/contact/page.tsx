import type { Metadata } from "next";
import ContactHero from "./ContactHero";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez le Dahira Kippangog Salaatu 'Alaa Nabii : siège à Touba, WhatsApp officiel, formulaire de contact.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <Contact />
    </>
  );
}
