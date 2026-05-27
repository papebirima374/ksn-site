const MEDIA_CARDS = [
  {
    icon: "📸",
    title: "Galerie Photos",
    text: "Photos officielles des événements, rencontres spirituelles, conférences, Gamou et activités du Dahira.",
    cta: "Explorer",
    gradient: "from-[#B8860B] to-[#D4AF37]",
  },
  {
    icon: "🎥",
    title: "Vidéos & Conférences",
    text: "Visionnez conférences, zikr, Salaatou, rappels, lives et enseignements spirituels.",
    cta: "Regarder",
    gradient: "from-[#0F7C55] to-[#1F7A53]",
  },
  {
    icon: "🕌",
    title: "Événements KSN",
    text: "Gamou, journées Salaatu, rencontres spirituelles, programmes religieux et événements officiels.",
    cta: "Voir Agenda",
    gradient: "from-[#D4AF37] to-[#F5D76E]",
  },
];

const MEDIA_STATS = [
  { value: "2021", label: "Création KSN" },
  { value: "Touba", label: "Siège Spirituel" },
  { value: "6", label: "Commissions" },
  { value: "🌍", label: "Rayonnement International" },
];

export default function Media() {
  return (
    <section
      id="media"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28"
    >
      <div className="bg-white rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="p-6 sm:p-12 md:p-16">
          <div className="text-center">
            <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold">
              Média KSN
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[#0F7C55]">
              Activités du Dahira
              <br />
              & Vie Communautaire
            </h2>

            <p className="mt-6 text-gray-600 max-w-3xl mx-auto leading-8">
              Découvrez les activités spirituelles, événements, conférences,
              rassemblements, vidéos, galeries photos et moments forts de
              Kippangog Salaatu &apos;Alaa Nabii.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mt-16">
            {MEDIA_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-[35px] overflow-hidden bg-[#F8F5EF] hover:-translate-y-2 duration-300 shadow-lg"
              >
                <div
                  className={`h-64 bg-gradient-to-br ${card.gradient} flex items-center justify-center text-7xl`}
                >
                  {card.icon}
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#0F7C55]">
                    {card.title}
                  </h3>
                  <p className="mt-4 text-gray-600 leading-7">{card.text}</p>

                  <button
                    type="button"
                    className="mt-6 bg-[#0F7C55] text-white px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition"
                  >
                    {card.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-16">
            {MEDIA_STATS.map((s) => (
              <div
                key={s.label}
                className="bg-[#0F7C55] rounded-[30px] p-8 text-center text-white"
              >
                <h3 className="text-4xl font-bold text-[#D4AF37]">{s.value}</h3>
                <p className="mt-2 text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
