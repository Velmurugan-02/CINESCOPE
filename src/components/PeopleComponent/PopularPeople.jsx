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
        <div className="card-grid">
          {visible.map((person, index) => {
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
                    <div className="movie-lang">PEOPLE</div>
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
    </section>
  );
}
