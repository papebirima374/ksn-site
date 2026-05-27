import type { Metadata } from "next";
import SpiritualiteContent from "./SpiritualiteContent";

export const metadata: Metadata = {
  title: "Spiritualité",
  description:
    "Salaatou du jour, Bibliothèque des Salaats avec leurs bienfaits et secrets, Khassidas, Azkâr, et ressources spirituelles du Dahira KSN.",
};

export default function SpiritualitePage() {
  return <SpiritualiteContent />;
}
