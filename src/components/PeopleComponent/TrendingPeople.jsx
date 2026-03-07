import { useEffect, useState } from "react";
import { getTrendingPeople } from "../../api/tmdb";
import { useNavigate } from "react-router-dom";
import "./TrendingPeople.css";

export default function TrendingPeople() {
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
        const data = await getTrendingPeople(timeWindow);
        setTrending(data.results || []);
      } catch (err) {
        setIsError(true);
        console.error("Error fetching trending people:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrending();
  }, [timeWindow]);

  return (
    <section className="trending-people-section">
      <div className="trending-people-header">
        <div className="header-left">
          <h1 className="trending-title">Trending People</h1>
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
            <p>Loading trending people...</p>
          </div>
        )}

        {isError && (
          <div className="error-container">
            <p className="error-message">⚠️ Something went wrong. Please try again later.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="card-grid">
            {trending.slice(0, 10).map((person, index) => {
              const knownFor = (person.known_for || [])
                .map((item) => item.title || item.name)
                .filter(Boolean)
                .join(", ");
              const popularity = Math.round(person.popularity);
              const profile = person.profile_path
                ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                : null;

              return (
                <article className="media-card" key={person.id}>
                  <div className="media-posterWrap">
                    {profile ? (
                      <img className="media-poster" src={profile} alt={person.name} loading="lazy" />
                    ) : (
                      <div className="media-noPoster">No Image</div>
                    )}

                    {/* Standard badges: Rank on Left, Popularity on Right */}
                    {index < 3 ? (
                      <div className="top-ranked">#{index + 1}</div>
                    ) : (
                      <div className="movie-lang">TRENDING</div>
                    )}

                    <div className="movie-rating">
                      📈 {popularity}
                    </div>

                    <div className="media-overlay">
                      <p className="media-overview">
                        {knownFor ? `Known for: ${knownFor}` : "No details available."}
                      </p>
                      <div className="media-stats">
                        <span>Dept: {person.known_for_department}</span>
                        <span>Pop: {popularity}</span>
                      </div>
                      <button
                        className="media-cta"
                        type="button"
                        onClick={() => navigate(`/person/${person.id}`)}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>

                  <div className="media-info">
                    <h3 className="media-title" title={person.name}>
                      {person.name}
                    </h3>
                    <p className="media-meta">
                      {person.known_for_department}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
