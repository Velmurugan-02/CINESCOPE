// src/utils/image.js
const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;

export function tmdbImage(path, size = "w342") {
  if (!path) return null;
  if (!IMAGE_BASE) return null;
  // IMAGE_BASE like: https://image.tmdb.org/t/p
  return `${IMAGE_BASE}/${size}${path}`;
}
