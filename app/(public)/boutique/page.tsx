import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import ProductGrid from "@/components/boutique/ProductGrid";

export const metadata: Metadata = {
  title: "Boutique KSN",
  description:
    "Boutique officielle du Dahira KSN : Café G, livres PDF spirituels, et produits physiques. Livraison Sénégal + paiement Wave, Orange Money, carte ou PayPal.",
};

export default function BoutiquePage() {
  return (
    <>
      <PageHero
        overline="Boutique KSN"
        title="Café G, Livres & Souvenirs"
        description="Produits sélectionnés par le Dahira. Livraison au Sénégal, téléchargement immédiat des livres PDF. Paiement Wave, Orange Money, carte bancaire ou PayPal."
      />

      <ProductGrid />
    </>
  );
}
