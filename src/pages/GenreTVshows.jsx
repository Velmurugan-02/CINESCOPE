import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tmdbRequest } from "../api/tmdb";
import { getCookie, setCookie } from "../utils/cookieUtils";
// import "../components/MoviesComponent/PopularMoviesSection.css";

const formatVoteAverage = (v) => (typeof v === "number" ? v.toFixed(1) : "NA");
const getYear = (dateStr) => (dateStr ? dateStr.slice(0, 4) : "----");

export default function GenreTVshows() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tvShows, setTvShows] = useState([]);
    const [watchlater, setWatchlater] = useState([]);
    const [genreName, setGenreName] = useState("Genre");
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch genre name
    useEffect(() => {
        tmdbRequest("/genre/tv/list")
            .then((res) => {
                const found = (res?.genres || []).find((g) => String(g.id) === String(id));
                if (found) setGenreName(found.name);
            })
            .catch(() => { });
    }, [id]);

    // Fetch TV shows for the genre
    useEffect(() => {
        const fetchTVShows = async () => {
            try {
                setIsLoading(true);
                setIsError(false);
                const res = await tmdbRequest("/discover/tv", {
                    with_genres: id,
                    sort_by: "popularity.desc",
                    include_adult: false,
                    page,
                });
                setTvShows(res?.results || []);
                setTotalPages(Math.min(res?.total_pages || 1, 500));

                // Load watchlater from cookies
                const saved = JSON.parse(getCookie("watchlater_tv") || "[]");
                setWatchlater(saved);
            } catch (err) {
                console.error("Error fetching genre TV shows:", err);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTVShows();
    }, [id, page]);

    const toggleWatchLater = (e, show) => {
        e.stopPropagation();
        let updatedList;
        const exists = watchlater.find((m) => m.id === show.id);

        if (exists) {
            updatedList = watchlater.filter((m) => m.id !== show.id);
        } else {
            updatedList = [...watchlater, show];
        }

        setWatchlater(updatedList);
        setCookie("watchlater_tv", JSON.stringify(updatedList), 7);
    };

    const isInWatchLater = (showId) => watchlater.some((m) => m.id === showId);

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
                    onClick={() => navigate("/tv")}
                >
                    ← Back to TV Shows
                </button>
                <h2 className="section-title">{genreName} TV Shows</h2>
                <p className="section-subtitle">Discover top {genreName.toLowerCase()} shows</p>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading TV shows...</p>
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
                        {tvShows.map((tvShow, index) => {
                            const title = tvShow.name || tvShow.original_name || "Untitled";
                            const year = getYear(tvShow.first_air_date);
                            const lang = (tvShow.original_language || "").toUpperCase();
                            const rating = formatVoteAverage(tvShow.vote_average);
                            const votes = tvShow.vote_count ?? 0;
                            const popularity = tvShow.popularity ?? 0;
                            const overview = tvShow.overview || "No overview available.";
                            const poster = tvShow.poster_path
                                ? `https://image.tmdb.org/t/p/w300${tvShow.poster_path}`
                                : null;

                            return (
                                <article className="media-card" key={tvShow.id}>
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
                                                    onClick={() => navigate(`/tv/${tvShow.id}`)}
                                                    style={{ flex: 1 }}
                                                >
                                                    View detail
                                                </button>
                                                <button
                                                    className={`media-cta ${isInWatchLater(tvShow.id) ? "active" : ""}`}
                                                    type="button"
                                                    onClick={(e) => toggleWatchLater(e, tvShow)}
                                                    style={{
                                                        flex: 1,
                                                        background: isInWatchLater(tvShow.id) ? "var(--primary)" : "rgba(255,255,255,0.1)",
                                                        color: "white"
                                                    }}
                                                >
                                                    {isInWatchLater(tvShow.id) ? "✓ Added" : "+ Watch"}
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
