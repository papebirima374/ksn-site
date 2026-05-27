"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FaCartPlus, FaCheck } from "react-icons/fa6";
import { isFirebaseConfigured } from "@/lib/firebase";
import { listProducts } from "@/lib/admin-data";
import { Product, PRODUCT_CATEGORIES, ProductCategory } from "@/lib/admin-types";
import { useCart } from "@/lib/cart-context";

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

export default function ProductGrid() {
  const { add, items, setOpen } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(isFirebaseConfigured());
  const [category, setCategory] = useState<"all" | ProductCategory>("all");
  const [justAdded, setJustAdded] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    listProducts({ onlyVisible: true })
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (category === "all") return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  function handleAdd(p: Product) {
    add(p, 1);
    setJustAdded(p.id);
    setOpen(true);
    setTimeout(() => setJustAdded(null), 1500);
  }

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F7C55]">
            Notre catalogue
          </h2>
          <div className="flex flex-wrap gap-2">
            <CategoryPill active={category === "all"} onClick={() => setCategory("all")}>
              Tous ({products.length})
            </CategoryPill>
            {PRODUCT_CATEGORIES.map((c) => {
              const n = products.filter((p) => p.category === c.id).length;
              return (
                <CategoryPill
                  key={c.id}
                  active={category === c.id}
                  onClick={() => setCategory(c.id)}
                >
                  <span className="mr-1">{c.emoji}</span>
                  {c.label} ({n})
                </CategoryPill>
              );
            })}
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-12">Chargement…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <div className="text-5xl sm:text-6xl">🛍️</div>
            <p className="mt-4 text-gray-500 text-sm sm:text-base">
              {products.length === 0
                ? "La boutique se prépare. Revenez bientôt !"
                : "Aucun produit dans cette catégorie."}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {filtered.map((p) => {
              const inCart = items.find((i) => i.productId === p.id);
              const wasJustAdded = justAdded === p.id;
              return (
                <div
                  key={p.id}
                  className="bg-[#F8F5EF] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md group hover:-translate-y-1 transition"
                >
                  <div className="relative aspect-square bg-[#E8E6E1]">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                        unoptimized={p.image.startsWith("http")}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-5xl">
                        {PRODUCT_CATEGORIES.find((c) => c.id === p.category)?.emoji}
                      </div>
                    )}
                    <p className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#0F7C55]/90 text-white text-[10px] uppercase tracking-widest font-bold">
                      {PRODUCT_CATEGORIES.find((c) => c.id === p.category)?.label}
                    </p>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[#0F7C55] line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm leading-6 line-clamp-2">
                      {p.description}
                    </p>
                    {p.category === "physical" && typeof p.stock === "number" && (
                      <p className="mt-2 text-xs font-semibold text-[#B8860B]">
                        {p.stock > 0 ? `${p.stock} en stock` : "Rupture"}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="font-display text-2xl font-bold text-[#0F7C55] tabular-nums">
                        {fmt(p.price)}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleAdd(p)}
                        disabled={p.category === "physical" && p.stock === 0}
                        className={`inline-flex items-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition ${
                          wasJustAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                        }`}
                      >
                        {wasJustAdded ? <FaCheck /> : <FaCartPlus />}
                        {wasJustAdded ? "Ajouté" : "Ajouter"}
                      </button>
                    </div>
                    {inCart && !wasJustAdded && (
                      <p className="mt-2 text-xs text-[#B8860B] font-semibold">
                        {inCart.quantity} dans le panier
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
        active
          ? "bg-[#0F7C55] text-white shadow-md"
          : "bg-[#F8F5EF] text-[#0F7C55] hover:bg-[#E8E6E1]"
      }`}
    >
      {children}
    </button>
  );
}
