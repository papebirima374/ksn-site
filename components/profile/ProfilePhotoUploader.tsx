"use client";

import { useRef, useState } from "react";
import { FaCamera, FaTrash, FaCircleCheck } from "react-icons/fa6";
import {
  uploadUserProfilePhoto,
  removeUserProfilePhoto,
} from "@/lib/admin-data";
import { useAuth } from "@/lib/auth-context";

/**
 * Carte "Photo de profil" — l'ajout est ENTIÈREMENT OPTIONNEL.
 * Deux modes visuels coexistent :
 *  - Mode simple (sans photo) : avatar initiales, message accueil chaleureux
 *  - Mode profil complet : photo + badge "Profil complet"
 */
export default function ProfilePhotoUploader() {
  const { user, refresh } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!user) return null;

  const hasPhoto = Boolean(user.photoURL);
  const initials = (user.displayName ?? user.email ?? "M")
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      setError("Format non supporté. Choisissez une image (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image trop lourde (max 5 Mo).");
      return;
    }
    setError("");
    setUploading(true);
    try {
      await uploadUserProfilePhoto(user.uid, file);
      await refresh();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Échec de l'upload. Réessayez."
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleRemove() {
    if (!user) return;
    if (!confirm("Supprimer votre photo de profil ?")) return;
    setUploading(true);
    setError("");
    try {
      await removeUserProfilePhoto(user.uid);
      await refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Échec de la suppression."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {hasPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL}
              alt={user.displayName || "Profil"}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#D4AF37] shadow"
              draggable={false}
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#0F7C55] to-[#082F22] flex items-center justify-center text-white font-display font-black text-2xl shadow">
              {initials}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-[#D4AF37] text-[#0F7C55] flex items-center justify-center shadow-md border-2 border-white hover:scale-110 transition disabled:opacity-50"
            title={hasPhoto ? "Changer la photo" : "Ajouter une photo"}
            aria-label={hasPhoto ? "Changer la photo" : "Ajouter une photo"}
          >
            <FaCamera className="text-xs" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
            disabled={uploading}
          />
        </div>

        {/* Texte */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[10px] uppercase tracking-widest text-[#B8860B] font-black">
              Photo de profil · Optionnel
            </p>
            {hasPhoto && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <FaCircleCheck /> Profil complet
              </span>
            )}
          </div>
          <h3 className="font-display text-base sm:text-lg font-bold text-[#0F7C55] mt-1">
            {hasPhoto
              ? "Votre photo enrichit votre profil"
              : "Ajouter une photo (facultatif)"}
          </h3>
          <p className="text-xs text-gray-600 leading-5 mt-1">
            {hasPhoto
              ? "Vous pouvez la modifier ou la supprimer à tout moment."
              : "Continuez sans photo en toute simplicité, ou ajoutez-en une pour personnaliser votre identité visuelle dans la communauté."}
          </p>

          {error && (
            <p className="mt-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5">
              {error}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 bg-[#0F7C55] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#0A3D24] transition disabled:opacity-50"
            >
              <FaCamera />{" "}
              {uploading
                ? "Envoi…"
                : hasPhoto
                ? "Changer la photo"
                : "Ajouter une photo"}
            </button>
            {hasPhoto && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="inline-flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
              >
                <FaTrash /> Retirer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
