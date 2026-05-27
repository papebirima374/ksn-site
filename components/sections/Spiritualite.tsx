const CARDS = [
  {
    icon: "📿",
    title: "Salaatou du Jour",
    text: "Texte arabe, translittération, traduction et bienfaits du Salaatu recommandé du jour.",
  },
  {
    icon: "📖",
    title: "Khassidas",
    text: "Accédez à une bibliothèque de Khassidas, textes religieux et contenus spirituels.",
  },
  {
    icon: "🤲",
    title: "Azkâr & Invocations",
    text: "Invocations quotidiennes, zikr, douas et pratiques spirituelles recommandées.",
  },
  {
    icon: "🎧",
    title: "Audios Spirituels",
    text: "Écoutez les récitations, conférences, Salaatou et rappels audio.",
  },
  {
    icon: "🎥",
    title: "Vidéos & Enseignements",
    text: "Conférences, enseignements, rappels spirituels et vidéos officielles du Dahira.",
  },
];

export default function Spiritualite() {
  return (
    <section
      id="spiritualite"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28"
    >
      <div className="bg-[#0F7C55] rounded-[40px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.2)]">
        <div className="p-6 sm:p-12 md:p-16">
          <div className="text-center">
            <span className="text-[#D4AF37] uppercase tracking-[0.25em] font-semibold">
              Spiritualité KSN
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white">
              Nourrir le Cœur
              <br />
              par le Salaatu ﷺ
            </h2>

            <p className="mt-6 text-white/70 text-lg max-w-3xl mx-auto leading-8">
              Découvrez les Salaatou, Khassidas, invocations, enseignements et
              ressources spirituelles du Dahira Kippangog Salaatu &apos;Alaa
              Nabii.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {CARDS.map((c) => (
              <div
                key={c.title}
                className="bg-white/10 border border-white/10 rounded-[30px] p-8 backdrop-blur-md hover:scale-[1.02] transition"
              >
                <div className="text-5xl">{c.icon}</div>
                <h3 className="mt-5 text-2xl font-bold text-white">
                  {c.title}
                </h3>
                <p className="mt-4 text-white/70 leading-7">{c.text}</p>
              </div>
            ))}

            <div className="bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-[30px] p-8 text-[#0F7C55]">
              <div className="text-5xl">✨</div>

              <h3 className="mt-5 text-2xl font-bold">
                Explorer la Spiritualité
              </h3>

              <p className="mt-4 leading-7">
                Découvrez l&apos;univers spirituel complet de KSN et renforcez
                votre lien avec le Prophète ﷺ.
              </p>

              <button
                type="button"
                className="mt-8 bg-[#0F7C55] text-white px-6 py-4 rounded-2xl font-semibold hover:opacity-90 transition"
              >
                Explorer
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
