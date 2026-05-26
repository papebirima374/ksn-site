import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-24"
    >
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <p className="font-arabic text-3xl sm:text-4xl md:text-5xl text-[#D4AF37] mb-4">
            صلى الله على محمد
          </p>

          <div className="w-16 h-0.5 bg-[#D4AF37] mb-6" />

          <div className="inline-flex items-center rounded-full bg-[#B8860B]/15 border border-[#D4AF37]/20 px-5 sm:px-6 py-3 sm:py-4 text-[#D4AF37] font-semibold backdrop-blur-md text-sm sm:text-base">
            ✨ Kippangog Salaatu &apos;Alaa Nabii
          </div>

          <h1 className="font-display mt-6 sm:mt-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            Une communauté
            <br />
            spirituelle moderne
            <br />
            au service du
            <br />
            Salaatu ﷺ
          </h1>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg text-white/75 leading-8 sm:leading-9 max-w-2xl">
            Créé le 02 Janvier 2021 à Touba, KSN œuvre pour la promotion du
            Salaatu sur le Prophète Muhammad ﷺ à travers une organisation
            structurée, des activités spirituelles et une communauté
            internationale engagée.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-5">
            <Link
              href="/inscription"
              className="bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold shadow-xl hover:scale-105 transition text-sm sm:text-base"
            >
              Rejoindre le Dahira
            </Link>

            <Link
              href="/dahira"
              className="border border-[#D4AF37]/30 text-[#D4AF37] px-6 sm:px-8 py-4 sm:py-5 rounded-2xl backdrop-blur-md hover:bg-white/10 transition text-sm sm:text-base"
            >
              Découvrir KSN
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-[#B8860B]/10 blur-[100px] rounded-full" />

          <div className="relative bg-white/[0.07] backdrop-blur-2xl border border-white/10 rounded-[32px] sm:rounded-[44px] p-6 sm:p-8 lg:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <p className="uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#D4AF37] text-xs sm:text-sm font-semibold">
              Vie Institutionnelle KSN
            </p>

            <h2 className="font-display mt-4 sm:mt-5 text-3xl sm:text-4xl font-bold text-white leading-tight">
              Organisation
              <br />
              & Fonctionnement
            </h2>

            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              <Link
                href="/dahira"
                className="block bg-white/10 hover:bg-white/15 rounded-2xl p-4 sm:p-5 transition"
              >
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  📜 Règlement Intérieur
                </h3>
                <p className="text-white/60 text-xs sm:text-sm mt-1">
                  Statuts, discipline et fonctionnement du Dahira.
                </p>
              </Link>

              <Link
                href="/dahira"
                className="block bg-white/10 hover:bg-white/15 rounded-2xl p-4 sm:p-5 transition"
              >
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  🏛️ Commissions Officielles
                </h3>
                <p className="text-white/60 text-xs sm:text-sm mt-1">
                  Éducation, Communication, Finances, Sociale, Organisation et
                  Relations Extérieures.
                </p>
              </Link>

              <Link
                href="/inscription"
                className="block bg-white/10 hover:bg-white/15 rounded-2xl p-4 sm:p-5 transition"
              >
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  👥 Vie du Membre
                </h3>
                <p className="text-white/60 text-xs sm:text-sm mt-1">
                  Adhésion, participation spirituelle et engagement
                  communautaire.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
