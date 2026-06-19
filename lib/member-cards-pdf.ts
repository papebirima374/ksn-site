// Génère une planche PDF de cartes de membre prêtes à découper :
// 10 cartes par page A4 (2 colonnes × 5 rangées), au format réel CR-80
// (85,6 × 53,98 mm), avec un fin trait de découpe autour de chaque carte.
// Les cartes sont capturées depuis le DOM (composant MemberCard) via html2canvas.
import { jsPDF } from "jspdf";
// html2canvas-pro : fork compatible avec les couleurs CSS modernes (oklch/lab)
// générées par Tailwind v4 (html2canvas classique échoue dessus).
import html2canvas from "html2canvas-pro";

const A4_W = 210;
const A4_H = 297;
const CARD_W = 85.6;
const CARD_H = 53.98;
const COLS = 2;
const ROWS = 5;
const PER_PAGE = COLS * ROWS;
const GAP_X = 4;
const GAP_Y = 3;

export async function buildMemberCardsPdf(
  nodes: HTMLElement[],
  onProgress?: (done: number, total: number) => void
): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const gridW = COLS * CARD_W + (COLS - 1) * GAP_X;
  const gridH = ROWS * CARD_H + (ROWS - 1) * GAP_Y;
  const offX = (A4_W - gridW) / 2;
  const offY = (A4_H - gridH) / 2;

  for (let i = 0; i < nodes.length; i++) {
    const idx = i % PER_PAGE;
    if (i > 0 && idx === 0) doc.addPage();

    const canvas = await html2canvas(nodes[i], {
      scale: 3,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });
    const img = canvas.toDataURL("image/jpeg", 0.92);

    const col = idx % COLS;
    const row = Math.floor(idx / COLS);
    const x = offX + col * (CARD_W + GAP_X);
    const y = offY + row * (CARD_H + GAP_Y);

    doc.addImage(img, "JPEG", x, y, CARD_W, CARD_H);
    // Trait de découpe (cadre fin gris clair)
    doc.setDrawColor(170, 170, 170);
    doc.setLineWidth(0.1);
    doc.rect(x, y, CARD_W, CARD_H);

    onProgress?.(i + 1, nodes.length);
  }

  doc.save(`cartes-membres-ksn-${new Date().toISOString().slice(0, 10)}.pdf`);
}
