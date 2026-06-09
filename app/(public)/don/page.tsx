import type { Metadata } from "next";
import DonContent from "./DonContent";

export const metadata: Metadata = {
  title: "Faire un Don",
  description:
    "Soutenez le Dahira Kippangog Salaatu 'Alaa Nabii via Wave, Orange Money, virement UBA ou WhatsApp.",
};

export default function DonPage() {
  return <DonContent />;
}
