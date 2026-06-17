import Image from "next/image";
import { Member } from "@/lib/admin-types";

type Props = {
  member: Member;
  size?: "preview" | "print";
};

// CR-80 ID card layout: 85.6 × 53.98 mm (aspect ratio 1.586).
export default function MemberCard({ member, size = "preview" }: Props) {
  const w = size === "print" ? "8.56cm" : "520px";
  const h = size === "print" ? "5.398cm" : "328px";
  const baseFontSize = size === "print" ? "0.27cm" : "15px";
  
  const domicile =
    member.domicile ||
    [member.ville, member.region].filter(Boolean).join(", ") ||
    "—";
  const fullName = `${member.prenom} ${member.nom}`.trim() || "—";

  return (
    <div
      className="print-card relative overflow-hidden mx-auto select-none"
      style={{
        width: w,
        height: h,
        maxWidth: "100%",
        borderRadius: "1.1em",
        boxShadow: size === "print" ? "none" : "0 15px 35px rgba(15, 81, 50, 0.12)",
        border: "0.08em solid rgba(15, 81, 50, 0.2)",
        background: "linear-gradient(135deg, #FCFAF6 0%, #F7F4EC 100%)",
        fontSize: baseFontSize,
      }}
    >
      {/* Subtle paper/cardboard texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
        }}
      />

      {/* TOP-LEFT CORNER WAVE */}
      <svg
        className="absolute top-0 left-0 pointer-events-none z-10"
        style={{ width: "12.5em", height: "5.5em" }}
        viewBox="0 0 150 70"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Lighter wave layer */}
        <path d="M 0,0 L 145,0 C 115,45 55,55 0,63 Z" fill="#149b74" opacity="0.35" />
        {/* Main green wave layer */}
        <path d="M 0,0 L 125,0 C 100,38 50,48 0,54 Z" fill="#0F7C55" />
        {/* Gold accent border */}
        <path d="M 0,54 C 50,48 100,38 125,0" fill="none" stroke="#D4AF37" strokeWidth="2" />
      </svg>

      {/* TOP-RIGHT CORNER WAVE */}
      <svg
        className="absolute top-0 right-0 pointer-events-none z-10"
        style={{ width: "10em", height: "4.5em" }}
        viewBox="0 0 150 70"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Lighter wave layer */}
        <path d="M 150,0 L 70,0 C 100,45 130,55 150,62 Z" fill="#149b74" opacity="0.35" />
        {/* Main green wave layer */}
        <path d="M 150,0 L 85,0 C 110,40 135,48 150,52 Z" fill="#0F7C55" />
        {/* Gold accent border */}
        <path d="M 150,52 C 135,48 110,40 85,0" fill="none" stroke="#D4AF37" strokeWidth="2" />
      </svg>

      {/* BOTTOM-LEFT CORNER WAVE */}
      <svg
        className="absolute bottom-0 left-0 pointer-events-none z-10"
        style={{ width: "12.5em", height: "5.5em" }}
        viewBox="0 0 150 70"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Lighter wave layer */}
        <path d="M 0,70 L 145,70 C 115,25 55,15 0,7 Z" fill="#149b74" opacity="0.35" />
        {/* Main green wave layer */}
        <path d="M 0,70 L 125,70 C 100,32 50,22 0,16 Z" fill="#0F7C55" />
        {/* Gold accent border */}
        <path d="M 0,16 C 50,22 100,32 125,70" fill="none" stroke="#D4AF37" strokeWidth="2" />
      </svg>

      {/* BOTTOM-RIGHT CORNER WAVE */}
      <svg
        className="absolute bottom-0 right-0 pointer-events-none z-10"
        style={{ width: "12.5em", height: "5.5em" }}
        viewBox="0 0 150 70"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Lighter wave layer */}
        <path d="M 150,70 L 70,70 C 100,25 130,15 150,8 Z" fill="#149b74" opacity="0.35" />
        {/* Main green wave layer */}
        <path d="M 150,70 L 85,70 C 110,30 135,22 150,18 Z" fill="#0F7C55" />
        {/* Gold accent border */}
        <path d="M 150,18 C 135,22 110,30 85,70" fill="none" stroke="#D4AF37" strokeWidth="2" />
      </svg>

      {/* Outer border frame inside card */}
      <div className="absolute inset-[0.5em] border border-[#0f5132]/10 rounded-[0.8em] pointer-events-none z-10" />

      {/* HEADER SECTION (White bg with green and gold text) */}
      <div className="relative z-20 flex items-center justify-between px-[1.8em] pt-[1.3em] pb-[0.4em]">
        <div className="flex items-center gap-[0.8em]">
          {/* Logo container */}
          <div
            className="relative rounded-full overflow-hidden bg-white border border-[#0F7C55]/20 shadow-sm"
            style={{ width: "3.2em", height: "3.2em" }}
          >
            <Image
              src="/logo/ksn-logo.png"
              alt="KSN Logo"
              fill
              sizes="80px"
              className="object-contain p-[0.1em]"
            />
          </div>
          {/* Title / Subtitle */}
          <div>
            <h1
              className="font-sans font-extrabold text-[#0F7C55] tracking-wide flex items-center gap-[0.2em] leading-none whitespace-nowrap"
              style={{ fontSize: "1.05em" }}
            >
              <span>KIPPAANGOG SALAATU &apos;ALAA NABII</span>
              <span className="font-serif font-bold text-[#D4AF37]">ﷺ</span>
            </h1>
            <p
              className="text-[#D4AF37] font-sans font-black tracking-[0.22em] mt-[0.3em] leading-none whitespace-nowrap"
              style={{ fontSize: "0.68em" }}
            >
              CARTE DE MEMBRE
            </p>
          </div>
        </div>
        
        {/* Siège Social */}
        <div className="text-right">
          <p className="text-[#0F7C55] font-extrabold uppercase tracking-wide leading-none border-b border-[#0F7C55]/30 pb-[0.2em] whitespace-nowrap" style={{ fontSize: "0.65em" }}>
            Siège Social: Touba
          </p>
        </div>
      </div>

      {/* Separator line under header */}
      <div className="relative z-20 w-[92%] mx-auto h-[1.5px] bg-[#0F7C55]/60" />

      {/* CARD BODY CONTENT (Vertically centered absolute panel) */}
      <div className="absolute left-[1.8em] right-[1.8em] top-[4.8em] bottom-[2.2em] z-20 grid grid-cols-[8.2em_1fr_7.0em] gap-[1.4em] items-center">
        
        {/* Photo Column */}
        <div
          className="relative rounded-xl overflow-hidden bg-[#EBF0ED] shadow-sm border border-[#0F7C55]/25"
          style={{ width: "8.2em", height: "9.8em" }}
        >
          {member.photo ? (
            <Image
              src={member.photo}
              alt={fullName}
              fill
              sizes="180px"
              className="object-cover"
              unoptimized={member.photo.startsWith("http")}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#E2EBE6] text-[#0F7C55]/30">
              <span className="font-serif font-black" style={{ fontSize: "2.2em" }}>
                {(member.prenom?.[0] ?? "?")}
                {(member.nom?.[0] ?? "")}
              </span>
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="relative flex flex-col gap-[0.65em] z-10 pl-[0.1em]">
          <Field label="Prénom & Nom" value={fullName} />
          <Field label="Téléphone" value={member.telephone || "—"} />
          <Field label="Domicile" value={domicile} />
          <Field label="Matricule" value={member.matricule || "—"} />
        </div>

        {/* QR Code Column (White container box on the right) */}
        <div className="flex flex-col items-center z-10">
          <div
            className="bg-white p-[0.45em] rounded-[0.7em] border border-[#0f5132]/12 shadow-md flex flex-col items-center justify-center"
            style={{ width: "7.0em", height: "7.0em" }}
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
            className="text-[#D4AF37] font-sans font-bold tracking-wide text-center mt-[0.5em] uppercase leading-none whitespace-nowrap"
            style={{ fontSize: "0.45em" }}
          >
            Scannez pour vérifier
          </p>
        </div>

      </div>

      {/* BOTTOM SLOGAN BAR centered overlay */}
      <div className="absolute bottom-[0.75em] left-0 right-0 text-center z-20 pointer-events-none">
        <p
          className="text-[#0F7C55] font-sans tracking-[0.28em] font-extrabold uppercase leading-none whitespace-nowrap"
          style={{ fontSize: "0.62em" }}
        >
          COM. KSN . SALAATUALAANABII.COM
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-[0.15em] leading-none">
      <span
        className="text-[#0F7C55]/95 font-sans font-semibold tracking-wide"
        style={{ fontSize: "0.62em" }}
      >
        {label}
      </span>
      <span
        className="text-[#1A1A1A] font-sans font-extrabold tracking-wide truncate"
        style={{ fontSize: "1.0em" }}
      >
        {value}
      </span>
    </div>
  );
}

