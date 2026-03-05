import { useMemo, useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchMulti, searchMovie, searchTV, searchPerson } from "../api/tmdb";
import SkeletonCard from "../components/SkeletonCard";
import ErrorState from "../components/ErrorState";
import "./Search.css";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

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
                const mediaType = item.media_type || (type !== 'all' ? type : null);
                const id = item.id;
                const title = item.title || item.name || item.original_name || "Untitled";
                const releaseDate = item.release_date || item.first_air_date;
                const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
                const rating = item.vote_average ? (item.vote_average * 10).toFixed(0) : null;

                // Image handling
                const imagePath = item.poster_path || item.profile_path;
                const imageUrl = imagePath
                  ? `https://image.tmdb.org/t/p/w500${imagePath}`
                  : null;

                const href = mediaType === "movie"
                  ? `/movie/${id}`
                  : mediaType === "tv"
                    ? `/tv/${id}`
                    : mediaType === "person"
                      ? `/person/${id}`
                      : null;

                return (
                  <div key={`${mediaType}-${id}`} className="result-card">
                    <div className="card-image-wrapper">
                      {imageUrl ? (
                        <img src={imageUrl} alt={title} className="card-image" loading="lazy" />
                      ) : (
                        <div className="no-image">
                          <span>{getMediaIcon(mediaType)}</span>
                        </div>
                      )}
                      <div className="card-badges">
                        <span className="media-type-badge">
                          {getMediaIcon(mediaType)} {mediaType?.toUpperCase()}
                        </span>
                        {rating && (
                          <span className="rating-badge" style={{
                            color: rating >= 70 ? '#4caf50' : rating >= 50 ? '#ffc107' : '#f44336'
                          }}>
                            ★ {rating}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="card-content">
                      <div className="card-main-info">
                        <h3 className="card-title">{title}</h3>
                        {year && <span className="card-year">{year}</span>}
                      </div>

                      {item.character && (
                        <p className="card-subtitle">as <strong>{item.character}</strong></p>
                      )}
                      {item.job && (
                        <p className="card-subtitle">{item.job}</p>
                      )}
                      {item.known_for_department && (
                        <p className="card-subtitle">{item.known_for_department}</p>
                      )}

                      {item.overview && (
                        <p className="card-overview">
                          {item.overview.length > 100
                            ? `${item.overview.substring(0, 100)}...`
                            : item.overview}
                        </p>
                      )}
                    </div>

                    {href && (
                      <div className="card-footer">
                        <Link to={href} className="view-details-btn">
                          View Details
                        </Link>
                      </div>
                    )}
                  </div>
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