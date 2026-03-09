import { useEffect, useState } from "react";
import { tmdbRequest } from "../../api/tmdb";
import { useNavigate } from "react-router-dom";
import "./TrendingMovieSection.css";
import { setCookie, getCookie } from "../../utils/cookieUtils";

export default function TrendingMovieSection() {
  const [trending, setTrending] = useState([]);
  const [watchlater, setWatchlater] = useState([]);
  const [timeWindow, setTimeWindow] = useState("week");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

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

        // Load watchlater from cookies
        const saved = JSON.parse(getCookie("watchlater_movies") || "[]");
        setWatchlater(saved);
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

  const toggleWatchLater = (e, movie) => {
    e.stopPropagation();
    let updatedList;
    const exists = watchlater.find((m) => m.id === movie.id);

    if (exists) {
      updatedList = watchlater.filter((m) => m.id !== movie.id);
    } else {
      updatedList = [...watchlater, movie];
    }

    setWatchlater(updatedList);
    setCookie("watchlater_movies", JSON.stringify(updatedList), 7);
  };

  const isInWatchLater = (movieId) => watchlater.some((m) => m.id === movieId);

  return (
    <section className="movies-trending-section">
      <div className="movies-trending-header">
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
            {trending.slice(0, 10).map((movie, index) => (
              <div
                className="movie-card"
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                style={{ cursor: "pointer" }}
              >
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

                  {/* Top-Right Rating */}
                  <div className="movie-rating">
                    ⭐ {formatVoteAverage(movie.vote_average)}
                  </div>

                  {/* Top-Left Rank or Language */}
                  {index < 3 ? (
                    <div className="top-ranked">#{index + 1}</div>
                  ) : (
                    <div className="movie-lang">{(movie.original_language || "EN").toUpperCase()}</div>
                  )}
                </div>

                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-meta">
                    <span className="release-date">{formatDate(movie.release_date)}</span>
                    <span className={`adult-badge ${movie.adult ? "adult" : "everyone"}`}>
                      {movie.adult ? "18+" : "ALL"}
                    </span>
                  </div>
                  <p className="media-overview">
                    {movie.overview
                      ? (movie.overview.length > 120
                        ? `${movie.overview.substring(0, 120)}...`
                        : movie.overview)
                      : "No description available."}
                  </p>
                  <button className="details-button" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/movie/${movie.id}`);
                  }}>
                    View Details →
                  </button>
                  <button
                    className={`media-cta ${isInWatchLater(movie.id) ? "active" : ""}`}
                    type="button"
                    onClick={(e) => toggleWatchLater(e, movie)}
                    style={{
                      background: isInWatchLater(movie.id) ? "var(--primary)" : "rgba(255,255,255,0.1)",
                      color: "white"
                    }}
                  >
                    {isInWatchLater(movie.id) ? "✓ Added" : "+ Watch Later"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}