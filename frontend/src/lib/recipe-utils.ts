import type { Difficulty } from "./api";

/**
 * Get the French label for a recipe difficulty level
 */
export function getDifficultyLabel(difficulty: Difficulty): string {
  switch (difficulty) {
    case "easy":
      return "Facile";
    case "medium":
      return "Moyen";
    case "hard":
      return "Difficile";
  }
}
