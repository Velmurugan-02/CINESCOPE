// src/api/tmdbTest.js
import { tmdbFetch } from "./tmdb";

export async function testTmdbConnection() {
  // Try a simple endpoint (popular movies)
  const data = await tmdbFetch("/movie/550");

  console.log("✅ TMDB Connected!");
  console.log("Title:", data.title);
  return data;
}
