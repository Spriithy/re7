import { TextField, Label, Input } from "react-aria-components";
import { inputStyles } from "@/components/ui/styles";

interface SourceSectionProps {
  source: string;
  onSourceChange: (value: string) => void;
}

export function SourceSection({ source, onSourceChange }: SourceSectionProps) {
  return (
    <section className="space-y-4">
      <TextField
        value={source}
        onChange={onSourceChange}
        className="space-y-1.5"
      >
        <Label className="text-ink-700 text-sm font-medium">
          Source (optionnel)
        </Label>
        <Input
          placeholder="ex: Livre de Mamie, site web..."
          className={inputStyles}
        />
      </TextField>
    </section>
  );
}
