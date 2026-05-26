export default function WaveLogo({ className }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl bg-[#1DCEDB] text-white font-black tracking-tight ${
        className ?? "w-14 h-14 text-base"
      }`}
    >
      WAVE
    </div>
  );
}
