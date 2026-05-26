import { LINKS, SITE } from "@/lib/constants";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative z-10 max-w-7xl mx-auto px-6 pb-28"
    >
      <div className="overflow-hidden rounded-[45px] bg-[#0F5132] text-white">
        <div className="grid lg:grid-cols-2">
          <div className="p-12 md:p-16">
            <span className="uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              Contact Officiel
            </span>

            <h2 className="mt-5 text-4xl md:text-5xl font-bold">
              Entrer en Contact
              <br />
              Avec la KSN
            </h2>

            <p className="mt-6 text-white/70 leading-8">
              Une question, une adhésion, une collaboration ou une demande
              d&apos;information ? Notre équipe est disponible pour vous
              accompagner.
            </p>

            <div className="mt-10 space-y-5">
              <div className="bg-white/10 rounded-[25px] p-5">
                <h3 className="font-bold text-[#D4AF37]">📍 Siège du Dahira</h3>
                <p className="mt-2 text-white/70">{SITE.location}</p>
              </div>

              <div className="bg-white/10 rounded-[25px] p-5">
                <h3 className="font-bold text-[#D4AF37]">🌐 Site Officiel</h3>
                <p className="mt-2 text-white/70">{SITE.domain}</p>
              </div>

              <div className="bg-white/10 rounded-[25px] p-5">
                <h3 className="font-bold text-[#D4AF37]">
                  💬 WhatsApp Officiel
                </h3>
                <a
                  href={LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex mt-3 text-white underline"
                >
                  Contacter KSN
                </a>
              </div>
            </div>
          </div>

          <div className="bg-[#F8F5EF] p-12 md:p-16 text-[#0F5132]">
            <h3 className="text-3xl font-bold">Envoyer un message</h3>

            <p className="mt-3 text-gray-600">
              Nous vous répondrons rapidement.
            </p>

            <form className="mt-8 space-y-5">
              <input
                type="text"
                placeholder="Nom complet"
                className="w-full rounded-[20px] border border-gray-200 p-5 outline-none"
              />

              <input
                type="email"
                placeholder="Adresse email"
                className="w-full rounded-[20px] border border-gray-200 p-5 outline-none"
              />

              <input
                type="text"
                placeholder="Téléphone"
                className="w-full rounded-[20px] border border-gray-200 p-5 outline-none"
              />

              <textarea
                placeholder="Votre message..."
                rows={5}
                className="w-full rounded-[20px] border border-gray-200 p-5 outline-none"
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-5 rounded-[20px] font-bold hover:scale-[1.02] transition"
              >
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
