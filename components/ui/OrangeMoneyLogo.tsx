import Image from "next/image";

export default function OrangeMoneyLogo({ className }: { className?: string }) {
  return (
    <div
      className={`relative inline-flex overflow-hidden rounded-2xl ${
        className ?? "w-14 h-14"
      }`}
    >
      <Image
        src="/logo/om.png"
        alt="Orange Money"
        fill
        sizes="80px"
        className="object-cover"
      />
    </div>
  );
}
