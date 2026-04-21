import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Trash2, Film, Tv, User, RotateCcw } from "lucide-react";
import { getHistory, removeFromHistory, clearHistory, formatViewedAt } from "../utils/historyUtils";
import "./History.css";

const TYPE_CONFIG = {
    movie: { label: "Movies", singular: "Movie", Icon: Film, route: "movie", color: "#ffb86c" },
    tv: { label: "TV Shows", singular: "TV Show", Icon: Tv, route: "tv", color: "#b28cff" },
    person: { label: "People", singular: "Person", Icon: User, route: "person", color: "#38c7ff" },
};

export default function History() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const handleRemove = (id, type) => {
        const updated = removeFromHistory(id, type);
        setHistory(updated);
    };

    const handleClearAll = () => {
        clearHistory();
        setHistory([]);
    };

    const grouped = {
        movie: history.filter((h) => h.type === "movie"),
        tv: history.filter((h) => h.type === "tv"),
        person: history.filter((h) => h.type === "person"),
    };

    const tabs = [
        { key: "all", label: "All", count: history.length },
        { key: "movie", label: "Movies", count: grouped.movie.length },
        { key: "tv", label: "TV Shows", count: grouped.tv.length },
        { key: "person", label: "People", count: grouped.person.length },
    ];

    const filtered =
        activeTab === "all" ? history : grouped[activeTab] || [];

    const renderCard = (item) => {
        const config = TYPE_CONFIG[item.type];
        const title = item.title || item.name || "Untitled";
        const poster = item.poster_path
            ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
            : null;

        return (
            <article className="hist-card" key={`${item.type}-${item.id}`}>
                <div
                    className="hist-poster-wrap"
                    onClick={() => navigate(`/${config.route}/${item.id}`)}
                >
                    {poster ? (
                        <img src={poster} alt={title} className="hist-poster" loading="lazy" />
                    ) : (
                        <div className="hist-no-poster">
                            <config.Icon size={32} opacity={0.4} />
                        </div>
                    )}

                    {/* Type badge */}
                    <span
                        className="hist-type-badge"
                        style={{ color: config.color, borderColor: config.color + "44", background: config.color + "18" }}
                    >
                        <config.Icon size={11} />
                        {config.singular}
                    </span>

                    {/* Rating badge */}
                    {item.vote_average && item.type !== "person" && (
                        <span className="hist-rating">⭐ {Number(item.vote_average).toFixed(1)}</span>
                    )}

                    {/* Hover overlay */}
                    <div className="hist-poster-overlay">
                        <span className="hist-view-btn">View →</span>
                    </div>
                </div>

                <div className="hist-info">
                    <h3 className="hist-title">{title}</h3>
                    <p className="hist-time">
                        <Clock size={11} />
                        {formatViewedAt(item.viewedAt)}
                    </p>
                    <button
                        className="hist-remove-btn"
                        onClick={() => handleRemove(item.id, item.type)}
                        title="Remove from history"
                    >
                        <Trash2 size={13} />
                        Remove
                    </button>
                </div>
            </article>
        );
    };

    return (
        <section className="hist-page">
            {/* Header */}
            <header className="hist-header">
                <div className="hist-header-left">
                    <div className="hist-header-icon">
                        <Clock size={28} />
                    </div>
                    <div>
                        <h1 className="hist-page-title">Watch History</h1>
                        <p className="hist-page-subtitle">
                            Your recently viewed movies, shows &amp; people
                        </p>
                    </div>
                </div>
                {history.length > 0 && (
                    <button className="hist-clear-btn" onClick={handleClearAll}>
                        <RotateCcw size={15} />
                        Clear All
                    </button>
                )}
            </header>

            {/* Tabs */}
            {history.length > 0 && (
                <div className="hist-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={`hist-tab${activeTab === tab.key ? " active" : ""}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className="hist-tab-count">{tab.count}</span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Content */}
            <div className="hist-content">
                {filtered.length > 0 ? (
                    <div className="hist-grid">
                        {filtered.map((item) => renderCard(item))}
                    </div>
                ) : (
                    <div className="hist-empty">
                        <div className="hist-empty-icon">
                            <Clock size={60} opacity={0.15} />
                        </div>
                        <h2 className="hist-empty-title">No history yet</h2>
                        <p className="hist-empty-text">
                            Movies, TV shows, and people you view will appear here.
                        </p>
                        <button className="browse-btn" onClick={() => navigate("/")}>
                            Start Exploring
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
