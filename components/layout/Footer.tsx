import Image from "next/image";
import { LINKS, NAV_ITEMS, SITE } from "@/lib/constants";

const SOCIAL_LINKS = [
  { label: "Facebook", href: LINKS.facebook },
  { label: "YouTube", href: LINKS.youtube },
  { label: "TikTok", href: LINKS.tiktok },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#0B2E1F]/90 backdrop-blur-xl mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37]">
                <Image
                  src="/logo/ksn-logo.png"
                  alt="KSN Logo"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">{SITE.name}</h3>
                <p className="text-white/60 text-sm">{SITE.tagline}</p>
              </div>
            </div>

            <p className="mt-5 text-white/70 leading-8">
              {SITE.fullName} œuvre pour la promotion du Salaatu sur le Prophète
              Muhammad ﷺ à travers une communauté spirituelle moderne.
            </p>
          </div>

          <div>
            <h4 className="text-[#D4AF37] font-bold text-lg">Navigation</h4>
            <div className="mt-5 flex flex-col gap-3 text-white/70">
              {NAV_ITEMS.map((item) => (
                <a key={item.href} href={item.href} className="hover:text-[#D4AF37] transition">
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[#D4AF37] font-bold text-lg">Contact</h4>
            <div className="mt-5 space-y-3 text-white/70">
              <p>📍 {SITE.location}</p>
              <p>🌐 {SITE.domain}</p>
              <p>📱 WhatsApp officiel</p>
            </div>
          </div>

          <div>
            <h4 className="text-[#D4AF37] font-bold text-lg">
              Mission Spirituelle
            </h4>

            <p className="mt-5 text-white/70 leading-8 italic">
              &ldquo;Œuvrer pour la promotion du Salaatu sur le Prophète
              Muhammad ﷺ à travers une communauté spirituelle moderne, engagée
              et internationale.&rdquo;
            </p>

            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-6 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] font-bold shadow-xl px-5 py-3 rounded-2xl hover:scale-105 transition"
            >
              WhatsApp KSN
            </a>

            <div className="mt-6">
              <h4 className="text-[#D4AF37] font-bold text-lg mb-4">
                Réseaux Sociaux
              </h4>
              <div className="flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 h-12 rounded-2xl bg-white/10 hover:bg-[#D4AF37] hover:text-[#0F5132] transition text-white flex items-center justify-center font-medium"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © 2021 - {new Date().getFullYear()} {SITE.fullName} ({SITE.name}).
            Tous droits réservés.
          </p>

          <p className="text-[#D4AF37] text-sm">{SITE.domain}</p>
        </div>
      </div>
    </footer>
  );
}
