// Auth types matching backend schemas
export interface UserLogin {
  username: string;
  password: string;
}

export interface UserCreate {
  username: string;
  password: string;
  invite_token: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  expires_at: string;
}

export interface User {
  id: string;
  username: string;
  is_admin: boolean;
  created_at: string;
}

// Invite types
export interface InviteResponse {
  id: string;
  token: string;
  expires_at: string;
  created_at: string;
  is_used: boolean;
}

// Recipe types
export type Difficulty = "easy" | "medium" | "hard";

export interface Ingredient {
  id: string;
  quantity: number | null;
  unit: string | null;
  name: string;
  is_scalable: boolean;
  order: number;
}

export interface IngredientCreate {
  quantity?: number | null;
  unit?: string | null;
  name: string;
  is_scalable?: boolean;
}

export interface Step {
  id: string;
  instruction: string;
  timer_minutes: number | null;
  note: string | null;
  order: number;
}

export interface StepCreate {
  instruction: string;
  timer_minutes?: number | null;
  note?: string | null;
}

export interface Prerequisite {
  id: string;
  prerequisite_recipe_id: string;
  prerequisite_recipe_title: string | null;
  note: string | null;
  order: number;
}

export interface PrerequisiteCreate {
  prerequisite_recipe_id: string;
  note?: string | null;
}

export interface RecipeAuthor {
  id: string;
  username: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image_path: string | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  servings: number;
  serving_unit: string | null;
  difficulty: Difficulty;
  source: string | null;
  author: RecipeAuthor;
  ingredients: Ingredient[];
  steps: Step[];
  prerequisites: Prerequisite[];
  created_at: string;
  updated_at: string;
}

export interface RecipeListItem {
  id: string;
  title: string;
  description: string | null;
  image_path: string | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  servings: number;
  serving_unit: string | null;
  difficulty: Difficulty;
  author: RecipeAuthor;
  created_at: string;
}

export interface RecipeListResponse {
  items: RecipeListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface RecipeCreate {
  title: string;
  description?: string | null;
  prep_time_minutes?: number | null;
  cook_time_minutes?: number | null;
  servings?: number;
  serving_unit?: string | null;
  difficulty?: Difficulty;
  source?: string | null;
  ingredients?: IngredientCreate[];
  steps?: StepCreate[];
  prerequisites?: PrerequisiteCreate[];
}

export interface RecipeUpdate {
  title?: string;
  description?: string | null;
  prep_time_minutes?: number | null;
  cook_time_minutes?: number | null;
  servings?: number;
  serving_unit?: string | null;
  difficulty?: Difficulty;
  source?: string | null;
  ingredients?: IngredientCreate[];
  steps?: StepCreate[];
  prerequisites?: PrerequisiteCreate[];
}
