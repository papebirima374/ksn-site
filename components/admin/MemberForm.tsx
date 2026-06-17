"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Member, MemberStatus } from "@/lib/admin-types";
import {
  createMember,
  updateMember,
  uploadMemberPhoto,
  nextMatricule,
  checkDuplicateEmailOrPhone,
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

  // Cropping States
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState(1.0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

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

  const handleCropConfirm = () => {
    if (!croppingImage || !croppingFile) return;
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 460;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const img = new window.Image();
      img.src = croppingImage;
      img.onload = () => {
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const drawWidth = img.width * scale * zoom;
        const drawHeight = img.height * scale * zoom;
        
        // Preview container is 200x230, Canvas is 400x460 (so factor = 2)
        const factor = canvas.width / 200;
        const dx = (canvas.width - drawWidth) / 2 + (x * factor);
        const dy = (canvas.height - drawHeight) / 2 + (y * factor);
        
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], croppingFile.name, { type: "image/jpeg" });
            handlePhoto(croppedFile);
            setCroppingImage(null);
            setCroppingFile(null);
          }
        }, "image/jpeg", 0.9);
      };
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setX((prev) => Math.max(-150, Math.min(150, prev + Math.round(dx / zoom))));
    setY((prev) => Math.max(-150, Math.min(150, prev + Math.round(dy / zoom))));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      // Check duplicates for email and telephone
      const { emailDuplicate, phoneDuplicate } = await checkDuplicateEmailOrPhone(
        email,
        telephone,
        initial?.id
      );
      if (emailDuplicate) {
        throw new Error("Cette adresse e-mail est déjà attribuée à un membre.");
      }
      if (phoneDuplicate) {
        throw new Error("Ce numéro de téléphone est déjà attribué à un membre.");
      }

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
            <div className="relative w-28 h-32 rounded-xl overflow-hidden bg-[#F8F5EF] flex items-center justify-center text-[#0F7C55]/50 text-3xl">
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
                  if (f) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setCroppingImage(reader.result as string);
                      setCroppingFile(f);
                      setZoom(1.0);
                      setX(0);
                      setY(0);
                    };
                    reader.readAsDataURL(f);
                  }
                }}
                className="text-sm text-[#0F7C55] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#0F7C55] file:text-white file:font-semibold file:cursor-pointer"
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
          className="flex-1 min-w-[200px] bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-[#0F7C55] py-4 rounded-2xl font-bold disabled:opacity-50"
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
          className="px-6 bg-white border border-gray-200 text-[#0F7C55] rounded-2xl font-semibold"
        >
          Annuler
        </button>
      </div>

      {croppingImage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center select-none">
            <h3 className="font-display text-lg font-bold text-[#0F7C55] mb-2 text-center">
              Ajuster la photo du membre
            </h3>
            <p className="text-xs text-gray-500 mb-4 text-center">
              Faites glisser l&apos;image ou utilisez les curseurs ci-dessous pour centrer et zoomer.
            </p>
            
            {/* Crop window wrapper with standard PointerEvents */}
            <div 
              className="relative overflow-hidden border border-[#0F7C55]/30 rounded-2xl bg-[#F8F5EF] flex items-center justify-center shadow-inner cursor-move touch-none"
              style={{ width: "200px", height: "230px" }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <img
                src={croppingImage}
                alt="Rognage"
                className="max-w-none pointer-events-none"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${zoom}) translate(${x}px, ${y}px)`,
                  transformOrigin: "center center",
                }}
              />
            </div>
            
            {/* Range Controls */}
            <div className="w-full mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>Zoom</span>
                  <span className="font-mono text-[#0F7C55]">{zoom.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="4.0"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0F7C55]"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>Décalage horizontal</span>
                  <span className="font-mono text-[#0F7C55]">{x}px</span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="1"
                  value={x}
                  onChange={(e) => setX(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0F7C55]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>Décalage vertical</span>
                  <span className="font-mono text-[#0F7C55]">{y}px</span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="1"
                  value={y}
                  onChange={(e) => setY(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0F7C55]"
                />
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2 w-full mt-6">
              <button
                type="button"
                onClick={handleCropConfirm}
                className="flex-1 bg-[#0F7C55] hover:bg-[#082F22] text-white py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.98]"
              >
                Valider
              </button>
              <button
                type="button"
                onClick={() => {
                  setCroppingImage(null);
                  setCroppingFile(null);
                }}
                className="px-4 border border-gray-200 text-gray-500 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#0F7C55] text-sm text-[#0F7C55] bg-white";

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
