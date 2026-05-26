import Image from "next/image";

export default function WaveLogo({ className }: { className?: string }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-[#1DCEDB] ${
        className ?? "w-14 h-14"
      }`}
    >
      <Image
        src="/images/payment/wave.svg"
        alt="Wave"
        fill
        sizes="80px"
        className="object-contain"
      />
    </div>
  );
}
