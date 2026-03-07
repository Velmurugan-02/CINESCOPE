import { useNavigate } from "react-router-dom";
import { Film, Globe, Heart } from "lucide-react";
import "./Movies.css"; // Reuse standardized margins and styles

const About = () => {
    const navigate = useNavigate();

    return (
        <section className="home-section page-container">
            <div className="section-header">
                <button className="back-link" onClick={() => navigate("/")}>
                    ← Back to Home
                </button>
                <h2 className="section-title">About CineScope</h2>
                <p className="section-subtitle">Your ultimate cinematic companion</p>
            </div>

            <div style={{
                maxWidth: "800px",
                margin: "2rem 0",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "2rem",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)"
            }}>
                <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>Our Mission</h3>
                <p style={{ color: "var(--text-muted)", lineHeight: "1.7", marginBottom: "2rem" }}>
                    CineScope was built for movie lovers, by movie lover. Our goal is to provide a seamless,
                    beautiful, and comprehensive platform where you can discover new films, TV shows, and
                    the talented people who bring them to life across the globe.
                </p>

                <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>Technology Stack</h3>
                <ul style={{ listStyle: "none", padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <li style={{ color: "var(--text)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Film size={18} color="var(--primary)" /> React.js
                    </li>
                    <li style={{ color: "var(--text)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Globe size={18} color="var(--primary)" /> TMDB API
                    </li>
                    <li style={{ color: "var(--text)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Heart size={18} color="var(--primary)" /> Lucide Icons
                    </li>
                    <li style={{ color: "var(--text)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "1.2rem" }}>🎨</span> Glassmorphism UI
                    </li>
                </ul>

                <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        CineScope is a passion project dedicated to showcasing the power of modern web development
                        and the incredible database provided by The Movie Database (TMDB).
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
