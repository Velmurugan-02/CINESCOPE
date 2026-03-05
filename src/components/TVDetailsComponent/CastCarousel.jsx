import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import "./CastCarousel.css";

export default function CastCarousel({ cast, title }) {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleScroll = (direction) => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollAmount = clientWidth * 0.8;
            const targetScroll = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: targetScroll,
                behavior: "smooth"
            });
        }
    };

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", checkScrollButtons);
            checkScrollButtons();
            window.addEventListener("resize", checkScrollButtons);
        }
        return () => {
            if (container) container.removeEventListener("scroll", checkScrollButtons);
            window.removeEventListener("resize", checkScrollButtons);
        };
    }, [cast]);

    if (!cast || cast.length === 0) return null;

    return (
        <section className="cast-carousel-section">
            <div className="section-header">
                <h3 className="section-title">{title || "Top Cast"}</h3>
                <div className="carousel-count">{cast.length} Members</div>
            </div>

            <div className="carousel-relative-container">
                {showLeftArrow && (
                    <button
                        className="carousel-nav-btn left"
                        onClick={() => handleScroll("left")}
                        aria-label="Scroll left"
                    >
                        ‹
                    </button>
                )}

                <div className="cast-scroll-container" ref={scrollContainerRef}>
                    {cast.map((person) => (
                        <div
                            key={person.id}
                            className="cast-item"
                            onClick={() => navigate(`/person/${person.id}`)}
                        >
                            <div className="cast-avatar-wrapper">
                                {person.profile_path ? (
                                    <img
                                        className="cast-avatar"
                                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                                        alt={person.name}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="cast-avatar-placeholder">
                                        {person.name.charAt(0)}
                                    </div>
                                )}
                                <div className="cast-avatar-overlay">
                                    <span className="view-profile-hint">View Profile</span>
                                </div>
                            </div>
                            <div className="cast-info">
                                <h4 className="cast-name">{person.name}</h4>
                                <p className="cast-character">{person.character}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {showRightArrow && (
                    <button
                        className="carousel-nav-btn right"
                        onClick={() => handleScroll("right")}
                        aria-label="Scroll right"
                    >
                        ›
                    </button>
                )}
            </div>
        </section>
    );
}
