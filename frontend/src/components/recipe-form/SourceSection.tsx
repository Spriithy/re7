import { TextField, Label, Input } from "react-aria-components";

interface SourceSectionProps {
  source: string;
  onSourceChange: (value: string) => void;
}

export function SourceSection({ source, onSourceChange }: SourceSectionProps) {
  return (
    <section className="space-y-4">
      <TextField className="space-y-1.5">
        <Label className="text-ink-700 text-sm font-medium">
          Source (optionnel)
        </Label>
        <Input
          value={source}
          onChange={(e) => onSourceChange(e.target.value)}
          placeholder="ex: Livre de Mamie, site web..."
          className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:outline-none"
        />
      </TextField>
    </section>
  );
}
