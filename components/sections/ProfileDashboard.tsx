"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowRightFromBracket,
  FaCamera,
  FaCircleInfo,
  FaSpinner,
  FaBookOpen,
} from "react-icons/fa6";
import { AppUser, Member } from "@/lib/admin-types";
import { useAuth } from "@/lib/auth-context";
import {
  getMember,
  updateMember,
  uploadMemberPhoto,
  checkDuplicateEmailOrPhone,
} from "@/lib/admin-data";
import MemberCard from "@/components/admin/MemberCard";
import { PAYMENT } from "@/lib/constants";
import { doc, updateDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";

type Props = {
  user: AppUser;
};

export default function ProfileDashboard({ user }: Props) {
  const { signOut, refresh, firebaseUser } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [domicile, setDomicile] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoPath, setPhotoPath] = useState("");

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    async function fetchMember() {
      try {
        if (user.memberId) {
          const m = await getMember(user.memberId);
          if (m && active) {
            setMember(m);
            setPrenom(m.prenom || "");
            setNom(m.nom || "");
            setTelephone(m.telephone || "");
            setDomicile(m.domicile || "");
            setPhoto(m.photo || "");
            setPhotoPath(m.photoPath || "");
          }
        }
      } catch (e) {
        console.error("Error loading member data:", e);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    fetchMember();
    return () => {
      active = false;
    };
  }, [user.memberId]);

  async function loadMemberData() {
    try {
      if (user.memberId) {
        const m = await getMember(user.memberId);
        if (m) {
          setMember(m);
          setPrenom(m.prenom || "");
          setNom(m.nom || "");
          setTelephone(m.telephone || "");
          setDomicile(m.domicile || "");
          setPhoto(m.photo || "");
          setPhotoPath(m.photoPath || "");
        }
      }
    } catch (e) {
      console.error("Error reloading member data:", e);
    }
  }

  async function handlePhotoUpload(file: File) {
    setUploadingPhoto(true);
    setError("");
    setSuccess("");
    try {
      const { url, path } = await uploadMemberPhoto(file);
      setPhoto(url);
      setPhotoPath(path);
      
      // If they are already an active or pending member, update directly in Firestore to keep UI responsive
      if (member) {
        await updateMember(member.id, { photo: url, photoPath: path });
        // Update user auth profile
        if (firebaseUser) {
          await updateProfile(firebaseUser, { photoURL: url });
        }
        await refresh();
      }
      setSuccess("Photo téléversée avec succès ! Elle s'affiche sur votre carte.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de téléversement de la photo");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!member) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      // 1. Duplicate check (exclude current member ID)
      const isEmailLogin = !user.email.startsWith("tel-");
      const { phoneDuplicate } = await checkDuplicateEmailOrPhone(
        isEmailLogin ? user.email : undefined,
        telephone,
        member.id
      );

      if (phoneDuplicate) {
        throw new Error("Ce numéro de téléphone est déjà attribué à un autre membre.");
      }

      // 2. Update member doc
      await updateMember(member.id, {
        prenom,
        nom,
        telephone,
        domicile,
        photo,
        photoPath,
      });

      // 3. Update users doc
      const db = getDb();
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: `${prenom} ${nom}`,
      });

      // 4. Update firebase auth profile
      if (firebaseUser) {
        await updateProfile(firebaseUser, {
          displayName: `${prenom} ${nom}`,
        });
      }

      await refresh();
      await loadMemberData();
      setSuccess("Profil mis à jour avec succès !");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpgradeRequest() {
    if (!member) return;
    if (!photo) {
      setError("Une photo de profil est obligatoire pour générer votre carte de membre.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      // Set status to en_attente (pending approval)
      await updateMember(member.id, {
        prenom,
        nom,
        telephone,
        domicile,
        photo,
        photoPath,
        status: "en_attente",
      });

      // Update local state and reload
      await refresh();
      await loadMemberData();
      setSuccess("Votre demande d'adhésion active a été soumise avec succès à la commission.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de mise à niveau");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-[#0F5132]">
        <FaSpinner className="animate-spin text-4xl" />
        <p className="mt-4 text-sm font-semibold">Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Badge / Status Header */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#F8F5EF] flex items-center justify-center text-2xl">
            {user.memberStatus === "actif" ? "🏆" : user.memberStatus === "en_attente" ? "⏳" : "👤"}
          </div>
          <div>
            <h2 className="font-display font-bold text-[#0F5132] text-xl">
              {prenom} {nom}
            </h2>
            <p className="text-xs text-gray-500">
              Statut :{" "}
              {user.memberStatus === "actif" ? (
                <span className="text-emerald-700 font-extrabold uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded-md">
                  Membre Actif
                </span>
              ) : user.memberStatus === "en_attente" ? (
                <span className="text-amber-700 font-extrabold uppercase tracking-wide bg-amber-50 px-2 py-0.5 rounded-md">
                  Validation en cours
                </span>
              ) : (
                <span className="text-gray-500 font-extrabold uppercase tracking-wide bg-gray-100 px-2 py-0.5 rounded-md">
                  Visiteur (Inactif)
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user.memberStatus === "actif" && (
            <Link
              href="/spiritualite"
              className="inline-flex items-center gap-2 bg-[#0F5132] text-white py-2.5 px-4 rounded-xl text-sm font-semibold hover:bg-[#0c4228] transition shadow-md"
            >
              <FaBookOpen /> Bibliothèque
            </Link>
          )}
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 border border-red-200 text-red-600 py-2.5 px-4 rounded-xl text-sm font-semibold hover:bg-red-50 transition"
          >
            <FaArrowRightFromBracket /> Déconnexion
          </button>
        </div>
      </div>

      {/* Main Grid: Card & Details */}
      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Member Card or Callout */}
        <div className="md:col-span-6 space-y-6">
          <div className="text-center md:text-left">
            <h3 className="font-display text-lg font-bold text-[#0F5132] mb-3">
              Votre Carte de Membre KSN
            </h3>
            {user.memberStatus === "actif" && member ? (
              <div className="transform hover:scale-[1.01] transition duration-300">
                <MemberCard member={member} size="preview" />
                <p className="text-center text-xs text-gray-500 mt-3 italic">
                  Votre carte officielle CR80. Utilisez la version imprimée pour vos événements.
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#ffffff] to-[#F8F5EF] rounded-3xl border border-[#0F5132]/10 p-6 shadow-lg text-center space-y-4">
                <div className="relative w-36 h-36 mx-auto rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md flex items-center justify-center text-gray-400">
                  {photo ? (
                    <Image
                      src={photo}
                      alt="Aperçu photo"
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-5xl">👤</span>
                  )}
                </div>
                <h4 className="font-display font-bold text-[#0F5132] text-base">
                  Aperçu de votre photo
                </h4>
                <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                  Ajoutez une photo claire de face pour pouvoir générer automatiquement votre carte KSN officielle.
                </p>
              </div>
            )}
          </div>

          {/* Pending Validation Alert */}
          {user.memberStatus === "en_attente" && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 space-y-4">
              <h4 className="font-display font-bold text-amber-800 flex items-center gap-2 text-base">
                <FaCircleInfo /> Demande d&apos;adhésion en attente
              </h4>
              <p className="text-sm text-amber-900/90 leading-relaxed">
                Votre demande est en cours de validation par la commission administrative. Veuillez vous assurer d&apos;avoir réglé la cotisation de 1000 FCFA pour la carte.
              </p>
              <a
                href={PAYMENT.membershipWave}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#10c3af] text-white py-3 rounded-2xl font-bold hover:scale-[1.02] transition text-sm shadow-md"
              >
                Payer 1000 FCFA via Wave
              </a>
            </div>
          )}

          {/* Upgrade Callout (if visitor) */}
          {user.memberStatus === "inactif" && (
            <div className="bg-[#0F5132] text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-2xl" />
              <span className="uppercase text-xs font-black tracking-widest text-[#D4AF37]">
                Avantage Adhérent
              </span>
              <h4 className="font-display text-xl sm:text-2xl font-black leading-tight">
                Devenez Membre Actif de la KSN
              </h4>
              <p className="text-sm text-white/80 leading-relaxed">
                Accédez à la Bibliothèque sacrée des Salaats (secrets d&apos;utilisation, translittérations et bienfaits) et obtenez votre carte d&apos;adhérent officielle CR80.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-sm">
                  <span className="text-[#D4AF37] font-bold">1.</span>
                  <p>Téléversez une photo de profil dans le formulaire.</p>
                </div>
                <div className="flex items-start gap-2.5 text-sm">
                  <span className="text-[#D4AF37] font-bold">2.</span>
                  <p>Effectuez le règlement de 1000 FCFA via le bouton Wave ci-dessous.</p>
                </div>
                <div className="flex items-start gap-2.5 text-sm">
                  <span className="text-[#D4AF37] font-bold">3.</span>
                  <p>Soumettez votre demande d&apos;adhésion active.</p>
                </div>
              </div>
              <a
                href={PAYMENT.membershipWave}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-3.5 rounded-2xl font-black hover:scale-[1.02] transition text-sm shadow-xl"
              >
                Payer 1000 FCFA via Wave
              </a>
              <button
                type="button"
                onClick={handleUpgradeRequest}
                disabled={saving || !photo}
                className="w-full inline-flex items-center justify-center gap-2 bg-white text-[#0F5132] py-3.5 rounded-2xl font-bold hover:scale-[1.02] transition text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Soumission..." : "Soumettre ma demande d'adhésion"}
              </button>
              {!photo && (
                <p className="text-center text-xs text-[#D4AF37]/90 italic">
                  * Veuillez d&apos;abord ajouter une photo de profil ci-contre.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-6 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold text-[#0F5132]">
              Modifier vos Informations
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Maintenez vos coordonnées à jour pour votre carte officielle.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Photo upload input */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Photo de profil (Obligatoire pour la carte de membre)
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-20 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center text-gray-400 border border-gray-200">
                  {photo ? (
                    <Image
                      src={photo}
                      alt="Photo membre"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <div>
                  <label className="inline-flex items-center gap-2 bg-[#0F5132] text-white py-2 px-4 rounded-xl text-xs font-semibold hover:bg-[#0c4228] transition cursor-pointer">
                    <FaCamera /> Choisir une photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handlePhotoUpload(f);
                      }}
                      className="hidden"
                    />
                  </label>
                  {uploadingPhoto && <p className="text-xs text-gray-500 mt-1.5">Téléversement en cours...</p>}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Labelled label="Prénom *">
                <input
                  type="text"
                  required
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className={inputClass}
                />
              </Labelled>
              <Labelled label="Nom *">
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className={inputClass}
                />
              </Labelled>
            </div>

            <Labelled label="Numéro de Téléphone *">
              <input
                type="tel"
                required
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="+221..."
                className={inputClass}
              />
            </Labelled>

            <Labelled label="Domicile / Ville *">
              <input
                type="text"
                required
                value={domicile}
                onChange={(e) => setDomicile(e.target.value)}
                placeholder="Touba, Louga, Dakar..."
                className={inputClass}
              />
            </Labelled>

            <Labelled label="Identifiant de connexion (Email)">
              <input
                type="text"
                disabled
                value={
                  user.email.startsWith("tel-") && user.email.endsWith("@ksn-member.com")
                    ? `Numéro WhatsApp : ${user.email.substring(4, user.email.indexOf("@"))}`
                    : user.email
                }
                className="w-full rounded-xl border border-gray-100 p-3 bg-gray-50 text-gray-500 text-sm outline-none cursor-not-allowed"
              />
            </Labelled>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
                {error}
              </p>
            )}

            {success && (
              <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#0F5132] text-white py-3 rounded-xl font-semibold hover:bg-[#0c4228] transition disabled:opacity-50"
            >
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#0F5132] text-sm text-[#0F5132] bg-white";

function Labelled({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">
        {label}
      </label>
      {children}
    </div>
  );
}
