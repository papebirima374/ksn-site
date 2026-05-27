import Image from "next/image";
import { Member } from "@/lib/admin-types";

type Props = {
  member: Member;
  size?: "preview" | "print";
};

// CR-80 ID card layout: 85.6 × 53.98 mm (aspect ratio 1.586).
// The preview renders at 520 px wide; print CSS overrides to real mm via @page.
export default function MemberCard({ member, size = "preview" }: Props) {
  const w = size === "print" ? 540 : 520;
  const domicile =
    member.domicile ||
    [member.ville, member.region].filter(Boolean).join(", ") ||
    "—";
  const fullName = `${member.prenom} ${member.nom}`.trim() || "—";

  return (
    <div
      className="print-card relative bg-[#FAF8F3] overflow-hidden mx-auto"
      style={{
        width: `${w}px`,
        maxWidth: "100%",
        aspectRatio: "1.586 / 1",
        borderRadius: "14px",
        boxShadow: size === "print" ? "none" : "0 25px 60px rgba(0,0,0,0.18)",
        border: "1px solid rgba(184, 134, 11, 0.2)",
      }}
    >
      {/* Decorative background curves (green + gold) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 540 340"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8C6207" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#F3E5AB" />
            <stop offset="100%" stopColor="#AA7C11" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#072215" />
            <stop offset="50%" stopColor="#0F5132" />
            <stop offset="100%" stopColor="#1B5E3A" />
          </linearGradient>
        </defs>
        
        {/* Top-left curves */}
        <path d="M 0,0 L 340,0 C 270,95 190,130 0,115 Z" fill="url(#greenGrad)" />
        <path d="M 0,0 L 310,0 C 250,80 180,105 0,90 Z" fill="url(#goldGrad)" opacity="0.9" />
        
        {/* Bottom-right curves */}
        <path d="M 540,340 L 200,340 C 270,245 350,210 540,225 Z" fill="url(#greenGrad)" />
        <path d="M 540,340 L 230,340 C 290,260 360,235 540,250 Z" fill="url(#goldGrad)" opacity="0.9" />
      </svg>

      {/* Premium inner border frame */}
      <div className="absolute inset-[10px] border border-[#D4AF37]/30 rounded-[10px] pointer-events-none z-20" />

      {/* Circular Seal Watermark (in the background, behind layout) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg
          viewBox="0 0 120 120"
          className="w-[48%] aspect-square opacity-[0.08] text-[#0F5132]"
          style={{ transform: "rotate(-12deg) translateX(40px)" }}
        >
          <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3,1.5" />
          <circle cx="60" cy="60" r="42" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path id="seal-text-path" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" fill="none" />
          <text className="font-sans font-bold uppercase tracking-wider" style={{ fontSize: "7px", fill: "currentColor" }}>
            <textPath href="#seal-text-path" startOffset="50%" textAnchor="middle">
              KIPPAANGOG SALAATU • TOUBA SENEGAL •
            </textPath>
          </text>
          <text x="60" y="68" textAnchor="middle" className="font-serif font-extrabold" style={{ fontSize: "24px", fill: "currentColor" }}>
            ﷺ
          </text>
          <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1,2" />
        </svg>
      </div>

      {/* Top Header Section */}
      <div className="relative z-10 pt-[3.8%] px-[5%] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className="relative rounded-full overflow-hidden bg-white border border-[#D4AF37]/50 shadow-sm"
            style={{ width: "13%", aspectRatio: "1 / 1", minWidth: 32 }}
          >
            <Image
              src="/logo/ksn-logo.png"
              alt="KSN"
              fill
              sizes="60px"
              className="object-contain p-0.5"
            />
          </div>
          <div className="leading-tight">
            <p
              className="font-sans font-extrabold text-white tracking-wide flex items-center gap-1"
              style={{ fontSize: size === "print" ? "12px" : "11px" }}
            >
              <span>KIPPAANGOG SALAATU &apos;ALAA NABII</span>
              <span className="font-serif font-bold text-[#D4AF37]">ﷺ</span>
            </p>
            <p
              className="text-[#D4AF37] font-sans font-extrabold tracking-[0.22em] text-shadow-sm"
              style={{ fontSize: "8px" }}
            >
              CARTE DE MEMBRE
            </p>
          </div>
        </div>
        <p
          className="text-white/95 font-bold font-sans text-right"
          style={{ fontSize: "9px" }}
        >
          Siège : Touba
        </p>
      </div>

      {/* Main content grid */}
      <div className="relative z-10 px-[5%] pt-[3.5%] grid grid-cols-[30%_1fr] gap-[5%] items-center">
        {/* Photo Holder */}
        <div
          className="relative rounded-lg overflow-hidden bg-[#E8E6E1] shadow-md border border-[#D4AF37]/45"
          style={{ aspectRatio: "3 / 4" }}
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
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#FAF8F3] to-[#E8E6E1] text-[#0F5132]/40">
              <span className="font-serif font-bold text-2xl">
                {(member.prenom?.[0] ?? "?")}
                {(member.nom?.[0] ?? "")}
              </span>
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="space-y-[4%] text-[#0F5132]">
          <Field
            label="Prénom & Nom"
            value={fullName}
            primary
          />
          
          <div className="grid grid-cols-2 gap-2">
            <Field
              label="Téléphone"
              value={member.telephone || "—"}
            />
            <Field
              label="Domicile"
              value={domicile}
            />
          </div>

          <div className="flex items-end justify-between border-t border-[#0F5132]/10 pt-1.5 mt-1">
            <div>
              <p
                className="text-[#0F5132]/60 uppercase tracking-wider font-semibold font-sans leading-none"
                style={{ fontSize: "7.5px" }}
              >
                Matricule
              </p>
              <p
                className="font-sans font-black tabular-nums leading-none mt-1 text-[#0F5132]"
                style={{
                  fontSize: size === "print" ? "24px" : "26px",
                  letterSpacing: "0.5px",
                }}
              >
                {member.matricule}
              </p>
            </div>
            
            {/* Fine watermark decorative text */}
            <p className="text-right text-[#0F5132]/40 font-mono text-[7px] leading-none mb-1 select-none">
              KSN-MEMBRE-OFFICIEL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  primary,
}: {
  label: string;
  value: string;
  primary?: boolean;
}) {
  return (
    <div>
      <p
        className="text-[#0F5132]/60 uppercase tracking-wider font-semibold font-sans leading-none"
        style={{ fontSize: "7.5px" }}
      >
        {label}
      </p>
      <p
        className="font-bold text-[#0F5132] truncate leading-tight mt-0.5"
        style={{ fontSize: primary ? "14px" : "11px" }}
      >
        {value}
      </p>
    </div>
  );
}
