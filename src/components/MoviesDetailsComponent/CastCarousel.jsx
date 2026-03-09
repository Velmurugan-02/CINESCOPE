import { useNavigate } from "react-router-dom";
import RailSlider from "../RailSlider";
import "./CastCarousel.css";

export default function CastCarousel({ cast, title }) {
    const navigate = useNavigate();

    if (!cast || cast.length === 0) return null;

    return (
        <RailSlider
            title={title || "Top Cast"}
            countText={`${cast.length} Members`}
            items={cast}
            className="cast-carousel-section"
            renderItem={(person) => (
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
            )}
        />
    );
}
