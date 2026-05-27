"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FaWhatsapp,
  FaRightFromBracket,
  FaCheck,
  FaClock,
  FaCrown,
  FaCamera,
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth-context";
import {
  getMember,
  updateMember,
  createMember,
  uploadMemberPhoto,
} from "@/lib/admin-data";
import { Member } from "@/lib/admin-types";
import { PAYMENT } from "@/lib/constants";
import MemberCard from "@/components/admin/MemberCard";
import WaveLogo from "@/components/ui/WaveLogo";

export default function ProfilPage() {
  const { user, loading, signOut, refresh, configured } = useAuth();
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/espace-membre");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user?.memberId) {
      setFetching(false);
      return;
    }
    getMember(user.memberId)
      .then(setMember)
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [user?.memberId]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white/70">
        Chargement…
      </div>
    );
  }

  const status = user.memberStatus ?? "inactif";

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 lg:pt-44 pb-20">
      {/* HEADER */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0F7C55] to-[#082F22] flex items-center justify-center text-white font-display font-bold text-lg">
              {(user.displayName ?? user.email)[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
                Mon Espace Membre
              </p>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-[#0F7C55]">
                {user.displayName || user.email}
              </h1>
              <StatusBadge status={status} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(user.role === "admin" || user.role === "commission") && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 bg-[#0F7C55] text-white py-2 px-4 rounded-xl font-semibold text-sm hover:bg-[#0A3D24] transition"
              >
                Panneau admin
              </Link>
            )}
            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.replace("/");
              }}
              className="inline-flex items-center gap-2 bg-gray-100 text-[#0F7C55] py-2 px-4 rounded-xl font-semibold text-sm hover:bg-gray-200 transition"
            >
              <FaRightFromBracket /> Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD */}
      {fetching ? (
        <div className="bg-white rounded-3xl p-8 text-center text-gray-500">Chargement du profil…</div>
      ) : status === "actif" && member ? (
        <ActiveMemberDashboard member={member} onUpdated={async () => {
          if (user.memberId) setMember(await getMember(user.memberId));
          await refresh();
        }} />
      ) : status === "en_attente" && member ? (
        <PendingDashboard member={member} />
      ) : (
        <VisitorDashboard
          onSubmitted={async () => {
            await refresh();
            if (user.memberId) {
              const m = await getMember(user.memberId);
              if (m) setMember(m);
            }
          }}
          configured={configured}
        />
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: "actif" | "en_attente" | "inactif" }) {
  if (status === "actif") {
    return (
      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-700">
        <FaCheck /> Membre Actif
      </span>
    );
  }
  if (status === "en_attente") {
    return (
      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-amber-100 text-amber-700">
        <FaClock /> En attente de validation
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-gray-100 text-gray-600">
      Visiteur
    </span>
  );
}

function ActiveMemberDashboard({
  member,
  onUpdated,
}: {
  member: Member;
  onUpdated: () => Promise<void>;
}) {
  const [edit, setEdit] = useState(false);
  const [prenom, setPrenom] = useState(member.prenom);
  const [nom, setNom] = useState(member.nom);
  const [ville, setVille] = useState(member.ville ?? "");
  const [region, setRegion] = useState(member.region ?? "");
  const [photo, setPhoto] = useState(member.photo ?? "");
  const [photoPath, setPhotoPath] = useState(member.photoPath ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handlePhoto(file: File) {
    try {
      const { url, path } = await uploadMemberPhoto(file);
      setPhoto(url);
      setPhotoPath(path);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'upload");
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await updateMember(member.id, {
        prenom,
        nom,
        ville,
        region,
        photo,
        photoPath,
      });
      await onUpdated();
      setEdit(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  const previewMember: Member = { ...member, prenom, nom, ville, region, photo };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#0F7C55] to-[#082F22] rounded-3xl p-6 sm:p-8 text-white">
        <p className="uppercase tracking-widest text-[#D4AF37] text-xs font-bold">
          Carte Officielle de Membre
        </p>
        <h2 className="font-display mt-2 text-2xl font-bold flex items-center gap-2">
          <FaCrown className="text-[#D4AF37]" /> Matricule {member.matricule}
        </h2>
        <p className="mt-2 text-white/70 text-sm">
          Présentez cette carte lors des événements officiels du Dahira.
        </p>
        <div className="mt-6">
          <MemberCard member={previewMember} size="preview" />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl font-bold text-[#0F7C55]">
            Mes informations
          </h3>
          {!edit && (
            <button
              type="button"
              onClick={() => setEdit(true)}
              className="text-sm text-[#B8860B] hover:text-[#D4AF37] font-semibold"
            >
              Modifier
            </button>
          )}
        </div>

        {edit ? (
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom"
                className={inputClass}
              />
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom"
                className={inputClass}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                placeholder="Ville"
                className={inputClass}
              />
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Région"
                className={inputClass}
              />
            </div>

            <label className="block">
              <span className="block text-xs font-semibold text-gray-600 mb-2">
                Photo (mise à jour live de la carte)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handlePhoto(f);
                }}
                className="text-sm text-[#0F7C55] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#0F7C55] file:text-white file:font-semibold"
              />
            </label>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
                {error}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-3 rounded-xl font-bold disabled:opacity-50"
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEdit(false);
                  setPrenom(member.prenom);
                  setNom(member.nom);
                  setVille(member.ville ?? "");
                  setRegion(member.region ?? "");
                  setPhoto(member.photo ?? "");
                  setPhotoPath(member.photoPath ?? "");
                }}
                className="px-5 bg-gray-100 text-[#0F7C55] rounded-xl font-semibold"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            <Info label="Prénom" value={member.prenom} />
            <Info label="Nom" value={member.nom} />
            <Info label="Téléphone" value={member.telephone || "—"} />
            <Info label="Email" value={member.email || "—"} />
            <Info label="Ville" value={member.ville || "—"} />
            <Info label="Région" value={member.region || "—"} />
            <Info label="Matricule" value={member.matricule} mono />
            <Info label="Statut" value="Actif" />
          </dl>
        )}
      </div>
    </div>
  );
}

function PendingDashboard({ member }: { member: Member }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold">
          <FaClock /> Validation en cours
        </div>
        <h2 className="font-display mt-4 text-2xl sm:text-3xl font-bold">
          Bienvenue {member.prenom} !
        </h2>
        <p className="mt-3 text-white/90 leading-7 text-sm sm:text-base">
          Votre demande d&apos;adhésion est en cours de validation par la
          commission administrative. Dès que vous aurez réglé la cotisation
          annuelle de <strong>1 000 FCFA</strong>, votre matricule officiel sera
          généré et votre carte de membre activée.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <WaveLogo className="w-14 h-14 flex-shrink-0" />
          <div>
            <p className="text-xs uppercase tracking-widest text-[#1DCEDB] font-bold">
              Étape finale
            </p>
            <h3 className="font-display mt-1 text-xl font-bold text-[#0F7C55]">
              Payer ma cotisation
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-6">
              1 000 FCFA — Vous serez redirigé vers Wave (paiement officiel).
              Après confirmation, votre statut passera à <strong>Actif</strong>.
            </p>
          </div>
        </div>
        <a
          href={PAYMENT.membershipWave}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-5 w-full bg-[#1DCEDB] hover:bg-[#16b8c4] text-white text-center py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] transition"
        >
          Payer 1 000 FCFA via Wave
        </a>
      </div>
    </div>
  );
}

function VisitorDashboard({
  onSubmitted,
  configured,
}: {
  onSubmitted: () => Promise<void>;
  configured: boolean;
}) {
  const { user } = useAuth();
  const [step, setStep] = useState<"intro" | "form" | "success">("intro");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState(user?.phone ? `+${user.phone}` : "");
  const [ville, setVille] = useState("");
  const [region, setRegion] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handlePhoto(file: File) {
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!photoFile) {
      setError("Photo obligatoire pour la carte de membre.");
      return;
    }
    if (!user) {
      setError("Session perdue. Reconnectez-vous.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      // Upload photo first (now that user is authenticated)
      const { url, path } = await uploadMemberPhoto(photoFile);
      // Create the en_attente member record
      await createMember({
        prenom,
        nom,
        email: user.email,
        telephone,
        ville,
        region,
        photo: url,
        photoPath: path,
        status: "en_attente",
        createdBy: user.uid,
      });
      await onSubmitted();
      setStep("success");
    } catch (e) {
      const raw = e instanceof Error ? e.message : String(e);
      // Translate Firebase rule rejection into something the user can act on
      if (
        /Missing or insufficient permissions/i.test(raw) ||
        /permission-denied/i.test(raw) ||
        /storage\/unauthorized/i.test(raw)
      ) {
        setError(
          "L'administrateur doit autoriser la création de fiches membres pour les visiteurs connectés. (Règles Firebase à mettre à jour — voir le message dans le panneau d'admin.)"
        );
      } else {
        setError(raw);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-3xl">
          ✓
        </div>
        <h3 className="font-display mt-4 text-2xl font-bold text-emerald-800">
          Demande enregistrée !
        </h3>
        <p className="mt-3 text-emerald-700 leading-7 text-sm sm:text-base max-w-lg mx-auto">
          Votre demande est en attente de validation. Réglez votre cotisation de
          1 000 FCFA via le lien Wave qui apparaît maintenant sur cette page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-3xl p-6 sm:p-8 text-[#0F7C55]">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/30 text-[#0F7C55] text-xs font-bold">
          <FaCrown /> Devenir Membre Actif
        </div>
        <h2 className="font-display mt-4 text-2xl sm:text-3xl font-bold">
          Débloquez l&apos;accès complet au Dahira KSN
        </h2>
        <p className="mt-3 leading-7 text-sm sm:text-base">
          En tant que <strong>visiteur</strong>, vous avez accès au Salaatu du
          jour et aux 2 premiers Salaats de la bibliothèque. Passez en{" "}
          <strong>membre actif</strong> pour :
        </p>
        <ul className="mt-3 space-y-1 text-sm">
          <li>✦ Bibliothèque complète des Salaats et leurs secrets</li>
          <li>✦ Carte officielle de membre imprimable (CR-80)</li>
          <li>✦ Matricule officiel KSN</li>
          <li>✦ Communauté internationale + événements</li>
        </ul>
        {step === "intro" && (
          <button
            type="button"
            onClick={() => setStep("form")}
            className="inline-flex items-center mt-6 bg-[#0F7C55] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#0A3D24] transition"
          >
            Démarrer mon adhésion
          </button>
        )}
      </div>

      {step === "form" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-md p-6 sm:p-8 space-y-3"
        >
          <h3 className="font-display text-xl font-bold text-[#0F7C55] mb-2">
            Compléter mon profil
          </h3>

          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Prénom *"
              className={inputClass}
            />
            <input
              type="text"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom *"
              className={inputClass}
            />
          </div>

          <input
            type="tel"
            required
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="Téléphone (+221...) *"
            className={inputClass}
          />

          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              placeholder="Ville *"
              className={inputClass}
            />
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Région"
              className={inputClass}
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Photo de profil (obligatoire pour la carte) *
            </p>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#F8F5EF] flex items-center justify-center text-[#0F7C55]/50 text-2xl">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Aperçu"
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <FaCamera />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handlePhoto(f);
                }}
                className="text-sm text-[#0F7C55] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#0F7C55] file:text-white file:font-semibold"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !configured}
            className="w-full bg-[#0F7C55] text-white py-4 rounded-2xl font-bold disabled:opacity-50 hover:bg-[#0A3D24] transition"
          >
            {submitting ? "Envoi…" : "Soumettre ma demande →"}
          </button>
          <p className="text-xs text-gray-500 text-center">
            Vous réglerez la cotisation Wave 1 000 FCFA à l&apos;étape suivante.
          </p>
        </form>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#0F7C55] text-sm text-[#0F7C55] bg-white";

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-gray-500 font-bold">{label}</dt>
      <dd className={`mt-1 text-[#0F7C55] font-semibold ${mono ? "font-mono tabular-nums" : ""}`}>{value}</dd>
    </div>
  );
}
