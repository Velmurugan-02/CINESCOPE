import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tmdbRequest } from "../../api/tmdb";
import { getCookie, setCookie } from "../../utils/cookieUtils";
import RailSlider from "../RailSlider";
import "./Recommendations.css";

export default function Recommendations({ id, type = "movie" }) {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [watchlater, setWatchlater] = useState([]);

    useEffect(() => {
        if (!id) return;

        const cookieName = type === "movie" ? "watchlater_movies" : "watchlater_tv";
        setWatchlater(JSON.parse(getCookie(cookieName) || "[]"));

        const fetchRecs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const path = type === "movie"
                    ? `/movie/${id}/recommendations`
                    : `/tv/${id}/recommendations`;
                const res = await tmdbRequest(path);
                setResults(res?.results || []);
            } catch (err) {
                setError(err.message || "Failed to load recommendations.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecs();
    }, [id, type]);

    const toggleWatchLater = (e, item) => {
        e.stopPropagation();
        const cookieName = type === "movie" ? "watchlater_movies" : "watchlater_tv";
        const exists = watchlater.find((m) => m.id === item.id);
        const updated = exists
            ? watchlater.filter((m) => m.id !== item.id)
            : [...watchlater, item];
        setWatchlater(updated);
        setCookie(cookieName, JSON.stringify(updated), 7);
    };

    const isInWatchLater = (itemId) => watchlater.some((m) => m.id === itemId);

    if (isLoading) {
        return (
            <div className="rec-loading">
                <div className="rec-loading-spinner" />
                <span>Finding recommendations...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rec-error">
                <p>⚠️ Could not load recommendations.</p>
                <p className="rec-error-detail">{error}</p>
            </div>
        );
    }

    if (!results.length) {
        return (
            <div className="rec-empty">
                <p>No recommendations available for this title.</p>
            </div>
        );
    }

    return (
        <RailSlider
            title="You May Also Like"
            countText={`${results.length} titles`}
            items={results}
            className="recommendations-section"
            renderItem={(item) => {
                const title = item.title || item.name || item.original_title || "Untitled";
                const date = item.release_date || item.first_air_date || "";
                const year = date ? date.slice(0, 4) : "----";
                const rating = typeof item.vote_average === "number"
                    ? item.vote_average.toFixed(1)
                    : "N/A";
                const poster = item.poster_path
                    ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
                    : null;
                const inWL = isInWatchLater(item.id);

                return (
                    <article
                        key={item.id}
                        className="media-card rec-card"
                        onClick={() => navigate(`/${type}/${item.id}`)}
                    >
                        <div className="media-posterWrap">
                            {poster ? (
                                <img
                                    className="media-poster"
                                    src={poster}
                                    alt={title}
                                    loading="lazy"
                                />
                            ) : (
                                <div className="media-noPoster">
                                    <span>{title.charAt(0)}</span>
                                </div>
                            )}

                            <span className="movie-lang">
                                {(item.original_language || "EN").toUpperCase()}
                            </span>
                            <span className="movie-rating">⭐ {rating}</span>

                            <div className="media-overlay">
                                <p className="media-overview">
                                    {item.overview || "No overview available."}
                                </p>
                                <div className="overlay-actions">
                                    <button
                                        className="media-cta"
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/${type}/${item.id}`);
                                        }}
                                    >
                                        View
                                    </button>
                                    <button
                                        className={`media-cta ${inWL ? "active" : ""}`}
                                        type="button"
                                        onClick={(e) => toggleWatchLater(e, item)}
                                        title={inWL ? "Remove from Watch Later" : "Add to Watch Later"}
                                    >
                                        {inWL ? "✓" : "+"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="media-info">
                            <h3 className="media-title" title={title}>{title}</h3>
                            <p className="media-meta">{year} · ⭐ {rating}</p>
                        </div>
                    </article>
                );
            }}
        />
    );
}
