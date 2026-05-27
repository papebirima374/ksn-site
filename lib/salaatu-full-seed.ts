import { SalaatuLibraryItem } from "./admin-types";

// Bibliothèque complète des Salaats issue du document KSN.
// Textes arabes et transliterations sont du domaine public (textes religieux
// traditionnels). Les notes d'usage sont des résumés courts — l'admin peut
// affiner chaque entrée depuis /admin/bibliotheque/[id].
//
// Utilisée par le bouton « Importer la bibliothèque complète » dans
// /admin/bibliotheque. Une fois importée, l'auto-rotation parcourt
// automatiquement tous les Salaats jour après jour.

export const SALAATU_FULL_SEED: Omit<SalaatuLibraryItem, "id" | "createdAt">[] = [
  {
    title: "Salaatu Ibrahimiyya",
    category: "Salaatu Ibrahimiyya",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَ عَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَ عَلَى آلِ إِبْرَاهِيمَ وَ بَارِكْ عَلَى مُحَمَّدٍ وَ عَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَ عَلَى آلِ إِبْرَاهِيمَ فِي ٱلْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration:
      "Allahoumma çalli ala saïdina Mohammad, wa aala ali saïdina Mohammad, kama çallayta aala saïdina Ibrahim wa aala âli saïdina Ibrahim, wa barik aala saïdina Mohammad, wa aala âli saïdina Mohammad, kama barakta aala saïdina Ibrahim, wa aala âli saïdina Ibrahim, fi al aalamine, innaka hamidoune majid",
    translation:
      "Ô Allah, prie sur Muhammad et sur la famille de Muhammad comme Tu as prié sur Ibrahim et la famille d'Ibrahim, et bénis Muhammad et la famille de Muhammad comme Tu as béni Ibrahim et la famille d'Ibrahim parmi les mondes. Tu es certes Digne de louange, Glorieux.",
    benefits: [
      "Ouvre les cieux, satisfait les besoins et résout les difficultés",
      "Se pratique le vendredi, après chaque prière, zikr 100 fois",
      "Après la prière de ʿIshaa, formule des vœux",
    ],
    usageNotes: [
      "Zikr 100 fois après ʿishaa puis formuler ses vœux.",
      "Écrire en nassi et boire (femme enceinte) — protection pour les enfants à naître.",
      "Écrire 41 fois en nassi, zikr 41 fois × 41 jours — éloigne la pauvreté.",
      "Récite 7 fois au lever du soleil — argent de poche au cours de la journée.",
      "Écris 17 fois en nassi — pour l'élévation, la chance, le succès.",
    ],
    order: 1,
  },
  {
    title: "Salaatu Tibiya",
    category: "Guérison",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ طِبِّ الْقُلُوبِ وَدَوَائِهَا وَعَافِيَةِ الْأَبْدَانِ وَشِفَائِهَا وَنُورِ الْأَبْصَارِ وَضِيَائِهَا وَقُوتِ الْأَرْوَاحِ وَغِذَائِهَا وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ",
    transliteration:
      "Allahumma salli ʿala Sayyidina Muhammadine tibbi l-qulubi wa dawa'iha, wa ʿafiyati l-abdani wa shifa'iha, wa nuri l-absari wa diya'iha, wa quti l-arwahi wa ghidha'iha, wa ʿala alihi wa sahbihi wa sallim.",
    translation:
      "Ô Allah, prie sur notre maître Muhammad, remède des cœurs et leur cure, santé des corps et leur guérison, lumière des regards et leur clarté, nourriture des âmes et leur subsistance, ainsi que sur sa famille et ses compagnons.",
    benefits: [
      "Guérison de toutes les maladies physiques et spirituelles",
      "Apporte paix et entente dans la maison",
      "Apporte chance, réussite et désenvoûte",
    ],
    usageNotes: [
      "Récite 500 à 1000 fois sur miel ou eau, frotter et boire — guérison.",
      "Écris 7 fois en nassi, prendre 7 ablutions chaud — soigne grippe et rhume.",
      "Main sur le ventre, récite 14 fois — apaise la faim.",
      "Récite 70 fois sur eau, faire boire à la famille — paix et entente.",
      "Zikr 700 fois — protection contre ce qu'on craint.",
      "Écris 111 fois, frotter — chance et désenvoûtement.",
    ],
    order: 2,
  },
  {
    title: "Salaatu Rida",
    category: "Subsistance",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ صَلَاةَ الرِّضَا وَارْضَ عَنْ أَصْحَابِهِ رِضَاءَ الرِّضَا",
    transliteration:
      "Allahoumma salli ala Sayyidina Muhammadine Salatal rida wa irda ane ashabihi ridaal rida.",
    translation:
      "Ô Allah, prie sur notre maître Muhammad d'une prière d'agrément, et agrée ses compagnons d'un agrément total.",
    benefits: [
      "Obtention des biens matériels, richesse, chance, ouverture",
      "Indépendance financière",
      "Résout les situations difficiles",
    ],
    usageNotes: [
      "Écris 17 fois en nassi, met 17 pièces de 5 F, zikr 1717 fois × 17 nuits — richesse.",
      "Écris 333 fois en nassi, zikr 1111 fois × 30 nuits — indépendance financière.",
      "2 rakats + zikr 313 fois après chaque prière obligatoire + 1111 fois la nuit — résultat le lendemain.",
      "Zikr 70 fois chaque matin — subsistance et production.",
      "111 fois après ʿishaa quotidien — éloigne la pauvreté.",
    ],
    order: 3,
  },
  {
    title: "Salaatu Kachifa",
    category: "Protection",
    arabic: "اللَّهُمَّ صَلِّ عَلَى كَاشِفِ الْغُمَّةِ",
    transliteration: "Allahoumma salli ala Kachifoul Goumat.",
    translation: "Ô Allah, prie sur Celui qui dissipe les peines (le Prophète ﷺ).",
    benefits: [
      "Résout les problèmes inexplicables ou difficiles",
      "Apporte santé, exaucement et soulagement",
      "Guérit tous les maux physiques",
    ],
    usageNotes: [
      "2 rakats + zikr Ya Kachifou 1111 fois + cette salaat 700 fois — résolution.",
      "Zikr 70 fois chaque matin — exaucement et soulagement.",
      "14 fois après chaque prière obligatoire — santé de fer.",
      "Écris 77 fois en nassi, frotter et boire — fatigue, fièvre, paludisme, vertige.",
      "777 fois chaque jour — rentrées d'argent.",
    ],
    order: 4,
  },
  {
    title: "Salaatu Nariya (Kamila / Tafrijiyya)",
    category: "Protection",
    arabic:
      "اللَّهُمَّ صَلِّ صَلَاةً كَامِلَةً وَ سَلِّمْ سَلَامًا تَامًّا عَلَى سَيِّدِنَا مُحَمَّدٍ ٱلَّذِي تَنْحَلُّ بِهِ ٱلْعُقَدُ وَ تَنْفَرِجُ بِهِ ٱلْكُرَبُ وَ تُقْضَى بِهِ ٱلْحَوَائِجُ وَ تُنَالُ بِهِ ٱلرَّغَائِبُ وَ حُسْنُ ٱلْخَوَاتِمِ وَ يُسْتَسْقَى ٱلْغَمَامُ بِوَجْهِهِ ٱلْكَرِيمِ وَ عَلَى آلِهِ وَ صَحْبِهِ فِي كُلِّ لَمْحَةٍ وَ نَفَسٍ بِعَدَدِ كُلِّ مَعْلُومٍ لَكَ",
    transliteration:
      "Allahumma salli salaatan kaamilatan wasallim salaaman taamman ʿala sayyidina muhammadin alladhi tanhil bihi il uqʿad, watatafarrij bih il karb, wataqdhi bih il hawa'ij, wa tanaal bih ir raghaa'ib, wa hasan al khawaatim, wa yastasq il ghamaam bi wajhih il kareem wa ʿala 'aalihi wa sahbihi fi kulli lamhatin wa nafassan bi-adadi kulli ma-loumin lak.",
    translation:
      "Ô Allah, prie d'une prière parfaite et donne un salut complet sur notre maître Muhammad, par qui les nœuds se défont, les angoisses se dissipent, les besoins sont satisfaits, les aspirations sont atteintes et la belle fin obtenue, et par qui les nuages déversent leur pluie, ainsi que sur sa famille et ses compagnons à chaque clin d'œil et souffle, autant que Tu en sais.",
    benefits: [
      "Dénoue les nœuds et soulage toute épreuve",
      "Procure subsistance, succès et haute valeur",
      "Dévoile les secrets cachés et facilite la pluie",
    ],
    usageNotes: [
      "100 fois par jour — Allah soulage soucis, élargit le rizq et exauce les demandes.",
      "11 fois après chaque prière comme wird — subsistance constante.",
      "41 fois après le fadjr — ce que l'on désire arrive aussitôt.",
      "313 fois — Allah dévoile les secrets cachés.",
      "1000 fois par jour — récompense que nul ne peut décrire.",
      "4444 fois — résoudre n'importe quel problème majeur.",
      "Écris 4 fois + 440 fois son talsam, laver à l'eau de mer — désenvoûte, emploi, mariage.",
      "7 fois son talsam comme talisman — protection démons et sorciers.",
    ],
    order: 5,
  },
  {
    title: "Salaatu Fatihi",
    category: "Quotidien",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بِالْحَقِّ وَالْهَادِي إِلَى صِرَاطِكَ الْمُسْتَقِيمِ وَعَلَى آلِهِ حَقَّ قَدْرِهِ وَمِقْدَارِهِ الْعَظِيمِ",
    transliteration:
      "Allahoumma salli ala sayyidina Mouhammadin al fatihi lima oughlikha wal khatimi lima sabaq nasiril haqqi bil haqqi wal hadi ila siratikal moustakhim wa ala alihi haqqa qadrihi wa miqdari hil aazim.",
    translation:
      "Ô Allah, prie sur notre maître Muhammad, l'Ouvreur de ce qui était fermé, le Sceau de ce qui a précédé, le Défenseur de la vérité par la vérité, le Guide vers Ton droit chemin, et sur sa famille selon sa vraie valeur et son rang immense.",
    benefits: [
      "Selon Cheick Hamed Tijane : qui la répète souvent ne verra jamais l'enfer",
      "Ouverture, chance, célébrité, bonheur",
      "Exaucement et résolution des problèmes en 7 jours",
      "Mémoire, connaissance et compréhension",
    ],
    usageNotes: [
      "3 fois après chaque prière — fortement recommandé.",
      "21 fois après le fadjr — ouverture, bonheur, subsistance, protection.",
      "1111 fois — règle n'importe quel problème.",
      "1953 fois un lundi après ʿishaa — résolution d'un problème ou satisfaction d'un besoin.",
      "100 fois par jour pendant 40 jours — pour les dettes ou un souci.",
      "Lire 100 fois chaque soir après 2 rakats (Al-Qadr + An-Nasr) — voir les merveilles d'Allah.",
      "489 fois × 19 nuits — ouverture, chance, célébrité.",
      "92 fois en nassi, zikr 92 fois après chaque prière × 2 semaines — corriger une voie perdue, voir le Prophète ﷺ en rêve.",
    ],
    order: 6,
  },
  {
    title: "Salaatu Tariss",
    category: "Famille",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ حَتَّى تَرِثَ الأَرْضَ وَمَنْ عَلَيْهَا وَأَنْتَ خَيْرُ الْوَارِثِينَ",
    transliteration:
      "Allahoumma salli ala Sayyidina wa Mawlana Muhammadine Hata Tarissal arda wamane aleyiha wa anta kayroul warissine.",
    translation:
      "Ô Allah, prie sur notre maître et seigneur Muhammad jusqu'à ce que Tu hérites de la terre et de ce qui s'y trouve — Tu es le Meilleur des héritiers.",
    benefits: [
      "Pour avoir un enfant pieux",
      "Acquisition des biens matériels, tranquillité",
      "Longue vie, protection totale, emploi",
    ],
    usageNotes: [
      "Écris fatiha 36 fois + cette salaat 100 fois en nassi, préparer avec coq/poule blanc, manger — pour avoir un enfant.",
      "Zikr 66 fois chaque jour + sacrifice 3 kg de riz le lundi — biens matériels.",
      "11 fois après chaque prière obligatoire — longue vie et protection.",
      "Écris 313 fois en nassi, préparer avec coq noir, talisman + zikr 313 fois × 13 jours — emploi.",
      "Zikr 92 fois avant de dormir + 92 fois au réveil + 92 fois après le fadjr — assistance divine.",
    ],
    order: 7,
  },
  {
    title: "Salaatu Rouhou Muhammad",
    category: "Autres",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى رُوحِ مُحَمَّدٍ فِي ٱلْأَرْوَاحِ وَعَلَى جَسَدِهِ فِي ٱلْأَجْسَادِ وَعَلَى قَبْرِهِ فِي ٱلْقُبُورِ",
    transliteration:
      "Allahoumma salli ala Rouhi Muhammadine Fi Arwahi wa ala djassadihi fi adj-sadi wa ala qabrihi fil qoubouri.",
    translation:
      "Ô Allah, prie sur l'âme de Muhammad parmi les âmes, sur son corps parmi les corps, et sur sa tombe parmi les tombes.",
    benefits: [
      "Pouvoirs spirituels exceptionnels (koun fayakoun)",
      "Voir le Prophète ﷺ en rêve",
      "Lumière du cœur, sainteté, bon comportement",
    ],
    usageNotes: [
      "Écris 33 Ya Allah + 33 fois la salaat en nassi, ablution + Kaloua 3 jours — vision spirituelle.",
      "Zikr 8464 fois la nuit du vendredi (après 3 mois d'obéissance) — voir le Prophète ﷺ.",
      "Écris 70 fois en nassi, frotter la tête + zikr 70 fois × 21 nuits — voir le Prophète en rêve.",
    ],
    order: 8,
  },
  {
    title: "Salaatu Maw-Soufi",
    category: "Subsistance",
    arabic: "اللَّهُمَّ صَلِّ عَلَى الْمَوْصُوفِ بِالْكَرَمِ وَالْجُودِ",
    transliteration: "Allahoumma salli ala Maw-soufi bil karami wal djoud.",
    translation:
      "Ô Allah, prie sur Celui qui est décrit par la générosité et la magnanimité (le Prophète ﷺ).",
    benefits: [
      "Respect, amour et renommée",
      "Subsistance quotidienne, fin des dettes",
      "Richesse, ouverture, pouvoir au travail, mariage, emploi",
    ],
    usageNotes: [
      "Écris 70 fois en nassi, sable de fourmilière, frotter chaque matin + zikr 70 fois — respect et renommée.",
      "Au réveil, zikr 313 fois cette salaat + 3 fois Al-Ikhlas avant le fadjr — argent dans la journée.",
      "Écris 312 fois, à la 313e ouvre le MIM, met l'intention + zikr 313 fois — ne plus manquer d'argent.",
      "Zikr 932 fois (azim) ou 2796 fois (urgent) après le fadjr — exaucement koun fayakoun.",
      "Écris 872 fois × 2 semaines puis × 2 mois — richesse.",
      "Bismillah 111× + salaat 114× + Soubhana Rabbi al-azim 313× après le fadjr — fin des dettes (1 semaine).",
      "Zikr 70 fois + 313 dattes (une fois par datte) à partager aux enfants — éloigne un malheur.",
    ],
    order: 9,
  },
  {
    title: "Salaatu Kafihi",
    category: "Subsistance",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مَنْ سَبَّحَ فِي كَفِّهِ الطَّعَامُ",
    transliteration: "Allahoumma salli ala mane sabaha fi kafihi Taham.",
    translation:
      "Ô Allah, prie sur Celui dont la nourriture glorifiait Allah dans sa paume (le Prophète ﷺ).",
    benefits: [
      "Nourrir sa famille sans difficulté",
      "Protection contre l'empoisonnement",
      "Ouverture, chance et célébrité",
    ],
    usageNotes: [
      "Récite 313 fois + zikr KAFI 111 fois + voeux après le fadjr — gain de cause rapide.",
      "Écris 7 fois en nassi, peau de citron carbonisée, rincer 7 jours — protection empoisonnement à vie.",
      "Écris 7 fois sur papier, talisman dans le sac de riz/mil + zikr 77 fois chaque matin — abondance.",
      "Écris 111 fois en nassi, frotter — ouverture, chance, célébrité.",
      "Galette × 7 nuits avec récitation 7 fois — enfants qui se rassasient.",
    ],
    order: 10,
  },
  {
    title: "Salaatu Itissali",
    category: "Élévation & Succès",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ الطَّيِّبِينَ الْكِرَامِ صَلَاةً مَوْصُولَةً دَائِمَةَ الِاتِّصَالِ بِدَوَامِ ذِي الْجَلَالِ وَالْإِكْرَامِ",
    transliteration:
      "Allahoumma salli ala sayyidina Muhammad wa ala alihi taybina kiram salatane mawsoulatane daymatal itissali bidawami zil djalal wal ikram.",
    translation:
      "Ô Allah, prie sur notre maître Muhammad et sur sa famille noble d'une prière continue et permanente, autant que dure la Majesté et la Générosité.",
    benefits: [
      "Élévation, chance, gloire d'Allah",
    ],
    usageNotes: [
      "Cette salaat 313 fois + Ya Zal Djalal wal Ikram 1100 fois + voeux 3 fois, chaque matin.",
    ],
    order: 11,
  },
  {
    title: "Salaatu Moudjizat",
    category: "Autres",
    arabic: "اللَّهُمَّ صَلِّ عَلَى صَاحِبِ الْمُعْجِزَاتِ",
    transliteration: "Allahoumma salli ala Sahibil Moudjizat.",
    translation: "Ô Allah, prie sur le Possesseur des miracles (le Prophète ﷺ).",
    benefits: [
      "Don d'opérer des miracles",
      "Baraka dans les affaires, succès",
      "Protection face à tout danger",
    ],
    usageNotes: [
      "Kaloua 7 jours, 36 432 fois/jour, puis 552 fois matin/soir — miracles par la main.",
      "92 fois après chaque prière + 92 fois avant de dormir — protection face à tout danger.",
      "66 fois matin et soir — baraka dans toutes les affaires.",
      "20 fois après chaque prière (marabouts) — éviter l'échec.",
    ],
    order: 12,
  },
  {
    title: "Salaatu Dari",
    category: "Subsistance",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى مَنْ بِالصَّلَاةِ عَلَيْهِ نَتَنَعَّمُ فِي هَذِهِ الدَّارِ وَفِي تِلْكَ الدَّارِ",
    transliteration:
      "Allahoumma salli ala mane bi Sallati aleyhi Natana-amou fi hazi Dari wa fi tilka Dari.",
    translation:
      "Ô Allah, prie sur Celui par la salaat sur qui nous jouissons de ce monde et de l'autre.",
    benefits: [
      "Argent quotidien, ouverture, exaucement",
      "Réussite dans les entreprises",
      "Bonheur des deux mondes",
    ],
    usageNotes: [
      "313 fois après fadjr + Sourate Al-Ikhlas 111 fois — pas manquer d'argent.",
      "700 fois sur miel, laper au malade — la maladie ne tuera pas.",
      "Écris 56 fois + 7 feuilles de Doubalén et Seretoro + zafarane + zikr 70 fois × 3 semaines — emploi.",
      "20 fois après chaque prière OU 100 fois chaque matin + 20 dattes le vendredi — bonheur des deux mondes.",
      "Écris 41 fois + sourate Az-Zalzala 41 fois + Khassounakaf 41 fois — protection et richesse.",
    ],
    order: 13,
  },
  {
    title: "Salaatu Qassassat",
    category: "Subsistance",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ عَدَدَ مَا خَصَّصَتْهُ إِرَادَتُكَ",
    transliteration:
      "Allahoumma salli ala sayyidina wa mawlana Muhammadine adadama qassassat-hou iradatouk.",
    translation:
      "Ô Allah, prie sur notre maître Muhammad selon le nombre de tout ce que Ta volonté a déterminé.",
    benefits: [
      "Richesse, indépendance",
      "Connaissance et mémoire",
      "Pouvoir sur les autres",
    ],
    usageNotes: [
      "Écris 313 fois + foie de mouton blanc en 7 morceaux + zikr 313 fois la nuit — richesse.",
      "Zikr 102 ou 306 fois chaque matin après le fadjr — subsistance facile.",
      "Au moins 70 fois après chaque prière — somme considérable.",
      "Écris 77 fois en nassi, préparer avec Pigeon + zikr 77 fois après le fadjr — réussir sans échouer.",
      "Écris 18 fois en nassi + lait de vache pendant 18 jours — connaissance et mémoire.",
    ],
    order: 14,
  },
  {
    title: "Salaatu Sahiboul Hadjati",
    category: "Autres",
    arabic: "اللَّهُمَّ صَلِّ عَلَى صَاحِبِ الْحُجَّةِ",
    transliteration: "Allahoumma salli ala Sahibil Houdjati.",
    translation: "Ô Allah, prie sur le Possesseur de la preuve (le Prophète ﷺ).",
    benefits: [
      "Exaucement des besoins, résolution des problèmes",
      "Emploi, mariage, ouverture",
      "Gain de cause quotidien",
    ],
    usageNotes: [
      "Zikr 70 fois après chaque prière — exaucement.",
      "Écris 100 fois en nassi + zikr 1000 fois × 10 jours — emploi/mariage.",
      "Écris 77 fois en nassi avant fadjr, frotter, boire + zikr 77 fois — argent dans la journée.",
      "2 rakats (fatiha + ayat Koursi 33× / fatiha + Alam Nachra 33×) + voeux + Astaghfiroullah 1947× + cette salaat 666× — exaucement.",
    ],
    order: 15,
  },
  {
    title: "Salaatu Yaraha",
    category: "Autres",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مَنْ كَانَ يَرَى مَنْ خَلْفَهُ كَمَا يَرَى مَنْ أَمَامَهُ",
    transliteration:
      "Allahoumma salli ala mane qaina Yaraha mane qalfahou qama yaraha mane amamahou.",
    translation:
      "Ô Allah, prie sur Celui qui voyait derrière lui comme il voyait devant lui.",
    benefits: [
      "Don de vision, connaître les choses cachées",
      "Voir clair dans les complots",
      "Istikhara claire",
    ],
    usageNotes: [
      "Écris 70 fois en nassi, laver le visage + zikr 700 fois × 2 mois 10 jours — vision claire.",
      "100 fois chaque nuit — Allah révèle les complots organisés contre vous.",
      "1000 fois — istikhara : Allah montre la meilleure voie.",
      "14 fois après chaque prière — comprendre le cœur des gens.",
      "Écris 7 fois sur turban blanc + zikr 77 fois la nuit — révélation des grands secrets.",
    ],
    order: 16,
  },
  {
    title: "Salaatou Al-Shaka",
    category: "Subsistance",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مَنْ شَكَا إِلَيْهِ الْبَعِيرُ",
    transliteration: "Allahoumma sorli ala mane shaka ileyhil ba-ir.",
    translation:
      "Ô Allah, prie sur Celui auquel le chameau s'est plaint (le Prophète ﷺ, allusion au chameau de Khaybar).",
    benefits: [
      "Argent pour les besoins du jour, ouverture",
      "Faire accepter son opinion par tous",
      "Dissipation du mal, guérison de la fatigue",
    ],
    usageNotes: [
      "7 fois cette salaat + 7 fois verset 'Rabbana iftah baynana...' + 7 fois la salaat — gain de cause.",
      "1000 fois après le fadjr OU 200×fadjr + 300×Asr — argent de viande.",
      "Écris 305 fois + nom de la personne et de sa mère + fil rouge/noir + zikr 1817 fois — dompter quelqu'un.",
      "111 fois × 7 jours après chaque prière — dissiper le mal.",
      "Écris 77 fois + poil de queue de chameau carbonisé — guérir fatigue.",
    ],
    order: 17,
  },
  {
    title: "Salaatu Khouraani",
    category: "Quotidien",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَآلِهِ وَصَحْبِهِ بِعَدَدِ مَا فِي جَمِيعِ الْقُرْآنِ حَرْفًا حَرْفًا وَبِعَدَدِ كُلِّ حَرْفٍ أَلْفًا أَلْفًا",
    transliteration:
      "Allahoumma sorli ala Sayyidina Muhammadine wa ala Alihi wa Sahbihi bi adadi mafi jami-il qurani harfan harfan wa bi adadi qouli harfin alfan alfan.",
    translation:
      "Ô Allah, prie et salue notre maître Muhammad, sa famille et ses compagnons selon le nombre de chaque lettre du Coran, et que chaque lettre lui porte des milliers de bénédictions.",
    benefits: [
      "Équivaut à une lecture du Coran (selon certains savants)",
      "Mémoire et maîtrise des langues",
      "Guérison des maladies à diagnostic indéterminé",
    ],
    usageNotes: [
      "À réciter au moins 3 fois après la lecture du Coran.",
      "Écris 100 fois + racines de Ngoni dans un canari pendant 1 jour, boire 7 jours — Hafiz al-Qur'an.",
      "Écris 77 fois + Aladjon bouilli pour boire et fumigation — guérison.",
    ],
    order: 18,
  },
  {
    title: "Salaatu Tashir",
    category: "Élévation & Succès",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَآلِهِ صَلَاةً تَسَخَّرُ لِي بِهَا كُلُّ شَيْءٍ يَا مَنْ بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ",
    transliteration:
      "Allahoumma salli ala mouhammad wa alihi salatane tashirli biha koulli cheya ya Man biyedihi malakoutta koulli chey.",
    translation:
      "Ô Allah, prie sur Muhammad et sa famille d'une prière par laquelle Tu me soumets toute chose, ô Toi dans la main de qui se trouve la royauté de toute chose.",
    benefits: [
      "Faciliter les démarches",
      "Plaire aux autorités",
      "Être aimé par tous, même les animaux",
    ],
    usageNotes: [
      "489 fois la nuit — faciliter une démarche.",
      "70 fois avant de rencontrer une autorité.",
      "12 000 fois — libérer un prisonnier.",
      "10 fois après chaque prière obligatoire — être aimé par tous.",
    ],
    order: 19,
  },
  {
    title: "Salaatu Zakaroun",
    category: "Élévation & Succès",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ عَدَدَ مَا ذَكَرَهُ الذَّاكِرُونَ",
    transliteration:
      "Allahouma salli ala seydina wa mawlana mouhammad aadada maa zakarahhouz zaakiroun.",
    translation:
      "Ô Allah, prie sur notre maître Muhammad selon le nombre de fois où les invocateurs L'ont mentionné.",
    benefits: [
      "Succès dans les affaires, charisme, célébrité",
      "Réussite commerciale",
      "Baraka du Prophète dans toutes les démarches",
    ],
    usageNotes: [
      "Écris 13 fois sur une feuille + prénom + prénom de la mère, enterrer au seuil + réciter 313 fois — succès et célébrité.",
    ],
    order: 20,
  },
  {
    title: "Salaatu Ghoudouwwi",
    category: "Quotidien",
    arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ بِالْغُدُوِّ وَالْآصَالِ",
    transliteration:
      "Allahouma salli ala seydina wa mawlana mouhammad bil ghoudouwwi wal asaal.",
    translation:
      "Ô Allah, prie sur notre maître Muhammad matin et soir.",
    benefits: ["Vaincre ses ennemis, déjouer leurs complots"],
    usageNotes: ["313 fois chaque nuit après minuit — déjouer les complots."],
    order: 21,
  },
  {
    title: "Salaatu an-Nabiyyi al-Oumiyy",
    category: "Vendredi",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ",
    transliteration:
      "Allahouma salli ala Saydina Mouhammadine nabiyil Oumiyi wa ala alihi wa Sahbihi wa salim.",
    translation:
      "Ô Allah, prie et salue notre maître Muhammad le Prophète illettré, sa famille et ses compagnons.",
    benefits: [
      "Rémission des péchés",
      "Mariage, résolution des problèmes",
      "Vertus dans les deux mondes",
    ],
    usageNotes: [
      "80 fois le vendredi après Asr — 80 ans de rémission.",
      "80 fois la nuit du vendredi — 400 ans de culte agréé.",
      "1111 fois chaque nuit jeudi → vendredi × 7 nuits — mariage.",
      "1000 fois chaque jour — résoudre tout problème.",
      "500 fois chaque matin — vertus des deux mondes.",
    ],
    order: 22,
  },
  {
    title: "Salaawat Adriqni",
    category: "Guérison",
    arabic:
      "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى سَيِّدِنَا مُحَمَّدٍ قَدْ ضَاقَتْ حِيلَتِي أَدْرِكْنِي يَا رَسُولَ اللَّهِ",
    transliteration:
      "Allahoumma Salli ala Sayyidina Muhammadine qhad daqhati hilati adriqhni YaRassoulallah.",
    translation:
      "Ô Allah, prie et salue notre maître Muhammad — ma ruse est étroite, viens à mon secours ô Messager d'Allah.",
    benefits: ["Guérir n'importe quelle maladie"],
    usageNotes: [
      "100 fois sur eau de Zamzam, boire et frotter — guérison.",
    ],
    order: 23,
  },
  {
    title: "Salaawat Nour Zati",
    category: "Quotidien",
    arabic:
      "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ النُّورِ الذَّاتِيِّ وَالسِّرِّ السَّارِي فِي سَائِرِ الْأَسْمَاءِ وَالصِّفَاتِ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ",
    transliteration:
      "Allaahumma salli wa sallim wa baarik ala sayyidina Muhammadine nouril zatii wasiril saari fi sa-iril asmaa'i wa Sifati wa ala Alihi wa Sabihi wa Salim.",
    translation:
      "Ô Allah, prie, salue et bénis notre maître Muhammad, la lumière essentielle et le secret circulant dans tous les noms et attributs, ainsi que sa famille et ses compagnons.",
    benefits: [
      "Bonheur et réussite",
      "Richesse, éloigne la pauvreté",
      "Guérison de toute maladie",
      "Force physique et puissance",
    ],
    usageNotes: [
      "66 fois par jour — bonheur et réussite.",
      "41 fois après ʿishaa — richesse, facilite la subsistance.",
      "41 fois sur eau à jeun — guérison.",
      "Écris 41 fois + jeûne 3 jours (mardi/mercredi/jeudi) + zikr 41 fois la nuit — santé et puissance.",
    ],
    order: 24,
  },
  {
    title: "Salaatu al-Amrat",
    category: "Subsistance",
    arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ كَمَا أَمَرْتَ أَنْ يُصَلَّى عَلَيْهِ",
    transliteration: "Allahoumma salli ala sayyidina Muhammadine kama amarta an yousalla aleyhi.",
    translation:
      "Ô Allah, prie sur notre maître Muhammad comme Tu as ordonné qu'on prie sur lui.",
    benefits: ["Attire la richesse"],
    usageNotes: ["100 fois par jour."],
    order: 25,
  },
  {
    title: "Salaatu Yanbaghi",
    category: "Quotidien",
    arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ كَمَا يَنْبَغِي الصَّلَاةُ عَلَيْهِ",
    transliteration: "Allahoumma salli ala sayyidina Muhammadine kama yanbaghi as-salatou aleyhi.",
    translation: "Ô Allah, prie sur Muhammad comme il convient de prier sur lui.",
    benefits: ["Être exaucé"],
    usageNotes: ["10 fois après chaque prière obligatoire."],
    order: 26,
  },
  {
    title: "Salaatu ʿAdada Man Yousalli",
    category: "Quotidien",
    arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ عَدَدَ مَنْ يُصَلِّي عَلَيْهِ",
    transliteration: "Allahoumma salli ala sayyidina Muhammadine adada mane yousalli aleyhi.",
    translation: "Ô Allah, prie sur Muhammad selon le nombre de ceux qui prient sur lui.",
    benefits: ["Facilite la vie"],
    usageNotes: ["1000 fois chaque nuit."],
    order: 27,
  },
  {
    title: "Salaatu ʿAdada Man Lam Yousalli",
    category: "Subsistance",
    arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ عَدَدَ مَنْ لَمْ يُصَلِّ عَلَيْهِ",
    transliteration: "Allahoumma salli ala sayyidina Muhammadine adada mane lam yousalli aleyhi.",
    translation:
      "Ô Allah, prie sur Muhammad selon le nombre de ceux qui n'ont pas prié sur lui.",
    benefits: ["Payer ses dettes"],
    usageNotes: ["1000 fois matin et soir."],
    order: 28,
  },
  {
    title: "Salaatu Kama Tuhibbu",
    category: "Autres",
    arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ كَمَا تُحِبُّ أَنْ يُصَلَّى عَلَيْهِ",
    transliteration: "Allahoumma salli ala sayyidina Muhammadine kama tuhibbou an yousalla aleyhi.",
    translation: "Ô Allah, prie sur Muhammad comme Tu aimes qu'on prie sur lui.",
    benefits: ["Régler n'importe quel problème difficile"],
    usageNotes: ["484 fois matin et soir."],
    order: 29,
  },
  {
    title: "Sallallahou ʿAla Muhammadin",
    category: "Quotidien",
    arabic: "صَلَّى اللَّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ أَجْمَعِينَ",
    transliteration: "Sallallahou ala sayyidina Muhammadine wa ala alihi wa sahbihi adjma-ine.",
    translation:
      "Qu'Allah prie sur notre maître Muhammad, sa famille et l'ensemble de ses compagnons.",
    benefits: [
      "Avoir tout ce que le cœur désire",
      "Voir le Prophète ﷺ en rêve",
      "Sainteté et réalisation spirituelle",
    ],
    usageNotes: [
      "1200 fois par jour — tout ce que le cœur désire.",
      "Réciter 368 fois × 33 jours (12 144 total) — voir le Prophète en rêve.",
      "124 000 fois en un mois lunaire — sainteté.",
      "3000 fois la nuit du vendredi ou du lundi — voir le Prophète et les 4 califes en rêve.",
    ],
    order: 30,
  },
];
