export interface Recipe {
  id: string;
  title: string;
  description?: string;
  prepTime?: number;
  cookTime?: number;
  difficulty: "Facile" | "Moyen" | "Difficile";
  author: string;
  likes: number;
}
