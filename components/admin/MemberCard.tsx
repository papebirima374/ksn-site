import Image from "next/image";
import { Member } from "@/lib/admin-types";

type Props = {
  member: Member;
  size?: "preview" | "print";
};

export default function MemberCard({ member, size = "preview" }: Props) {
  // CR-80 ID-card aspect ratio (85.6 × 53.98 mm = ~1.586).
  // Preview is small on screen; print CSS forces 85.6mm × 53.98mm via @page.
  const w = size === "print" ? 540 : 460;
  const domicile =
    member.domicile ||
    [member.ville, member.region].filter(Boolean).join(", ") ||
    "—";

  return (
    <div
      className="print-card relative bg-[#FAF8F3] rounded-2xl overflow-hidden mx-auto"
      style={{
        width: `${w}px`,
        maxWidth: "100%",
        aspectRatio: "1.586 / 1",
        boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
      }}
    >
      {/* Decorative gold + green corner waves */}
      <svg
        className="absolute top-0 left-0"
        width="55%"
        height="40%"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,0 L0,140 Q120,40 400,80 L400,0 Z"
          fill="#0F5132"
          opacity="0.9"
        />
        <path
          d="M0,0 L0,90 Q90,30 320,55 L320,0 Z"
          fill="#D4AF37"
        />
      </svg>
      <svg
        className="absolute bottom-0 right-0"
        width="55%"
        height="40%"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M400,200 L400,60 Q280,160 0,120 L0,200 Z"
          fill="#0F5132"
          opacity="0.9"
        />
        <path
          d="M400,200 L400,110 Q310,170 80,145 L80,200 Z"
          fill="#D4AF37"
        />
      </svg>

      {/* Watermark logo */}
      <div className="absolute inset-0 flex items-center justify-end pr-4 opacity-10 pointer-events-none">
        <div className="relative w-[40%] aspect-square">
          <Image
            src="/logo/ksn-logo.png"
            alt=""
            fill
            sizes="200px"
            className="object-contain"
          />
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-3 sm:px-4 pt-2 sm:pt-3 flex items-center gap-2 sm:gap-3">
        <div className="relative w-7 h-7 sm:w-9 sm:h-9 flex-shrink-0">
          <Image
            src="/logo/ksn-logo.png"
            alt="KSN"
            fill
            sizes="40px"
            className="object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-[#0F5132] leading-tight text-[11px] sm:text-[13px]">
            KIPPAANGOG SALAATU &apos;ALAA NABII{" "}
            <span className="font-arabic">ﷺ</span>
          </p>
          <p className="text-[#B8860B] font-semibold tracking-widest text-[7px] sm:text-[8px]">
            CARTE DE MEMBRE
          </p>
        </div>
        <p className="text-[#0F5132] font-medium text-[7px] sm:text-[9px]">
          Siège : Touba
        </p>
      </div>

      <div
        className="relative z-10 mx-3 sm:mx-4 mt-1 h-px"
        style={{ background: "linear-gradient(to right, #D4AF37, transparent)" }}
      />

      {/* Body */}
      <div className="relative z-10 px-3 sm:px-4 pt-2 pb-3 grid grid-cols-[auto_1fr] gap-2 sm:gap-3 items-start">
        <div className="relative w-[78px] h-[100px] sm:w-[95px] sm:h-[120px] rounded-md overflow-hidden bg-[#E8E6E1] flex-shrink-0">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={`${member.prenom} ${member.nom}`}
              fill
              sizes="120px"
              className="object-cover"
              unoptimized={member.photo.startsWith("http")}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[#0F5132]/50 text-2xl font-display font-bold">
              {(member.prenom?.[0] ?? "?")}
              {(member.nom?.[0] ?? "")}
            </div>
          )}
        </div>

        <div className="text-[#0F5132] space-y-1 min-w-0">
          <Field
            label="Prénom & Nom"
            value={`${member.prenom} ${member.nom}`.trim() || "—"}
          />
          <Field label="Téléphone" value={member.telephone || "—"} />
          <Field label="Domicile" value={domicile} />
          <div className="pt-0.5">
            <p className="text-[#0F5132]/70 text-[7px] sm:text-[9px] leading-none">
              Matricule
            </p>
            <p className="font-display font-bold tabular-nums text-[#0F5132] text-[20px] sm:text-[26px] leading-none mt-0.5">
              {member.matricule}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[#0F5132]/70 text-[7px] sm:text-[9px] leading-tight">
        {label}
      </p>
      <p className="font-bold text-[#0F5132] truncate text-[10px] sm:text-[12px] leading-tight">
        {value}
      </p>
    </div>
  );
}
