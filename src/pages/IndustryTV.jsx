import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tmdbRequest } from "../api/tmdb";
import { getCookie, setCookie } from "../utils/cookieUtils";
import "./Movies.css";

const INDUSTRIES = {
    bollywood: { name: "Bollywood", params: { with_original_language: "hi" } },
    kollywood: { name: "Kollywood", params: { with_original_language: "ta" } },
    hollywood: { name: "Hollywood", params: { with_original_language: "en", region: "US" } },
    tollywood: { name: "Tollywood", params: { with_original_language: "te" } },
    mollywood: { name: "Mollywood", params: { with_original_language: "ml" } },
    sandalwood: { name: "Sandalwood", params: { with_original_language: "kn" } },
    k_drama: { name: "Korean", params: { with_original_language: "ko" } },
    anime: { name: "Japanese", params: { with_original_language: "ja" } },
    spanish: { name: "Spanish", params: { with_original_language: "es" } },
    french: { name: "French", params: { with_original_language: "fr" } }
};

const formatVoteAverage = (v) => (typeof v === "number" ? v.toFixed(1) : "NA");
const getYear = (dateStr) => (dateStr ? dateStr.slice(0, 4) : "----");

export default function IndustryTV() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentIndustry = INDUSTRIES[id.toLowerCase()] || { name: "Unknown", params: {} };

    const SECTIONS = {
        popular: { name: "Popular", params: { sort_by: "popularity.desc" } },
        new_release: {
            name: "New Arrivals",
            params: {
                "first_air_date.gte": "2024-01-01",
                "first_air_date.lte": new Date().toISOString().split('T')[0]
            }
        },
        top_rated: {
            name: "Top Rated",
            params: {
                sort_by: "vote_average.desc",
                "vote_count.gte": 100,
            }
        }
    };

    const [tvshows, setTVShows] = useState([]);
    const [watchlater, setWatchlater] = useState([]);
    const [industryName, setIndustryName] = useState("Industry");
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [activeSection, setActiveSection] = useState(() => {
        return sessionStorage.getItem(`industry_tab_${id}`) || "popular";
    });
    const [sectionTVShows, setSectionTVShows] = useState([]);
    const [sectionLoading, setSectionLoading] = useState(false);

    useEffect(() => {
        if (currentIndustry && currentIndustry.name !== "Unknown") {
            setIndustryName(currentIndustry.name);
        }
    }, [id, currentIndustry]);

    useEffect(() => {
        const fetchIndustryTVShows = async () => {
            try {
                setIsLoading(true);
                setIsError(false);
                const res = await tmdbRequest("/discover/tv", {
                    ...currentIndustry.params,
                    ...SECTIONS[activeSection].params,
                    include_adult: false,
                    page,
                });
                setTVShows(res?.results || []);
                setTotalPages(Math.min(res?.total_pages || 1, 500));

                const saved = JSON.parse(getCookie("watchlater_tv_shows") || "[]");
                setWatchlater(saved);
            } catch (err) {
                console.error("Error fetching industry movies:", err);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchIndustryTVShows();
    }, [id, page, activeSection]);

    const toggleWatchLater = (e, tvshow) => {
        e.stopPropagation();
        let updatedList;
        const exists = watchlater.find((m) => m.id === tvshow.id);

        if (exists) {
            updatedList = watchlater.filter((m) => m.id !== tvshow.id);
        } else {
            updatedList = [...watchlater, tvshow];
        }

        setWatchlater(updatedList);
        setCookie("watchlater_tv_shows", JSON.stringify(updatedList), 7);
    };

    const isInWatchLater = (tvshowId) => watchlater.some((m) => m.id === tvshowId);

    return (
        <section className="home-section">
            {/* Header */}
            <div className="popular-movies-header">
                <div>
                    <button className="back-link" onClick={() => navigate("/tv")}>
                        ← Back to TV
                    </button>
                    <h2 className="section-title">{industryName} TV Shows</h2>
                    <p className="section-subtitle">Discover top {industryName.toLowerCase()} TV Shows</p>
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
                            setTVShows([]);
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
                    <p>Loading TV Shows...</p>
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
                        {tvshows.map((tvshow, index) => {
                            const title = tvshow.name || tvshow.original_name || "Untitled";
                            const year = getYear(tvshow.first_air_date);
                            const lang = (tvshow.original_language || "").toUpperCase();
                            const rating = formatVoteAverage(tvshow.vote_average);
                            const votes = tvshow.vote_count ?? 0;
                            const popularity = tvshow.popularity ?? 0;
                            const overview = tvshow.overview || "No overview available.";
                            const poster = tvshow.poster_path
                                ? `https://image.tmdb.org/t/p/w300${tvshow.poster_path}`
                                : null;

                            return (
                                <article className="media-card" key={tvshow.id} onClick={() => navigate(`/tv/${tvshow.id}`)}>
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
                                                className={`media-cta ${isInWatchLater(tvshow.id) ? "active" : ""}`}
                                                type="button"
                                                onClick={(e) => toggleWatchLater(e, tvshow)}
                                            >
                                                {isInWatchLater(tvshow.id) ? "✓ Added" : "+ Watch Later"}
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
