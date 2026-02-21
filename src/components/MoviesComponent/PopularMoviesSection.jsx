import { useEffect, useState } from "react";
import { tmdbRequest } from "../../api/tmdb";
import "./PopularMoviesSection.css";

export default function PopularMoviesSection() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const formatVoteAverage = (v) => (typeof v === "number" ? v.toFixed(1) : "NA");
  const getYear = (dateStr) => (dateStr ? dateStr.slice(0, 4) : "----");

  useEffect(() => {
    const fetchMixedTamilAndEnglish = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const [ta, en] = await Promise.all([
          tmdbRequest("/discover/movie", {
            with_original_language: "ta",
            sort_by: "popularity.desc",
            include_adult: false,
            page: 1,
            region: "IN",
          }),
          tmdbRequest("/discover/movie", {
            with_original_language: "en",
            sort_by: "popularity.desc",
            include_adult: false,
            page: 1,
            region: "IN",
          }),
        ]);

        const combined = [...(ta.results || []), ...(en.results || [])];
        // dedupe by movie.id
        const unique = Array.from(new Map(combined.map((m) => [m.id, m])).values());

        // sort by popularity
        unique.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));

        setMovies(unique);
      } catch (err) {
        setIsError(true);
        console.error("Error fetching mixed movies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMixedTamilAndEnglish();
  }, []);

  const visible = movies.slice(0, 10);

  return (
    <section className="home-section">
      <div className="section-header">
        <h2 className="section-title">Popular Movies</h2>
        <p className="section-subtitle">Top picks based on popularity</p>
      </div>

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading movies...</p>
        </div>
      )}

      {isError && (
        <div className="error-container">
          <p className="error-message">⚠️ Something went wrong. Please try again later.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="card-grid">
          {visible.map((movie, index) => {
            const title = movie.title || movie.original_title || "Untitled";
            const year = getYear(movie.release_date);
            const lang = (movie.original_language || "").toUpperCase();
            const rating = formatVoteAverage(movie.vote_average);
            const votes = movie.vote_count ?? 0;
            const popularity = movie.popularity ?? 0;
            const overview = movie.overview || "No overview available.";
            const poster = movie.poster_path
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
              : null;

            return (
              <article className="media-card" key={movie.id}>
                <div className="media-posterWrap">
                  {poster ? (
                    <img className="media-poster" src={poster} alt={title} loading="lazy" />
                  ) : (
                    <div className="media-noPoster">No Poster</div>
                  )}

                  {/* badges */}
                  <div className="media-badges">
                    <span className="badge">{lang || "NA"}</span>
                    <span className="badge">⭐ {rating}</span>
                  </div>

                  {/* top rank for first 3 */}
                  {index < 3 && <div className="rank-badge">#{index + 1}</div>}

                  {/* hover overlay (uses overview + backdrop_path idea) */}
                  <div className="media-overlay">
                    <p className="media-overview">{overview}</p>
                    <div className="media-stats">
                      <span>Votes: {votes}</span>
                      <span>Pop: {Math.round(popularity)}</span>
                    </div>
                    <button className="media-cta" type="button">
                      View details
                    </button>
                  </div>
                </div>

                <div className="media-info">
                  <h3 className="media-title" title={title}>
                    {title}
                  </h3>
                  <p className="media-meta">
                    {year} • {votes.toLocaleString()} votes
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
