import type { Recipe } from "./types";

export const placeholderImages = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80", // Salad bowl
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80", // Pancakes
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80", // Pizza
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80", // Veggie bowl
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=80", // Pasta
  "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80", // French toast
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80", // Pasta dish
  "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&q=80", // Soup
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", // Steak plate
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80", // Healthy bowl
  "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=600&q=80", // BBQ
  "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80", // Ramen
];

export const aspectRatios = [
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[5/6]",
];

export const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Tarte aux pommes de Mamie",
    description: "La recette secrète de grand-mère",
    prepTime: 30,
    cookTime: 45,
    difficulty: "Facile",
    author: "Marie",
    likes: 12,
  },
  {
    id: "2",
    title: "Bœuf bourguignon",
    description: "Un classique qui réchauffe",
    prepTime: 45,
    cookTime: 180,
    difficulty: "Moyen",
    author: "Pierre",
    likes: 24,
  },
  {
    id: "3",
    title: "Mousse au chocolat",
    description: "Légère et aérienne",
    prepTime: 20,
    cookTime: 0,
    difficulty: "Facile",
    author: "Sophie",
    likes: 18,
  },
  {
    id: "4",
    title: "Ratatouille provençale",
    prepTime: 25,
    cookTime: 60,
    difficulty: "Facile",
    author: "Luc",
    likes: 15,
  },
  {
    id: "5",
    title: "Blanquette de veau",
    description: "Tendreté et sauce onctueuse",
    prepTime: 30,
    cookTime: 120,
    difficulty: "Moyen",
    author: "Marie",
    likes: 21,
  },
  {
    id: "6",
    title: "Crêpes bretonnes",
    prepTime: 15,
    cookTime: 30,
    difficulty: "Facile",
    author: "Jean",
    likes: 33,
  },
  {
    id: "7",
    title: "Gratin dauphinois",
    description: "Crémeux à souhait",
    prepTime: 20,
    cookTime: 75,
    difficulty: "Facile",
    author: "Claire",
    likes: 27,
  },
  {
    id: "8",
    title: "Coq au vin",
    prepTime: 40,
    cookTime: 150,
    difficulty: "Difficile",
    author: "Pierre",
    likes: 19,
  },
  {
    id: "9",
    title: "Tarte Tatin",
    description: "Caramélisée et fondante",
    prepTime: 25,
    cookTime: 40,
    difficulty: "Moyen",
    author: "Sophie",
    likes: 31,
  },
  {
    id: "10",
    title: "Soupe à l'oignon",
    prepTime: 15,
    cookTime: 45,
    difficulty: "Facile",
    author: "Luc",
    likes: 14,
  },
  {
    id: "11",
    title: "Quiche lorraine",
    description: "L'authentique",
    prepTime: 20,
    cookTime: 35,
    difficulty: "Facile",
    author: "Marie",
    likes: 22,
  },
  {
    id: "12",
    title: "Cassoulet toulousain",
    prepTime: 60,
    cookTime: 240,
    difficulty: "Difficile",
    author: "Jean",
    likes: 17,
  },
];
