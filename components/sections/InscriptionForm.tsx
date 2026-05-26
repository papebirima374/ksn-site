"use client";

import { useState, FormEvent } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { buildWhatsAppLink } from "@/lib/constants";

export default function InscriptionForm() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [pays, setPays] = useState("");
  const [ville, setVille] = useState("");
  const [motivation, setMotivation] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const lines = [
      "*Demande d'adhésion — Dahira KSN*",
      "",
      `*Prénom :* ${prenom}`,
      `*Nom :* ${nom}`,
      `*Email :* ${email}`,
      `*Téléphone :* ${tel}`,
      `*Pays :* ${pays}`,
      `*Ville :* ${ville}`,
      "",
      "*Motivation :*",
      motivation,
    ];
    window.open(buildWhatsAppLink(lines.join("\n")), "_blank");
  };

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-16">
        <div className="text-center mb-8 sm:mb-12">
          <span className="uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
            Formulaire d&apos;Adhésion
          </span>
          <h2 className="font-display mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F5132]">
            Demande d&apos;Inscription
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Remplissez ce formulaire et votre demande sera envoyée directement à
            l&apos;équipe KSN via WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            <input
              type="text"
              required
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Prénom"
              className="w-full rounded-[16px] sm:rounded-[20px] border border-gray-200 p-4 sm:p-5 outline-none focus:border-[#0F5132] text-sm sm:text-base text-[#0F5132] bg-white"
            />
            <input
              type="text"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom"
              className="w-full rounded-[16px] sm:rounded-[20px] border border-gray-200 p-4 sm:p-5 outline-none focus:border-[#0F5132] text-sm sm:text-base text-[#0F5132] bg-white"
            />
          </div>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse email"
            className="w-full rounded-[16px] sm:rounded-[20px] border border-gray-200 p-4 sm:p-5 outline-none focus:border-[#0F5132] text-sm sm:text-base text-[#0F5132] bg-white"
          />

          <input
            type="tel"
            required
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            placeholder="Téléphone (avec indicatif, ex: +221...)"
            className="w-full rounded-[16px] sm:rounded-[20px] border border-gray-200 p-4 sm:p-5 outline-none focus:border-[#0F5132] text-sm sm:text-base text-[#0F5132] bg-white"
          />

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            <input
              type="text"
              required
              value={pays}
              onChange={(e) => setPays(e.target.value)}
              placeholder="Pays"
              className="w-full rounded-[16px] sm:rounded-[20px] border border-gray-200 p-4 sm:p-5 outline-none focus:border-[#0F5132] text-sm sm:text-base text-[#0F5132] bg-white"
            />
            <input
              type="text"
              required
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              placeholder="Ville"
              className="w-full rounded-[16px] sm:rounded-[20px] border border-gray-200 p-4 sm:p-5 outline-none focus:border-[#0F5132] text-sm sm:text-base text-[#0F5132] bg-white"
            />
          </div>

          <textarea
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            placeholder="Votre motivation pour rejoindre la KSN (optionnel)"
            rows={4}
            className="w-full rounded-[16px] sm:rounded-[20px] border border-gray-200 p-4 sm:p-5 outline-none focus:border-[#0F5132] text-sm sm:text-base text-[#0F5132] bg-white resize-none"
          />

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-4 sm:py-5 rounded-[16px] sm:rounded-[20px] font-bold hover:scale-[1.02] transition text-sm sm:text-base shadow-xl"
          >
            <FaWhatsapp className="text-lg sm:text-xl" />
            Envoyer ma demande
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-500 italic mt-4">
            Votre demande s&apos;ouvrira dans WhatsApp avec votre message
            pré-rempli. Vérifiez-le, puis envoyez.
          </p>
        </form>
      </div>
    </section>
  );
}
