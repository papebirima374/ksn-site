import { PAYMENT } from "@/lib/constants";
import WaveLogo from "@/components/ui/WaveLogo";

export default function CotisationStep() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-gradient-to-br from-[#0F7C55] to-[#082F22] rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.2)] p-6 sm:p-12 md:p-14 text-white">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#D4AF37] font-semibold text-xs sm:text-sm">
            <span className="w-7 h-7 rounded-full bg-[#D4AF37] text-[#0F7C55] text-xs font-bold flex items-center justify-center">
              2
            </span>
            Cotisation Annuelle
          </span>
          <h2 className="font-display mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
            Étape 2 — Payer votre cotisation
          </h2>
          <p className="mt-4 text-white/75 leading-7 max-w-2xl mx-auto text-sm sm:text-base">
            Après avoir envoyé votre demande, finalisez votre adhésion en
            réglant la cotisation annuelle de{" "}
            <strong className="text-[#D4AF37]">
              {PAYMENT.membershipAmount.toLocaleString("fr-FR")} FCFA
            </strong>{" "}
            via Wave.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-7">
            <WaveLogo className="w-20 h-20 text-lg flex-shrink-0" />

            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                Cotisation annuelle KSN
              </p>
              <p className="font-display text-4xl sm:text-5xl font-bold text-white mt-1 tabular-nums">
                {PAYMENT.membershipAmount.toLocaleString("fr-FR")}
                <span className="text-lg sm:text-xl ml-2 text-white/70">
                  FCFA
                </span>
              </p>
            </div>
          </div>

          <a
            href={PAYMENT.membershipWave}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-6 sm:mt-8 w-full bg-[#1DCEDB] hover:bg-[#16b8c4] text-white text-center py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:scale-[1.02] transition"
          >
            Payer 1 000 FCFA via Wave
          </a>

          <p className="mt-4 text-center text-xs sm:text-sm text-white/60 italic">
            Vous serez redirigé vers la plateforme officielle de Wave.
          </p>
        </div>

        <div className="mt-8 sm:mt-10 text-center">
          <p className="text-white/70 text-xs sm:text-sm leading-6 max-w-2xl mx-auto">
            Une fois le paiement effectué, votre adhésion sera validée
            sous 24h. Vous recevrez une confirmation WhatsApp et serez ajouté(e)
            officiellement à la communauté KSN.
          </p>
        </div>
      </div>
    </section>
  );
}
