"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaBell,
  FaCircleCheck,
  FaCircleInfo,
  FaCircleXmark,
  FaCrown,
  FaGraduationCap,
  FaTrash,
  FaCheckDouble,
  FaGear,
} from "react-icons/fa6";
import { collection, onSnapshot, query, where, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import { markAllNotificationsRead } from "@/lib/admin-data";
import type { AppNotification, NotificationType, NotificationCategory } from "@/lib/admin-types";
import { NOTIFICATION_TYPE_CATEGORY } from "@/lib/admin-types";

const ICON_BY_TYPE: Record<NotificationType, React.ReactNode> = {
  premium_request_new: <FaCrown />,
  premium_request_approved: <FaCircleCheck />,
  premium_request_rejected: <FaCircleXmark />,
  certification_request_new: <FaGraduationCap />,
  certification_approved: <FaCircleCheck />,
  certification_rejected: <FaCircleXmark />,
  info: <FaCircleInfo />,
  success: <FaCircleCheck />,
  warning: <FaCircleInfo />,
};

const ACCENT_BY_TYPE: Record<NotificationType, string> = {
  premium_request_new: "bg-[#D4AF37]/15 text-[#B8860B]",
  premium_request_approved: "bg-emerald-100 text-emerald-700",
  premium_request_rejected: "bg-red-100 text-red-700",
  certification_request_new: "bg-[#0F7C55]/10 text-[#0F7C55]",
  certification_approved: "bg-emerald-100 text-emerald-700",
  certification_rejected: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
};

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  premium: "Premium",
  education: "Éducation",
  admin_alerts: "Alertes admin",
  system: "Système",
};

type Filter = "all" | "unread" | NotificationCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "unread", label: "Non lues" },
  { id: "premium", label: "Premium" },
  { id: "education", label: "Éducation" },
  { id: "admin_alerts", label: "Alertes admin" },
  { id: "system", label: "Système" },
];

const PAGE_SIZE = 20;

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.round(diff / 1000);
  if (sec < 60) return "à l'instant";
  const min = Math.round(sec / 60);
  if (min < 60) return `il y a ${min} min`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `il y a ${hr} h`;
  const d = Math.round(hr / 24);
  if (d < 7) return `il y a ${d} j`;
  return new Date(ts).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsPage() {
  const { user, firebaseUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/espace-membre?next=/notifications");
  }, [authLoading, user, router]);

  // ── Listener temps réel ─────────────────────────────────────────────
  useEffect(() => {
    if (!isFirebaseConfigured() || !firebaseUser) return;
    const db = getDb();
    const q = query(
      collection(db, "notifications"),
      where("recipientUid", "==", firebaseUser.uid)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr = snap.docs
          .map(
            (d) =>
              ({
                id: d.id,
                ...(d.data() as Omit<AppNotification, "id">),
              } as AppNotification)
          )
          .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        setItems(arr);
      },
      (err) => console.warn("notif page snapshot error", err)
    );
    return unsub;
  }, [firebaseUser]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "unread") return items.filter((n) => !n.read);
    return items.filter((n) => NOTIFICATION_TYPE_CATEGORY[n.type] === filter);
  }, [items, filter]);

  const paginated = filtered.slice(0, visible);
  const hasMore = filtered.length > visible;

  async function handleMarkRead(id: string) {
    try {
      const db = getDb();
      await updateDoc(doc(db, "notifications", id), {
        read: true,
        readAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn("mark read failed", e);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette notification ?")) return;
    try {
      const db = getDb();
      await deleteDoc(doc(db, "notifications", id));
    } catch (e) {
      console.warn("delete notif failed", e);
    }
  }

  async function handleMarkAll() {
    if (!user) return;
    setActing(true);
    try {
      await markAllNotificationsRead(user.uid);
    } finally {
      setActing(false);
    }
  }

  if (authLoading || !user) {
    return (
      <main className="relative z-10 min-h-screen pt-32 pb-20 flex items-center justify-center text-white/70">
        <div className="w-10 h-10 border-2 border-white/20 border-t-[#D4AF37] rounded-full animate-spin" />
      </main>
    );
  }

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <main className="relative z-10 min-h-screen pt-32 sm:pt-40 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[#D4AF37] text-xs uppercase tracking-widest font-black">
              Mon espace
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-white mt-1 flex items-center gap-3">
              <FaBell className="text-[#D4AF37]" /> Notifications
              {unreadCount > 0 && (
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#0F7C55] bg-[#D4AF37] px-2 py-1 rounded-full ml-2">
                  {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                disabled={acting}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl transition disabled:opacity-50"
              >
                <FaCheckDouble /> Tout lire
              </button>
            )}
            <Link
              href="/espace-membre/profil#notifications"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl transition"
              title="Préférences de notification"
            >
              <FaGear /> Préférences
            </Link>
          </div>
        </header>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map((f) => {
            const count =
              f.id === "all"
                ? items.length
                : f.id === "unread"
                ? items.filter((n) => !n.read).length
                : items.filter(
                    (n) => NOTIFICATION_TYPE_CATEGORY[n.type] === f.id
                  ).length;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setFilter(f.id);
                  setVisible(PAGE_SIZE);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  filter === f.id
                    ? "bg-[#D4AF37] text-[#0F7C55] border-[#D4AF37]"
                    : "bg-white/5 text-white border-white/15 hover:border-white/30"
                }`}
              >
                {f.label}{" "}
                <span className="opacity-70 ml-1 tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>

        {/* LIST */}
        {paginated.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center text-white/70">
            <FaBell className="text-4xl text-white/20 mx-auto mb-3" />
            <p>
              {filter === "all"
                ? "Aucune notification pour le moment."
                : "Aucune notification dans ce filtre."}
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {paginated.map((n) => {
              const accent = ACCENT_BY_TYPE[n.type];
              const icon = ICON_BY_TYPE[n.type];
              const cat = NOTIFICATION_TYPE_CATEGORY[n.type];
              return (
                <li
                  key={n.id}
                  className={`bg-white/[0.06] border rounded-2xl overflow-hidden transition ${
                    n.read ? "border-white/10" : "border-[#D4AF37]/30 bg-[#D4AF37]/[0.05]"
                  }`}
                >
                  <div className="p-4 sm:p-5 flex gap-3 items-start">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${accent} flex items-center justify-center flex-shrink-0`}
                    >
                      {icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className={`text-sm sm:text-base leading-tight ${n.read ? "text-white/85" : "text-white font-bold"}`}
                        >
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                        )}
                        <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                          · {CATEGORY_LABELS[cat]}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-white/65 leading-5 mt-1">
                        {n.body}
                      </p>
                      <div className="flex items-center gap-3 mt-2.5 text-[11px] text-white/40">
                        <span>{timeAgo(n.createdAt)}</span>
                        {n.link && (
                          <Link
                            href={n.link}
                            onClick={() => handleMarkRead(n.id)}
                            className="text-[#D4AF37] hover:underline font-semibold"
                          >
                            Ouvrir →
                          </Link>
                        )}
                        {!n.read && (
                          <button
                            type="button"
                            onClick={() => handleMarkRead(n.id)}
                            className="text-white/60 hover:text-white"
                          >
                            Marquer lue
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(n.id)}
                          className="text-white/50 hover:text-red-400 inline-flex items-center gap-1"
                        >
                          <FaTrash className="text-[9px]" /> Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* LOAD MORE */}
        {hasMore && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold px-5 py-3 rounded-xl text-sm transition"
            >
              Voir {Math.min(PAGE_SIZE, filtered.length - visible)} de plus
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
