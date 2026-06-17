"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import {
  FaPlus,
  FaArrowDown,
  FaArrowUp,
  FaTrash,
  FaScaleBalanced,
  FaXmark,
} from "react-icons/fa6";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import {
  hasPermission,
  FinanceEntry,
  FinanceType,
  FINANCE_CATEGORIES,
  FINANCE_METHODS,
  Member,
} from "@/lib/admin-types";
import {
  listFinanceEntries,
  createFinanceEntry,
  deleteFinanceEntry,
  financeStats,
  listMembers,
} from "@/lib/admin-data";

function fmtMoney(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

export default function AdminFinancesPage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "finances.write");
  const canDelete = user?.role === "admin";
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [fType, setFType] = useState<"all" | FinanceType>("all");
  const [fCat, setFCat] = useState("all");
  const [fFrom, setFFrom] = useState("");
  const [fTo, setFTo] = useState("");

  async function reload() {
    setLoading(true);
    try {
      setEntries(await listFinanceEntries());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      reload();
    }, 0);
  }, []);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (fType !== "all" && e.type !== fType) return false;
      if (fCat !== "all" && e.category !== fCat) return false;
      if (fFrom && e.date < fFrom) return false;
      if (fTo && e.date > fTo) return false;
      return true;
    });
  }, [entries, fType, fCat, fFrom, fTo]);

  const stats = useMemo(() => financeStats(filtered), [filtered]);
  const allStats = useMemo(() => financeStats(entries), [entries]);

  const allCategories = useMemo(
    () => [...FINANCE_CATEGORIES.income, ...FINANCE_CATEGORIES.expense],
    []
  );

  async function handleDelete(e: FinanceEntry) {
    if (!canDelete) return;
    if (!confirm(`Supprimer cette ${e.type === "income" ? "entrée" : "sortie"} de ${fmtMoney(e.amount)} ?`)) return;
    await deleteFinanceEntry(e.id);
    await reload();
  }

  return (
    <AdminShell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
            Commission Finance
          </p>
          <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
            Trésorerie du Dahira
          </h1>
          <p className="mt-2 text-gray-600 text-sm">
            {entries.length} transaction{entries.length > 1 ? "s" : ""} enregistrée{entries.length > 1 ? "s" : ""}.
          </p>
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-3 px-5 rounded-xl font-bold text-sm"
          >
            <FaPlus /> Nouvelle transaction
          </button>
        )}
      </header>

      {/* GLOBAL STATS */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total entrées"
          value={fmtMoney(allStats.totalIncome)}
          icon={<FaArrowDown />}
          colorClass="from-emerald-500 to-emerald-700 text-white"
        />
        <StatCard
          label="Total sorties"
          value={fmtMoney(allStats.totalExpense)}
          icon={<FaArrowUp />}
          colorClass="from-red-500 to-red-700 text-white"
        />
        <StatCard
          label="Solde actuel"
          value={fmtMoney(allStats.balance)}
          icon={<FaScaleBalanced />}
          colorClass={
            allStats.balance >= 0
              ? "from-[#B8860B] to-[#D4AF37] text-[#0F7C55]"
              : "from-red-700 to-red-900 text-white"
          }
        />
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-3xl shadow-md p-4 sm:p-5 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <select
            value={fType}
            onChange={(e) => setFType(e.target.value as typeof fType)}
            className={selectClass}
          >
            <option value="all">Tous types</option>
            <option value="income">Entrées</option>
            <option value="expense">Sorties</option>
          </select>
          <select
            value={fCat}
            onChange={(e) => setFCat(e.target.value)}
            className={selectClass}
          >
            <option value="all">Toutes catégories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={fFrom}
            onChange={(e) => setFFrom(e.target.value)}
            placeholder="Du"
            className={selectClass}
            style={{ maxWidth: "100%", minWidth: "0px" }}
          />
          <input
            type="date"
            value={fTo}
            onChange={(e) => setFTo(e.target.value)}
            placeholder="Au"
            className={selectClass}
            style={{ maxWidth: "100%", minWidth: "0px" }}
          />
          <button
            type="button"
            onClick={() => {
              setFType("all");
              setFCat("all");
              setFFrom("");
              setFTo("");
            }}
            className="rounded-xl bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F7C55] text-sm font-semibold"
          >
            Réinitialiser
          </button>
        </div>
        {(fType !== "all" || fCat !== "all" || fFrom || fTo) && (
          <p className="mt-3 text-sm text-gray-500">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""} —{" "}
            <span className="text-emerald-700 font-semibold">
              +{fmtMoney(stats.totalIncome)}
            </span>{" "}
            /{" "}
            <span className="text-red-700 font-semibold">
              −{fmtMoney(stats.totalExpense)}
            </span>{" "}
            = solde filtré{" "}
            <span className="font-bold text-[#0F7C55]">
              {fmtMoney(stats.balance)}
            </span>
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100 mb-4">
          {error}
        </p>
      )}

      {/* LIST */}
      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center">
          <p className="text-gray-500">
            {entries.length === 0
              ? "Aucune transaction enregistrée. Cliquez sur « Nouvelle transaction »."
              : "Aucune transaction ne correspond à ces filtres."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {filtered.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    e.type === "income"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {e.type === "income" ? <FaArrowDown /> : <FaArrowUp />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0F7C55] text-sm sm:text-base truncate">
                    {e.category}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {new Date(e.date).toLocaleDateString("fr-FR")} •{" "}
                    {e.method ?? "—"}
                    {e.memberName && ` • ${e.memberName}`}
                    {e.description && ` • ${e.description}`}
                  </p>
                </div>
                <p
                  className={`font-bold tabular-nums text-sm sm:text-base whitespace-nowrap ${
                    e.type === "income" ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {e.type === "income" ? "+" : "−"} {fmtMoney(e.amount)}
                </p>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDelete(e)}
                    className="text-red-500 hover:text-red-700 ml-2"
                    aria-label="Supprimer"
                  >
                    <FaTrash />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showForm && (
        <NewEntryModal
          onClose={() => setShowForm(false)}
          onDone={async () => {
            setShowForm(false);
            await reload();
          }}
        />
      )}
    </AdminShell>
  );
}

function StatCard({
  label,
  value,
  icon,
  colorClass,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}) {
  return (
    <div className={`rounded-3xl p-5 sm:p-6 bg-gradient-to-br ${colorClass}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest font-bold opacity-80">
          {label}
        </p>
        <span className="text-xl opacity-80">{icon}</span>
      </div>
      <p className="font-display mt-3 text-2xl sm:text-3xl font-bold tabular-nums">
        {value}
      </p>
    </div>
  );
}

const selectClass =
  "rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#0F7C55] bg-white w-full block min-w-0";

function NewEntryModal({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: () => void;
}) {
  const { user } = useAuth();
  const [type, setType] = useState<FinanceType>("income");
  const [category, setCategory] = useState(FINANCE_CATEGORIES.income[0]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState(FINANCE_METHODS[0]);
  const [memberName, setMemberName] = useState("");
  const [memberMatricule, setMemberMatricule] = useState("");
  const [memberId, setMemberId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    listMembers().then(setAllMembers).catch(console.error);
  }, []);

  const filteredMembers = useMemo(() => {
    const q = memberSearch.toLowerCase().trim();
    if (!q) return [];
    return allMembers.filter((m) => {
      const nomComplet = `${m.prenom} ${m.nom}`.toLowerCase();
      const tel = (m.telephone || "").toLowerCase();
      const matricule = (m.matricule || "").toLowerCase();
      return nomComplet.includes(q) || tel.includes(q) || matricule.includes(q);
    });
  }, [allMembers, memberSearch]);

  function handleTypeChange(t: FinanceType) {
    setType(t);
    setCategory(FINANCE_CATEGORIES[t][0]);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      const n = parseInt(amount.replace(/\D/g, ""), 10);
      if (!Number.isFinite(n) || n <= 0) throw new Error("Montant invalide");

      const entryData: any = {
        type,
        category,
        amount: n,
        date,
        method,
        recordedBy: user.uid,
      };

      if (description.trim()) entryData.description = description.trim();
      if (reference.trim()) entryData.reference = reference.trim();
      if (memberId) entryData.memberId = memberId;
      if (memberName.trim()) entryData.memberName = memberName.trim();
      if (memberMatricule.trim()) entryData.memberMatricule = memberMatricule.trim();

      await createFinanceEntry(entryData);
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 my-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-[#0F7C55]">
            Nouvelle transaction
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            aria-label="Fermer"
          >
            <FaXmark />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`py-3 rounded-xl font-bold text-sm ${
              type === "income"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <FaArrowDown className="inline mr-2" /> Entrée
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`py-3 rounded-xl font-bold text-sm ${
              type === "expense"
                ? "bg-red-600 text-white"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            <FaArrowUp className="inline mr-2" /> Sortie
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Catégorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectClass}
            >
              {FINANCE_CATEGORIES[type].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Montant (FCFA) *
            </label>
            <input
              type="text"
              inputMode="numeric"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="ex: 5000"
              className={selectClass + " font-mono tabular-nums"}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={selectClass}
              style={{ maxWidth: "100%", minWidth: "0px" }}
            />
          </div>
          <div className="min-w-0">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Moyen de paiement
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className={selectClass}
            >
              {FINANCE_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {type === "income" && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Membre (nom, prénom, tél)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMemberSearch(val);
                    setShowDropdown(true);
                    setMemberName(val);
                    setMemberId("");
                    setMemberMatricule("");
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Rechercher un membre..."
                  className={selectClass}
                />

                {memberSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setMemberSearch("");
                      setMemberName("");
                      setMemberId("");
                      setMemberMatricule("");
                      setShowDropdown(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaXmark />
                  </button>
                )}

                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute z-20 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
                      {allMembers.length === 0 ? (
                        <div className="p-3 text-xs text-gray-500">
                          Chargement des membres...
                        </div>
                      ) : (
                        <>
                          {(() => {
                            const list = memberSearch.trim() ? filteredMembers : allMembers;
                            if (list.length === 0) {
                              return (
                                <div className="p-3 text-xs text-gray-500">
                                  Aucun membre trouvé
                                </div>
                              );
                            }
                            return list.map((m) => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                  setMemberId(m.id);
                                  setMemberName(`${m.prenom} ${m.nom}`);
                                  setMemberMatricule(m.matricule || "");
                                  setMemberSearch(
                                    `${m.prenom} ${m.nom} (${m.matricule || "sans matricule"})`
                                  );
                                  setShowDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-[#F8F5EF] text-[#0F7C55] transition flex items-center justify-between border-b border-gray-50 last:border-0"
                              >
                                <div>
                                  <span className="font-bold">
                                    {m.prenom} {m.nom}
                                  </span>
                                  {m.telephone && (
                                    <span className="text-xs text-gray-500 ml-2">
                                      ({m.telephone})
                                    </span>
                                  )}
                                </div>
                                <span className="font-mono text-xs text-[#B8860B] font-bold">
                                  #{m.matricule || "—"}
                                </span>
                              </button>
                            ));
                          })()}
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Matricule
              </label>
              <input
                type="text"
                value={memberMatricule}
                onChange={(e) => setMemberMatricule(e.target.value)}
                placeholder="0001"
                className={selectClass + " font-mono"}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Description / Note
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optionnel"
            className={selectClass + " w-full"}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Référence / N° pièce
          </label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Optionnel"
            className={selectClass + " w-full"}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-3.5 rounded-xl font-bold disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Enregistrer la transaction"}
        </button>
      </form>
    </div>
  );
}
