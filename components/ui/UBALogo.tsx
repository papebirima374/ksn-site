export default function UBALogo({ className }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl bg-[#E60000] text-white font-black tracking-tighter ${
        className ?? "w-14 h-14 text-lg"
      }`}
    >
      UBA
    </div>
  );
}
