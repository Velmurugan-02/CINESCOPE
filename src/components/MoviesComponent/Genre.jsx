import { useEffect, useState } from "react";
import { tmdbRequest } from "../../api/tmdb";
import { useNavigate } from "react-router-dom";
import "./Genre.css";

export default function Genre() {
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await tmdbRequest("/genre/movie/list");
                setGenres(response?.genres || []);
            } catch (err) {
                console.error("Error fetching genres:", err);
                setError("Failed to load movie genres.");
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    return (
        <section className="genre-section">
            <div className="section-header">
                <div className="header-left">
                    <h2 className="section-title">Movie Genres</h2>
                    <span className="section-badge">Explore</span>
                </div>
                <p className="section-subtitle">Find your favorite categories</p>
            </div>

            {loading && (
                <div className="genre-grid">
                    {Array.from({ length: 12 }).map((_, i) => (
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
                <div className="genre-grid">
                    {genres.map((genre) => (
                        <button
                            key={genre.id}
                            className="genre-pill"
                            onClick={() => navigate(`/genre/movie/list/${genre.id}`)}
                        >
                            <span className="genre-name">{genre.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}