export default function Background() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A3A27] via-[#0E4730] to-[#F8F5EF]" />

      <div className="absolute top-[-150px] right-[-150px] w-[600px] h-[600px] bg-[#B8860B]/10 blur-[150px] rounded-full" />

      <div className="absolute left-[-200px] top-[300px] w-[500px] h-[500px] bg-emerald-400/10 blur-[140px] rounded-full" />

      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:30px_30px]" />
    </>
  );
}
