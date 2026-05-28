/**
 * Diagramme pédagogique du Wudu (petite ablution) — étapes illustrées.
 * Source : Coran 5:6 + Sunna (Bukhârî / Muslim).
 */
import { DiagramSection, Icons, type DiagramStep } from "./diagram-primitives";

const STEPS: DiagramStep[] = [
  {
    num: 1,
    title: "L'intention (Niya)",
    arabic: "النية",
    text: "Dans le cœur : purifier ses membres pour Allah avant la prière. Sans prononcer à voix haute.",
    repeats: "1 fois",
    icon: Icons.niya,
  },
  {
    num: 2,
    title: "Bismillah + mains",
    arabic: "غسل اليدين",
    text: "Dire « Bismillâh ». Laver les deux mains jusqu'aux poignets en passant l'eau entre les doigts.",
    repeats: "× 3",
    icon: Icons.hands,
  },
  {
    num: 3,
    title: "Rinçage de la bouche",
    arabic: "المضمضة",
    text: "Prendre de l'eau dans la main droite, rincer la bouche puis recracher.",
    repeats: "× 3",
    icon: Icons.water,
  },
  {
    num: 4,
    title: "Aspiration nasale",
    arabic: "الاستنشاق",
    text: "Aspirer doucement l'eau par les narines avec la main droite, l'expulser avec la gauche.",
    repeats: "× 3",
    icon: Icons.water,
  },
  {
    num: 5,
    title: "Lavage du visage",
    arabic: "غسل الوجه",
    text: "Du haut du front au bas du menton, d'une oreille à l'autre. Frictionner avec les mains.",
    repeats: "× 3",
    icon: Icons.face,
  },
  {
    num: 6,
    title: "Lavage des bras",
    arabic: "غسل اليدين إلى المرفقين",
    text: "Bras DROIT d'abord, puis GAUCHE, jusqu'aux coudes inclus.",
    repeats: "× 3 chaque",
    icon: Icons.arms,
  },
  {
    num: 7,
    title: "Essuyage de la tête",
    arabic: "مسح الرأس",
    text: "Mouiller les mains, passer du front à la nuque en aller-retour, sans soulever.",
    repeats: "1 fois",
    icon: Icons.head,
  },
  {
    num: 8,
    title: "Essuyage des oreilles",
    arabic: "مسح الأذنين",
    text: "Index dans l'oreille interne, pouce derrière l'oreille externe. Geste continu après la tête.",
    repeats: "1 fois",
    icon: Icons.head,
  },
  {
    num: 9,
    title: "Lavage des pieds",
    arabic: "غسل الرجلين",
    text: "Pied DROIT d'abord, puis GAUCHE, jusqu'aux chevilles inclus, en passant entre les orteils.",
    repeats: "× 3 chaque",
    icon: Icons.feet,
  },
];

export default function WuduStepsDiagram() {
  return (
    <DiagramSection
      overline="Guide pratique illustré"
      title="Les 9 étapes du Wudu, en images"
      intro="Suis l'ordre. Chaque étape se fait calmement, en pleine conscience que tu te prépares à la rencontre divine."
      steps={STEPS}
      conclusion="Celui qui fait correctement les ablutions, ses péchés sortent de son corps, jusqu'à sortir de sous ses ongles."
      conclusionSource="Sahih Muslim"
    />
  );
}
