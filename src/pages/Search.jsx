import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchMulti, searchMovie, searchTV, searchPerson } from "../api/tmdb";
import { getCookie, setCookie } from "../utils/cookieUtils";
import SkeletonCard from "../components/SkeletonCard";
import ErrorState from "../components/ErrorState";
import "../assets/media-card.css";
import "./Search.css";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all";
  const page = Number(searchParams.get("page") || "1");

  // Input is controlled, synced with URL
  const [input, setInput] = useState(q);

  useEffect(() => {
    setInput(q);
  }, [q]);

  const enabled = q.trim().length > 0;

  const queryKey = useMemo(() => ["search", q.trim(), type, page], [q, type, page]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: () => {
      const query = q.trim();
      if (type === "movie") return searchMovie(query, page);
      if (type === "tv") return searchTV(query, page);
      if (type === "person") return searchPerson(query, page);
      return searchMulti(query, page);
    },
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
    setSearchParams({ q: value, type, page: "1" });
  }

  function goToPage(nextPage) {
    setSearchParams({ q: q.trim(), type, page: String(nextPage) });
  }

  const results = data?.results || [];
  const totalPages = data?.total_pages || 1;

  const getMediaIcon = (mediaType) => {
    switch (mediaType) {
      case 'movie': return '🎬';
      case 'tv': return '📺';
      case 'person': return '👤';
      default: return '📽️';
    }
  };

  return (
    <div className="search-page">
      {/* Search Form */}
      {/* <form onSubmit={onSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search movies, TV shows, people..."
            className="search-input"
          />
          <button type="submit" className="search-submit-btn">
            Search
          </button>
        </div>
      </form> */}

      {/* Status Bar */}
      {/* <div className="search-status">
        {enabled ? (
          <span className="status-text">
            Query: <strong>"{q}"</strong> 
            {isFetching && <span className="fetching-indicator"> (fetching...)</span>}
          </span>
        ) : (
          <span className="status-text">Type something and hit Search to discover content.</span>
        )}
      </div> */}

      {/* Results Section */}
      <div className="search-results">
        {!enabled ? null : isLoading ? (
          <div className="skeleton-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Search failed"
            message={error?.message}
            onAction={refetch}
            actionLabel="Try Again"
          />
        ) : results.length === 0 ? (
          <div className="no-results">
            <p>No results found for "{q}"</p>
            <p className="no-results-sub">Try different keywords or check your spelling</p>
          </div>
        ) : (
          <>
            <div className="results-grid">
              {results.map((item) => {
                const mediaType = item.media_type || (type !== "all" ? type : null);
                const itemId = item.id;
                const title = item.title || item.name || item.original_name || "Untitled";
                const releaseDate = item.release_date || item.first_air_date;
                const year = releaseDate ? new Date(releaseDate).getFullYear() : "";
                const rawRating = item.vote_average;
                const rating = typeof rawRating === "number" && rawRating > 0
                  ? rawRating.toFixed(1)
                  : null;
                const lang = (item.original_language || "").toUpperCase();
                const imagePath = item.poster_path || item.profile_path;
                const imageUrl = imagePath
                  ? `https://image.tmdb.org/t/p/w342${imagePath}`
                  : null;
                const href = mediaType === "movie"
                  ? `/movie/${itemId}`
                  : mediaType === "tv"
                    ? `/tv/${itemId}`
                    : mediaType === "person"
                      ? `/person/${itemId}`
                      : null;

                const cookieName = mediaType === "tv" ? "watchlater_tv" : "watchlater_movies";
                const watchlater = JSON.parse(getCookie(cookieName) || "[]");
                const inWL = watchlater.some((m) => m.id === itemId);

                const toggleWL = (e) => {
                  e.stopPropagation();
                  const list = JSON.parse(getCookie(cookieName) || "[]");
                  const exists = list.find((m) => m.id === itemId);
                  const updated = exists
                    ? list.filter((m) => m.id !== itemId)
                    : [...list, { id: itemId, title, poster_path: item.poster_path, vote_average: item.vote_average }];
                  setCookie(cookieName, JSON.stringify(updated), 7);
                };

                return (
                  <article
                    key={`${mediaType}-${itemId}`}
                    className="media-card"
                    onClick={() => href && navigate(href)}
                    style={{ cursor: href ? "pointer" : "default" }}
                  >
                    <div className="media-posterWrap">
                      {imageUrl ? (
                        <img className="media-poster" src={imageUrl} alt={title} loading="lazy" />
                      ) : (
                        <div className="media-noPoster">
                          <span>{mediaType === "movie" ? "🎬" : mediaType === "tv" ? "📺" : "👤"}</span>
                        </div>
                      )}

                      {/* Badges */}
                      {lang && <span className="movie-lang">{lang}</span>}
                      {rating && <span className="movie-rating">⭐ {rating}</span>}

                      {/* Hover Overlay */}
                      <div className="media-overlay">
                        <p className="media-overview">
                          {item.overview || item.known_for_department || "No overview available."}
                        </p>
                        <div className="overlay-actions">
                          {href && (
                            <button
                              className="media-cta"
                              type="button"
                              onClick={(e) => { e.stopPropagation(); navigate(href); }}
                            >
                              View
                            </button>
                          )}
                          {(mediaType === "movie" || mediaType === "tv") && (
                            <button
                              className={`media-cta ${inWL ? "active" : ""}`}
                              type="button"
                              onClick={toggleWL}
                              title={inWL ? "Remove from Watch Later" : "Add to Watch Later"}
                            >
                              {inWL ? "✓" : "+"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="media-info">
                      <h3 className="media-title" title={title}>{title}</h3>
                      <p className="media-meta">
                        {year && <span>{year}</span>}
                        {year && rating && <span> · </span>}
                        {rating && <span>⭐ {rating}</span>}
                        {mediaType && (
                          <span className="search-type-badge">
                            {mediaType === "movie" ? "Movie" : mediaType === "tv" ? "TV" : "Person"}
                          </span>
                        )}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-wrapper">
                <div className="pagination">
                  <button
                    className="pagination-btn prev"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                    aria-label="Previous Page"
                  >
                    <span className="btn-icon">←</span>
                    <span className="btn-text">Previous</span>
                  </button>

                  <div className="pagination-info">
                    <span className="current-page">{page}</span>
                    <span className="page-separator">of</span>
                    <span className="total-pages">{Math.min(totalPages, 500)}</span>
                  </div>

                  <button
                    className="pagination-btn next"
                    disabled={page >= totalPages}
                    onClick={() => goToPage(page + 1)}
                    aria-label="Next Page"
                  >
                    <span className="btn-text">Next</span>
                    <span className="btn-icon">→</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}