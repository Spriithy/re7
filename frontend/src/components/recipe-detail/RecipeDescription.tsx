interface RecipeDescriptionProps {
  description: string | null;
  authorUsername: string;
  source: string | null;
}

export function RecipeDescription({
  description,
  authorUsername,
  source,
}: RecipeDescriptionProps) {
  if (!description && !source) {
    return (
      <div className="border-paper-300 print:border-ink-300 border-b py-6">
        <p className="text-ink-500 print:text-ink-700 text-sm">
          Partagée par{" "}
          <span className="text-warm-700 print:text-ink-900 font-medium">
            {authorUsername}
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="border-paper-300 print:border-ink-300 border-b py-6">
      {description && (
        <p className="text-ink-700 text-lg leading-relaxed italic">
          {description}
        </p>
      )}
      <p className="text-ink-500 print:text-ink-700 mt-4 text-sm">
        Partagée par{" "}
        <span className="text-warm-700 print:text-ink-900 font-medium">
          {authorUsername}
        </span>
        {source && (
          <span className="text-ink-400 print:text-ink-600"> • {source}</span>
        )}
      </p>
    </div>
  );
}
