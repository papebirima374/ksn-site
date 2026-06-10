// Calligraphie "صلى الله على محمد" rendue depuis l'image public/logo/salaatu-trim.png
// utilisée en masque CSS — la couleur vient de `fill` (par défaut l'or du logo).
type SalaatuCalligraphyProps = {
  /** Hauteur, marges, centrage… ex: "h-12 sm:h-16 mx-auto mb-6" */
  className?: string;
  /** Classes Tailwind de remplissage (couleur ou dégradé) */
  fill?: string;
};

export default function SalaatuCalligraphy({
  className = "",
  fill = "bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B]",
}: SalaatuCalligraphyProps) {
  return (
    <div
      role="img"
      aria-label="صلى الله على محمد"
      className={`max-w-full ${fill} ${className}`}
      style={{
        aspectRatio: "819 / 199",
        WebkitMaskImage: "url(/logo/salaatu-trim.png)",
        maskImage: "url(/logo/salaatu-trim.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
