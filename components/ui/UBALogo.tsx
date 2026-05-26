import Image from "next/image";

export default function UBALogo({ className }: { className?: string }) {
  return (
    <div
      className={`relative inline-flex overflow-hidden rounded-2xl bg-white ${
        className ?? "w-14 h-14"
      }`}
    >
      <Image
        src="/logo/uba.png"
        alt="UBA — United Bank for Africa"
        fill
        sizes="80px"
        className="object-contain p-1.5"
      />
    </div>
  );
}
