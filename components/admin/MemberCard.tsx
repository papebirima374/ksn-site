import Image from "next/image";
import { Member } from "@/lib/admin-types";

type Props = {
  member: Member;
  size?: "preview" | "print";
};

// CR-80 ID card layout: 85.6 × 53.98 mm (aspect ratio 1.586).
export default function MemberCard({ member, size = "preview" }: Props) {
  const w = size === "print" ? 540 : 520;
  const h = Math.round(w / 1.586);
  const baseFontSize = size === "print" ? "14.5px" : "14px";
  
  const domicile =
    member.domicile ||
    [member.ville, member.region].filter(Boolean).join(", ") ||
    "—";
  const fullName = `${member.prenom} ${member.nom}`.trim() || "—";

  return (
    <div
      className="print-card relative overflow-hidden mx-auto select-none"
      style={{
        width: `${w}px`,
        height: `${h}px`,
        maxWidth: "100%",
        borderRadius: "1.1em",
        boxShadow: size === "print" ? "none" : "0 15px 35px rgba(15, 81, 50, 0.15)",
        border: "0.08em solid rgba(15, 81, 50, 0.18)",
        background: "linear-gradient(135deg, #ffffff 0%, #FAF8F5 50%, #F5F2EB 100%)",
        fontSize: baseFontSize,
      }}
    >
      {/* Background paper texture pattern (subtle dot grid) */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(#0f7c55 0.6px, transparent 0.6px)",
          backgroundSize: "0.8em 0.8em",
        }}
      />

      {/* Outer border frame inside card */}
      <div className="absolute inset-[0.5em] border border-[#0f5132]/10 rounded-[0.8em] pointer-events-none z-10" />

      {/* HEADER BAND */}
      <div
        className="relative z-20 flex items-center justify-between px-[1.2em] py-[0.7em]"
        style={{
          background: "linear-gradient(135deg, #093E2B 0%, #0F7C55 100%)",
          borderBottom: "0.15em solid #D4AF37",
          borderTopLeftRadius: "1.05em",
          borderTopRightRadius: "1.05em",
        }}
      >
        <div className="flex items-center gap-[0.7em]">
          {/* Logo container */}
          <div
            className="relative rounded-full overflow-hidden bg-white border border-[#D4AF37]/50 shadow-sm"
            style={{ width: "2.6em", height: "2.6em" }}
          >
            <Image
              src="/logo/ksn-logo.png"
              alt="KSN Logo"
              fill
              sizes="60px"
              className="object-contain p-[0.1em]"
            />
          </div>
          {/* Title / Subtitle */}
          <div>
            <h1
              className="font-sans font-extrabold text-white tracking-wide flex items-center gap-[0.2em] leading-none"
              style={{ fontSize: "0.88em" }}
            >
              <span>KIPPAANGOG SALAATU &apos;ALAA NABII</span>
              <span className="font-serif font-bold text-[#D4AF37]">ﷺ</span>
            </h1>
            <p
              className="text-[#D4AF37] font-sans font-black tracking-[0.25em] mt-[0.3em] leading-none"
              style={{ fontSize: "0.58em" }}
            >
              CARTE DE MEMBRE OFFICIELLE
            </p>
          </div>
        </div>
        
        {/* Location tag */}
        <div className="text-right">
          <p className="text-[#D4AF37] font-black uppercase tracking-widest leading-none" style={{ fontSize: "0.58em" }}>
            TOUBA
          </p>
          <p className="text-white/60 font-sans mt-[0.3em] leading-none" style={{ fontSize: "0.48em" }}>
            SÉNÉGAL
          </p>
        </div>
      </div>

      {/* CARD BODY CONTENT */}
      <div className="relative z-20 px-[1.2em] pt-[1em] grid grid-cols-[6.4em_1fr_6.5em] gap-[0.8em] items-start">
        
        {/* Photo Column */}
        <div
          className="relative rounded-lg overflow-hidden bg-[#E8E6E1] shadow-sm border border-[#0F7C55]/20 mt-[0.2em]"
          style={{ width: "6.2em", height: "7.3em" }}
        >
          {member.photo ? (
            <Image
              src={member.photo}
              alt={fullName}
              fill
              sizes="150px"
              className="object-cover"
              unoptimized={member.photo.startsWith("http")}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#E8E6E1] text-[#0F7C55]/35">
              <span className="font-serif font-black" style={{ fontSize: "1.8em" }}>
                {(member.prenom?.[0] ?? "?")}
                {(member.nom?.[0] ?? "")}
              </span>
            </div>
          )}
        </div>

        {/* Details Column with Circular Watermark Seal behind it */}
        <div className="relative flex flex-col gap-[0.5em] mt-[0.2em] z-10">
          {/* Circular watermark seal */}
          <div className="absolute right-0 bottom-0 w-[8em] aspect-square opacity-[0.07] text-[#0F7C55] pointer-events-none z-0">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
              <circle cx="60" cy="60" r="41" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <path id="seal-text-path-card" d="M 60,60 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" fill="none" />
              <text className="font-sans font-bold uppercase tracking-wider" style={{ fontSize: "6.5px", fill: "currentColor" }}>
                <textPath href="#seal-text-path-card" startOffset="50%" textAnchor="middle">
                  KIPPAANGOG SALAATU • TOUBA SENEGAL •
                </textPath>
              </text>
              <text x="60" y="66" textAnchor="middle" className="font-serif font-bold" style={{ fontSize: "20px", fill: "currentColor" }}>
                ﷺ
              </text>
            </svg>
          </div>

          {/* Fields */}
          <div className="relative z-10">
            <Field label="Prénom & Nom" value={fullName} />
          </div>

          <div className="relative z-10">
            <Field label="Téléphone" value={member.telephone || "—"} />
          </div>

          <div className="relative z-10">
            <Field label="Domicile" value={domicile} />
          </div>

          <div className="relative z-10 mt-[0.1em]">
            <Field label="Matricule" value={member.matricule} isMatricule />
          </div>
        </div>

        {/* QR Code Column (White container box on the right) */}
        <div className="flex flex-col items-center mt-[0.2em] z-10">
          <div
            className="bg-white p-[0.45em] rounded-[0.7em] border border-[#0f5132]/12 shadow-sm flex flex-col items-center justify-center"
            style={{ width: "6.2em", height: "6.2em" }}
          >
            {member.matricule ? (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`https://salaatualaanabii.com/verifier-carte/${member.matricule}`)}`}
                alt="QR Code"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full border border-dashed border-gray-200 rounded flex items-center justify-center text-[0.45em] text-gray-400 text-center font-sans">
                QR Code
              </div>
            )}
          </div>
          <p
            className="text-[#D4AF37] font-sans font-bold tracking-wide text-center mt-[0.5em] uppercase leading-none"
            style={{ fontSize: "0.42em" }}
          >
            Scannez pour vérifier
          </p>
        </div>

      </div>

      {/* BOTTOM SLOGAN BAR */}
      <div
        className="absolute bottom-0 left-0 right-0 py-[0.35em] text-center z-20"
        style={{
          background: "linear-gradient(135deg, #093E2B 0%, #0F7C55 100%)",
          borderTop: "0.1em solid #D4AF37",
          borderBottomLeftRadius: "1.05em",
          borderBottomRightRadius: "1.05em",
        }}
      >
        <p
          className="text-white/80 font-sans tracking-widest font-semibold uppercase leading-none"
          style={{ fontSize: "0.52em" }}
        >
          Propulsé par KSN Tech • salaatualaanabii.com
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  isMatricule,
}: {
  label: string;
  value: string;
  isMatricule?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-[0.3em] leading-none">
        {/* Orange-gold bullet point from the visitor card example */}
        <span className="w-[0.35em] h-[0.35em] rounded-sm bg-[#D4AF37] flex-shrink-0" />
        <span
          className="text-[#0F7C55]/60 uppercase tracking-wider font-black font-sans leading-none"
          style={{ fontSize: "0.52em" }}
        >
          {label}
        </span>
      </div>
      <p
        className={`text-[#0F7C55] leading-none ${
          isMatricule
            ? "font-sans font-black tracking-wider text-[1.25em] mt-[0.25em] text-[#B8860B]"
            : "font-sans font-bold text-[0.8em] mt-[0.25em] truncate"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

