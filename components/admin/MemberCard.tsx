import Image from "next/image";
import { Member } from "@/lib/admin-types";

type Props = {
  member: Member;
  size?: "preview" | "print";
};

// Carte de membre format CR-80 (carte d'identité) : 85,6 × 53,98 mm — ratio 1.586.
// Design inspiré d'une carte de visite pro, adapté à l'identité islamique KSN
// (vert #0F7C55 / or #D4AF37) : bandeau dégradé + logo + QR encadré + photo +
// champs à puces dorées + bas de carte. Tailles en `em` pour un rendu d'impression fidèle.
export default function MemberCard({ member, size = "preview" }: Props) {
  const w = size === "print" ? "8.56cm" : "540px";
  const h = size === "print" ? "5.398cm" : "340px";
  // Base em calée pour que le print partage exactement la grille du preview
  // (≈ 36em de large) → rendu d'impression identique à l'aperçu écran.
  const baseFontSize = size === "print" ? "0.238cm" : "15px";

  const domicile =
    member.ville ||
    member.domicile ||
    [member.ville, member.region].filter(Boolean).join(", ") ||
    "—";
  const fullName = `${member.prenom} ${member.nom}`.trim() || "—";
  const verifyUrl = `https://salaatualaanabii.com/verifier-carte/${member.matricule}`;

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
      }}
    >
      {/* ── BANDEAU SUPÉRIEUR (dégradé vert) ───────────────────────── */}
      <div
        className="relative"
        style={{
          height: "9em",
          background:
            "linear-gradient(125deg, #0F7C55 0%, #0A3D24 70%, #082F22 100%)",
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
          }}
        />
        {/* Cercles décoratifs (profondeur) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{ width: "9em", height: "9em", top: "-4em", right: "9em", background: "rgba(212,175,55,0.10)" }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{ width: "6em", height: "6em", bottom: "-3em", left: "5em", background: "rgba(255,255,255,0.05)" }}
        />

        {/* Logo + titre (gauche) */}
        <div className="absolute z-10 flex items-center gap-[0.7em]" style={{ left: "1.4em", top: "1.25em", right: "8.2em" }}>
          <div
            className="relative rounded-full overflow-hidden bg-white shadow-md flex-shrink-0"
            style={{ width: "3.5em", height: "3.5em", border: "0.12em solid rgba(212,175,55,0.6)" }}
          >
            <Image src="/logo/ksn-logo.png" alt="Logo KSN" fill sizes="80px" className="object-contain p-[0.12em]" />
          </div>
          <div className="min-w-0">
            <h1
              className="font-sans font-extrabold text-white leading-[1.12] tracking-wide"
              style={{ fontSize: "0.82em" }}
            >
              Kippaangog Salaatu &apos;Alaa Nabii{" "}
              <span className="font-serif text-[#D4AF37]">ﷺ</span>
            </h1>
            <p
              className="text-[#D4AF37] font-sans font-black uppercase tracking-[0.2em] mt-[0.35em] leading-none"
              style={{ fontSize: "0.62em" }}
            >
              Carte de Membre Officielle
            </p>
          </div>
        </div>

        {/* QR encadré (droite, déborde légèrement sur le corps) */}
        <div
          className="absolute z-20 bg-white rounded-[0.7em] shadow-lg flex flex-col items-center justify-center"
          style={{ width: "6.6em", height: "6.6em", right: "1.4em", top: "1.4em", padding: "0.45em" }}
        >
          {member.matricule ? (
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=${encodeURIComponent(verifyUrl)}`}
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
      </div>

      {/* ── CORPS (photo + champs) ─────────────────────────────────── */}
      <div className="relative flex-1 flex items-stretch" style={{ padding: "1.15em 1.4em 0.7em" }}>
        {/* Photo du membre */}
        <div
          className="relative rounded-[0.7em] overflow-hidden flex-shrink-0 bg-[#EBF0ED]"
          style={{ width: "7.3em", height: "100%", border: "0.13em solid #D4AF37" }}
        >
          {member.photo ? (
            <Image
              src={member.photo}
              alt={fullName}
              fill
              sizes="160px"
              className="object-cover"
              unoptimized={member.photo.startsWith("http")}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#E2EBE6] text-[#0F7C55]/35">
              <span className="font-serif font-black" style={{ fontSize: "2.4em" }}>
                {(member.prenom?.[0] ?? "?")}
                {(member.nom?.[0] ?? "")}
              </span>
            </div>
          )}
        </div>

        {/* Champs à puces dorées */}
        <div className="flex-1 flex flex-col justify-center gap-[0.6em]" style={{ paddingLeft: "1.25em" }}>
          <Field label="Prénom & Nom" value={fullName} />
          <Field label="Téléphone" value={member.telephone || "—"} />
          <Field label="Domicile" value={domicile} />
          <Field label="Matricule" value={`N° ${member.matricule || "—"}`} highlight />
        </div>
      </div>

      {/* ── BAS DE CARTE ───────────────────────────────────────────── */}
      <div
        className="relative flex items-center justify-center"
        style={{ height: "2.1em", borderTop: "0.12em solid #D4AF37" }}
      >
        <p
          className="text-[#0F7C55] font-sans font-extrabold uppercase tracking-[0.18em] leading-none whitespace-nowrap"
          style={{ fontSize: "0.6em" }}
        >
          Siège : Touba · salaatualaanabii.com
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
    <div className="flex items-start gap-[0.55em] leading-none min-w-0">
      {/* Puce dorée */}
      <span
        className="rounded-full flex-shrink-0"
        style={{ width: "0.5em", height: "0.5em", marginTop: "0.45em", background: "#D4AF37" }}
      />
      <div className="min-w-0">
        <span
          className="block text-[#0F7C55]/70 font-sans font-bold uppercase tracking-[0.12em]"
          style={{ fontSize: "0.56em" }}
        >
          {label}
        </span>
        <span
          className={`block font-sans font-extrabold tracking-wide truncate ${
            highlight ? "text-[#B8860B]" : "text-[#161616]"
          }`}
          style={{ fontSize: "0.96em", marginTop: "0.12em" }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
