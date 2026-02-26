import { useEffect, useState } from "react";
import { tmdbRequest } from "../../api/tmdb";
import { useNavigate } from "react-router-dom";
import { setCookie, getCookie } from "../../utils/cookieUtils";
import "./PopularMoviesSection.css";

export default function PopularMoviesSection() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const formatVoteAverage = (v) => (typeof v === "number" ? v.toFixed(1) : "NA");
  const getYear = (dateStr) => (dateStr ? dateStr.slice(0, 4) : "----");

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const res = await tmdbRequest("/discover/movie", {
          with_original_language: "en",
          sort_by: "popularity.desc",
          include_adult: false,
          page: 1,
        });

        setMovies(res?.results || []);
      } catch (err) {
        setIsError(true);
        console.error("Error fetching popular movies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  const visible = movies.slice(0, 10);

  const watchlater = (movie) => {
    const parsed = JSON.parse(getCookie("watchlater") || "[]");
    const existingList = Array.isArray(parsed) ? parsed : [];
    const isAlreadyAdded = existingList.find((item) => item.id === movie.id);
    if (isAlreadyAdded) {
      console.log(`${movie.title} is already in your Watch Later list!`);
      return;
    }
    const updatedList = [...existingList, movie];
    setCookie("watchlater", JSON.stringify(updatedList), 7);
    console.log(`${movie.title} has been added to your Watch Later list!`);
  };

  return (
    <section className="popular-movies-section">
      <div className="popular-movies-header">
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

                  {/* Standard badges: Rank/Lang on Left, Rating on Right */}
                  {index < 3 ? (
                    <div className="top-ranked">#{index + 1}</div>
                  ) : (
                    <div className="movie-lang">{lang || "EN"}</div>
                  )}

                  <div className="movie-rating">
                    ⭐ {rating}
                  </div>

                  {/* hover overlay (uses overview + backdrop_path idea) */}
                  <div className="media-overlay">
                    <p className="media-overview">{overview}</p>
                    <div className="media-stats">
                      <span>Votes: {votes}</span>
                      <span>Pop: {Math.round(popularity)}</span>
                    </div>
                    <button className="media-cta" type="button" onClick={() => {
                      navigate(`/movie/${movie.id}`)
                    }}>
                      View details
                    </button>
                    <button className="media-cta" type="button" onClick={() => watchlater(movie)}>
                      Watch Later
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
