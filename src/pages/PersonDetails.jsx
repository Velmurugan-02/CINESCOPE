import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPersonDetails } from "../api/tmdb";
import GlassSpinner from "../components/GlassSpinner";
import "./PersonDetails.css";

const PersonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getPersonDetails(id);
                setPerson(data);
            } catch (err) {
                setError("Failed to load biography.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    if (loading) return <GlassSpinner fullPage message="Fetching Biography" />;
    if (error) return <div className="error-container"><p>{error}</p></div>;

    return (
        <div className="movie-details-page person-details-page">
            <div
                className="movie-backdrop"
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${person.profile_path})` }}
            >
                <div className="backdrop-overlay"></div>
            </div>

            <div className="movie-content-container">
                <button
                    onClick={() => navigate(-1)}
                    className="btn-back"
                >
                    <span className="back-icon">←</span> Back
                </button>

                <div className="movie-main-info">
                    <div className="movie-poster-section">
                        <img
                            className="movie-poster"
                            src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                            alt={person.name}
                        />

                        <div className="movie-actions">
                            <button className="btn-action primary">View Gallery</button>
                            <button className="btn-action secondary">Share Profile</button>
                        </div>
                    </div>

                    <div className="movie-details-section">
                        <h1 className="movie-title">
                            {person.name}
                        </h1>

                        <p className="movie-tagline">{person.known_for_department}</p>

                        <div className="movie-meta-chips">
                            <span className="meta-chip rating">📈 Pop: {person.popularity?.toFixed(0)}</span>
                            {person.birthday && (
                                <span className="meta-chip birthday">🎂 {person.birthday}</span>
                            )}
                            {person.deathday && (
                                <span className="meta-chip deathday">🕯️ {person.deathday}</span>
                            )}
                            <span className="meta-chip status">{person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : "Non-binary"}</span>
                        </div>

                        <div className="movie-overview-section">
                            <h3>Biography</h3>
                            <p className="movie-overview">{person.biography || "No biography available."}</p>
                        </div>

                        <div className="movie-extra-info">
                            <div className="info-item">
                                <span className="info-label">Born In</span>
                                <span className="info-value">{person.place_of_birth || "Unknown"}</span>
                            </div>
                            {person.also_known_as?.length > 0 && (
                                <div className="info-item">
                                    <span className="info-label">Also Known As</span>
                                    <span className="info-value">{person.also_known_as.slice(0, 2).join(", ")}</span>
                                </div>
                            )}
                            <div className="info-item">
                                <span className="info-label">Credits</span>
                                <span className="info-value">{person.known_for_department}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonDetails;