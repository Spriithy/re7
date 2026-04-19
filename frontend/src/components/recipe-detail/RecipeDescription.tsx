interface RecipeDescriptionProps {
  description: string | null;
  authorUsername: string;
  source: string | null;
}

function parseSourceLink(source: string) {
  try {
    const url = new URL(source);
    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    return {
      href: url.toString(),
      label: url.hostname.replace(/^www\./, ""),
    };
  } catch {
    return null;
  }
}

export function RecipeDescription({
  description,
  authorUsername,
  source,
}: RecipeDescriptionProps) {
  const sourceLink = source ? parseSourceLink(source) : null;

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
        {sourceLink && (
          <>
            {" "}
            •{" "}
            <a
              className="text-warm-700 print:text-ink-900 font-medium underline underline-offset-2"
              href={sourceLink.href}
              target="_blank"
              rel="noreferrer"
            >
              Source: {sourceLink.label}
            </a>
          </>
        )}
        {source && !sourceLink && (
          <span className="text-ink-400 print:text-ink-600"> • {source}</span>
        )}
      </p>
    </div>
  );
}
