import { LINKS } from "@/lib/constants";

const LANGUAGES = [
  { code: "FR", flag: "🇫🇷" },
  { code: "WO", flag: "🇸🇳" },
  { code: "EN", flag: "🇬🇧" },
  { code: "AR", flag: "🇸🇦" },
];

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
      className="relative z-10 max-w-7xl mx-auto px-6 pb-28"
    >
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div className="flex flex-wrap gap-3 mb-6">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-5 py-3 rounded-2xl hover:bg-[#D4AF37] hover:text-[#0A4D2E] transition-all duration-300 font-semibold shadow-lg"
            >
              {lang.flag} {lang.code}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[40px] p-12 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
        <div className="text-center">
          <span className="text-[#B8860B] uppercase tracking-[0.25em] font-semibold">
            Le Dahira
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[#0F5132]">
            Une Organisation Spirituelle
            <br />
            Moderne & Structurée
          </h2>

          <p className="mt-6 text-gray-600 max-w-3xl mx-auto leading-8">
            Fondé le 02 Janvier 2021 à Touba, Kippangog Salaatu &apos;Alaa Nabii
            œuvre pour la promotion du Salaatu sur le Prophète Muhammad ﷺ, la
            fraternité spirituelle et le rayonnement du Dahira à travers le
            monde.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {CARDS.map((card) => (
            <div key={card.title} className="bg-[#F8F5EF] rounded-[30px] p-8">
              <div className="text-5xl">{card.icon}</div>
              <h3 className="mt-5 text-2xl font-bold text-[#0F5132]">
                {card.title}
              </h3>
              <p className="mt-4 text-gray-600 leading-7">{card.text}</p>
            </div>
          ))}

          <div className="bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-[30px] p-8 text-[#0F5132]">
            <div className="text-5xl">✨</div>

            <h3 className="mt-5 text-2xl font-bold">Rejoindre la KSN</h3>

            <p className="mt-4 leading-7">
              Devenez membre officiel du Dahira et participez à cette mission
              spirituelle internationale.
            </p>

            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-8 bg-[#0F5132] text-white px-6 py-4 rounded-2xl font-semibold"
            >
              Adhérer Maintenant
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
