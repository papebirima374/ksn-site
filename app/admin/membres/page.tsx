"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaPlus,
  FaFileImport,
  FaMagnifyingGlass,
  FaIdCard,
  FaTrash,
  FaPenToSquare,
  FaCircleCheck,
  FaLocationDot,
  FaFilePdf,
  FaTrashCan,
  FaCoins,
  FaXmark,
} from "react-icons/fa6";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { hasPermission, Member, FinanceEntry, FINANCE_METHODS } from "@/lib/admin-types";
import {
  listMembers,
  deleteMember,
  deleteAllMembers,
  updateMember,
  validateMember,
  importMembersFromJson,
  backfillPublicCards,
  backfillVilleFromDomicile,
  ImportMember,
  ImportReport,
  listFinanceEntries,
  createFinanceEntry,
} from "@/lib/admin-data";
import { exportMembersPdf } from "@/lib/members-pdf";

const STATUS_FR: Record<string, string> = {
  actif: "Actifs",
  en_attente: "En attente",
  inactif: "Inactifs",
};

export default function AdminMembresPage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "members.write");
  const isFinance = hasPermission(user, "finances.write");
  const canDelete = user?.role === "admin";
  const canView = canEdit || isFinance;

  const [members, setMembers] = useState<Member[]>([]);
  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [fRegion, setFRegion] = useState("all");
  const [fVille, setFVille] = useState("all");
  const [fProf, setFProf] = useState("all");
  const [fStatus, setFStatus] = useState<"all" | "actif" | "en_attente" | "inactif">("all");
  const [fPayment, setFPayment] = useState<string>("all");
  const [importOpen, setImportOpen] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [paymentMember, setPaymentMember] = useState<Member | null>(null);

  const MONTHS_FR = useMemo(
    () => [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
    []
  );

  const hasPaidInscription = (memberId: string) => {
    return financeEntries.some(
      (e) =>
        e.memberId === memberId &&
        e.type === "income" &&
        e.category === "Frais d'inscription"
    );
  };

  const hasPaidCotisationThisMonth = (memberId: string) => {
    const monthName = MONTHS_FR[new Date().getMonth()];
    const year = new Date().getFullYear();
    const matchStr = `${monthName} ${year}`.toLowerCase();
    return financeEntries.some(
      (e) =>
        e.memberId === memberId &&
        e.type === "income" &&
        e.category === "Cotisation mensuelle" &&
        e.description?.toLowerCase().includes(matchStr)
    );
  };

  async function handleDeleteAll() {
    if (!canDelete) return;
    const total = members.length;
    if (total === 0) return;
    if (
      !confirm(
        `⚠️ SUPPRIMER TOUS LES MEMBRES ?\n\nCela supprimera définitivement les ${total} membre(s) et leurs cartes publiques. Action irréversible — à n'utiliser que pour un ré-import complet.`
      )
    )
      return;
    const word = prompt(`Pour confirmer, tapez SUPPRIMER en majuscules :`);
    if (word !== "SUPPRIMER") {
      alert("Suppression annulée.");
      return;
    }
    setDeletingAll(true);
    try {
      setError("");
      const n = await deleteAllMembers();
      alert(`🗑️ ${n} membre(s) supprimé(s). Vous pouvez maintenant ré-importer le fichier JSON.`);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la suppression");
    } finally {
      setDeletingAll(false);
    }
  }

  function handleExportPdf() {
    if (!canDelete) return;
    const labelParts: string[] = [];
    if (fStatus !== "all") labelParts.push(STATUS_FR[fStatus]);
    if (fRegion !== "all") labelParts.push(fRegion);
    if (fVille !== "all") labelParts.push(fVille);
    if (fProf !== "all") labelParts.push(fProf);
    if (search.trim()) labelParts.push(`« ${search.trim()} »`);
    const label = labelParts.length ? labelParts.join(" · ") : "Tous les membres";
    exportMembersPdf(filtered, { filterLabel: label }).catch((e) =>
      setError(e instanceof Error ? e.message : "Erreur lors de la génération du PDF")
    );
  }

  async function reload() {
    setLoading(true);
    try {
      const [membersData, financeData] = await Promise.all([
        listMembers(),
        listFinanceEntries(),
      ]);
      setMembers(membersData);
      setFinanceEntries(financeData);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      reload();
    }, 0);
  }, []);

  // Backfill : génère les cartes publiques manquantes (vérification QR) une
  // fois par session admin. Silencieux et non bloquant.
  useEffect(() => {
    if (!canEdit) return;
    const KEY = "ksn_publiccards_backfilled";
    if (sessionStorage.getItem(KEY)) return;
    backfillPublicCards()
      .then(() => sessionStorage.setItem(KEY, "1"))
      .catch(() => { /* non bloquant */ });
  }, [canEdit]);

  const regions = useMemo(
    () => Array.from(new Set(members.map((m) => m.region).filter(Boolean) as string[])).sort(),
    [members]
  );
  const villes = useMemo(
    () => Array.from(new Set(members.map((m) => m.ville).filter(Boolean) as string[])).sort(),
    [members]
  );
  const professions = useMemo(
    () => Array.from(new Set(members.map((m) => m.profession).filter(Boolean) as string[])).sort(),
    [members]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return members.filter((m) => {
      if (fRegion !== "all" && m.region !== fRegion) return false;
      if (fVille !== "all" && m.ville !== fVille) return false;
      if (fProf !== "all" && m.profession !== fProf) return false;
      if (fStatus !== "all" && m.status !== fStatus) return false;

      // Payment filters
      if (fPayment !== "all") {
        if (fPayment === "cotisation_ok" && !hasPaidCotisationThisMonth(m.id)) return false;
        if (fPayment === "cotisation_ko" && hasPaidCotisationThisMonth(m.id)) return false;
        if (fPayment === "inscription_ok" && !hasPaidInscription(m.id)) return false;
        if (fPayment === "inscription_ko" && hasPaidInscription(m.id)) return false;
      }

      if (!q) return true;
      const hay = `${m.prenom} ${m.nom} ${m.matricule} ${m.email ?? ""} ${m.telephone ?? ""} ${m.ville ?? ""} ${m.region ?? ""} ${m.profession ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [members, search, fRegion, fVille, fProf, fStatus, fPayment, financeEntries]);

  async function handleDelete(member: Member) {
    if (!canDelete) return;
    if (!confirm(`Supprimer définitivement ${member.prenom} ${member.nom} ?`)) return;
    await deleteMember(member);
    await reload();
  }

  async function handleApprove(member: Member) {
    if (!confirm(`Valider l'adhésion active de ${member.prenom} ${member.nom} ?\n\nUn matricule officiel lui sera attribué automatiquement.`)) return;
    try {
      setError("");
      const matricule = await validateMember(member.id);
      alert(`✅ ${member.prenom} ${member.nom} validé. Matricule attribué : ${matricule}`);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de validation");
    }
  }

  if (!loading && user && !canView) {
    return (
      <AdminShell>
        <div className="p-8 text-center bg-white rounded-3xl shadow-md my-12">
          <h2 className="font-display text-2xl font-bold text-red-600 mb-2">Accès refusé</h2>
          <p className="text-gray-600">
            Vous n'avez pas les droits nécessaires pour accéder à la liste des membres.
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
            Communauté
          </p>
          <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
            Membres du Dahira
          </h1>
          <p className="mt-2 text-gray-600 text-sm">
            {members.length} membre{members.length > 1 ? "s" : ""} enregistré
            {members.length > 1 ? "s" : ""}.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {canDelete && (
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={filtered.length === 0}
              title="Télécharger la liste affichée en PDF (logo + en-tête KSN)"
              className="inline-flex items-center gap-2 bg-white border border-[#0F7C55] text-[#0F7C55] py-3 px-5 rounded-xl font-semibold text-sm hover:bg-[#F8F5EF] transition disabled:opacity-50"
            >
              <FaFilePdf /> Télécharger PDF
            </button>
          )}
          {canEdit && (
            <>
              <button
                type="button"
                onClick={() => setImportOpen(true)}
                className="inline-flex items-center gap-2 bg-white border border-[#0F7C55] text-[#0F7C55] py-3 px-5 rounded-xl font-semibold text-sm hover:bg-[#F8F5EF] transition"
              >
                <FaFileImport /> Importer JSON
              </button>
              {canDelete && (
                <button
                  type="button"
                  onClick={handleDeleteAll}
                  disabled={deletingAll || members.length === 0}
                  title="Supprimer tous les membres (pour un ré-import complet)"
                  className="inline-flex items-center gap-2 bg-white border border-red-300 text-red-600 py-3 px-5 rounded-xl font-semibold text-sm hover:bg-red-50 transition disabled:opacity-50"
                >
                  <FaTrashCan /> {deletingAll ? "Suppression…" : "Tout supprimer"}
                </button>
              )}
              <Link
                href="/admin/membres/nouveau"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-3 px-5 rounded-xl font-bold text-sm"
              >
                <FaPlus /> Nouveau membre
              </Link>
            </>
          )}
        </div>
      </header>

      <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6 mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="lg:col-span-2 relative">
            <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher (nom, matricule, tel, ville…)"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm text-[#0F7C55] bg-white"
            />
          </div>
          <select
            value={fRegion}
            onChange={(e) => setFRegion(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55] bg-white"
          >
            <option value="all">Toutes régions</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            value={fVille}
            onChange={(e) => setFVille(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55] bg-white"
          >
            <option value="all">Toutes villes</option>
            {villes.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <select
            value={fProf}
            onChange={(e) => setFProf(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55] bg-white"
          >
            <option value="all">Toutes professions</option>
            {professions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={fPayment}
            onChange={(e) => setFPayment(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55] bg-white"
          >
            <option value="all">Tous les paiements</option>
            <option value="cotisation_ok">Cotisation réglée (ce mois)</option>
            <option value="cotisation_ko">Cotisation non réglée (ce mois)</option>
            <option value="inscription_ok">Inscription réglée</option>
            <option value="inscription_ko">Inscription non réglée</option>
          </select>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {(["all", "actif", "en_attente", "inactif"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                fStatus === s
                  ? "bg-[#0F7C55] text-white"
                  : "bg-[#F8F5EF] text-[#0F7C55] hover:bg-[#E8E6E1]"
              }`}
            >
              {s === "all"
                ? "Tous statuts"
                : s === "actif"
                ? "Actifs"
                : s === "en_attente"
                ? "En attente"
                : "Inactifs"}
            </button>
          ))}
          <span className="ml-auto self-center text-sm text-gray-500">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100 mb-4">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center">
          <p className="text-gray-500">
            {members.length === 0
              ? "Aucun membre pour l'instant. Créez le premier."
              : "Aucun membre ne correspond à ces filtres."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl shadow-md p-4 sm:p-5 flex gap-4"
            >
              <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#F8F5EF] flex-shrink-0 flex items-center justify-center text-[#0F7C55]/40 text-2xl font-bold">
                {m.photo ? (
                  <Image
                    src={m.photo}
                    alt={`${m.prenom} ${m.nom}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized={m.photo.startsWith("http")}
                  />
                ) : (
                  <span>
                    {(m.prenom?.[0] ?? "?")}
                    {(m.nom?.[0] ?? "")}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono tabular-nums text-[#B8860B] font-bold">
                  #{m.matricule}
                </p>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#0F7C55] truncate">
                  {m.prenom} {m.nom}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {m.profession || "—"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  📍 {[m.ville, m.region].filter(Boolean).join(", ") || "—"}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest ${
                      m.status === "actif"
                        ? "bg-emerald-100 text-emerald-700"
                        : m.status === "en_attente"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {m.status === "en_attente" ? "en attente" : m.status}
                  </span>
                  {hasPaidInscription(m.id) ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-[#B8860B] border border-[#B8860B]/20">
                      Inscr. OK
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200/30">
                      Inscr. KO
                    </span>
                  )}
                  {hasPaidCotisationThisMonth(m.id) ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/30">
                      Cotis. OK
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-50 text-gray-500 border border-gray-200/30">
                      Cotis. KO
                    </span>
                  )}
                </div>
                <div className="flex gap-1 mt-3 flex-wrap">
                  <Link
                    href={`/admin/membres/${m.id}`}
                    className="inline-flex items-center gap-1 text-xs text-[#0F7C55] hover:text-[#B8860B] font-semibold"
                  >
                    <FaIdCard /> Carte
                  </Link>
                  {canEdit && m.status === "en_attente" && (
                    <button
                      type="button"
                      onClick={() => handleApprove(m)}
                      className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-extrabold ml-3"
                    >
                      <FaCircleCheck /> Valider
                    </button>
                  )}
                  {canEdit && (
                    <>
                      <Link
                        href={`/admin/membres/${m.id}/editer`}
                        className="inline-flex items-center gap-1 text-xs text-[#B8860B] hover:text-[#D4AF37] font-semibold ml-3"
                      >
                        <FaPenToSquare /> Éditer
                      </Link>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDelete(m)}
                          className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold ml-3"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </>
                  )}
                  {isFinance && (
                    <button
                      type="button"
                      onClick={() => setPaymentMember(m)}
                      className="inline-flex items-center gap-1 text-xs text-[#0F7C55] hover:text-[#B8860B] font-bold ml-3"
                    >
                      <FaCoins /> Enregistrer Paiement
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {importOpen && (
        <ImportModal
          onClose={() => setImportOpen(false)}
          onDone={async () => {
            setImportOpen(false);
            await reload();
          }}
        />
      )}

      {paymentMember && (
        <RecordPaymentModal
          member={paymentMember}
          user={user}
          onClose={() => setPaymentMember(null)}
          onDone={async () => {
            setPaymentMember(null);
            await reload();
          }}
        />
      )}
    </AdminShell>
  );
}

function ImportModal({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: () => void;
}) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [error, setError] = useState("");

  async function handleImport() {
    if (!user) return;
    setError("");
    setReport(null);
    let parsed: ImportMember[];
    try {
      const json = JSON.parse(text);
      if (!Array.isArray(json)) {
        setError("Le JSON doit être un tableau de membres ([...]).");
        return;
      }
      parsed = json as ImportMember[];
    } catch {
      setError("JSON invalide. Vérifiez le format.");
      return;
    }
    setRunning(true);
    try {
      const r = await importMembersFromJson(parsed, user.uid);
      setReport(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'import");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-2xl font-bold text-[#0F7C55]">
          Importer des membres depuis JSON
        </h2>
        <p className="mt-2 text-sm text-gray-600 leading-6">
          Chargez un fichier <code>.json</code> ou collez un tableau JSON. Champs
          reconnus : <code>sourceUid</code>, <code>prenom</code>, <code>nom</code>,{" "}
          <code>email</code>, <code>telephone</code>, <code>profession</code>,{" "}
          <code>region</code>, <code>ville</code>, <code>pays</code>,{" "}
          <code>domicile</code>, <code>dateNaissance</code>, <code>photo</code>,{" "}
          <code>matricule</code>. Les doublons (même <strong>matricule</strong>,
          sourceUid, email ou téléphone) sont ignorés.
        </p>

        <label className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8F5EF] hover:bg-[#EFE9DD] border border-[#0F7C55]/15 text-[#0F7C55] font-semibold text-sm cursor-pointer">
          <FaFileImport /> Choisir un fichier .json
          <input
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setText(String(reader.result || ""));
              reader.readAsText(file);
              e.target.value = "";
            }}
          />
        </label>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder='[\n  { "matricule": "0001", "prenom": "Birima", "nom": "Gueye", "telephone": "+221780178444", "domicile": "Louga" }\n]'
          className="mt-3 w-full font-mono text-xs rounded-xl border border-gray-200 p-3 text-[#0F7C55] bg-white"
        />
        {text.trim().startsWith("[") && (
          <p className="mt-1 text-xs text-gray-500">
            {(() => {
              try {
                const n = JSON.parse(text);
                return Array.isArray(n) ? `${n.length} membre(s) prêt(s) à importer.` : "";
              } catch {
                return "";
              }
            })()}
          </p>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
            {error}
          </p>
        )}

        {report && (
          <div className="mt-3 text-sm bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-emerald-800">
            ✅ {report.inserted} membre{report.inserted > 1 ? "s" : ""} importé
            {report.inserted > 1 ? "s" : ""}, {report.skipped} ignoré
            {report.skipped > 1 ? "s" : ""} (doublons).
            {report.errors.length > 0 && (
              <ul className="mt-2 text-xs text-amber-800 list-disc list-inside">
                {report.errors.slice(0, 5).map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="mt-5 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#0F7C55] font-semibold text-sm"
          >
            Fermer
          </button>
          {report ? (
            <button
              type="button"
              onClick={onDone}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold text-sm"
            >
              Voir la liste
            </button>
          ) : (
            <button
              type="button"
              onClick={handleImport}
              disabled={running || !text.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold text-sm disabled:opacity-50"
            >
              {running ? "Import…" : "Importer"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ RECORD PAYMENT MODAL ============
interface RecordPaymentModalProps {
  member: Member;
  user: any;
  onClose: () => void;
  onDone: () => void;
}

function RecordPaymentModal({
  member,
  user,
  onClose,
  onDone,
}: RecordPaymentModalProps) {
  const MONTHS_FR = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const currentYear = new Date().getFullYear();
  const YEARS = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

  const [category, setCategory] = useState("Cotisation mensuelle");
  const [selectedMonth, setSelectedMonth] = useState(MONTHS_FR[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [amount, setAmount] = useState(500);
  const [method, setMethod] = useState("Wave");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reference, setReference] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const generatedDescription = useMemo(() => {
    if (category === "Cotisation mensuelle") {
      return `Cotisation - ${selectedMonth} ${selectedYear}`;
    }
    return "Frais d'inscription";
  }, [category, selectedMonth, selectedYear]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError("");
    setRunning(true);
    try {
      const entryData: any = {
        type: "income",
        category,
        amount: Number(amount),
        description: generatedDescription,
        date,
        method,
        memberId: member.id,
        memberMatricule: member.matricule || "",
        memberName: `${member.prenom} ${member.nom}`,
        recordedBy: user.email || user.uid,
      };

      if (reference.trim()) {
        entryData.reference = reference.trim();
      }

      await createFinanceEntry(entryData);
      alert("✅ Paiement enregistré avec succès.");
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'enregistrement");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <FaXmark className="text-xl" />
        </button>

        <h2 className="font-display text-2xl font-bold text-[#0F7C55] mb-2 flex items-center gap-2">
          <FaCoins className="text-[#B8860B]" /> Enregistrer un paiement
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Membre : <strong className="text-[#0F7C55]">{member.prenom} {member.nom}</strong> ({member.matricule ? `#${member.matricule}` : "Pas de matricule"})
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F7C55] mb-2">
              Type de paiement
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setCategory("Cotisation mensuelle");
                  setAmount(500);
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition ${
                  category === "Cotisation mensuelle"
                    ? "border-[#0F7C55] bg-[#0F7C55]/5 text-[#0F7C55]"
                    : "border-gray-200 hover:bg-gray-50 text-gray-600"
                }`}
              >
                Cotisation mensuelle
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory("Frais d'inscription");
                  setAmount(1000);
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition ${
                  category === "Frais d'inscription"
                    ? "border-[#0F7C55] bg-[#0F7C55]/5 text-[#0F7C55]"
                    : "border-gray-200 hover:bg-gray-50 text-gray-600"
                }`}
              >
                Frais d'inscription
              </button>
            </div>
          </div>

          {category === "Cotisation mensuelle" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F7C55] mb-1.5">
                  Mois
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
                >
                  {MONTHS_FR.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F7C55] mb-1.5">
                  Année
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F7C55] mb-1.5">
                Montant (FCFA)
              </label>
              <input
                type="number"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F7C55] mb-1.5">
                Mode
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
              >
                {FINANCE_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F7C55] mb-1.5">
              Date du paiement
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full block min-w-0 rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F7C55] mb-1.5">
              Libellé de transaction (Généré)
            </label>
            <input
              type="text"
              readOnly
              value={generatedDescription}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F7C55] mb-1.5">
              Référence / Notes (Optionnel)
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="N° transaction, Wave ref, etc."
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#0F7C55] bg-white"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
              {error}
            </p>
          )}

          <div className="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#0F7C55] font-semibold text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={running}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] font-bold text-sm disabled:opacity-50"
            >
              {running ? "Enregistrement…" : "Confirmer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
