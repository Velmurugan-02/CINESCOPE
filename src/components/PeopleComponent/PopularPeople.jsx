import { useEffect, useState } from "react";
import { getPopularPeople } from "../../api/tmdb";
import { useNavigate } from "react-router-dom";
import "./PopularPeople.css";

export default function PopularPeople() {
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchPopularPeople = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const res = await getPopularPeople();
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
    <section className="popular-people-section">
      <div className="popular-people-header">
        <div className="header-left">
          <h2 className="section-title">Popular People</h2>
          <span className="section-badge">Top Picks</span>
        </div>
        <p className="section-subtitle">Based on community interest</p>
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
        <div className="card-grid results-grid">
          {visible.map((person, index) => {
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
    </section>
  );
}
