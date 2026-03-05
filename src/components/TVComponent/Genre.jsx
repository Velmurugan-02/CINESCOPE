import { useEffect, useState } from "react";
import { tmdbRequest } from "../../api/tmdb";
import { useNavigate } from "react-router-dom";
import "./Genre.css";

export default function Genre() {
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await tmdbRequest("/genre/tv/list");
                setGenres(response?.genres || []);
            } catch (err) {
                console.error("Error fetching genres:", err);
                setError("Failed to load TV genres.");
            } finally {
                setLoading(false);
            }
        };
        fetchGenres();
    }, []);

    const displayedGenres = showAll ? genres : genres.slice(0, 10);

    return (
        <section className="genre-section">
            <div className="section-header">
                <div className="header-left">
                    <h2 className="section-title">TV Genres</h2>
                    <span className="section-badge">Browse</span>
                </div>
                <p className="section-subtitle">Discover diverse TV categories</p>
            </div>

            {loading && (
                <div className="genre-grid">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="genre-skeleton-pill" />
                    ))}
                </div>
            )}

            {error && (
                <div className="genre-error-box">
                    <p>⚠️ {error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="genre-grid">
                        {displayedGenres.map((genre) => (
                            <button
                                key={genre.id}
                                className="genre-pill"
                                onClick={() => navigate(`/genre/tv/list/${genre.id}`)}
                            >
                                <span className="genre-name">{genre.name}</span>
                            </button>
                        ))}
                    </div>

                    {genres.length > 10 && (
                        <div className="more-btn-container">
                            <button
                                className="more-genres-btn"
                                onClick={() => setShowAll(!showAll)}
                            >
                                {showAll ? "Show Less" : `+ More (${genres.length - 10})`}
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
