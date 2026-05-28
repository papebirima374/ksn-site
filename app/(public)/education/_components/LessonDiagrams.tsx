/**
 * Diagrammes pédagogiques pré-construits pour les leçons du Tazawwud.
 * Chacun couvre une référence précise (1.1, 2.3, etc.) et s'active
 * automatiquement via LessonIllustrations.tsx.
 */
import { DiagramSection, Icons, type DiagramStep } from "./diagram-primitives";

// ──────────────────────────────────────────────────────────────────────
// 1.1 — Les 5 piliers de l'Islam
// ──────────────────────────────────────────────────────────────────────
export function PiliersIslamDiagram() {
  const steps: DiagramStep[] = [
    {
      num: 1,
      title: "La Shahada",
      arabic: "الشهادة",
      text: "Témoigner qu'il n'y a de divinité qu'Allah, et que Muhammad ﷺ est Son Messager.",
      icon: Icons.shahada,
      tag: "Fondation",
    },
    {
      num: 2,
      title: "Le Salaat",
      arabic: "الصلاة",
      text: "Les cinq prières quotidiennes. Lien direct et obligatoire avec Allah.",
      icon: Icons.mosque,
    },
    {
      num: 3,
      title: "La Zakat",
      arabic: "الزكاة",
      text: "L'aumône légale : purification du patrimoine et solidarité avec les pauvres.",
      icon: Icons.coin,
    },
    {
      num: 4,
      title: "Le Sawm",
      arabic: "الصوم",
      text: "Le jeûne du mois de Ramadan : maîtrise de soi et rapprochement spirituel.",
      icon: Icons.fasting,
    },
    {
      num: 5,
      title: "Le Hajj",
      arabic: "الحج",
      text: "Le pèlerinage à La Mecque, au moins une fois pour qui le peut.",
      icon: Icons.kaaba,
    },
  ];
  return (
    <DiagramSection
      overline="Les fondations"
      title="Les 5 piliers de l'Islam"
      intro="Ces cinq actes sont les colonnes sur lesquelles tient l'édifice de notre pratique."
      steps={steps}
      conclusion="L'Islam est bâti sur cinq fondements : témoigner, prier, donner la zakat, jeûner Ramadan, et faire le pèlerinage."
      conclusionSource="Hadith de Jibrîl, Sahih al-Bukhârî"
    />
  );
}

// ──────────────────────────────────────────────────────────────────────
// 1.2 — Les 6 piliers de la Foi (Iman)
// ──────────────────────────────────────────────────────────────────────
export function PiliersImanDiagram() {
  const steps: DiagramStep[] = [
    {
      num: 1,
      title: "Croire en Allah",
      arabic: "الإيمان بالله",
      text: "L'Unique, le Créateur, sans associé ni image. Source de tout bien.",
      icon: Icons.niya,
    },
    {
      num: 2,
      title: "Aux Anges",
      arabic: "الإيمان بالملائكة",
      text: "Créatures de lumière, fidèles à Allah, jamais désobéissantes.",
      icon: Icons.angel,
    },
    {
      num: 3,
      title: "Aux Livres révélés",
      arabic: "الإيمان بالكتب",
      text: "Tawrat, Zabur, Injil et le Coran — dernier et préservé de toute altération.",
      icon: Icons.book,
    },
    {
      num: 4,
      title: "Aux Prophètes",
      arabic: "الإيمان بالرسل",
      text: "D'Adam à Muhammad ﷺ, sceau des prophètes. Tous porteurs du même message.",
      icon: Icons.person,
    },
    {
      num: 5,
      title: "Au Jour Dernier",
      arabic: "الإيمان باليوم الآخر",
      text: "Résurrection, jugement, paradis ou enfer. Toute âme rendra compte.",
      icon: Icons.star,
    },
    {
      num: 6,
      title: "Au Décret divin",
      arabic: "الإيمان بالقدر",
      text: "Le bien comme l'épreuve viennent d'Allah. La sérénité naît de cette confiance.",
      icon: Icons.scroll,
    },
  ];
  return (
    <DiagramSection
      overline="La foi intérieure"
      title="Les 6 piliers de la Foi (Iman)"
      intro="Si les piliers de l'Islam organisent la pratique, ceux de la foi en sont le fondement intérieur."
      steps={steps}
      conclusion="La Foi, c'est croire en Allah, en Ses anges, en Ses livres, en Ses messagers, au Jour Dernier, et au décret du bien et du mal."
      conclusionSource="Hadith de Jibrîl, Sahih Muslim"
    />
  );
}

// ──────────────────────────────────────────────────────────────────────
// 2.3 — Ghusl (grande ablution)
// ──────────────────────────────────────────────────────────────────────
export function GhuslStepsDiagram() {
  const steps: DiagramStep[] = [
    {
      num: 1,
      title: "L'intention (Niya)",
      arabic: "النية",
      text: "Dans le cœur : se purifier de l'impureté majeure pour Allah.",
      repeats: "1 fois",
      icon: Icons.niya,
    },
    {
      num: 2,
      title: "Lavage des mains",
      arabic: "غسل اليدين",
      text: "Bismillah. Laver les mains jusqu'aux poignets en commençant par la droite.",
      repeats: "× 3",
      icon: Icons.hands,
    },
    {
      num: 3,
      title: "Parties intimes",
      arabic: "غسل الفرج",
      text: "Avec la main gauche, laver soigneusement les parties intimes.",
      repeats: "Bien",
      icon: Icons.water,
    },
    {
      num: 4,
      title: "Wudu complet",
      arabic: "الوضوء",
      text: "Faire les ablutions comme pour la prière — sauf les pieds, gardés pour la fin.",
      repeats: "Comme prière",
      icon: Icons.face,
    },
    {
      num: 5,
      title: "Eau sur la tête",
      arabic: "إفاضة الماء على الرأس",
      text: "Verser de l'eau trois fois sur la tête en frictionnant le cuir chevelu et la racine des cheveux.",
      repeats: "× 3",
      icon: Icons.head,
    },
    {
      num: 6,
      title: "Sur tout le corps",
      arabic: "غسل سائر الجسد",
      text: "Verser sur le côté droit puis le gauche, en s'assurant qu'aucun endroit ne reste sec. Terminer par les pieds.",
      repeats: "Tout le corps",
      icon: Icons.body,
    },
  ];
  return (
    <DiagramSection
      overline="Grande ablution"
      title="Les 6 étapes du Ghusl"
      intro="Le Ghusl est obligatoire après la grande impureté, le cycle féminin et l'accouchement."
      steps={steps}
      conclusion="Si vous êtes en état d'impureté majeure, purifiez-vous (par un bain complet)."
      conclusionSource="Coran 5:6"
    />
  );
}

// ──────────────────────────────────────────────────────────────────────
// 2.4 — Tayammum (ablutions sèches)
// ──────────────────────────────────────────────────────────────────────
export function TayammumStepsDiagram() {
  const steps: DiagramStep[] = [
    {
      num: 1,
      title: "L'intention (Niya)",
      arabic: "النية",
      text: "Dans le cœur : remplacer le Wudu (ou le Ghusl) par le Tayammum, faute d'eau utilisable.",
      repeats: "1 fois",
      icon: Icons.niya,
    },
    {
      num: 2,
      title: "Frapper la terre",
      arabic: "ضرب التراب",
      text: "Poser les deux mains à plat sur une surface terreuse, sableuse, ou un mur poussiéreux propre. Bismillah.",
      repeats: "1 fois",
      icon: Icons.earth,
    },
    {
      num: 3,
      title: "Essuyer le visage",
      arabic: "مسح الوجه",
      text: "Passer les paumes sur tout le visage, du front au menton, et d'une oreille à l'autre.",
      repeats: "1 fois",
      icon: Icons.face,
    },
    {
      num: 4,
      title: "Essuyer les bras",
      arabic: "مسح اليدين",
      text: "La main gauche essuie le bras droit (du poignet au coude), puis la droite essuie le gauche.",
      repeats: "1 fois",
      icon: Icons.arms,
    },
  ];
  return (
    <DiagramSection
      overline="Purification sèche"
      title="Les 4 étapes du Tayammum"
      intro="Quand l'eau manque, est inaccessible ou nuisible à la santé, Allah dans Sa miséricorde a permis cette purification symbolique."
      steps={steps}
      columns={2}
      conclusion="Si vous ne trouvez pas d'eau, recourez à de la bonne terre, passez-en sur vos visages et vos mains."
      conclusionSource="Coran 4:43"
    />
  );
}

// ──────────────────────────────────────────────────────────────────────
// 3.1 — Les 5 prières quotidiennes
// ──────────────────────────────────────────────────────────────────────
export function CinqPrieresDiagram() {
  const steps: DiagramStep[] = [
    {
      num: 1,
      title: "Soubh (Fajr)",
      arabic: "الصبح",
      text: "À l'aube, avant le lever du soleil. 2 rak'at.",
      repeats: "2 rak'at",
      icon: Icons.sunrise,
    },
    {
      num: 2,
      title: "Tisbar (Dhuhr)",
      arabic: "الظهر",
      text: "Quand le soleil décline du zénith vers l'ouest. 4 rak'at.",
      repeats: "4 rak'at",
      icon: Icons.sun,
    },
    {
      num: 3,
      title: "Takkusan (Asr)",
      arabic: "العصر",
      text: "L'après-midi, quand l'ombre est aussi longue que l'objet. 4 rak'at.",
      repeats: "4 rak'at",
      icon: Icons.sun,
    },
    {
      num: 4,
      title: "Timis (Maghrib)",
      arabic: "المغرب",
      text: "Juste après le coucher du soleil. 3 rak'at.",
      repeats: "3 rak'at",
      icon: Icons.sunrise,
    },
    {
      num: 5,
      title: "Geewë (Isha)",
      arabic: "العشاء",
      text: "À la nuit tombée, jusqu'à la moitié de la nuit. 4 rak'at.",
      repeats: "4 rak'at",
      icon: Icons.moon,
    },
  ];
  return (
    <DiagramSection
      overline="Le rendez-vous quotidien"
      title="Les 5 prières du jour"
      intro="Cinq fois par jour, Allah nous appelle. Ces rendez-vous structurent notre temps et nos cœurs."
      steps={steps}
      conclusion="La prière est, parmi les œuvres, ce qu'Allah aime le plus à son temps fixé."
      conclusionSource="Sahih al-Bukhârî"
    />
  );
}

// ──────────────────────────────────────────────────────────────────────
// 4.4 — Hajj (le pèlerinage)
// ──────────────────────────────────────────────────────────────────────
export function HajjDiagram() {
  const steps: DiagramStep[] = [
    {
      num: 1,
      title: "Ihram",
      arabic: "الإحرام",
      text: "L'état sacré : intention + tenue blanche simple. Au-delà du Mîqât, certaines actions deviennent interdites.",
      icon: Icons.person,
      tag: "État sacré",
    },
    {
      num: 2,
      title: "Tawaf",
      arabic: "الطواف",
      text: "Sept tours autour de la Kaaba, dans le sens inverse des aiguilles d'une montre, en invoquant Allah.",
      repeats: "× 7 tours",
      icon: Icons.kaaba,
    },
    {
      num: 3,
      title: "Sa'i",
      arabic: "السعي",
      text: "Sept allers-retours entre les collines de Safa et Marwa, en mémoire de la quête d'eau de Hajar.",
      repeats: "× 7",
      icon: Icons.person,
    },
    {
      num: 4,
      title: "Wuqûf à Arafat",
      arabic: "الوقوف بعرفة",
      text: "Station debout à Arafat, du midi au coucher du soleil le 9 Dhu al-Hijja. C'est le cœur du Hajj.",
      icon: Icons.sun,
      tag: "Cœur du Hajj",
    },
    {
      num: 5,
      title: "Lapidation à Mina",
      arabic: "رمي الجمرات",
      text: "Jet symbolique de sept cailloux contre chacune des trois stèles représentant Shaytan.",
      repeats: "× 7 cailloux",
      icon: Icons.star,
    },
  ];
  return (
    <DiagramSection
      overline="Le voyage d'une vie"
      title="Les grandes étapes du Hajj"
      intro="Le pèlerinage à La Mecque, au moins une fois pour qui le peut. Une ascension intérieure autant que physique."
      steps={steps}
      conclusion="Quiconque accomplit le Hajj sans relations charnelles ni commettre de péché, revient pur comme au jour de sa naissance."
      conclusionSource="Sahih al-Bukhârî"
    />
  );
}
