import Image from "next/image";
import { Member } from "@/lib/admin-types";

type Props = {
  member: Member;
  size?: "preview" | "print";
  // Quand true, la photo passe par un proxy same-origin (/api/img-proxy) pour
  // être capturable par html2canvas sans erreur CORS (planche de cartes PDF).
  proxyImages?: boolean;
  // QR pré-généré (data URL). Fourni lors de la génération de la planche PDF
  // pour éviter 1 appel réseau par carte (sinon très lent en masse).
  qrDataUrl?: string;
};

// Carte de membre format CR-80 (carte d'identité) : 85,6 × 53,98 mm — ratio 1.586.
// Design islamique KSN (vert #0F7C55 / or #D4AF37) : bandeau dégradé, logo,
// titre centré, photo en carré arrondi, infos + QR de vérification, bas de carte.
// Tailles en `em` calées pour un rendu d'impression identique à l'aperçu.
const PRINT_FIX = {
  WebkitPrintColorAdjust: "exact" as const,
  printColorAdjust: "exact" as const,
};

export default function MemberCard({ member, size = "preview", proxyImages = false, qrDataUrl }: Props) {
  const w = size === "print" ? "8.56cm" : "540px";
  const h = size === "print" ? "5.398cm" : "340px";
  const baseFontSize = size === "print" ? "0.238cm" : "15px";

  const domicile =
    member.ville ||
    member.domicile ||
    [member.ville, member.region].filter(Boolean).join(", ") ||
    "—";
  const fullName = `${member.prenom} ${member.nom}`.trim() || "—";
  const verifyUrl = `https://salaatualaanabii.com/verifier-carte/${member.matricule}`;
  const qrDirect = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=${encodeURIComponent(verifyUrl)}`;
  // Priorité au QR pré-généré (data URL, zéro réseau) ; sinon proxy ; sinon direct.
  const qrSrc = qrDataUrl
    ? qrDataUrl
    : proxyImages
      ? `/api/img-proxy?url=${encodeURIComponent(qrDirect)}`
      : qrDirect;
  const photoSrc =
    member.photo && proxyImages && /^https?:/.test(member.photo)
      ? `/api/img-proxy?url=${encodeURIComponent(member.photo)}`
      : member.photo;

  return (
    <div
      className="print-card relative overflow-hidden mx-auto select-none flex flex-col"
      style={{
        width: w,
        height: h,
        maxWidth: "100%",
        borderRadius: "1.1em",
        boxShadow: size === "print" ? "none" : "0 18px 40px rgba(15, 81, 50, 0.18)",
        border: "0.07em solid rgba(15, 81, 50, 0.18)",
        background: "#FCFBF7",
        fontSize: baseFontSize,
        ...PRINT_FIX,
      }}
    >
      {/* ── BANDEAU SUPÉRIEUR (dégradé vert, titre centré) ──────────── */}
      <div
        className="relative flex-shrink-0"
        style={{
          height: "7em",
          background:
            "linear-gradient(125deg, #0F7C55 0%, #0A3D24 70%, #082F22 100%)",
          ...PRINT_FIX,
        }}
      >
        {/* Motif géométrique islamique discret */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.12,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 0l6 6-6 6-6-6zM0 20l6 6-6 6zM40 20l-6 6 6 6zM20 40l6-6-6-6-6 6z' fill='%23D4AF37'/%3E%3C/svg%3E\")",
            backgroundSize: "2.4em 2.4em",
            ...PRINT_FIX,
          }}
        />

        {/* Logo (gauche, plus grand, bordure or fine, sans rond blanc) */}
        <div
          className="absolute z-10 rounded-full overflow-hidden shadow-md"
          style={{ width: "5.2em", height: "5.2em", left: "1.2em", top: "0.9em", border: "0.1em solid #D4AF37", ...PRINT_FIX }}
        >
          <Image
            src="/logo/ksn-logo.png"
            alt="Logo KSN"
            fill
            sizes="110px"
            className="object-cover"
            style={{ transform: "scale(1.2)" }}
          />
        </div>

        {/* Titre centré (plus grand) */}
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center text-center px-[6em]">
          <h1
            className="font-sans font-extrabold text-white leading-[1.15] tracking-wide"
            style={{ fontSize: "1.12em" }}
          >
            Kippaangog Salaatu &apos;Alaa Nabii{" "}
            <span className="font-serif text-[#D4AF37]">ﷺ</span>
          </h1>
          <p
            className="text-[#D4AF37] font-sans font-black uppercase tracking-[0.26em] mt-[0.5em] leading-none"
            style={{ fontSize: "0.72em" }}
          >
            Carte de Membre Officielle
          </p>
        </div>
      </div>

      {/* ── CORPS : photo (carré arrondi) + infos + QR ─────────────── */}
      <div className="relative flex-1 flex items-center" style={{ padding: "0.85em 1.4em" }}>
        {/* Photo en carré arrondi */}
        <div
          className="relative rounded-[0.9em] overflow-hidden flex-shrink-0 bg-[#EBF0ED] self-center"
          style={{ width: "8.8em", height: "8.8em", border: "0.14em solid #D4AF37", ...PRINT_FIX }}
        >
          {member.photo ? (
            proxyImages ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoSrc}
                alt={fullName}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={member.photo}
                alt={fullName}
                fill
                sizes="180px"
                className="object-cover"
                unoptimized={member.photo.startsWith("http")}
              />
            )
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white to-[#E2EBE6] text-[#0F7C55]/35" style={PRINT_FIX}>
              <span className="font-serif font-black" style={{ fontSize: "2.6em" }}>
                {(member.prenom?.[0] ?? "?")}
                {(member.nom?.[0] ?? "")}
              </span>
            </div>
          )}
        </div>

        {/* Infos (label au-dessus de la valeur) */}
        <div className="flex-1 flex flex-col justify-center gap-[0.55em]" style={{ paddingLeft: "1.2em", paddingRight: "0.8em" }}>
          <Field label="Prénom & Nom" value={fullName} />
          <Field label="Téléphone" value={member.telephone || "—"} />
          <Field label="Domicile" value={domicile} />
          <Field label="Matricule" value={`N° ${member.matricule || "—"}`} highlight />
        </div>

        {/* QR de vérification (à côté des infos) */}
        <div className="flex flex-col items-center flex-shrink-0 self-center">
          <div
            className="bg-white rounded-[0.6em] shadow-md flex items-center justify-center"
            style={{ width: "6.4em", height: "6.4em", padding: "0.4em", border: "0.06em solid rgba(15,81,50,0.12)", ...PRINT_FIX }}
          >
            {member.matricule ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrSrc}
                alt="QR de vérification"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-center font-sans" style={{ fontSize: "0.5em" }}>
                QR Code
              </div>
            )}
          </div>
          <p
            className="text-[#0F7C55] font-sans font-bold uppercase tracking-wide text-center mt-[0.4em] leading-none whitespace-nowrap"
            style={{ fontSize: "0.45em" }}
          >
            Scannez pour vérifier
          </p>
        </div>
      </div>

      {/* ── BAS DE CARTE ───────────────────────────────────────────── */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center"
        style={{ height: "1.9em", borderTop: "0.12em solid #D4AF37", ...PRINT_FIX }}
      >
        <p
          className="text-[#0F7C55] font-sans font-extrabold uppercase tracking-[0.06em] leading-none whitespace-nowrap"
          style={{ fontSize: "0.56em" }}
        >
          Siège Social : Touba · Com. KSN · salaatualaanabii.com
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-[0.5em] leading-none min-w-0">
      <span
        className="rounded-full flex-shrink-0"
        style={{ width: "0.45em", height: "0.45em", marginTop: "0.4em", background: "#D4AF37", ...PRINT_FIX }}
      />
      <div className="min-w-0">
        <span
          className="block text-[#0F7C55]/70 font-sans font-bold uppercase tracking-[0.1em]"
          style={{ fontSize: "0.54em" }}
        >
          {label}
        </span>
        <span
          className={`block font-sans font-extrabold tracking-wide truncate ${
            highlight ? "text-[#B8860B]" : "text-[#161616]"
          }`}
          style={{ fontSize: "0.92em", marginTop: "0.1em" }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
