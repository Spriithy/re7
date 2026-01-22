// French cooking units for the ingredient ComboBox
export const FRENCH_COOKING_UNITS = [
  // Volume
  { value: "ml", label: "ml" },
  { value: "cl", label: "cl" },
  { value: "L", label: "L" },
  { value: "c. à café", label: "c. à café" },
  { value: "c. à soupe", label: "c. à soupe" },
  { value: "tasse", label: "tasse" },
  { value: "verre", label: "verre" },
  // Weight
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
  // Approximate
  { value: "pincée", label: "pincée" },
  { value: "poignée", label: "poignée" },
  { value: "goutte", label: "goutte" },
  { value: "trait", label: "trait" },
  { value: "filet", label: "filet" },
  { value: "noix", label: "noix" },
  { value: "noisette", label: "noisette" },
  // Count
  { value: "pièce", label: "pièce" },
  { value: "tranche", label: "tranche" },
  { value: "feuille", label: "feuille" },
  { value: "gousse", label: "gousse" },
  { value: "brin", label: "brin" },
  { value: "branche", label: "branche" },
  { value: "bouquet", label: "bouquet" },
  { value: "boîte", label: "boîte" },
  { value: "sachet", label: "sachet" },
  { value: "paquet", label: "paquet" },
] as const;

export type FrenchCookingUnit = (typeof FRENCH_COOKING_UNITS)[number]["value"];
