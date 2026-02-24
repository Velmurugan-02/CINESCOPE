import { useEffect, useState } from "react";
import { tmdbRequest } from "../../api/tmdb";
import { useNavigate } from "react-router-dom";
import "./Genre.css";

// Gradient pairs per genre for pill accent colours
const GENRE_GRADIENTS = {
    28: ["#ff6b6b", "#ee0979"],
    12: ["#f7971e", "#ffd200"],
    16: ["#43e97b", "#38f9d7"],
    35: ["#fddb92", "#d1fdff"],
    80: ["#b8c6db", "#f5f7fa"],
    99: ["#a18cd1", "#fbc2eb"],
    18: ["#667eea", "#764ba2"],
    10751: "#f953c6",
    14: ["#4facfe", "#00f2fe"],
    36: ["#d4a04a", "#f9d976"],
    27: ["#141e30", "#243b55"],
    10402: ["#f953c6", "#b91d73"],
    9648: ["#373b44", "#4286f4"],
    10749: ["#f77062", "#fe5196"],
    878: ["#4776e6", "#8e54e9"],
    10770: ["#076585", "#fff"],
    53: ["#0f0c29", "#302b63"],
    10752: ["#373b44", "#7f8c8d"],
    37: ["#c94b4b", "#4b134f"],
};

function getGradient(id) {
    const g = GENRE_GRADIENTS[id];
    if (!g) return "linear-gradient(135deg, #7210D3, #b28cff)";
    if (typeof g === "string") return `linear-gradient(135deg, ${g}, #ffb86c)`;
    return `linear-gradient(135deg, ${g[0]}, ${g[1]})`;
}

export default function Genre() {
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await tmdbRequest("/genre/tv/list");
                setGenres(response?.genres || []);
            } catch (err) {
                console.error("Error fetching genres:", err);
                setError("Failed to load genres.");
            } finally {
                setLoading(false);
            }
        };
        fetchGenres();
    }, []);

    return (
        <section className="genre-section">
            {/* Header */}
            <div className="genre-header">
                <div className="genre-title-group">
                    <span className="genre-eyebrow">Browse by</span>
                    <h2 className="genre-title">
                        TV Shows <span className="genre-title-accent">Genres</span>
                    </h2>
                </div>
                <p className="genre-subtitle">{genres.length} categories available</p>
            </div>

            {/* States */}
            {loading && (
                <div className="genre-loading">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div className="genre-skeleton" key={i} style={{ animationDelay: `${i * 0.06}s` }} />
                    ))}
                </div>
            )}

            {error && (
                <div className="genre-error">
                    <span className="genre-error-icon">⚠️</span>
                    <p>{error}</p>
                </div>
            )}

            {/* Grid */}
            {!loading && !error && (
                <div className="genre-grid">
                    {genres.map((genre, i) => (
                        <button
                            key={genre.id}
                            className="genre-pill"
                            style={{
                                "--pill-gradient": getGradient(genre.id),
                                animationDelay: `${i * 0.04}s`,
                            }}
                            onClick={() => navigate(`/genre/tv/list/${genre.id}`)}
                        >
                            <span className="genre-pill-bg" />
                            <span className="genre-pill-icon">
                            </span>
                            <span className="genre-pill-name">{genre.name}</span>
                            <span className="genre-pill-arrow">→</span>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}