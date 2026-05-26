export default function OrangeMoneyLogo({ className }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl bg-[#FF7900] text-white font-bold leading-tight text-center ${
        className ?? "w-14 h-14 text-[10px] px-1"
      }`}
    >
      Orange<br />Money
    </div>
  );
}
