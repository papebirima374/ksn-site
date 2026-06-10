import type { Metadata } from "next";
import DahiraHero from "@/components/sections/DahiraHero";
import Stats from "@/components/sections/Stats";
import DahiraTabs from "./DahiraTabs";

export const metadata: Metadata = {
  title: "Le Dahira",
  description:
    "Découvrez le Dahira Kippangog Salaatu 'Alaa Nabii : présidence, commissions officielles, règlement intérieur et organisation.",
};

export default function DahiraPage() {
  return (
    <>
      <DahiraHero />
      <DahiraTabs />
      <Stats />
    </>
  );
}
