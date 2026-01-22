interface RecipeHeroProps {
  title: string;
  difficultyLabel: string;
  imageUrl: string | null;
}

export function RecipeHero({
  title,
  difficultyLabel,
  imageUrl,
}: RecipeHeroProps) {
  if (imageUrl) {
    return (
      <div className="relative aspect-[16/9] max-h-[400px] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="from-ink-950/60 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 p-4 sm:p-6">
          <div className="mx-auto max-w-3xl">
            <span className="bg-warm-500 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white sm:px-3 sm:py-1 sm:text-sm">
              {difficultyLabel}
            </span>
            <h1 className="font-heading mt-2 text-2xl font-bold text-white sm:mt-3 sm:text-3xl md:text-4xl">
              {title}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="from-warm-50 to-paper-50 bg-gradient-to-b px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <span className="bg-warm-500 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white sm:px-3 sm:py-1 sm:text-sm">
          {difficultyLabel}
        </span>
        <h1 className="font-heading text-ink-900 mt-2 text-2xl font-bold sm:mt-3 sm:text-3xl md:text-4xl">
          {title}
        </h1>
      </div>
    </div>
  );
}
