import { SalaatuLibraryItem } from "./admin-types";

// Salaats traditionnels universellement connus (domaine public — texte religieux
// transmis depuis le Prophète ﷺ et les Compagnons). Sert de contenu de
// démarrage si Firestore ne renvoie rien. La vraie bibliothèque est gérée
// depuis /admin/bibliotheque.
export const SALAATU_FALLBACK: SalaatuLibraryItem[] = [
  {
    id: "ibrahimiyya",
    title: "Salaatu Ibrahimiyya",
    category: "Salaatu Ibrahimiyya",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَ عَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَ عَلَى آلِ إِبْرَاهِيمَ وَ بَارِكْ عَلَى مُحَمَّدٍ وَ عَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَ عَلَى آلِ إِبْرَاهِيمَ فِي ٱلْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration:
      "Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammadin kamā ṣallayta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīma, wa bārik ʿalā Muḥammadin wa ʿalā āli Muḥammadin kamā bārakta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīma fi'l-ʿālamīn, innaka Ḥamīdun Majīd.",
    translation:
      "Ô Allah, prie sur Muhammad et sur la famille de Muhammad comme Tu as prié sur Ibrahim et sur la famille d'Ibrahim, et bénis Muhammad et la famille de Muhammad comme Tu as béni Ibrahim et la famille d'Ibrahim parmi les mondes. Tu es certes Digne de louanges, Glorieux.",
    benefits: [
      "Récitée dans chaque prière canonique (tashahhud)",
      "La forme la plus complète de salaat sur le Prophète ﷺ",
      "Ouvre les cieux et facilite les besoins",
    ],
    usageNotes: [
      "Après chaque prière obligatoire",
      "Zikr 100 fois après ʿIshaa puis formuler ses vœux",
    ],
    featured: false,
    order: 1,
    createdAt: 0,
  },
  {
    id: "fatihi",
    title: "Salaatu al-Fatihi",
    category: "Quotidien",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى سَيِّدِناَ مُحَمَّدٍ ٱلْفَاتِحِ لِمَا أُغْلِقَ وَ ٱلْخَاتِمِ لِمَا سَبَقَ نَاصِرِ ٱلْحَقِّ بِٱلْحَقِّ وَ ٱلْهَادِي إِلَى صِرَاطِكَ ٱلْمُسْتَقِيمِ وَ عَلَى آلِهِ حَقَّ قَدْرِهِ وَ مِقْدَارِهِ ٱلْعَظِيمِ",
    transliteration:
      "Allāhumma ṣalli ʿalā Sayyidinā Muḥammadin al-Fātiḥi limā ughliq, wa'l-Khātimi limā sabaq, Nāṣiri'l-ḥaqqi bi'l-ḥaqq, wa'l-Hādī ilā ṣirāṭika'l-mustaqīm, wa ʿalā ālihi ḥaqqa qadrihi wa miqdārihi'l-ʿaẓīm.",
    translation:
      "Ô Allah, prie sur notre maître Muhammad, l'Ouvreur de ce qui était fermé, le Sceau de ce qui a précédé, le Défenseur de la vérité par la vérité, le Guide vers Ton droit chemin, ainsi que sur sa famille, selon la vraie mesure de son rang immense.",
    benefits: [
      "Très récompensée — connue comme la Salaatu al-Fatihi",
      "Profondément aimée dans la tradition tijaniyyah et mouridiyyah",
    ],
    usageNotes: [
      "Zikr quotidien après les prières",
      "Très recommandée le vendredi",
    ],
    featured: false,
    order: 2,
    createdAt: 0,
  },
  {
    id: "nariya",
    title: "Salaatu an-Nariya (Tafrijiyya)",
    category: "Protection",
    arabic:
      "اللَّهُمَّ صَلِّ صَلاَةً كَامِلَةً وَ سَلِّمْ سَلاَمًا تَامًّا عَلَى سَيِّدِنَا مُحَمَّدٍ ٱلَّذِي تَنْحَلُّ بِهِ ٱلْعُقَدُ وَ تَنْفَرِجُ بِهِ ٱلْكُرَبُ وَ تُقْضَى بِهِ ٱلْحَوَائِجُ وَ تُنَالُ بِهِ ٱلرَّغَائِبُ وَ حُسْنُ ٱلْخَوَاتِمِ وَ يُسْتَسْقَى ٱلْغَمَامُ بِوَجْهِهِ ٱلْكَرِيمِ وَ عَلَى آلِهِ وَ صَحْبِهِ فِي كُلِّ لَمْحَةٍ وَ نَفَسٍ بِعَدَدِ كُلِّ مَعْلُومٍ لَكَ",
    transliteration:
      "Allāhumma ṣalli ṣalātan kāmilatan wa sallim salāman tāmman ʿalā Sayyidinā Muḥammadin alladhī tanḥallu bihi'l-ʿuqad, wa tanfariju bihi'l-kurab, wa tuqḍā bihi'l-ḥawāʾij, wa tunālu bihi'r-raghāʾib, wa ḥusnu'l-khawātim, wa yustasqā'l-ghamāmu bi-wajhihi'l-karīm, wa ʿalā ālihi wa ṣaḥbihi fī kulli lamḥatin wa nafasin bi-ʿadadi kulli maʿlūmin lak.",
    translation:
      "Ô Allah, prie d'une prière parfaite et accorde un salut complet sur notre maître Muhammad, par qui les nœuds se dénouent, les angoisses se dissipent, les besoins sont satisfaits, les aspirations atteintes et la belle fin obtenue, et par la noblesse duquel les nuages déversent leur pluie ; ainsi que sur sa famille et ses compagnons, à chaque clin d'œil et à chaque souffle, autant que Tu en connais.",
    benefits: [
      "Dénoue les nœuds et soulage les épreuves",
      "Connue pour faciliter les affaires difficiles",
    ],
    usageNotes: [
      "Récitée 11 fois pour une demande urgente",
      "Zikr 41 fois pendant 41 jours pour les besoins importants",
    ],
    featured: false,
    order: 3,
    createdAt: 0,
  },
];

export function pickSalaatuOfTheDay(
  library: SalaatuLibraryItem[]
): SalaatuLibraryItem | null {
  if (library.length === 0) return null;
  const featured = library.find((s) => s.featured);
  if (featured) return featured;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return library[dayOfYear % library.length];
}
