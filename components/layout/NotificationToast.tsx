"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaXmark, FaCircleCheck, FaCircleInfo, FaCircleXmark, FaCrown, FaGraduationCap } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import type { AppNotification, NotificationType } from "@/lib/admin-types";

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
  premium_request_new: "from-[#B8860B] to-[#D4AF37]",
  premium_request_approved: "from-emerald-500 to-emerald-600",
  premium_request_rejected: "from-red-500 to-red-600",
  certification_request_new: "from-[#0F7C55] to-[#0A3D24]",
  certification_approved: "from-emerald-500 to-emerald-600",
  certification_rejected: "from-red-500 to-red-600",
  info: "from-blue-500 to-blue-600",
  success: "from-emerald-500 to-emerald-600",
  warning: "from-amber-500 to-amber-600",
};

const AUTO_DISMISS_MS = 6500;
const PERMISSION_KEY = "ksn_browser_notif_permission_asked";

/**
 * NotificationToast — composant global monté dans le layout racine.
 *
 * Responsabilités :
 *  1. Écoute Firestore notifications en temps réel
 *  2. Quand une notif arrive APRÈS le mount (filtre par mountedAt),
 *     l'affiche en toast en bas à droite (queue, max 3 simultanés)
 *  3. Si l'utilisateur a accordé la permission "Notifications" au
 *     navigateur, déclenche aussi une vraie notif système native
 *  4. Auto-dismiss après ~6.5s ou clic sur ✕
 *  5. Demande la permission navigateur 1 fois après la première notif
 *
 * NOTE : il ne s'affiche que pour les notifs avec createdAt > mount,
 * pour éviter de re-spawner les anciennes au refresh. La cloche +
 * page /notifications restent la source de vérité pour l'historique.
 */
export default function NotificationToast() {
  const { user, firebaseUser } = useAuth();
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  // Initialisé à 0, valorisé dans le useEffect (évite Date.now() en render).
  const mountedAtRef = useRef<number>(0);
  const askedPermissionRef = useRef<boolean>(false);

  // ─── Listener Firestore temps réel ─────────────────────────────────
  useEffect(() => {
    if (!isFirebaseConfigured() || !firebaseUser) return;
    const since = Date.now(); // capture stable
    mountedAtRef.current = since;

    const db = getDb();
    const q = query(
      collection(db, "notifications"),
      where("recipientUid", "==", firebaseUser.uid)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        // Filtre : uniquement les notifs créées APRÈS le mount,
        // pas encore lues, et non déjà affichées
        const fresh = snap
          .docChanges()
          .filter((c) => c.type === "added")
          .map(
            (c) =>
              ({
                id: c.doc.id,
                ...(c.doc.data() as Omit<AppNotification, "id">),
              } as AppNotification)
          )
          .filter((n) => (n.createdAt ?? 0) > since && !n.read);

        if (fresh.length === 0) return;

        setToasts((prev) => {
          const combined = [...fresh, ...prev];
          // Cap à 3 toasts simultanés
          return combined.slice(0, 3);
        });

        // Notifications navigateur natives (si permission donnée)
        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          for (const n of fresh) {
            try {
              const notif = new Notification(n.title, {
                body: n.body,
                icon: "/logo/ksn-logo.png",
                badge: "/logo/ksn-logo.png",
                tag: n.id,
              });
              if (n.link) {
                notif.onclick = () => {
                  window.focus();
                  window.location.href = n.link!;
                };
              }
            } catch (e) {
              console.warn("Browser notification failed", e);
            }
          }
        }

        // 1ère notif : on demande poliment la permission navigateur
        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "default" &&
          !askedPermissionRef.current &&
          !sessionStorage.getItem(PERMISSION_KEY)
        ) {
          askedPermissionRef.current = true;
          sessionStorage.setItem(PERMISSION_KEY, "1");
          // Délai pour laisser l'utilisateur voir le toast d'abord
          setTimeout(() => {
            Notification.requestPermission().catch(() => undefined);
          }, 2500);
        }
      },
      (err) => console.warn("toast snapshot error", err)
    );
    return unsub;
  }, [firebaseUser]);

  // ─── Auto-dismiss ──────────────────────────────────────────────────
  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) =>
      setTimeout(
        () => setToasts((prev) => prev.filter((x) => x.id !== t.id)),
        AUTO_DISMISS_MS
      )
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts]);

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  if (!user) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[60] flex flex-col gap-3 max-w-sm pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence>
        {toasts.map((n) => {
          const icon = ICON_BY_TYPE[n.type] || <FaCircleInfo />;
          const accent = ACCENT_BY_TYPE[n.type] || "from-[#0F7C55] to-[#0A3D24]";
          const body = (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex"
            >
              {/* Accent strip */}
              <div className={`w-1.5 bg-gradient-to-b ${accent}`} />
              <div className="flex-1 p-3.5 flex gap-3 items-start">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accent} text-white flex items-center justify-center flex-shrink-0 shadow-sm`}
                >
                  {icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-[#0F7C55] leading-tight">
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-600 leading-5 mt-1 line-clamp-3">
                    {n.body}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dismiss(n.id);
                  }}
                  className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition flex-shrink-0"
                  aria-label="Fermer"
                >
                  <FaXmark className="text-xs" />
                </button>
              </div>
            </motion.div>
          );
          return n.link ? (
            <Link
              key={n.id}
              href={n.link}
              onClick={() => dismiss(n.id)}
              className="block pointer-events-auto"
            >
              {body}
            </Link>
          ) : (
            <div key={n.id} className="pointer-events-auto">
              {body}
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
