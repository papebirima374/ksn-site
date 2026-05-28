/** Contenu prérempli pour les 25 leçons du Tazawwud-ss-Sighar.
 *
 *  Ce contenu est une PROPOSITION pédagogiquement structurée basée
 *  sur la tradition mouride et les fondements classiques de l'Islam.
 *  Il DOIT être relu, corrigé et affiné par la Commission Éducation
 *  & Culture du Dahira KSN avant publication officielle.
 *
 *  Chaque entrée est indexée par "reference" (ex: "1.1", "6.3") qui
 *  correspond au champ `reference` de la leçon en base. */

export type TazawwudLessonContent = {
  reference: string;
  titleArabic?: string;
  intention: string;
  content: string;
  citation?: {
    author?: string;
    sourceRef?: string;
    arabic?: string;
    translationFr?: string;
  };
  application: string;
  reminder: string;
};

export const TAZAWWUD_CONTENT: TazawwudLessonContent[] = [
  // ═══ MODULE 1 — LES FONDEMENTS DE LA FOI ═══════════════════════════

  {
    reference: "1.1",
    titleArabic: "أركان الإسلام",
    intention:
      "Au nom d'Allah le Très-Miséricordieux. Découvrons ensemble les cinq piliers sur lesquels repose tout l'édifice de notre pratique musulmane.",
    content: `L'Islam, religion de paix et de soumission au Créateur, repose sur cinq piliers fondamentaux enseignés par le Prophète Muhammad ﷺ.

Le premier pilier est l'attestation de foi (Chahada) : "Il n'y a de divinité qu'Allah, et Muhammad est Son Messager." C'est par cette parole sincère, prononcée avec le cœur, que l'on entre dans l'Islam et qu'on y demeure.

Le deuxième pilier est la prière (Salat), accomplie cinq fois par jour selon les horaires fixés. Elle est le lien direct et quotidien entre le serviteur et son Seigneur.

Le troisième pilier est la Zakat, l'aumône légale prélevée annuellement sur les biens de celui qui possède au-dessus d'un certain seuil (nisab). Elle purifie la richesse et soutient les nécessiteux.

Le quatrième pilier est le jeûne (Sawm) du mois de Ramadan, durant lequel on s'abstient de boire, manger et d'avoir des relations conjugales, du lever au coucher du soleil.

Le cinquième pilier est le pèlerinage à La Mecque (Hajj), obligatoire une fois dans la vie pour celui qui en a les moyens physiques et financiers.

Serigne Touba (qu'Allah l'agrée), dans le Tazawwud, insiste sur l'importance pour le jeune musulman de connaître et de pratiquer ces cinq piliers avec sincérité et constance.`,
    citation: {
      author: "Le Prophète Muhammad ﷺ",
      sourceRef: "Rapporté par Al-Bukhari et Muslim",
      arabic:
        "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَصَوْمِ رَمَضَانَ، وَحَجِّ الْبَيْتِ",
      translationFr:
        "L'Islam est bâti sur cinq fondements : l'attestation qu'il n'y a de divinité qu'Allah et que Muhammad est Son Messager, l'accomplissement de la prière, l'acquittement de la Zakat, le jeûne du Ramadan et le pèlerinage à la Maison sacrée.",
    },
    application:
      "Récite chaque jour la Chahada avec présence du cœur. Veille à accomplir tes cinq prières quotidiennes, même brièvement. Planifie ta Zakat annuelle. Prépare-toi spirituellement à l'avance pour le Ramadan. Et inscris le Hajj dans tes intentions de vie.",
    reminder: "Cinq piliers, une seule voie : Allah, prière, Zakat, jeûne, pèlerinage.",
  },

  {
    reference: "1.2",
    titleArabic: "أركان الإيمان",
    intention:
      "Si les piliers de l'Islam organisent la pratique, les piliers de la foi (Iman) en sont le fondement intérieur. Comprenons-les ensemble.",
    content: `La foi (Iman) en Islam repose sur six piliers, révélés par l'ange Jibril (Gabriel) au Prophète ﷺ lors d'un célèbre dialogue rapporté par Muslim.

Le premier pilier est la foi en Allah, le Créateur Unique, le Souverain Absolu, sans associé ni semblable.

Le deuxième est la foi en Ses anges, créatures lumineuses au service de Sa Majesté : Jibril, Mikail, Israfil, Azrail et tant d'autres.

Le troisième est la foi en Ses Livres révélés : la Torah, l'Évangile, les Psaumes et, comme couronnement, le Saint Coran.

Le quatrième est la foi en Ses Messagers (Anbiya) : Adam, Nuh, Ibrahim, Musa, Issa et le dernier d'entre eux, Muhammad ﷺ.

Le cinquième est la foi au Jour Dernier (Yawm al-Qiyama) : la résurrection, le jugement, le Paradis et l'Enfer.

Le sixième est la foi au destin (Qadar), bon ou mauvais : tout ce qui arrive est ordonné par Allah selon Sa Sagesse infinie.

Serigne Touba souligne que ces six piliers doivent être ancrés dans le cœur du croyant avec certitude (Yaqin), car la foi est lumière et tranquillité intérieure.`,
    citation: {
      author: "L'ange Jibril dans le Hadith de Gabriel",
      sourceRef: "Rapporté par Muslim",
      arabic:
        "أَنْ تُؤْمِنَ بِاللَّهِ، وَمَلَائِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَالْيَوْمِ الْآخِرِ، وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ",
      translationFr:
        "Que tu croies en Allah, en Ses anges, en Ses Livres, en Ses Messagers, au Jour Dernier, et que tu croies au destin, à son bien et à son mal.",
    },
    application:
      "Médite chaque jour sur ces six piliers. Lis sur la vie des Prophètes pour renforcer ta foi en eux. Quand une épreuve survient, rappelle-toi du Qadar : Allah, dans Sa Sagesse, a tout ordonné pour ton bien.",
    reminder: "Allah · Anges · Livres · Messagers · Jour Dernier · Destin.",
  },

  {
    reference: "1.3",
    titleArabic: "معرفة الله",
    intention:
      "Connaître Allah, c'est le premier devoir du croyant. Approchons-nous de Lui par la contemplation de Ses Attributs.",
    content: `Allah, qu'Il soit exalté, est le Créateur de toute chose, l'Éternel sans commencement ni fin. Il est l'Unique (Al-Ahad), le Sans-Pareil (As-Samad), Celui qui n'engendre pas et n'a pas été engendré.

Parmi Ses Plus Beaux Noms (Al-Asma al-Husna) que le croyant doit connaître : Ar-Rahman (le Tout-Miséricordieux), Ar-Rahim (le Très-Miséricordieux), Al-Malik (le Souverain), Al-Quddus (le Saint), As-Salam (la Paix), Al-Mu'min (Celui qui inspire la sécurité), Al-Aziz (le Tout-Puissant), Al-Hakim (le Sage).

Allah est exempt de toute imperfection. Il ne ressemble à aucune de Ses créatures. Aucun œil ne L'a vu en ce bas-monde, et nulle imagination ne peut Le concevoir tel qu'Il est. Le Prophète ﷺ a dit : "Méditez sur la création d'Allah, mais ne méditez pas sur Son Essence."

Serigne Touba enseigne dans le Tazawwud que la connaissance d'Allah (Ma'rifa) commence par l'observation de Ses signes (ayat) dans l'univers : le ciel étoilé, l'alternance du jour et de la nuit, la beauté de la création. Tout pointe vers le Créateur.

Le croyant cultive cette connaissance par le rappel constant (dhikr), la lecture du Coran et la méditation des Noms divins.`,
    citation: {
      author: "Coran",
      sourceRef: "Sourate Al-Ikhlâs (112), versets 1-4",
      arabic:
        "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
      translationFr:
        "Dis : 'Il est Allah, Unique. Allah, le Soutien Absolu. Il n'a jamais engendré, n'a pas été engendré non plus. Et nul n'est égal à Lui.'",
    },
    application:
      "Récite Sourate Al-Ikhlâs trois fois par jour (équivalent à la récitation du tiers du Coran). Mémorise progressivement les 99 Plus Beaux Noms d'Allah. Quand tu contemples la nature, dis : 'Subhan Allah' (Gloire à Allah).",
    reminder: "Allah est Un, sans associé, sans semblable, sans limite.",
  },

  {
    reference: "1.4",
    titleArabic: "معرفة النبي ﷺ",
    intention:
      "Connaître le Prophète ﷺ, c'est l'aimer. Et l'aimer, c'est le suivre. Telle est la voie tracée par Serigne Touba.",
    content: `Muhammad ﷺ, fils d'Abdullah, est né à La Mecque en l'an 570 de l'ère chrétienne, dans la noble tribu de Quraysh. Orphelin de père avant sa naissance, il perdit sa mère Amina à l'âge de six ans, puis son grand-père Abdul-Muttalib à huit ans. Il fut élevé par son oncle Abu Talib.

Connu dès sa jeunesse pour sa probité absolue, il reçut le surnom d'Al-Amin (le Digne de confiance). Il épousa Khadija, une dame respectée, qui sera la première à croire en sa mission prophétique.

À l'âge de quarante ans, dans la grotte de Hira, l'ange Jibril lui transmit la première révélation : "Lis, au nom de ton Seigneur qui a créé !" (Coran 96:1). Il devint ainsi le Sceau des Prophètes, le dernier envoyé d'Allah à l'humanité entière.

Pendant vingt-trois ans, il transmit le message divin avec patience face à l'adversité. De La Mecque à Médine, il édifia la première communauté musulmane, fondée sur la foi, la justice et la fraternité. Il mourut à Médine à l'âge de soixante-trois ans.

Serigne Touba, dans le Tazawwud, exhorte à connaître le Prophète ﷺ par l'étude de sa Sira (biographie), à imiter ses Akhlaq (caractères nobles), et à multiplier la Salaatu sur lui. C'est par cette voie que le croyant entre dans la lumière prophétique (Nur Muhammadi).`,
    citation: {
      author: "Coran",
      sourceRef: "Sourate Al-Ahzâb (33), verset 21",
      arabic:
        "لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ",
      translationFr:
        "En effet, vous avez dans le Messager d'Allah un excellent modèle.",
    },
    application:
      "Lis chaque semaine un épisode de la vie du Prophète ﷺ. Médite sur l'un de ses caractères nobles (générosité, patience, douceur). Multiplie la Salaatu sur lui au quotidien — c'est le moyen le plus sûr de te rapprocher de lui.",
    reminder: "Le connaître, c'est l'aimer. L'aimer, c'est le suivre.",
  },

  // ═══ MODULE 2 — LA PURIFICATION ════════════════════════════════════

  {
    reference: "2.1",
    titleArabic: "أنواع المياه",
    intention:
      "Toute approche du sacré commence par la purification. Et toute purification commence par l'eau. Apprenons à la connaître.",
    content: `En matière de Tahara (purification rituelle), les juristes musulmans distinguent plusieurs types d'eau :

L'eau **pure et purifiante** (Mutlaq) : c'est l'eau naturelle qui n'a pas changé d'aspect (couleur, goût, odeur). Elle est valable pour le Wudu (ablutions) et le Ghusl (grande purification). Exemples : eau de pluie, eau de source, eau de mer, eau de rivière, eau de neige fondue, eau de puits.

L'eau **pure mais non purifiante** (Tahir) : elle a été utilisée pour une purification ou modifiée par un élément pur (ex : eau usée pour le Wudu, eau mélangée à du sirop). Elle peut servir à boire mais pas à se purifier rituellement.

L'eau **impure** (Najis) : elle a été contaminée par une impureté (najassa) au point d'en avoir changé l'aspect. Elle n'est valable ni pour boire ni pour se purifier.

L'eau de mer mérite une mention particulière. Le Prophète ﷺ a dit à son sujet : "Son eau est pure, et ses morts (poissons) sont licites" — répondant ainsi à une question d'un compagnon en navigation.

Serigne Touba enseigne que connaître les types d'eau est le préalable indispensable à toute pratique du culte. Le doute sur la pureté de l'eau peut invalider la prière.`,
    citation: {
      author: "Le Prophète Muhammad ﷺ",
      sourceRef: "Rapporté par Abu Dawud, At-Tirmidhi et An-Nasa'i",
      arabic: "هُوَ الطَّهُورُ مَاؤُهُ، الْحِلُّ مَيْتَتُهُ",
      translationFr:
        "Son eau est purifiante, et ses morts (poissons) sont licites.",
    },
    application:
      "Vérifie toujours la pureté de l'eau avant tes ablutions. En cas de doute, change d'eau ou complète par le tayammum si tu n'en trouves pas d'autre. Privilégie l'eau courante quand c'est possible.",
    reminder: "Eau pure, prière pure. La Tahara précède la Salat.",
  },

  {
    reference: "2.2",
    titleArabic: "الوضوء",
    intention:
      "L'ablution prépare le corps et l'âme à la rencontre divine. Apprenons ses piliers et ses sagesses.",
    content: `Le Wudu (petite ablution) est obligatoire avant la prière, la circumambulation autour de la Kaaba (Tawaf) et le contact avec le Coran.

Les **piliers obligatoires** (Fara'id) du Wudu sont quatre selon l'école Malikite (suivie au Sénégal et par Serigne Touba) :

1. Se laver le visage (du front au menton, d'une oreille à l'autre)
2. Se laver les mains et les avant-bras jusqu'aux coudes inclus
3. Passer les mains mouillées sur la tête (Mas-h)
4. Se laver les pieds jusqu'aux chevilles inclus

À ces piliers s'ajoutent l'**intention** (Niya) au cœur, et le respect de l'**ordre** des étapes.

Les actes **recommandés** (Sunan) sont nombreux : commencer par 'Bismillah', se laver les mains trois fois avant tout, se rincer la bouche, aspirer de l'eau par le nez, frotter entre les doigts et orteils, répéter chaque étape trois fois.

Le Wudu est annulé par : la sortie d'urine, de selles, de gaz, le sommeil profond, la perte de conscience, le contact direct avec les parties intimes, et la consommation de viande de chameau (controverse).

Serigne Touba enseigne que le Wudu n'est pas qu'un acte physique : c'est un effacement symbolique des péchés. Le Prophète ﷺ a dit qu'avec chaque goutte d'eau qui tombe, des péchés s'effacent.`,
    citation: {
      author: "Coran",
      sourceRef: "Sourate Al-Mâ'ida (5), verset 6",
      arabic:
        "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ",
      translationFr:
        "Ô vous qui croyez ! Lorsque vous vous levez pour la prière, lavez vos visages et vos mains jusqu'aux coudes, passez les mains mouillées sur vos têtes ; et lavez-vous les pieds jusqu'aux chevilles.",
    },
    application:
      "Avant chaque prière, accomplis le Wudu avec attention et intention. Ne gaspille pas l'eau : le Prophète ﷺ se contentait d'une petite quantité. Récite la Chahada après le Wudu — les portes du Paradis te seront ouvertes.",
    reminder: "Le Wudu efface les fautes goutte à goutte.",
  },

  {
    reference: "2.3",
    titleArabic: "الغسل",
    intention:
      "Quand le corps tout entier nécessite purification, c'est le Ghusl. Un retour à la pureté complète avant la rencontre divine.",
    content: `Le Ghusl (grande purification) est l'ablution complète de tout le corps. Il est obligatoire dans plusieurs situations :

1. Après une relation conjugale (Janaba)
2. Après l'écoulement séminal, même en rêve
3. À la fin des menstrues (Hayd) pour la femme
4. À la fin des lochies (Nifas, écoulements post-accouchement)
5. À la mort (Ghusl du défunt, obligation collective)
6. Pour l'apostat qui revient à l'Islam, et pour le nouveau converti

Les **piliers** du Ghusl sont :

1. L'intention (Niya)
2. Laver TOUT le corps, sans laisser le moindre endroit sec — y compris les cheveux jusqu'à la racine, les aisselles, le nombril, l'arrière des oreilles
3. Se frotter le corps (Dalk) lors du lavage (spécificité Malikite)

La forme **complète** recommandée commence par le Wudu intégral, puis le lavage de toute la tête (en s'assurant que l'eau pénètre les cheveux), puis le côté droit, puis le côté gauche du corps.

Serigne Touba insiste sur le fait que le Ghusl est aussi une purification spirituelle. Sortir de l'état d'impureté majeure (Janaba) avant que le temps de la prière ne s'écoule est une obligation. Reporter sans raison est un péché.`,
    citation: {
      author: "Coran",
      sourceRef: "Sourate Al-Mâ'ida (5), verset 6",
      arabic: "وَإِنْ كُنْتُمْ جُنُبًا فَاطَّهَّرُوا",
      translationFr:
        "Et si vous êtes en état de Janaba (impureté majeure), purifiez-vous.",
    },
    application:
      "N'attends jamais l'appel à la prière pour accomplir ton Ghusl quand il est obligatoire. Couvre l'intégralité de ton corps. La pudeur (Hayâ) est partie intégrante de l'acte : accomplis-le dans un endroit clos.",
    reminder: "Corps lavé, cœur purifié, prière acceptée.",
  },

  {
    reference: "2.4",
    titleArabic: "التيمم",
    intention:
      "Quand l'eau manque, Allah dans Sa Miséricorde a permis le tayammum. Une purification symbolique qui ne diminue en rien la valeur du culte.",
    content: `Le Tayammum est une purification par la terre, ou par toute surface naturelle de la croûte terrestre (sable, pierre, terre). Il remplace le Wudu ET le Ghusl quand :

1. L'eau est introuvable (voyage dans le désert, par exemple)
2. La quantité disponible est juste suffisante pour boire
3. L'usage de l'eau est impossible pour cause de maladie ou de blessure
4. L'eau provoquerait un risque sanitaire grave

Les **étapes** du Tayammum sont simples :

1. Intention (Niya) de se purifier en remplacement du Wudu ou du Ghusl
2. Frapper légèrement les paumes des mains sur une surface terreuse propre
3. Passer les mains sur le visage
4. Frapper à nouveau les paumes
5. Passer la main gauche sur la main et l'avant-bras droits, puis l'inverse

Le Tayammum est annulé par les mêmes choses qui annulent le Wudu, plus la **disponibilité de l'eau** — dès qu'on peut accéder à l'eau, il faut refaire le Wudu.

Serigne Touba souligne que le tayammum est un signe de la grande miséricorde d'Allah. Le Prophète ﷺ a dit : "Toute la terre m'a été faite mosquée et purificatrice." Aucune circonstance ne peut donc empêcher le croyant d'accomplir sa prière à l'heure.`,
    citation: {
      author: "Le Prophète Muhammad ﷺ",
      sourceRef: "Rapporté par Al-Bukhari et Muslim",
      arabic:
        "جُعِلَتْ لِيَ الْأَرْضُ مَسْجِدًا وَطَهُورًا",
      translationFr:
        "La terre m'a été faite mosquée et moyen de purification.",
    },
    application:
      "Connais cette méthode pour les situations d'urgence : voyage, maladie, manque d'eau. Apprends-la aussi à tes proches âgés ou malades. C'est une grâce d'Allah à connaître absolument.",
    reminder: "Pas d'eau, pas d'excuse : la terre purifie aussi.",
  },

  // ═══ MODULE 3 — LA PRIÈRE ═══════════════════════════════════════════

  {
    reference: "3.1",
    titleArabic: "الصلوات الخمس",
    intention:
      "Cinq fois par jour, Allah nous appelle. Ces rendez-vous structurent notre vie et purifient nos cœurs.",
    content: `Les cinq prières quotidiennes obligatoires (Farata) sont :

1. **Subh** (l'aube) : du début de l'aube jusqu'au lever du soleil. 2 raka'at.
2. **Dhuhr** (midi) : du milieu du jour jusqu'à ce que l'ombre d'un objet égale sa hauteur. 4 raka'at.
3. **'Asr** (après-midi) : de la fin de Dhuhr jusqu'au coucher du soleil. 4 raka'at.
4. **Maghrib** (coucher du soleil) : du coucher jusqu'à la disparition de la lueur rouge à l'horizon. 3 raka'at.
5. **'Isha** (soir) : de la fin de Maghrib jusqu'au milieu de la nuit (ou jusqu'à l'aube selon la nécessité). 4 raka'at.

Ces cinq prières furent imposées au Prophète ﷺ lors de son ascension nocturne (Isra et Mi'raj), où il s'éleva jusqu'au Trône Divin. Initialement, Allah avait prescrit cinquante prières, mais le Prophète demanda allègement à plusieurs reprises sur le conseil de Musa (qu'Allah l'agrée), jusqu'à obtenir cinq prières — récompensées comme cinquante.

Manquer une prière obligatoire sans excuse est un grand péché. Serigne Touba insiste dans le Tazawwud : la prière est le poteau de la religion. Celui qui l'établit a établi sa religion ; celui qui la délaisse a démoli sa religion.

Les prières en groupe à la mosquée sont vingt-sept fois supérieures aux prières individuelles, comme l'enseigne le hadith authentique.`,
    citation: {
      author: "Le Prophète Muhammad ﷺ",
      sourceRef: "Rapporté par At-Tirmidhi",
      arabic:
        "الصَّلَاةُ عِمَادُ الدِّينِ، فَمَنْ أَقَامَهَا فَقَدْ أَقَامَ الدِّينَ، وَمَنْ هَدَمَهَا فَقَدْ هَدَمَ الدِّينَ",
      translationFr:
        "La prière est le pilier de la religion. Quiconque l'établit a établi sa religion, et quiconque la néglige a démoli sa religion.",
    },
    application:
      "Mémorise les horaires des cinq prières dans ta ville. Utilise une application de prière fiable. Établis le rendez-vous : aucune occupation, aucun travail ne doit faire manquer une prière obligatoire.",
    reminder: "Cinq prières, cinq rendez-vous d'amour avec Allah.",
  },

  {
    reference: "3.2",
    titleArabic: "شروط الصلاة",
    intention:
      "Pour qu'une prière soit acceptée, sept conditions doivent être réunies. Apprenons-les pour ne pas prier en vain.",
    content: `Les **conditions de validité** (Shurut) de la prière sont au nombre de sept :

1. **La pureté rituelle** (Tahara) : Wudu ou Ghusl selon le cas. Sans Tahara, pas de prière.

2. **La pureté du corps, des vêtements et du lieu** : aucune impureté visible (sang, urine, etc.) ne doit être présente.

3. **La couverture des parties à voiler** ('Awra) : pour l'homme, du nombril aux genoux. Pour la femme, tout le corps sauf le visage et les mains.

4. **L'entrée du temps de la prière** : prier avant l'heure ne compte pas, et après l'heure est une dette.

5. **L'orientation vers la Qibla** : la direction de la Kaaba à La Mecque. Si on ne la connaît pas, on fait de son mieux après recherche.

6. **L'intention** (Niya) au cœur : déterminer laquelle des prières on accomplit (Dhuhr, 'Asr, etc.), si elle est obligatoire ou surérogatoire.

7. **La capacité physique** : prier debout si possible ; sinon assis ; sinon allongé. La prière n'est jamais annulée à cause d'une incapacité.

Serigne Touba insiste : une condition manquée peut invalider toute la prière. Apprends-les bien avant de te tenir devant Allah.`,
    citation: {
      author: "Coran",
      sourceRef: "Sourate Al-Baqara (2), verset 144",
      arabic: "فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ",
      translationFr:
        "Tourne donc ton visage vers la Mosquée Sacrée (de La Mecque).",
    },
    application:
      "Avant chaque prière, fais une rapide checklist : suis-je pur ? Mes habits sont-ils propres ? L'heure est-elle entrée ? Suis-je orienté vers La Mecque ? Mon intention est-elle claire ?",
    reminder: "Sept conditions, une seule porte vers l'agrément divin.",
  },

  {
    reference: "3.3",
    titleArabic: "أركان وواجبات الصلاة",
    intention:
      "Les piliers de la prière sont ce qui la constitue. Les omettre, c'est l'annuler. Apprenons-les avec soin.",
    content: `Les **piliers** (Arkan) de la prière sont les actes essentiels qui la constituent. Selon l'école Malikite suivie par Serigne Touba, on dénombre quatorze piliers :

1. **L'intention** (Niya)
2. **Takbirat al-Ihram** : dire "Allahu Akbar" au début
3. **Se tenir debout** durant les récitations (Qiyam)
4. **Réciter la Fatiha** dans chaque raka'a
5. **L'inclinaison** (Ruku')
6. **Se redresser** après le Ruku' ('Itidal)
7. **La prosternation** (Sujud), avec sept points du corps au sol : front, deux mains, deux genoux, deux pieds
8. **Se relever** entre les deux prosternations
9. **La deuxième prosternation**
10. **S'asseoir** pour le Tashahhud final
11. **Le Tashahhud final** (témoignage)
12. **Saluer** à la fin (Taslim) : "As-Salamu 'alaykum"
13. **La tranquillité** dans chaque mouvement (Tuma'nina)
14. **L'ordre** entre les piliers

Les **obligations** (Wajibat) sont des actes obligatoires dont l'omission par oubli requiert une prosternation de réparation (Sajdat as-Sahw), et l'omission volontaire annule la prière. Exemples : la récitation à voix haute dans les prières où c'est requis (Maghrib, 'Isha, Subh), le Tashahhud intermédiaire.

Serigne Touba enseigne dans le Tazawwud que la prière est un édifice : chaque pilier compte. Une prière bâclée est une prière diminuée.`,
    citation: {
      author: "Le Prophète Muhammad ﷺ à un homme qui priait mal",
      sourceRef: "Rapporté par Al-Bukhari",
      arabic: "ارْجِعْ فَصَلِّ فَإِنَّكَ لَمْ تُصَلِّ",
      translationFr:
        "Retourne et prie, car tu n'as pas prié.",
    },
    application:
      "Apprends ces 14 piliers par cœur. Observe-toi pendant la prière : suis-je en tranquillité (Tuma'nina) ou je bâcle ? Le Prophète ﷺ comparait celui qui bâcle à celui qui picore comme une poule.",
    reminder: "Une prière sans piliers s'écroule. Une prière calme s'élève.",
  },

  {
    reference: "3.4",
    titleArabic: "سنن الصلاة",
    intention:
      "Au-delà des piliers obligatoires, les actes recommandés (Sunna) parfaisent la prière. Marchons sur les pas du Prophète ﷺ.",
    content: `Les **Sunan** sont les actes recommandés que le Prophète ﷺ accomplissait régulièrement dans la prière. Les omettre n'annule pas la prière, mais les négliger entièrement, c'est se priver d'une grande récompense.

Parmi les Sunan principaux :

1. Lever les mains au niveau des épaules lors du premier Takbir
2. Placer la main droite sur la gauche (selon les écoles autres que Malikite, où elles restent le long du corps)
3. Réciter le **Du'a al-Istiftah** ("Subhanaka Allahumma...") au début
4. Dire "**Amin**" après la Fatiha
5. Réciter une autre sourate après la Fatiha dans les deux premières raka'at
6. Dire "**Allahu Akbar**" à chaque changement de position
7. Dire "**Sami' Allahu liman hamidah**" en se redressant du Ruku'
8. Multiplier les invocations dans la prosternation
9. **Saluer le Prophète ﷺ** (Salat Ibrahimiya) dans le Tashahhud final
10. Saluer deux fois à la fin (droite puis gauche)

Les **prières surérogatoires** (Nawafil et Sunan Ratiba) accompagnent les prières obligatoires :
- 2 raka'at avant Subh
- 4 raka'at avant Dhuhr et 2 raka'at après
- 2 raka'at après Maghrib
- 2 raka'at après 'Isha

S'y ajoutent **Tahajjud** (la prière de la nuit), **Witr** (impair, à la fin de la nuit), **Duha** (matinée), **Tarawih** (durant Ramadan).

Serigne Touba lui-même multipliait les prières nocturnes, donnant l'exemple à toute la communauté mouride.`,
    citation: {
      author: "Le Prophète Muhammad ﷺ",
      sourceRef: "Rapporté par Muslim",
      arabic: "صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي",
      translationFr: "Priez comme vous m'avez vu prier.",
    },
    application:
      "Ajoute progressivement les Sunan à ta pratique. Commence par les 2 raka'at avant Subh : le Prophète ﷺ a dit qu'elles valent mieux que ce monde et ce qu'il contient. Vise le Tahajjud quand tu peux.",
    reminder: "Le pilier soutient. La Sunna couronne.",
  },

  {
    reference: "3.5",
    titleArabic: "مبطلات الصلاة",
    intention:
      "Connaître ce qui annule la prière, c'est s'en préserver. La vigilance fait partie de l'adoration.",
    content: `Plusieurs actes annulent la prière (la rendent nulle, obligeant à la recommencer) :

1. **Manger ou boire** intentionnellement
2. **Parler** intentionnellement à d'autres qu'à soi-même ou à Allah (toute parole non liée à la prière)
3. **Rire à voix haute** (le sourire intérieur n'annule pas)
4. **Tourner le visage** complètement de la Qibla sans raison
5. **Marcher** ou faire des mouvements excessifs non liés à la prière
6. **Perdre la pureté rituelle** : sortie de gaz, urine, sommeil profond, etc.
7. **Découvrir une impureté** sur soi ou ses habits qu'on n'avait pas vue
8. **Oublier une raka'a** entière et s'en rendre compte trop tard
9. **Devancer l'imam** dans le suivi en groupe
10. **Manquer un pilier** ou un obligation majeure

Pour les **oublis** mineurs (oublier de dire Subhana Rabbi, oublier le Tashahhud intermédiaire), il existe une **prosternation de réparation** (Sajdat as-Sahw) : deux prosternations à la fin de la prière, avant ou après le Salam selon l'école.

Serigne Touba enseigne dans le Tazawwud que la prière demande de la **présence du cœur** (Khuchu'). Les distractions mentales ne l'annulent pas, mais en diminuent grandement la valeur. Lutte pour rester concentré : tu te tiens devant le Maître des mondes.`,
    citation: {
      author: "Le Prophète Muhammad ﷺ",
      sourceRef: "Rapporté par An-Nasa'i",
      arabic: "إِنَّ فِي الصَّلَاةِ لَشُغْلًا",
      translationFr:
        "Certes, la prière demande une occupation pleine (qui exclut les paroles étrangères).",
    },
    application:
      "Avant chaque prière, isole-toi des distractions : éteins ton téléphone, retire-toi dans un coin calme. Si tu fais une erreur, fais la prosternation de réparation. Ne paniquez pas : Allah est Miséricordieux.",
    reminder: "Ce qui annule la prière, c'est ce qui détourne du Maître.",
  },

  // ═══ MODULE 4 — JEÛNE, ZAKAT ET HAJJ ════════════════════════════════

  {
    reference: "4.1",
    titleArabic: "صوم رمضان",
    intention:
      "Le jeûne du Ramadan est l'école annuelle du croyant. Trente jours pour purifier le corps, élever l'âme et nourrir l'esprit.",
    content: `Le Sawm (jeûne) de Ramadan est le quatrième pilier de l'Islam, obligatoire pour tout musulman pubère, sain d'esprit, capable physiquement.

**Conditions de validité** :
1. **L'intention** (Niya) chaque nuit, avant l'aube
2. **L'abstention** de manger, boire et avoir des relations conjugales du **Fajr** (aube) au **Maghrib** (coucher du soleil)
3. **L'éloignement** des actes de désobéissance : mensonge, médisance, regards interdits, colère excessive

Le Ramadan est aussi le mois où le **Coran fut révélé**. Le Prophète ﷺ multipliait sa lecture du Coran avec l'ange Jibril durant ce mois sacré.

**Sont dispensés** du jeûne :
- Les voyageurs (ils rattrapent ensuite)
- Les malades (ils rattrapent ensuite)
- Les femmes enceintes et allaitantes (selon les avis)
- Les femmes en menstrues ou en lochies (elles rattrapent ensuite)
- Les personnes âgées qui ne peuvent plus jeûner (nourrir un pauvre par jour manqué)

**Sunan** importants du Ramadan :
- Le **Suhur** (repas avant l'aube)
- La rupture rapide au coucher du soleil avec des dattes et de l'eau
- L'**I'tikaf** (retraite spirituelle dans la mosquée) durant les 10 derniers jours
- La recherche de **Laylat al-Qadr** (Nuit du Destin), meilleure que mille mois

Serigne Touba enseigne que jeûner ne se limite pas au ventre : tout le corps doit jeûner. L'œil de ce qu'il ne doit pas voir, l'oreille de ce qu'elle ne doit pas entendre, la langue de ce qu'elle ne doit pas dire.`,
    citation: {
      author: "Coran",
      sourceRef: "Sourate Al-Baqara (2), verset 183",
      arabic:
        "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِنْ قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
      translationFr:
        "Ô vous qui croyez ! Le jeûne vous a été prescrit comme il a été prescrit à ceux qui vous ont précédés — afin que vous deveniez pieux.",
    },
    application:
      "Prépare ton Ramadan à l'avance : organise tes repas, planifie tes lectures du Coran (objectif : tout le Coran en 30 jours), évite les dépenses inutiles. Multiplie l'aumône et le Salaatu.",
    reminder: "Jeûner le corps, c'est libérer l'âme.",
  },

  {
    reference: "4.2",
    titleArabic: "مفطرات الصوم",
    intention:
      "Connaître ce qui rompt le jeûne, c'est protéger sa récompense. Voyons ensemble la liste à éviter.",
    content: `Plusieurs actes **rompent le jeûne** et requièrent un rattrapage (Qada'), parfois aussi une expiation (Kaffara) :

**Actes qui requièrent un simple rattrapage** (un jour pour un jour) :

1. **Manger ou boire** intentionnellement (même une petite quantité)
2. **Vomir** intentionnellement
3. **Avoir des écoulements séminaux** dus à des regards prolongés ou à un attouchement
4. **Survenue des menstrues** ou des lochies, même quelques minutes avant le Maghrib
5. **Apostasie** durant la journée (qu'Allah nous en préserve)

**Actes qui requièrent rattrapage ET expiation** (très grave) :

- **Relation conjugale** intentionnelle pendant le jeûne du Ramadan
- L'expiation est : libérer un esclave (impossible aujourd'hui) ; ou jeûner deux mois consécutifs ; ou nourrir soixante pauvres

**Actes qui n'annulent PAS le jeûne** (à connaître pour ne pas s'inquiéter inutilement) :

- Oublier et manger : on continue le jeûne, c'est Allah qui a nourri
- Rêver et avoir un écoulement séminal involontaire
- Se brosser les dents avec un Siwak (selon Mâlik) ou même avec un dentifrice à condition de ne rien avaler
- Avaler sa salive
- Faire ses ablutions (même si une goutte d'eau passe accidentellement)
- Se faire des injections non nutritives

Serigne Touba enseigne que la **médisance** (Ghiba) ne rompt pas techniquement le jeûne mais en diminue la récompense au point de la réduire à néant. "Combien de jeûneurs n'ont de leur jeûne que la faim et la soif" disait le Prophète ﷺ.`,
    citation: {
      author: "Le Prophète Muhammad ﷺ",
      sourceRef: "Rapporté par Al-Bukhari",
      arabic:
        "مَنْ لَمْ يَدَعْ قَوْلَ الزُّورِ وَالْعَمَلَ بِهِ، فَلَيْسَ لِلَّهِ حَاجَةٌ فِي أَنْ يَدَعَ طَعَامَهُ وَشَرَابَهُ",
      translationFr:
        "Celui qui ne renonce pas au mensonge et à l'agir selon lui — Allah n'a pas besoin qu'il renonce à sa nourriture et à sa boisson.",
    },
    application:
      "Garde un calendrier : si tu romps le jeûne pour une raison (maladie, voyage), note la date pour rattraper après le Ramadan. Évite absolument la médisance pendant le jeûne — c'est la première cause de récompense perdue.",
    reminder: "Le jeûne du corps est facile. Le jeûne de la langue est noble.",
  },

  {
    reference: "4.3",
    titleArabic: "الزكاة",
    intention:
      "La Zakat purifie la richesse et soulage les pauvres. C'est un droit, pas une charité.",
    content: `La **Zakat** (aumône légale) est le troisième pilier de l'Islam. Le mot signifie à la fois "purification" et "croissance" : en donnant, on purifie sa richesse, et celle-ci croît en baraka.

**Conditions d'obligation** :

1. Être **musulman** libre
2. Posséder le **Nisab** (seuil minimal) sur l'année lunaire (Hawl)
3. Le bien doit être **fructifiant** (or, argent, monnaie, bétail, récoltes, marchandises commerciales)

**Le Nisab actuel** (équivalents approximatifs) :
- **Or** : 85 grammes (environ 5,000-6,000 €)
- **Argent** : 595 grammes
- **Monnaie** : équivalent au Nisab de l'or
- **Bétail** : seuils spécifiques par espèce

**Le taux de la Zakat** :
- 2,5% sur l'argent, l'or, les monnaies, les marchandises (un quarante-quatrième)
- 5% sur les récoltes irriguées artificiellement
- 10% sur les récoltes irriguées naturellement (pluie)
- Variable sur le bétail

**Bénéficiaires** (huit catégories selon Coran 9:60) :
1. Les pauvres (Fuqara)
2. Les nécessiteux (Masakin)
3. Les agents de collecte
4. Ceux dont les cœurs sont à rallier à l'Islam
5. Le rachat des prisonniers
6. Les endettés
7. Pour la cause d'Allah (Fi Sabilillah)
8. Les voyageurs en détresse

Serigne Touba enseigne dans le Tazawwud que la Zakat n'est pas un don du riche au pauvre : c'est **un droit** que le pauvre a sur la richesse du riche. Allah a confié les richesses pour les redistribuer.`,
    citation: {
      author: "Coran",
      sourceRef: "Sourate At-Tawba (9), verset 103",
      arabic:
        "خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِمْ بِهَا",
      translationFr:
        "Prélève de leurs biens une aumône par laquelle tu les purifies et les bénis.",
    },
    application:
      "Calcule ta Zakat chaque année à date fixe (par exemple : début Ramadan, ou ton anniversaire). Privilégie de la verser aux pauvres de ta famille en premier, puis aux nécessiteux de ta communauté, puis aux autres causes.",
    reminder: "Donner, c'est purifier. Refuser, c'est se priver.",
  },

  {
    reference: "4.4",
    titleArabic: "الحج",
    intention:
      "Le pèlerinage est le voyage d'une vie. Préparons-nous spirituellement à cette ascension.",
    content: `Le **Hajj** (pèlerinage à La Mecque) est le cinquième pilier de l'Islam, obligatoire **une fois dans la vie** pour celui qui en a les moyens physiques et financiers (Istita'a).

**Conditions d'obligation** :
1. Être **musulman** libre, pubère, sain d'esprit
2. Avoir la **capacité physique** de voyager et d'accomplir les rites
3. Avoir la **capacité financière** : les frais du voyage et la subsistance de la famille restée
4. La **sécurité** du voyage

**Les piliers** (Arkan) du Hajj sont quatre selon l'école Malikite :

1. **Ihram** : l'entrée en état de consécration depuis le Miqat (lieu fixé), avec l'intention et le port du vêtement spécifique pour les hommes (deux pièces blanches non cousues)

2. **Tawaf al-Ifada** : les sept tours autour de la Kaaba après la station d'Arafat

3. **Sa'y** : les sept allers-retours entre les monts Safa et Marwa

4. **Wuquf à 'Arafat** : la **station** sur le mont Arafat le 9 Dhul-Hijja, du midi au coucher du soleil. C'est le **pilier majeur** : "Le Hajj, c'est Arafat" (Hadith).

S'y ajoutent les **rites obligatoires** : passer la nuit à Muzdalifa, lapider les stèles à Mina, sacrifier une bête (Hady), se raser ou se couper les cheveux, le Tawaf d'adieu.

**'Umra** (la petite visite) peut être accomplie n'importe quand dans l'année. Elle comprend l'Ihram, le Tawaf, le Sa'y et la coupe des cheveux.

Serigne Touba dans le Tazawwud rappelle que le Hajj est avant tout une **purification spirituelle** : "Celui qui accomplit le Hajj sans commettre d'obscénité ni de perversité revient comme le jour où sa mère l'a enfanté" (Hadith).`,
    citation: {
      author: "Coran",
      sourceRef: "Sourate Âl ʿImran (3), verset 97",
      arabic:
        "وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا",
      translationFr:
        "Allah a institué pour les hommes le pèlerinage de la Maison, à condition qu'ils en aient les moyens.",
    },
    application:
      "Si tu en as les moyens, n'attends pas trop longtemps : le Prophète ﷺ recommandait d'accomplir le Hajj rapidement. Mets de l'argent de côté chaque mois en intention de Hajj. Prie Allah de te faciliter ce voyage.",
    reminder: "Une fois dans la vie. Mais quelle vie !",
  },

  // ═══ MODULE 5 — ADAB & AKHLAQ ═══════════════════════════════════════

  {
    reference: "5.1",
    titleArabic: "الأخلاق اليومية",
    intention:
      "L'Islam n'est pas qu'une pratique ; c'est un comportement. Apprenons à vivre selon l'éthique du Prophète ﷺ.",
    content: `Les **Akhlaq** (caractères) et les **Adab** (comportements) constituent l'âme de l'Islam vécu. Le Prophète Muhammad ﷺ a dit : "Je n'ai été envoyé que pour parfaire les nobles caractères." (Bukhari, Adab al-Mufrad)

**Au lever** : prononcer la formule "Al-hamdulillah alladhi ahyana ba'da ma amatana wa ilayhin-nushur" (Louange à Allah qui nous a rendu la vie après nous avoir donné la mort, et vers Lui sera la résurrection).

**À table** : commencer par "Bismillah", manger avec la main droite, ne pas critiquer la nourriture (le Prophète ﷺ ne critiquait jamais), terminer par "Al-hamdulillah".

**En famille** : honorer ses parents (Birr al-Walidayn), être doux envers ses frères et sœurs, jouer avec ses enfants, respecter ses aînés.

**Avec les voisins** : "Quiconque croit en Allah et au Jour Dernier qu'il honore son voisin." (Bukhari)

**À la rue** : baisser le regard, saluer ceux qu'on connaît, sourire aux autres ("ton sourire à ton frère est une aumône"), aider qui demande aide.

**Au travail** : honnêteté absolue, ponctualité, respect des engagements, refus de la corruption.

**Le soir** : faire le bilan de sa journée, demander pardon pour ses manquements, planifier le lendemain, dormir sur le côté droit en mentionnant Allah.

Serigne Touba a enseigné dans son ouvrage **Massalik al-Jinan** (Les Itinéraires du Paradis) que les belles manières précèdent la connaissance. Sans Akhlaq, le savoir religieux devient orgueil.`,
    citation: {
      author: "Le Prophète Muhammad ﷺ",
      sourceRef: "Rapporté par Ahmad",
      arabic: "إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ",
      translationFr:
        "Je n'ai été envoyé que pour parfaire les nobles caractères.",
    },
    application:
      "Choisis chaque jour UN comportement à améliorer : le sourire, la patience, la ponctualité, etc. Observe-toi le soir : ai-je grandi aujourd'hui ?",
    reminder: "L'Islam ne se mesure pas en discours, mais en comportements.",
  },

  {
    reference: "5.2",
    titleArabic: "الأخلاق المحمودة",
    intention:
      "Cultivons les caractères que le Prophète ﷺ aimait — ils sont la voie vers Allah et vers son agrément.",
    content: `Les **caractères louables** (Akhlaq Mahmuda) sont innombrables. Voici les principaux que tout croyant doit cultiver :

1. **La sincérité** (Ikhlas) : agir uniquement pour Allah, sans rechercher l'éloge des gens.

2. **La véracité** (Sidq) : dire la vérité même quand elle dérange. Le mensonge est la racine de tous les vices.

3. **L'honnêteté** (Amana) : respecter les biens, les secrets et les engagements confiés.

4. **La patience** (Sabr) : face aux épreuves, à l'obéissance d'Allah (qui est dure), face à la désobéissance (s'en abstenir).

5. **La reconnaissance** (Shukr) : être reconnaissant à Allah pour Ses bienfaits, et aux personnes pour leur bonté.

6. **L'humilité** (Tawadu') : ne pas se croire au-dessus des autres. L'orgueil (Kibr) ferme les portes du Paradis.

7. **La générosité** (Karam) : donner sans compter, sans rappeler ses dons.

8. **La pudeur** (Hayâ) : la pudeur du corps, mais aussi du regard, de la parole, et du cœur devant Allah.

9. **La douceur** (Rifq) : "Quand la douceur entre quelque part, elle l'embellit ; quand on l'en retire, elle l'enlaidit." (Hadith)

10. **Le pardon** ('Afw) : pardonner à ceux qui nous offensent. Allah pardonne à qui pardonne.

Serigne Touba a écrit dans ses Khassidas : *"Celui qui veut être proche du Prophète ﷺ doit imiter son caractère, sa générosité, son humilité."*`,
    citation: {
      author: "Le Prophète Muhammad ﷺ",
      sourceRef: "Rapporté par At-Tirmidhi",
      arabic:
        "أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا",
      translationFr:
        "Les plus parfaits dans la foi sont les meilleurs de caractère.",
    },
    application:
      "Choisis un caractère par semaine. Cette semaine : la patience. La semaine prochaine : la pudeur. Etc. Construis-toi avec méthode.",
    reminder: "La foi se mesure aux caractères. Polis-les.",
  },

  {
    reference: "5.3",
    titleArabic: "الأخلاق المذمومة",
    intention:
      "Tout comme on cultive le bien, il faut désherber le mal. Voici les caractères à fuir absolument.",
    content: `Les **caractères blâmables** (Akhlaq Madhmuma) gangrènent l'âme. Le croyant doit les identifier et les combattre :

1. **L'orgueil** (Kibr) : se croire supérieur. Le Prophète ﷺ a dit : "Celui qui a un atome d'orgueil dans le cœur n'entrera pas au Paradis."

2. **L'ostentation** (Riya') : accomplir un acte pieux pour être vu des gens. C'est le **petit polythéisme**.

3. **L'envie** (Hasad) : désirer la disparition d'un bien chez autrui. "L'envie dévore les bonnes actions comme le feu dévore le bois sec."

4. **L'avarice** (Bukhl) : retenir sa richesse. Allah pardonne à l'avare seulement quand il donne.

5. **La médisance** (Ghiba) : parler de quelqu'un en son absence en disant ce qu'il déteste. Plus grave : la **calomnie** (Buhtan), inventer.

6. **Le mensonge** (Kadhib) : tous les mensonges sont interdits, sauf trois exceptions (réconcilier des gens, à son épouse pour son bien, en temps de guerre).

7. **Le rapportage** (Namima) : porter des paroles d'une personne à une autre pour créer la zizanie.

8. **La colère** (Ghadab) excessive : le Prophète ﷺ disait : "Ne te mets pas en colère, et le Paradis sera tien."

9. **Le mauvais soupçon** (Su' adh-Dhann) : penser négativement des autres sans preuve.

10. **L'impudeur** (Fahisha) : dans la parole, le regard, le comportement.

Serigne Touba enseigne dans le Tazawwud que la lutte contre l'ego (Jihad an-Nafs) est le **plus grand combat**. Plus grand que la guerre physique.`,
    citation: {
      author: "Le Prophète Muhammad ﷺ",
      sourceRef: "Rapporté par Muslim",
      arabic: "إِيَّاكُمْ وَالظَّنَّ، فَإِنَّ الظَّنَّ أَكْذَبُ الْحَدِيثِ",
      translationFr:
        "Méfiez-vous du soupçon, car le soupçon est la pire des paroles.",
    },
    application:
      "Quand l'orgueil te monte, rappelle-toi de ton origine (une goutte) et de ta fin (la poussière). Quand l'envie te ronge, prie pour celui que tu envies. Quand la médisance s'invite, change de sujet ou pars.",
    reminder: "Chasse l'ombre du cœur, la lumière y entrera.",
  },

  {
    reference: "5.4",
    titleArabic: "بر الوالدين",
    intention:
      "Le devoir envers les parents est le premier devoir social du croyant. Cultivons cette piété filiale.",
    content: `Allah a placé l'obéissance et la bonté envers les parents juste après Son adoration. Dans le Coran : *"Adorez Allah et ne Lui associez rien. Et soyez bons envers vos père et mère..."* (4:36)

Les **devoirs envers les parents** :

1. **L'obéissance** dans tout ce qui n'est pas désobéissance à Allah. Si les parents ordonnent un péché, on désobéit, mais sans manquer de respect.

2. **La parole douce** : ne jamais leur dire "Ouf !" (Coran 17:23), encore moins les contredire avec vigueur.

3. **L'aide pratique** : les soulager dans leurs tâches, particulièrement quand ils vieillissent.

4. **Le soutien financier** : si on a les moyens et qu'ils en ont besoin, on doit donner.

5. **La présence** : leur rendre visite régulièrement quand on vit loin.

6. **L'invocation** : invoquer Allah pour eux, particulièrement la formule "Rabbi-ghfir li wa li walidayya" (Mon Seigneur, pardonne-moi et à mes parents).

7. **Honorer leurs amis** après leur mort, et leur rendre visite à leur tombe.

**Envers la mère**, le devoir est triple. Un homme demanda au Prophète ﷺ : "Qui mérite le plus ma bonne compagnie ?" Il répondit : "Ta mère." — "Et ensuite ?" — "Ta mère." — "Et ensuite ?" — "Ta mère." — "Et ensuite ?" — "Ton père." (Bukhari et Muslim)

**Envers les aînés** en général : la communauté musulmane est une grande famille. Le Prophète ﷺ a dit : "N'est pas des nôtres celui qui n'est pas miséricordieux envers nos jeunes et ne respecte pas nos aînés."

Serigne Touba a écrit des poèmes magnifiques sur l'amour filial. Il rappelait constamment à ses disciples l'importance de respecter parents et aînés.`,
    citation: {
      author: "Coran",
      sourceRef: "Sourate Al-Isra' (17), versets 23-24",
      arabic:
        "وَقَضَى رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا ۚ إِمَّا يَبْلُغَنَّ عِنْدَكَ الْكِبَرَ أَحَدُهُمَا أَوْ كِلَاهُمَا فَلَا تَقُلْ لَهُمَا أُفٍّ وَلَا تَنْهَرْهُمَا وَقُلْ لَهُمَا قَوْلًا كَرِيمًا",
      translationFr:
        "Ton Seigneur a décrété : 'N'adorez que Lui ; et marquez de la bonté envers les père et mère.' Si l'un d'eux ou tous deux doivent atteindre la vieillesse auprès de toi, alors ne leur dis point 'Ouf !' et ne les brusque pas, mais adresse-leur des paroles respectueuses.",
    },
    application:
      "Appelle tes parents au moins une fois par semaine si tu vis loin. Si tu vis avec eux, accomplis chaque jour un petit geste pour eux. Invoque Allah pour eux après chaque prière.",
    reminder: "Le Paradis est aux pieds des mères.",
  },

  // ═══ MODULE 6 — LA SALAATU SUR LE PROPHÈTE ﷺ ════════════════════════

  {
    reference: "6.1",
    titleArabic: "الأمر الإلهي",
    intention:
      "Au nom d'Allah le Très-Miséricordieux. Méditons ensemble sur ce verset fondateur du Coran qui établit la Salaatu sur le Prophète Muhammad ﷺ comme un commandement divin direct.",
    content: `Dans la sourate Al-Ahzâb, au verset 56, Allah s'adresse directement aux croyants par une parole d'une portée immense. Il révèle un acte qu'Il accomplit Lui-même, accompagné de Ses anges : la prière sur le Prophète Muhammad ﷺ.

Cette révélation est **unique dans le Coran**. Allah ne se contente pas de recommander la Salaatu : Il commande aux croyants de l'accomplir comme une obligation spirituelle continue.

Quand Allah "prie" (Yusalli) sur le Prophète, le sens diffère de notre prière à nous : c'est la **louange divine** dans le monde élevé. Quand les anges "prient" sur lui, c'est leur **invocation** pour son élévation. Et quand nous, simples humains, prions sur lui, c'est notre **invocation** demandant à Allah de l'honorer et de le rapprocher davantage.

Serigne Touba, dans le Tazawwud et dans ses Khassidas, insiste sur la centralité de cet acte. Prier sur le Prophète ﷺ n'est pas un simple rituel : c'est une **connexion directe** entre le croyant, le Prophète et Allah.

Au sein du Dahira KSN (Kippangog Salaatu ʿAlaa Nabii), cette parole guide chacune de nos activités : compteur communautaire, Journée annuelle, application mobile, tout est ordonné à multiplier ces Salaatu. Notre Dahira existe **pour exécuter ce commandement divin**.`,
    citation: {
      author: "Allah le Très-Haut",
      sourceRef: "Coran, Sourate Al-Ahzâb (33), verset 56",
      arabic:
        "إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا",
      translationFr:
        "Certes, Allah et Ses anges prient sur le Prophète. Ô vous qui croyez, priez sur lui et adressez-lui vos salutations.",
    },
    application:
      "Adopte l'habitude de réciter le Salaatu après chaque prière obligatoire. Télécharge l'application KSN pour compter tes Salaatu et contribuer au Challenge 1 Milliard. Récite en groupe lors des rencontres du Dahira pour multiplier la baraka.",
    reminder: "Allah et Ses anges prient sur le Prophète. Joins-toi à eux.",
  },

  {
    reference: "6.2",
    titleArabic: "فضائل الصلاة على النبي ﷺ",
    intention:
      "Les vertus de la Salaatu sur le Prophète ﷺ sont innombrables. Découvrons les promesses divines qui l'accompagnent.",
    content: `Les hadiths authentiques regorgent de promesses pour ceux qui multiplient la Salaatu sur le Prophète Muhammad ﷺ. En voici quelques-unes :

**La récompense décuplée** : "Quiconque prie sur moi une fois, Allah prie sur lui dix fois." (Muslim) Cette promesse est extraordinaire : un seul Salaatu te vaut **dix prières divines** en ta faveur.

**La proximité au Jour du Jugement** : "Les plus proches de moi au Jour de la Résurrection seront ceux qui auront le plus prié sur moi." (At-Tirmidhi)

**L'élévation des degrés** : à chaque Salaatu, Allah élève le croyant d'un degré au Paradis, lui efface une faute et lui inscrit dix bonnes actions.

**L'effacement des péchés** : la Salaatu est une cause majeure de pardon des péchés mineurs.

**La satisfaction des besoins** : un homme demanda au Prophète ﷺ : "Et si je consacre tout mon temps à la Salaatu sur toi ?" Il répondit : "Alors Allah suffira à tes soucis et tes péchés te seront pardonnés." (At-Tirmidhi)

**La présence du Prophète ﷺ** : il a dit : "Multipliez la Salaatu sur moi le vendredi, car votre prière m'est présentée." (Abu Dawud)

**La transmission directe** : "Là où vous soyez, votre prière sur moi me parvient." (Hadith)

Serigne Touba multipliait personnellement le Salaatu jusqu'à des milliers de fois par jour. Il enseignait à ses disciples que **le Salaatu est la voie la plus courte pour parvenir à Allah** : on passe par le Prophète, Bien-Aimé d'Allah, et l'amour divin nous enveloppe.

Le Challenge 1 Milliard du Dahira KSN s'appuie sur cette logique : mathématiquement, un milliard de Salaatu génère **dix milliards de prières divines** sur la communauté.`,
    citation: {
      author: "Le Prophète Muhammad ﷺ",
      sourceRef: "Rapporté par Muslim",
      arabic:
        "مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا",
      translationFr:
        "Celui qui prie sur moi une fois, Allah prie sur lui dix fois.",
    },
    application:
      "Fixe-toi un quota quotidien minimum : 100 Salaatu par jour pour commencer. Utilise l'application KSN pour compter. Multiplie le vendredi (jour le plus béni pour la Salaatu).",
    reminder: "Une Salaatu = dix prières divines. Multiplie sans hésiter.",
  },

  {
    reference: "6.3",
    titleArabic: "صيغ الصلاة المأثورة",
    intention:
      "Le Prophète ﷺ a lui-même enseigné les formules de Salaatu à ses compagnons. Apprenons-les avec respect.",
    content: `Le Prophète Muhammad ﷺ a transmis plusieurs formules de Salaatu, dont la plus connue est la **Salat Ibrahimiya**, récitée dans chaque prière au Tashahhud final.

**Formule complète de la Salat Ibrahimiya** :

اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ
اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ

**Traduction** :
*"Ô Allah, prie sur Muhammad et sur la famille de Muhammad, comme Tu as prié sur Ibrahim et sur la famille d'Ibrahim, Tu es certes Digne de louange et de Gloire. Ô Allah, bénis Muhammad et la famille de Muhammad, comme Tu as béni Ibrahim et la famille d'Ibrahim, Tu es certes Digne de louange et de Gloire."*

**Formule courte** (utilisée dans le compteur de l'app KSN et acceptée par tous) :

اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ
*"Ô Allah, prie sur notre Maître Muhammad."*

**Formule très simple** :
صَلَّى اللَّهُ عَلَى مُحَمَّدٍ
*"Qu'Allah prie sur Muhammad."*

**La Salat Fatih** d'Imam Bekri (transmise dans la tradition mouride) :
اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ، وَالْخَاتِمِ لِمَا سَبَقَ، نَاصِرِ الْحَقِّ بِالْحَقِّ، وَالْهَادِي إِلَى صِرَاطِكَ الْمُسْتَقِيمِ

**Quand et comment réciter** :
- **Après chaque prière obligatoire** (Sunna fortement recommandée)
- **Le vendredi** en abondance, particulièrement entre 'Asr et Maghrib
- **Au début et à la fin de toute invocation** (Du'a)
- **À la mention du nom** du Prophète ﷺ

Serigne Touba enseigne que **la formule courte récitée beaucoup vaut mieux** que la formule longue récitée peu. C'est la régularité qui compte.`,
    citation: {
      author: "Le Prophète Muhammad ﷺ",
      sourceRef: "Rapporté par Al-Bukhari",
      arabic:
        "قُولُوا اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
      translationFr:
        "Dites : 'Ô Allah, prie sur Muhammad et sur la famille de Muhammad, comme Tu as prié sur la famille d'Ibrahim, Tu es certes Digne de louange et de Gloire.'",
    },
    application:
      "Apprends par cœur la Salat Ibrahimiya (utilisée dans la prière). Mémorise au moins une formule courte pour la répéter en abondance. Récite la Salat Fatih si tu es initié à la voie mouride.",
    reminder: "Le Prophète ﷺ a enseigné comment prier sur lui. Suivons sa voie.",
  },

  {
    reference: "6.4",
    titleArabic: "الصلاة الجماعية على النبي",
    intention:
      "La Salaatu se renforce dans le groupe. C'est le sens même du Dahira KSN : multiplier l'effort par la baraka collective.",
    content: `Bien que la Salaatu sur le Prophète ﷺ soit accessible individuellement à tout moment, la **pratique communautaire** lui confère une dimension spirituelle exceptionnelle.

**Pourquoi prier ensemble ?**

Le Prophète ﷺ a enseigné que la prière en groupe est **vingt-sept fois supérieure** à la prière individuelle (Bukhari et Muslim). Cette multiplication s'applique au Salaatu également.

L'Islam place le **culte collectif** au cœur de la spiritualité :
- Les cinq prières quotidiennes en mosquée
- Les prières du vendredi en assemblée
- Les deux fêtes ('Id) accomplies en groupe
- Le Hajj : le plus grand rassemblement musulman
- Les Dahira : cellules locales de spiritualité collective

**Le Dahira Kippangog Salaatu ʿAlaa Nabii** (KSN) incarne cette dimension communautaire spécifiquement pour la Salaatu :

1. **Compteur live mondial** : chaque membre récite et compte ses Salaatu. Tous les comptes se cumulent en un grand total visible en temps réel. Cela transforme un acte individuel en mouvement collectif.

2. **Journée annuelle** : le 26 décembre (ou date fixée par le Khalife), tous se réunissent à Touba pour un Dhikr collectif géant.

3. **Challenge 1 Milliard** : l'objectif spirituel partagé qui unit la oumma autour d'un même chiffre, d'un même rêve.

4. **Application mobile** : la baraka technologique au service de la Sunna. Chaque récitation compte pour soi et pour la communauté.

**L'enseignement de Serigne Touba** : *"L'effort individuel est multiplié par la baraka du groupe."* Un milliard de Salaatu, c'est **impossible seul** — mais ensemble, sous l'autorité spirituelle du Dahira et avec la permission d'Allah, ce défi devient réalité.

Au Jour du Jugement, le Prophète ﷺ reconnaîtra ceux qui ont prié sur lui. Et la oumma KSN, **comptée, structurée, fidèle**, comptera parmi ses bien-aimés Inch'Allah.`,
    citation: {
      author: "Le Prophète Muhammad ﷺ",
      sourceRef: "Rapporté par Al-Bukhari et Muslim",
      arabic:
        "صَلَاةُ الْجَمَاعَةِ تَفْضُلُ صَلَاةَ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً",
      translationFr:
        "La prière en groupe est supérieure à la prière individuelle de vingt-sept degrés.",
    },
    application:
      "Rejoins le Dahira KSN si ce n'est pas déjà fait. Télécharge l'app pour participer au compteur. Inscris-toi à la Journée Salaatu du 26 décembre 2026 à Touba. Invite tes proches à rejoindre le mouvement.",
    reminder: "Seul, on prie. Ensemble, on transforme le monde.",
  },
];
