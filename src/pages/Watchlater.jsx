import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie } from "../utils/cookieUtils";
import "./Watchlater.css";

export default function Watchlater() {
  const navigate = useNavigate();
  const [movieList, setMovieList] = useState([]);
  const [tvList, setTvList] = useState([]);

  useEffect(() => {
    const savedMovies = JSON.parse(getCookie("watchlater_movies") || "[]");
    const savedTv = JSON.parse(getCookie("watchlater_tv") || "[]");
    setMovieList(savedMovies);
    setTvList(savedTv);
  }, []);

  const removeMovie = (id) => {
    const updated = movieList.filter((m) => m.id !== id);
    setMovieList(updated);
    setCookie("watchlater_movies", JSON.stringify(updated), 7);
  };

  const removeTv = (id) => {
    const updated = tvList.filter((m) => m.id !== id);
    setTvList(updated);
    setCookie("watchlater_tv", JSON.stringify(updated), 7);
  };

  const renderCard = (item, type) => {
    const title = item.title || item.name || "Untitled";
    const poster = item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : null;
    const rating = item.vote_average ? item.vote_average.toFixed(1) : "NA";

    return (
      <article className="watchlater-card" key={item.id}>
        <div
          className="watchlater-poster-container"
          onClick={() => navigate(`/${type}/${item.id}`)}
        >
          {poster ? (
            <img src={poster} alt={title} className="watchlater-poster" />
          ) : (
            <div className="watchlater-no-poster">No Poster Available</div>
          )}
          <div className="watchlater-rating">⭐ {rating}</div>
        </div>
        <div className="watchlater-info">
          <h3 className="watchlater-item-title">{title}</h3>
          <button
            className="watchlater-remove-btn"
            onClick={() => type === "movie" ? removeMovie(item.id) : removeTv(item.id)}
          >
            Remove
          </button>
        </div>
      </article>
    );
  };

  return (
    <section className="watchlater-page">
      <header className="watchlater-header">
        <h1 className="watchlater-title">My Watch List</h1>
        <p className="watchlater-subtitle">Save your favorite movies and shows to watch them later</p>
      </header>

      <div className="watchlater-content">
        {/* Movies Section */}
        <div className="watchlater-section">
          <h2 className="section-label">Movies</h2>
          {movieList.length > 0 ? (
            <div className="watchlater-grid">
              {movieList.map(item => renderCard(item, "movie"))}
            </div>
          ) : (
            <p className="empty-message">No movies added yet.</p>
          )}
        </div>

        {/* TV Shows Section */}
        <div className="watchlater-section">
          <h2 className="section-label">TV Shows</h2>
          {tvList.length > 0 ? (
            <div className="watchlater-grid">
              {tvList.map(item => renderCard(item, "tv"))}
            </div>
          ) : (
            <p className="empty-message">No TV shows added yet.</p>
          )}
        </div>
      </div>

      {movieList.length === 0 && tvList.length === 0 && (
        <div className="watchlater-empty-state">
          <button className="browse-btn" onClick={() => navigate("/")}>
            Go Browse Content
          </button>
        </div>
      )}
    </section>
  );
}