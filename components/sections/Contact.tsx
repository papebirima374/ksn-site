"use client";

import { useState, FormEvent } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { LINKS, SITE, buildWhatsAppLink } from "@/lib/constants";

export default function Contact() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const lines = [
      "*Nouveau message — Site KSN*",
      "",
      `*Nom :* ${nom}`,
      `*Email :* ${email}`,
      `*Téléphone :* ${tel}`,
      "",
      "*Message :*",
      message,
    ];
    window.open(buildWhatsAppLink(lines.join("\n")), "_blank");
  };

  return (
    <section
      id="contact"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28"
    >
      <div className="overflow-hidden rounded-[28px] sm:rounded-[45px] bg-[#0F5132] text-white">
        <div className="grid lg:grid-cols-2">
          <div className="p-6 sm:p-12 md:p-16">
            <span className="uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#D4AF37] font-semibold text-xs sm:text-sm">
              Contact Officiel
            </span>

            <h2 className="font-display mt-4 sm:mt-5 text-3xl sm:text-4xl md:text-5xl font-bold">
              Entrer en Contact
              <br />
              Avec la KSN
            </h2>

            <p className="mt-5 sm:mt-6 text-white/70 leading-7 sm:leading-8 text-sm sm:text-base">
              Une question, une adhésion, une collaboration ou une demande
              d&apos;information ? Notre équipe est disponible pour vous
              accompagner.
            </p>

            <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-5">
              <div className="bg-white/10 rounded-[20px] sm:rounded-[25px] p-4 sm:p-5">
                <h3 className="font-bold text-[#D4AF37] text-sm sm:text-base">
                  📍 Siège du Dahira
                </h3>
                <p className="mt-2 text-white/70 text-sm sm:text-base">
                  {SITE.location}
                </p>
              </div>

              <div className="bg-white/10 rounded-[20px] sm:rounded-[25px] p-4 sm:p-5">
                <h3 className="font-bold text-[#D4AF37] text-sm sm:text-base">
                  🌐 Site Officiel
                </h3>
                <p className="mt-2 text-white/70 text-sm sm:text-base">
                  {SITE.domain}
                </p>
              </div>

              <div className="bg-white/10 rounded-[20px] sm:rounded-[25px] p-4 sm:p-5">
                <h3 className="font-bold text-[#D4AF37] text-sm sm:text-base">
                  💬 WhatsApp Officiel
                </h3>
                <a
                  href={LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 sm:mt-3 text-white underline text-sm sm:text-base"
                >
                  <FaWhatsapp /> Contacter KSN
                </a>
              </div>
            </div>
          </div>

          <div className="bg-[#F8F5EF] p-6 sm:p-12 md:p-16 text-[#0F5132]">
            <h3 className="font-display text-2xl sm:text-3xl font-bold">
              Envoyer un message
            </h3>

            <p className="mt-2 sm:mt-3 text-gray-600 text-sm sm:text-base">
              Votre message s&apos;ouvrira directement sur notre WhatsApp
              officiel.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom complet"
                className="w-full rounded-[16px] sm:rounded-[20px] border border-gray-200 p-4 sm:p-5 outline-none focus:border-[#0F5132] text-sm sm:text-base bg-white"
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse email"
                className="w-full rounded-[16px] sm:rounded-[20px] border border-gray-200 p-4 sm:p-5 outline-none focus:border-[#0F5132] text-sm sm:text-base bg-white"
              />

              <input
                type="tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                placeholder="Téléphone (optionnel)"
                className="w-full rounded-[16px] sm:rounded-[20px] border border-gray-200 p-4 sm:p-5 outline-none focus:border-[#0F5132] text-sm sm:text-base bg-white"
              />

              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Votre message..."
                rows={5}
                className="w-full rounded-[16px] sm:rounded-[20px] border border-gray-200 p-4 sm:p-5 outline-none focus:border-[#0F5132] text-sm sm:text-base bg-white resize-none"
              />

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-4 sm:py-5 rounded-[16px] sm:rounded-[20px] font-bold hover:scale-[1.02] transition text-sm sm:text-base"
              >
                <FaWhatsapp className="text-lg sm:text-xl" />
                Envoyer via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
