import Image from "next/image";
import { NAV_ITEMS, SITE } from "@/lib/constants";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-[30px] px-8 py-5 flex items-center justify-between shadow-[0_10px_50px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white shadow-xl">
              <Image
                src="/logo/ksn-logo.png"
                alt="KSN Logo"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h1 className="text-white font-bold text-3xl">{SITE.name}</h1>
              <p className="text-white/60 text-sm tracking-wide">
                {SITE.tagline}
              </p>
              <p className="text-[#D4AF37] text-sm mt-1">{SITE.motto}</p>
            </div>
          </div>

          <nav className="hidden md:flex gap-16 text-white font-medium">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-[#D4AF37] transition">
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] font-bold px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition"
          >
            Faire un Don
          </a>
        </div>
      </div>
    </header>
  );
}
