// src/pages/Search.jsx
import { useMemo, useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { searchMulti } from "../api/tmdb";
import SkeletonCard from "../components/SkeletonCard";
import ErrorState from "../components/ErrorState";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || "1");

  // Input is controlled, synced with URL
  const [input, setInput] = useState(q);

  useEffect(() => {
    setInput(q);
  }, [q]);

  const enabled = q.trim().length > 0;

  const queryKey = useMemo(() => ["search", q.trim(), page], [q, page]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: () => searchMulti(q.trim(), page),
    enabled,
    keepPreviousData: true,
  });

  function onSubmit(e) {
    e.preventDefault();
    const value = input.trim();
    if (!value) {
      setSearchParams({});
      return;
    }
    setSearchParams({ q: value, page: "1" });
  }

  function goToPage(nextPage) {
    setSearchParams({ q: q.trim(), page: String(nextPage) });
  }

  const results = data?.results || [];
  const totalPages = data?.total_pages || 1;

  return (
    <div style={{ padding: 16 }}>
      <h1>Search</h1>

      <form onSubmit={onSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search movies, TV, people..."
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.2)",
            width: 360,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.2)",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      <div style={{ marginTop: 10, opacity: 0.7 }}>
        {enabled ? (
          <span>
            Query: <b>{q}</b> {isFetching ? "(fetching...)" : ""}
          </span>
        ) : (
          <span>Type something and hit Search.</span>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        {!enabled ? null : isLoading ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Search failed"
            message={error?.message}
            onAction={refetch}
            actionLabel="Retry"
          />
        ) : results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {results.map((item) => {
                // item.media_type can be "movie" | "tv" | "person"
                const mediaType = item.media_type;
                const id = item.id;

                const title =
                  item.title || item.name || item.original_name || "Untitled";

                const href =
                  mediaType === "movie"
                    ? `/movie/${id}`
                    : mediaType === "tv"
                    ? `/tv/${id}`
                    : mediaType === "person"
                    ? `/person/${id}`
                    : null;

                return (
                  <div
                    key={`${mediaType}-${id}`}
                    style={{
                      width: 160,
                      border: "1px solid rgba(0,0,0,0.08)",
                      borderRadius: 12,
                      padding: 10,
                    }}
                  >
                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                      {mediaType?.toUpperCase()}
                    </div>
                    <div style={{ marginTop: 6, fontWeight: 600 }}>
                      {title}
                    </div>

                    {href ? (
                      <div style={{ marginTop: 10 }}>
                        <Link to={href}>Open</Link>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <button
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                style={{ padding: "8px 12px", borderRadius: 10 }}
              >
                Prev
              </button>
              <span>
                Page <b>{page}</b> / {Math.min(totalPages, 500)}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
                style={{ padding: "8px 12px", borderRadius: 10 }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
