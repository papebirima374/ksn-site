// Génère une fiche PDF professionnelle de la liste des membres (logo KSN +
// en-tête, tableau paginé). Côté client uniquement (utilise fetch + jsPDF).
import { jsPDF } from "jspdf";
import type { Member } from "./admin-types";

const GREEN = "#0F7C55";
const GOLD = "#B8860B";
const GOLD_LIGHT = "#D4AF37";
const GRAY = "#666666";

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch("/logo/ksn-logo.png");
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

const STATUS_LABEL: Record<string, string> = {
  actif: "Actif",
  en_attente: "En attente",
  inactif: "Inactif",
};

function statusColor(s: string): [number, number, number] {
  if (s === "actif") return [15, 124, 85];
  if (s === "en_attente") return [184, 134, 11];
  return [150, 150, 150];
}

export async function exportMembersPdf(
  members: Member[],
  opts?: { filterLabel?: string }
): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth(); // 595
  const pageH = doc.internal.pageSize.getHeight(); // 842
  const margin = 40;
  const logo = await loadLogoDataUrl();

  // Colonnes : Matricule | Prénom & Nom | Téléphone | Ville | Statut
  const cols = [
    { key: "matricule", label: "Matricule", x: margin, w: 60 },
    { key: "nom", label: "Prénom & Nom", x: margin + 60, w: 185 },
    { key: "tel", label: "Téléphone", x: margin + 245, w: 120 },
    { key: "ville", label: "Ville / Localité", x: margin + 365, w: 100 },
    { key: "statut", label: "Statut", x: margin + 465, w: 50 },
  ];

  const headerH = 92;
  const rowH = 18;
  const tableTop = headerH + 24;
  const footerY = pageH - 28;
  const rowsPerPage = Math.floor((footerY - tableTop - rowH) / rowH);
  const totalPages = Math.max(1, Math.ceil(members.length / rowsPerPage));
  const now = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  function drawHeader(pageNum: number) {
    // Bandeau dégradé simulé (rectangle vert + filet or)
    doc.setFillColor(15, 124, 85);
    doc.rect(0, 0, pageW, headerH, "F");
    doc.setFillColor(184, 134, 11);
    doc.rect(0, headerH, pageW, 4, "F");

    if (logo) {
      try { doc.addImage(logo, "PNG", margin, 20, 52, 52); } catch { /* ignore */ }
    }
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Dahira Kippangog Salaatu 'Alaa Nabii", margin + 66, 38);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(232, 243, 238);
    doc.text("Liste officielle des membres", margin + 66, 54);
    doc.setFontSize(8.5);
    const sub = `${members.length} membre${members.length > 1 ? "s" : ""}` +
      (opts?.filterLabel ? ` — ${opts.filterLabel}` : "") +
      ` — ${now}`;
    doc.text(sub, margin + 66, 68);
    // URL à droite
    doc.setFontSize(8.5);
    doc.setTextColor(212, 175, 55);
    doc.text("salaatualaanabii.com", pageW - margin, 38, { align: "right" });

    // En-tête de tableau
    const ty = tableTop - 14;
    doc.setFillColor(248, 245, 239);
    doc.rect(margin, ty, pageW - margin * 2, rowH, "F");
    doc.setTextColor(15, 124, 85);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    for (const c of cols) {
      doc.text(c.label, c.x + 4, ty + 12);
    }
  }

  function drawFooter(pageNum: number) {
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, footerY - 8, pageW - margin, footerY - 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Document interne — confidentiel", margin, footerY);
    doc.text(`Page ${pageNum} / ${totalPages}`, pageW - margin, footerY, { align: "right" });
  }

  let row = 0;
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    if (pageNum > 1) doc.addPage();
    drawHeader(pageNum);
    drawFooter(pageNum);

    let y = tableTop + rowH;
    const slice = members.slice((pageNum - 1) * rowsPerPage, pageNum * rowsPerPage);
    for (const m of slice) {
      // Zébrage
      if (row % 2 === 1) {
        doc.setFillColor(250, 249, 246);
        doc.rect(margin, y - 12, pageW - margin * 2, rowH, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(40, 40, 40);

      const nom = `${m.prenom ?? ""} ${m.nom ?? ""}`.trim();
      doc.setTextColor(184, 134, 11);
      doc.setFont("helvetica", "bold");
      doc.text(`#${m.matricule ?? ""}`, cols[0].x + 4, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      doc.text(doc.splitTextToSize(nom, cols[1].w - 8)[0] ?? "", cols[1].x + 4, y);
      doc.text(m.telephone ?? "—", cols[2].x + 4, y);
      doc.text(
        doc.splitTextToSize(m.ville || m.domicile || "—", cols[3].w - 8)[0] ?? "—",
        cols[3].x + 4, y
      );
      const [r, g, bl] = statusColor(m.status);
      doc.setTextColor(r, g, bl);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text(STATUS_LABEL[m.status] ?? m.status, cols[4].x + 4, y);

      y += rowH;
      row++;
    }
  }

  const stamp = new Date().toISOString().slice(0, 10);
  doc.save(`membres-ksn-${stamp}.pdf`);
}
