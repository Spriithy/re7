import { placeholderImages, aspectRatios } from "./constants";

export function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getRandomImage(id: string): string {
  const index = seededRandom(id) % placeholderImages.length;
  return placeholderImages[index];
}

export function getAspectRatio(id: string): string {
  const index = seededRandom(id + "aspect") % aspectRatios.length;
  return aspectRatios[index];
}
