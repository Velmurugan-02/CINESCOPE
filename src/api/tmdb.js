// src/api/tmdb.js

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

// Small safety check (helps you debug fast)
if (!BASE_URL) console.warn("Missing VITE_TMDB_BASE_URL in .env");
if (!TOKEN) console.warn("Missing VITE_TMDB_TOKEN in .env");

export function tmdbUrl(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });
  return url.toString();
}

export async function tmdbFetch(path, params = {}) {
  const url = tmdbUrl(path, params);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  // Helpful error details
  if (!res.ok) {
    let errText = "";
    try {
      errText = await res.text();
    } catch {}
    throw new Error(`TMDB request failed: ${res.status} ${res.statusText}\n${errText}`);
  }

  return res.json();
}

// Image helper (used later by UI)
export function tmdbImage(path, size = "w500") {
  if (!path) return null;
  return `${import.meta.env.VITE_TMDB_IMAGE_BASE}/${size}${path}`;
}
