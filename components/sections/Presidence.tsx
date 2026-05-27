import Image from "next/image";

const PRESIDENTS = [
  {
    name: "Serigne Bassirou Touré",
    role: "Président d'Honneur",
    image: "/images/bassirou.jpeg",
    description:
      "Guide moral et figure d'accompagnement spirituel du Dahira Kippangog Salaatu 'Alaa Nabii.",
  },
  {
    name: "Serigne Birima Gueye",
    role: "Président & Fondateur",
    image: "/images/birima.jpeg",
    description:
      "Fondateur de KSN et initiateur du rayonnement spirituel et communautaire du Dahira.",
  },
];

export default function Presidence() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-white rounded-[28px] sm:rounded-[40px] p-6 sm:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
        <div className="text-center">
          <span className="text-[#B8860B] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-semibold text-xs sm:text-sm">
            Direction Spirituelle
          </span>

          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
            Présidence du Dahira
          </h2>

          <p className="mt-4 sm:mt-5 text-gray-600 max-w-2xl mx-auto leading-7 sm:leading-8 text-sm sm:text-base">
            Une direction engagée au service du Salaatu, du développement
            spirituel et du rayonnement international de la KSN.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mt-10 sm:mt-14">
          {PRESIDENTS.map((p) => (
            <div
              key={p.name}
              className="bg-[#F8F5EF] rounded-[24px] sm:rounded-[35px] p-6 sm:p-10 text-center border border-[#0F7C55]/10 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] hover:-translate-y-2 duration-300 transition"
            >
              <div className="relative w-36 h-36 sm:w-48 sm:h-48 mx-auto rounded-full overflow-hidden border-[4px] sm:border-[6px] border-[#D4AF37] shadow-xl">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover object-top scale-110"
                />
              </div>

              <div className="mt-5 sm:mt-6 inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#D4AF37]/10 text-[#B8860B] font-semibold text-xs sm:text-sm">
                {p.role}
              </div>

              <h3 className="font-display mt-4 sm:mt-5 text-2xl sm:text-3xl font-bold text-[#0F7C55]">
                {p.name}
              </h3>

              <p className="mt-3 sm:mt-4 text-gray-600 leading-6 sm:leading-7 text-sm sm:text-base">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
