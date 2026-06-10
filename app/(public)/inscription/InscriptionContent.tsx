"use client";

import { useState, FormEvent } from "react";
import PageHero from "@/components/layout/PageHero";
import { FaWhatsapp, FaCircleCheck, FaScroll } from "react-icons/fa6";
import { buildWhatsAppLink } from "@/lib/constants";
import { useT } from "@/lib/i18n/context";

// Règles officielles d'adhésion — texte wolof fixe (ne se traduit pas),
// la traduction sous chaque règle suit la langue du visiteur.
const RULES_WOLOF = [
  "Nga dag Aw Carte membre 1000 Franc CFA",
  "Ngay Julli ci Yónnent bi ﷺ saa su nékk ci Salaatu boo man ak lim bo ci man",
  "Nga wut application bii ngir foofu lañuy jaarale lim yi",
  "Weer Wu jot nga barkeelo 500 Franc CFA ngir dimbalante bi ci birr dara ji ak Bisub Salaatu'Alaa Nabii",
];

export default function InscriptionContent() {
  const { t } = useT();

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [adresse, setAdresse] = useState("");
  const [profession, setProfession] = useState("");
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [error, setError] = useState("");

  const benefits = [
    t("inscription.b1"),
    t("inscription.b2"),
    t("inscription.b3"),
    t("inscription.b4"),
    t("inscription.b5"),
  ];

  const ruleTranslations = [
    t("join.rule1"),
    t("join.rule2"),
    t("join.rule3"),
    t("join.rule4"),
  ];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prenom.trim() || !nom.trim() || !tel.trim() || !adresse.trim()) {
      setError(t("join.error_required"));
      return;
    }
    if (!rulesAccepted) {
      setError(t("join.error_rules"));
      return;
    }
    setError("");

    // Message envoyé en français : c'est la langue de travail de l'équipe.
    const lines = [
      "🌙 *Demande d'intégration au Groupe WhatsApp — Dahira KSN*",
      "",
      `*Prénom :* ${prenom.trim()}`,
      `*Nom :* ${nom.trim()}`,
      `*Téléphone :* ${tel.trim()}`,
      `*Adresse :* ${adresse.trim()}`,
      `*Profession :* ${profession.trim() || "—"}`,
      "",
      "✅ J'ai lu et j'accepte les règles d'adhésion (sart yi) :",
      "1. Carte de membre à 1 000 FCFA",
      "2. Prière sur le Prophète ﷺ chaque jour",
      "3. Application mobile pour compter mes Salaatu",
      "4. Cotisation mensuelle de 500 FCFA",
    ];
    window.open(buildWhatsAppLink(lines.join("\n")), "_blank");
  };

  const inputClass =
    "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-[#0F7C55] outline-none focus:border-[#0F7C55] transition placeholder:text-gray-400";

  return (
    <>
      <PageHero
        overline={t("inscription.overline")}
        title={t("inscription.title")}
        arabic={t("inscription.arabic")}
        description={t("inscription.desc")}
      />

      {/* FORMULAIRE DE DEMANDE D'INTÉGRATION */}
      <section className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 -mt-8 sm:-mt-12">
        <div className="bg-white rounded-[28px] sm:rounded-[40px] shadow-[0_20px_80px_rgba(0,0,0,0.15)] p-6 sm:p-10 md:p-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#25D366] text-white flex items-center justify-center text-3xl shadow-lg mb-4">
              <FaWhatsapp />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F7C55]">
              {t("join.form_title")}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-3 leading-7 max-w-md mx-auto">
              {t("join.form_desc")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F7C55] mb-1.5">
                  {t("join.first_name")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className={inputClass}
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F7C55] mb-1.5">
                  {t("join.last_name")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className={inputClass}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F7C55] mb-1.5">
                {t("join.phone")} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                className={inputClass}
                placeholder="+221 77 000 00 00"
                autoComplete="tel"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F7C55] mb-1.5">
                {t("join.address")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className={inputClass}
                autoComplete="street-address"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F7C55] mb-1.5">
                {t("join.profession")}{" "}
                <span className="text-gray-400 normal-case font-medium">
                  ({t("join.optional")})
                </span>
              </label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* RÈGLES D'ADHÉSION */}
            <div className="mt-6 bg-[#F8F5EF] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[#0F7C55]/10">
              <div className="flex items-center gap-2.5 mb-4">
                <FaScroll className="text-[#B8860B] text-lg flex-shrink-0" />
                <div>
                  <h3 className="font-display text-lg font-bold text-[#0F7C55] leading-tight">
                    Lii mooy sart yi
                  </h3>
                  <p className="text-xs text-gray-500 italic">
                    {t("join.rules_title")}
                  </p>
                </div>
              </div>

              <ol className="space-y-3.5">
                {RULES_WOLOF.map((rule, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0F7C55] text-[#D4AF37] text-xs font-black flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#0F7C55] leading-6">
                        {rule}
                      </p>
                      <p className="text-xs text-gray-500 italic mt-0.5 leading-5">
                        {ruleTranslations[i]}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <label className="mt-5 flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rulesAccepted}
                  onChange={(e) => setRulesAccepted(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded accent-[#0F7C55] flex-shrink-0"
                />
                <span className="text-sm text-[#0F7C55] font-semibold leading-6">
                  {t("join.accept")}
                </span>
              </label>
            </div>

            {error && (
              <p className="text-red-600 text-sm font-semibold text-center bg-red-50 rounded-xl py-3 px-4">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold px-8 py-4 sm:py-5 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-100 transition text-base"
            >
              <FaWhatsapp className="text-xl" /> {t("join.submit")}
            </button>
            <p className="text-[11px] text-gray-400 text-center">
              {t("inscription.note")}
            </p>
          </form>
        </div>
      </section>

      {/* AVANTAGES MEMBRE */}
      <section className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[40px] bg-gradient-to-br from-[#0F7C55] via-[#0A3D24] to-[#082F22] text-white p-7 sm:p-10 shadow-2xl">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#D4AF37]/15 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-center">
              {t("inscription.contact_title")}
            </h2>
            <ul className="mt-6 space-y-2.5 text-left max-w-sm mx-auto">
              {benefits.map((line) => (
                <li
                  key={line}
                  className="flex gap-2.5 items-start text-sm text-white/90"
                >
                  <FaCircleCheck className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
