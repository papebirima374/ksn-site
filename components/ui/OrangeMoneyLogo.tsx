import Image from "next/image";

export default function OrangeMoneyLogo({ className }: { className?: string }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-black ${
        className ?? "w-14 h-14"
      }`}
    >
      <Image
        src="/images/payment/orange-money.svg"
        alt="Orange Money"
        fill
        sizes="80px"
        className="object-contain"
      />
    </div>
  );
}
