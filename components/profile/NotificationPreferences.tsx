"use client";

import { useEffect, useState } from "react";
import { FaBell, FaCircleCheck, FaCircleInfo } from "react-icons/fa6";
import { useAuth } from "@/lib/auth-context";
import { updateNotificationPreferences } from "@/lib/admin-data";
import type {
  NotificationPreferences as Prefs,
  NotificationChannel,
  NotificationCategory,
} from "@/lib/admin-types";

const CHANNELS: {
  id: NotificationChannel;
  label: string;
  desc: string;
  alwaysOn?: boolean;
}[] = [
  {
    id: "inApp",
    label: "Cloche in-app",
    desc: "Toast + cloche dans le site. Toujours activé pour garantir un fil de fond.",
    alwaysOn: true,
  },
  {
    id: "browser",
    label: "Notification navigateur",
    desc: "Pop-up système quand le site est ouvert. Demande une permission au navigateur.",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    desc: "Message envoyé via WhatsApp pour les événements importants (validations).",
  },
  {
    id: "email",
    label: "E-mail",
    desc: "Bientôt — résumé hebdomadaire et événements clés par e-mail.",
  },
];

const CATEGORIES: {
  id: NotificationCategory;
  label: string;
  desc: string;
}[] = [
  {
    id: "premium",
    label: "Mes accès premium",
    desc: "Confirmations de paiement, validations, refus.",
  },
  {
    id: "education",
    label: "Mon parcours éducation",
    desc: "Avancée Tazawwud, certificat, entretiens oraux.",
  },
  {
    id: "admin_alerts",
    label: "Alertes admin",
    desc: "Si vous avez un rôle admin/commission : nouvelles demandes à traiter.",
  },
  {
    id: "system",
    label: "Annonces du site",
    desc: "Maintenance, nouvelles fonctionnalités, infos système.",
  },
];

/**
 * Panneau de préférences notifications.
 * Toutes les options sont OPT-OUT : tout est activé par défaut.
 * L'utilisateur peut désactiver finement par canal ou par catégorie.
 */
export default function NotificationPreferences() {
  const { user, refresh } = useAuth();
  const [prefs, setPrefs] = useState<Prefs>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [browserStatus, setBrowserStatus] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    const t = setTimeout(() => {
      if (typeof window !== "undefined" && "Notification" in window) {
        setBrowserStatus(Notification.permission);
      } else {
        setBrowserStatus("unsupported");
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!user?.notificationPreferences) return;
    const t = setTimeout(() => {
      setPrefs(user.notificationPreferences!);
    }, 0);
    return () => clearTimeout(t);
  }, [user]);

  function isChannelOn(id: NotificationChannel): boolean {
    if (id === "inApp") return true; // toujours actif
    return prefs.channels?.[id] !== false;
  }

  function isCategoryOn(id: NotificationCategory): boolean {
    return prefs.categories?.[id] !== false;
  }

  async function toggleChannel(id: NotificationChannel) {
    if (id === "inApp") return; // verrouillé
    const next: Prefs = {
      ...prefs,
      channels: {
        ...prefs.channels,
        [id]: !isChannelOn(id),
      },
    };
    setPrefs(next);
    await save(next);
  }

  async function toggleCategory(id: NotificationCategory) {
    const next: Prefs = {
      ...prefs,
      categories: {
        ...prefs.categories,
        [id]: !isCategoryOn(id),
      },
    };
    setPrefs(next);
    await save(next);
  }

  async function save(next: Prefs) {
    if (!user) return;
    setSaving(true);
    try {
      await updateNotificationPreferences(user.uid, next);
      await refresh();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function askBrowserPermission() {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    try {
      const res = await Notification.requestPermission();
      setBrowserStatus(res);
    } catch (e) {
      console.warn(e);
    }
  }

  if (!user) return null;

  return (
    <div
      id="notifications"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 scroll-mt-32"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 text-[#B8860B] flex items-center justify-center text-lg">
          <FaBell />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#B8860B] font-black">
            Préférences
          </p>
          <h3 className="font-display font-bold text-[#0F7C55]">
            Mes notifications
          </h3>
        </div>
        {success && (
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
            <FaCircleCheck /> Enregistré
          </span>
        )}
      </div>

      {/* CANAUX */}
      <div className="space-y-3 mb-6">
        <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
          Canaux de réception
        </p>
        {CHANNELS.map((c) => {
          const on = isChannelOn(c.id);
          const isBrowser = c.id === "browser";
          const browserBlocked =
            isBrowser && browserStatus === "denied";
          return (
            <div
              key={c.id}
              className="flex items-start gap-3 p-3 rounded-xl border border-gray-200"
            >
              <button
                type="button"
                onClick={() => toggleChannel(c.id)}
                disabled={c.alwaysOn || saving}
                className={`mt-0.5 w-10 h-6 rounded-full transition relative flex-shrink-0 ${
                  on
                    ? "bg-[#0F7C55]"
                    : "bg-gray-300"
                } ${c.alwaysOn ? "opacity-60 cursor-not-allowed" : ""}`}
                aria-label={`Activer ${c.label}`}
                aria-pressed={on}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    on ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#0F7C55] flex items-center gap-2 flex-wrap">
                  {c.label}
                  {c.alwaysOn && (
                    <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Toujours actif
                    </span>
                  )}
                  {isBrowser && browserStatus === "granted" && (
                    <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Permission accordée
                    </span>
                  )}
                  {browserBlocked && (
                    <span className="text-[9px] uppercase tracking-widest font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                      Bloqué côté navigateur
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-600 mt-0.5 leading-5">
                  {c.desc}
                </p>
                {isBrowser && browserStatus === "default" && on && (
                  <button
                    type="button"
                    onClick={askBrowserPermission}
                    className="mt-2 text-[11px] font-bold text-[#B8860B] hover:underline"
                  >
                    Activer la permission navigateur →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CATÉGORIES */}
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
          Types d&apos;événements
        </p>
        {CATEGORIES.map((c) => {
          const on = isCategoryOn(c.id);
          return (
            <div
              key={c.id}
              className="flex items-start gap-3 p-3 rounded-xl border border-gray-200"
            >
              <button
                type="button"
                onClick={() => toggleCategory(c.id)}
                disabled={saving}
                className={`mt-0.5 w-10 h-6 rounded-full transition relative flex-shrink-0 ${
                  on ? "bg-[#0F7C55]" : "bg-gray-300"
                }`}
                aria-label={`Activer ${c.label}`}
                aria-pressed={on}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    on ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#0F7C55]">{c.label}</p>
                <p className="text-xs text-gray-600 mt-0.5 leading-5">
                  {c.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-[11px] text-blue-900 flex gap-2">
        <FaCircleInfo className="flex-shrink-0 mt-0.5" />
        <span>
          Vos préférences sont sauvegardées au fur et à mesure et appliquées
          sur tous vos appareils.
        </span>
      </div>
    </div>
  );
}
