import { TextField, Label, Input, TextArea } from "react-aria-components";
import { inputStyles, textAreaStyles } from "@/components/ui/styles";

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
      <TextField
        value={title}
        onChange={onTitleChange}
        isRequired
        className="space-y-1.5"
      >
        <Label className="text-ink-700 text-sm font-medium">
          Titre de la recette
        </Label>
        <Input
          placeholder="ex: Tarte aux pommes de Mamie"
          className={inputStyles}
        />
      </TextField>

      <TextField
        value={description}
        onChange={onDescriptionChange}
        className="space-y-1.5"
      >
        <Label className="text-ink-700 text-sm font-medium">Description</Label>
        <TextArea
          placeholder="L'histoire derrière cette recette..."
          rows={3}
          className={textAreaStyles}
        />
      </TextField>
    </section>
  );
}
