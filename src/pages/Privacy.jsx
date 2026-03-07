import { useNavigate } from "react-router-dom";
import "./Movies.css";

const Privacy = () => {
    const navigate = useNavigate();

    return (
        <section className="home-section page-container">
            <div className="section-header">
                <button className="back-link" onClick={() => navigate("/")}>
                    ← Back to Home
                </button>
                <h2 className="section-title">Privacy Policy</h2>
            </div>
            <div style={{ maxWidth: "800px", marginTop: "2rem", color: "var(--text-muted)", lineHeight: "1.8" }}>
                <p>At CineScope, we value your privacy. This policy explains how we handle your information.</p>
                <h3 style={{ color: "var(--text)", marginTop: "2rem" }}>1. Data Collection</h3>
                <p>We do not collect personal data on our servers. All information like your "Watchlater" list is stored locally in your browser's cookies.</p>
                <h3 style={{ color: "var(--text)", marginTop: "1rem" }}>2. Third Party Services</h3>
                <p>We use the TMDB API to provide movie information. They may collect anonymous data as per their own privacy policy.</p>
            </div>
        </section>
    );
};

export default Privacy;
