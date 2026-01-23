import { Clock, Flame, Users } from "lucide-react";

interface RecipeMetaProps {
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  servings: number;
  servingUnit: string | null;
}

export function RecipeMeta({
  prepTimeMinutes,
  cookTimeMinutes,
  servings,
  servingUnit,
}: RecipeMetaProps) {
  return (
    <div className="border-paper-300 text-ink-600 flex flex-wrap items-center gap-3 border-b pb-5 text-xs sm:gap-4 sm:pb-6 sm:text-sm">
      {prepTimeMinutes != null && prepTimeMinutes > 0 ? (
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          Préparation : {prepTimeMinutes} min
        </span>
      ) : null}
      {cookTimeMinutes != null && cookTimeMinutes > 0 ? (
        <span className="flex items-center gap-1.5">
          <Flame className="h-4 w-4" />
          Cuisson : {cookTimeMinutes} min
        </span>
      ) : null}
      <span className="flex items-center gap-1.5">
        <Users className="h-4 w-4" />
        {servings} {servingUnit ?? "personnes"}
      </span>
    </div>
  );
}
