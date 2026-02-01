import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/recipes/$recipeId")({
  component: RecipeLayout,
});

function RecipeLayout() {
  return (
    <main className="bg-paper-50 min-h-screen print:bg-white">
      <Outlet />
    </main>
  );
}
