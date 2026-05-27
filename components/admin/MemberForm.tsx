"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Member, MemberStatus } from "@/lib/admin-types";
import {
  createMember,
  updateMember,
  uploadMemberPhoto,
  nextMatricule,
} from "@/lib/admin-data";
import { COMMON_PROFESSIONS, SENEGAL_REGIONS } from "@/lib/regions";

type Props = { initial?: Member };

export default function MemberForm({ initial }: Props) {
  const router = useRouter();
  const { user } = useAuth();

  const [matricule, setMatricule] = useState(initial?.matricule ?? "");
  const [prenom, setPrenom] = useState(initial?.prenom ?? "");
  const [nom, setNom] = useState(initial?.nom ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [telephone, setTelephone] = useState(initial?.telephone ?? "");
  const [dateNaissance, setDateNaissance] = useState(initial?.dateNaissance ?? "");
  const [profession, setProfession] = useState(initial?.profession ?? "");
  const [region, setRegion] = useState(initial?.region ?? "");
  const [ville, setVille] = useState(initial?.ville ?? "");
  const [pays, setPays] = useState(initial?.pays ?? "Sénégal");
  const [status, setStatus] = useState<MemberStatus>(initial?.status ?? "actif");
  const [photo, setPhoto] = useState(initial?.photo ?? "");
  const [photoPath, setPhotoPath] = useState(initial?.photoPath ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initial && !matricule) {
      nextMatricule().then(setMatricule).catch(() => {});
    }
  }, [initial, matricule]);

  async function handlePhoto(file: File) {
    setUploading(true);
    try {
      const { url, path } = await uploadMemberPhoto(file);
      setPhoto(url);
      setPhotoPath(path);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'upload");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      if (initial) {
        await updateMember(initial.id, {
          matricule,
          prenom,
          nom,
          email,
          telephone,
          dateNaissance,
          profession,
          region,
          ville,
          pays,
          status,
          photo,
          photoPath,
        });
        router.push(`/admin/membres/${initial.id}`);
      } else {
        const m = await createMember({
          matricule,
          prenom,
          nom,
          email,
          telephone,
          dateNaissance,
          profession,
          region,
          ville,
          pays,
          status,
          photo,
          photoPath,
          createdBy: user.uid,
        });
        router.push(`/admin/membres/${m.id}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
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

        <Labelled label="Matricule (auto-généré, modifiable)">
          <input
            type="text"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value.replace(/\D/g, "").padStart(4, "0").slice(-6))}
            placeholder="0001"
            className={`${inputClass} font-mono tabular-nums`}
          />
        </Labelled>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          <Labelled label="Téléphone">
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="+221 77 123 45 67"
              className={inputClass}
            />
          </Labelled>
          <Labelled label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </Labelled>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          <Labelled label="Date de naissance">
            <input
              type="date"
              value={dateNaissance}
              onChange={(e) => setDateNaissance(e.target.value)}
              className={inputClass}
            />
          </Labelled>
          <Labelled label="Profession">
            <input
              type="text"
              list="prof-options"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="ex: Enseignant(e)"
              className={inputClass}
            />
            <datalist id="prof-options">
              {COMMON_PROFESSIONS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </Labelled>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          <Labelled label="Pays">
            <input
              type="text"
              value={pays}
              onChange={(e) => setPays(e.target.value)}
              className={inputClass}
            />
          </Labelled>
          <Labelled label="Région">
            <input
              type="text"
              list="region-options"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={inputClass}
            />
            <datalist id="region-options">
              {SENEGAL_REGIONS.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </Labelled>
          <Labelled label="Ville / Localité">
            <input
              type="text"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className={inputClass}
            />
          </Labelled>
        </div>

        <Labelled label="Statut">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MemberStatus)}
            className={inputClass}
          >
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
        </Labelled>
      </div>

      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8 space-y-4">
        <Labelled label="Photo du membre">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-28 h-32 rounded-xl overflow-hidden bg-[#F8F5EF] flex items-center justify-center text-[#0F5132]/50 text-3xl">
              {photo ? (
                <Image
                  src={photo}
                  alt="Photo membre"
                  fill
                  sizes="120px"
                  className="object-cover"
                  unoptimized={photo.startsWith("http")}
                />
              ) : (
                <span>👤</span>
              )}
            </div>
            <div className="flex-1 min-w-[200px]">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handlePhoto(f);
                }}
                className="text-sm text-[#0F5132] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#0F5132] file:text-white file:font-semibold file:cursor-pointer"
              />
              {uploading && <p className="text-xs text-gray-500 mt-2">Upload…</p>}
              {photo && (
                <button
                  type="button"
                  onClick={() => {
                    setPhoto("");
                    setPhotoPath("");
                  }}
                  className="block mt-2 text-xs text-red-600 hover:text-red-700"
                >
                  Retirer la photo
                </button>
              )}
            </div>
          </div>
        </Labelled>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 min-w-[200px] bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F5132] py-4 rounded-2xl font-bold disabled:opacity-50"
        >
          {saving
            ? "Enregistrement…"
            : initial
            ? "Enregistrer les modifications"
            : "Créer le membre"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/membres")}
          className="px-6 bg-white border border-gray-200 text-[#0F5132] rounded-2xl font-semibold"
        >
          Annuler
        </button>
      </div>
    </form>
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
      <label className="block text-xs font-semibold text-gray-600 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
