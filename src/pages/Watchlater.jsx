import { getCookie, setCookie } from "../utils/cookieUtils";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Watchlater.css";
import "../components/HomeComponent/TrendingMovieSection.css"; // Reuse card styles

const WatchLater = () => {
  const [watchlater, setWatchlater] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const movies = JSON.parse(getCookie("watchlater") || "[]");
    setWatchlater(movies);
  }, []);

  const removeFromWatchlater = (e, movieId) => {
    e.stopPropagation();
    const updatedList = watchlater.filter((movie) => movie.id !== movieId);
    setWatchlater(updatedList);
    setCookie("watchlater", JSON.stringify(updatedList), 7);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).getFullYear();
  };

  const formatVoteAverage = (vote) => {
    return vote ? vote.toFixed(1) : "N/A";
  };

  return (
    <div className="watchlater-section">
      <header className="watchlater-header">
        <h1 className="watchlater-title">My Watch List</h1>
        <p className="watchlater-description">You have {watchlater.length} items saved to watch later.</p>
      </header>

      {watchlater.length > 0 ? (
        <div className="watchlater-grid">
          {watchlater.map((item) => (
            <div
              className="movie-card"
              key={item.id}
              onClick={() => navigate(item.title ? `/movie/${item.id}` : `/tv/${item.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="movie-poster">
                {item.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    alt={item.title || item.name}
                    className="poster-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="no-poster">
                    <span>No Poster Available</span>
                  </div>
                )}

                <div className="movie-rating">
                  ⭐ {formatVoteAverage(item.vote_average)}
                </div>

                <div className="movie-lang">
                  {(item.original_language || "EN").toUpperCase()}
                </div>
              </div>

              <div className="movie-info">
                <h3 className="movie-title">{item.title || item.name}</h3>
                <div className="movie-meta">
                  <span className="release-date">{formatDate(item.release_date || item.first_air_date)}</span>
                  <span className={`adult-badge ${item.adult ? "adult" : "everyone"}`}>
                    {item.adult ? "18+" : "ALL"}
                  </span>
                </div>
                <button
                  className="remove-button"
                  onClick={(e) => removeFromWatchlater(e, item.id)}
                >
                  <span>🗑️</span> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <p className="empty-text">Your watch list is feeling a bit lonely.</p>
          <Link to="/" className="explore-button">Explore Movies</Link>
        </div>
      )}
    </div>
  );
}

export default WatchLater;