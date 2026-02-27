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

    if (loading) {
        return (
            <section className="genre-section">
                <div className="genre-header">
                    <h2 className="genre-title">
                        Movie <span className="genre-title-accent">Genres</span>
                    </h2>
                </div>
                <div className="genre-loading-grid">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="genre-skeleton" />
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="genre-section">
                <div className="genre-error">
                    <p>⚠️ {error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="genre-section">
            <div className="genre-header">
                <h2 className="genre-title">
                    Movie <span className="genre-title-accent">Genres</span>
                </h2>
            </div>

            <div className="genre-grid">
                {genres.map((genre) => (
                    <button
                        key={genre.id}
                        className="genre-pill"
                        onClick={() => navigate(`/genre/movie/list/${genre.id}`)}
                    >
                        <span className="genre-pill-name">{genre.name}</span>
                    </button>
                ))}
            </div>
        </section>
    );
}