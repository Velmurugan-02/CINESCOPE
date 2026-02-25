import { useEffect, useMemo, useState } from "react";
import { tmdbRequest } from "../../api/tmdb";
import { useNavigate } from "react-router-dom";
import "./NowPlayingTVshows.css";

export default function NowPlaying() {
  const navigate = useNavigate();
  const [tv, setTv] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const formatVoteAverage = (v) => (typeof v === "number" ? v.toFixed(1) : "NA");
  const getYear = (dateStr) => (dateStr ? dateStr.slice(0, 4) : "----");

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const res = await tmdbRequest("/tv/airing_today", {
          page: 1,
          region: "IN",
        });

        const results = res?.results || [];

        results.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));

        setTv(results);
      } catch (err) {
        setIsError(true);
        console.error("Error fetching airing today tv shows:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNowPlaying();
  }, []);

  const visible = useMemo(() => tv.slice(0, 10), [tv]);

  return (
    <section className="home-section">
      <div className="section-header">
        <h2 className="section-title">Airing Today</h2>
        <p className="section-subtitle">Top picks based on popularity</p>
      </div>

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tv shows...</p>
        </div>
      )}

      {isError && (
        <div className="error-container">
          <p className="error-message">⚠️ Something went wrong. Please try again later.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="card-grid">
          {visible.map((tv, index) => {
            const title = tv.name || tv.original_name || "Untitled";
            const year = getYear(tv.first_air_date);
            const lang = (tv.original_language || "").toUpperCase();
            const rating = formatVoteAverage(tv.vote_average);
            const votes = tv.vote_count ?? 0;
            const popularity = tv.popularity ?? 0;
            const overview = tv.overview || "No overview available.";
            const poster = tv.poster_path
              ? `https://image.tmdb.org/t/p/w300${tv.poster_path}`
              : null;

            return (
              <article className="media-card" key={tv.id}>
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

                  <div className="media-overlay">
                    <p className="media-overview">{overview}</p>
                    <div className="media-stats">
                      <span>Votes: {votes}</span>
                      <span>Pop: {Math.round(popularity)}</span>
                    </div>
                    <button
                      className="media-cta"
                      type="button"
                      onClick={() => navigate(`/tv/${tv.id}`)}
                    >
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