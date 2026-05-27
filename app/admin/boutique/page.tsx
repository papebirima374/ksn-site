"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import Image from "next/image";
import {
  FaPlus,
  FaPenToSquare,
  FaTrash,
  FaBoxOpen,
  FaBagShopping,
  FaCheck,
  FaXmark,
} from "react-icons/fa6";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-context";
import {
  hasPermission,
  Order,
  OrderStatus,
  Product,
  PRODUCT_CATEGORIES,
  ProductCategory,
} from "@/lib/admin-types";
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  listOrders,
  updateOrderStatus,
} from "@/lib/admin-data";

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

export default function AdminBoutiquePage() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "boutique.write");
  const [tab, setTab] = useState<"products" | "orders">("products");

  return (
    <AdminShell>
      <header className="mb-6">
        <p className="text-[#B8860B] uppercase tracking-widest text-xs font-bold">
          Commerce
        </p>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
          Boutique KSN
        </h1>
      </header>

      <div className="grid grid-cols-2 gap-2 bg-[#F8F5EF] rounded-2xl p-1.5 mb-6 max-w-md">
        <TabButton active={tab === "products"} onClick={() => setTab("products")}>
          <FaBoxOpen className="mr-2 inline" /> Produits
        </TabButton>
        <TabButton active={tab === "orders"} onClick={() => setTab("orders")}>
          <FaBagShopping className="mr-2 inline" /> Commandes
        </TabButton>
      </div>

      {tab === "products" && <ProductsTab canEdit={canEdit} />}
      {tab === "orders" && <OrdersTab canEdit={canEdit} />}
    </AdminShell>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-2.5 rounded-xl text-sm font-bold transition ${
        active ? "bg-[#0F7C55] text-white shadow-md" : "text-[#0F7C55] hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function ProductsTab({ canEdit }: { canEdit: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function reload() {
    setLoading(true);
    try {
      setProducts(await listProducts());
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

  async function handleDelete(p: Product) {
    if (!confirm(`Supprimer "${p.title}" ?`)) return;
    await deleteProduct(p);
    await reload();
  }

  return (
    <>
      {canEdit && (
        <div className="mb-5 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-3 px-5 rounded-xl font-bold text-sm"
          >
            <FaPlus /> Nouveau produit
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100 mb-4">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center">
          <p className="text-gray-500">Aucun produit. Cliquez « Nouveau produit ».</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="relative aspect-square bg-[#F8F5EF]">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="300px"
                    className="object-cover"
                    unoptimized={p.image.startsWith("http")}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl">
                    {PRODUCT_CATEGORIES.find((c) => c.id === p.category)?.emoji}
                  </div>
                )}
                {!p.visible && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gray-700 text-white text-[10px] font-bold uppercase">
                    Masqué
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                  {PRODUCT_CATEGORIES.find((c) => c.id === p.category)?.label}
                </p>
                <h3 className="font-display mt-1 text-base font-bold text-[#0F7C55] line-clamp-2">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-[#0F7C55] font-bold tabular-nums">
                  {fmt(p.price)}
                </p>
                {p.category === "physical" && typeof p.stock === "number" && (
                  <p className="text-xs text-gray-500 mt-1">Stock : {p.stock}</p>
                )}
                {canEdit && (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(p);
                        setShowForm(true);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1 bg-[#F8F5EF] hover:bg-[#E8E6E1] text-[#0F7C55] py-1.5 rounded-lg text-xs font-semibold"
                    >
                      <FaPenToSquare /> Éditer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      className="inline-flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 py-1.5 px-3 rounded-lg text-xs font-semibold"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProductFormModal
          initial={editing}
          onClose={() => setShowForm(false)}
          onDone={async () => {
            setShowForm(false);
            await reload();
          }}
        />
      )}
    </>
  );
}

function ProductFormModal({
  initial,
  onClose,
  onDone,
}: {
  initial: Product | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<ProductCategory>(
    initial?.category ?? "physical"
  );
  const [priceStr, setPriceStr] = useState(String(initial?.price ?? ""));
  const [stockStr, setStockStr] = useState(String(initial?.stock ?? ""));
  const [pdfUrl, setPdfUrl] = useState(initial?.pdfUrl ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [imagePath, setImagePath] = useState(initial?.imagePath ?? "");
  const [visible, setVisible] = useState(initial?.visible !== false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleImage(file: File) {
    setUploading(true);
    try {
      const { url, path } = await uploadProductImage(file);
      setImage(url);
      setImagePath(path);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'upload");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const price = parseInt(priceStr.replace(/\D/g, ""), 10);
      if (!Number.isFinite(price) || price <= 0) throw new Error("Prix invalide");
      const stock =
        category === "physical" && stockStr ? parseInt(stockStr, 10) : undefined;
      const rawData = {
        title,
        description,
        category,
        price,
        stock,
        pdfUrl: category === "book" ? pdfUrl || undefined : undefined,
        image: image || undefined,
        imagePath: imagePath || undefined,
        visible,
      };
      
      // Filter out undefined fields to prevent Firestore unsupported field value: undefined errors
      const data = Object.fromEntries(
        Object.entries(rawData).filter((entry) => entry[1] !== undefined)
      ) as Omit<Product, "id" | "createdAt">;

      if (initial) {
        await updateProduct(initial.id, data);
      } else {
        await createProduct(data);
      }
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
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
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 my-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-[#0F7C55]">
            {initial ? "Modifier le produit" : "Nouveau produit"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <FaXmark />
          </button>
        </div>

        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du produit *"
          className={inputClass}
        />
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description *"
          rows={3}
          className={inputClass}
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className={inputClass}
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
          <input
            required
            type="text"
            inputMode="numeric"
            value={priceStr}
            onChange={(e) => setPriceStr(e.target.value)}
            placeholder="Prix en FCFA *"
            className={inputClass + " font-mono tabular-nums"}
          />
        </div>
        {category === "physical" && (
          <input
            type="text"
            inputMode="numeric"
            value={stockStr}
            onChange={(e) => setStockStr(e.target.value)}
            placeholder="Stock disponible"
            className={inputClass + " font-mono tabular-nums"}
          />
        )}
        {category === "book" && (
          <input
            type="text"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            placeholder="URL du PDF (livré après paiement)"
            className={inputClass}
          />
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Image
          </label>
          {image && (
            <div className="relative w-full max-w-xs aspect-square rounded-xl overflow-hidden mb-2">
              <Image
                src={image}
                alt=""
                fill
                sizes="240px"
                className="object-cover"
                unoptimized={image.startsWith("http")}
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImage(f);
            }}
            className="text-sm text-[#0F7C55] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#0F7C55] file:text-white file:font-semibold file:cursor-pointer"
          />
          {uploading && <p className="text-xs text-gray-500 mt-2">Upload…</p>}
        </div>

        <label className="flex items-center gap-2 text-sm text-[#0F7C55]">
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            className="w-4 h-4 accent-[#0F7C55]"
          />
          Visible dans la boutique publique
        </label>

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
          {saving ? "Enregistrement…" : initial ? "Enregistrer" : "Créer le produit"}
        </button>
      </form>
    </div>
  );
}

function OrdersTab({ canEdit }: { canEdit: boolean }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  async function reload() {
    setLoading(true);
    try {
      setOrders(await listOrders());
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

  const filtered = useMemo(
    () => orders.filter((o) => (filter === "all" ? true : o.status === filter)),
    [orders, filter]
  );

  async function setStatus(o: Order, status: OrderStatus) {
    await updateOrderStatus(o.id, status);
    await reload();
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-5">
        {(["all", "pending", "delivered", "cancelled"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              filter === s
                ? "bg-[#0F7C55] text-white"
                : "bg-[#F8F5EF] text-[#0F7C55] hover:bg-[#E8E6E1]"
            }`}
          >
            {s === "all"
              ? `Toutes (${orders.length})`
              : s === "pending"
              ? `En attente (${orders.filter((o) => o.status === "pending").length})`
              : s === "delivered"
              ? `Livrées (${orders.filter((o) => o.status === "delivered").length})`
              : `Annulées (${orders.filter((o) => o.status === "cancelled").length})`}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100 mb-4">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center">
          <p className="text-gray-500">
            {orders.length === 0
              ? "Aucune commande pour l'instant."
              : "Aucune commande ne correspond à ce filtre."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o.id} className="bg-white rounded-2xl shadow-md p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display font-bold text-[#0F7C55]">
                      {o.customerName}
                    </p>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(o.createdAt).toLocaleString("fr-FR")} • {o.customerPhone}
                    {o.customerEmail && ` • ${o.customerEmail}`}
                  </p>
                  {o.deliveryAddress && (
                    <p className="text-xs text-gray-500">📍 {o.deliveryAddress}</p>
                  )}
                </div>
                <p className="font-display text-xl font-bold text-[#0F7C55] tabular-nums">
                  {fmt(o.total)}
                </p>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-[#0F7C55]">
                {o.items.map((i) => (
                  <li key={i.productId} className="flex justify-between gap-2">
                    <span className="truncate">
                      {i.quantity}× {i.title}
                    </span>
                    <span className="tabular-nums font-semibold">
                      {fmt(i.price * i.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-3 text-xs text-gray-500">
                Paiement : <span className="font-semibold uppercase">{o.paymentMethod}</span>
                {o.transactionId && ` • Tx ${o.transactionId.slice(0, 12)}`}
              </p>

              {canEdit && o.status === "pending" && (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus(o, "delivered")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-bold"
                  >
                    <FaCheck /> Marquer livrée
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus(o, "cancelled")}
                    className="inline-flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-lg text-sm font-bold"
                  >
                    <FaXmark /> Annuler
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { label: string; cls: string }> = {
    pending: { label: "En attente", cls: "bg-amber-100 text-amber-700" },
    delivered: { label: "Livrée", cls: "bg-emerald-100 text-emerald-700" },
    cancelled: { label: "Annulée", cls: "bg-red-100 text-red-700" },
  };
  const s = map[status];
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest ${s.cls}`}>
      {s.label}
    </span>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#0F7C55] text-sm text-[#0F7C55] bg-white";
