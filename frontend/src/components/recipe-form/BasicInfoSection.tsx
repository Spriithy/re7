import { TextField, Label, Input, TextArea } from "react-aria-components";

interface BasicInfoSectionProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function BasicInfoSection({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: BasicInfoSectionProps) {
  return (
    <section className="space-y-4">
      <TextField isRequired className="space-y-1.5">
        <Label className="text-ink-700 text-sm font-medium">
          Titre de la recette
        </Label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="ex: Tarte aux pommes de Mamie"
          className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:outline-none"
        />
      </TextField>

      <TextField className="space-y-1.5">
        <Label className="text-ink-700 text-sm font-medium">Description</Label>
        <TextArea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="L'histoire derrière cette recette..."
          rows={3}
          className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full resize-none rounded-lg border px-4 py-2.5 focus:ring-2 focus:outline-none"
        />
      </TextField>
    </section>
  );
}
