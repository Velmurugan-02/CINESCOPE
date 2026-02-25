import { useEffect, useState } from "react";
import { tmdbRequest } from "../../api/tmdb";
import { useNavigate } from "react-router-dom";
import "./TrendingTVshows.css";

export default function TrendingTVshows() {
  const [trending, setTrending] = useState([]);
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
        const data = await tmdbRequest(`/trending/tv/${timeWindow}`);
        setTrending(data.results || []);
      } catch (err) {
        setIsError(true);
        console.error("Error fetching trending TV shows:", err);
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
          <h1 className="trending-title">Trending TV Shows</h1>
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
            <p>Loading trending TV shows...</p>
          </div>
        )}

        {isError && (
          <div className="error-container">
            <p className="error-message">⚠️ Something went wrong. Please try again later.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="card-grid">
            {trending.slice(0, 10).map((tvShow, index) => (
              <article
                className="media-card"
                key={tvShow.id}
                onClick={() => navigate(`/tv/${tvShow.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="movie-poster">
                  {tvShow.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${tvShow.poster_path}`}
                      alt={tvShow.name}
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
                    ⭐ {formatVoteAverage(tvShow.vote_average)}
                  </div>

                  {/* Top-Left Rank or Language */}
                  {index < 3 ? (
                    <div className="top-ranked">#{index + 1}</div>
                  ) : (
                    <div className="movie-lang">{(tvShow.original_language || "EN").toUpperCase()}</div>
                  )}
                </div>

                <div className="movie-info">
                  <h3 className="movie-title">{tvShow.name}</h3>
                  <div className="movie-meta">
                    <span className="release-date">{formatDate(tvShow.first_air_date)}</span>
                    <span className={`adult-badge ${tvShow.adult ? "adult" : "everyone"}`}>
                      {tvShow.adult ? "18+" : "ALL"}
                    </span>
                  </div>
                  <p className="movie-overview">
                    {tvShow.overview
                      ? (tvShow.overview.length > 120
                        ? `${tvShow.overview.substring(0, 120)}...`
                        : tvShow.overview)
                      : "No description available."}
                  </p>
                  <button className="details-button" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/tv/${tvShow.id}`);
                  }}>
                    View Details →
                  </button>
                   <button className="media-cta" type="button" onClick={() => {
                      
                    }
                    }>
                      Watch Later
                    </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}