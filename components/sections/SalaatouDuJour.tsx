export default function SalaatouDuJour() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-16">
        <div className="text-center">
          <span className="uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
            Salaatou du Jour
          </span>

          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F5132]">
            Le Salaatu Recommandé
          </h2>
        </div>

        <div className="mt-10 sm:mt-14 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-[#0F5132] to-[#082F22] rounded-[24px] sm:rounded-[35px] p-8 sm:p-12 text-center text-white shadow-2xl">
            <p className="font-arabic text-3xl sm:text-4xl md:text-5xl leading-loose text-[#D4AF37]">
              اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ
            </p>

            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto my-6" />

            <p className="font-display italic text-lg sm:text-xl text-white/90 leading-relaxed">
              &ldquo;Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad&rdquo;
            </p>

            <p className="mt-5 text-base sm:text-lg text-white/80 leading-7 sm:leading-8">
              Ô Allah, prie sur Muhammad et sur la famille de Muhammad.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-[#F8F5EF] rounded-2xl p-5 sm:p-6 text-center">
              <div className="text-3xl sm:text-4xl">📿</div>
              <h3 className="font-display mt-3 text-lg sm:text-xl font-bold text-[#0F5132]">
                Bienfaits
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                Lumière dans le cœur, proximité du Prophète ﷺ et bénédictions
                divines.
              </p>
            </div>

            <div className="bg-[#F8F5EF] rounded-2xl p-5 sm:p-6 text-center">
              <div className="text-3xl sm:text-4xl">🕌</div>
              <h3 className="font-display mt-3 text-lg sm:text-xl font-bold text-[#0F5132]">
                Quand le réciter
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                À tout moment, particulièrement après les prières et le
                vendredi.
              </p>
            </div>

            <div className="bg-[#F8F5EF] rounded-2xl p-5 sm:p-6 text-center">
              <div className="text-3xl sm:text-4xl">✨</div>
              <h3 className="font-display mt-3 text-lg sm:text-xl font-bold text-[#0F5132]">
                Récompense
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                Allah prie 10 fois sur celui qui prie une fois sur le Prophète
                ﷺ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
