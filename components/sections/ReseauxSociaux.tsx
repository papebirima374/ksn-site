import { LINKS } from "@/lib/constants";

const SOCIALS = [
  {
    icon: "📘",
    title: "Facebook",
    text: "Publications officielles, événements et vie du Dahira.",
    href: LINKS.facebook,
  },
  {
    icon: "▶️",
    title: "YouTube",
    text: "Conférences, Salaatou, enseignements et lives.",
    href: LINKS.youtube,
  },
  {
    icon: "🎵",
    title: "TikTok",
    text: "Capsules spirituelles et contenus courts KSN.",
    href: LINKS.tiktok,
  },
  {
    icon: "📸",
    title: "Instagram",
    text: "Photos officielles, inspirations et médias.",
    href: LINKS.instagram,
  },
  {
    icon: "✈️",
    title: "Telegram",
    text: "Communauté KSN et informations importantes.",
    href: LINKS.telegram,
  },
];

export default function ReseauxSociaux() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
      <div className="bg-white rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-12 md:p-16">
        <div className="text-center">
          <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold">
            Communauté Digitale
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[#0F5132]">
            Suivez KSN Partout
          </h2>

          <p className="mt-6 text-gray-600 max-w-3xl mx-auto leading-8">
            Retrouvez les contenus spirituels, vidéos, rappels, événements et
            publications officielles de KSN sur toutes nos plateformes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mt-16">
          {SOCIALS.map((s) => (
            <a
              key={s.title}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F8F5EF] rounded-[35px] p-8 hover:-translate-y-2 duration-300 shadow-md"
            >
              <div className="text-5xl">{s.icon}</div>
              <h3 className="mt-5 text-2xl font-bold text-[#0F5132]">
                {s.title}
              </h3>
              <p className="mt-4 text-gray-600 leading-7">{s.text}</p>
            </a>
          ))}

          <a
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-[35px] p-8 hover:-translate-y-2 duration-300 shadow-md text-[#0F5132]"
          >
            <div className="text-5xl">💬</div>
            <h3 className="mt-5 text-2xl font-bold">WhatsApp Officiel</h3>
            <p className="mt-4 leading-7">
              Rejoignez la communauté officielle et contactez directement KSN.
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
