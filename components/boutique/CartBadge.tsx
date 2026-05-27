"use client";

import { FaCartShopping } from "react-icons/fa6";
import { useCart } from "@/lib/cart-context";

export default function CartBadge() {
  const { count, setOpen, subtotal } = useCart();

  if (count === 0) return null;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Ouvrir le panier"
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 group"
    >
      <div className="flex items-center gap-3 bg-[#0F5132] text-white px-4 py-3 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition relative">
        <div className="relative">
          <FaCartShopping className="text-xl" />
          <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#0F5132] rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold tabular-nums">
            {count}
          </span>
        </div>
        <div className="hidden sm:block pr-1">
          <p className="text-xs opacity-80 leading-none">Panier</p>
          <p className="text-sm font-bold leading-none mt-0.5 tabular-nums">
            {new Intl.NumberFormat("fr-FR").format(subtotal)} F
          </p>
        </div>
      </div>
    </button>
  );
}
