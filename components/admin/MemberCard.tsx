import Image from "next/image";
import { Member } from "@/lib/admin-types";

type Props = {
  member: Member;
  size?: "preview" | "print";
};

export default function MemberCard({ member, size = "preview" }: Props) {
  const w = size === "print" ? 1012 : 720;
  const h = Math.round(w * 0.63);
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
        aspectRatio: "1.6 / 1",
        boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
      }}
    >
      {/* Decorative gold corners */}
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

      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-end pr-6 sm:pr-10 opacity-10 pointer-events-none">
        <div
          className="relative"
          style={{ width: `${h * 0.5}px`, height: `${h * 0.5}px` }}
        >
          <Image
            src="/logo/ksn-logo.png"
            alt=""
            fill
            sizes="300px"
            className="object-contain"
          />
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-5 sm:px-8 pt-4 sm:pt-5 flex items-center gap-3 sm:gap-4">
        <div className="relative w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0">
          <Image
            src="/logo/ksn-logo.png"
            alt="KSN"
            fill
            sizes="60px"
            className="object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-display font-bold text-[#0F5132] leading-tight"
            style={{ fontSize: size === "print" ? "22px" : "16px" }}
          >
            KIPPAANGOG SALAATU &apos;ALAA NABII{" "}
            <span className="font-arabic">ﷺ</span>
          </p>
          <p
            className="text-[#B8860B] font-semibold tracking-widest"
            style={{ fontSize: size === "print" ? "11px" : "9px" }}
          >
            CARTE DE MEMBRE
          </p>
        </div>
        <p
          className="text-[#0F5132] font-medium hidden sm:block"
          style={{ fontSize: size === "print" ? "12px" : "10px" }}
        >
          Siège Social : Touba
        </p>
      </div>

      <div
        className="relative z-10 mx-5 sm:mx-8 mt-2 h-px"
        style={{ background: "linear-gradient(to right, #D4AF37, transparent)" }}
      />

      {/* Body */}
      <div className="relative z-10 px-5 sm:px-8 pt-3 sm:pt-4 pb-4 sm:pb-6 grid grid-cols-[auto_1fr] gap-4 sm:gap-6 items-start">
        <div
          className="relative rounded-xl overflow-hidden bg-[#E8E6E1] flex-shrink-0"
          style={{
            width: size === "print" ? "180px" : "130px",
            height: size === "print" ? "200px" : "150px",
          }}
        >
          {member.photo ? (
            <Image
              src={member.photo}
              alt={`${member.prenom} ${member.nom}`}
              fill
              sizes="200px"
              className="object-cover"
              unoptimized={member.photo.startsWith("http")}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[#0F5132]/50 text-4xl font-display font-bold">
              {(member.prenom?.[0] ?? "?")}
              {(member.nom?.[0] ?? "")}
            </div>
          )}
        </div>

        <div className="text-[#0F5132] space-y-2 sm:space-y-3 min-w-0">
          <Field
            label="Prénom & Nom"
            value={`${member.prenom} ${member.nom}`.trim() || "—"}
            big={size === "print"}
          />
          <Field
            label="Téléphone"
            value={member.telephone || "—"}
            big={size === "print"}
          />
          <Field
            label="Domicile"
            value={domicile}
            big={size === "print"}
          />
          <div className="pt-1">
            <p
              className="text-[#0F5132]/70"
              style={{ fontSize: size === "print" ? "13px" : "11px" }}
            >
              Matricule
            </p>
            <p
              className="font-display font-bold tabular-nums text-[#0F5132]"
              style={{
                fontSize: size === "print" ? "38px" : "30px",
                lineHeight: 1,
              }}
            >
              {member.matricule}
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
  big,
}: {
  label: string;
  value: string;
  big: boolean;
}) {
  return (
    <div>
      <p
        className="text-[#0F5132]/70"
        style={{ fontSize: big ? "13px" : "11px" }}
      >
        {label}
      </p>
      <p
        className="font-bold text-[#0F5132] truncate"
        style={{ fontSize: big ? "20px" : "16px" }}
      >
        {value}
      </p>
    </div>
  );
}
