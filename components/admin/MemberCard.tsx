import Image from "next/image";
import { Member } from "@/lib/admin-types";

type Props = {
  member: Member;
  size?: "preview" | "print";
};

// CR-80 ID card layout: 85.6 × 53.98 mm (aspect ratio 1.586).
export default function MemberCard({ member, size = "preview" }: Props) {
  const w = size === "print" ? 540 : 520;
  const domicile =
    member.domicile ||
    [member.ville, member.region].filter(Boolean).join(", ") ||
    "—";
  const fullName = `${member.prenom} ${member.nom}`.trim() || "—";

  return (
    <div
      className="print-card relative overflow-hidden mx-auto"
      style={{
        width: `${w}px`,
        maxWidth: "100%",
        aspectRatio: "1.586 / 1",
        borderRadius: "14px",
        boxShadow: size === "print" ? "none" : "0 20px 50px rgba(0,0,0,0.12)",
        border: "1px solid rgba(15, 81, 50, 0.15)",
        // Soft white paper texture background
        background: "linear-gradient(135deg, #ffffff 0%, #faf9f6 50%, #f4f2eb 100%)",
      }}
    >
      {/* Background paper texture pattern (subtle dot grid) */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#0c4228 0.5px, transparent 0.5px)",
          backgroundSize: "10px 10px",
        }}
      />

      {/* Decorative accent waves from the old design */}
      {/* Top Edge Wave (green with gold trim) */}
      <svg
        className="absolute top-0 right-0 pointer-events-none z-10"
        style={{ width: "42%", height: "16%" }}
        viewBox="0 0 200 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M 0,0 Q 90,28 200,8 L 200,0 Z" fill="#0F5132" />
        <path d="M 0,0 Q 90,28 200,8" fill="none" stroke="#D4AF37" strokeWidth="2" />
      </svg>

      {/* Bottom Edge Wave (green with gold trim) */}
      <svg
        className="absolute bottom-0 left-0 pointer-events-none z-10"
        style={{ width: "35%", height: "14%" }}
        viewBox="0 0 160 30"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M 0,30 L 160,30 Q 95,4 0,16 Z" fill="#0F5132" />
        <path d="M 0,16 Q 95,4 160,30" fill="none" stroke="#D4AF37" strokeWidth="2" />
      </svg>

      {/* Clean border frame */}
      <div className="absolute inset-[8px] border border-[#0f5132]/10 rounded-[10px] pointer-events-none z-20" />

      {/* Header Section */}
      <div className="relative z-20 pt-[4%] px-[5%]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Logo container */}
            <div
              className="relative rounded-full overflow-hidden bg-white border border-[#0f5132]/20 shadow-sm"
              style={{ width: "38px", height: "38px" }}
            >
              <Image
                src="/logo/ksn-logo.png"
                alt="KSN Logo"
                fill
                sizes="60px"
                className="object-contain p-0.5"
              />
            </div>
            {/* Title / Subtitle */}
            <div>
              <h1
                className="font-sans font-extrabold text-[#0F5132] tracking-wide flex items-center gap-1.5"
                style={{ fontSize: "12.5px" }}
              >
                <span>KIPPAANGOG SALAATU &apos;ALAA NABII</span>
                <span className="font-serif font-bold text-[#0F5132]">ﷺ</span>
              </h1>
              <p
                className="text-[#D4AF37] font-sans font-black tracking-[0.24em] mt-0.5"
                style={{ fontSize: "8.5px" }}
              >
                CARTE DE MEMBRE
              </p>
            </div>
          </div>
          {/* Siège */}
          <p
            className="text-[#0F5132]/85 font-bold font-sans text-right mr-[15%] sm:mr-[20%]"
            style={{ fontSize: "8.5px" }}
          >
            Siège Social: Touba
          </p>
        </div>

        {/* Separator Line */}
        <div
          className="w-full h-[1.5px] mt-2.5"
          style={{
            background: "linear-gradient(to right, #0F5132 0%, #D4AF37 35%, #FAF8F3 100%)",
          }}
        />
      </div>

      {/* Main Grid Content */}
      <div className="relative z-20 px-[5%] pt-[3%] grid grid-cols-[28%_1fr] gap-[6%] items-start">
        {/* Photo Column */}
        <div
          className="relative rounded-lg overflow-hidden bg-[#E8E6E1] shadow-sm border border-[#0F5132]/15 mt-1"
          style={{ width: "100%", aspectRatio: "1 / 1.15" }}
        >
          {member.photo ? (
            <Image
              src={member.photo}
              alt={fullName}
              fill
              sizes="200px"
              className="object-cover"
              unoptimized={member.photo.startsWith("http")}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#E8E6E1] text-[#0F5132]/45">
              <span className="font-serif font-bold text-2xl">
                {(member.prenom?.[0] ?? "?")}
                {(member.nom?.[0] ?? "")}
              </span>
            </div>
          )}
        </div>

        {/* Details Column with Watermark Seal behind it */}
        <div className="relative w-full flex flex-col gap-2.5 mt-1">
          {/* Circular watermark seal */}
          <div className="absolute right-[5%] bottom-[5%] w-[52%] aspect-square opacity-[0.09] text-[#0F5132] pointer-events-none z-0">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
              <circle cx="60" cy="60" r="41" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <path id="seal-text-path-2" d="M 60,60 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" fill="none" />
              <text className="font-sans font-bold uppercase tracking-wider" style={{ fontSize: "6.5px", fill: "currentColor" }}>
                <textPath href="#seal-text-path-2" startOffset="50%" textAnchor="middle">
                  KIPPAANGOG SALAATU • TOUBA SENEGAL •
                </textPath>
              </text>
              <text x="60" y="66" textAnchor="middle" className="font-serif font-bold" style={{ fontSize: "20px", fill: "currentColor" }}>
                ﷺ
              </text>
              <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1,2" />
            </svg>
          </div>

          {/* Details fields */}
          <div className="relative z-10">
            <Field label="Prénom & Nom" value={fullName} />
          </div>

          <div className="relative z-10">
            <Field label="Téléphone" value={member.telephone || "—"} />
          </div>

          <div className="relative z-10">
            <Field label="Domicile" value={domicile} />
          </div>

          <div className="relative z-10">
            <Field label="Matricule" value={member.matricule} isMatricule />
          </div>
        </div>
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
    <div>
      <p className="text-[#0F5132]/60 uppercase tracking-widest font-extrabold font-sans text-[7.5px] leading-none">
        {label}
      </p>
      <p
        className={`text-[#0F5132] leading-tight mt-1 ${
          isMatricule
            ? "font-sans font-black text-[18px] tracking-wide"
            : "font-sans font-bold text-[12.5px] truncate"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

