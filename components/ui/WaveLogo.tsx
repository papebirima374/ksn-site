import Image from "next/image";

export default function WaveLogo({ className }: { className?: string }) {
  return (
    <div
      className={`relative inline-flex overflow-hidden rounded-2xl ${
        className ?? "w-14 h-14"
      }`}
    >
      <Image
        src="/logo/wave.png"
        alt="Wave"
        fill
        sizes="80px"
        className="object-cover"
      />
    </div>
  );
}
