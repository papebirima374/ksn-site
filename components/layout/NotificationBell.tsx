"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FaBell,
  FaCircleCheck,
  FaCircleInfo,
  FaCircleXmark,
  FaCrown,
  FaGraduationCap,
} from "react-icons/fa6";
import {
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import type { AppNotification, NotificationType } from "@/lib/admin-types";
import { markAllNotificationsRead } from "@/lib/admin-data";

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
  return new Date(ts).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

export default function NotificationBell() {
  const { user, firebaseUser } = useAuth();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // ── Listener temps réel sur ses propres notifications ────────────
  useEffect(() => {
    if (!isFirebaseConfigured() || !firebaseUser) {
      // Reset déféré pour éviter le warning react-hooks/set-state-in-effect
      const reset = setTimeout(() => setItems([]), 0);
      return () => clearTimeout(reset);
    }
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
          .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
          .slice(0, 30);
        setItems(arr);
      },
      (err) => console.warn("notif snapshot error", err)
    );
    return unsub;
  }, [firebaseUser]);

  // ── Ferme au clic extérieur / ESC ────────────────────────────────
  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  const unread = items.filter((n) => !n.read).length;

  async function handleClickNotif(n: AppNotification) {
    if (!n.read) {
      try {
        const db = getDb();
        await updateDoc(doc(db, "notifications", n.id), {
          read: true,
          readAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn("mark read failed", e);
      }
    }
    setOpen(false);
  }

  async function handleMarkAll() {
    if (!user) return;
    try {
      await markAllNotificationsRead(user.uid);
    } catch (e) {
      console.warn("mark all read failed", e);
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={
          unread > 0
            ? `Notifications (${unread} non lue${unread > 1 ? "s" : ""})`
            : "Notifications"
        }
        className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition"
      >
        <FaBell className="text-sm" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D4AF37] text-[#0F7C55] text-[10px] font-black flex items-center justify-center shadow-md border border-[#0A3D24] tabular-nums">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[320px] sm:w-[380px] max-h-[70vh] bg-[#0A3D24]/97 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <p className="font-bold text-white text-sm">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="text-[11px] text-[#D4AF37] hover:underline font-semibold"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {items.length === 0 ? (
              <div className="px-4 py-10 text-center text-white/60 text-sm">
                <FaBell className="text-3xl text-white/20 mx-auto mb-2" />
                Aucune notification pour le moment.
              </div>
            ) : (
              <ul>
                {items.map((n) => {
                  const accent = ACCENT_BY_TYPE[n.type] || "bg-white/10 text-white";
                  const icon = ICON_BY_TYPE[n.type] || <FaCircleInfo />;
                  const content = (
                    <div
                      className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 transition cursor-pointer ${
                        n.read ? "opacity-70 hover:opacity-100 hover:bg-white/5" : "bg-white/[0.04] hover:bg-white/10"
                      }`}
                      onClick={() => handleClickNotif(n)}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl ${accent} flex items-center justify-center flex-shrink-0 text-sm`}
                      >
                        {icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm leading-tight ${n.read ? "text-white/80" : "text-white font-semibold"}`}
                        >
                          {n.title}
                        </p>
                        <p className="text-xs text-white/60 mt-0.5 leading-5">
                          {n.body}
                        </p>
                        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0 mt-2" />
                      )}
                    </div>
                  );
                  return (
                    <li key={n.id}>
                      {n.link ? (
                        <Link href={n.link}>{content}</Link>
                      ) : (
                        content
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer : lien vers la page dédiée + préférences */}
          <div className="border-t border-white/10 bg-white/5 flex">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2.5 text-center text-xs font-bold text-[#D4AF37] hover:text-white transition border-r border-white/10"
            >
              Voir tout →
            </Link>
            <Link
              href="/espace-membre/profil#notifications"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 text-center text-xs font-semibold text-white/60 hover:text-white transition"
              title="Préférences"
            >
              ⚙
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
