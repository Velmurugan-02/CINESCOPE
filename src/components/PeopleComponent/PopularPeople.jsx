import { useEffect, useState } from "react";
import { tmdbRequest } from "../../api/tmdb";
import { useNavigate } from "react-router-dom";
import "./PopularPeople.css";

export default function PopularPeople() {
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const formatVoteAverage = (v) => (typeof v === "number" ? v.toFixed(1) : "NA");
  const getYear = (dateStr) => (dateStr ? dateStr.slice(0, 4) : "----");

  useEffect(() => {
    const fetchPopularPeople = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const res = await tmdbRequest("/person/popular", {
          with_original_language: "en",
          sort_by: "popularity.desc",
          include_adult: false,
          page: 1,
        });

        setPeople(res?.results || []);
      } catch (err) {
        setIsError(true);
        console.error("Error fetching popular persons:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularPeople();
  }, []);

  const visible = people.slice(0, 10);

  return (
    <section className="home-section">
      <div className="section-header">
        <h2 className="section-title">Popular People</h2>
        <p className="section-subtitle">Top picks based on popularity</p>
      </div>

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading people...</p>
        </div>
      )}

      {isError && (
        <div className="error-container">
          <p className="error-message">⚠️ Something went wrong. Please try again later.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="card-grid">
          {visible.map((person, index) => {
            const title = person.name || person.original_name || "Untitled";
            const year = getYear(person.birthday || person.known_for_department || "");
            const lang = (person.original_language || "").toUpperCase();
            const rating = formatVoteAverage(person.vote_average);
            const votes = person.vote_count ?? 0;
            const popularity = person.popularity ?? 0;
            const knownFor = person.known_for?.[0]?.title || person.known_for?.[0]?.name || "View details";
            const overview = `${person.known_for_department || "Unknown"}\n${knownFor}\nPopularity: ${Math.round(popularity)}`;
            const poster = person.profile_path
              ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
              : null;

            return (
              <article className="media-card" key={person.id}>
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
                      navigate(`/person/${person.id}`)
                    }}>
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
