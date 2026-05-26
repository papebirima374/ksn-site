import { LINKS } from "@/lib/constants";

export default function WhatsAppFloat() {
  return (
    <a
      href={LINKS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 group"
    >
      <div className="flex items-center gap-3 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] px-4 py-3 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.25)] hover:scale-105 duration-300">
        <div className="w-12 h-12 rounded-full bg-[#0F5132] flex items-center justify-center text-white text-lg">
          💬
        </div>

        <div className="hidden lg:block">
          <p className="font-bold text-base leading-none">WhatsApp KSN</p>
          <p className="text-xs opacity-80 mt-1">Contactez-nous</p>
        </div>
      </div>
    </a>
  );
}
