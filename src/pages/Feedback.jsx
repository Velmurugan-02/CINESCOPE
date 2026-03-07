import { useNavigate } from "react-router-dom";
import { MessageSquare, Send } from "lucide-react";
import "./Movies.css";

const Feedback = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for your feedback! We will review it shortly.");
    };

    return (
        <section className="home-section page-container">
            <div className="section-header">
                <button className="back-link" onClick={() => navigate("/")}>
                    ← Back to Home
                </button>
                <h2 className="section-title">Feedback</h2>
                <p className="section-subtitle">Help us improve your experience</p>
            </div>

            <div style={{ maxWidth: "600px", marginTop: "2rem" }}>
                <div style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    padding: "2.5rem",
                    borderRadius: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(12px)"
                }}>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div>
                            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.5rem", fontWeight: "500" }}>Name</label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                style={{
                                    width: "100%", padding: "1rem", borderRadius: "12px",
                                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                    color: "white", outline: "none"
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.5rem", fontWeight: "500" }}>Email</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                style={{
                                    width: "100%", padding: "1rem", borderRadius: "12px",
                                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                    color: "white", outline: "none"
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.5rem", fontWeight: "500" }}>Message</label>
                            <textarea
                                rows="5"
                                placeholder="Tell us what you think..."
                                style={{
                                    width: "100%", padding: "1rem", borderRadius: "12px",
                                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                    color: "white", outline: "none", resize: "none"
                                }}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" style={{
                            padding: "1rem", background: "var(--primary)", color: "white",
                            borderRadius: "12px", border: "none", fontWeight: "700", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.7rem",
                            transition: "transform 0.2s ease"
                        }}>
                            <Send size={18} /> Send Feedback
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Feedback;
