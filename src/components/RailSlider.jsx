import { useRef, useState, useEffect } from "react";
import "./RailSlider.css";

export default function RailSlider({ title, items, renderItem, countText, className = "" }) {
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

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
    }, [items]);

    if (!items || items.length === 0) return null;

    return (
        <section className={`rail-slider-section ${className}`}>
            <div className="rail-header">
                <div className="rail-header-left">
                    {title && <h3 className="rail-title">{title}</h3>}
                    {countText && <div className="rail-count">{countText}</div>}
                </div>

                <div className="rail-controls">
                    <button
                        className="rail-nav-btn head-btn"
                        onClick={() => handleScroll("left")}
                        disabled={!showLeftArrow}
                        aria-label="Scroll left"
                    >
                        ‹
                    </button>
                    <button
                        className="rail-nav-btn head-btn"
                        onClick={() => handleScroll("right")}
                        disabled={!showRightArrow}
                        aria-label="Scroll right"
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="rail-relative-container">
                <div className="rail-scroll-container" ref={scrollContainerRef}>
                    {items.map((item, index) => renderItem(item, index))}
                </div>
            </div>
        </section>
    );
}
