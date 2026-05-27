import { LINKS } from "@/lib/constants";

const CARDS = [
  {
    icon: "📜",
    title: "Notre Mission",
    text: "Promouvoir l'amour du Prophète ﷺ à travers le Salaatu, les Khassidas, les Azkâr et l'éducation spirituelle.",
  },
  {
    icon: "🏛️",
    title: "Bureau du Dahira",
    text: "Une organisation structurée avec Présidence, Secrétariat Général, Finances, Organisation et plusieurs commissions officielles.",
  },
  {
    icon: "👥",
    title: "Vie du Membre",
    text: "Participation active au Salaatu, activités spirituelles, événements, application KSN et vie communautaire.",
  },
  {
    icon: "📚",
    title: "Règlement Intérieur",
    text: "Discipline, engagement spirituel, organisation et principes officiels du Dahira KSN.",
  },
  {
    icon: "📈",
    title: "Plan d'Actions",
    text: "Éducation, Culture, Finances, Sociale, Organisation et développement communautaire.",
  },
];

export default function LeDahira() {
  return (
    <section
      id="dahira"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28 pt-6 sm:pt-10"
    >
      <div className="bg-white rounded-[28px] sm:rounded-[40px] p-6 sm:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
        <div className="text-center">
          <span className="text-[#B8860B] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-semibold text-xs sm:text-sm">
            Le Dahira
          </span>

          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
            Une Organisation Spirituelle
            <br />
            Moderne & Structurée
          </h2>

          <p className="mt-5 sm:mt-6 text-gray-600 max-w-3xl mx-auto leading-7 sm:leading-8 text-sm sm:text-base">
            Fondé le 02 Janvier 2021 à Touba, Kippangog Salaatu &apos;Alaa Nabii
            œuvre pour la promotion du Salaatu sur le Prophète Muhammad ﷺ, la
            fraternité spirituelle et le rayonnement du Dahira à travers le
            monde.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-10 sm:mt-14">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="bg-[#F8F5EF] rounded-[20px] sm:rounded-[30px] p-6 sm:p-8"
            >
              <div className="text-4xl sm:text-5xl">{card.icon}</div>
              <h3 className="font-display mt-4 sm:mt-5 text-xl sm:text-2xl font-bold text-[#0F7C55]">
                {card.title}
              </h3>
              <p className="mt-3 sm:mt-4 text-gray-600 leading-6 sm:leading-7 text-sm sm:text-base">
                {card.text}
              </p>
            </div>
          ))}

          <div className="bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-[20px] sm:rounded-[30px] p-6 sm:p-8 text-[#0F7C55]">
            <div className="text-4xl sm:text-5xl">✨</div>

            <h3 className="font-display mt-4 sm:mt-5 text-xl sm:text-2xl font-bold">
              Rejoindre la KSN
            </h3>

            <p className="mt-3 sm:mt-4 leading-6 sm:leading-7 text-sm sm:text-base">
              Devenez membre officiel du Dahira et participez à cette mission
              spirituelle internationale.
            </p>

            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-6 sm:mt-8 bg-[#0F7C55] text-white px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base"
            >
              Adhérer Maintenant
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
