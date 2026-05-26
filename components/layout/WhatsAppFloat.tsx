import { FaWhatsapp } from "react-icons/fa6";
import { LINKS } from "@/lib/constants";

export default function WhatsAppFloat() {
  return (
    <a
      href={LINKS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter KSN sur WhatsApp"
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 group"
    >
      <div className="flex items-center gap-3 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] px-3 sm:px-4 py-2.5 sm:py-3 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.25)] hover:scale-105 duration-300">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0F5132] flex items-center justify-center text-white text-xl sm:text-2xl">
          <FaWhatsapp />
        </div>

        <div className="hidden lg:block pr-2">
          <p className="font-bold text-base leading-none">WhatsApp KSN</p>
          <p className="text-xs opacity-80 mt-1">Contactez-nous</p>
        </div>
      </div>
    </a>
  );
}
