"use client";

import { useEffect, useState } from "react";
import { FaFilePdf, FaDownload } from "react-icons/fa6";
import { listOfficialDocuments } from "@/lib/admin-data";

type DocumentItem = {
  title: string;
  filename: string;
  size: string;
  description: string;
  downloadUrl: string;
};

// Placeholders affiches si Firestore est vide. Une fois que l'admin
// uploade des PDF via /admin/documents, ils remplacent ces fallbacks.
const PLACEHOLDERS: DocumentItem[] = [
  {
    title: "Règlement Intérieur & Statuts",
    filename: "reglement-statuts-ksn.pdf",
    size: "2.0 Mo",
    description:
      "Les règles fondamentales du Dahira KSN, les principes d'adhésion, de cotisation, la charte de conduite et la constitution officielle.",
    downloadUrl: "/documents/reglement-statuts-ksn.pdf",
  },
  {
    title: "Plans d'Actions KSN",
    filename: "plans-actions-ksn.pdf",
    size: "1.9 Mo",
    description:
      "Le document de cadrage stratégique décrivant les objectifs annuels des commissions, le plan de développement et les projets d'avenir.",
    downloadUrl: "/documents/plans-actions-ksn.pdf",
  },
];

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${bytes} o`;
}

export default function DocumentsTelechargement() {
  const [items, setItems] = useState<DocumentItem[]>(PLACEHOLDERS);

  // Fetch Firestore au mount. Si > 0 entrees visibles, remplace les placeholders.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await listOfficialDocuments();
        if (cancelled) return;
        const visible = remote
          .filter((d) => d.visible)
          .sort((a, b) => a.order - b.order)
          .map((d) => ({
            title: d.title,
            filename: d.filename,
            size: formatSize(d.sizeBytes),
            description: d.description,
            downloadUrl: d.url,
          }));
        if (visible.length > 0) setItems(visible);
      } catch {
        // Silencieux : conserve les placeholders en cas d'erreur
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-white rounded-[28px] sm:rounded-[40px] p-6 sm:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[#B8860B] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-semibold text-xs sm:text-sm">
            Ressources & Transparence
          </span>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F7C55]">
            Documents Officiels KSN
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Consultez et téléchargez les documents de référence qui régissent l&apos;organisation et le fonctionnement du Dahira Kippangog Salaatu &apos;Alaa Nabii.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {items.map((doc) => (
            <div
              key={doc.title + doc.filename}
              className="bg-[#F8F5EF] rounded-2xl p-6 sm:p-8 border border-[#0F7C55]/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 text-2xl shadow-sm">
                    <FaFilePdf />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-lg text-[#0F7C55]">
                      {doc.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5 font-mono truncate">
                      {doc.filename} — {doc.size}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {doc.description}
                </p>
              </div>

              <a
                href={doc.downloadUrl}
                download={doc.filename}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#0F7C55] hover:bg-[#0A3D24] text-white py-3.5 rounded-xl font-semibold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition duration-200"
              >
                <FaDownload className="text-xs" />
                Télécharger le document PDF
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
