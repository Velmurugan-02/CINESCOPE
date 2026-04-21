import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tmdbRequest } from "../api/tmdb";
import { getCookie, setCookie } from "../utils/cookieUtils";
import "../components/MoviesComponent/PopularMoviesSection.css";
import "./Movies.css";

const INDUSTRIES = {
    bollywood: { name: "Bollywood", params: { with_original_language: "hi" } },
    kollywood: { name: "Kollywood", params: { with_original_language: "ta" } },
    hollywood: { name: "Hollywood", params: { with_original_language: "en", region: "US" } },
    tollywood: { name: "Tollywood", params: { with_original_language: "te" } },
    mollywood: { name: "Mollywood", params: { with_original_language: "ml" } }, // Malayalam
    sandalwood: { name: "Sandalwood", params: { with_original_language: "kn" } }, // Kannada
    k_drama: { name: "Korean", params: { with_original_language: "ko" } },
    anime: { name: "Japanese", params: { with_original_language: "ja" } },
    spanish: { name: "Spanish", params: { with_original_language: "es" } },
    french: { name: "French", params: { with_original_language: "fr" } }
};

const formatVoteAverage = (v) => (typeof v === "number" ? v.toFixed(1) : "NA");
const getYear = (dateStr) => (dateStr ? dateStr.slice(0, 4) : "----");

export default function IndustryMovies() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentIndustry = INDUSTRIES[id.toLowerCase()] || { name: "Unknown", params: {} };

    const SECTIONS = {
        popular: { name: "Popular", params: { sort_by: "popularity.desc" } },
        theaters: {
            name: "In Theaters",
            params: {
                with_release_type: "2|3",
                "primary_release_date.gte": "2024-01-01", // You can make this dynamic!
                "primary_release_date.lte": new Date().toISOString().split('T')[0]
            }
        },
        top_rated: {
            name: "Top Rated",
            params: {
                sort_by: "vote_average.desc",
                "vote_count.gte": 100 // Ensures we only see movies people actually voted for
            }
        }
    };

    const [movies, setMovies] = useState([]);
    const [watchlater, setWatchlater] = useState([]);
    const [industryName, setIndustryName] = useState("Industry");
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [activeSection, setActiveSection] = useState(() => {
        return sessionStorage.getItem(`industry_tab_${id}`) || "popular";
    });
    const [sectionMovies, setSectionMovies] = useState([]);
    const [sectionLoading, setSectionLoading] = useState(false);

    useEffect(() => {
        if (currentIndustry && currentIndustry.name !== "Unknown") {
            setIndustryName(currentIndustry.name);
        }
    }, [id, currentIndustry]);

    useEffect(() => {
        const fetchIndustryMovies = async () => {
            try {
                setIsLoading(true);
                setIsError(false);
                const res = await tmdbRequest("/discover/movie", {
                    ...currentIndustry.params,
                    ...SECTIONS[activeSection].params,
                    page,
                });
                setMovies(res?.results || []);
                setTotalPages(Math.min(res?.total_pages || 1, 500));

                // Load watchlater from cookies
                const saved = JSON.parse(getCookie("watchlater_movies") || "[]");
                setWatchlater(saved);
            } catch (err) {
                console.error("Error fetching industry movies:", err);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchIndustryMovies();
    }, [id, page, activeSection]);

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
        <section className="home-section">
            {/* Header */}
            <div className="popular-movies-header">
                <div>
                    <button className="back-link" onClick={() => navigate("/movies")}>
                        ← Back to Movies
                    </button>
                    <h2 className="section-title">{industryName} Movies</h2>
                    <p className="section-subtitle">Discover top {industryName.toLowerCase()} films</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="section-tabs">
                {Object.entries(SECTIONS).map(([key, section]) => (
                    <button
                        key={key}
                        className={`tab-btn ${activeSection === key ? "active" : ""}`}
                        onClick={() => {
                            setActiveSection(key);
                            sessionStorage.setItem(`industry_tab_${id}`, key);
                            setPage(1);
                            setMovies([]);
                        }}
                    >
                        {section.name}
                    </button>
                ))}
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
                                <article className="media-card" key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)}>
                                    <div className="media-posterWrap">
                                        {poster ? (
                                            <img className="media-poster" src={poster} alt={title} loading="lazy" />
                                        ) : (
                                            <div className="media-noPoster">No Poster</div>
                                        )}

                                        {/* Standard badges: Rank/Lang on Left, Rating on Right */}
                                        {index < 3 ? (
                                            <div className="top-ranked">#{index + 1}</div>
                                        ) : (
                                            <div className="movie-lang">{lang || "EN"}</div>
                                        )}

                                        <div className="movie-rating">
                                            ⭐ {rating}
                                        </div>

                                        {/* hover overlay */}
                                        <div className="media-overlay">
                                            <p className="media-overview">{overview}</p>
                                            <div className="media-stats">
                                                <span>Votes: {votes}</span>
                                                <span>Pop: {Math.round(popularity)}</span>
                                            </div>
                                            <button className="media-cta" type="button">View details</button>
                                            <button
                                                className={`media-cta ${isInWatchLater(movie.id) ? "active" : ""}`}
                                                type="button"
                                                onClick={(e) => toggleWatchLater(e, movie)}
                                            >
                                                {isInWatchLater(movie.id) ? "✓ Added" : "+ Watch Later"}
                                            </button>
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
                    <div className="pagination-container">
                        <button
                            className="media-cta"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            ← Prev
                        </button>
                        <span className="pagination-text">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            className="media-cta"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}
