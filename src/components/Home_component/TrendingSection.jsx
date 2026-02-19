import { useEffect, useState } from "react";
import { tmdbRequest } from "../../api/tmdb";
import "./TrendingSection.css";

export default function TrendingSection() {
  const [trending, setTrending] = useState([]);
  const [timeWindow, setTimeWindow] = useState("week");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const toggleTimeWindow = () => {
    setTimeWindow((prev) => (prev === "week" ? "day" : "week"));
  };

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const data = await tmdbRequest(`/trending/movie/${timeWindow}`);
        setTrending(data.results || []);
      } catch (err) {
        setIsError(true);
        console.error("Error fetching trending movies:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrending();
  }, [timeWindow]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatVoteAverage = (vote) => {
    return vote ? vote.toFixed(1) : "N/A";
  };

  return (
    <section className="trending-section">
      <div className="trending-header">
        <div className="header-left">
          <h1 className="trending-title">Trending Movies</h1>
          <span className="trending-badge">{timeWindow === "week" ? "This Week" : "Today"}</span>
        </div>
        <button 
          onClick={toggleTimeWindow} 
          className={`toggle-button ${timeWindow}`}
          aria-label={`Switch to ${timeWindow === "week" ? "daily" : "weekly"} trending`}
        >
          <span className="toggle-text">{timeWindow === "week" ? "Weekly" : "Daily"}</span>
          <span className="toggle-icon">↻</span>
        </button>
      </div>

      <div className="trending-content">
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading trending movies...</p>
          </div>
        )}

        {isError && (
          <div className="error-container">
            <p className="error-message">⚠️ Something went wrong. Please try again later.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="movies-grid">
            {trending.slice(0, 8).map((movie, index) => (
              <div className="movie-card" key={movie.id}>
                <div className="movie-poster">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="poster-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="no-poster">
                      <span>No Poster Available</span>
                    </div>
                  )}
                  <div className="movie-rating">
                    ⭐ {formatVoteAverage(movie.vote_average)}
                  </div>
                  {index < 3 && <div className="top-ranked">#{index + 1}</div>}
                </div>

                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-meta">
                    <span className="release-date">{formatDate(movie.release_date)}</span>
                    <span className={`adult-badge ${movie.adult ? "adult" : "everyone"}`}>
                      {movie.adult ? "18+" : "ALL"}
                    </span>
                  </div>
                  <p className="movie-overview">
                    {movie.overview 
                      ? (movie.overview.length > 120 
                        ? `${movie.overview.substring(0, 120)}...` 
                        : movie.overview)
                      : "No description available."}
                  </p>
                  <button className="details-button">View Details →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}