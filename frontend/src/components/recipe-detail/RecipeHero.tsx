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
        <div className="absolute right-0 bottom-0 left-0 p-6">
          <div className="mx-auto max-w-3xl">
            <span className="bg-warm-500 inline-block rounded-full px-3 py-1 text-sm font-medium text-white">
              {difficultyLabel}
            </span>
            <h1 className="font-heading mt-3 text-3xl font-bold text-white md:text-4xl">
              {title}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="from-warm-50 to-paper-50 bg-gradient-to-b px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <span className="bg-warm-500 inline-block rounded-full px-3 py-1 text-sm font-medium text-white">
          {difficultyLabel}
        </span>
        <h1 className="font-heading text-ink-900 mt-3 text-3xl font-bold md:text-4xl">
          {title}
        </h1>
      </div>
    </div>
  );
}
