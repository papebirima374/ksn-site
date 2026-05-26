export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative z-10 max-w-7xl mx-auto px-6 pt-48 pb-24"
    >
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center rounded-full bg-[#B8860B]/15 border border-[#D4AF37]/20 px-6 py-4 text-[#D4AF37] font-semibold backdrop-blur-md">
            ✨ Kippangog Salaatu &apos;Alaa Nabii
          </div>

          <h1 className="mt-8 text-4xl md:text-5xl font-bold text-white leading-[1.05] tracking-tight">
            Une communauté
            <br />
            spirituelle moderne
            <br />
            au service du
            <br />
            Salaatu ﷺ
          </h1>

          <p className="mt-8 text-lg text-white/75 leading-9 max-w-2xl">
            Créé le 02 Janvier 2021 à Touba, KSN œuvre pour la promotion du
            Salaatu sur le Prophète Muhammad ﷺ à travers une organisation
            structurée, des activités spirituelles et une communauté
            internationale engagée.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">
            <a
              href="#contact"
              className="bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] px-8 py-5 rounded-2xl font-bold shadow-xl hover:scale-105 transition"
            >
              Rejoindre le Dahira
            </a>

            <a
              href="#dahira"
              className="border border-[#D4AF37]/30 text-[#D4AF37] px-8 py-5 rounded-2xl backdrop-blur-md hover:bg-white/10 transition"
            >
              Découvrir KSN
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-[#B8860B]/10 blur-[100px] rounded-full" />

          <div className="relative bg-white/[0.07] backdrop-blur-2xl border border-white/10 rounded-[44px] p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <p className="uppercase tracking-[0.25em] text-[#D4AF37] text-sm font-semibold">
              Vie Institutionnelle KSN
            </p>

            <h2 className="mt-5 text-4xl font-bold text-white leading-tight">
              Organisation
              <br />
              & Fonctionnement
            </h2>

            <div className="mt-8 space-y-4">
              <div className="bg-white/10 rounded-2xl p-5">
                <h3 className="text-white font-semibold">
                  📜 Règlement Intérieur
                </h3>
                <p className="text-white/60 text-sm mt-1">
                  Statuts, discipline et fonctionnement du Dahira.
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl p-5">
                <h3 className="text-white font-semibold">
                  🏛️ Commissions Officielles
                </h3>
                <p className="text-white/60 text-sm mt-1">
                  Éducation, Communication, Finances, Sociale, Organisation et
                  Relations Extérieures.
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl p-5">
                <h3 className="text-white font-semibold">👥 Vie du Membre</h3>
                <p className="text-white/60 text-sm mt-1">
                  Adhésion, participation spirituelle et engagement
                  communautaire.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
