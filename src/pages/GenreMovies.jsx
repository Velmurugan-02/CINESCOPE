import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tmdbRequest } from "../api/tmdb";
import { getCookie, setCookie } from "../utils/cookieUtils";
import "../components/MoviesComponent/PopularMoviesSection.css";

const formatVoteAverage = (v) => (typeof v === "number" ? v.toFixed(1) : "NA");
const getYear = (dateStr) => (dateStr ? dateStr.slice(0, 4) : "----");

export default function GenreMovies() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [watchlater, setWatchlater] = useState([]);
    const [genreName, setGenreName] = useState("Genre");
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch genre name
    useEffect(() => {
        tmdbRequest("/genre/movie/list")
            .then((res) => {
                const found = (res?.genres || []).find((g) => String(g.id) === String(id));
                if (found) setGenreName(found.name);
            })
            .catch(() => { });
    }, [id]);

    // Fetch movies for the genre
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true);
                setIsError(false);
                const res = await tmdbRequest("/discover/movie", {
                    with_genres: id,
                    sort_by: "popularity.desc",
                    include_adult: false,
                    page,
                });
                setMovies(res?.results || []);
                setTotalPages(Math.min(res?.total_pages || 1, 500));

                // Load watchlater from cookies
                const saved = JSON.parse(getCookie("watchlater_movies") || "[]");
                setWatchlater(saved);
            } catch (err) {
                console.error("Error fetching genre movies:", err);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovies();
    }, [id, page]);

    const toggleWatchLater = (e, movie) => {
        e.stopPropagation();
        let updatedList;
        const exists = watchlater.find((m) => m.id === movie.id);

        if (exists) {
            updatedList = watchlater.filter((m) => m.id !== movie.id);
        } else {
            updatedList = [...watchlater, movie];
        }

        setWatchlater(updatedList);
        setCookie("watchlater_movies", JSON.stringify(updatedList), 7);
    };

    const isInWatchLater = (movieId) => watchlater.some((m) => m.id === movieId);

    return (
        <section className="home-section" style={{ minHeight: "80vh" }}>
            {/* Header */}
            <div className="section-header">
                <button
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--primary-color, #7210D3)",
                        fontSize: "0.9rem",
                        marginBottom: "0.5rem",
                        padding: 0,
                    }}
                    onClick={() => navigate("/movies")}
                >
                    ← Back to Movies
                </button>
                <h2 className="section-title">{genreName} Movies</h2>
                <p className="section-subtitle">Discover top {genreName.toLowerCase()} films</p>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading movies...</p>
                </div>
            )}

            {/* Error */}
            {isError && (
                <div className="error-container">
                    <p className="error-message">⚠️ Something went wrong. Please try again later.</p>
                </div>
            )}

            {/* Grid */}
            {!isLoading && !isError && (
                <>
                    <div className="card-grid">
                        {movies.map((movie, index) => {
                            const title = movie.title || movie.original_title || "Untitled";
                            const year = getYear(movie.release_date);
                            const lang = (movie.original_language || "").toUpperCase();
                            const rating = formatVoteAverage(movie.vote_average);
                            const votes = movie.vote_count ?? 0;
                            const popularity = movie.popularity ?? 0;
                            const overview = movie.overview || "No overview available.";
                            const poster = movie.poster_path
                                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                                : null;

                            return (
                                <article className="media-card" key={movie.id}>
                                    <div className="media-posterWrap">
                                        {poster ? (
                                            <img className="media-poster" src={poster} alt={title} loading="lazy" />
                                        ) : (
                                            <div className="media-noPoster">No Poster</div>
                                        )}

                                        <div className="media-badges">
                                            <span className="badge">{lang || "NA"}</span>
                                            <span className="badge">⭐ {rating}</span>
                                        </div>

                                        {index < 3 && <div className="rank-badge">#{index + 1}</div>}

                                        <div className="media-overlay">
                                            <p className="media-overview">{overview}</p>
                                            <div className="media-stats">
                                                <span>Votes: {votes}</span>
                                                <span>Pop: {Math.round(popularity)}</span>
                                            </div>
                                            <div className="overlay-actions" style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                                                <button
                                                    className="media-cta"
                                                    type="button"
                                                    onClick={() => navigate(`/movie/${movie.id}`)}
                                                    style={{ flex: 1 }}
                                                >
                                                    View detail
                                                </button>
                                                <button
                                                    className={`media-cta ${isInWatchLater(movie.id) ? "active" : ""}`}
                                                    type="button"
                                                    onClick={(e) => toggleWatchLater(e, movie)}
                                                    style={{
                                                        flex: 1,
                                                        background: isInWatchLater(movie.id) ? "var(--primary)" : "rgba(255,255,255,0.1)",
                                                        color: "white"
                                                    }}
                                                >
                                                    {isInWatchLater(movie.id) ? "✓ Added" : "+ Watch"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="media-info">
                                        <h3 className="media-title" title={title}>
                                            {title}
                                        </h3>
                                        <p className="media-meta">
                                            {year} • {votes.toLocaleString()} votes
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "1rem",
                            marginTop: "2rem",
                            flexWrap: "wrap",
                        }}
                    >
                        <button
                            className="media-cta"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            style={{ opacity: page === 1 ? 0.4 : 1 }}
                        >
                            ← Prev
                        </button>
                        <span style={{ color: "var(--text-color)", fontWeight: 600 }}>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            className="media-cta"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            style={{ opacity: page === totalPages ? 0.4 : 1 }}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}
