import { useEffect, useState } from "react";
import { tmdbRequest } from "../../api/tmdb";
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
        const data = await tmdbRequest(`/trending/person/${timeWindow}`);
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
          <div className="people-grid">
            {trending.slice(0, 10).map((person, index) => {
              const knownFor = (person.known_for || [])
                .map((item) => {
                  const title = item.title || item.name || item.original_title || item.original_name;
                  if (!title) return null;
                  const type = item.media_type === "tv" ? "TV" : "Movie";
                  return `${title} (${type})`;
                })
                .filter(Boolean)
                .join(", ");

              return (
                <article
                  className="person-card"
                  key={person.id}
                  onClick={() => navigate(`/person/${person.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="person-poster">
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                        alt={person.name}
                        className="poster-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="no-poster">
                        <span>No Image Available</span>
                      </div>
                    )}
                    <div className="person-popularity">
                      📈 {Math.round(person.popularity)}
                    </div>
                    {index < 3 && <div className="top-ranked">#{index + 1}</div>}
                  </div>

                  <div className="person-info">
                    <h3 className="person-title">{person.name}</h3>
                    <div className="person-meta">
                      <span className="department">{person.known_for_department}</span>
                      <span className={`adult-badge ${person.adult ? "adult" : "everyone"}`}>
                        {person.adult ? "18+" : "ALL"}
                      </span>
                    </div>
                    <p className="person-overview" title={knownFor || "No specific works listed"}>
                      {knownFor ? `Known for: ${knownFor}` : `Focus: ${person.known_for_department || "Entertainment"}`}
                    </p>
                    <button className="details-button" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/person/${person.id}`);
                    }}>
                      View Profile →
                    </button>
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
