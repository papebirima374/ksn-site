const STATS = [
  { value: "2021", label: "Création KSN" },
  { value: "255K+", label: "Réseaux Sociaux" },
  { value: "9.5K+", label: "Membres Engagés" },
  { value: "4.3K+", label: "Utilisateurs App" },
];

export default function Stats() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28 pt-10">
      <div className="bg-white rounded-[45px] p-10 md:p-14 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
        <div className="text-center mb-14">
          <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold">
            Rayonnement KSN
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[#0F5132]">
            Une Communauté Spirituelle Internationale
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-[#F8F5EF] rounded-[30px] p-8 text-center hover:scale-105 transition"
            >
              <h3 className="text-5xl font-bold text-[#0F5132]">{s.value}</h3>
              <p className="mt-3 text-gray-600">{s.label}</p>
            </div>
          ))}

          <div className="bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-[30px] p-8 text-center text-[#0F5132] hover:scale-105 transition">
            <h3 className="text-5xl font-bold">🌍</h3>
            <p className="mt-3 font-semibold">Rayonnement International</p>
          </div>
        </div>
      </div>
    </section>
  );
}
