"use client";

import PageHero from "@/components/layout/PageHero";
import { FaWhatsapp } from "react-icons/fa6";
import { LINKS, PAYMENT, DON_AMOUNTS, buildWhatsAppLink } from "@/lib/constants";
import WaveLogo from "@/components/ui/WaveLogo";
import OrangeMoneyLogo from "@/components/ui/OrangeMoneyLogo";
import UBALogo from "@/components/ui/UBALogo";
import InternationalDonation from "@/components/sections/InternationalDonation";
import { useT } from "@/lib/i18n/context";

const orangeMoneyMessage = `*Don via Orange Money*\n\nBonjour, je souhaite faire un don à KSN via Orange Money.\nNuméro reçu : +${PAYMENT.orangeMoneyNumber}\n\nMontant : `;
const ubaMessage = `*Don via virement UBA*\n\nBonjour, je viens d'effectuer un virement bancaire au compte UBA de KSN.\n\nMontant viré : \nDate du virement : \nRéférence : `;
const customDonMessage = `*Don libre — KSN*\n\nBonjour, je souhaite faire un don d'un montant personnalisé. Merci de m'indiquer la marche à suivre.\n\nMontant souhaité : `;

export default function DonContent() {
  const { t, locale } = useT();

  return (
    <>
      <PageHero
        overline={t("don.overline")}
        title={t("don.title")}
        arabic={t("don.arabic")}
        description={t("don.desc")}
      />

      {/* WAVE — quick amounts */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8">
            <WaveLogo className="w-16 h-16 text-base flex-shrink-0" />
            <div>
              <span className="uppercase tracking-[0.2em] text-[#1DCEDB] text-xs sm:text-sm font-bold">
                {t("don.wave_badge")}
              </span>
              <h2 className="font-display mt-1 text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F7C55]">
                {t("don.wave_title")}
              </h2>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">
                {t("don.wave_desc")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {DON_AMOUNTS.map(({ amount, waveLink }) => {
              const disabled = !waveLink;
              const className =
                "flex flex-col items-center justify-center rounded-2xl border-2 transition py-5 sm:py-7 px-3 text-center";
              const enabledClasses =
                "border-[#1DCEDB] bg-[#1DCEDB]/5 hover:bg-[#1DCEDB] hover:text-white hover:scale-105 text-[#0F7C55]";
              const disabledClasses =
                "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed";

              const content = (
                <>
                  <span className="font-display text-2xl sm:text-3xl font-bold tabular-nums">
                    {amount.toLocaleString(locale === 'ar' ? 'ar-EG' : locale)}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold mt-1">
                    FCFA
                  </span>
                  {disabled && (
                    <span className="mt-2 text-[10px] sm:text-xs text-gray-400 italic">
                      {t("don.wave_link_coming")}
                    </span>
                  )}
                </>
              );

              if (disabled) {
                return (
                  <div
                    key={amount}
                    className={`${className} ${disabledClasses}`}
                  >
                    {content}
                  </div>
                );
              }

              return (
                <a
                  key={amount}
                  href={waveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${className} ${enabledClasses}`}
                >
                  {content}
                </a>
              );
            })}
          </div>

          <a
            href={buildWhatsAppLink(customDonMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 sm:mt-6 inline-flex items-center gap-2 text-[#0F7C55] hover:text-[#B8860B] text-sm sm:text-base font-semibold transition"
          >
            <FaWhatsapp /> {t("don.custom_amount")}
          </a>
        </div>
      </section>

      {/* STRIPE + PAYPAL INTERNATIONAL */}
      <InternationalDonation />

      {/* ORANGE MONEY + UBA */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-5 sm:gap-7">

          {/* Orange Money */}
          <div className="bg-white rounded-[28px] sm:rounded-[35px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-10">
            <div className="flex items-start gap-4">
              <OrangeMoneyLogo className="w-16 h-16 text-[11px] px-1 flex-shrink-0" />
              <div>
                <span className="uppercase tracking-[0.2em] text-[#FF7900] text-xs font-bold">
                  {t("don.om_badge")}
                </span>
                <h3 className="font-display mt-1 text-2xl sm:text-3xl font-bold text-[#0F7C55]">
                  {t("don.om_title")}
                </h3>
              </div>
            </div>

            <p className="mt-5 text-gray-600 leading-7 text-sm sm:text-base">
              {t("don.om_desc")}
            </p>

            <div className="mt-5 bg-[#FFF4E5] rounded-2xl p-4 sm:p-5 border border-[#FF7900]/20">
              <p className="text-xs uppercase tracking-widest text-[#FF7900] font-bold">
                {t("don.official_number")}
              </p>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#0F7C55] tabular-nums">
                +{PAYMENT.orangeMoneyNumber.slice(0, 3)}{" "}
                {PAYMENT.orangeMoneyNumber.slice(3, 5)}{" "}
                {PAYMENT.orangeMoneyNumber.slice(5, 8)}{" "}
                {PAYMENT.orangeMoneyNumber.slice(8, 10)}{" "}
                {PAYMENT.orangeMoneyNumber.slice(10)}
              </p>
            </div>

            <a
              href={buildWhatsAppLink(orangeMoneyMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 sm:mt-6 inline-flex items-center gap-2 text-[#0F7C55] hover:text-[#B8860B] text-sm font-semibold transition"
            >
              <FaWhatsapp /> {t("don.om_confirm")}
            </a>
          </div>

          {/* UBA */}
          <div className="bg-white rounded-[28px] sm:rounded-[35px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-10">
            <div className="flex items-start gap-4">
              <UBALogo className="w-16 h-16 text-lg flex-shrink-0" />
              <div>
                <span className="uppercase tracking-[0.2em] text-[#E60000] text-xs font-bold">
                  {t("don.uba_badge")}
                </span>
                <h3 className="font-display mt-1 text-2xl sm:text-3xl font-bold text-[#0F7C55]">
                  {t("don.uba_title")}
                </h3>
              </div>
            </div>

            <p className="mt-5 text-gray-600 leading-7 text-sm sm:text-base">
              {t("don.uba_desc")}
            </p>

            <div className="mt-5 bg-[#FFE5E5] rounded-2xl p-4 sm:p-5 border border-[#E60000]/20">
              <p className="text-xs uppercase tracking-widest text-[#E60000] font-bold">
                {t("don.uba_number")}
              </p>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#0F7C55] tabular-nums">
                {PAYMENT.ubaAccount.slice(0, 4)}{" "}
                {PAYMENT.ubaAccount.slice(4, 8)}{" "}
                {PAYMENT.ubaAccount.slice(8)}
              </p>
              <p className="mt-2 text-xs text-[#0F7C55]/70">
                {t("don.uba_beneficiary")}
              </p>
            </div>

            <a
              href={buildWhatsAppLink(ubaMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 sm:mt-6 inline-flex items-center gap-2 text-[#0F7C55] hover:text-[#B8860B] text-sm font-semibold transition"
            >
              <FaWhatsapp /> {t("don.uba_confirm")}
            </a>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="bg-gradient-to-br from-[#0F7C55] to-[#082F22] rounded-[28px] sm:rounded-[45px] p-6 sm:p-12 md:p-16 text-center text-white">
          <p className="font-arabic text-3xl sm:text-4xl text-[#D4AF37] mb-4">
            {t("don.thanks_arabic")}
          </p>

          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
            {t("don.thanks_title")}
          </h3>

          <p className="mt-4 sm:mt-6 text-white/75 leading-7 sm:leading-8 max-w-2xl mx-auto text-sm sm:text-base">
            {t("don.thanks_desc")}
          </p>

          <p className="mt-8 text-xs sm:text-sm text-white/60 italic max-w-2xl mx-auto">
            {t("don.thanks_hadith")}
          </p>

          <a
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 mt-8 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold shadow-xl hover:scale-105 transition"
          >
            <FaWhatsapp className="text-xl sm:text-2xl" />
            {t("don.contact_btn")}
          </a>
        </div>
      </section>
    </>
  );
}
