import { useNavigate } from "react-router-dom";
import "./CastCarousel.css";

export default function CastCarousel({ cast, title }) {
    const navigate = useNavigate();

    if (!cast || cast.length === 0) return null;

    return (
        <section className="cast-carousel-section">
            <div className="section-header">
                <h3 className="section-title">{title || "Top Cast"}</h3>
                <div className="carousel-count">{cast.length} Members</div>
            </div>

            <div className="cast-scroll-container">
                {cast.map((person) => (
                    <div
                        key={person.id}
                        className="cast-item"
                        onClick={() => navigate(`/person/${person.id}`)}
                    >
                        <div className="cast-avatar-wrapper">
                            {person.profile_path ? (
                                <img
                                    className="cast-avatar"
                                    src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                                    alt={person.name}
                                    loading="lazy"
                                />
                            ) : (
                                <div className="cast-avatar-placeholder">
                                    {person.name.charAt(0)}
                                </div>
                            )}
                            <div className="cast-avatar-overlay">
                                <span className="view-profile-hint">View Profile</span>
                            </div>
                        </div>
                        <div className="cast-info">
                            <h4 className="cast-name">{person.name}</h4>
                            <p className="cast-character">{person.character}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
