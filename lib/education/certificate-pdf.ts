/**
 * Génération du certificat PDF "Tazawwud complété" — côté client.
 *
 * Conditions d'usage :
 *  - L'apprenant DOIT avoir une certification dont le statut est
 *    "oral_passed" (validation orale par la Commission Éducation).
 *  - Le PDF inclut le numéro de certificat (KSN-TZW-YYYY-XXXXXX)
 *    + le nom de l'examinateur — garde-fou contre les téléchargements
 *    non autorisés.
 */
import jsPDF from "jspdf";
import type { EducationCertification } from "@/lib/admin-types";

type Options = {
  /** Date d'aujourd'hui formatée FR (ex: "28 mai 2026"). */
  issuedOn?: string;
};

const formatDateFr = (ms: number) =>
  new Date(ms).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/** Dessine un motif d'étoile à 8 branches (zellige) en filigrane. */
function drawStarOrnament(
  pdf: jsPDF,
  cx: number,
  cy: number,
  radius: number,
  color: [number, number, number]
) {
  pdf.setDrawColor(color[0], color[1], color[2]);
  pdf.setLineWidth(0.5);
  // 2 carrés superposés à 45°
  const half = radius;
  // carré 1
  pdf.lines(
    [
      [2 * half, 0],
      [0, 2 * half],
      [-2 * half, 0],
      [0, -2 * half],
    ],
    cx - half,
    cy - half
  );
  // carré 2 (rotation 45°)
  const d = half * Math.SQRT2;
  pdf.lines(
    [
      [d, d],
      [-d, d],
      [-d, -d],
      [d, -d],
    ],
    cx,
    cy - d
  );
  // petit cercle central
  pdf.setFillColor(color[0], color[1], color[2]);
  pdf.circle(cx, cy, 2.2, "F");
}

export function generateTazawwudCertificate(
  cert: EducationCertification,
  opts: Options = {}
) {
  if (cert.status !== "oral_passed") {
    throw new Error(
      "Le certificat ne peut être généré qu'après validation orale par la Commission Éducation."
    );
  }
  if (!cert.certificateNumber) {
    throw new Error("Numéro de certificat manquant.");
  }

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const W = 297;
  const H = 210;

  // === Fond parchemin ===
  pdf.setFillColor(250, 247, 240); // #FAF7F0
  pdf.rect(0, 0, W, H, "F");

  // === Cadre or muté (double bordure) ===
  pdf.setDrawColor(201, 169, 97); // #C9A961
  pdf.setLineWidth(1.4);
  pdf.rect(10, 10, W - 20, H - 20);
  pdf.setLineWidth(0.4);
  pdf.rect(14, 14, W - 28, H - 28);

  // === Étoiles d'angle ===
  drawStarOrnament(pdf, 22, 22, 7, [201, 169, 97]);
  drawStarOrnament(pdf, W - 22, 22, 7, [201, 169, 97]);
  drawStarOrnament(pdf, 22, H - 22, 7, [201, 169, 97]);
  drawStarOrnament(pdf, W - 22, H - 22, 7, [201, 169, 97]);

  // === Bismillah arabe (à défaut de police arabe, on met le texte translittéré) ===
  pdf.setTextColor(107, 46, 46); // #6B2E2E
  pdf.setFont("times", "italic");
  pdf.setFontSize(13);
  pdf.text("Bismi-Llâhi-r-Rahmâni-r-Rahîm", W / 2, 32, {
    align: "center",
  });

  // === Bandeau "Dahira KSN" ===
  pdf.setTextColor(6, 78, 59); // #064E3B
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("KIPPANGOG SALAATU 'ALAA NABII (KSN)", W / 2, 42, {
    align: "center",
  });
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("Touba, Sénégal · Commission Éducation & Culture", W / 2, 48, {
    align: "center",
  });

  // === Titre principal "CERTIFICAT" ===
  pdf.setFont("times", "bold");
  pdf.setFontSize(40);
  pdf.setTextColor(6, 78, 59);
  pdf.text("CERTIFICAT", W / 2, 70, { align: "center" });

  pdf.setFont("times", "italic");
  pdf.setFontSize(16);
  pdf.setTextColor(201, 169, 97);
  pdf.text("d'Étude du Tazawwudu-ss-Sighar", W / 2, 80, {
    align: "center",
  });

  pdf.setFont("times", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(26, 22, 17, 0.7 as unknown as number);
  pdf.setTextColor(74, 74, 74);
  pdf.text(
    "Le Viatique des Adolescents de Cheikh Ahmadou Bamba (qu'Allah l'agrée)",
    W / 2,
    87,
    { align: "center" }
  );

  // === Ligne dorée ornementale ===
  pdf.setDrawColor(201, 169, 97);
  pdf.setLineWidth(0.8);
  pdf.line(80, 92, W - 80, 92);

  // === Corps : "Décerné à" ===
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(74, 74, 74);
  pdf.text("Le présent certificat est décerné à", W / 2, 104, {
    align: "center",
  });

  // === Nom ===
  pdf.setFont("times", "bold");
  pdf.setFontSize(28);
  pdf.setTextColor(6, 78, 59);
  pdf.text(cert.fullName.toUpperCase(), W / 2, 118, { align: "center" });

  // soulignement
  const nameWidth = pdf.getTextWidth(cert.fullName.toUpperCase());
  pdf.setLineWidth(0.4);
  pdf.line(
    W / 2 - nameWidth / 2,
    121,
    W / 2 + nameWidth / 2,
    121
  );

  // === Mention ===
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(74, 74, 74);
  const mention1 =
    "en reconnaissance de l'étude complète des six modules du Tazawwudu-ss-Sighar,";
  const mention2 =
    "et de la réussite de l'entretien oral conduit par la Commission Éducation du Dahira KSN.";
  pdf.text(mention1, W / 2, 132, { align: "center" });
  pdf.text(mention2, W / 2, 138, { align: "center" });

  // === Citation prophétique ===
  pdf.setFont("times", "italic");
  pdf.setFontSize(10);
  pdf.setTextColor(107, 46, 46);
  pdf.text(
    "« Celui qui prie sur moi une fois, Allah prie sur lui dix fois. »",
    W / 2,
    150,
    { align: "center" }
  );
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(120, 120, 120);
  pdf.text(
    "— Le Prophète Muhammad ﷺ (rapporté par Muslim)",
    W / 2,
    156,
    { align: "center" }
  );

  // === Pied de page : numéro + dates + signatures ===
  const baseY = 178;

  // Bloc gauche : N° + délivré le
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(201, 169, 97);
  pdf.text("N° DE CERTIFICAT", 30, baseY);
  pdf.setFont("courier", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(6, 78, 59);
  pdf.text(cert.certificateNumber, 30, baseY + 6);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(201, 169, 97);
  pdf.text("DÉLIVRÉ LE", 30, baseY + 14);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(26, 22, 17);
  pdf.text(
    opts.issuedOn || formatDateFr(cert.validatedAt || Date.now()),
    30,
    baseY + 19
  );

  // Bloc droit : examinateur
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(201, 169, 97);
  pdf.text("EXAMINATEUR — COMMISSION ÉDUCATION", W - 30, baseY, {
    align: "right",
  });
  pdf.setFont("times", "italic");
  pdf.setFontSize(13);
  pdf.setTextColor(6, 78, 59);
  pdf.text(cert.examinerName || "—", W - 30, baseY + 7, {
    align: "right",
  });

  // ligne signature
  pdf.setLineWidth(0.3);
  pdf.setDrawColor(150, 150, 150);
  pdf.line(W - 90, baseY + 12, W - 30, baseY + 12);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(120, 120, 120);
  pdf.text("Signature de la Commission", W - 30, baseY + 16, {
    align: "right",
  });

  if (cert.oralExamDate) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text(
      `Entretien oral du ${cert.oralExamDate}`,
      W - 30,
      baseY + 21,
      { align: "right" }
    );
  }

  // === Download ===
  pdf.save(
    `Certificat-Tazawwud-${cert.certificateNumber}-${cert.fullName
      .replace(/\s+/g, "-")
      .toLowerCase()}.pdf`
  );
}
