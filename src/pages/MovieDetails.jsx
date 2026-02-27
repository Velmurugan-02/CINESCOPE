import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails } from "../api/tmdb";
import GlassSpinner from "../components/GlassSpinner";
import "./MovieDetails.css";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError("Failed to load movie.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);
  if (loading) return <GlassSpinner fullPage message="Fetching Details" />;
  if (error) return <p>{error}</p>;
  return (
    <div className="movie-details-page">
      <div
        className="movie-backdrop"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      <div className="movie-content-container">
        <button
          onClick={() => navigate(-1)}
          className="btn-back"
        >
          <span className="back-icon">←</span> Back
        </button>

        <div className="movie-main-info">
          <div className="movie-poster-section">
            <img
              className="movie-poster"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />

            <div className="movie-actions">
              <button className="btn-action primary">Watch Trailer</button>
              <button className="btn-action secondary">+ Watchlist</button>
            </div>
          </div>

          <div className="movie-details-section">
            <h1 className="movie-title">
              {movie.title} <span className="release-year">({movie.release_date?.slice(0, 4)})</span>
            </h1>

            <p className="movie-tagline">{movie.tagline}</p>

            <div className="movie-meta-chips">
              <span className="meta-chip rating">⭐ {movie.vote_average?.toFixed(1)}</span>
              <span className="meta-chip runtime">{movie.runtime}m</span>
              <span className="meta-chip status">{movie.status}</span>
            </div>

            <div className="movie-overview-section">
              <h3>Overview</h3>
              <p className="movie-overview">{movie.overview}</p>
            </div>

            <div className="movie-extra-info">
              <div className="info-item">
                <span className="info-label">Budget</span>
                <span className="info-value">${movie.budget?.toLocaleString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Revenue</span>
                <span className="info-value">${movie.revenue?.toLocaleString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Companies</span>
                <span className="info-value">{movie.production_companies?.map(c => c.name).join(", ")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MovieDetails;