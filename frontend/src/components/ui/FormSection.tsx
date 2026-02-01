import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <h3 className="font-heading text-ink-900 text-lg font-semibold">
          {title}
        </h3>
        {description && <p className="text-ink-600 text-sm">{description}</p>}
      </div>
      <div className="space-y-1 sm:space-y-2">{children}</div>
    </section>
  );
}
