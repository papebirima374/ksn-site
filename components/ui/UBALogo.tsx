import Image from "next/image";

export default function UBALogo({ className }: { className?: string }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white ${
        className ?? "w-14 h-14"
      }`}
    >
      <Image
        src="/images/payment/uba.svg"
        alt="UBA — United Bank for Africa"
        fill
        sizes="80px"
        className="object-contain p-1"
      />
    </div>
  );
}
