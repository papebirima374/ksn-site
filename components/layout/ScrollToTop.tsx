"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";

/** Bouton flottant « retour en haut ».
 *  Apparaît après ~400px de défilement, en bas à gauche (pour ne pas
 *  chevaucher WhatsApp/Panier en bas à droite). */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Retour en haut"
      className={`fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-40 w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-br from-[#B8860B] to-[#D4AF37] text-[#0F7C55] shadow-xl shadow-black/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <FaArrowUp className="text-lg" />
    </button>
  );
}
