import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPersonDetails, getPersonImages, getPersonCombinedCredits } from "../api/tmdb";
import { Share2, Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import GlassSpinner from "../components/GlassSpinner";
import "./PersonDetails.css";

const PersonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [images, setImages] = useState([]);
    const [knownFor, setKnownFor] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Gallery State
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const [details, imagesData, creditsData] = await Promise.all([
                    getPersonDetails(id),
                    getPersonImages(id),
                    getPersonCombinedCredits(id)
                ]);

                setPerson(details);
                setImages(imagesData.profiles || []);

                // Sort by popularity and take top 8
                const sortedCredits = (creditsData.cast || [])
                    .sort((a, b) => b.popularity - a.popularity)
                    .slice(0, 8);
                setKnownFor(sortedCredits);

            } catch (err) {
                setError("Failed to load profile details.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    const handleShare = async () => {
        const shareData = {
            title: person.name,
            text: `Check out ${person.name} on CineScope!`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Profile link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImgIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (loading) return <GlassSpinner fullPage message="Fetching Biography" />;
    if (error) return <div className="error-container"><p>{error}</p></div>;

    return (
        <div className="movie-details-page person-details-page">
            {/* Backdrop */}
            <div
                className="movie-backdrop"
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${person.profile_path})` }}
            >
                <div className="backdrop-overlay"></div>
            </div>

            <div className="movie-content-container">
                <button onClick={() => navigate(-1)} className="btn-back">
                    <span className="back-icon">←</span> Back
                </button>

                <div className="movie-main-info">
                    {/* Poster Section */}
                    <div className="movie-poster-section">
                        <img
                            className="movie-poster"
                            src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                            alt={person.name}
                        />

                        <div className="movie-actions">
                            <button
                                className="btn-action primary"
                                onClick={() => setIsGalleryOpen(true)}
                                disabled={images.length === 0}
                            >
                                <ImageIcon size={18} /> View Gallery ({images.length})
                            </button>
                            <button className="btn-action secondary" onClick={handleShare}>
                                <Share2 size={18} /> Share Profile
                            </button>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="movie-details-section">
                        <h1 className="movie-title">{person.name}</h1>
                        <p className="movie-tagline">{person.known_for_department}</p>

                        <div className="movie-meta-chips">
                            <span className="meta-chip rating">Pop: {person.popularity?.toFixed(0)}</span>
                            {person.birthday && <span className="meta-chip birthday">{person.birthday}</span>}
                            {person.deathday && <span className="meta-chip deathday">{person.deathday}</span>}
                            <span className="meta-chip status">
                                {person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : "Non-binary"}
                            </span>
                        </div>

                        <div className="movie-overview-section">
                            <h3>Biography</h3>
                            <p className="movie-overview">{person.biography || "No biography available."}</p>
                        </div>

                        <div className="movie-extra-info">
                            <div className="info-item">
                                <span className="info-label">Born In</span>
                                <span className="info-value">{person.place_of_birth || "Unknown"}</span>
                            </div>
                            {person.also_known_as?.length > 0 && (
                                <div className="info-item">
                                    <span className="info-label">Also Known As</span>
                                    <span className="info-value">{person.also_known_as.slice(0, 2).join(", ")}</span>
                                </div>
                            )}
                        </div>

                        {/* Known For Section */}
                        {knownFor.length > 0 && (
                            <div className="known-for-section">
                                <h3>Known For</h3>
                                <div className="known-for-grid">
                                    {knownFor.map((item) => (
                                        <div
                                            key={`${item.media_type}-${item.id}`}
                                            className="known-item"
                                            onClick={() => navigate(`/${item.media_type}/${item.id}`)}
                                        >
                                            <div className="known-poster">
                                                {item.poster_path ? (
                                                    <img src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name} />
                                                ) : (
                                                    <div className="no-poster-mini">No Image</div>
                                                )}
                                            </div>
                                            <span className="known-title">{item.title || item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Gallery Modal */}
            {isGalleryOpen && images.length > 0 && (
                <div className="gallery-modal" onClick={() => setIsGalleryOpen(false)}>
                    <button className="gallery-close" onClick={() => setIsGalleryOpen(false)}>
                        <X size={30} />
                    </button>

                    <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
                        <button className="gallery-nav prev" onClick={prevImage}>
                            <ChevronLeft size={40} />
                        </button>

                        <div className="gallery-image-wrapper">
                            <img
                                src={`https://image.tmdb.org/t/p/original${images[currentImgIndex].file_path}`}
                                alt={`${person.name} gallery ${currentImgIndex}`}
                            />
                            <div className="gallery-counter">
                                {currentImgIndex + 1} / {images.length}
                            </div>
                        </div>

                        <button className="gallery-nav next" onClick={nextImage}>
                            <ChevronRight size={40} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonDetails;
