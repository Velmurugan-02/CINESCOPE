import { useMemo, useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { searchMulti } from "../api/tmdb";
import SkeletonCard from "../components/SkeletonCard";
import ErrorState from "../components/ErrorState";
import "./Search.css"; // Import the CSS file

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

  const getMediaIcon = (mediaType) => {
    switch(mediaType) {
      case 'movie': return '🎬';
      case 'tv': return '📺';
      case 'person': return '👤';
      default: return '📽️';
    }
  };

  return (
    <div className="search-page">
      {/* Search Form */}
      <form onSubmit={onSubmit} className="search-form">
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
      </form>

      {/* Status Bar */}
      <div className="search-status">
        {enabled ? (
          <span className="status-text">
            Query: <strong>"{q}"</strong> 
            {isFetching && <span className="fetching-indicator"> (fetching...)</span>}
          </span>
        ) : (
          <span className="status-text">Type something and hit Search to discover content.</span>
        )}
      </div>

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
                const mediaType = item.media_type;
                const id = item.id;
                const title = item.title || item.name || item.original_name || "Untitled";
                const releaseDate = item.release_date || item.first_air_date;
                const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
                const rating = item.vote_average ? (item.vote_average * 10).toFixed(0) : null;
                
                const href = mediaType === "movie"
                  ? `/movie/${id}`
                  : mediaType === "tv"
                  ? `/tv/${id}`
                  : mediaType === "person"
                  ? `/person/${id}`
                  : null;

                return (
                  <div key={`${mediaType}-${id}`} className="result-card">
                    <div className="card-header">
                      <span className="media-type-badge">
                        {getMediaIcon(mediaType)} {mediaType?.toUpperCase()}
                      </span>
                      {rating && (
                        <span className="rating-badge" style={{ 
                          color: rating >= 70 ? 'var(--success)' : rating >= 50 ? 'var(--gold)' : 'inherit'
                        }}>
                          ★ {rating}%
                        </span>
                      )}
                    </div>
                    
                    <div className="card-content">
                      <h3 className="card-title">{title}</h3>
                      {year && <span className="card-year">{year}</span>}
                      
                      {item.character && (
                        <p className="card-subtitle">as {item.character}</p>
                      )}
                      {item.job && (
                        <p className="card-subtitle">{item.job}</p>
                      )}
                      {item.known_for_department && (
                        <p className="card-subtitle">{item.known_for_department}</p>
                      )}
                    </div>

                    {href && (
                      <div className="card-footer">
                        <Link to={href} className="view-details-link">
                          View Details →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                >
                  ← Previous
                </button>
                
                <div className="pagination-info">
                  <span>Page </span>
                  <strong>{page}</strong>
                  <span> of </span>
                  <strong>{Math.min(totalPages, 500)}</strong>
                </div>
                
                <button
                  className="pagination-btn"
                  disabled={page >= totalPages}
                  onClick={() => goToPage(page + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}