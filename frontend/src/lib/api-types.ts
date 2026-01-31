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
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface UserUpdateProfile {
  full_name?: string | null;
}

export interface UserChangePassword {
  current_password: string;
  new_password: string;
}

export interface InvitedUser {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
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

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
  image_path: string | null;
  created_at: string;
}

export interface CategoryCreate {
  name: string;
  icon_name: string;
}

export interface CategoryUpdate {
  name?: string;
  icon_name?: string;
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
  full_name: string | null;
  avatar_url: string | null;
}

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image_path: string | null;
  category: Category | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  servings: number;
  serving_unit: string | null;
  difficulty: Difficulty;
  source: string | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
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
  category: Category | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  servings: number;
  serving_unit: string | null;
  difficulty: Difficulty;
  is_vegetarian: boolean;
  is_vegan: boolean;
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
  category_id?: string | null;
  prep_time_minutes?: number | null;
  cook_time_minutes?: number | null;
  servings?: number;
  serving_unit?: string | null;
  difficulty?: Difficulty;
  source?: string | null;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  ingredients?: IngredientCreate[];
  steps?: StepCreate[];
  prerequisites?: PrerequisiteCreate[];
}

export interface RecipeUpdate {
  title?: string;
  description?: string | null;
  category_id?: string | null;
  prep_time_minutes?: number | null;
  cook_time_minutes?: number | null;
  servings?: number;
  serving_unit?: string | null;
  difficulty?: Difficulty;
  source?: string | null;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  ingredients?: IngredientCreate[];
  steps?: StepCreate[];
  prerequisites?: PrerequisiteCreate[];
}
