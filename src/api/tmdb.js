// src/api/tmdb.js
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

function getBearerToken() {
  const token = import.meta.env.VITE_TMDB_TOKEN;
  if (!token) throw new Error("VITE_TMDB_TOKEN is not defined in .env");
  return token;
}

export async function tmdbRequest(path, params = {}, options = {}) {
  if (!BASE_URL) throw new Error("VITE_TMDB_BASE_URL is not defined in .env");

  const url = new URL(`${BASE_URL}${path}`);

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
  tmdbRequest("/search/multi", { query, page, include_adult: false });

export const getMovieDetails = (id) => tmdbRequest(`/movie/${id}`);

export const getTVDetails = (id) => tmdbRequest(`/tv/${id}`);

export const getPersonDetails = (id) => tmdbRequest(`/person/${id}`);
