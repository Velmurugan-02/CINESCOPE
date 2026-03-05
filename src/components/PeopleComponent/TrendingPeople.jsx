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
          <div className="people-grid results-grid">
            {trending.slice(0, 10).map((person, index) => {
              const knownFor = (person.known_for || [])
                .map((item) => item.title || item.name)
                .filter(Boolean)
                .join(", ");

              return (
                <div key={person.id} className="result-card person-card">
                  <div className="card-image-wrapper">
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                        alt={person.name}
                        className="card-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="no-image">
                        <span>👤</span>
                      </div>
                    )}
                    <div className="card-badges">
                      {index < 3 && (
                        <span className="rank-badge">#{index + 1}</span>
                      )}
                      <span className="rating-badge">
                        📈 {Math.round(person.popularity)}
                      </span>
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="card-main-info">
                      <h3 className="card-title">{person.name}</h3>
                    </div>

                    <p className="card-subtitle">{person.known_for_department}</p>

                    {knownFor && (
                      <p className="card-overview">
                        Known for: {knownFor}
                      </p>
                    )}
                  </div>

                  <div className="card-footer">
                    <button
                      className="view-details-btn"
                      onClick={() => navigate(`/person/${person.id}`)}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
