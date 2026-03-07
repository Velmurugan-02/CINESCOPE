import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie } from "../utils/cookieUtils";
import { Heart, Trash2 } from "lucide-react";
import "./Favourites.css";

export default function Favourites() {
    const navigate = useNavigate();
    const [movieList, setMovieList] = useState([]);
    const [tvList, setTvList] = useState([]);

    useEffect(() => {
        const savedMovies = JSON.parse(getCookie("favourite_movies") || "[]");
        const savedTv = JSON.parse(getCookie("favourite_tv") || "[]");
        setMovieList(savedMovies);
        setTvList(savedTv);
    }, []);

    const removeMovie = (id) => {
        const updated = movieList.filter((m) => m.id !== id);
        setMovieList(updated);
        setCookie("favourite_movies", JSON.stringify(updated), 30);
    };

    const removeTv = (id) => {
        const updated = tvList.filter((m) => m.id !== id);
        setTvList(updated);
        setCookie("favourite_tv", JSON.stringify(updated), 30);
    };

    const renderCard = (item, type) => {
        const title = item.title || item.name || "Untitled";
        const poster = item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : null;
        const rating = item.vote_average ? item.vote_average.toFixed(1) : "NA";

        return (
            <article className="fav-card" key={item.id}>
                <div
                    className="fav-poster-container"
                    onClick={() => navigate(`/${type}/${item.id}`)}
                >
                    {poster ? (
                        <img src={poster} alt={title} className="fav-poster" />
                    ) : (
                        <div className="fav-no-poster">No Poster Available</div>
                    )}
                    <div className="fav-item-rating">⭐ {rating}</div>
                </div>
                <div className="fav-info">
                    <h3 className="fav-item-title">{title}</h3>
                    <button
                        className="fav-remove-btn"
                        onClick={() => type === "movie" ? removeMovie(item.id) : removeTv(item.id)}
                        title="Remove from Favourites"
                    >
                        <Heart size={16} fill="var(--primary)" color="var(--primary)" />
                        <span>Remove</span>
                    </button>
                </div>
            </article>
        );
    };

    return (
        <section className="fav-page">
            <header className="fav-header">
                <h1 className="fav-page-title">My Favourites</h1>
                <p className="fav-page-subtitle">Your personally curated collection of cinematic gems</p>
            </header>

            <div className="fav-content">
                {/* Movies Section */}
                <div className="fav-section">
                    <h2 className="section-label">Favourite Movies</h2>
                    {movieList.length > 0 ? (
                        <div className="fav-grid">
                            {movieList.map(item => renderCard(item, "movie"))}
                        </div>
                    ) : (
                        <p className="empty-message">No movies favourited yet. Add some heart to your collection!</p>
                    )}
                </div>

                {/* TV Shows Section */}
                <div className="fav-section">
                    <h2 className="section-label">Favourite TV Shows</h2>
                    {tvList.length > 0 ? (
                        <div className="fav-grid">
                            {tvList.map(item => renderCard(item, "tv"))}
                        </div>
                    ) : (
                        <p className="empty-message">No TV shows favourited yet.</p>
                    )}
                </div>
            </div>

            {movieList.length === 0 && tvList.length === 0 && (
                <div className="fav-empty-state">
                    <div className="empty-icon-wrap">
                        <Heart size={60} color="var(--primary)" opacity={0.3} />
                    </div>
                    <button className="browse-btn" onClick={() => navigate("/")}>
                        Explore Trending Content
                    </button>
                </div>
            )}
        </section>
    );
}
