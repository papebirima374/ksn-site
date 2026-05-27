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
        boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
      }}
    >
      {/* Decorative top-left wave (green + gold) */}
      <svg
        className="absolute top-0 left-0"
        width="62%"
        height="35%"
        viewBox="0 0 400 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,0 L0,120 Q140,30 400,70 L400,0 Z" fill="#0F5132" />
        <path d="M0,0 L0,72 Q100,18 320,40 L320,0 Z" fill="#D4AF37" />
      </svg>
      {/* Decorative bottom-right wave (green + gold) */}
      <svg
        className="absolute bottom-0 right-0"
        width="62%"
        height="35%"
        viewBox="0 0 400 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M400,160 L400,40 Q260,130 0,90 L0,160 Z" fill="#0F5132" />
        <path d="M400,160 L400,88 Q300,140 80,118 L80,160 Z" fill="#D4AF37" />
      </svg>

      {/* Watermark logo (right side, behind text) */}
      <div className="absolute inset-y-0 right-[6%] flex items-center pointer-events-none opacity-12">
        <div className="relative w-[28%] aspect-square">
          <Image
            src="/logo/ksn-logo.png"
            alt=""
            fill
            sizes="180px"
            className="object-contain"
            style={{ opacity: 0.12 }}
          />
        </div>
      </div>

      {/* Top header (over the green wave) */}
      <div className="relative z-10 pt-[3.5%] px-[4%] flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="relative rounded-full overflow-hidden bg-white border-2 border-white shadow"
            style={{ width: "14%", aspectRatio: "1 / 1", minWidth: 32 }}
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
              className="font-display font-bold text-white tracking-wide"
              style={{ fontSize: size === "print" ? "13px" : "12px" }}
            >
              KIPPAANGOG SALAATU &apos;ALAA NABII{" "}
              <span className="font-arabic">ﷺ</span>
            </p>
            <p
              className="text-[#D4AF37] font-semibold tracking-[0.25em]"
              style={{ fontSize: size === "print" ? "8px" : "8px" }}
            >
              CARTE DE MEMBRE
            </p>
          </div>
        </div>
        <p
          className="text-[#0F5132] font-semibold text-right"
          style={{ fontSize: size === "print" ? "9px" : "9px" }}
        >
          Siège : Touba
        </p>
      </div>

      {/* Main body */}
      <div className="relative z-10 px-[4%] pt-[3%] grid grid-cols-[34%_1fr] gap-[3%] items-center">
        {/* Photo */}
        <div
          className="relative rounded-lg overflow-hidden bg-[#E8E6E1] shadow-md"
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
            <div className="absolute inset-0 flex items-center justify-center text-[#0F5132]/50 font-display font-bold text-3xl">
              {(member.prenom?.[0] ?? "?")}
              {(member.nom?.[0] ?? "")}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-[3.5%] text-[#0F5132]">
          <Field
            label="Prénom & Nom"
            value={fullName}
            big={size === "print"}
            primary
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
          <div>
            <p
              className="text-[#0F5132]/70 leading-none"
              style={{ fontSize: size === "print" ? "8px" : "8.5px" }}
            >
              Matricule
            </p>
            <p
              className="font-display font-black tabular-nums leading-none mt-0.5 text-[#0F5132]"
              style={{
                fontSize: size === "print" ? "28px" : "30px",
                letterSpacing: "0.5px",
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
  primary,
}: {
  label: string;
  value: string;
  big: boolean;
  primary?: boolean;
}) {
  return (
    <div>
      <p
        className="text-[#0F5132]/70 leading-none"
        style={{ fontSize: big ? "8px" : "8.5px" }}
      >
        {label}
      </p>
      <p
        className="font-bold text-[#0F5132] truncate leading-tight mt-0.5"
        style={{ fontSize: big ? (primary ? "15px" : "12px") : primary ? "16px" : "13px" }}
      >
        {value}
      </p>
    </div>
  );
}
