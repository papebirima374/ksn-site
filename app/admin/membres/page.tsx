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
} from "react-icons/fa6";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import { hasPermission, Member } from "@/lib/admin-types";
import {
  listMembers,
  deleteMember,
  updateMember,
  validateMember,
  importMembersFromJson,
  ImportMember,
  ImportReport,
} from "@/lib/admin-data";

export default function AdminMembresPage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "members.write");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [fRegion, setFRegion] = useState("all");
  const [fVille, setFVille] = useState("all");
  const [fProf, setFProf] = useState("all");
  const [fStatus, setFStatus] = useState<"all" | "actif" | "en_attente" | "inactif">("all");
  const [importOpen, setImportOpen] = useState(false);

  async function reload() {
    setLoading(true);
    try {
      setMembers(await listMembers());
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
      if (!q) return true;
      const hay = `${m.prenom} ${m.nom} ${m.matricule} ${m.email ?? ""} ${m.telephone ?? ""} ${m.ville ?? ""} ${m.region ?? ""} ${m.profession ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [members, search, fRegion, fVille, fProf, fStatus]);

  async function handleDelete(member: Member) {
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

  return (
    <AdminShell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
            Communauté
          </p>
          <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F5132]">
            Membres du Dahira
          </h1>
          <p className="mt-2 text-gray-600 text-sm">
            {members.length} membre{members.length > 1 ? "s" : ""} enregistré
            {members.length > 1 ? "s" : ""}.
          </p>
        </div>
        {canEdit && (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setImportOpen(true)}
              className="inline-flex items-center gap-2 bg-white border border-[#0F5132] text-[#0F5132] py-3 px-5 rounded-xl font-semibold text-sm hover:bg-[#F8F5EF] transition"
            >
              <FaFileImport /> Importer JSON
            </button>
            <Link
              href="/admin/membres/nouveau"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-3 px-5 rounded-xl font-bold text-sm"
            >
              <FaPlus /> Nouveau membre
            </Link>
          </div>
        )}
      </header>

      <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6 mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 relative">
            <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher (nom, matricule, tel, ville…)"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm text-[#0F5132] bg-white"
            />
          </div>
          <select
            value={fRegion}
            onChange={(e) => setFRegion(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F5132] bg-white"
          >
            <option value="all">Toutes régions</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            value={fVille}
            onChange={(e) => setFVille(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F5132] bg-white"
          >
            <option value="all">Toutes villes</option>
            {villes.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <select
            value={fProf}
            onChange={(e) => setFProf(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F5132] bg-white"
          >
            <option value="all">Toutes professions</option>
            {professions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
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
                  ? "bg-[#0F5132] text-white"
                  : "bg-[#F8F5EF] text-[#0F5132] hover:bg-[#E8E6E1]"
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
              <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#F8F5EF] flex-shrink-0 flex items-center justify-center text-[#0F5132]/40 text-2xl font-bold">
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
                <h3 className="font-display text-base sm:text-lg font-bold text-[#0F5132] truncate">
                  {m.prenom} {m.nom}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {m.profession || "—"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  📍 {[m.ville, m.region].filter(Boolean).join(", ") || "—"}
                </p>
                <div className="flex items-center gap-2 mt-2">
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
                </div>
                <div className="flex gap-1 mt-3 flex-wrap">
                  <Link
                    href={`/admin/membres/${m.id}`}
                    className="inline-flex items-center gap-1 text-xs text-[#0F5132] hover:text-[#B8860B] font-semibold"
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
                      <button
                        type="button"
                        onClick={() => handleDelete(m)}
                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold ml-3"
                      >
                        <FaTrash />
                      </button>
                    </>
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
        <h2 className="font-display text-2xl font-bold text-[#0F5132]">
          Importer des membres depuis JSON
        </h2>
        <p className="mt-2 text-sm text-gray-600 leading-6">
          Collez un tableau JSON. Champs reconnus : <code>sourceUid</code>,{" "}
          <code>prenom</code>, <code>nom</code>, <code>email</code>,{" "}
          <code>telephone</code>, <code>profession</code>, <code>region</code>,{" "}
          <code>ville</code>, <code>pays</code>, <code>dateNaissance</code>,{" "}
          <code>photo</code>, <code>matricule</code>. Les doublons (même
          sourceUid, email ou téléphone) sont ignorés.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          placeholder='[\n  { "prenom": "Birima", "nom": "Gueye", "telephone": "+221780178444", "ville": "Louga" }\n]'
          className="mt-4 w-full font-mono text-xs rounded-xl border border-gray-200 p-3 text-[#0F5132] bg-white"
        />

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
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#0F5132] font-semibold text-sm"
          >
            Fermer
          </button>
          {report ? (
            <button
              type="button"
              onClick={onDone}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] font-bold text-sm"
            >
              Voir la liste
            </button>
          ) : (
            <button
              type="button"
              onClick={handleImport}
              disabled={running || !text.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] font-bold text-sm disabled:opacity-50"
            >
              {running ? "Import…" : "Importer"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
