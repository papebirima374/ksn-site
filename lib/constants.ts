export const SITE = {
  name: "KSN",
  fullName: "Kippangog Salaatu 'Alaa Nabii",
  tagline: "Site Officiel International",
  motto: "Prière • Spiritualité • Rayonnement",
  domain: "salaatualaanabii.com",
  url: "https://salaatualaanabii.com",
  location: "Touba, Sénégal",
  foundedYear: "2021",
};

export const WHATSAPP_PHONE = "221767257272";

export function buildWhatsAppLink(prefilled: string): string {
  const text = encodeURIComponent(prefilled);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
}

export const LINKS = {
  whatsapp: "https://wa.me/message/2RQFZOER66SOC1",
  facebook: "https://www.facebook.com/salaatualaanabii/",
  youtube: "https://youtube.com/@salaatualaanabi",
  tiktok: "https://www.tiktok.com/@salaatualaanabi",
  instagram: "https://www.instagram.com/salaatu_alaa_nabii",
  telegram: "https://t.me/salaatualaanabi",
  appStore:
    "https://apps.apple.com/sn/app/kippaangog-salaatualaa-nabii/id6502859802",
  playStore:
    "https://play.google.com/store/apps/details?id=com.salatouapp.dev",
};

export const NAV_ITEMS = [
  { label: "Accueil", href: "#accueil" },
  { label: "Le Dahira", href: "#dahira" },
  { label: "Spiritualité", href: "#spiritualite" },
  { label: "Média", href: "#media" },
  { label: "Contact", href: "#contact" },
];

export const PAYMENT = {
  membershipWave: "https://pay.wave.com/m/M_sn_bbehrkdtxa8W/c/sn/?amount=1010",
  membershipAmount: 1000,
  orangeMoneyNumber: "221780178444",
  ubaAccount: "307500053070",
  /** Liens Wave pour les achats premium du site (1000 FCFA = 1010 avec frais). */
  premiumSalaatuLibraryWave:
    "https://pay.wave.com/m/M_sn_bbehrkdtxa8W/c/sn/?amount=1010",
};

export const DON_AMOUNTS = [
  { amount: 500, waveLink: "https://pay.wave.com/m/M_sn_bbehrkdtxa8W/c/sn/?amount=505" },
  { amount: 1000, waveLink: "https://pay.wave.com/m/M_sn_bbehrkdtxa8W/c/sn/?amount=1010" },
  { amount: 2000, waveLink: "https://pay.wave.com/m/M_sn_bbehrkdtxa8W/c/sn/?amount=2020" },
  { amount: 5000, waveLink: "https://pay.wave.com/m/M_sn_bbehrkdtxa8W/c/sn/?amount=5050" },
  { amount: 10000, waveLink: "https://pay.wave.com/m/M_sn_bbehrkdtxa8W/c/sn/?amount=10100" },
];
