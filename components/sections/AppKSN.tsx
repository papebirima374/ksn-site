import { LINKS } from "@/lib/constants";

const FEATURES = [
  "Salaatou & suivi quotidien",
  "Communauté KSN",
  "Contenus spirituels & rappels",
  "Suivi des activités du Dahira",
];

export default function AppKSN() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
      <div className="relative overflow-hidden rounded-[45px] bg-gradient-to-br from-[#0F5132] to-[#063822] p-12 md:p-16 text-white">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#B8860B]/10 blur-[120px] rounded-full" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              Application Mobile KSN
            </span>

            <h2 className="mt-5 text-4xl md:text-5xl font-bold leading-tight">
              Emportez KSN
              <br />
              Partout Avec Vous 📱
            </h2>

            <p className="mt-6 text-white/75 text-lg leading-8">
              Accédez au comptage des Salaatou, aux activités du Dahira, aux
              contenus spirituels et à toute la communauté KSN directement
              depuis votre téléphone.
            </p>

            <div className="mt-8 space-y-4">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <span className="text-[#D4AF37] text-xl">✓</span>
                  <p>{f}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-5 mt-10">
              <a
                href={LINKS.appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#0F5132] px-8 py-5 rounded-[25px] font-bold hover:scale-105 transition shadow-xl"
              >
                🍎 Télécharger sur iPhone
              </a>

              <a
                href={LINKS.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] px-8 py-5 rounded-[25px] font-bold hover:scale-105 transition shadow-xl"
              >
                🤖 Télécharger Android
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-[320px] h-[620px] rounded-[50px] border-[10px] border-white/10 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-[35px] bg-black rounded-b-[20px]" />

              <div className="h-full bg-gradient-to-br from-[#0F5132] to-[#B8860B] flex flex-col items-center justify-center text-center p-10">
                <div className="w-28 h-28 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-5xl">
                  📿
                </div>

                <h3 className="mt-8 text-3xl font-bold">Application KSN</h3>

                <p className="mt-5 text-white/75 leading-8">
                  Votre compagnon spirituel quotidien pour vivre le Salaatu
                  &apos;Alaa Nabii.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
