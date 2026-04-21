// src/api/tmdb.js
// Dev uses direct TMDB fetching (relies on browser Secure DNS). 
// Prod (Netlify) uses the reverse proxy to completely bypass ISP network blocks.
const BASE_URL = import.meta.env.PROD ? "/tmdb-api" : import.meta.env.VITE_TMDB_BASE_URL;

function getBearerToken() {
  const token = import.meta.env.VITE_TMDB_TOKEN;
  if (!token) throw new Error("VITE_TMDB_TOKEN is not defined in .env");
  return token;
}

export async function tmdbRequest(path, params = {}, options = {}) {
  if (!BASE_URL) throw new Error("VITE_TMDB_BASE_URL is not defined in .env");

  const isRelative = BASE_URL.startsWith('/');
  const url = new URL(`${BASE_URL}${path}`, isRelative ? window.location.origin : undefined);

  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${getBearerToken()}`,
      "Content-Type": "application/json;charset=utf-8",
      ...(options.headers || {}),
    },
    body: options.body,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      data?.status_message ||
      data?.message ||
      `TMDB request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  return data;
}

// ===== Ready-to-use API functions =====
export const searchMulti = (query, page = 1) =>
  tmdbRequest("/search/multi", { query, page });

export const searchMovie = (query, page = 1) =>
  tmdbRequest("/search/movie", { query, page });

export const searchTV = (query, page = 1) =>
  tmdbRequest("/search/tv", { query, page });

export const searchPerson = (query, page = 1) =>
  tmdbRequest("/search/person", { query, page });

export const getMovieDetails = (id) => tmdbRequest(`/movie/${id}`);

export const getTVDetails = (id) => tmdbRequest(`/tv/${id}`);

export const getPersonDetails = (id) => tmdbRequest(`/person/${id}`);

export const getPersonImages = (id) => tmdbRequest(`/person/${id}/images`);

export const getPersonCombinedCredits = (id) => tmdbRequest(`/person/${id}/combined_credits`);

export const getTrendingMovies = (timeWindow = "week", page = 1) =>
  tmdbRequest(`/trending/movie/${timeWindow}`, { page });

export const getTrendingPeople = (timeWindow = "week", page = 1) =>
  tmdbRequest(`/trending/person/${timeWindow}`, { page });

export const getPopularMovies = (page = 1) =>
  tmdbRequest("/movie/popular", { page });

export const getTopRatedMovies = (page = 1) =>
  tmdbRequest("/movie/top_rated", { page });

export const getPopularTV = (page = 1) =>
  tmdbRequest("/tv/popular", { page });

export const getPopularPeople = (page = 1) =>
  tmdbRequest("/person/popular", { page });

export const getMovieVideos = (id) => tmdbRequest(`/movie/${id}/videos`);

export const getTVVideos = (id) => tmdbRequest(`/tv/${id}/videos`);

export const getMovieCredits = (id) => tmdbRequest(`/movie/${id}/credits`);

export const getTVCredits = (id) => tmdbRequest(`/tv/${id}/credits`);

export const getTVAggregateCredits = (id) => tmdbRequest(`/tv/${id}/aggregate_credits`);

export const getMovieWatchProviders = (id) => tmdbRequest(`/movie/${id}/watch/providers`);

export const getTVWatchProviders = (id) => tmdbRequest(`/tv/${id}/watch/providers`);

export const getMovieRecommendations = (id) => tmdbRequest(`/movie/${id}/recommendations`);

export const getTVRecommendations = (id) => tmdbRequest(`/tv/${id}/recommendations`);

export const getMovieReviews = (id) => tmdbRequest(`/movie/${id}/reviews`);

export const getTVReviews = (id) => tmdbRequest(`/tv/${id}/reviews`);
