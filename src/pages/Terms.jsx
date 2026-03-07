import { useNavigate } from "react-router-dom";
import "./Movies.css";

const Terms = () => {
    const navigate = useNavigate();

    return (
        <section className="home-section page-container">
            <div className="section-header">
                <button className="back-link" onClick={() => navigate("/")}>
                    ← Back to Home
                </button>
                <h2 className="section-title">Terms of Use</h2>
            </div>
            <div style={{ maxWidth: "800px", marginTop: "2rem", color: "var(--text-muted)", lineHeight: "1.8" }}>
                <p>By using CineScope, you agree to the following terms:</p>
                <h3 style={{ color: "var(--text)", marginTop: "2rem" }}>1. Usage</h3>
                <p>CineScope is for personal, non-commercial use only. You may not scrape our content or use it for automated purposes.</p>
                <h3 style={{ color: "var(--text)", marginTop: "1rem" }}>2. Content</h3>
                <p>All movie and TV data is owned by TMDB and their respective copyright holders. We do not provide streaming of copyrighted material.</p>
            </div>
        </section>
    );
};

export default Terms;
