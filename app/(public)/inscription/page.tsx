import type { Metadata } from "next";
import InscriptionContent from "./InscriptionContent";

export const metadata: Metadata = {
  title: "Rejoindre le Dahira",
  description:
    "Rejoignez le Dahira Kippangog Salaatu ʿAlaa Nabii. L'adhésion se fait directement avec notre équipe via WhatsApp — un accompagnement personnalisé et chaleureux.",
};

export default function InscriptionPage() {
  return <InscriptionContent />;
}
