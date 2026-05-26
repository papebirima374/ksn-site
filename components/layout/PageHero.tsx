type PageHeroProps = {
  overline?: string;
  title: string;
  arabic?: string;
  description?: string;
};

export default function PageHero({
  overline,
  title,
  arabic,
  description,
}: PageHeroProps) {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 lg:pt-48 pb-12 sm:pb-16">
      <div className="text-center max-w-4xl mx-auto">
        {arabic && (
          <p className="font-arabic text-2xl sm:text-3xl md:text-4xl text-[#D4AF37] mb-4">
            {arabic}
          </p>
        )}

        {overline && (
          <p className="uppercase tracking-[0.25em] text-[#D4AF37] text-xs sm:text-sm font-semibold">
            {overline}
          </p>
        )}

        <h1 className="font-display mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-white/75 leading-7 sm:leading-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}

        <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-6 sm:mt-8" />
      </div>
    </section>
  );
}
