import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTVDetails, getTVVideos, getTVCredits, getTVWatchProviders } from "../api/tmdb";
import GlassSpinner from "../components/GlassSpinner";
import TrailerModal from "../components/MoviesDetailsComponent/TrailerModal";
import CastCarousel from "../components/TVDetailsComponent/CastCarousel";
import WatchProviders from "../components/MoviesDetailsComponent/WatchProviders";
import "./TVDetails.css";

const TVDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tv, setTv] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerKey, setTrailerKey] = useState(null);
    const [cast, setCast] = useState([]);
    const [watchProviders, setWatchProviders] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const [data, creditData, providerData] = await Promise.all([
                    getTVDetails(id),
                    getTVCredits(id),
                    getTVWatchProviders(id)
                ]);
                setTv(data);
                setCast(creditData.cast);
                setWatchProviders(providerData);
            } catch (err) {
                setError("Failed to load series details.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    const handleWatchTrailer = async () => {
        try {
            const videoData = await getTVVideos(id);
            const trailer = videoData.results.find(
                (vid) => vid.type === "Trailer" && vid.site === "YouTube"
            ) || videoData.results[0];

            if (trailer) {
                setTrailerKey(trailer.key);
            }
            setShowTrailer(true);
        } catch (err) {
            console.error("Failed to fetch trailer:", err);
            setShowTrailer(true);
        }
    };

    if (loading) return <GlassSpinner fullPage message="Fetching Series Details" />;
    if (error) return <div className="error-container"><p>{error}</p></div>;

    return (
        <div className="movie-details-page tv-details-page">
            <div
                className="movie-backdrop"
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${tv.backdrop_path})` }}
            >
                <div className="backdrop-overlay"></div>
            </div>

            <div className="movie-content-container">
                <button
                    onClick={() => navigate(-1)}
                    className="btn-back"
                >
                    <span className="back-icon">←</span> Back
                </button>

                <div className="movie-main-info">
                    <div className="movie-poster-section">
                        <img
                            className="movie-poster"
                            src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                            alt={tv.name}
                        />

                        <div className="movie-actions">
                            <button className="btn-action primary" onClick={handleWatchTrailer}>
                                Watch Trailer
                            </button>
                            <button className="btn-action secondary">+ Watchlist</button>
                        </div>
                    </div>

                    <div className="movie-details-section">
                        <h1 className="movie-title">
                            {tv.name} <span className="release-year">({tv.first_air_date?.slice(0, 4)})</span>
                        </h1>

                        <p className="movie-tagline">{tv.tagline}</p>

                        <div className="movie-meta-chips">
                            <span className="meta-chip rating">⭐ {tv.vote_average?.toFixed(1)}</span>
                            <span className="meta-chip seasons">{tv.number_of_seasons} Seasons</span>
                            <span className="meta-chip episodes">{tv.number_of_episodes} Episodes</span>
                            <span className="meta-chip status">{tv.status}</span>
                        </div>

                        <div className="movie-overview-section">
                            <h3>Overview</h3>
                            <p className="movie-overview">{tv.overview}</p>
                        </div>

                        <div className="movie-extra-info">
                            <div className="info-item">
                                <span className="info-label">Type</span>
                                <span className="info-value">{tv.type}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">First Aired</span>
                                <span className="info-value">{tv.first_air_date}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Networks</span>
                                <span className="info-value">{tv.networks?.map(n => n.name).join(", ")}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Language</span>
                                <span className="info-value">{tv.original_language?.toUpperCase()}</span>
                            </div>
                        </div>
                        <WatchProviders providers={watchProviders} />
                    </div>
                </div>
            </div>

            <TrailerModal
                isOpen={showTrailer}
                onClose={() => setShowTrailer(false)}
                trailerKey={trailerKey}
                title={tv.name}
            />
            <CastCarousel cast={cast} title="Series Cast" />
        </div>
    );
};

export default TVDetails;
