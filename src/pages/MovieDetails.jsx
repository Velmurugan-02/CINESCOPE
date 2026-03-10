import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails, getMovieVideos, getMovieCredits, getMovieWatchProviders } from "../api/tmdb";
import { getCookie, setCookie } from "../utils/cookieUtils";
import { Heart } from "lucide-react";
import GlassSpinner from "../components/GlassSpinner";
import TrailerModal from "../components/MoviesDetailsComponent/TrailerModal";
import CastCarousel from "../components/MoviesDetailsComponent/CastCarousel";
import WatchProviders from "../components/MoviesDetailsComponent/WatchProviders";
import Recommendations from "../components/MoviesDetailsComponent/Recommendations";
import MovieReview from "../components/MoviesDetailsComponent/MovieReview";
import "./MovieDetails.css";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [cast, setCast] = useState([]);
  const [watchProviders, setWatchProviders] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [movieData, creditData, providerData] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getMovieWatchProviders(id)
        ]);
        setMovie(movieData);
        setCast(creditData.cast);
        setWatchProviders(providerData);
      } catch (err) {
        setError("Failed to load movie.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  useEffect(() => {
    if (movie) {
      const favourites = JSON.parse(getCookie("favourite_movies") || "[]");
      setIsFavourite(favourites.some((m) => m.id === movie.id));

      const watchLater = JSON.parse(getCookie("watchlater_movies") || "[]");
      setIsWatchLater(watchLater.some((m) => m.id === movie.id));
    }
  }, [movie]);

  const toggleFavourite = () => {
    const favourites = JSON.parse(getCookie("favourite_movies") || "[]");
    let updated;
    if (isFavourite) {
      updated = favourites.filter((m) => m.id !== movie.id);
    } else {
      updated = [...favourites, {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average
      }];
    }
    setCookie("favourite_movies", JSON.stringify(updated), 30);
    setIsFavourite(!isFavourite);
  };

  const handleWatchTrailer = async () => {
    try {
      const videoData = await getMovieVideos(id);
      const trailer = videoData.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      ) || videoData.results[0];

      if (trailer) {
        setTrailerKey(trailer.key);
      }
      setShowTrailer(true);
    } catch (err) {
      console.error("Failed to fetch trailer:", err);
      setShowTrailer(true);
    }
  };

  const handleWatchLater = () => {
    const watchLater = JSON.parse(getCookie("watchlater_movies") || "[]");
    let updated;
    const alreadyAdded = watchLater.some((m) => m.id === movie.id);
    if (alreadyAdded) {
      updated = watchLater.filter((m) => m.id !== movie.id);
    } else {
      updated = [...watchLater, {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average
      }];
    }
    setCookie("watchlater_movies", JSON.stringify(updated), 30);
    setIsWatchLater(!alreadyAdded);
  };

  if (loading) return <GlassSpinner fullPage message="Fetching Details" />;
  if (error) return <p>{error}</p>;

  return (
    <div className="movie-details-page">
      {/* Backdrop */}
      <div
        className="movie-backdrop"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      {/* Main hero content */}
      <div className="movie-content-container">
        <button onClick={() => navigate(-1)} className="btn-back">
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
              <button className="btn-action primary" onClick={handleWatchTrailer}>
                Watch Trailer
              </button>
              <button className="btn-action secondary" onClick={handleWatchLater}>{isWatchLater ? "Remove from Watchlater" : "+ Watchlater"}</button>
              <button
                className={`btn-action favourite ${isFavourite ? "active" : ""}`}
                onClick={toggleFavourite}
                title={isFavourite ? "Remove from Favourites" : "Add to Favourites"}
              >
                <Heart
                  size={20}
                  fill={isFavourite ? "var(--primary)" : "none"}
                  stroke={isFavourite ? "var(--primary)" : "currentColor"}
                />
              </button>
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
                <span className="info-value">
                  {movie.production_companies?.map((c) => c.name).join(", ")}
                </span>
              </div>
            </div>
            <WatchProviders providers={watchProviders} />
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        trailerKey={trailerKey}
        title={movie.title}
      />

      {/* Below-the-fold sections inside a padded container */}
      <div className="movie-sections-container">
        <CastCarousel cast={cast} title="Top Cast" />
        <hr className="section-divider" />
        <Recommendations id={id} type="movie" />
        <hr className="section-divider" />
        <MovieReview id={id} />
      </div>
    </div>
  );
};

export default MovieDetails;
