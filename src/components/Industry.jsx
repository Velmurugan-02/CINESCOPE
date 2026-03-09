import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Industry.css";

const INDUSTRIES = [
    { id: "kollywood", name: "Kollywood" },
    { id: "bollywood", name: "Bollywood" },
    { id: "hollywood", name: "Hollywood" },
    { id: "tollywood", name: "Tollywood" },
    { id: "mollywood", name: "Mollywood" },
    { id: "sandalwood", name: "Sandalwood" },
    { id: "k_drama", name: "Korean" },
    { id: "anime", name: "Japanese" },
    { id: "spanish", name: "Spanish" },
    { id: "french", name: "French" }
];

export default function Industry({ isTV = false }) {
    const navigate = useNavigate();
    const [showAll, setShowAll] = useState(false);

    const displayedIndustries = showAll ? INDUSTRIES : INDUSTRIES.slice(0, 6);

    return (
        <section className="industry-section-main">
            <div className="section-header">
                <div className="header-left">
                    <h2 className="section-title">Industries</h2>
                    <span className="section-badge">Regional</span>
                </div>
                <p className="section-subtitle">Explore {isTV ? "TV shows" : "movies"} from your favorite industry</p>
            </div>

            <div className="genre-grid">
                {displayedIndustries.map((item) => (
                    <button
                        key={item.id}
                        className="genre-pill"
                        onClick={() => navigate(`/industry/${isTV ? "tv/" : ""}${item.id}`)}
                    >
                        <span className="genre-name">{item.name}</span>
                    </button>
                ))}
            </div>

            {INDUSTRIES.length > 6 && (
                <div className="more-btn-container">
                    <button
                        className="more-genres-btn"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? "Show Less" : `+ More (${INDUSTRIES.length - 6})`}
                    </button>
                </div>
            )}
        </section>
    );
}
