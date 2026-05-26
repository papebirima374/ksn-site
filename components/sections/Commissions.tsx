const COMMISSIONS = [
  {
    icon: "📚",
    title: "Éducation & Culture",
    text: "Renforcer le lien spirituel des membres à travers le Coran, les Khassidas, le Salaatu quotidien, les conférences et l'éducation islamique.",
  },
  {
    icon: "💰",
    title: "Finances",
    text: "Gestion transparente des cotisations, des dons, de la comptabilité et du financement des activités du Dahira.",
  },
  {
    icon: "🤝",
    title: "Sociale & Développement",
    text: "Solidarité communautaire, assistance aux membres, projets sociaux et actions de développement.",
  },
  {
    icon: "🏛️",
    title: "Organisation",
    text: "Coordination des événements, logistique, journées spirituelles, rencontres et activités du Dahira.",
  },
  {
    icon: "📢",
    title: "Communication",
    text: "Gestion des annonces officielles, réseaux sociaux, médias, publications et rayonnement numérique.",
  },
  {
    icon: "🌍",
    title: "Relations Extérieures",
    text: "Développement des partenariats, représentation institutionnelle et ouverture internationale du Dahira.",
  },
];

export default function Commissions() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
      <div className="bg-[#0F5132] rounded-[45px] overflow-hidden p-12 md:p-16 text-white relative">
        <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-[#D4AF37]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#B8860B]/10 blur-[120px] rounded-full" />

        <div className="relative z-10">
          <div className="text-center">
            <span className="uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              Organisation KSN
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold">
              Commissions Officielles
            </h2>

            <p className="mt-6 text-white/70 max-w-3xl mx-auto leading-8">
              Les commissions du Dahira Kippangog Salaatu &apos;Alaa Nabii
              assurent l&apos;organisation, l&apos;éducation, la solidarité, la
              communication et le développement spirituel de la communauté.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mt-16">
            {COMMISSIONS.map((c) => (
              <div
                key={c.title}
                className="bg-white/10 backdrop-blur-md rounded-[30px] p-8 border border-white/10 hover:scale-[1.02] transition"
              >
                <div className="text-5xl">{c.icon}</div>
                <h3 className="mt-5 text-2xl font-bold text-[#D4AF37]">
                  {c.title}
                </h3>
                <p className="mt-4 text-white/70 leading-7">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
