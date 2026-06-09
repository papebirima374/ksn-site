import { Locale } from "./locales";

// Note: pour Wolof, on garde les noms propres (Dahira, KSN, Salaatu, Touba) en
// français/arabe — ils ne se traduisent pas. Pour les termes religieux,
// l'usage local mélange souvent arabe + wolof.
export const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.dahira": "Le Dahira",
    "nav.spiritualite": "Spiritualité",
    "nav.media": "Média",
    "nav.boutique": "Boutique",
    "nav.blog": "Blog",
    "nav.contact": "Contact",

    // CTAs récurrents
    "cta.donate": "Faire un Don",
    "cta.join": "Rejoindre le Dahira",
    "cta.discover": "Découvrir KSN",
    "cta.member": "Devenir Membre",
    "cta.read_more": "Lire l'article",
    "cta.send_whatsapp": "Envoyer via WhatsApp",
    "cta.contact_whatsapp": "Contacter sur WhatsApp",
    "cta.follow_us": "Suivez-nous",

    // Site / branding
    "site.tagline": "Site Officiel International",
    "site.motto": "Prière • Spiritualité • Rayonnement",
    "site.location": "Touba, Sénégal",

    // Hero
    "hero.badge": "Kippangog Salaatu 'Alaa Nabii",
    "hero.title_line1": "Une communauté",
    "hero.title_line2": "spirituelle moderne",
    "hero.title_line3": "au service du",
    "hero.title_line4": "Salaatu ﷺ",
    "hero.subtitle":
      "Créé le 02 Janvier 2021 à Touba, KSN œuvre pour la promotion de la Prière sur le Prophète Muhammad ﷺ à travers une organisation structurée, des activités spirituelles et une communauté internationale engagée.",
    "hero.card_overline": "Vie Institutionnelle KSN",
    "hero.card_title": "Organisation & Fonctionnement",
    "hero.card_reglement": "Règlement Intérieur",
    "hero.card_reglement_desc":
      "Statuts, discipline et fonctionnement du Dahira.",
    "hero.card_commissions": "Commissions Officielles",
    "hero.card_commissions_desc":
      "Éducation, Communication, Finances, Sociale, Organisation et Relations Extérieures.",
    "hero.card_membre": "Vie du Membre",
    "hero.card_membre_desc":
      "Adhésion, participation spirituelle et engagement communautaire.",

    // Stats
    "stats.overline": "Rayonnement KSN",
    "stats.title": "Une Communauté Spirituelle Internationale",
    "stats.creation": "Création KSN",
    "stats.social": "Réseaux Sociaux",
    "stats.members": "Membres Engagés",
    "stats.app_users": "Utilisateurs App",
    "stats.international": "Rayonnement International",

    // Sections
    "section.direction_spirituelle": "Direction Spirituelle",
    "section.presidence_title": "Présidence du Dahira",
    "section.presidence_desc":
      "Une direction engagée au service du Salaatu, du développement spirituel et du rayonnement international de la KSN.",
    "section.organisation_ksn": "Organisation KSN",
    "section.commissions_title": "Commissions Officielles",
    "section.media_ksn": "Média KSN",
    "section.media_title": "Activités du Dahira & Vie Communautaire",
    "section.communaute_digitale": "Communauté Digitale",
    "section.suivez_partout": "Suivez KSN Partout",
    "section.contact_officiel": "Contact Officiel",
    "section.contact_title": "Entrer en Contact",
    "section.spiritualite_ksn": "Spiritualité KSN",
    "section.spiritualite_title": "Nourrir le Cœur par le Salaatu ﷺ",

    // Footer
    "footer.navigation": "Navigation",
    "footer.contact": "Contact",
    "footer.suivez": "Suivez-nous",
    "footer.mission_title": "Mission Spirituelle",
    "footer.mission_quote":
      "Œuvrer pour la promotion de la Prière sur le Prophète Muhammad ﷺ à travers une communauté spirituelle moderne, engagée et internationale.",
    "footer.copyright": "Tous droits réservés.",

    // Salaatu du Jour
    "salaatu.overline": "Salaatou du Jour",
    "salaatu.title": "Le Salaatu Recommandé",
    "salaatu.benefits": "Bienfaits",
    "salaatu.benefits_text":
      "Lumière dans le cœur, proximité du Prophète ﷺ et bénédictions divines.",
    "salaatu.when": "Quand le réciter",
    "salaatu.when_text":
      "À tout moment, particulièrement après les prières et le vendredi.",
    "salaatu.reward": "Récompense",
    "salaatu.reward_text":
      "Allah prie 10 fois sur celui qui prie une fois sur le Prophète ﷺ.",

    // Section "Le Dahira"
    "ledahira.overline": "Le Dahira",
    "ledahira.title_l1": "Une Organisation Spirituelle",
    "ledahira.title_l2": "Moderne & Structurée",
    "ledahira.intro":
      "Fondé le 02 Janvier 2021 à Touba, Kippangog Salaatu 'Alaa Nabii œuvre pour la promotion de la Prière sur le Prophète Muhammad ﷺ, la fraternité spirituelle et le rayonnement du Dahira à travers le monde.",
    "ledahira.card1_title": "Notre Mission",
    "ledahira.card1_text":
      "Promouvoir l'amour du Prophète ﷺ à travers le Salaatu, les Khassidas, les Azkâr et l'éducation spirituelle.",
    "ledahira.card2_title": "Bureau du Dahira",
    "ledahira.card2_text":
      "Une organisation structurée avec Présidence, Secrétariat Général, Finances, Organisation et plusieurs commissions officielles.",
    "ledahira.card3_title": "Vie du Membre",
    "ledahira.card3_text":
      "Participation active au Salaatu, activités spirituelles, événements, application KSN et vie communautaire.",
    "ledahira.card4_title": "Règlement Intérieur",
    "ledahira.card4_text":
      "Discipline, engagement spirituel, organisation et principes officiels du Dahira KSN.",
    "ledahira.card5_title": "Plan d'Actions",
    "ledahira.card5_text":
      "Éducation, Culture, Finances, Sociale, Organisation et développement communautaire.",
    "ledahira.join_title": "Rejoindre la KSN",
    "ledahira.join_text":
      "Devenez membre officiel du Dahira et participez à cette mission spirituelle internationale.",
    "ledahira.join_cta": "Adhérer Maintenant",
  },

  wo: {
    "nav.home": "Daay",
    "nav.dahira": "Dahira ji",
    "nav.spiritualite": "Diiney",
    "nav.media": "Media",
    "nav.boutique": "Boutique",
    "nav.blog": "Blog",
    "nav.contact": "Jokk",

    "cta.donate": "Defal Yónne",
    "cta.join": "Bokk ci Dahira ji",
    "cta.discover": "Xam KSN",
    "cta.member": "Nekk ci Mbokk",
    "cta.read_more": "Jëfandikoo bind bi",
    "cta.send_whatsapp": "Yónne ci WhatsApp",
    "cta.contact_whatsapp": "Jokk ci WhatsApp",
    "cta.follow_us": "Toopal nu",

    "site.tagline": "Site Bi Maam ji",
    "site.motto": "Ñaan • Diiney • Leeral",
    "site.location": "Touba, Senegaal",

    "hero.badge": "Kippaangog Salaatu 'Alaa Nabii",
    "hero.title_line1": "Mbokk mi",
    "hero.title_line2": "tax na ci diiney",
    "hero.title_line3": "ngir Salaatu",
    "hero.title_line4": "ci Yonent bi ﷺ",
    "hero.subtitle":
      "KSN sosu woon na 02 Sanwiyee 2021 ci Touba, ngir tëralu Salaatu ci Yonent bi Muhammad ﷺ ak yax mbokk mu mag te jëm ci àdduna bi.",
    "hero.card_overline": "Yoonu Dahira KSN",
    "hero.card_title": "Yax & Liggéey",
    "hero.card_reglement": "Yoon yi",
    "hero.card_reglement_desc": "Tëralin, jëfandikoo ak liggéey Dahira ji.",
    "hero.card_commissions": "Kër yi Officielles",
    "hero.card_commissions_desc":
      "Njàng, Joxe-Xibaar, Alal, Mbokk, Yax ak Yokkute ci Bitti.",
    "hero.card_membre": "Dund Mbokk mi",
    "hero.card_membre_desc": "Bokk, ñaaani, ak ndimbal mbokk mi.",

    "stats.overline": "Leeralu KSN",
    "stats.title": "Mbokk mu Diiney mu Mag",
    "stats.creation": "KSN sos",
    "stats.social": "Réseaux Sociaux",
    "stats.members": "Mbokki Jëfandikoo",
    "stats.app_users": "Jëfandikookat Applikaasion",
    "stats.international": "Leeral ci Àdduna bi",

    "section.direction_spirituelle": "Doxalin Diiney",
    "section.presidence_title": "Doxalin Dahira ji",
    "section.presidence_desc":
      "Doxalin gu jëm ci Salaatu, suqali diiney ak leeralu KSN ci àdduna bi.",
    "section.organisation_ksn": "Yax KSN",
    "section.commissions_title": "Kër yi Officielles",
    "section.media_ksn": "Media KSN",
    "section.media_title": "Liggéey Dahira & Dundu Mbokk",
    "section.communaute_digitale": "Mbokk Numerik",
    "section.suivez_partout": "Toopal KSN ci kepp",
    "section.contact_officiel": "Jokk Officielle",
    "section.contact_title": "Jokkalal ak nu",
    "section.spiritualite_ksn": "Diiney KSN",
    "section.spiritualite_title": "Sëf Xol bi ci Salaatu ﷺ",

    "footer.navigation": "Doxalin",
    "footer.contact": "Jokk",
    "footer.suivez": "Toopal nu",
    "footer.mission_title": "Misiyon Diiney",
    "footer.mission_quote":
      "Liggéey ngir tëralu Salaatu ci Yonent bi Muhammad ﷺ jaarale ko ci mbokk mu mag, jëfandikoo te ci àdduna bi.",
    "footer.copyright": "Yoonu yi nepp ñu am.",

    "salaatu.overline": "Salaatou bu Tey",
    "salaatu.title": "Salaatu bu ñu Digal",
    "salaatu.benefits": "Njariñ yi",
    "salaatu.benefits_text":
      "Leer ci xol, jegeñentee ak Yonent bi ﷺ, ak barke Yàlla.",
    "salaatu.when": "Kañ lañ koy waxe",
    "salaatu.when_text":
      "Ci kepp, rawatina ginnaaw julli ak Aljuma.",
    "salaatu.reward": "Yool",
    "salaatu.reward_text":
      "Yàlla day julli fukk yoon ci ki julli benn yoon ci Yonent bi ﷺ.",
  },

  en: {
    "nav.home": "Home",
    "nav.dahira": "The Dahira",
    "nav.spiritualite": "Spirituality",
    "nav.media": "Media",
    "nav.boutique": "Boutique",
    "nav.blog": "Blog",
    "nav.contact": "Contact",

    "cta.donate": "Make a Donation",
    "cta.join": "Join the Dahira",
    "cta.discover": "Discover KSN",
    "cta.member": "Become a Member",
    "cta.read_more": "Read the article",
    "cta.send_whatsapp": "Send via WhatsApp",
    "cta.contact_whatsapp": "Contact on WhatsApp",
    "cta.follow_us": "Follow us",

    "site.tagline": "Official International Website",
    "site.motto": "Prayer • Spirituality • Outreach",
    "site.location": "Touba, Senegal",

    "hero.badge": "Kippangog Salaatu 'Alaa Nabii",
    "hero.title_line1": "A modern",
    "hero.title_line2": "spiritual community",
    "hero.title_line3": "at the service of",
    "hero.title_line4": "Salaatu ﷺ",
    "hero.subtitle":
      "Founded on January 2, 2021 in Touba, KSN works to promote prayers upon the Prophet Muhammad ﷺ through a structured organization, spiritual activities, and an engaged international community.",
    "hero.card_overline": "KSN Institutional Life",
    "hero.card_title": "Organization & Operations",
    "hero.card_reglement": "Internal Regulations",
    "hero.card_reglement_desc": "Statutes, discipline, and operation of the Dahira.",
    "hero.card_commissions": "Official Commissions",
    "hero.card_commissions_desc":
      "Education, Communication, Finance, Social, Organization, and External Relations.",
    "hero.card_membre": "Member Life",
    "hero.card_membre_desc":
      "Membership, spiritual participation, and community engagement.",

    "stats.overline": "KSN Outreach",
    "stats.title": "An International Spiritual Community",
    "stats.creation": "KSN Founded",
    "stats.social": "Social Networks",
    "stats.members": "Engaged Members",
    "stats.app_users": "App Users",
    "stats.international": "International Outreach",

    "section.direction_spirituelle": "Spiritual Direction",
    "section.presidence_title": "Dahira Presidency",
    "section.presidence_desc":
      "Leadership dedicated to Salaatu, spiritual development, and KSN's international outreach.",
    "section.organisation_ksn": "KSN Organization",
    "section.commissions_title": "Official Commissions",
    "section.media_ksn": "KSN Media",
    "section.media_title": "Dahira Activities & Community Life",
    "section.communaute_digitale": "Digital Community",
    "section.suivez_partout": "Follow KSN Everywhere",
    "section.contact_officiel": "Official Contact",
    "section.contact_title": "Get in Touch",
    "section.spiritualite_ksn": "KSN Spirituality",
    "section.spiritualite_title": "Nourish the Heart through Salaatu ﷺ",

    "footer.navigation": "Navigation",
    "footer.contact": "Contact",
    "footer.suivez": "Follow Us",
    "footer.mission_title": "Spiritual Mission",
    "footer.mission_quote":
      "Working to promote prayers upon the Prophet Muhammad ﷺ through a modern, engaged, and international spiritual community.",
    "footer.copyright": "All rights reserved.",

    "salaatu.overline": "Salaatu of the Day",
    "salaatu.title": "Recommended Salaatu",
    "salaatu.benefits": "Benefits",
    "salaatu.benefits_text":
      "Light in the heart, closeness to the Prophet ﷺ, and divine blessings.",
    "salaatu.when": "When to recite",
    "salaatu.when_text":
      "Any time, especially after prayers and on Fridays.",
    "salaatu.reward": "Reward",
    "salaatu.reward_text":
      "Allah prays 10 times upon the one who prays once upon the Prophet ﷺ.",

    // Section "Le Dahira"
    "ledahira.overline": "The Dahira",
    "ledahira.title_l1": "A Spiritual Organization",
    "ledahira.title_l2": "Modern & Structured",
    "ledahira.intro":
      "Founded on January 2, 2021 in Touba, Kippangog Salaatu 'Alaa Nabii works to promote Prayer upon the Prophet Muhammad ﷺ, spiritual brotherhood and the international outreach of the Dahira.",
    "ledahira.card1_title": "Our Mission",
    "ledahira.card1_text":
      "To promote love of the Prophet ﷺ through Salaatu, Khassidas, Azkâr and spiritual education.",
    "ledahira.card2_title": "The Dahira Office",
    "ledahira.card2_text":
      "A structured organization with a Presidency, General Secretariat, Finance, Organization and several official commissions.",
    "ledahira.card3_title": "Member Life",
    "ledahira.card3_text":
      "Active participation in Salaatu, spiritual activities, events, the KSN app and community life.",
    "ledahira.card4_title": "Internal Rules",
    "ledahira.card4_text":
      "Discipline, spiritual commitment, organization and the official principles of the KSN Dahira.",
    "ledahira.card5_title": "Action Plan",
    "ledahira.card5_text":
      "Education, Culture, Finance, Social affairs, Organization and community development.",
    "ledahira.join_title": "Join KSN",
    "ledahira.join_text":
      "Become an official member of the Dahira and take part in this international spiritual mission.",
    "ledahira.join_cta": "Join Now",
  },

  it: {
    "nav.home": "Home",
    "nav.dahira": "Il Dahira",
    "nav.spiritualite": "Spiritualità",
    "nav.media": "Media",
    "nav.boutique": "Boutique",
    "nav.blog": "Blog",
    "nav.contact": "Contatti",

    "cta.donate": "Fai una Donazione",
    "cta.join": "Unisciti al Dahira",
    "cta.discover": "Scopri KSN",
    "cta.member": "Diventa Membro",
    "cta.read_more": "Leggi l'articolo",
    "cta.send_whatsapp": "Invia via WhatsApp",
    "cta.contact_whatsapp": "Contatta su WhatsApp",
    "cta.follow_us": "Seguici",

    "site.tagline": "Sito Ufficiale Internazionale",
    "site.motto": "Preghiera • Spiritualità • Irraggiamento",
    "site.location": "Touba, Senegal",

    "hero.badge": "Kippangog Salaatu 'Alaa Nabii",
    "hero.title_line1": "Una comunità",
    "hero.title_line2": "spirituale moderna",
    "hero.title_line3": "al servizio del",
    "hero.title_line4": "Salaatu ﷺ",
    "hero.subtitle":
      "Fondato il 2 gennaio 2021 a Touba, KSN promuove la preghiera sul Profeta Muhammad ﷺ attraverso un'organizzazione strutturata, attività spirituali e una comunità internazionale impegnata.",
    "hero.card_overline": "Vita Istituzionale KSN",
    "hero.card_title": "Organizzazione & Funzionamento",
    "hero.card_reglement": "Regolamento Interno",
    "hero.card_reglement_desc": "Statuti, disciplina e funzionamento del Dahira.",
    "hero.card_commissions": "Commissioni Ufficiali",
    "hero.card_commissions_desc":
      "Educazione, Comunicazione, Finanze, Sociale, Organizzazione e Relazioni Esterne.",
    "hero.card_membre": "Vita del Membro",
    "hero.card_membre_desc":
      "Adesione, partecipazione spirituale e impegno comunitario.",

    "stats.overline": "Irraggiamento KSN",
    "stats.title": "Una Comunità Spirituale Internazionale",
    "stats.creation": "Fondazione KSN",
    "stats.social": "Social Network",
    "stats.members": "Membri Attivi",
    "stats.app_users": "Utenti dell'App",
    "stats.international": "Irraggiamento Internazionale",

    "section.direction_spirituelle": "Direzione Spirituale",
    "section.presidence_title": "Presidenza del Dahira",
    "section.presidence_desc":
      "Una direzione impegnata al servizio del Salaatu, dello sviluppo spirituale e dell'irraggiamento internazionale di KSN.",
    "section.organisation_ksn": "Organizzazione KSN",
    "section.commissions_title": "Commissioni Ufficiali",
    "section.media_ksn": "Media KSN",
    "section.media_title": "Attività del Dahira & Vita Comunitaria",
    "section.communaute_digitale": "Comunità Digitale",
    "section.suivez_partout": "Segui KSN Ovunque",
    "section.contact_officiel": "Contatto Ufficiale",
    "section.contact_title": "Mettiti in Contatto",
    "section.spiritualite_ksn": "Spiritualità KSN",
    "section.spiritualite_title": "Nutrire il Cuore con il Salaatu ﷺ",

    "footer.navigation": "Navigazione",
    "footer.contact": "Contatti",
    "footer.suivez": "Seguici",
    "footer.mission_title": "Missione Spirituale",
    "footer.mission_quote":
      "Lavorare per promuovere la preghiera sul Profeta Muhammad ﷺ attraverso una comunità spirituale moderna, impegnata e internazionale.",
    "footer.copyright": "Tutti i diritti riservati.",

    "salaatu.overline": "Salaatu del Giorno",
    "salaatu.title": "Il Salaatu Consigliato",
    "salaatu.benefits": "Benefici",
    "salaatu.benefits_text":
      "Luce nel cuore, vicinanza al Profeta ﷺ e benedizioni divine.",
    "salaatu.when": "Quando recitarlo",
    "salaatu.when_text":
      "In qualsiasi momento, specialmente dopo le preghiere e il venerdì.",
    "salaatu.reward": "Ricompensa",
    "salaatu.reward_text":
      "Allah prega 10 volte su chi prega una volta sul Profeta ﷺ.",

    // Section "Le Dahira"
    "ledahira.overline": "La Dahira",
    "ledahira.title_l1": "Un'Organizzazione Spirituale",
    "ledahira.title_l2": "Moderna e Strutturata",
    "ledahira.intro":
      "Fondata il 2 gennaio 2021 a Touba, Kippangog Salaatu 'Alaa Nabii promuove la Preghiera sul Profeta Muhammad ﷺ, la fratellanza spirituale e la diffusione internazionale della Dahira.",
    "ledahira.card1_title": "La Nostra Missione",
    "ledahira.card1_text":
      "Promuovere l'amore per il Profeta ﷺ attraverso il Salaatu, le Khassidas, gli Azkâr e l'educazione spirituale.",
    "ledahira.card2_title": "Ufficio della Dahira",
    "ledahira.card2_text":
      "Un'organizzazione strutturata con Presidenza, Segreteria Generale, Finanze, Organizzazione e diverse commissioni ufficiali.",
    "ledahira.card3_title": "Vita del Membro",
    "ledahira.card3_text":
      "Partecipazione attiva al Salaatu, attività spirituali, eventi, app KSN e vita comunitaria.",
    "ledahira.card4_title": "Regolamento Interno",
    "ledahira.card4_text":
      "Disciplina, impegno spirituale, organizzazione e principi ufficiali della Dahira KSN.",
    "ledahira.card5_title": "Piano d'Azione",
    "ledahira.card5_text":
      "Educazione, Cultura, Finanze, Sociale, Organizzazione e sviluppo comunitario.",
    "ledahira.join_title": "Unisciti alla KSN",
    "ledahira.join_text":
      "Diventa membro ufficiale della Dahira e partecipa a questa missione spirituale internazionale.",
    "ledahira.join_cta": "Aderisci Ora",
  },

  es: {
    "nav.home": "Inicio",
    "nav.dahira": "El Dahira",
    "nav.spiritualite": "Espiritualidad",
    "nav.media": "Medios",
    "nav.boutique": "Boutique",
    "nav.blog": "Blog",
    "nav.contact": "Contacto",

    "cta.donate": "Hacer una Donación",
    "cta.join": "Únete al Dahira",
    "cta.discover": "Descubre KSN",
    "cta.member": "Hazte Miembro",
    "cta.read_more": "Leer el artículo",
    "cta.send_whatsapp": "Enviar por WhatsApp",
    "cta.contact_whatsapp": "Contactar por WhatsApp",
    "cta.follow_us": "Síguenos",

    "site.tagline": "Sitio Oficial Internacional",
    "site.motto": "Oración • Espiritualidad • Difusión",
    "site.location": "Touba, Senegal",

    "hero.badge": "Kippangog Salaatu 'Alaa Nabii",
    "hero.title_line1": "Una comunidad",
    "hero.title_line2": "espiritual moderna",
    "hero.title_line3": "al servicio del",
    "hero.title_line4": "Salaatu ﷺ",
    "hero.subtitle":
      "Fundada el 2 de enero de 2021 en Touba, KSN trabaja para promover el rezo sobre el Profeta Muhammad ﷺ a través de una organización estructurada, actividades espirituales y una comunidad internacional comprometida.",
    "hero.card_overline": "Vida Institucional KSN",
    "hero.card_title": "Organización y Funcionamiento",
    "hero.card_reglement": "Reglamento Interno",
    "hero.card_reglement_desc": "Estatutos, disciplina y funcionamiento del Dahira.",
    "hero.card_commissions": "Comisiones Oficiales",
    "hero.card_commissions_desc":
      "Educación, Comunicación, Finanzas, Social, Organización y Relaciones Exteriores.",
    "hero.card_membre": "Vida del Miembro",
    "hero.card_membre_desc":
      "Membresía, participación espiritual y compromiso comunitario.",

    "stats.overline": "Difusión KSN",
    "stats.title": "Una Comunidad Espiritual Internacional",
    "stats.creation": "Creación KSN",
    "stats.social": "Redes Sociales",
    "stats.members": "Miembros Activos",
    "stats.app_users": "Usuarios de la App",
    "stats.international": "Difusión Internacional",

    "section.direction_spirituelle": "Dirección Espiritual",
    "section.presidence_title": "Presidencia del Dahira",
    "section.presidence_desc":
      "Una dirección comprometida al servicio del Salaatu, el desarrollo espiritual y la difusión internacional de KSN.",
    "section.organisation_ksn": "Organización KSN",
    "section.commissions_title": "Comisiones Oficiales",
    "section.media_ksn": "Medios KSN",
    "section.media_title": "Actividades del Dahira y Vida Comunitaria",
    "section.communaute_digitale": "Comunidad Digital",
    "section.suivez_partout": "Sigue a KSN en todas partes",
    "section.contact_officiel": "Contacto Oficial",
    "section.contact_title": "Ponte en Contacto",
    "section.spiritualite_ksn": "Espiritualidad KSN",
    "section.spiritualite_title": "Nutrir el Corazón con el Salaatu ﷺ",

    "footer.navigation": "Navegación",
    "footer.contact": "Contacto",
    "footer.suivez": "Síguenos",
    "footer.mission_title": "Misión Espiritual",
    "footer.mission_quote":
      "Trabajar para promover el rezo sobre el Profeta Muhammad ﷺ a través de una comunidad espiritual moderna, comprometida e internacional.",
    "footer.copyright": "Todos los derechos reservados.",

    "salaatu.overline": "Salaatu del Día",
    "salaatu.title": "El Salaatu Recomendado",
    "salaatu.benefits": "Beneficios",
    "salaatu.benefits_text":
      "Luz en el corazón, cercanía al Profeta ﷺ y bendiciones divinas.",
    "salaatu.when": "Cuándo recitarlo",
    "salaatu.when_text":
      "En cualquier momento, especialmente después de las oraciones y los viernes.",
    "salaatu.reward": "Recompensa",
    "salaatu.reward_text":
      "Allah reza 10 veces sobre quien reza una vez sobre el Profeta ﷺ.",

    // Section "Le Dahira"
    "ledahira.overline": "La Dahira",
    "ledahira.title_l1": "Una Organización Espiritual",
    "ledahira.title_l2": "Moderna y Estructurada",
    "ledahira.intro":
      "Fundada el 2 de enero de 2021 en Tuba, Kippangog Salaatu 'Alaa Nabii promueve la Oración sobre el Profeta Muhammad ﷺ, la fraternidad espiritual y la proyección internacional de la Dahira.",
    "ledahira.card1_title": "Nuestra Misión",
    "ledahira.card1_text":
      "Promover el amor al Profeta ﷺ a través del Salaatu, las Khassidas, los Azkâr y la educación espiritual.",
    "ledahira.card2_title": "Oficina de la Dahira",
    "ledahira.card2_text":
      "Una organización estructurada con Presidencia, Secretaría General, Finanzas, Organización y varias comisiones oficiales.",
    "ledahira.card3_title": "Vida del Miembro",
    "ledahira.card3_text":
      "Participación activa en el Salaatu, actividades espirituales, eventos, la app KSN y la vida comunitaria.",
    "ledahira.card4_title": "Reglamento Interno",
    "ledahira.card4_text":
      "Disciplina, compromiso espiritual, organización y principios oficiales de la Dahira KSN.",
    "ledahira.card5_title": "Plan de Acción",
    "ledahira.card5_text":
      "Educación, Cultura, Finanzas, Social, Organización y desarrollo comunitario.",
    "ledahira.join_title": "Únete a la KSN",
    "ledahira.join_text":
      "Hazte miembro oficial de la Dahira y participa en esta misión espiritual internacional.",
    "ledahira.join_cta": "Adherirse Ahora",
  },

  ar: {
    "nav.home": "الرئيسية",
    "nav.dahira": "الدائرة",
    "nav.spiritualite": "الروحانية",
    "nav.media": "الإعلام",
    "nav.boutique": "المتجر",
    "nav.blog": "المدونة",
    "nav.contact": "اتصل بنا",

    "cta.donate": "تبرّع",
    "cta.join": "انضم إلى الدائرة",
    "cta.discover": "اكتشف KSN",
    "cta.member": "أصبح عضواً",
    "cta.read_more": "اقرأ المقال",
    "cta.send_whatsapp": "أرسل عبر واتساب",
    "cta.contact_whatsapp": "تواصل عبر واتساب",
    "cta.follow_us": "تابعنا",

    "site.tagline": "الموقع الرسمي الدولي",
    "site.motto": "صلاة • روحانية • إشعاع",
    "site.location": "توبا، السنغال",

    "hero.badge": "كيبانغوغ صلاة على النبي",
    "hero.title_line1": "مجتمع روحاني",
    "hero.title_line2": "حديث في خدمة",
    "hero.title_line3": "الصلاة على",
    "hero.title_line4": "النبي ﷺ",
    "hero.subtitle":
      "تأسست في 2 يناير 2021 بتوبا، تعمل KSN على تعزيز الصلاة على النبي محمد ﷺ من خلال تنظيم محكم، وأنشطة روحانية، ومجتمع دولي ملتزم.",
    "hero.card_overline": "الحياة المؤسسية KSN",
    "hero.card_title": "التنظيم والعمل",
    "hero.card_reglement": "النظام الداخلي",
    "hero.card_reglement_desc": "النظام الأساسي، الانضباط وعمل الدائرة.",
    "hero.card_commissions": "اللجان الرسمية",
    "hero.card_commissions_desc":
      "التعليم، الاتصال، المالية، الاجتماعية، التنظيم والعلاقات الخارجية.",
    "hero.card_membre": "حياة العضو",
    "hero.card_membre_desc":
      "الانخراط، المشاركة الروحية والالتزام المجتمعي.",

    "stats.overline": "إشعاع KSN",
    "stats.title": "مجتمع روحاني دولي",
    "stats.creation": "تأسيس KSN",
    "stats.social": "الشبكات الاجتماعية",
    "stats.members": "أعضاء فعالون",
    "stats.app_users": "مستخدمو التطبيق",
    "stats.international": "إشعاع دولي",

    "section.direction_spirituelle": "القيادة الروحية",
    "section.presidence_title": "رئاسة الدائرة",
    "section.presidence_desc":
      "قيادة ملتزمة في خدمة الصلاة، التنمية الروحية والإشعاع الدولي لـ KSN.",
    "section.organisation_ksn": "تنظيم KSN",
    "section.commissions_title": "اللجان الرسمية",
    "section.media_ksn": "إعلام KSN",
    "section.media_title": "أنشطة الدائرة والحياة المجتمعية",
    "section.communaute_digitale": "المجتمع الرقمي",
    "section.suivez_partout": "تابع KSN في كل مكان",
    "section.contact_officiel": "اتصال رسمي",
    "section.contact_title": "تواصل معنا",
    "section.spiritualite_ksn": "روحانية KSN",
    "section.spiritualite_title": "غذاء القلب بالصلاة على النبي ﷺ",

    "footer.navigation": "التنقل",
    "footer.contact": "اتصل بنا",
    "footer.suivez": "تابعنا",
    "footer.mission_title": "المهمة الروحية",
    "footer.mission_quote":
      "العمل على تعزيز الصلاة على النبي محمد ﷺ من خلال مجتمع روحاني حديث، ملتزم ودولي.",
    "footer.copyright": "جميع الحقوق محفوظة.",

    "salaatu.overline": "صلاة اليوم",
    "salaatu.title": "الصلاة الموصى بها",
    "salaatu.benefits": "الفوائد",
    "salaatu.benefits_text":
      "نور في القلب، قرب من النبي ﷺ، وبركات إلهية.",
    "salaatu.when": "متى تقرأ",
    "salaatu.when_text":
      "في أي وقت، خاصة بعد الصلوات ويوم الجمعة.",
    "salaatu.reward": "المكافأة",
    "salaatu.reward_text":
      "الله يصلي عشر صلوات على من صلى عليه مرة واحدة.",

    // Section "Le Dahira"
    "ledahira.overline": "الداهيرا",
    "ledahira.title_l1": "منظمة روحية",
    "ledahira.title_l2": "حديثة ومنظَّمة",
    "ledahira.intro":
      "تأسست في 2 يناير 2021 بمدينة طوبى، وتعمل كيبانغوغ صلاة على النبي على نشر الصلاة على النبي محمد ﷺ، والأخوّة الروحية، وإشعاع الداهيرا في العالم.",
    "ledahira.card1_title": "رسالتنا",
    "ledahira.card1_text":
      "نشر محبة النبي ﷺ من خلال الصلاة عليه والقصائد والأذكار والتربية الروحية.",
    "ledahira.card2_title": "مكتب الداهيرا",
    "ledahira.card2_text":
      "تنظيم منظَّم يضم الرئاسة والأمانة العامة والمالية والتنظيم وعدة لجان رسمية.",
    "ledahira.card3_title": "حياة العضو",
    "ledahira.card3_text":
      "المشاركة الفعّالة في الصلاة على النبي والأنشطة الروحية والفعاليات وتطبيق KSN والحياة المجتمعية.",
    "ledahira.card4_title": "النظام الداخلي",
    "ledahira.card4_text":
      "الانضباط والالتزام الروحي والتنظيم والمبادئ الرسمية لداهيرا KSN.",
    "ledahira.card5_title": "خطة العمل",
    "ledahira.card5_text":
      "التعليم والثقافة والمالية والشؤون الاجتماعية والتنظيم والتنمية المجتمعية.",
    "ledahira.join_title": "انضم إلى KSN",
    "ledahira.join_text":
      "كن عضوًا رسميًا في الداهيرا وشارك في هذه الرسالة الروحية الدولية.",
    "ledahira.join_cta": "انضم الآن",
  },
};

export function translate(locale: Locale, key: string): string {
  return (
    TRANSLATIONS[locale]?.[key] ??
    TRANSLATIONS.fr[key] ??
    key
  );
}
